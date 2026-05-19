export const formatMessageTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const getChatName = (chat, authUser) => {
  if (chat.isGroupChat) {
    return chat.chatName;
  }
  const otherUser = chat.users.find((user) => user._id !== authUser._id);

  return otherUser?.fullName || "User";
}

export const isUserOnline = (chat, onlineUsers, authUser) => {
  if (chat.isGroupChat) {
    return;
  }

  const filteredUser = chat.users.find((user) => user._id !== authUser._id);

  return filteredUser ? onlineUsers.includes(filteredUser._id) : false;
}