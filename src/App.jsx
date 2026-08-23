import { useEffect, useState, } from 'react'
import './App.css'
import { ChatInput } from './components/ChatInput.jsx'
import { ChatMessages } from './components/ChatMessages.jsx';
import { Chatbot } from 'supersimpledev'

function App() {
  const [chatMessages, setChatMessages] = useState(
    JSON.parse(localStorage.getItem('chatMessages')) || []
  );

  useEffect(() => {
    Chatbot.addResponses({
      'hey': 'Hey! How can I help??'
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages))
  }, [chatMessages])


  return (
    <div className="app-container">
      <ChatMessages
        chatMessages={chatMessages}
      />
      <ChatInput
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
      />
    </div>
  );
};

export default App
