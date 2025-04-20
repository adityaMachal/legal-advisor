import React, { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import Message from './Message';
import InputArea from './InputArea';

function Chat() {
  const { messages, typing } = useContext(ChatContext);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, typing]);

  return (
    <div>
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} content={msg.content} />
        ))}
        {typing && <div className="typing-indicator">Bot is typing...</div>}
      </div>
      <InputArea />
    </div>
  );
}

export default Chat;