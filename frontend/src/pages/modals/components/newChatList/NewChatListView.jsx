import { useAuthStore } from "../../../../store/useAuthStore";
import { useChatStore } from "../../../../store/useChatStore";
import { ChevronRight, CircleX, Loader, SearchIcon } from "lucide-react";

import Avatar from "../../../../assets/default-avatar.png";


const NewChatListView = (props) => {
  const { handleContactClick, searchQuery, setSearchQuery, onNavigate } = props;
  const { setIsNewChatModalOpen } = useChatStore();
  const { onlineUsers, users, isSearchLoading } = useAuthStore();
  return (
    <>
      <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between backdrop-blur sticky top-0 z-10">
        <button
          onClick={() => {
            setSearchQuery("");
            setIsNewChatModalOpen(false);
          }}
          className="text-primary text-base font-medium active:opacity-70 transition-opacity"
        >
          Cancel
        </button>
        <h2 className="text-[17px] font-bold">
          New Chat
        </h2>
        <button className="text-primary text-base font-bold active:opacity-70 transition-opacity opacity-0 pointer-events-none">
          Done
        </button>
      </div>

      {/* search */}
      <div className="p-4 md:p-6 pb-2 bg-sidebar-dark">
        <div className="relative flex w-full items-center">
          <div className="absolute left-3 flex items-center pointer-events-none text-gray-400">
            <SearchIcon className="size-5" />
          </div>
          <input
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-card-dark border-none text-white placeholder-gray-500 text-[17px] focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 flex items-center"
            >
              <CircleX className="size-5 text-white"/>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-8 bg-sidebar-dark">
        <div className="px-4 py-2 space-y-1">
          <button
            onClick={() => onNavigate("newGroup")}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-card-dark transition-colors group text-left"
          >
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/15 text-primary group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[24px]">
                group_add
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-primary font-semibold text-[17px]">
                Create New Group
              </span>
            </div>
            <div className="ml-auto text-white">
              <ChevronRight className="size-6" />
            </div>
          </button>
        </div>

        <div className="mt-4">
          {/* initial state - no search yet */}
          {!searchQuery && (
            <div className="text-center py-12">
              <SearchIcon className="size-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-400">Search for users to start a conversation</p>
            </div>
          )}

          {/* searched but no results */}
          {searchQuery && !isSearchLoading && !users?.length && (
            <div className="text-center py-12">
              <p className="text-slate-400">No contacts found for "{searchQuery}"</p>
            </div>
          )}

          {/* loading state */}
          {isSearchLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="size-8 animate-spin text-primary" />
            </div>
          )}

          {!isSearchLoading && users?.length > 0 && (
            <div className="flex flex-col px-2 space-y-1">
              {users.map((contact) => (
                <button
                  key={contact._id}
                  onClick={() => {
                    handleContactClick(contact);

                    setIsNewChatModalOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-card-dark transition-colors w-full text-left group"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                      style={{
                        backgroundImage: `url(${contact?.profilePicture || Avatar})`,
                      }}
                    ></div>
                    {onlineUsers.includes(contact?._id) && (
                      <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-sidebar-dark"></div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-[17px] font-semibold text-white group-hover:text-primary transition-colors">
                      {contact.fullName}
                    </p>
                    <p className="text-sm text-slate-400 truncate">
                      {contact.email}
                    </p>
                  </div>
                  {/* Online status */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${onlineUsers.includes(contact?._id)
                      ? "bg-green-900/30 text-green-400"
                      : "bg-slate-800 text-slate-400"
                      }`}
                  >
                    {onlineUsers.includes(contact?._id) ? "Online" : "Offline"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NewChatListView