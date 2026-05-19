import { useEffect, useState } from 'react';
import NewGroupScreenView from './NewGroupScreenView'
import { useChatStore } from '../../../../store/useChatStore';
import { useAuthStore } from '../../../../store/useAuthStore';
import toast from 'react-hot-toast';

const NewGroupScreen = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [checkList, setCheckList] = useState([]);
  const [groupSubject, setGroupSubject] = useState("");

  const { createNewChat } = useChatStore();
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

  const handleCheck = (id) => {
    setCheckList((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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

    await createNewChat({
      chatName: groupSubject,
      users: checkList,
      isGroupChat: true,
    });
  };

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
      }}

    />
  )
}

export default NewGroupScreen