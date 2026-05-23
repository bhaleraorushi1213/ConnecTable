import { useChatStore } from "../../../store/useChatStore";
import ChatContainer from "../components/chatContainer/ChatContainer";
import ChatListPage from "../components/chatListPage/ChatListPage";
import NoChatSelectedPage from "../components/noChatSelected/NoChatSelectedPage";
import NewChatModal from "../modals/newChatModal/NewChatModal";


const HomePageView = () => {
  const { mobileView, selectedChat, isNewChatModalOpen } = useChatStore();
  return (
    <div className={`flex h-screen w-full relative overflow-hidden bg-base-500  ${mobileView === 'chat' ? 'pt-0 lg:pt-16' : "pt-16"}`}>
      <aside
        className={`flex-shrink-0 h-full relative z-10 border-r border-zinc-500 transition-all duration-300 w-full md:w-[400px] 
        ${mobileView === "list" ? "block" : "hidden lg:block"}`}
      >
        <ChatListPage />
      </aside>

      <main
        className={`
          flex-1 flex flex-col min-w-0 h-full
          ${mobileView === "chat" ? "block" : "hidden lg:flex"}
        `}
      >
        {selectedChat ? (
          <ChatContainer />
        ) : (
          <NoChatSelectedPage />
        )}
      </main>

      {isNewChatModalOpen && (
        <NewChatModal />
      )}
    </div>
  )
}

export default HomePageView