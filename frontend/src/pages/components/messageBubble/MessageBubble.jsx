import { useState } from 'react';
import MessageBubbleView from './MessageBubbleView.jsx'

const MessageBubble = (props) => {
  const [ showPicker, setShowPicker ] = useState(false);
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);
  
  return (
    <MessageBubbleView {...props} {...{ showPicker, setShowPicker, isMenuOpen, setIsMenuOpen }}/>
  )
}

export default MessageBubble