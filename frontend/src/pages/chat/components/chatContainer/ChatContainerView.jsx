import { useAuthStore } from "../../../../store/useAuthStore.js";
import { useChatStore } from "../../../../store/useChatStore.js";

import { formatDateSeparator, isSameDay } from "../../../../lib/utils.js";

import ChatHeader from "../chatHeader/ChatHeader.jsx";
import MessageInput from "../../components/messageInput/MessageInput.jsx";
import MessageSkeleton from "../../skeletons/MessageSkeleton.jsx"
import MessageBubble from "../messageBubble/MessageBubble.jsx";
import Avatar from "../../../../assets/default-avatar.png";
import React from "react";
import DeleteMessageModal from "../../modals/deleteMessageModal/DeleteMessageModal.jsx";

const ChatContainerView = (props) => {
  const {
    messageEndRef,
    scrollContainerRef,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    messageToDelete,
    setMessageToDelete
  } = props;

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

  const renderSystemMessage = (message) => {
    return (
      <div className="flex items-center justify-center my-2">
        <span className="text-xs text-base-content/50 bg-base-200 rounded-full px-3 py-1 text-center max-w-xs">
          {message.text}
        </span>
      </div>
    );
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-base-content/50 text-sm">
            No messages yet. Start the conversation!
          </p>
        </div>
      )
    }

    return (
      <div
        className="flex-1 flex flex-col overflow-auto px-4"
        ref={scrollContainerRef}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",
        }}
      >

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

          const senderPic = !isOwnMessage && message?.senderId?.profilePicture || Avatar;

          if (message.isSystemMessage) {
            return (
              <React.Fragment key={message._id}>
                {showDateSeparator && (
                  <div className="flex items-center justify-center gap-3 py-4">
                    <span className="text-xs text-base-content bg-base-100 shrink-0 border border-base-content my-2 rounded-full px-2 py-1.5">
                      {formatDateSeparator(message.createdAt)}
                    </span>
                  </div>
                )}
                {renderSystemMessage(message)}
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={message._id}>
              {showDateSeparator && (
                <div className="flex items-center justify-center gap-3 py-4">
                  <span className="text-xs text-base-content bg-base-100 shrink-0 border border-base-content my-2 rounded-full px-2 py-1.5">
                    {formatDateSeparator(message.createdAt)}
                  </span>
                </div>
              )}

              <MessageBubble
                senderPic={senderPic}
                message={message}
                isOwnMessage={isOwnMessage}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                setMessageToDelete={setMessageToDelete}
              />
            </React.Fragment>
          )
        })}
        <div ref={messageEndRef} />
      </div>
    )
  }

  return (
    <div className={`flex-col relative bg-base-100 overflow-hidden h-full flex-1 ${mobileView === "chat" && selectedChat?._id ? "flex" : "hidden lg:flex"}`}>

      <ChatHeader />
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">

        {renderMessages()}
      </div>

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

      {isDeleteModalOpen && (
        <DeleteMessageModal
          message={messageToDelete}
          onClose={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        />
      )}
    </div>
  )
}

export default ChatContainerView;