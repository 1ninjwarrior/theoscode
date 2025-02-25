import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';
import ExerciseComponent from './ExerciseComponent.js';
import CommentComponent from './CommentComponent.js';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [chatbotResponse, setChatbotResponse] = useState('');

  const { conversationId } = useParams();

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const processResponse = (response) => {
    const parts = response.split(/(?=[|#])/);
    return parts.map(part => ({
      type: part.startsWith('|') ? 'comment' : part.startsWith('#') ? 'exercise' : 'text',
      content: part.substring(1).trim()
    })).filter(item => item.content);
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
        setChatbotResponse(processResponse(data.response));
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
        {chatbotResponse && chatbotResponse.map((response, index) => (
          response.type === 'exercise' ? (
            <ExerciseComponent key={index} index={index} response={response} />
          ) : (
            <CommentComponent key={index} comment={response.content} />
          )
        ))}
      </header>
    </div>
  );  
}

export default App;
