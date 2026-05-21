import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Protected
export const allUsers = async (req, res) => {
  try {
    const { search } = req.query;

    const trimmed = search?.trim();
    if (!trimmed) return res.status(200).json([]);

    const keyword = trimmed
      ? {
        $or: [
          { fullName: { $regex: trimmed, $options: "i" } },
          { userName: { $regex: trimmed, $options: "i" } },
          { email: { $regex: trimmed, $options: "i" } },
        ],
      }
      : {};
    const users = await User.find({
      ...keyword,
      _id: { $ne: req.user._id },
    }).select("-password")
      .limit(10);

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in allUsers controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Register new user
//@route           POST /api/auth/signup
//@access          Public
export const signup = async (req, res) => {
  const { email, fullName, userName, password } = req.body;
  try {

    if (!fullName || !email || !userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      userName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        profilePicture: newUser.profilePicture
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

//@description     Login the user
//@route           POST /api/auth/login
//@access          Public 
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture,
    })

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" })
  }
}

//@description     logout the user
//@route           POST /api/users/logout
//@access          Public
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

//@description     Update profile
//@route           POST /api/auth/update-profile
//@access          Protected
export const updateProfile = async (req, res) => {
  const { fullName, userName, profilePicture, bio } = req.body;
  const userId = req.user._id;
  try {
    const updates = {};

    if (fullName) updates.fullName = fullName;
    if (bio !== undefined) updates.bio = bio;

    // check username uniqueness
    if (userName) {
      const existingUser = await User.findOne({
        userName,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      updates.userName = userName;
    }

    // upload new profile picture
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
        folder: "profile_pictures",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
        ],
      });
      updates.profilePicturePublicId = uploadResponse.public_id;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    res.status(200).json(updatedUser);

  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Auth the user
//@route           POST /api/auth/check
//@access          rotected
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get user last seen
// @route   GET /api/auth/lastSeen/:userId
// @access  Protected
export const getLastSeen = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("lastSeen isOnline");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ lastSeen: user.lastSeen, isOnline: user.isOnline });
  } catch (error) {
    console.log("Error in getLastSeen controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Protected
export const deleteAccount = async (req, res) => {
  const userId = req.user._id;

  try {
    // delete all messages sent by user
    await Message.deleteMany({ senderId: userId });

    // remove user from all chats
    await Chat.updateMany(
      { users: userId },
      { $pull: { users: userId } }
    );

    // delete empty chats
    await Chat.deleteMany({ users: { $size: 0 } });

    // delete profile picture from cloudinary
    const user = await User.findById(userId);
    if (user?.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
    }

    // delete user
    await User.findByIdAndDelete(userId);

    res.clearCookie("jwt");
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAccount controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};