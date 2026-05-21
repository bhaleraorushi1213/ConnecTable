export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Browser doesn't support notifications");
    return false;
  }

  if (Notification.permission === "granted") return true;

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const showBrowserNotification = (title, options = {}) => {
  if (Notification.permission !== "granted") return;

  // don't show if tab is focused
  if (document.visibilityState === "visible") return;
  try {
    const notification = new Notification(title, {
      icon: "/logo.png",
      badge: "/logo.png",
      ...options,
    });

    const timeoutId = setTimeout(() => notification.close(), 5000);

    // focus window on click
    notification.onclick = () => {
      window.focus();
      notification.close();
      clearTimeout(timeoutId);
    };
  } catch (error) {
    console.log("Failed to show notification:", error);
  }
};