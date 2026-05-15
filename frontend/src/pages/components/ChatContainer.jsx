import { useEffect } from "react";

import { useChatStore } from "../../store/useChatStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";

import ChatPattern from "../../assets/chat-bg-pattern.png";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "../skeletons/MessageSkeleton.jsx";

import Avatar from "../../assets/default-avatar.png";
import { formatMessageTime } from "../../lib/utils.js";
import { useRef } from "react";

const ChatContainer = () => {
  const {
    messages,
    mobileView,
    selectedUser,
    getMessages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])

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
      <div className="flxe-1 flex flex-col overflow-auto px-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`my-4 chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={isOwnMessage ? authUser.profilePicture || Avatar : selectedUser.profilePicture || Avatar}
                    alt="profile picture" />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
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
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <main
      className={`
        flex-col relative bg-base-100 overflow-hidden h-full flex-1
        ${mobileView === "chat" && selectedUser?._id ? "flex" : "hidden md:flex"}
      `}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-[1] opacity-1 dark:opacity-[0.04] dark:invert pointer-events-none contrast-125"
        style={{
          backgroundImage: `url(${ChatPattern})`,
          backgroundSize: "400px",
          backgroundRepeat: "repeat",
        }}
      />

      <ChatHeader />

      {renderMessages()}

      <MessageInput />
    </main>
  )
}

export default ChatContainer;