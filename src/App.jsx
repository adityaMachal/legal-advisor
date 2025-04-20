import React from 'react';
import { ChatProvider } from './context/ChatContext';
import Chat from './components/Chat';
import './styles.css';

function App() {
  return (
    <ChatProvider>
      <div className="app">
        <h1>Legal Advisor</h1>
        <Chat />
      </div>
    </ChatProvider>
  );
}

export default App;