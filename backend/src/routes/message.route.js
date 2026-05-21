import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllMessages, sendMessage, markAsRead, getUnreadCount, reactToMessage, deleteMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/unreadCount", protectRoute, getUnreadCount);

router.get("/:chatId", protectRoute, getAllMessages);

router.post("/send/:chatId", protectRoute, sendMessage);

router.put("/markAsRead/:chatId", protectRoute, markAsRead);

router.put("/react/:messageId", protectRoute, reactToMessage);

router.delete("/:messageId", protectRoute, deleteMessage);


export default router;