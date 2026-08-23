import { useState, useEffect } from 'react';
import { getMCPClient } from '../mcp-client.js';
import '../App.css';
import loadingSpinner from '../assets/loading-spinner.gif';
import './ChatInput.css';
import dayjs from 'dayjs';

export function ChatInput({ chatMessages, setChatMessages }) {
  const [inputText, setInputText] = useState('');
  const [mcpReady, setMcpReady] = useState(false);
  const [mcpError, setMcpError] = useState(null);

  // Initialize MCP client on mount
  useEffect(() => {
    const initMCP = async () => {
      try {
        const client = getMCPClient();
        await client.initialize();
        setMcpReady(true);
        console.log('MCP client initialized');
      } catch (error) {
        console.error('MCP initialization failed:', error);
        setMcpError(`Failed to connect to MCP server: ${error.message}`);
      }
    };
    initMCP();
  }, []);

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      sendMessage();
    } else if (event.key === 'Escape') {
      setInputText('');
    }
  }

  function saveInputText(event) {
    setInputText(event.target.value);
  }

  async function sendMessage() {
    if (!inputText.trim() || !mcpReady) return;

    const userMessage = inputText.trim();

    // Add user message
    const userMessageObj = {
      message: userMessage,
      sender: 'user',
      id: crypto.randomUUID(),
      time: dayjs().format('h:mm a'),
    };

    const newChatMessages = [...chatMessages, userMessageObj];
    setChatMessages(newChatMessages);
    setInputText('');

    // Add loading indicator
    setChatMessages([
      ...newChatMessages,
      {
        message: <img src={loadingSpinner} width="35px" alt="Loading..." />,
        sender: 'robot',
        id: crypto.randomUUID(),
      }
    ]);

    try {
      const client = getMCPClient();
      const result = await client.searchNotes(userMessage, 5);
      
      // Extract text content from result
      let responseText = '';
      if (result && result.content) {
        // MCP tool result format: { content: [{ type: 'text', text: '...' }] }
        const textContent = result.content
          .filter(c => c.type === 'text')
          .map(c => c.text)
          .join('\n\n');
        responseText = textContent || 'No results found.';
      } else if (typeof result === 'string') {
        responseText = result;
      } else {
        responseText = 'No results found.';
      }

      // Replace loading with actual response
      setChatMessages([
        ...newChatMessages,
        {
          message: responseText,
          sender: 'robot',
          id: crypto.randomUUID(),
          time: dayjs().format('h:mm a'),
        }
      ]);
    } catch (error) {
      console.error('MCP search error:', error);
      setChatMessages([
        ...newChatMessages,
        {
          message: `Error: ${error.message}. Please try again.`,
          sender: 'robot',
          id: crypto.randomUUID(),
          time: dayjs().format('h:mm a'),
        }
      ]);
    }
  }

  function clearChat() {
    setChatMessages([]);
  }

  // Show connection status
  if (mcpError) {
    return (
      <div className="chat-input-container">
        <div className="mcp-error">
          Connection error: {mcpError}
          <br />
          <small>Check that the MCP server is running and VITE_MCP_URL is set correctly.</small>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-input-container">
      <input
        placeholder={mcpReady ? "Ask about FPGA/VHDL..." : "Connecting to MCP server..."}
        size="30"
        onChange={(e) => saveInputText(e)}
        onKeyDown={(e) => handleKeyDown(e)}
        value={inputText}
        disabled={!mcpReady}
      />
      <button
        onClick={sendMessage}
        disabled={!mcpReady || !inputText.trim()}
      >Send</button>
      <button
        onClick={clearChat}
        className="clearButton"
      >Clear History</button>
      {!mcpReady && <span className="connecting">Connecting to MCP server...</span>}
    </div>
  );
}