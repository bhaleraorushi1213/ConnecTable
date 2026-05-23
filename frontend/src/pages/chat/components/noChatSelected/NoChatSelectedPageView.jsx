import { useChatStore } from "../../../../store/useChatStore.js";
import { CircleFadingPlusIcon, MessagesSquareIcon } from "lucide-react";

const NoChatSelectedPageView = () => {
  const { setIsNewChatModalOpen } = useChatStore();
  
  return (
    <main
      className={`flex-col relative overflow-hidden h-full flex-1
      flex`}
    >
      <div className="flex flex-col items-center justify-center h-full w-full text-center p-8 animate-in fade-in zoom-in duration-300">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
          <div className="relative size-32 rounded-[32px] bg-base-300/90 shadow-2xl flex items-center justify-center border border-base-100 rotate-3 transition-transform group-hover:rotate-6">
            <MessagesSquareIcon className="size-16" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-base-900  mb-3">
          Welcome to ConnecTable
        </h1>
        <p className="text-base-content/40 dark:text-base-content/60 max-w-md text-lg leading-relaxed mb-10">
          Select a conversation from the sidebar or start a new one to begin
          messaging.
        </p>
        <button
          onClick={() => setIsNewChatModalOpen(true)}
          className="px-8 py-4 bg-primary hover:bg-primary-hover text-base-300 rounded-2xl font-bold text-base shadow-xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3 hover:-translate-y-1"
        >
          <CircleFadingPlusIcon className="size-6" />
          Start New Conversation
        </button>
      </div>
    </main>
  )
}

export default NoChatSelectedPageView