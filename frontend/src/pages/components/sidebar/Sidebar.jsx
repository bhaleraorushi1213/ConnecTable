import { useState } from 'react';
import { useChatStore } from '../../../store/useChatStore.js';
import SidebarView from './SidebarView'

const Sidebar = ({onClose}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChat, leaveGroup, removeFromGroup } = useChatStore();

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
  return (
    <SidebarView {...{isLoading, handleLeave, handleRemove, onClose}} />
  )
}

export default Sidebar