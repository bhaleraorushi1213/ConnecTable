import { getReceiverSocketId, io } from "../lib/socket.js";
import { createSystemMessage } from "../lib/systemMessage.js";

import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
export const getChat = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: req.user._id } } },
      ],
    }).populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.senderId",
      select: "fullName profilePicture email",
    });

    if (isChat.length > 0) {
      return res.status(200).json(isChat[0]);
    }

    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    res.status(200).json(fullChat);

  } catch (error) {
    console.log("Error in getChat controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  };
};

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
export const getAllChats = async (req, res) => {
  try {
    const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "senderId",
          select: "fullName profilePicture email",
        },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(results);
  } catch (error) {
    console.log("Error in getAllChats controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Create New Group Chat
//@route           POST /api/chat/group/create
//@access          Protected
export const createGroupChat = async (req, res) => {
  const { users: rawUsers, chatName, profilePicture } = req.body;

  try {
    if (!chatName || !rawUsers) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let newProfilePicture;
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      newProfilePicture = uploadResponse.secure_url;
    }

    const users = typeof rawUsers === "string" ? JSON.parse(rawUsers) : rawUsers;

    if (users.length < 2) {
      return res.status(400).json({ message: "At least 2 users are required for group chat" });
    }

    const allMemberIds = [...users, req.user._id.toString()];

    const groupChat = await Chat.create({
      chatName,
      users: [...users, req.user],
      isGroupChat: true,
      groupAdmin: req.user._id,
      profilePicture: newProfilePicture
    })

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    await createSystemMessage({
      chatId: groupChat._id,
      type: "group_created",
      text: `${req.user.fullName} created the group "${chatName}"`,
      meta: {
        actorId: req.user._id,
        actorName: req.user.fullName,
        chatName,
      },
      memberIds: allMemberIds,
    });

    fullGroupChat.users.forEach((member) => {
      const memberSocketId = getReceiverSocketId(member._id.toString());
      if (memberSocketId) {
        io.to(memberSocketId).emit("addedToGroup", fullGroupChat);
      }
    });

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log("Error in createGroupChat controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Update Group
// @route   PUT /api/chat/group/update
// @access  Protected
export const updateGroupChat = async (req, res) => {
  const { chatId, chatName, profilePicture } = req.body;

  try {
    if (!chatId) {
      return res.status(400).json({ message: "chatId is required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isAdmin =
      chat.groupAdmin.toString() === req.user._id.toString();

    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can update group" });
    }

    const updates = {};
    const changedFields = [];

    if (chatName && chatName !== chat.chatName) {
      updates.chatName = chatName;
      changedFields.push("name");
    };
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      updates.profilePicture = uploadResponse.secure_url;
      changedFields.push("photo");
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const memberIds = chat.users.map((u) => u.toString());

    if (changedFields.includes("name")) {
      await createSystemMessage({
        chatId,
        type: "group_name_updated",
        text: `${req.user.fullName} changed the group name to "${chatName}"`,
        meta: { actorId: req.user._id, actorName: req.user.fullName, chatName },
        memberIds,
      });
    }

    if (changedFields.includes("photo")) {
      await createSystemMessage({
        chatId,
        type: "group_photo_updated",
        text: `${req.user.fullName} updated the group photo`,
        meta: { actorId: req.user._id, actorName: req.user.fullName },
        memberIds,
      });
    }

    // notify all members
    updatedChat.users.forEach((member) => {
      const memberSocketId = getReceiverSocketId(member._id.toString());
      if (memberSocketId) {
        io.to(memberSocketId).emit("groupUpdated", updatedChat);
      }
    });

    res.status(200).json(updatedChat);
  } catch (error) {
    console.log("Error in updateGroupChat controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/group/add
// @access  Protected
export const addMemberToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    if (!chatId || !userId) {
      return res.status(400).json({ message: "chatId and userId are required" });
    }
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isAdmin =
      chat.groupAdmin.toString() === req.user._id.toString();

    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can add users to the group" });
    }

    const alreadyInGroup = chat.users.some(
      (u) => u.toString() === userId.toString()
    );

    if (alreadyInGroup) {
      return res.status(400).json({ message: "User is already in the group" });
    }

    const addedUser = await User.findById(userId).select("fullName");

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } },
      { returnDocument: 'after' }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    const allMemberIds = updatedChat.users.map((u) => u._id.toString());

    await createSystemMessage({
      chatId,
      type: "member_added",
      text: `${req.user.fullName} added ${addedUser?.fullName ?? "a user"} to the group`,
      meta: {
        actorId: req.user._id,
        actorName: req.user.fullName,
        targetId: userId,
        targetName: addedUser?.fullName,
      },
      memberIds: allMemberIds,
    });

    // notify the added user
    const addedUserSocketId = getReceiverSocketId(userId);
    if (addedUserSocketId) {
      io.to(addedUserSocketId).emit("addedToGroup", updatedChat);
    }

    // notify existing members
    updatedChat.users.forEach((member) => {
      if (member._id.toString() === userId) return;
      const memberSocketId = getReceiverSocketId(member._id.toString());
      if (memberSocketId) {
        io.to(memberSocketId).emit("groupUpdated", updatedChat);
      }
    });

    res.status(200).json(updatedChat);

  } catch (error) {
    console.log("Error in addMemeberToGroup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Remove user from Group
// @route   PUT /api/chat/group/delete
// @access  Protected
export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    if (!chatId || !userId) {
      return res.status(400).json({ message: "chatId and userId are required" });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isAdmin =
      chat.groupAdmin.toString() === req.user._id.toString();

    const isSelf = userId.toString() === req.user._id.toString();

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "Only admins can remove other users" });
    }

    if(isAdmin && isSelf) {
      return res.status(400).json({ message: "Admin cannot leave the group" });
    }

    const removedUser = await User.findById(userId).select("fullName");

    const memberIdsBefore = chat.users.map((u) => u.toString());

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { returnDocument: 'after' }
    ).populate("users", "-password")
      .populate("groupAdmin", "-password");

    const isLeaving = isSelf && !isAdmin;

    await createSystemMessage({
      chatId,
      type: isLeaving ? "member_left" : "member_removed",
      text: isLeaving
        ? `${removedUser?.fullName ?? "A user"} left the group`
        : `${req.user.fullName} removed ${removedUser?.fullName ?? "a user"} from the group`,
      meta: {
        actorId: req.user._id,
        actorName: req.user.fullName,
        targetId: userId,
        targetName: removedUser?.fullName,
      },
      memberIds: memberIdsBefore, // broadcast to old members including the removed one
    });

    const removedUserSocketId = getReceiverSocketId(userId);
    if (removedUserSocketId) {
      io.to(removedUserSocketId).emit("removedFromGroup", chatId);
    }

    updatedChat.users.forEach((member) => {
      const memberSocketId = getReceiverSocketId(member._id.toString());
      if (memberSocketId) {
        io.to(memberSocketId).emit("groupUpdated", updatedChat);
      }
    });

    res.status(200).json(updatedChat);

  } catch (error) {
    console.log("Error in removeFromGroup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


