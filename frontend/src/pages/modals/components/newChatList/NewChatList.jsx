import { useEffect, useState } from 'react'

import { useChatStore } from '../../../../store/useChatStore.js';
import { useAuthStore } from '../../../../store/useAuthStore.js';

import toast from 'react-hot-toast';

import NewChatListView from './NewChatListView'

const NewChatList = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { setMobileView, setIsNewChatModalOpen, createNewChat } = useChatStore();
  const { searchUser, setUsers } = useAuthStore();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([])
      return;
    }

    const timeout = setTimeout(async () => {
      searchUser(searchQuery);
    }, 500); // wait 500ms after user stops typing

    return () => clearTimeout(timeout);
  }, [searchUser, searchQuery, setUsers]);

  const handleContactClick = async (contact) => {
    try {
      setMobileView("chat");
      
      await createNewChat({userId:contact._id});

      // Switch to chat view on mobile
      

      // Close modal
      setIsNewChatModalOpen(false);
    } catch (error) {
      console.error("Failed to start chat:", error);
      toast.error("Failed to start chat");
    }
  }
  return (
    <NewChatListView {...props} {...{ searchQuery, setSearchQuery, handleContactClick }} />
  )
}

export default NewChatList;