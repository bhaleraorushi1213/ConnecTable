import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageSending: false,
  mobileView: "list",
  activeTab: "all",

  setActiveTab: (tab) => set({ activeTab: tab }),

  setMobileView: (view) => set({ mobileView: view }),

  setSelectedUser: (user) => set({ selectedUser: user }),

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.log("Error in getUsers", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    console.log("userId", userId);

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in getMessages", error);
      toast.error("Failed to load messages. Please try again.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    set({ isMessageSending: true });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log("Error in sendMessages", error);
      toast.error("Failed to send messages. Please try again.");
    } finally {
      set({ isMessageSending: false });
    }
  },

  subscribeToMessages: () => {
    const {selectedUser} = get();
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    
    socket.on("newMessage", (newMessage) => {
      if(newMessage.senderId !== selectedUser._id) return;
       
      set({messages: [...get().messages, newMessage]});
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));