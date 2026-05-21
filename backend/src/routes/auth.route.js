import express from "express";
import { allUsers, checkAuth, deleteAccount, getLastSeen, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup); 
router.post("/login", login);
router.post("/logout", logout);

router.get("/user", protectRoute, allUsers);
router.put("/update-profile", protectRoute , updateProfile);
router.delete("/delete-account", protectRoute, deleteAccount);

router.get("/check", protectRoute , checkAuth);

router.get("/lastSeen/:userId", protectRoute, getLastSeen);


export default router;