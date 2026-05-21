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
  isSidebarOpen: false,
  mobileView: "list",
  activeTab: "all",
  replyingTo: null,

  setReplyingTo: (message) => set({ replyingTo: message }),

  clearReplyingTo: () => set({ replyingTo: null }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setMobileView: (view) => set({ mobileView: view }),

  setIsTyping: (value) => set({ isTyping: value }),

  setIsSidebarOpen: (value) => set({ isSidebarOpen: value }),

  setIsNewChatModalOpen: (value) => set({ isNewChatModalOpen: value }),

  setSelectedChat: async (chat) => {
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
      set({
        selectedChat: res.data,
        isNewChatModalOpen: false,
        mobileView: "chat",
      });
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
    const { selectedChat, messages, users, replyingTo } = get();

    if (!selectedChat) {
      toast.error("No chat selected");
      return;
    }

    set({ isMessageSending: true });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedChat._id}`, { ...messageData, replyTo: replyingTo?._id || null });

      const updatedUsers = users.map((chat) =>
        chat._id === selectedChat._id
          ? { ...chat, latestMessage: res.data }
          : chat
      );

      set({
        messages: [...messages, res.data],
        users: updatedUsers,
        replyingTo: null
      });
    } catch (error) {
      console.log("Error in sendMessages", error);
      toast.error("Failed to send messages. Please try again.");
    } finally {
      set({ isMessageSending: false });
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      const { messages } = get();
      set({ messages: messages.filter((m) => m._id !== messageId) });
    } catch (error) {
      console.log("Error in deleteMessage", error);
      toast.error("Failed to delete message");
    }
  },

  reactToMessage: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.put(
        `/messages/react/${messageId}`,
        { emoji }
      );

      // update message in messages array
      const { messages } = get();
      set({
        messages: messages.map((m) =>
          m._id === messageId ? res.data : m
        ),
      });
    } catch (error) {
      console.log("Error in reactToMessage", error);
      toast.error("Failed to react to message");
    }
  },

  updateGroup: async (data) => {
    try {
      const res = await axiosInstance.put("/chat/group/update", data);

      const { users } = get();

      set({
        selectedChat: res.data,
        users: users.map((u) => u._id === res.data._id ? res.data : u),
      });
    } catch (error) {
      console.log("Error in updateGroup", error);
      toast.error("Failed to update group");
    }
  },

  addMemberToGroup: async (chatId, userId) => {
    try {
      const res = await axiosInstance.put("/chat/group/add", {
        chatId,
        userId,
      });

      // update selectedChat and users list
      const { users } = get();
      set({
        selectedChat: res.data,
        users: users.map((u) => u._id === chatId ? res.data : u),
      });
    } catch (error) {
      console.log("Error in addMemberToGroup", error);
      toast.error("Failed to add member");
    }
  },

  removeFromGroup: async (chatId, userId) => {
    try {
      const res = await axiosInstance.put("/chat/group/delete", {
        chatId,
        userId,
      });

      // update the selected chat with new users list
      set({ selectedChat: res.data });

      // update in users list too
      const { users } = get();
      const updatedUsers = users.map((u) =>
        u._id === chatId ? res.data : u
      );
      set({ users: updatedUsers });

      toast.success("Member removed");
    } catch (error) {
      console.log("Error in removeFromGroup", error);
      toast.error("Failed to remove member");
    }
  },

  leaveGroup: async (chatId) => {
    const { authUser } = useAuthStore.getState();
    try {
      await axiosInstance.put("/chat/group/delete", {
        chatId,
        userId: authUser._id,
      });

      // remove from users list and clear selected chat
      const { users } = get();
      set({
        users: users.filter((u) => u._id !== chatId),
        selectedChat: null,
        mobileView: "list",
      });

      toast.success("Left group successfully");
    } catch (error) {
      console.log("Error leaving group", error);
      toast.error("Failed to leave group");
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
    });

    socket.on("messageDeleted", ({ messageId }) => {
      const { messages } = get();
      set({ messages: messages.filter((m) => m._id !== messageId) });
    });

    socket.on("messageReaction", (updatedMessage) => {
      const { messages } = get();
      set({
        messages: messages.map((m) =>
          m._id === updatedMessage._id ? updatedMessage : m
        ),
      });
    });

    socket.on("addedToGroup", (newChat) => {
      const { users } = get();
      const exists = users.find((u) => u._id === newChat._id);
      if (!exists) {
        set({ users: [newChat, ...users] });
      }
      toast.success(`You were added to ${newChat.chatName}`);
    });

    socket.on("removedFromGroup", (chatId) => {
      const { users, selectedChat } = get();
      set({ users: users.filter((u) => u._id !== chatId) });

      if (selectedChat?._id === chatId) {
        set({ selectedChat: null, mobileView: "list" });
        toast.error("You were removed from the group");
      }
    });

    socket.on("groupUpdated", (updatedChat) => {
      const { users } = get();
      set({
        users: users.map((u) => u._id === updatedChat._id ? updatedChat : u),
        selectedChat: updatedChat,
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeleted");
    socket.off("messageReaction");
    socket.off("removedFromGroup");
    socket.off("addedToGroup");
    socket.off("groupUpdated");
  },
}));