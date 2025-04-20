import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';

function InputArea() {
  const { sendMessage } = useContext(ChatContext);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="input-area">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default InputArea;