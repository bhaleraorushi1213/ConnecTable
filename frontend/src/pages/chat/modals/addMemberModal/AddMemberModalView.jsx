import { useAuthStore } from "../../../../store/useAuthStore.js";

import { X, Search } from "lucide-react";
import Avatar from "../../../../assets/default-avatar.png";

const AddMemberModal = (props) => {
  const {
    searchQuery,
    isAdding,
    setSearchQuery,
    selectedUsers,
    handleToggle,
    availableUsers,
    handleAdd,
    onClose
  } = props;

  const { users } = useAuthStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-base-200 rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">

        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <X className="size-5" />
          </button>
          <h2 className="text-base-content font-bold text-lg">Add Members</h2>
          <button
            onClick={handleAdd}
            disabled={!selectedUsers?.length || isAdding}
            className="text-primary font-bold text-sm disabled:opacity-40"
          >
            {isAdding
              ? <span className="loading loading-spinner loading-xs" />
              : "Add"
            }
          </button>
        </div>

        {/* selected chips */}
        {selectedUsers?.length > 0 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-base-300">
            {selectedUsers.map((id) => {
              const user = users.find((u) => u._id === id);
              if (!user) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-1.5 bg-primary/20 text-primary text-xs px-2.5 py-1 rounded-full"
                >
                  <img
                    src={user.profilePicture || Avatar}
                    alt={user?.fullName}
                    className="size-4 rounded-full object-cover"
                  />
                  <span>{user.fullName}</span>
                  <button onClick={() => handleToggle(id)}>✕</button>
                </div>
              );
            })}
          </div>
        )}

        {/* search */}
        <div className="px-4 py-3 border-b border-base-300">
          <div className="flex items-center gap-2 bg-base-300 rounded-lg px-3 py-2">
            <Search className="size-4 text-base-content/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="flex-1 bg-transparent text-sm text-base-content placeholder:text-base-content/40 outline-none"
            />
          </div>
        </div>

        {/* user list */}
        <div className="max-h-72 overflow-y-auto px-2 py-2">
          {!searchQuery && (
            <p className="text-center text-base-content/40 text-sm py-8">
              Search for people to add
            </p>
          )}
          {searchQuery && availableUsers.length === 0 && (
            <p className="text-center text-base-content/40 text-sm py-8">
              No users found
            </p>
          )}
          {availableUsers?.map((user) => (
            <button
              key={user._id}
              onClick={() => handleToggle(user._id)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-base-300 transition-colors"
            >
              <img
                src={user.profilePicture || Avatar}
                className="size-10 rounded-full object-cover"
              />
              <div className="flex-1 text-left min-w-0">
                <p className="text-base-content text-sm font-semibold truncate">
                  {user.fullName}
                </p>
                <p className="text-base-content/60 text-xs truncate">{user.email}</p>
              </div>
              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all
                ${selectedUsers.includes(user._id)
                  ? "bg-primary border-primary"
                  : "border-slate-600"
                }`}
              >
                {selectedUsers.includes(user._id) && (
                  <span className="text-base-content text-xs">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;