import { useChatStore } from "../store/useChatStore.js";
import ChatContainer from "./chat/components/chatContainer/ChatContainer.jsx";
import ChatListPage from "./chat/components/chatListPage/ChatListPage.jsx";
import NoChatSelectedPage from "./chat/components/noChatSelected/NoChatSelectedPage.jsx";
import NewChatModal from "./chat/modals/newChatModal/NewChatModal.jsx";

const HomePage = () => {
  const { mobileView, selectedChat, isNewChatModalOpen } = useChatStore();

  return (
    <div className={`flex w-full relative overflow-hidden bg-base-500 lg:h-[calc(100vh-4rem)]`}>
      <aside
        className={`flex-shrink-0 h-full relative z-10 border-r border-zinc-500 transition-all duration-300 w-full lg:w-[400px] ${mobileView === "list" ? "block" : "hidden lg:block"}`}
      >
        <ChatListPage />
      </aside>

      <main
        className={`flex-1 flex flex-col min-w-0 h-screen lg:h-full ${mobileView === "chat" ? "block" : "hidden lg:flex"}`}
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
  );
};

export default HomePage;
