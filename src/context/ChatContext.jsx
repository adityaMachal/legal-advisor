import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

const SYSTEM_PROMPT = `
You are an AI Legal Advisor specialized in Indian law. Your responses must:
1. Provide information based only on Indian legal statutes and precedents
2. Clarify that this is not official legal advice
3. Recommend consulting a qualified advocate/lawyer
4. Maintain professional and neutral tone
5. Cite relevant IPC sections, acts, or case laws when applicable
6. Disclaim liability for any consequences of using this information
7. Refuse to engage in speculative or hypothetical scenarios
8. Answer in a direct way.
9. Do not answer in the markdown way. Answer in the actual 
`.trim();

// Function to convert markdown to plain text
const markdownToPlainText = (markdown) => {
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
    .replace(/__(.*?)__/g, '$1') // Remove __bold__
    .replace(/\n/g, '\n'); // Preserve newlines
};

// Convert SYSTEM_PROMPT to plain text
const PLAIN_TEXT_SYSTEM_PROMPT = markdownToPlainText(SYSTEM_PROMPT);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', content: 'Hello! How can I help with your legal question?' }
  ]);
  const [typing, setTyping] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  const MODEL = import.meta.env.VITE_OPENROUTER_MODEL;

  const sendMessage = async (text) => {
    if (!API_BASE_URL || !API_KEY) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', content: 'Configuration error: Missing API base URL or key.' }
      ]);
      return;
    }

    setMessages(prev => [...prev, { sender: 'user', content: text }]);
    setTyping(true);

    const url = `${API_BASE_URL}/chat/completions`;

    try {
      const formattedMessages = [
        { role: 'system', content: PLAIN_TEXT_SYSTEM_PROMPT }, // Use plain text prompt
        ...messages.map(m => ({
          role: m.sender === 'bot' ? 'assistant' : 'user',
          content: m.content
        })),
        { role: 'user', content: text }
      ];

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: formattedMessages
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API request failed: ${res.status} - ${errorText}`);
      }

      const json = await res.json();
      const botResponse = json.choices?.[0]?.message?.content;

      if (!botResponse) {
        throw new Error('No response content from API');
      }

      // Optionally, convert botResponse to plain text if it contains markdown
      const plainBotResponse = markdownToPlainText(botResponse);

      setMessages(prev => [...prev, { sender: 'bot', content: plainBotResponse }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', content: `Error: ${err.message}` }
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, typing }}>
      {children}
    </ChatContext.Provider>
  );
}