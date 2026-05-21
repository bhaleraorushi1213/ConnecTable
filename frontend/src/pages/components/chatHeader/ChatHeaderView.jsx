import { ArrowLeft, InfoIcon, Search, SearchIcon, Users, X } from "lucide-react";

import { useChatStore } from "../../../store/useChatStore.js";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { formatLastSeen, formatMessageTime, getChatName } from "../../../lib/utils.js";

import Avatar from "../../../assets/default-avatar.png";
import ChatInfoModal from "../../modals/chatInfoModal/ChatInfoModal.jsx";
import { useEffect } from "react";

const ChatHeaderView = () => {
  const {
    setMobileView,
    selectedChat,
    setSelectedChat,
    setIsSidebarOpen,
    isSidebarOpen,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchMessages,
    searchResults,
    isSearching,
  } = useChatStore();
  const { onlineUsers, authUser, lastSeenMap } = useAuthStore();

  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }
    const timeout = setTimeout(() => {
      searchMessages(selectedChat._id, searchQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedChat, searchMessages]);

  const chatName = getChatName(selectedChat, authUser);

  const otherUser = !selectedChat.isGroupChat
    ? selectedChat.users?.find((u) => u._id !== authUser._id)
    : selectedChat;

  const isOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;

  const lastSeen = otherUser
    ? lastSeenMap[otherUser._id] || otherUser.lastSeen
    : null;

  const scrollToMessage = (message) => {
    const el = document.getElementById(`message-${message._id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("bg-primary/10");
      setTimeout(() => el.classList.remove("bg-primary/10"), 1500);
    }
    setIsSearchOpen(false);
  }

  const renderSearchPanel = () => {
    return (
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-base-300 rounded-lg px-3 py-2">
          <Search className="size-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-slate-400 hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* search results */}
        {isSearching && (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-sm text-primary" />
          </div>
        )}

        {!isSearching && searchQuery && searchResults.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-4">
            No messages found
          </p>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className="mt-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
            {searchResults.map((message) => (
              <button
                key={message._id}
                onClick={() => scrollToMessage(message)}
                className="flex flex-col text-left px-3 py-2 rounded-lg hover:bg-base-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-primary">
                    {message.senderId?.fullName}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-300 truncate">
                  {message.text}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-base-300/90 border-b border-zinc-500 shadow-sm shrink-0">
        <div className="flex items-center gap-3 cursor-pointer">
          <button
            onClick={() => {
              setMobileView("list");
              setSelectedChat(null);
            }}
            className="md:hidden mr-2"
          >
            <ArrowLeft className="text-slate-100" />
          </button>
          <div
            className="flex items-center gap-3"
          >
            <div className="relative">
              {selectedChat.isGroupChat ? (
                <div className="size-10 rounded-full flex items-center justify-center border border-zinc-500 bg-base-300">
                  {
                    otherUser?.profilePicture ?
                      <img
                        src={otherUser?.profilePicture || Avatar}
                        alt={chatName}
                        className="size-10 rounded-full object-cover"
                      /> :
                      <Users className="size-5 text-zinc-200" />
                  }

                </div>
              ) : (
                <>
                  <img
                    src={otherUser?.profilePicture || Avatar}
                    alt={chatName}
                    className="size-10 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-base-100" />
                  )}
                </>
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 dark:text-white">
                {chatName}
              </h2>
              <p className={`text-sm text-slate-400`}>
                {selectedChat.isGroupChat
                  ? `${selectedChat.users?.length} members`
                  : isOnline ? "Online" : lastSeen
                  ? `Last seen ${formatLastSeen(lastSeen)}`
                  : "Offline"
                }
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-4">
          {selectedChat.isGroupChat && (
            <button onClick={() => setIsSidebarOpen(true)} className="btn btn-ghost btn-circle btn-sm">
              <InfoIcon className="size-5 text-slate-400" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`btn btn-ghost btn-circle btn-sm ${isSearchOpen ? "text-primary" : "text-slate-200"}`}
          >
            <SearchIcon className="size-5" />
          </button>
          <button onClick={() => setSelectedChat(null)} className={`hidden lg:block md:flex p-2 rounded-full transition-colors text-slate-100 hover:text-slate-400`}>
            <X className="size-5" />
          </button>
        </div>
      </header>
      {isSearchOpen && renderSearchPanel()}

      {isSidebarOpen && (
        <ChatInfoModal onClose={() => setIsSidebarOpen(false)} />
      )}

    </>
  )
}

export default ChatHeaderView