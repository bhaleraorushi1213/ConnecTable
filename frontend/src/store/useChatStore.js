import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
import { useThemeStore } from "./useThemeStore.js";

import { playSound } from "../lib/sounds.js";
import { showBrowserNotification } from "../lib/notifications.js";

import { SOCKET_EVENTS } from "../constants";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  unreadCounts: {},
  searchResults: [],
  selectedChat: null,
  replyingTo: null,
  forwardingMessage: null,
  searchQuery: "",
  mobileView: "list",
  activeTab: "all",
  currentPage: 1,
  conversationSearch: "",
  hasMoreMessages: false,
  isLoadingMoreMessages: false,
  isSearching: false,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageSending: false,
  isNewChatModalOpen: false,
  isTyping: false,
  isSidebarOpen: false,
  groupNotifications: [],

  setConversationSearch: (query) => set({ conversationSearch: query }),

  setSearchResults: (results) => set({ searchResults: results }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setReplyingTo: (message) => set({ replyingTo: message }),

  clearReplyingTo: () => set({ replyingTo: null }),

  setForwardingMessage: (message) => set({ forwardingMessage: message }),

  clearForwardingMessage: () => set({ forwardingMessage: null }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setMobileView: (view) => set({ mobileView: view }),

  setIsTyping: (value) => set({ isTyping: value }),

  setIsSidebarOpen: (value) => set({ isSidebarOpen: value }),

  setIsNewChatModalOpen: (value) => set({ isNewChatModalOpen: value }),

  setSelectedChat: async (chat) => {
    set({ selectedChat: chat });
    get().clearUnreadCount(chat?._id);

    const { authUser, socket } = useAuthStore.getState();

    if (!chat) return;

    if (socket?.connected) {
      socket.emit("markAsRead", {
        chatId: chat?._id,
        userId: authUser._id,
      });
    }

    try {
      await axiosInstance.put(`/messages/markAsRead/${chat?._id}`);

      if (!chat.isGroupChat) {
        const { authUser, lastSeenMap } = useAuthStore.getState();

        const otherUser = chat.users?.find(
          (u) => u._id !== authUser._id
        );

        if (otherUser) {
          const res = await axiosInstance.get(
            `/auth/lastSeen/${otherUser._id}`
          );
          useAuthStore.setState({
            lastSeenMap: {
              ...lastSeenMap,
              [otherUser._id]: res.data.lastSeen,
            },
          });
        }
      }
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
    const { users, activeTab, conversationSearch } = get();
    const { authUser } = useAuthStore.getState();

    let filtered = users;

    if (activeTab === "direct") filtered = filtered.filter((u) => !u.isGroupChat);
    if (activeTab === "group") filtered = filtered.filter((u) => u.isGroupChat);

    if (conversationSearch?.trim()) {
      const query = conversationSearch.trim().toLowerCase();
      filtered = filtered.filter((chat) => {
        if (chat.isGroupChat) {
          return chat.chatName?.toLowerCase().includes(query);
        }
        // for DMs search by the other user's name
        const otherUser = chat.users?.find(
          (u) => u._id !== authUser?._id
        );
        return otherUser?.fullName?.toLowerCase().includes(query);
      });
    }

    return [...filtered].sort((a, b) => {
      const aTime = a.latestMessage?.createdAt
        ? new Date(a.latestMessage.createdAt)
        : new Date(a.updatedAt || a.createdAt);
      const bTime = b.latestMessage?.createdAt
        ? new Date(b.latestMessage.createdAt)
        : new Date(b.updatedAt || b.createdAt);
      return bTime - aTime;
    });
  },

  getMessages: async (chatId, page = 1) => {
    if (page === 1) {
      set({ isMessagesLoading: true, currentPage: 1 });
    } else {
      set({ isLoadingMoreMessages: true });
    }

    try {
      const res = await axiosInstance.get(`/messages/${chatId}?page=${page}&limit=30`);

      const { messages: newMessages, pagination } = res.data;

      if (page === 1) {
        set({ messages: newMessages });
      } else {
        // prepend older messages
        set({ messages: [...newMessages, ...get().messages] });
      }

      set({
        hasMoreMessages: pagination.hasMore,
        currentPage: pagination.page,
      });
    } catch (error) {
      console.log("Error in getMessages", error);
      toast.error("Failed to load messages. Please try again.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  loadMoreMessages: async () => {
    const { selectedChat, currentPage, hasMoreMessages, isLoadingMoreMessages } = get();

    if (!hasMoreMessages || isLoadingMoreMessages) return;

    await get().getMessages(selectedChat._id, currentPage + 1);
  },

  sendMessage: async (messageData) => {
    const { selectedChat, messages, users, replyingTo } = get();
    const { soundEnabled, messageVolume } = useThemeStore.getState();

    if (!selectedChat) {
      toast.error("No chat selected");
      return;
    }

    set({ isMessageSending: true });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedChat._id}`, { ...messageData, replyTo: replyingTo?._id || null });

      const updatedChat = { ...selectedChat, latestMessage: res.data };
      const updatedUsers = [
        updatedChat,
        ...users.filter((c) => c._id !== selectedChat._id),
      ];

      if (soundEnabled) playSound("sent", messageVolume);

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
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  },

  searchMessages: async (chatId, query) => {
    if (!query?.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isSearching: true });

    try {
      const res = await axiosInstance.get(
        `/messages/search/${chatId}?query=${query}`
      );
      set({ searchResults: res.data });
    } catch (error) {
      console.log("Error in searchMessages", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSearching: false });
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
      toast.error(error.response.data.message);
    }
  },

  forwardMessage: async (messageId, chatIds) => {
    try {
      const { messages, users } = get();

      const messageToForward = messages.find((m) => m._id === messageId);
      if (!messageToForward) return;

      const results = await Promise.allSettled(
        chatIds.map((chatId) =>
          axiosInstance.post(`/messages/send/${chatId}`, {
            text: messageToForward.text,
            image: messageToForward.image,
            isForward: true,
          })
        )
      );

      const successful = results.filter((r) => r.status === "fulfilled");
      const failed = results.filter((r) => r.status === "rejected");

      let updatedUsers = [...users];
      successful.forEach((r) => {
        const forwardedChatId = r.value.data.chat._id;
        const chatToUpdate = updatedUsers.find(
          (c) => c._id.toString() === forwardedChatId.toString()
        );
        if (chatToUpdate) {
          const updatedChat = { ...chatToUpdate, latestMessage: r.value.data };
          updatedUsers = [
            updatedChat,
            ...updatedUsers.filter(
              (c) => c._id.toString() !== forwardedChatId.toString()
            ),
          ];
        }
      });

      set({ forwardingMessage: null, users: updatedUsers });
      if (failed.length === 0) {
        toast.success("Message forwarded");
      } else if (successful.length === 0) {
        toast.error("Failed to forward message");
      } else {
        toast.success(`Forwarded to ${successful.length} of ${chatIds.length} chats`);
      }

    } catch (error) {
      console.log("Error forwarding message", error);
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message);
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

  subscribeToGlobalMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) {
      console.log("No socket instance");
      return;
    }

    if (!socket.connected) {
      console.log("Socket not connected, waiting...");
      socket.once("connect", () => {
        console.log("Socket connected, subscribing...");
        useChatStore.getState().subscribeToGlobalMessages();
      });
      return;
    }

    socket.on("newMessage:global", (newMessage) => {
      const { users, unreadCounts, selectedChat } = get();
      const { soundEnabled, messageVolume, notificationsEnabled } = useThemeStore.getState();

      const newMessageChatId =
        typeof newMessage.chat === "object"
          ? newMessage.chat._id.toString()
          : newMessage.chat.toString();

      const chatToUpdate = users.find(
        (c) => c._id.toString() === newMessageChatId
      );

      if (!chatToUpdate) return;

      const updatedChat = newMessage.isSystemMessage
        ? chatToUpdate
        : { ...chatToUpdate, latestMessage: newMessage };

      const updatedUsers = [
        updatedChat,
        ...users.filter((c) => c._id.toString() !== newMessageChatId),
      ];

      // only increment badge if not currently viewing that chat
      if (newMessageChatId !== selectedChat?._id?.toString()) {
        if (!newMessage.isSystemMessage) {
          if (soundEnabled) playSound("notification", messageVolume);

          if (notificationsEnabled) {
            const senderName = newMessage.senderId?.fullName || "Someone";
            showBrowserNotification(senderName, {
              body: newMessage.text || "📷 Sent an image",
              tag: newMessageChatId,
            });
          }
          set({
            users: updatedUsers,
            unreadCounts: {
              ...unreadCounts,
              [newMessageChatId]: (unreadCounts[newMessageChatId] || 0) + 1,
            },
          });
        } else {
          // system message — update list order but no badge
          set({ users: updatedUsers });
        }
      } else {
        // just update the list without badge
        set({ users: updatedUsers });
      }
    });

    socket.on("messageDelivered", ({ messageId, deliveredTo }) => {
      const { messages } = get();
      set({
        messages: messages.map((m) =>
          m._id === messageId
            ? {
              ...m,
              deliveredTo: [
                ...(m.deliveredTo || []),
                ...deliveredTo,
              ],
            }
            : m
        ),
      });
    });

    socket.on("messagesRead", ({ chatId, userId }) => {
      const { messages, selectedChat: currentChat } = get();

      if (currentChat?._id.toString() !== chatId?.toString()) return;

      set({
        messages: messages.map((m) => {
          const alreadyRead = m.readBy?.some(
            (r) => r?.toString() === userId?.toString()
          );
          if (alreadyRead) return m;
          return {
            ...m,
            readBy: [...(m.readBy || []), userId],
          };
        }),
      });
    });

    socket.on("addedToGroup", (newChat) => {
      const { users } = get();
      const exists = users.find((u) => u._id === newChat._id);
      if (!exists) {
        set({ users: [newChat, ...users] });
      } else {
        set({
          users: users.map((u) => u._id === newChat._id ? newChat : u),
        });
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
      const { users, selectedChat } = get();
      set({
        users: users.map((u) =>
          u._id === updatedChat._id ? updatedChat : u
        ),
        ...(selectedChat?._id === updatedChat._id
          ? { selectedChat: updatedChat }
          : {}
        ),
      });
    });
  },

  unsubscribeFromGlobalMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage:global");
    socket.off("messageDelivered");
    socket.off("messagesRead");
    socket.off("addedToGroup");
    socket.off("removedFromGroup");
    socket.off("groupUpdated");
  },

  // local subscription - only handles messages array in chat view
  subscribeToMessages: (selectedChat) => {
    if (!selectedChat) return;

    const socket = useAuthStore.getState().socket;
    if (!socket?.connected) return;

    socket.on("newMessage", (newMessage) => {
      const { soundEnabled, messageVolume } = useThemeStore.getState();

      const newMessageChatId =
        typeof newMessage.chat === "object"
          ? newMessage.chat._id.toString()
          : newMessage.chat.toString();

      // only add to messages array if it belongs to current chat
      if (newMessageChatId !== selectedChat._id.toString()) return;

      if (soundEnabled) playSound("message", messageVolume);

      set({
        messages: [...get().messages, newMessage],
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
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("messageDeleted");
    socket.off("messageReaction");
  },
}));