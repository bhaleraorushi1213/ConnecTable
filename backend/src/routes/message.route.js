import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllMessages, sendMessage, markAsRead, getUnreadCount } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/unreadCount", protectRoute, getUnreadCount);

router.get("/:chatId", protectRoute, getAllMessages);

router.post("/send/:chatId", protectRoute, sendMessage);

router.put("/markAsRead/:chatId", protectRoute, markAsRead);


export default router;