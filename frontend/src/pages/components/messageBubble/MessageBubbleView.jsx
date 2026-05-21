import { useEffect, useRef } from "react";
import { useChatStore } from "../../../store/useChatStore"
import { useAuthStore } from "../../../store/useAuthStore.js";

import { Reply, Smile, Trash2 } from "lucide-react";

import { formatMessageTime } from "../../../lib/utils.js";
import { ReactionPicker } from "../reactionPicker/ReactionPicker.jsx";

const MessageBubbleView = (props) => {
  const {
    message,
    isOwnMessage,
    senderPic,
    showPicker,
    setShowPicker,
    isMenuOpen,
    setIsMenuOpen
  } = props;
  const { reactToMessage, selectedChat, deleteMessage, setReplyingTo } = useChatStore();
  const { authUser } = useAuthStore();

  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleDocumentClick = (e) => {
      const target = e.target;
      if (
        menuRef.current && triggerRef.current &&
        !menuRef.current.contains(target) && !triggerRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [isMenuOpen, setIsMenuOpen]);

  const scrollToMessage = (messageId) => {
    const el = document.getElementById(`message-${messageId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      el.classList.add("bg-primary/10");
      setTimeout(() => el.classList.remove("bg-primary/10"), 1500);
    }
  };

  const replyPreview = (replyTo) => {
    if (!replyTo) return null;

    return (
      <div className="mb-1.5 px-2 py-1.5 bg-slate-700/60 rounded-lg border-l-4 border-green-800 max-w-[200px]">
        <p className="text-xs text-slate-100 font-semibold truncate">
          {replyTo.senderId?.fullName || "Unknown"}
        </p>
        {replyTo.image && !replyTo.text && (
          <p className="text-xs text-slate-100">📷 Image</p>
        )}
        {replyTo.text && (
          <p className="text-xs text-slate-100 truncate">{replyTo.text}</p>
        )}
      </div>
    );
  };

  const renderAvatar = () => {
    return (
      <div className="chat-image avatar">
        <div className="size-10 rounded-full border">
          <img
            src={senderPic}
            alt="profile picture" />
        </div>
      </div>
    )
  };

  const renderMessageTime = () => {
    return (
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
    )
  }

  const renderChatBubble = () => {
    return (
      <div className={`rounded-xl max-w-[250px] md:max-w-[400px] flex flex-col text-slate-100 p-1.5 flex-wrap ${isOwnMessage ? "bg-primary rounded-tr-none" : "bg-slate-700 rounded-tl-none"}`}>
        {/* reply preview - clickable to scroll */}
        {message.replyTo && (
          <button
            onClick={() => scrollToMessage(message.replyTo._id)}
            className="text-left"
          >
            {replyPreview(message.replyTo)}
          </button>
        )}

        {message.image && (
          <img
            src={message.image}
            className="sm:max-w-[200px] rounded-md mb-2 object-cover"
          />
        )}
        {message.text && <p className="px-2 break-all whitespace-pre-wrap">{message.text}</p>}
      </div>
    )
  };

  const renderActionButtons = () => {
    return (
      <div className={`absolute -top-3 ${isOwnMessage ? "right-full mr-1" : "left-full ml-1"} 
          opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}
      >
        {/* reply button */}
        <button
          onClick={() => setReplyingTo(message)}
          className="size-7 bg-base-300 rounded-full flex items-center justify-center text-slate-400 hover:text-primary border border-slate-600 transition-colors"
        >
          <Reply className="size-3.5" />
        </button>

        {/* reaction button */}
        <button
          onClick={() => setShowPicker((p) => !p)}
          className="size-7 bg-base-300 rounded-full flex items-center justify-center text-slate-400 hover:text-primary border border-slate-600 transition-colors"
        >
          <Smile className="size-3.5" />
        </button>

        {/* delete button - own messages only */}
        {isOwnMessage && (
          <button
            onClick={() => deleteMessage(message._id)}
            className="size-7 bg-base-300 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 border border-slate-600 transition-colors"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
    )
  };

  const renderMessageReactions = () => {

    return message.reactions?.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(
          message.reactions.reduce((acc, r) => {
            acc[r.emoji] = (acc[r.emoji] || 0) + 1;
            return acc;
          }, {})
        ).map(([emoji, count]) => {
          const myReaction = message.reactions.find(
            (r) => r.userId?._id === authUser._id || r.userId === authUser._id
          );
          return (
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
          );
        })}
      </div>
    )
  }

  return (
    <div
      key={`message-${message._id}`}
      id={`message-${message._id}`}
      className={`relative my-2 p-2 chat ${isOwnMessage ? "chat-end flex flex-col" : "chat-start"}`}
    >
      {!isOwnMessage && renderAvatar()}

      {renderMessageTime()}

      <div className="relative group">

        {renderChatBubble()}

        {renderActionButtons()}

        {/* reaction picker */}
        {showPicker && (
          <ReactionPicker
            onSelect={(emoji) => reactToMessage(message._id, emoji)}
            onClose={() => setShowPicker(false)}
            isOwnMessage={isOwnMessage}
          />
        )}
      </div>

      {renderMessageReactions()}

    </div>
  )
};

export default MessageBubbleView