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
	const { page = 1, limit = 30 } = req.query;
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

		const total = await Message.countDocuments({ chat: chatId });
		const totalPages = Math.ceil(total / limit);

		const messages = await Message.find({ chat: chatId })
			.populate("senderId", "fullName profilePicture email")
			.populate({
				path: "chat",
				populate: {
					path: "users",
					select: "fullName profilePicture email",
				},
			})
			.populate({
				path: "replyTo",
				populate: {
					path: "senderId",
					select: "fullName profilePicture",
				},
			})
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(Number(limit));

		await Message.updateMany(
			{
				chat: chatId,
				readBy: { $ne: userId },
				senderId: { $ne: userId },
			},
			{ $addToSet: { readBy: userId } }
		);

		res.status(200).json({
			messages: messages.reverse(), // return oldest first
			pagination: {
				page: Number(page),
				limit: Number(limit),
				total,
				totalPages,
				hasMore: page < totalPages,
			},
		});
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
		const { text, image, replyTo, isForward } = req.body;
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
			replyTo: replyTo || null,
			isForward: isForward || false
		});

		const fullMessage = await Message.findById(newMessage._id)
			.populate("senderId", "fullName profilePicture email")
			.populate({
				path: "chat",
				populate: { path: "users", select: "fullName profilePicture email" }
			})
			.populate({
				path: "replyTo",
				populate: { path: "senderId", select: "fullName profilePicture" },
			});

		await Chat.findByIdAndUpdate(chatId, { latestMessage: fullMessage });

		const chatMembers = chat.users.filter((u) => u.toString() !== senderId.toString());

		chatMembers.forEach((memberId) => {
			const memberSocketId = getReceiverSocketId(memberId.toString());

			if (memberSocketId) {
				io.to(memberSocketId).emit("newMessage", fullMessage); // for chat view (messages array)
				io.to(memberSocketId).emit("newMessage:global", fullMessage); // for list view (badges + latest message)
			}
		});

		const senderSocketId = getReceiverSocketId(senderId.toString());
		if (senderSocketId) {
			io.to(senderSocketId).emit("newMessage:global", fullMessage);
		}

		console.log("senderSocketId:", senderSocketId, "senderId:", senderId.toString());

		res.status(201).json(fullMessage);
	} catch (error) {
		console.log("Error in sendMessage controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

// @desc    Delete a message
// @route   DELETE /api/messages/:messageId
// @access  Protected
export const deleteMessage = async (req, res) => {
	const { messageId } = req.params;
	const userId = req.user._id;

	try {
		const message = await Message.findById(messageId);

		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}

		// only sender can delete
		if (message.senderId.toString() !== userId.toString()) {
			return res.status(403).json({ message: "You can only delete your own messages" });
		}

		await Message.findByIdAndDelete(messageId);

		// update latestMessage if this was the latest
		const chat = await Chat.findById(message.chat);
		if (chat.latestMessage?.toString() === messageId) {
			const prevMessage = await Message.findOne({ chat: message.chat })
				.sort({ createdAt: -1 });
			await Chat.findByIdAndUpdate(message.chat, {
				latestMessage: prevMessage?._id || null,
			});
		}

		// notify chat members
		chat.users.forEach((memberId) => {
			const memberSocketId = getReceiverSocketId(memberId.toString());
			if (memberSocketId) {
				io.to(memberSocketId).emit("messageDeleted", {
					messageId,
					chatId: message.chat,
				});
			}
		});

		res.status(200).json({ message: "Message deleted" });
	} catch (error) {
		console.log("Error in deleteMessage controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

// @desc    Search messages in a chat
// @route   GET /api/messages/search/:chatId
// @access  Protected
export const searchMessages = async (req, res) => {
	const { chatId } = req.params;
	const { query } = req.query;
	const userId = req.user._id;

	try {
		if (!query?.trim()) {
			return res.status(400).json({ message: "Search query is required" });
		}

		const chat = await Chat.findById(chatId);
		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		}

		const isMember = chat.users.some(
			(u) => u.toString() === userId.toString()
		);
		if (!isMember) {
			return res.status(403).json({ message: "You are not a member of this chat" });
		}

		const messages = await Message.find({
			chat: chatId,
			text: { $regex: query, $options: "i" },
		})
			.populate("senderId", "fullName profilePicture email")
			.sort({ createdAt: -1 })
			.limit(20);

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in searchMessages controller", error.message);
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
		const chat = await Chat.findById(chatId);
		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		}

		const isMember = chat.users.some(
			(u) => u.toString() === userId.toString()
		);
		if (!isMember) {
			return res.status(403).json({ message: "You are not a member of this chat" });
		}
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
		// First get user's chats
		const userChats = await Chat.find({ users: userId }).select('_id');
		const chatIds = userChats.map(c => c._id);

		const unreadCounts = await Message.aggregate([
			{
				$match: {
					chat: { $in: chatIds },
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

// @desc    React to a message
// @route   PUT /api/messages/react/:messageId
// @access  Protected
export const reactToMessage = async (req, res) => {
	const { messageId } = req.params;
	const { emoji } = req.body;
	const userId = req.user._id;

	try {
		const message = await Message.findById(messageId);

		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}
		const chat = await Chat.findById(message.chat);

		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		}

		const isMember = chat.users.some((u) => u.toString() === userId.toString());
		if (!isMember) {
			return res.status(403).json({ message: "You are not a member of this chat" });
		}

		if (!emoji) {
			return res.status(400).json({ message: "Emoji is required" });
		}

		const existingReaction = message.reactions.find(
			(r) => r.userId.toString() === userId.toString()
		);

		if (existingReaction) {
			if (existingReaction.emoji === emoji) {
				// remove reaction if same emoji clicked again
				message.reactions = message.reactions.filter(
					(r) => r.userId.toString() !== userId.toString()
				);
			} else {
				// update to new emoji
				existingReaction.emoji = emoji;
			}
		} else {
			// add new reaction
			message.reactions.push({ userId, emoji });
		}

		await message.save();

		const updatedMessage = await Message.findById(messageId)
			.populate("senderId", "fullName profilePicture email")
			.populate("reactions.userId", "fullName");

		chat.users.forEach((memberId) => {
			const memberSocketId = getReceiverSocketId(memberId.toString());
			if (memberSocketId) {
				io.to(memberSocketId).emit("messageReaction", updatedMessage);
			}
		});

		res.status(200).json(updatedMessage);
	} catch (error) {
		console.log("Error in reactToMessage controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
