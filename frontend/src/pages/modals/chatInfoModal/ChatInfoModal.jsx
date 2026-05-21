import { useState } from 'react';
import { useChatStore } from '../../../store/useChatStore.js';
import ChatInfoModalView from './ChatInfoModalView'
import toast from 'react-hot-toast';

const ChatInfoModal = ({ onClose }) => {
  const { selectedChat, leaveGroup, removeFromGroup, updateGroup } = useChatStore();
  const [selectedImg, setSelectedImg] = useState();
  const [showAddMember, setShowAddMember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newGroupName, setNewGroupName] = useState(selectedChat?.chatName || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLeave = async () => {
    setIsLoading(true);
    try {
      await leaveGroup(selectedChat._id);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeFromGroup(selectedChat._id, userId);
    } catch (error) {
      console.log("Error removing member", error);
    }
  };

  const handleUpdateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Group name cannot be empty");
      return;
    }
    setIsUpdating(true);
    try {
      await updateGroup({ chatId: selectedChat._id, chatName: newGroupName });
      setIsEditing(false);
      toast.success("Group updated");
    } catch (error) {
      console.log("Error updating group", error);
      toast.error("Failed to update group name");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);
    setIsUpdating(true);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateGroup({
          chatId: selectedChat._id,
          profilePicture: base64Image
        });

      } catch (error) {
        console.log("Error updating group", error);
        toast.error("Failed to upload image");
      } finally {
        setIsUpdating(false);
      }

    }
  };

  return (
    <ChatInfoModalView {...{
      showAddMember,
      setShowAddMember,
      isLoading,
      isEditing,
      setIsEditing,
      newGroupName,
      setNewGroupName,
      isUpdating,
      handleUpdateGroup,
      handleImageChange,
      selectedImg,
      setSelectedImg,
      handleLeave,
      handleRemove,
      onClose
    }} />
  )
}

export default ChatInfoModal