import { useState } from 'react';
import MessageBubbleView from './MessageBubbleView.jsx'

const MessageBubble = (props) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForward, setShowForward] = useState(false);

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
      }} />
  )
}

export default MessageBubble