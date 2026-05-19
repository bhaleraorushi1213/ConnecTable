import { useEffect, useRef } from "react";

import { useChatStore } from "../../../store/useChatStore.js";

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
  } = useChatStore();

  const messageEndRef = useRef(null);

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

  

  return (
    <ChatContainerView messageEndRef={messageEndRef} />
  )
}

export default ChatContainer;