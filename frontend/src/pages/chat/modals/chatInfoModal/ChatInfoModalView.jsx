import { useAuthStore } from "../../../../store/useAuthStore.js";
import { useChatStore } from "../../../../store/useChatStore.js";

import { Camera, Crown, LogOut, Pencil, UserMinus, UserPlus, Users, X } from "lucide-react";
import Avatar from "../../../../assets/default-avatar.png";
import AddMemberModal from "../addMemberModal/AddMemberModal.jsx";

const ChatInfoModalView = (props) => {
  const {
    isLoading,
    handleLeave,
    handleRemove,
    showAddMember,
    setShowAddMember,
    isEditing,
    setIsEditing,
    newGroupName,
    setNewGroupName,
    isUpdating,
    handleUpdateGroup,
    handleImageChange,
    selectedImg,
    onClose,
  } = props;
  const { selectedChat } = useChatStore();
  const { authUser } = useAuthStore();

  const isAdmin = selectedChat?.groupAdmin?._id === authUser._id ||
    selectedChat?.groupAdmin === authUser._id;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-300">
        <div className="bg-base-200 rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">

          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
            <h2 className="text-base-content font-bold text-lg">Group Info</h2>
            <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
              <X className="size-5" />
            </button>
          </div>

          {/* group avatar and name */}
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="relative">
              <div className="size-20 rounded-full bg-base-300 flex items-center justify-center border border-base-300/60 overflow-hidden">
                {selectedChat?.profilePicture ? (
                  <img
                    src={selectedImg || selectedChat?.profilePicture}
                    className="size-full object-cover"
                  />
                ) : (
                  <Users className="size-10 text-base-300/50" />
                )}

              </div>
              {isAdmin && (
                <>
                  <label
                    htmlFor="group-image"
                    className="absolute bottom-0 right-0 size-7 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-hover transition-colors"
                  >
                    <Camera className="size-4 text-base-content" />
                  </label>
                  <input
                    id="group-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </>
              )}
            </div>

            {isUpdating && (
              <div className="text-xs animate-pulse text-base-content">
                Uploading please don't close the group info screen
              </div>

            )}

            {/* editable group name */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="input input-sm input-bordered text-center text-base-content bg-base-300"
                  autoFocus
                />
                <button
                  onClick={handleUpdateGroup}
                  disabled={isUpdating}
                  className="btn btn-primary btn-sm"
                >
                  {isUpdating
                    ? <span className="loading loading-spinner loading-xs" />
                    : "Save"
                  }
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewGroupName(selectedChat?.chatName);
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-base-content text-xl font-bold">
                  {selectedChat?.chatName}
                </h3>
                {isAdmin && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-base-content/60 hover:text-primary transition-colors"
                  >
                    <Pencil className="size-4" />
                  </button>
                )}
              </div>
            )}
            <p className="text-base-content/60 text-sm">
              {selectedChat?.users?.length} members
            </p>
          </div>

          <div className="flex items-center justify-between px-4 mb-3">
            <p className="text-base-content/60 text-xs font-bold uppercase tracking-wider">
              Members
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowAddMember(true)}
                className="flex items-center gap-1 text-primary text-xs font-medium hover:opacity-80"
              >
                <UserPlus className="size-3.5" />
                Add
              </button>
            )}
          </div>
          {/* members list */}
          <div className="px-4 pb-4 max-h-60 overflow-y-auto">
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
                      <p className="text-base-content text-sm font-semibold truncate">
                        {isSelf ? "You" : user.fullName}
                      </p>
                      <p className="text-base-content/60 text-xs truncate">
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
          <div className="px-4 pb-4 border-t border-base-300 pt-4">
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

      {showAddMember && (
        <AddMemberModal onClose={() => setShowAddMember(false)} />
      )}
    </>
  )
}

export default ChatInfoModalView;