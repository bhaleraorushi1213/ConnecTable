import { useAuthStore } from "../../../../store/useAuthStore.js";
import { Camera, Check, CircleX, Loader, Search, SearchIcon, Smile } from "lucide-react";

const NewGroupScreenView = (props) => {
  const {
    onBack,
    checkList,
    groupSubject,
    setGroupSubject,
    handleCheck,
    handleCreateGroup,
    searchQuery,
    setSearchQuery,
  } = props;
  const { onlineUsers, users, isSearchLoading } = useAuthStore();
  return (
    <>
      <header className="relative z-10 flex items-center justify-between px-4 py-3 bg-sidebar-dark/95 backdrop-blur-md top-0 border-b border-white/5">
        <button
          onClick={onBack}
          className="text-primary text-base font-medium active:opacity-70 transition-opacity"
        >
          Back
        </button>
        <h1 className="text-white text-[17px] font-bold leading-tight">
          New Group
        </h1>
        <button
          onClick={handleCreateGroup}
          disabled={!groupSubject.trim() || checkList.length < 2}
          className="text-primary text-base font-bold active:opacity-70 transition-opacity disabled:opacity-40"
        >
          Create
        </button>
      </header>

      {checkList.length > 0 && (
        <div className="px-4 py-2 bg-sidebar-dark text-xs text-primary">
          {checkList.length} participant{checkList.length > 1 ? "s" : ""} selected
        </div>
      )}

      <div className="relative z-10 flex-1 overflow-y-auto pb-8 bg-sidebar-dark">
        <div className="px-5 py-6">
          <div className="flex items-center gap-4">
            <button className="relative shrink-0 group">
              <div className="size-[68px] rounded-full bg-[#2a2736] flex items-center justify-center text-gray-500 border border-white/5 hover:bg-card-dark transition-colors">
                <Camera className="size-10 text-center" />
              </div>
            </button>
            <div className="flex-1 border-b border-white/10 focus-within:border-primary transition-colors pb-1">
              <input
                className="w-full bg-transparent border-none outline-none p-0 text-[17px] text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
                placeholder="Group Subject"
                type="text"
                onChange={(e) => setGroupSubject(e.target.value)}
                value={groupSubject}
              />
            </div>
            <button className="shrink-0 text-slate-400 hover:text-primary transition-colors">
              <Smile className="size-6" />
            </button>
          </div>
          <div className="mt-2 pl-[84px] text-xs text-gray-500">
            Provide a subject and optional group icon
          </div>
        </div>

        <div className="sticky top-0 z-30 bg-sidebar-dark/95 backdrop-blur-sm px-4 py-2 border-b border-white/5">
          <div className="relative flex w-full items-center">
            <div className="absolute left-3 flex items-center pointer-events-none text-gray-500">
              <Search className="size-5" />
            </div>
            <input
              className="w-full outline-none h-9 pl-10 pr-4 rounded-lg bg-card-dark border-none text-white placeholder-gray-400 text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Add Participants"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 flex items-center"
              >
                <CircleX className="size-5 text-white" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-2">
          <div className="px-4 py-2">
            <h3 className="text-gray-400 text-xs font-bold tracking-wider uppercase">
              Suggested
            </h3>
          </div>
          <div className="flex flex-col px-2 space-y-1">
            {!searchQuery && (
              <div className="text-center py-12">
                <SearchIcon className="size-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-400">Search for users to add</p>
              </div>
            )}

            {searchQuery && users.length === 0 && !isSearchLoading && (
              <p className="text-center text-gray-500 text-sm py-8">
                No users found
              </p>
            )}

            {isSearchLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader className="size-8 animate-spin text-primary" />
              </div>
            )}

            {users.map((contact) => (
              <button
                key={contact._id}
                className={
                  "flex items-center gap-3 p-2 rounded-xl hover:bg-surface-hover transition-colors w-full text-left group"
                }
                onClick={() => handleCheck(contact._id)}
              >
                <div className="relative shrink-0">
                  <div
                    className="h-12 w-12 rounded-full bg-cover bg-center border border-white/10"
                    style={{
                      backgroundImage: `url(${contact.profilePicture || "/avatar.png"})`,
                    }}
                  />
                  {onlineUsers.includes(contact._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-background-dark rounded-full"></span>
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-white text-[17px] font-semibold truncate">
                    {contact.fullName}
                  </p>
                  <p className="text-gray-400 text-[15px] truncate">
                    {onlineUsers.includes(contact._id) ? "Online" : "Offline"}
                  </p>
                </div>
                <div className="shrink-0 pr-2">
                  <div
                    className={`size-6 text-white rounded-full ${checkList.includes(contact._id) ? "bg-primary border border-primary flex items-center justify-center transition-all scale-100 opacity-100" : " border-2 border-gray-600 group-hover:border-primary/50 transition-colors"}`}
                  >
                    {checkList.includes(contact._id) && (
                      <Check className="size-4" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default NewGroupScreenView