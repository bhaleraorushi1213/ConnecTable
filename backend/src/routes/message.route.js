import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllMessages, sendMessage, markAsRead, getUnreadCount, reactToMessage, deleteMessage, searchMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/unreadCount", protectRoute, getUnreadCount);

router.get("/:chatId", protectRoute, getAllMessages);

router.post("/send/:chatId", protectRoute, sendMessage);

router.delete("/:messageId", protectRoute, deleteMessage);

router.get("/search/:chatId", protectRoute, searchMessages);

router.put("/markAsRead/:chatId", protectRoute, markAsRead);

router.put("/react/:messageId", protectRoute, reactToMessage);



export default router;