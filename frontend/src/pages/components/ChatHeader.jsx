import { ChevronLeft, SearchIcon, X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import Avatar from "../../assets/default-avatar.png";

const ChatHeader = () => {
  const { setMobileView, selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-base-300/90 border-b shadow-sm shrink-0">
      <div className="flex items-center gap-3 cursor-pointer">
        <button
          onClick={() => {
            setMobileView("list")
            setSelectedUser(null)
          }}
          className="md:hidden -ml-2 p-2 hover:bg-base-100/10 rounded-full"
        >
          <ChevronLeft className="size-8 text-white" />
        </button>
        <div
          className="flex items-center gap-3"
        >
          <div className="relative">
            <img
              src={selectedUser?.profilePicture || Avatar}
              alt={selectedUser.fullName}
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {selectedUser?.fullName || "User"}
            </h2>
            <p className={`text-sm ${onlineUsers.includes(selectedUser?._id) ? "text-slate-100" : "text-base-content/70"}`}>
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 md:gap-4">
        <button
          className={` md:flex p-2 rounded-full transition-colors text-slate-100 hover:text-slate-400`}
        >
          <SearchIcon className="size-5" />
        </button>
        <button onClick={() => setSelectedUser(null)} className={` md:flex p-2 rounded-full transition-colors text-slate-100 hover:text-slate-400`}>
          <X className="size-5" />
        </button>
      </div>
    </header>
  )
}

export default ChatHeader;