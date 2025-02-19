import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State to store the bands data
  const [bands, setBands] = useState([]);
  const [newBandName, setNewBandName] = useState('');

  useEffect(() => {
    // This runs when the component mounts
    fetch('/bands', {
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => setBands(data))
    .catch(error => console.error('Error:', error));
  }, []); // Empty array means this only runs once when component mounts
  const handleCreate = () => {
    const newBand = {
      name: newBandName,
    }
    fetch('/bands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBand),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => fetch('/bands'))
    .then(response => response.json())
    .then(data => setBands(data))
    .catch(error => console.error('Error:', error));
    setNewBandName('');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bands List</h1>
        {/* 4. Renders the bands data */}
        <input 
          type="text" 
          placeholder="Search for a band" 
          value={newBandName}
          onChange={(e) => setNewBandName(e.target.value)}
        />
        <button onClick={handleCreate}>Create</button>
        {bands && bands.length > 0 ? (
          <ul>
            {bands.map(band => (
              <li key={band.id}>{band.name}</li>
            ))}
          </ul>
        ) : (
          <p>No bands found</p>
        )}
      </header>
    </div>
  );
}

export default App;
