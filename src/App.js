import { useState, useEffect } from 'react';
import './App.css';
import { DeepSeekAPI } from 'deepseek-api';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [chatbotResponse, setChatbotResponse] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Check if a session ID already exists in local storage
    let existingSessionId = localStorage.getItem('sessionId');
    if (!existingSessionId) {
      // Generate a new session ID if it doesn't exist
      existingSessionId = `session-${Date.now()}-${Math.random()}`;
      localStorage.setItem('sessionId', existingSessionId);
    }
    setSessionId(existingSessionId);
  }, []);

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSendMessage = () => {
    fetch(`http://localhost:3001/message/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage, sessionId }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setChatbotResponse(`${data.response}`);
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat with Bot</h1>
        <input
          type="text"
          placeholder="Type your message"
          value={userMessage}
          onChange={handleInputChange}
        />
        <button onClick={handleSendMessage}>Send</button>
        {chatbotResponse && <p>{chatbotResponse}</p>}
      </header>
    </div>
  );
}

export default App;
