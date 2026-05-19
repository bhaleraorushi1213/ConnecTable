import { Server } from "socket.io";
import http from "http";
import express from "express";
import Chat from "../models/chat.model.js"

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

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id;

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
  socket.on("stopedTyping", (room, senderId) => socket.in(room).emit("stopedTyping", senderId));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
})

export { io, app, server }
