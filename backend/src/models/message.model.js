import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true
    },
    image: {
      type: String,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    deliveredTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    reactions: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      emoji: { type: String },
    }],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    isForward: {
      type: Boolean,
      default: false
    },
    isSystemMessage: {
      type: Boolean,
      default: false,
    },
    systemMessageType: {
      type: String,
      enum: [
        "group_created",
        "member_added",
        "member_removed",
        "member_left",
        "group_name_updated",
        "group_photo_updated",
        "group_updated",
        null
      ],
      default: null,
    },
    systemMessageMeta: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;