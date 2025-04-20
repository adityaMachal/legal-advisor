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
    console.log('Rendering messages:', messages); // Debug log
  }, [messages, typing]);

  return (
    <div className="chat-container">
      <div ref={chatContainerRef} className="chat-messages">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <Message key={index} sender={msg.sender} content={msg.content} />
          ))
        ) : (
          <p>No messages yet.</p>
        )}
        {typing && (
          <div className="typing-indicator">
            <span>Bot is typing</span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        )}
      </div>
      <InputArea />
    </div>
  );
}

export default Chat;