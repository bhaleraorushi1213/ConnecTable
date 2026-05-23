  import { useEffect, useRef, useCallback } from "react";

  import { useChatStore } from "../../../../store/useChatStore.js";

  import ChatContainerView from "./ChatContainerView.jsx";

  const ChatContainer = () => {
    const {
      messages,
      selectedChat,
      getMessages,
      subscribeToMessages,
      unsubscribeFromMessages,
      subscribeToTyping,
      unsubscribeFromTyping,
      isTyping,
      hasMoreMessages,
      isLoadingMoreMessages,
      loadMoreMessages,
    } = useChatStore();

    const messageEndRef = useRef(null);
    // const messageTopRef = useRef(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
      if (!selectedChat) return;

      getMessages(selectedChat._id);

      subscribeToMessages(selectedChat);
      subscribeToTyping();

      return () => {
        unsubscribeFromMessages();
        unsubscribeFromTyping();
      };
    }, [selectedChat, getMessages, subscribeToMessages, unsubscribeFromMessages, subscribeToTyping, unsubscribeFromTyping]);

    useEffect(() => {
      if (messageEndRef.current && (messages.length > 0 || isTyping)) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages, isTyping])

    const handleScroll = useCallback(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // load more when scrolled near the top
      if (container.scrollTop < 100 && hasMoreMessages && !isLoadingMoreMessages) {
        // save current scroll height before loading
        const prevScrollHeight = container.scrollHeight;

        loadMoreMessages().then(() => {
          // restore scroll position after new messages prepended
          requestAnimationFrame(() => {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - prevScrollHeight;
          });
        });
      }
    }, [hasMoreMessages, isLoadingMoreMessages, loadMoreMessages, scrollContainerRef]);

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
      }
    }, [handleScroll]);

    return (
      <ChatContainerView
        messageEndRef={messageEndRef}
        scrollContainerRef={scrollContainerRef}
      />
    )
  }

  export default ChatContainer;