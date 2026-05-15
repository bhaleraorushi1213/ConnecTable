import { useChatStore } from "../store/useChatStore.js";
import ChatContainer from "./components/ChatContainer.jsx";
import ChatListPage from "./components/ChatListPage.jsx";
import NoChatSelectedPage from "./components/NoChatSelectedPage.jsx";

const HomePage = () => {
	const { mobileView, selectedUser } = useChatStore();

	return (
		<div className="flex h-screen w-full relative overflow-hidden bg-base-500 pt-16">
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
        {selectedUser ? (
          <ChatContainer />
        ) : (
          <NoChatSelectedPage
            // isNewChatModalOpen={isNewChatModalOpen}
            // setIsNewChatModalOpen={setIsNewChatModalOpen}
          />
        )}
      </main>
		</div>
	);
};

export default HomePage;
