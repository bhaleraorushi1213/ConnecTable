const ChatListPageSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <>
      {/* Skeleton Contacts */}
      <div className="px-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className=" p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-14 lg:size-12 md:size-12 rounded-full" />
            </div>
            {/* user info skeleton */}
            <div className=" text-center sm:text-left flex-1">
              <div className="skeleton h-5 w-32 md:w-32 md:h-4 mb-2" />
              <div className="skeleton h-5 w-16 md:w-16 md:h-3" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ChatListPageSkeleton