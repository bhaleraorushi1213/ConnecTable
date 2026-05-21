import { Server } from "socket.io";
import http from "http";
import express from "express";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
}

// stores online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", async (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastSeen: null,
    });
  }

  // to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("joinChat", async (room) => {
    const chat = await Chat.findById(room);

    if (chat && chat.users.some(u => u.toString() === userId)) {
      socket.join(room);
      console.log("User Joined Room: " + room);
    }
  });

  socket.on("typing", (room, senderId) => socket.in(room).emit("typing", senderId));
  socket.on("stopTyping", (room, senderId) => socket.in(room).emit("stopedTyping", senderId));

  socket.on("disconnect", async () => {
    console.log("A user disconnected", socket.id);

    delete userSocketMap[userId];

    // mark user as offline and set lastSeen
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      // notify all connected users of lastSeen update
      io.emit("userLastSeen", {
        userId,
        lastSeen: new Date(),
      });
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
})

export { io, app, server }
