import { useAuthStore } from "../../../store/useAuthStore.js";
import { useChatStore } from "../../../store/useChatStore.js";

import ChatHeader from "../chatHeader/ChatHeader.jsx";
import MessageInput from "../messageInput/MessageInput.jsx";
import MessageSkeleton from "../../skeletons/MessageSkeleton.jsx"
import MessageBubble from "../messageBubble/MessageBubble.jsx"
import Avatar from "../../../assets/default-avatar.png";
import { formatDateSeparator, isSameDay } from "../../../lib/utils.js";

const ChatContainerView = (props) => {
  const { messageEndRef, scrollContainerRef } = props;

  const { authUser } = useAuthStore();
  const {
    mobileView,
    isMessagesLoading,
    messages,
    selectedChat,
    isTyping,
    hasMoreMessages,
    isLoadingMoreMessages,
  } = useChatStore();

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto relative">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  };

  const renderMessages = () => {
    return (
      <div className="flex-1 flex flex-col overflow-auto px-4" ref={scrollContainerRef}>

        {/* load more indicator at top */}
        {isLoadingMoreMessages && (
          <div className="flex justify-center py-3">
            <span className="loading loading-spinner loading-sm text-primary" />
          </div>
        )}

        {/* end of messages indicator */}
        {!hasMoreMessages && messages.length > 0 && (
          <div className="flex items-center gap-3 py-4">
            <div className="flex-1 h-px bg-base-content/50" />
            <p className="text-sm text-base-content/50 shrink-0">
              Beginning of conversation
            </p>
            <div className="flex-1 h-px bg-base-content/50" />
          </div>
        )}
        {messages.map((message, idx) => {

          const prevMessage = messages[idx - 1];

          const showDateSeparator =
            !prevMessage ||
            !isSameDay(prevMessage.createdAt, message.createdAt);

          const isOwnMessage =
            typeof message.senderId === "object"
              ? message.senderId._id === authUser._id
              : message.senderId === authUser._id;

          const senderPic = isOwnMessage
            ? authUser?.profilePicture || Avatar
            : selectedChat.isGroupChat
              ? message.senderId?.profilePicture || Avatar
              : selectedChat.profilePicture || Avatar;

          return (
            <div key={message._id}>
              {showDateSeparator && (
                <div className="flex items-center justify-center gap-3 py-4">
                  <span className="text-xs text-base-content bg-base-100 shrink-0 border border-base-content my-2 rounded-full px-2 py-1.5">
                    {formatDateSeparator(message.createdAt)}
                  </span>
                </div>
              )}
              <MessageBubble senderPic={senderPic} message={message} isOwnMessage={isOwnMessage} />
            </div>
          )
        })}
        <div ref={messageEndRef} />
      </div>
    )
  }

  return (
    <main
      className={`
        flex-col relative bg-base-100 overflow-hidden h-full flex-1
        ${mobileView === "chat" && selectedChat?._id ? "flex" : "hidden md:flex"}
      `}>

      <ChatHeader />

      {renderMessages()}

      {isTyping && (
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-base-content/80">
          <div className="flex gap-1">
            <span className="size-2 bg-base-content/80 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="size-2 bg-base-content/80 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="size-2 bg-base-content/80 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
          <span>typing...</span>
        </div>
      )}


      <MessageInput />
    </main>
  )
}

export default ChatContainerView