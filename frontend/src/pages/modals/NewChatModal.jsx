import { useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import NewChatModalView from "./NewChatModalView";

const NewChatModal = (props) => {
  const [view, setView] = useState('list');
  const { setIsNewChatModalOpen, isNewChatModalOpen } = useChatStore();

  const handleBack = () => {
    if (view === 'list') {
      setIsNewChatModalOpen(false);
    } else {
      setView('list');
    }
  };

  if (!isNewChatModalOpen) return;
  return (
    <NewChatModalView {...{ view, setView, handleBack }} {...props} />
  )
}

export default NewChatModal