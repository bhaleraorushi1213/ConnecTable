import { useChatStore } from "../../../../store/useChatStore.js";
import { useAuthStore } from "../../../../store/useAuthStore.js";

import { ArrowLeft, InfoIcon, Search, SearchIcon, Users, X } from "lucide-react";
import { formatLastSeen, formatMessageTime, getChatName } from "../../../../lib/utils.js";

import ChatInfoModal from "../../modals/chatInfoModal/ChatInfoModal.jsx";
import Avatar from "../../../../assets/default-avatar.png";

const ChatHeaderView = (props) => {
  const { isSearchOpen, setIsSearchOpen } = props;
  const {
    setMobileView,
    selectedChat,
    setSelectedChat,
    setIsSidebarOpen,
    isSidebarOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,

  } = useChatStore();
  const { onlineUsers, authUser, lastSeenMap } = useAuthStore();

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
      <div className="px-4 py-3 ">
        <div className="bg-base-300/50 rounded-lg">
          <div className="flex items-center gap-2 bg-base-300 rounded-lg px-3 py-2">

            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="text-base-content/80 hover:text-base-content"
              >
                <X className="size-4" />
              </button>
            ) : <Search className="size-4 text-base-content/80 shrink-0" />
            }

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="flex-1 bg-transparent text-sm md:text-base text-base-content placeholder:text-base-content/40 outline-none"
              autoFocus
            />
          </div>
          <div>

            {/* search results */}
            {isSearching && (
              <div className="flex justify-center py-4">
                <span className="loading loading-spinner loading-sm text-primary" />
              </div>
            )}

            {!isSearching && searchQuery && searchResults.length === 0 && (
              <p className="text-center text-base-content/40 text-sm md:text-base py-4">
                No messages found
              </p>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div
                className="mt-2 flex flex-col gap-1 max-h-60 overflow-y-auto"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "transparent transparent",
                }}
              >
                {searchResults.map((message) => (
                  <button
                    key={message._id}
                    onClick={() => scrollToMessage(message)}
                    className="flex flex-col text-left px-4 py-2 rounded-lg hover:bg-base-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-primary">
                        {message.senderId?.fullName}
                      </span>
                      <span className="text-xs text-base-content/80">
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-base-content truncate">
                      {message.text}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    )
  }

  const renderProfilePicture = () => {
    return selectedChat.isGroupChat ? (
      <div className="size-10 md:size-11 rounded-full flex items-center justify-center border border-base-content/50 bg-base-300">
        {
          otherUser?.profilePicture ?
            <img
              src={otherUser?.profilePicture || Avatar}
              alt={chatName}
              className="size-10 md:size-11 rounded-full object-cover"
            /> :
            <Users className="size-5 md:size-8 text-base-content" />
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
    )
  }

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-base-300/90 border-b border-base-content/50 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setMobileView("list");
              setSelectedChat(null);
            }}
            className="lg:hidden mr-2"
          >
            <ArrowLeft className="size-8 text-base-content" />
          </button>
          <div
            className="flex items-center gap-3"
          >
            <div className="relative">
              {renderProfilePicture()}

            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-base-content">
                {chatName}
              </h2>
              <p className={`text-sm md:text-base text-base-content/60`}>
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
        <div className="flex items-center gap-5 md:gap-6">
          {selectedChat.isGroupChat && (
            <button onClick={() => setIsSidebarOpen(true)} className="transition-colors text-base-content hover:text-base-content/60">
              <InfoIcon className="size-5 md:size-6" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`transition-colors text-base-content hover:text-base-content/60 ${isSearchOpen ? "text-primary" : "text-base-content"}`}
          >
            <SearchIcon className="size-5 md:size-6" />
          </button>
          <button onClick={() => {
            setSelectedChat(null)
            setIsSearchOpen(!isSearchOpen)
          }} className={`hidden lg:block transition-colors text-base-content hover:text-base-content/60`}>
            <X className="size-5 md:size-6" />
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