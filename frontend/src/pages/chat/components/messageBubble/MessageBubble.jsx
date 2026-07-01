import { useState } from 'react';
import MessageBubbleView from './MessageBubbleView.jsx'

const MessageBubble = (props) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForward, setShowForward] = useState(false);

  const handleDeleteMessage = (messageId) => {
    const { setIsDeleteModalOpen, setMessageToDelete } = props;
    setIsMenuOpen(false);
    setMessageToDelete(messageId);
    setIsDeleteModalOpen(true);
  }

  return (
    <MessageBubbleView
      {...props}
      {...{
        showPicker,
        setShowPicker,
        isMenuOpen,
        setIsMenuOpen,
        showForward,
        setShowForward
      }}
      handleDeleteMessage={handleDeleteMessage}
    />
  )
}

export default MessageBubble