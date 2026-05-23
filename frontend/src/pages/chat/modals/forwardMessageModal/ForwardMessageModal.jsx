import { useState } from 'react';
import { useChatStore } from '../../../../store/useChatStore.js';
import ForwardMessageModalView from './ForwardMessageModalView'

const ForwardMessageModal = ({onClose}) => {
    const [selectedChats, setSelectedChats] = useState([]);
  const [isForwarding, setIsForwarding] = useState(false);

  const { forwardingMessage, forwardMessage } = useChatStore();

  const handleToggle = (chatId) => {
    setSelectedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  const handleForward = async () => {
    if (!selectedChats.length) return;
    setIsForwarding(true);
    try {
      await forwardMessage(forwardingMessage._id, selectedChats);
      onClose();
    } finally {
      setIsForwarding(false);
    }
  };

  return (
    <ForwardMessageModalView {...{ forwardingMessage, selectedChats, handleToggle, handleForward, isForwarding, onClose }} />
  )
}

export default ForwardMessageModal