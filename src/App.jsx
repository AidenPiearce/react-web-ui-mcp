import { useState } from 'react';
import './App.css';
import { ChatInput } from './components/ChatInput.jsx';
import { ChatMessages } from './components/ChatMessages.jsx';

function App() {
  const [chatMessages, setChatMessages] = useState(
    JSON.parse(localStorage.getItem('chatMessages')) || []
  );

  // Persist messages to localStorage
  const handleMessagesChange = (newMessages) => {
    setChatMessages(newMessages);
    localStorage.setItem('chatMessages', JSON.stringify(newMessages));
  };

  return (
    <div className="app-container">
      <ChatMessages
        chatMessages={chatMessages}
      />
      <ChatInput
        chatMessages={chatMessages}
        setChatMessages={handleMessagesChange}
      />
    </div>
  );
}

export default App;