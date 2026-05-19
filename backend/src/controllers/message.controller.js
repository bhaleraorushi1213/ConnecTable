import mongoose from "mongoose";

import { getReceiverSocketId, io } from "../lib/socket.js";

import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import cloudinary from "../lib/cloudinary.js";

//@description     Get all Messages
//@route           GET /api/message/:chatId
//@access          Protected
export const getAllMessages = async (req, res) => {
	const { chatId } = req.params;
	const userId = req.user._id;

	try {
		if (!chatId) {
			return res.status(400).json({ message: "chatId is required" });
		}

		const chat = await Chat.findById(chatId);

		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		}

		const isMember = chat.users.some(
			(u) => u.toString() === req.user._id.toString()
		);

		if (!isMember) {
			return res.status(403).json({ message: "You are not a member of this chat" });
		}

		const messages = await Message.find({ chat: chatId })
			.populate("senderId", "fullName profilePicture email")
			.populate({
				path: "chat",
				populate: {
					path: "users",
					select: "fullName profilePicture email",
				},
			});

		await Message.updateMany(
			{
				chat: chatId,
				readBy: { $ne: userId },
				senderId: { $ne: userId },
			},
			{ $addToSet: { readBy: userId } }
		);
		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getAllMessages controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

//@description     Create New Message
//@route           POST /api/messages/send/:id
//@access          Protected
export const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body;
		const { chatId } = req.params;
		const senderId = req.user._id;

		if (!text && !image) {
			return res.status(400).json({ message: "Message must have text or an image" });
		}

		if (!chatId) {
			return res.status(400).json({ message: "chatId is required" });
		}

		const chat = await Chat.findById(chatId);

		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		}

		const isMember = chat.users.some((u) => u.toString() === senderId.toString());

		if (!isMember) {
			return res.status(403).json({ message: "You are not a member of this chat" });
		}

		let imageUrl;

		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = await Message.create({
			senderId,
			text,
			chat: chatId,
			image: imageUrl,
			readBy: [senderId],
		});

		const fullMessage = await Message.findById(newMessage._id)
			.populate("senderId", "fullName profilePicture email")
			.populate({
				path: "chat",
				populate: { path: "users", select: "fullName profilePicture email" }
			});

		await Chat.findByIdAndUpdate(chatId, { latestMessage: fullMessage });

		const chatMembers = chat.users.filter((u) => u.toString() !== senderId.toString());

		chatMembers.forEach((memberId) => {
			const memberSocketId = getReceiverSocketId(memberId.toString());
			console.log("Emitting to", memberId.toString(), "socketId", memberSocketId); // 👈 add this log
  
			if (memberSocketId) {
				io.to(memberSocketId).emit("newMessage", fullMessage);
			}
		});

		res.status(201).json(fullMessage);
	} catch (error) {
		console.log("Error in sendMessage controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

// @desc    Mark messages as read
// @route   PUT /api/messages/markAsRead/:id
// @access  Protected
export const markAsRead = async (req, res) => {
	const { chatId } = req.params;
	const userId = req.user._id;

	try {
		// update all unread messages in this chat
		await Message.updateMany(
			{
				chat: chatId,
				readBy: { $ne: userId }, // not already read by this user
				senderId: { $ne: userId }, // not sent by this user
			},
			{
				$addToSet: { readBy: userId }, // avoid duplicates
			}
		);

		res.status(200).json({ message: "Messages marked as read" });
	} catch (error) {
		console.log("Error in markAsRead controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};


// @desc    Get unread count
// @route   PUT /api/messages/unreadCount
// @access  Protected
export const getUnreadCount = async (req, res) => {
  const userId = req.user._id;

  try {
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          readBy: { $ne: new mongoose.Types.ObjectId(userId) },
          senderId: { $ne: new mongoose.Types.ObjectId(userId) },
        },
      },
      {
        $group: {
          _id: "$chat",
          count: { $sum: 1 },
        },
      },
    ]);

    // convert to { chatId: count } map
    const result = unreadCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in getUnreadCount controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

