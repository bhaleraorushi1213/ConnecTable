export const formatMessageTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getChatName = (chat, authUser) => {
  if (chat.isGroupChat) {
    return chat.chatName;
  }
  const otherUser = chat.users.find((user) => user._id !== authUser._id);

  return otherUser?.fullName || "User";
};

export const isUserOnline = (chat, onlineUsers, authUser) => {
  if (chat.isGroupChat) {
    return;
  }

  const filteredUser = chat.users.find((user) => user._id !== authUser._id);

  return filteredUser ? onlineUsers.includes(filteredUser._id) : false;
};

export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const formatDateSeparator = (date) => {
  const d = new Date(date);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(d, now)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "a while ago";

  const now = new Date();
  const last = new Date(lastSeen);
  const diffMs = now - last;

  if (diffMs < 0) return "just now";

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return last.toLocaleDateString();
};