import { useChatStore } from "../../../store/useChatStore"
import { useAuthStore } from "../../../store/useAuthStore.js";

import { EllipsisVertical } from "lucide-react";

import { formatMessageTime } from "../../../lib/utils.js";
import { ReactionPicker } from "../reactionPicker/ReactionPicker.jsx";

const MessageBubbleView = (props) => {
  const { message, isOwnMessage, senderPic, showPicker, setShowPicker, isMenuOpen, setIsMenuOpen } = props;
  const { reactToMessage, selectedChat, deleteMessage } = useChatStore();
  const { authUser } = useAuthStore();

  const groupedReactions = message.reactions?.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {});

  const myReaction = message.reactions?.find(
    (r) => r.userId?._id === authUser._id || r.userId === authUser._id
  );

  return (
    <div
      key={message._id}
      className={`my-2 chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
    >
      <div className="chat-image avatar">
        <div className="size-10 rounded-full border">
          <img
            src={senderPic}
            alt="profile picture" />
        </div>
      </div>

      <div className=" chat-header mb-1 flex items-center gap-2">
        {selectedChat.isGroupChat && !isOwnMessage && (
          <span className="text-xs font-semibold text-primary">
            {message.senderId?.fullName || "Unknown"}
          </span>
        )}
        <time className="text-xs text-slate-300 opacity-70 pr-2">
          {formatMessageTime(message.createdAt)}
        </time>
      </div>
      <div className="relative group">

        <div className={`chat-bubble flex flex-col text-slate-100 p-1.5 ${isOwnMessage && "bg-cyan-500"}`}>
          {message.image && (
            <img
              src={message.image}
              alt="Attachment"
              className="sm:max-w-[200px] rounded-md mb-2 object-cover box"
            />
          )}
          {message.text && <p className="px-2">{message.text}</p>}
        </div>
        <button
          onClick={() => setShowPicker((prev) => !prev)}
          className={`${isOwnMessage ? "-left-4 -bottom-2 " : "-right-2 -bottom-2 "} absolute ${showPicker ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity size-6 bg-base-300 rounded-full flex items-center justify-center text-xs border border-slate-600 hover:bg-base-200`}>
          😊
        </button>
        {showPicker && (
          <ReactionPicker
            onSelect={(emoji) => reactToMessage(message._id, emoji)}
            onClose={() => setShowPicker(false)}
            isOwnMessage={isOwnMessage}
          />
        )}

        {isOwnMessage && (
          <button onClick={() => setIsMenuOpen((prev) => !prev)} className={`absolute -top-1 -left-6 ${isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity rounded-full flex items-center justify-center hover:bg-slate-900 size-6 text-slate-200`}>
            <EllipsisVertical className="size-4" />
          </button>

        )}

        {isMenuOpen && (
          <div className="flex flex-col absolute top-1 -left-20 rounded-lg bg-base-300">
            <button
              onClick={() => deleteMessage(message._id)}
              className="text-red-800 text-xs border-b border-slate-600 p-2"
            >
              Delete
            </button>
            <button className="text-slate-200 text-xs border-b border-slate-600 p-2">Copy</button>
            <button className="text-slate-200 text-xs p-2">Edit</button>
          </div>
        )}
        {groupedReactions && Object.keys(groupedReactions).length > 0 && (
          <div className="absolute -bottom-7 flex flex-wrap gap-1 mt-1">
            {Object.entries(groupedReactions).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => reactToMessage(message._id, emoji)}
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border transition-colors
                ${myReaction?.emoji === emoji
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-base-300 border-slate-600 text-slate-300 hover:border-primary/50"
                  }`}
              >
                <span>{emoji}</span>
                {count > 1 && <span>{count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubbleView