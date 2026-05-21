import { useEffect } from "react";

import { useChatStore } from "../../../store/useChatStore.js";
import { useAuthStore } from "../../../store/useAuthStore.js";

import ChatListPageView from "./ChatListPageView.jsx";

const ChatListPage = (props) => {
	const {
		setActiveTab,
		getUsers,
		setSelectedChat,
		setMobileView,
		getUnreadCounts,
		subscribeToGlobalMessages,
    unsubscribeFromGlobalMessages,
	} = useChatStore();

	const { socket } = useAuthStore();

	useEffect(() => {
		getUsers();
		getUnreadCounts();
	}, []);

	useEffect(() => {
		if (!socket) return;

		if (socket.connected) {
      subscribeToGlobalMessages();
    } else {
      socket.once("connect", subscribeToGlobalMessages);
    }

    return () => {
      unsubscribeFromGlobalMessages();
      socket.off("connect", subscribeToGlobalMessages);
    };
  }, [socket]);

	const handleChangeTabs = (tab,) => {
		setActiveTab(tab);
	};

	const handleConversationClick = (user, chatId) => {
		setMobileView("chat");
		setSelectedChat(user);

		const { socket } = useAuthStore.getState();
		if (!socket) {
			console.error("Socket not initialized");
			return;
		}
		socket.emit("joinChat", chatId);
	}


	return (
		<ChatListPageView
			{...props}
			{...{ handleChangeTabs, handleConversationClick }}
		/>
	);
};

export default ChatListPage;
