import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [chatbotResponse, setChatbotResponse] = useState('');

  const { conversationId } = useParams();

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSendMessage = () => {
    fetch(`http://localhost:3001/message/${conversationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage, conversationId }),
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
