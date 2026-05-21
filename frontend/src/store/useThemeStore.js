import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "light",
  soundEnabled: localStorage.getItem("soundEnabled") !== "false",
  notificationsEnabled: localStorage.getItem("notificationsEnabled") !== "false",
  messageVolume: localStorage.getItem("messageVolume") !== null ? Number(localStorage.getItem("messageVolume")) : 0.5,

  setTheme: (newTheme) => {
    localStorage.setItem("chat-theme", newTheme);
    set({ theme: newTheme });
  },

  setSoundEnabled: (value) => {
    localStorage.setItem("soundEnabled", value);
    set({ soundEnabled: value });
  },

  setNotificationsEnabled: (value) => {
    localStorage.setItem("notificationsEnabled", value);
    set({ notificationsEnabled: value });
  },

  setMessageVolume: (value) => {
    localStorage.setItem("messageVolume", value);
    set({ messageVolume: value });
  },
}));