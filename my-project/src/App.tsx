import React, { useState, useEffect } from 'react';
import './App.css';

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
          <div className="game-card">
            <img 
              src={game.background_image} 
              alt={game.name}
              className="game-image"
            />
            <div className="game-info">
              <h2>{game.name}</h2>
              <p className="release-date">
                Released: {new Date(game.released).toLocaleDateString()}
              </p>
              <p className="rating">Rating: {game.rating}/5</p>
              <div className="genres">
                {game.genres.map(genre => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
              <p className="description">{game.description_raw?.substring(0, 200)}...</p>
              <a 
                href={game.website || `https://rawg.io/games/${game.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="more-info"
              >
                More Info →
              </a>
            </div>
          </div>
        ) : (
          <p>Failed to load game. Try again.</p>
        )}
      </main>
    </div>
  );
}

export default App;