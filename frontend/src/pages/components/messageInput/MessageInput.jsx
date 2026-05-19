import { useRef, useState } from "react"

import { useChatStore } from "../../../store/useChatStore.js";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { SOCKET_EVENTS } from "../../../constants";

import toast from "react-hot-toast";
import MessageInputView from "./MessageInputView.jsx";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSelfTyping, setIsSelfTyping] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, isMessageSending } = useChatStore();
  const { TYPING, STOP_TYPING } = SOCKET_EVENTS;

  const typingTimeoutRef = useRef(null);

  const handleTyping = (e) => {
    setText(e.target.value);
    const { selectedChat } = useChatStore.getState();
    const { socket, authUser } = useAuthStore.getState();

    if (!selectedChat?._id || !authUser?._id || !socket) return;

    if (!isSelfTyping) {
      setIsSelfTyping(true);
      socket.emit(TYPING, selectedChat._id, authUser._id);
    }

    // clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(STOP_TYPING, selectedChat._id, authUser._id);
      setIsSelfTyping(false);
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log("Error in send message", error);
    }

  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    };

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <MessageInputView
      {...{
        text,
        imagePreview,
        isSelfTyping,
        isMessageSending,
        fileInputRef,
        handleTyping,
        handleSendMessage,
        handleImageChange,
        removeImage
      }}
    />
  )
}

export default MessageInput