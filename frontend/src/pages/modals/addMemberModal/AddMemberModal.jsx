import { useEffect, useState } from 'react';
import { useChatStore } from '../../../store/useChatStore.js';
import { useAuthStore } from '../../../store/useAuthStore.js';
import AddMemberModalView from './AddMemberModalView.jsx'
import toast from 'react-hot-toast';

const AddMemberModal = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const { selectedChat, addMemberToGroup } = useChatStore();
  const { users, searchUser, setUsers } = useAuthStore();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }
    const timeout = setTimeout(() => {
      searchUser(searchQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, setUsers, searchUser]);

  // filter out users already in group
  const availableUsers = users.filter(
    (u) => !selectedChat.users.some((m) => m._id === u._id)
  );

  const handleToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAdd = async () => {
    if (!selectedUsers.length) return;
    setIsAdding(true);
    try {
      await Promise.all(
       selectedUsers.map(userId => addMemberToGroup(selectedChat._id, userId))
     );
      onClose();
    } catch (error) {
     console.error("Error adding members", error);
     toast.error("Failed to add some members");
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <AddMemberModalView
      {...{
        searchQuery,
        setSearchQuery,
        isAdding,
        setIsAdding,
        selectedUsers,
        handleToggle,
        availableUsers,
        handleAdd,
        onClose
      }} />
  )
}

export default AddMemberModal