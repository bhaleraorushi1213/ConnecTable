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
  return chat.users.find((user) => user._id !== authUser._id).fullName
}

export const isUserOnline = (user, onlineUsers, authUser) => {
  if(user.isGroupChat) {
    return;
  }

  const filteredUser = user.users.find((user) => user._id !== authUser._id);

  return onlineUsers.includes(filteredUser._id);
}