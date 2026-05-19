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
      res.status(200).json(isChat[0]);
    } else {
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
    }
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
  const { users: rawUsers, chatName } = req.body;

  try {
    if (!chatName || !rawUsers) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const users = typeof rawUsers === "string" ? JSON.parse(rawUsers) : rawUsers;

    if (users.length < 2) {
      return res.status(400).json({ message: "At least 2 users are required for group chat" });
    }

    const groupChat = await Chat.create({
      chatName,
      users: [...users, req.user],
      isGroupChat: true,
      groupAdmin: req.user._id
    })

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

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

    const isAdmin =
      chat.groupAdmin.toString() === req.user._id.toString();

    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can update group" });
    }

    const updates = {};
    if (chatName) updates.chatName = chatName;
    if (profilePicture) updates.profilePicture = profilePicture;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    console.log("Error in updateGroupChat controller", error.message);
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

    const isSelf = userId === req.user._id.toString();

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "Only admins can remove other users" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    ).populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);

  } catch (error) {
    console.log("Error in removeFromGroup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/group/add
// @access  Protected
export const addMemeberToGroup = async (req, res) => {
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
      (u) => u.toString() === userId
    );

    if (alreadyInGroup) {
      return res.status(400).json({ message: "User is already in the group" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);

  } catch (error) {
    console.log("Error in addMemeberToGroup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


