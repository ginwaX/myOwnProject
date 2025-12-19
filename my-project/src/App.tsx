
import './App.css'

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacter();
  }, []);

  const fetchCharacter = async () => {
    setLoading(true);
    const randomId = Math.floor(Math.random() * 826) + 1;
    const response = await fetch(`https://rickandmortyapi.com/api/character/${randomId}`);
    const data = await response.json();
    setCharacter(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Rick and Morty Character</h1>
      // I found some way to make the loading thing
      {loading ? (
        <p>Loading...</p>
      ) : character ? (
        <div style={{ margin: '20px auto', maxWidth: '500px' }}>
          <img 
            src={character.image} 
            alt={character.name}
            style={{ width: '200px', borderRadius: '8px' }}
          />
          <h2>{character.name}</h2>
          <p><b>Status:</b> {character.status}</p>
          <p><b>Species:</b> {character.species}</p>
          <p><b>Location:</b> {character.location.name}</p>
        </div>
      ) : null}
      
      <button 
        onClick={fetchCharacter}
        style={{
          padding: '10px 20px',
          backgroundColor: '#24282f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Get New Character
      </button>
    </div>
  );
}

export default App;