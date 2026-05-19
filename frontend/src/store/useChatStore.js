import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";
import { SOCKET_EVENTS } from "../constants";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  unreadCounts: {},
  selectedChat: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageSending: false,
  isNewChatModalOpen: false,
  isTyping: false,
  mobileView: "list",
  activeTab: "all",

  setActiveTab: (tab) => set({ activeTab: tab }),

  setMobileView: (view) => set({ mobileView: view }),

  setIsTyping: (value) => set({ isTyping: value }),

  setIsNewChatModalOpen: (value) => set({ isNewChatModalOpen: value }),

  setSelectedChat: async (chat) => {
    if (!chat) return;

    set({ selectedChat: chat });
    get().clearUnreadCount(chat?._id);

    try {
      await axiosInstance.put(`/messages/markAsRead/${chat._id}`);
    } catch (error) {
      console.log("Error marking messages as read", error);
    }
  },

  createNewChat: async (data) => {
    try {
      const endpoint = data.isGroupChat ? "/chat/group/create" : "/chat/";
      const res = await axiosInstance.post(endpoint, data);

      get().addChat(res.data);
      set({ selectedChat: res.data, isNewChatModalOpen: false });
    } catch (error) {
      console.log("Error in createNewChat", error);
      toast.error("Failed to create new chat. Please try again.");
    }
  },

  addChat: (newChat) => {
    const { users } = get();
    // avoid duplicates
    const exists = users.find((u) => u._id === newChat._id);
    if (!exists) {
      set({ users: [newChat, ...users] });
    }
  },

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/chat/");
      set({ users: res.data });
    } catch (error) {
      console.log("Error in getUsers", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getFilteredUsers: () => {
    const { users, activeTab } = get();
    if (activeTab === "all") return users;
    if (activeTab === "direct") return users.filter((u) => !u.isGroupChat);
    if (activeTab === "group") return users.filter((u) => u.isGroupChat);
    return users;
  },

  getMessages: async (chatId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${chatId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in getMessages", error);
      toast.error("Failed to load messages. Please try again.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedChat, messages, users } = get();

    if (!selectedChat) {
      toast.error("No chat selected");
      return;
    }

    set({ isMessageSending: true });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedChat._id}`, messageData);

      const updatedUsers = users.map((chat) =>
        chat._id === selectedChat._id
          ? { ...chat, latestMessage: res.data }
          : chat
      );

      set({ messages: [...messages, res.data], users: updatedUsers, });
    } catch (error) {
      console.log("Error in sendMessages", error);
      toast.error("Failed to send messages. Please try again.");
    } finally {
      set({ isMessageSending: false });
    }
  },

  getUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/messages/unreadCount");
      const counts = Object.entries(res.data).reduce((acc, [key, val]) => {
        acc[key.toString()] = val;
        return acc;
      }, {});
      set({ unreadCounts: counts });
    } catch (error) {
      console.log("Error in getUnreadCounts", error);
    }
  },

  clearUnreadCount: (chatId) => {
    const { unreadCounts } = get();
    const updated = { ...unreadCounts };
    delete updated[chatId?.toString()];
    set({ unreadCounts: updated });
  },

  subscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket || !socket.connected) {
      console.log("Socket not connected");
      return;
    }

    socket.on(SOCKET_EVENTS.TYPING, (senderId) => {
      const authUser = useAuthStore.getState().authUser;

      if (senderId?.toString() === authUser._id?.toString()) return;

      set({ isTyping: true });
    });

    socket.on(SOCKET_EVENTS.STOP_TYPING, (senderId) => {
      const authUser = useAuthStore.getState().authUser;

      if (senderId?.toString() === authUser._id?.toString()) return;

      set({ isTyping: false });
    });
  },

  unsubscribeFromTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off(SOCKET_EVENTS.TYPING);
    socket.off(SOCKET_EVENTS.STOP_TYPING);
  },

  subscribeToMessages: (selectedChat) => {
    if (!selectedChat) return;

    const socket = useAuthStore.getState().socket;

    if (!socket || !socket.connected) {
      console.log("Socket not connected");
      return;
    }

    socket.on("newMessage", (newMessage) => {
      const { users, unreadCounts } = get();

      const newMessageChatId =
        typeof newMessage.chat === "object"
          ? newMessage.chat._id.toString()
          : newMessage.chat.toString();

      const updatedUsers = users.map((chat) =>
        chat._id.toString() === newMessageChatId
          ? { ...chat, latestMessage: newMessage }
          : chat
      );

      if (newMessageChatId !== selectedChat._id.toString()) {
        set({
          users: updatedUsers,
          unreadCounts: {
            ...unreadCounts,
            [newMessageChatId]: (unreadCounts[newMessageChatId] || 0) + 1,
          },
        });
        return;
      };

      set({
        messages: [...get().messages, newMessage],
        users: updatedUsers,
        isTyping: false,
      });
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));