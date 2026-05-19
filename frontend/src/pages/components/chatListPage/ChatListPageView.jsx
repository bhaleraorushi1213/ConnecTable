import { MessagesSquareIcon, PlusIcon, SearchIcon, Users } from "lucide-react";
import Avatar from "../../../assets/default-avatar.png";

import { getChatName, isUserOnline } from "../../../lib/utils.js";

import ChatListPageSkeleton from "../../skeletons/ChatListPageSkeleton.jsx";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { useChatStore } from "../../../store/useChatStore.js";
import NewChatModal from "../../modals/NewChatModal.jsx";

const ChatListPageView = (props) => {
  const { handleConversationClick, handleChangeTabs } = props;
  const { onlineUsers, authUser } = useAuthStore()
  const {
    isUsersLoading,
    selectedChat,
    activeTab,
    setIsNewChatModalOpen,
    getFilteredUsers,
    unreadCounts
  } = useChatStore();

  const filteredUsers = getFilteredUsers();

  const getLatestMessage = (user) => {
    const latest = user?.latestMessage;
    if (!latest) return "No messages yet";
    if (latest.text) return latest.text;
    if (latest.image) return "📷 Image";
    return "No messages yet";
  }

  const handleTabsClass = (tab) => {
    if (activeTab === tab) {
      return "flex-1 py-1.5 text-xs font-medium rounded-md bg-primary text-slate-100 shadow-lg shadow-primary/20";
    }

    return "flex-1 py-1.5 text-xs font-medium rounded-md text-slate-400 hover:bg-slate-100 transition-colors";
  };

  const renderUserStatus = () => {
    return (
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary"
              style={{
                backgroundImage: `url("${authUser?.profilePicture || Avatar}")`,
              }}
            ></div>
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-sidebar-dark"></div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold leading-tight text-slate-100 dark:text-slate-900">
              {authUser?.fullName || "User"}
            </h2>
            <p className="text-slate-400 text-xs font-normal">Available</p>
          </div>
        </div>
      </div>
    );
  };

  const renderSearchBar = () => {
    return (
      <div className="px-4 py-2 my-3">
        <div className="flex w-full items-center rounded-lg bg-slate-100 dark:bg-card-dark px-3 py-2">
          <SearchIcon className="size-5 text-slate-500 mr-2" />
          <input
            className="flex-1 bg-transparent border-none text-sm focus:ring-0 focus:outline-none placeholder:text-slate-500 text-slate-900 p-0"
            placeholder="Search conversations..."
            onChange={() => { }}
          />
        </div>
      </div>
    );
  };

  const renderTabs = () => {
    return (
      <div className="flex gap-1 px-4 py-2 border-b border-slate-200 dark:border-slate-800 pb-4">
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
    if (!filteredUsers || !Array.isArray(filteredUsers) || filteredUsers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-in fade-in zoom-in duration-300">
          <div className="size-20 bg-base-100/10 border border-gray-600 rounded-full flex items-center justify-center mb-4 text-slate-400 ">
            <MessagesSquareIcon className="size-12" />
          </div>
          <h3 className="text-slate-900 dark:text-white font-semibold mb-1">
            No chats yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Press the "+" button to start a new conversation.
          </p>
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
              <div className="g-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 flex justify-center items-center border border-zinc-500">
                <Users className="size-6 text-zinc-200 " />
              </div>
              :
              <>
                <img
                  src={user?.profilePicture || Avatar}
                  alt={user?.fullName}
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                />
                {isUserOnline(user, onlineUsers, authUser) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </>
            }

          </div>

          {/* Chat Info */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                {getChatName(user, authUser) || "User"}
              </p>
              {user._id && unreadCounts[user._id.toString()] > 0 && (
                <span className="ml-2 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full">
                  {unreadCounts[user._id.toString()] > 99 ? "99+" : unreadCounts[user._id.toString()]}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-400 truncate">{getLatestMessage(user)}</p>
            </div>
          </div>
        </button>)
    });
  }


  return (
    <>
      {/* User Status */}
      {renderUserStatus()}

      {/* Searchbar */}
      {renderSearchBar()}

      {/* Tabs */}
      {renderTabs()}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-2 max-h-max">
        {isUsersLoading ? <ChatListPageSkeleton /> : renderConversations()}
      </div>

      <button
        onClick={() => setIsNewChatModalOpen(true)}
        className="absolute bottom-6 right-6 size-14 flex items-center justify-center bg-primary hover:bg-primary-hover text-slate-100 rounded-full transition-all active:scale-90 shadow-2xl shadow-primary/40 z-20 group"
      >
        <PlusIcon className="size-8 font-extrabold" />
      </button>
      <NewChatModal props={props} />
    </>
  )
}

export default ChatListPageView