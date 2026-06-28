import { useAuthStore } from "../../../../store/useAuthStore.js";
import { useChatStore } from "../../../../store/useChatStore.js";

import { MessagesSquareIcon, PlusIcon, SearchIcon, Users, X } from "lucide-react";
import { formatLastSeen, getChatName, getMessageStatus, isUserOnline } from "../../../../lib/utils.js";

import Avatar from "../../../../assets/default-avatar.png";
import ChatListPageSkeleton from "../../skeletons/ChatListPageSkeleton.jsx";
import MessageStatus from "../messageStatus/MessageStatus.jsx";

const ChatListPageView = (props) => {
  const { handleConversationClick, handleChangeTabs } = props;

  const {
    isUsersLoading,
    selectedChat,
    activeTab,
    setIsNewChatModalOpen,
    getFilteredUsers,
    unreadCounts,
    conversationSearch,
    setConversationSearch,
  } = useChatStore();

  const { onlineUsers, authUser, lastSeenMap } = useAuthStore();

  const filteredUsers = getFilteredUsers();

  const getChatPic = (chat) => {
    const newChat = chat.isGroupChat ? chat : chat.users.find((u) => u._id !== authUser._id);

    return newChat?.profilePicture;
  }

  const getLatestMessage = (user) => {
    const isOwnMessage = user?.latestMessage?.senderId?._id === authUser._id;

    const status = isOwnMessage ? getMessageStatus(user?.latestMessage, authUser._id, user?.users) : null;

    let message = "";
    const latest = user?.latestMessage;
    if (!latest) message = "No messages yet";
    if (latest?.text) message = latest.text;
    if (latest?.image) message = "📷 Image";

    return (
      <div className="flex items-center gap-2">
        {isOwnMessage && <MessageStatus status={status} />}
        <div className="flex items-center gap-2">
          <p className="text-sm md:text-base text-base-content/60 truncate">
            {message}
          </p>
        </div>
      </div>
    );
  }

  const handleTabsClass = (tab) => {
    if (activeTab === tab) {
      return "flex-1 py-1.5 text-xs md:text-sm font-medium rounded-md bg-primary text-base-300 shadow-lg shadow-primary/20";
    }

    return "flex-1 py-1.5 text-xs md:text-sm font-medium rounded-md text-base-content hover:bg-base-200 transition-colors";
  };

  const renderSearchBar = () => {
    return (
      <div className="px-4 my-4">
        <div className="flex w-full items-center rounded-lg bg-base-300 px-3 py-2">
          <SearchIcon className="size-5 text-base-content mr-2" />
          <input
            className="flex-1 bg-transparent border-none text-sm md:text-base focus:ring-0 focus:outline-none placeholder:text-base-content/40 text-base-content p-0"
            placeholder="Search conversations..."
            value={conversationSearch}
            onChange={(e) => setConversationSearch(e.target.value)}
          />
          {conversationSearch && (
            <button
              onClick={() => setConversationSearch("")}
              className="text-slate-400 hover:text-slate-600 ml-1"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderTabs = () => {
    return (
      <div className="flex gap-1 px-4 py-2 border-b border-base-content pb-4">
        <button
          className={handleTabsClass("all")}
          onClick={() => handleChangeTabs("all")}
        >
          All
        </button>
        <button
          className={handleTabsClass("direct")}
          onClick={() => handleChangeTabs("direct")}
        >
          Direct
        </button>
        <button
          className={handleTabsClass("group")}
          onClick={() => handleChangeTabs("group")}
        >
          Groups
        </button>
      </div>
    );
  };

  const renderConversations = () => {
    if ((!filteredUsers || !Array.isArray(filteredUsers) || filteredUsers.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-in fade-in zoom-in duration-300">
          <div className="size-20 bg-base-100/10 border border-base-content/80 rounded-full flex items-center justify-center mb-4 text-base-content/60 ">
            <MessagesSquareIcon className="size-12" />
          </div>
          {conversationSearch ? (
            // 👇 different message when searching
            <>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-1">
                No results found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                No conversations match "{conversationSearch}"
              </p>
              <button
                onClick={() => setConversationSearch("")}
                className="text-primary text-sm font-medium"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-1">
                No chats yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Press the "+" button to start a new conversation.
              </p>
            </>
          )}
        </div>
      );
    }
    return filteredUsers.map((user) => {
      if (!user) return null;

      const isSelected = selectedChat?._id === user?._id;

      return (
        <button key={user._id}
          onClick={() => handleConversationClick(user, user?._id)}
          className={`w-full flex items-center gap-4 px-4 min-h-[72px] py-3 cursor-pointer transition-colors border-l-4 border-transparent hover:bg-base-300 ${isSelected ? "bg-base-300 ring-1 ring-base-300" : ""}`}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user.isGroupChat ?
              <div className="g-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 flex justify-center items-center border border-base-content">

                {getChatPic(user) ?
                  <img
                    src={getChatPic(user) || Avatar}
                    alt={user?.fullName}
                    className="object-cover rounded-full h-12 w-12"
                  /> :
                  <Users className="size-6 text-base-content " />
                }
              </div>
              :
              <>
                <img
                  src={getChatPic(user) || Avatar}
                  alt={user?.fullName}
                  className="object-cover rounded-full h-12 w-12"
                />
                {isUserOnline(user, onlineUsers, authUser) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-300" />
                )}
              </>
            }
          </div>

          {/* Chat Info */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <div className="flex gap-3">
                <p className="text-sm md:text-base font-semibold truncate text-base-content">
                  {getChatName(user, authUser) || "User"}
                </p>
                {user._id && unreadCounts[user._id.toString()] > 0 && (
                  <span className="ml-2 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-primary text-base-300 text-xs font-bold rounded-full">
                    {unreadCounts[user._id.toString()] > 99 ? "99+" : unreadCounts[user._id.toString()]}
                  </span>
                )}
              </div>

              {!user.isGroupChat && (() => {
                const otherUser = user.users?.find((u) => u._id !== authUser._id);
                const isOnline = onlineUsers.includes(otherUser?._id);
                const lastSeen = lastSeenMap[otherUser?._id] || otherUser?.lastSeen;

                return (
                  <p className={`text-xs ${isOnline ? "text-green-600" : "text-base-content/40"}`}>
                    {!isOnline && lastSeen && `Last seen ${formatLastSeen(lastSeen)}`}
                  </p>
                );
              })()}
            </div>
            {getLatestMessage(user)}
          </div>
        </button>)
    });
  }


  return (
    <>
      {renderSearchBar()}

      {renderTabs()}

      <div className="flex flex-1 flex-col overflow-auto h-[calc(100svh-200px)] custom-scrollbar py-2">
        {isUsersLoading ? <ChatListPageSkeleton /> : renderConversations()}
      </div>

      <button
        onClick={() => setIsNewChatModalOpen(true)}
        className="absolute bottom-6 right-6 size-12 flex items-center justify-center bg-primary hover:bg-primary-hover text-base-content rounded-full transition-all hover:scale-110 shadow-2xl shadow-primary/40 z-20 group"
      >
        <PlusIcon className="size-8 font-extrabold text-base-300" />
      </button>
    </>
  )
}

export default ChatListPageView