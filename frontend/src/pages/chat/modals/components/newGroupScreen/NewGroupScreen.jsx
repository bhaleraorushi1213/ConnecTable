import { useEffect, useState } from 'react';
import { useChatStore } from '../../../../../store/useChatStore.js';
import { useAuthStore } from '../../../../../store/useAuthStore.js';

import toast from 'react-hot-toast';

import NewGroupScreenView from './NewGroupScreenView'

const NewGroupScreen = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [checkList, setCheckList] = useState([]);
  const [groupSubject, setGroupSubject] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  const { createNewChat, setMobileView } = useChatStore();
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

  const handleCheck = (contact) => {
    setCheckList((prev) =>
      prev.includes(contact._id) ? prev.filter((id) => id !== contact._id) : [...prev, contact._id]
    );

    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u._id === contact._id);
      return exists
        ? prev.filter((u) => u._id !== contact._id)
        : [...prev, contact];
    });
  };

  const handleCreateGroup = async () => {
    if (!groupSubject.trim()) {
      toast.error("Please enter a group subject");
      return;
    }
    if (checkList.length < 2) {
      toast.error("Please select at least 2 participants");
      return;
    }
    setIsCreating(true);

    try {
      await createNewChat({
        chatName: groupSubject,
        users: checkList,
        isGroupChat: true,
        profilePicture: selectedImage,
      });
      setMobileView("chat");
    } catch (error) {
      console.error("Failed to create group:", error);
      toast.error("Failed to create group");
    } finally {
      setIsCreating(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
    };
  }

  return (
    <NewGroupScreenView
      {...props}
      {...{
        checkList,
        groupSubject,
        setGroupSubject,
        handleCheck,
        handleCreateGroup,
        searchQuery,
        setSearchQuery,
        isCreating,
        setIsCreating,
        selectedUsers,
        handleImageUpload,
        selectedImage
      }}

    />
  )
}

export default NewGroupScreen