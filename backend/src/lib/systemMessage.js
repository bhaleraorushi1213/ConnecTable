import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import { getReceiverSocketId, io } from "./socket.js";

export const createSystemMessage = async ({
  chatId,
  type,
  text,
  meta = {},
  memberIds = [],
}) => {
  try {
    const systemMsg = await Message.create({
      senderId: meta.actorId,
      chat: chatId,
      isSystemMessage: true,
      systemMessageType: type,
      text,
      systemMessageMeta: meta,
      readBy: [],
      deliveredTo: [],
    });

    // update latestMessage on the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: systemMsg._id });

    // broadcast to every online member
    memberIds.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId.toString());
      if (socketId) {
        io.to(socketId).emit("newMessage", systemMsg);        // chat view
        io.to(socketId).emit("newMessage:global", systemMsg); // list view
      }
    });

    return systemMsg;
  } catch (err) {
    console.error("Failed to create system message:", err.message);
    return null;
  }
};