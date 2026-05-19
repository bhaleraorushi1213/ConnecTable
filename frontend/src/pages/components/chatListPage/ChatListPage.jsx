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
		getUnreadCounts
	} = useChatStore();

	useEffect(() => {
		getUsers();
		getUnreadCounts();
	}, []);

	const handleChangeTabs = (tab,) => {
		setActiveTab(tab);
	};

	const handleConversationClick = (user, chatId) => {
		setMobileView("chat");
		setSelectedChat(user);

		const socket = useAuthStore.getState().socket;
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
