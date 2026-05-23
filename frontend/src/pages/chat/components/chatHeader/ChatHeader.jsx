import { useEffect, useState } from "react";
import { useChatStore } from "../../../../store/useChatStore";

import ChatHeaderView from "./ChatHeaderView";

const ChatHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { searchMessages, setSearchResults, searchQuery, selectedChat } = useChatStore();

  useEffect(() => {
    if (!searchQuery.trim()) {
      return setSearchResults([]);
    }
    const timeout = setTimeout(() => {
      searchMessages(selectedChat._id, searchQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedChat, searchMessages, setSearchResults]);

  return (
    <ChatHeaderView {...{ isSearchOpen, setIsSearchOpen }} />
  )
}

export default ChatHeader;