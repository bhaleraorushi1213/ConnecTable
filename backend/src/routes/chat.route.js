import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addMemberToGroup,
  createGroupChat,
  getAllChats,
  getChat,
  removeFromGroup,
  updateGroupChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", protectRoute, getChat);
router.get("/", protectRoute, getAllChats);
router.post("/group/create", protectRoute, createGroupChat);
router.put("/group/update", protectRoute, updateGroupChat);
router.put("/group/delete", protectRoute, removeFromGroup);
router.put("/group/add", protectRoute, addMemberToGroup);



export default router;