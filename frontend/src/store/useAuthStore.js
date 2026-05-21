import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useChatStore } from "./useChatStore.js";
import { requestNotificationPermission } from "../lib/notifications.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  users: [],
  onlineUsers: [],
  lastSeenMap: {}, // { userId: lastSeen }
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isSearchLoading: false,

  setIsSearchLoading: (value) => set({ isSearchLoading: value }),

  setUsers: (value) => set({ users: value }),

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    const { setSelectedChat } = useChatStore.getState();

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({
        isSigningUp: false,
        authUser: null,
        users: [],
      });
      setSelectedChat(null)
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login successfully!");

      await requestNotificationPermission();

      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");

      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout", error);
      toast.error("Failed to log out. Please try again.");
    }
  },

  searchUser: async (search) => {
    set({ isSearchLoading: true })
    try {
      const res = await axiosInstance.get(`/auth/user?search=${search}`); set({ users: res.data });
    } catch (error) {
      console.log("Error in searchUser", error);
      toast.error("Failed to search users. Please try again.");
    } finally {
      set({ isSearchLoading: false })
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Error in update profile", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  deleteAccount: async () => {
    try {
      await axiosInstance.delete("/auth/delete-account");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Account deleted successfully");
    } catch (error) {
      console.log("Error deleting account", error);
      toast.error("Failed to delete account");
    }
  },

  connectSocket: () => {
    const { authUser } = get()

    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("userLastSeen", ({ userId, lastSeen }) => {
      const { lastSeenMap } = get();
      set({
        lastSeenMap: {
          ...lastSeenMap,
          [userId]: lastSeen,
        },
      });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
