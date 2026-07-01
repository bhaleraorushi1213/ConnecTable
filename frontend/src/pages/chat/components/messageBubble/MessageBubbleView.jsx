import { useEffect, useRef } from "react";
import { useChatStore } from "../../../../store/useChatStore.js"
import { useAuthStore } from "../../../../store/useAuthStore.js";

import { Forward, MoreVerticalIcon, Reply, Smile, Trash2 } from "lucide-react";
import { formatMessageTime, getMessageStatus } from "../../../../lib/utils.js";

import { ReactionPicker } from "../reactionPicker/ReactionPicker.jsx";
import ForwardMessageModal from "../../modals/forwardMessageModal/ForwardMessageModal.jsx";
import MessageStatus from "../messageStatus/MessageStatus.jsx";

const MessageBubbleView = (props) => {
  const {
    message,
    isOwnMessage,
    senderPic,
    showPicker,
    setShowPicker,
    isMenuOpen,
    setIsMenuOpen,
    showForward,
    setShowForward,
    handleDeleteMessage
  } = props;

  const { reactToMessage, selectedChat, setReplyingTo, setForwardingMessage } = useChatStore();
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

  const status = isOwnMessage
    ? getMessageStatus(message, authUser._id, selectedChat?.users)
    : null;

  const scrollToMessage = (messageId) => {
    const el = document.getElementById(`message-${messageId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      el.classList.add("bg-primary/10");
      el.classList.add("rounded-lg");
      setTimeout(() => {
        el.classList.remove("bg-primary/10");
        el.classList.remove("rounded-lg");
      }, 1500);
    }
  };

  const replyPreview = (replyTo) => {
    if (!replyTo) return null;

    return (
      <div className="mb-1.5 px-2 py-1.5 bg-base-300/60 rounded-lg border-l-4 border-base-300 max-w-[200px]">
        <p className="text-xs text-base-content font-semibold truncate">
          {replyTo.senderId?.fullName || "Unknown"}
        </p>
        {replyTo.image && !replyTo.text && (
          <p className="text-xs text-base-content">📷 Image</p>
        )}
        {replyTo.text && (
          <p className="text-xs text-base-content truncate">{replyTo.text}</p>
        )}
      </div>
    );
  };

  const renderAvatar = () => {
    return (
      <div className="chat-image avatar">
        <div className="size-8 rounded-full border">
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
        <time className="text-xs text-base-content pr-2">
          {formatMessageTime(message.createdAt)}
        </time>
      </div>
    )
  }

  const renderChatBubble = () => {
    return (
      <div className="flex flex-col">

        <div className={`rounded-xl max-w-[250px] md:max-w-[400px] flex flex-col text-base-content p-1.5 flex-wrap ${isOwnMessage ? "bg-primary rounded-tr-none" : "bg-base-content/20 rounded-tl-none"}`}>

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
          {message.text &&
            <p className={`px-2 break-all whitespace-pre-wrap ${isOwnMessage ? "text-base-300" : "text-base-content"}`}>
              {message.text}
            </p>
          }
        </div>

        {isOwnMessage && <MessageStatus status={status} />}
      </div>
    )
  };

  const renderActionButtons = () => {
    return (
      <div className={`absolute -top-3 ${isOwnMessage ? "right-full mr-1" : "left-full ml-1"} 
          opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}
      >
        {/* reaction button */}
        <button
          onClick={() => setShowPicker((p) => !p)}
          className="size-7 bg-base-300 rounded-full flex items-center justify-center text-base-content/70 hover:text-primary border border-base-content/60 transition-colors tooltip" data-tip="React"
        >
          <Smile className="size-3.5" />
        </button>

        <button onClick={() => setIsMenuOpen((p) => !p)} ref={triggerRef}
          className="size-7 bg-base-300 rounded-full flex items-center justify-center text-base-content/70 hover:text-primary border border-base-content/60 transition-colors tooltip" data-tip="More options"
        >
          <MoreVerticalIcon />
        </button>
      </div>
    )
  };

  const renderMessageReactions = () => {

    return message.reactions?.length > 0 && (
      <div className={`absolute flex flex-wrap gap-1 mt-1 ${isOwnMessage ? "right-4 -bottom-4" : "left-4 -bottom-4"}`}>
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
                  : "bg-base-300 border-base-content/50 text-base-content hover:border-primary/50"
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

  const renderMenu = () => {
    return (
      <div ref={menuRef} className={`absolute z-20 ${isOwnMessage ? "right-full mr-8" : "left-full ml-1"} top-0 bg-base-300 rounded-lg shadow-lg border border-base-content/30 w-36 py-1`}>
        <button
          onClick={() => {
            setReplyingTo(message);
            setIsMenuOpen(false);
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-base-content/10 transition-colors"
        >
          <Reply className="size-4" />
          <span className="text-sm text-base-content">Reply</span>
        </button>
        <button
          onClick={() => {
            setForwardingMessage(message);
            setShowForward(true);
            setIsMenuOpen(false);
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-base-content/10 transition-colors"
        >
          <Forward className="size-4" />
          <span className="text-sm text-base-content">Forward</span>
        </button>
        {isOwnMessage && (
          <button
            onClick={() => {
              handleDeleteMessage(message._id);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-base-content/10 transition-colors"
          >
            <Trash2 className="size-4 text-red-600" />
            <span className="text-sm text-red-600">Delete</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      id={`message-${message._id}`}
      className={`relative my-2 p-2 chat ${isOwnMessage ? "chat-end flex flex-col" : "chat-start"}`}
    >
      {!isOwnMessage && renderAvatar()}

      {renderMessageTime()}

      <div className="relative group">

        {renderChatBubble()}

        {renderActionButtons()}

        {/* MENU */}
        {isMenuOpen && renderMenu()}

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

      {showForward && (
        <ForwardMessageModal onClose={() => setShowForward(false)} />
      )}
    </div>
  )
};

export default MessageBubbleView