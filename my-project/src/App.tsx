import React, { useState, useEffect } from 'react';
import './App.css';
import GameCard from './components/GameCard/GameCard';

function App() {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = ''; // API key here
  const BASE_URL = 'https://api.rawg.io/api/games';

  const fetchRandomGame = async () => {
    setLoading(true);
    try {
      const countResponse = await fetch(`${BASE_URL}?key=${API_KEY}`);
      const countData = await countResponse.json();
      const totalGames = countData.count;
      
      const randomPage = Math.floor(Math.random() * (totalGames / 20)) + 1;
      
      const response = await fetch(`${BASE_URL}?key=${API_KEY}&page=${randomPage}&page_size=20`);
      const data = await response.json();
      
      const randomIndex = Math.floor(Math.random() * data.results.length);
      setGame(data.results[randomIndex]);
    } catch (error) {
      console.error('Error fetching game:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomGame();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Random Game Generator</h1>
        <button onClick={fetchRandomGame} disabled={loading}>
          {loading ? 'Loading...' : 'Get Random Game'}
        </button>
      </header>

      <main>
        {loading ? (
          <div className="loading">Loading game...</div>
        ) : game ? (
          <GameCard game={game} />
        ) : (
          <p>Failed to load game. Try again.</p>
        )}
      </main>
    </div>
  );
}

export default App;