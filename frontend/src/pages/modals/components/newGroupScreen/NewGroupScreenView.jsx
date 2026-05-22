import { useAuthStore } from "../../../../store/useAuthStore.js";
import { Camera, Check, CircleX, Loader, Search, SearchIcon, Smile } from "lucide-react";
import Avatar from "../../../../assets/default-avatar.png"

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
    isCreating,
    selectedUsers,
    handleImageUpload,
    selectedImage
  } = props;
  const { onlineUsers, users, isSearchLoading } = useAuthStore();

  return (
    <>
      <header className="relative z-10 flex items-center justify-between md:p-6 p-4 bg-base-200/95 backdrop-blur-md top-0 border-b border-base-content/10">
        <button
          onClick={onBack}
          className="text-primary text-base font-medium active:opacity-70 transition-opacity"
        >
          Back
        </button>
        <h1 className="text-base-content text-[17px] font-bold leading-tight">
          New Group
        </h1>
        <button
          onClick={handleCreateGroup}
          disabled={!groupSubject.trim() || checkList.length < 2}
          className="text-primary text-base font-bold active:opacity-70 transition-opacity disabled:opacity-40"
        >
          {isCreating ? <span className="loading loading-spinner loading-xs" /> : "Create"}

        </button>
      </header>

      {checkList.length > 0 && (
        <div className="px-4 py-2 bg-base-200 text-xs text-primary">
          {checkList.length} participant{checkList.length > 1 ? "s" : ""} selected
        </div>
      )}

      <div className="relative z-10 flex-1 overflow-y-auto pb-8 bg-base-200">
        {/* Group subject */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-4">
            <label htmlFor="group-image" className="relative shrink-0 group cursor-pointer">
              {selectedImage ?
                <img src={selectedImage} className="object-cover size-[68px] rounded-full bg-[#2a2736] flex items-center justify-center text-gray-500 border border-base-content/10 hover:bg-base-300 transition-colors" />
                :
                <div className="size-[68px] rounded-full bg-[#2a2736] flex items-center justify-center text-gray-500 border border-base-content/10 hover:bg-base-300 transition-colors">
                  <Camera className="size-10 text-center" />
                </div>
              }
              <input
                id="group-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <div className="flex-1 border-b border-base-content/10 focus-within:border-primary transition-colors pb-1">
              <input
                className="w-full bg-transparent border-none outline-none p-0 text-[17px] text-base-content placeholder-gray-400 focus:ring-0 focus:outline-none"
                placeholder="Group Subject"
                type="text"
                onChange={(e) => setGroupSubject(e.target.value)}
                value={groupSubject}
              />
            </div>
            <button className="shrink-0 text-base-content/60 hover:text-primary transition-colors">
              <Smile className="size-6" />
            </button>
          </div>
          <div className="mt-2 pl-[84px] text-xs text-gray-500">
            Provide a subject and optional group icon
          </div>
        </div>

        {/* Participants chips */}
        {checkList.length > 0 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-base-content/10">
            {checkList.map((id) => {
              const contact = selectedUsers.find((u) => u._id === id);
              if (!contact) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-1.5 bg-primary/20 text-primary text-xs px-2.5 py-1 rounded-full"
                >
                  <img
                    src={contact.profilePicture || Avatar}
                    className="size-4 rounded-full object-cover"
                  />
                  <span>{contact.fullName}</span>
                  <button
                    onClick={() => handleCheck(contact)}
                    className="text-primary hover:text-base-content transition-colors"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Search bar */}
        <div className="sticky top-0 z-30 bg-base-200 px-4 py-2 border-b border-base-content/10">
          <div className="relative flex w-full items-center">
            <div className="absolute left-3 flex items-center pointer-events-none text-gray-500">
              <Search className="size-5" />
            </div>
            <input
              className="w-full outline-none h-9 pl-10 pr-4 rounded-lg bg-base-300 border-none text-base-content placeholder-gray-400 text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
                <CircleX className="size-5 text-base-content" />
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

            {isSearchLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader className="size-8 animate-spin text-primary" />
              </div>
            )}

            {!searchQuery && !(checkList.length > 0) && (
              <div className="text-center py-12">
                <SearchIcon className="size-10 text-base-content/60 mx-auto mb-3" />
                <p className="text-base-content/60">Search for users to add</p>
              </div>
            )}

            {!isSearchLoading && searchQuery && users.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-8">
                No users found
              </p>
            )}

            {users.map((contact) => (
              <button
                key={contact._id}
                className={
                  "flex items-center gap-3 p-2 rounded-xl hover:bg-surface-hover transition-colors w-full text-left group"
                }
                onClick={() => handleCheck(contact)}
              >
                <div className="relative shrink-0">
                  <img
                    src={contact.profilePicture || Avatar}
                    className="h-12 w-12 rounded-full object-cover bg-center border border-base-content/10"
                  />
                  {onlineUsers.includes(contact._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-background-dark rounded-full"></span>
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-base-content text-[17px] font-semibold truncate">
                    {contact.fullName}
                  </p>
                  <p className="text-gray-400 text-[15px] truncate">
                    {onlineUsers.includes(contact._id) ? "Online" : "Offline"}
                  </p>
                </div>
                <div className="shrink-0 pr-2">
                  <div
                    className={`size-6 text-base-content rounded-full ${checkList.includes(contact._id) ? "bg-primary border border-primary flex items-center justify-center transition-all scale-100 opacity-100" : " border-2 border-gray-600 group-hover:border-primary/50 transition-colors"}`}
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