import React from 'react';
import { ChatProvider } from './context/ChatContext';
import Chat from './components/Chat';

function App() {
  return (
    <ChatProvider>
      <div className="app">
        <h1>Indian Legal Advisor</h1>
        <Chat />
      </div>
    </ChatProvider>
  );
}

export default App;