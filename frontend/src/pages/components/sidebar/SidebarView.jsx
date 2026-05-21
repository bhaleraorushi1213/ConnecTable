import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";

import { Crown, LogOut, UserMinus, Users, X } from "lucide-react";
import Avatar from "../../../assets/default-avatar.png";

const SidebarView = (props) => {
  const {
    isLoading,
    handleLeave,
    handleRemove,
    onClose
  } = props;
  const { selectedChat } = useChatStore();
  const { authUser } = useAuthStore();

  const isAdmin = selectedChat?.groupAdmin?._id === authUser._id ||
    selectedChat?.groupAdmin === authUser._id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-base-200 rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">

        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h2 className="text-white font-bold text-lg">Group Info</h2>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <X className="size-5" />
          </button>
        </div>

        {/* group avatar and name */}
        <div className="flex flex-col items-center py-6 gap-3">
          <div className="size-20 rounded-full bg-base-300 flex items-center justify-center border border-zinc-600">
            <Users className="size-10 text-zinc-300" />
          </div>
          <h3 className="text-white text-xl font-bold">
            {selectedChat?.chatName}
          </h3>
          <p className="text-slate-400 text-sm">
            {selectedChat?.users?.length} members
          </p>
        </div>

        {/* members list */}
        <div className="px-4 pb-4 max-h-60 overflow-y-auto">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            Members
          </p>
          <div className="flex flex-col gap-2">
            {selectedChat?.users?.map((user) => {
              const isGroupAdmin =
                selectedChat?.groupAdmin?._id === user._id ||
                selectedChat?.groupAdmin === user._id;
              const isSelf = user._id === authUser._id;

              return (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-300 transition-colors"
                >
                  <img
                    src={user.profilePicture || Avatar}
                    alt={user.fullName}
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">
                      {isSelf ? "You" : user.fullName}
                    </p>
                    <p className="text-slate-400 text-xs truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* admin badge */}
                  {isGroupAdmin && (
                    <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
                      <Crown className="size-3" />
                      Admin
                    </span>
                  )}

                  {/* remove button - only admin can remove, can't remove self or admin */}
                  {isAdmin && !isSelf && !isGroupAdmin && (
                    <button
                      onClick={() => handleRemove(user._id)}
                      className="btn btn-ghost btn-circle btn-xs text-red-400 hover:text-red-300"
                    >
                      <UserMinus className="size-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* leave group button */}
        <div className="px-4 pb-4 border-t border-slate-700 pt-4">
          <button
            onClick={handleLeave}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-medium text-sm"
          >
            {isLoading
              ? <span className="loading loading-spinner loading-xs" />
              : <LogOut className="size-4" />
            }
            Leave Group
          </button>
        </div>
      </div>
    </div>
  )
}

export default SidebarView