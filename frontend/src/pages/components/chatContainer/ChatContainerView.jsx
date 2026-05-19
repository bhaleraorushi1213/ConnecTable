import { useAuthStore } from "../../../store/useAuthStore.js";
import { useChatStore } from "../../../store/useChatStore.js";
import { formatMessageTime } from "../../../lib/utils.js";

import ChatHeader from "../chatHeader/ChatHeader.jsx";
import MessageInput from "../messageInput/MessageInput.jsx";
import MessageSkeleton from "../../skeletons/MessageSkeleton.jsx"
import Avatar from "../../../assets/default-avatar.png";

const ChatContainerView = (props) => {
  const { messageEndRef } = props;

  const { authUser } = useAuthStore();
  const { mobileView, isMessagesLoading, messages, selectedChat, isTyping } = useChatStore();

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  };

  const renderMessages = () => {
    return (
      <div className="flex-1 flex flex-col overflow-auto px-4">
        {messages.map((message) => {

          const isOwnMessage =
            typeof message.senderId === "object"
              ? message.senderId._id === authUser._id
              : message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`my-4 chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={isOwnMessage ? authUser.profilePicture || Avatar : selectedChat.profilePicture || Avatar}
                    alt="profile picture" />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs text-slate-300 opacity-70 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col text-slate-100 p-1.5">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2 object-cover"
                  />
                )}
                {message.text && <p className="px-2">{message.text}</p>}
              </div>
            </div>
          )
        })}
        {isTyping && (
          <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400">
            <div className="flex gap-1">
              <span className="size-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="size-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="size-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span>typing...</span>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>
    )
  }

  return (
    <main
      className={`
        flex-col relative bg-base-100 overflow-hidden h-full flex-1
        ${mobileView === "chat" && selectedChat?._id ? "flex" : "hidden md:flex"}
      `}
    >

      <ChatHeader />

      {renderMessages()}

      <MessageInput />
    </main>
  )
}

export default ChatContainerView