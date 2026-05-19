import { useChatStore } from "../store/useChatStore.js";
import ChatContainer from "./components/chatContainer/ChatContainer.jsx";
import ChatListPage from "./components/chatListPage/ChatListPage.jsx";
import NoChatSelectedPage from "./components/noChatSelected/NoChatSelectedPage.jsx";
import NewChatModal from "./modals/NewChatModal.jsx";


const HomePage = () => {
	const { mobileView, selectedChat, isNewChatModalOpen } = useChatStore();

	return (
		<div className={`flex h-screen w-full relative overflow-hidden bg-base-500 ${mobileView === 'chat' && 'pt-0 lg:pt-16'}`}>
			<aside
				className={`flex-shrink-0 h-full relative z-10 border-r border-slate-200 transition-all duration-300 w-full md:w-[300px] 
        ${mobileView === "list" ? "block" : "hidden md:block"}`}
			>
        <ChatListPage />
      </aside>

			<main
        className={`
          flex-1 flex flex-col min-w-0 h-full
          ${mobileView === "chat" ? "block" : "hidden md:flex"}
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
	);
};

export default HomePage;
