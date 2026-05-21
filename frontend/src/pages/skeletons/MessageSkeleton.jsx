

const MessageSkeleton = () => {
  const skeletonMessages = Array(5).fill(null);

  return (
    <div className="flex-1 flex flex-col py-4 px-4">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </div>

          <div className="chat-header mb-1">
            <div className="skeleton h-3 w-14 md:h-4 md:w-16" />
          </div>

          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-14 w-40 md:h-16 md:w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageSkeleton