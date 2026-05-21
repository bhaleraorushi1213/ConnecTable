import { ArrowLeft, InfoIcon, SearchIcon, Users, X } from "lucide-react";

import { useChatStore } from "../../../store/useChatStore.js";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { getChatName } from "../../../lib/utils.js";

import Avatar from "../../../assets/default-avatar.png";
import ChatInfoModal from "../../modals/chatInfoModal/ChatInfoModal.jsx";

const ChatHeaderView = () => {
  const { setMobileView, selectedChat, setSelectedChat, setIsSidebarOpen, isSidebarOpen } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();

  const chatName = getChatName(selectedChat, authUser);

  const otherUser = !selectedChat.isGroupChat
    ? selectedChat.users?.find((u) => u._id !== authUser._id)
    : selectedChat;

  const isOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-base-300/90 border-b shadow-sm shrink-0">
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
                  : isOnline ? "Online" : "Offline"
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
            className={` md:flex p-2 rounded-full transition-colors text-slate-100 hover:text-slate-400`}
          >
            <SearchIcon className="size-5" />
          </button>
          <button onClick={() => setSelectedChat(null)} className={`hidden lg:block md:flex p-2 rounded-full transition-colors text-slate-100 hover:text-slate-400`}>
            <X className="size-5" />
          </button>
        </div>
      </header>
      {isSidebarOpen && (
        <ChatInfoModal onClose={() => setIsSidebarOpen(false)} />
      )
      }
    </>
  )
}

export default ChatHeaderView