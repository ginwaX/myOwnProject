import React, { useState, useEffect } from 'react';
import './App.css';
import GameCard from './components/GameCard/GameCard';
import Header from './components/Header/Header';

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const API_KEY = '92b0ae78f36a479da3a5a58d8d3455bc';
  const BASE_URL = 'https://api.rawg.io/api/games';

  const fetchRandomGames = async () => {
    setLoading(true);
    setIsSearching(false);
    setSearchQuery('');
    try {
      const countResponse = await fetch(`${BASE_URL}?key=${API_KEY}`);
      const countData = await countResponse.json();
      const totalGames = countData.count;
      const gamesPerPage = 20;
      const totalPages = Math.floor(totalGames / gamesPerPage);
      
      const fetchPromises = [];
      
      for (let i = 0; i < 3; i++) {
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
        fetchPromises.push(
          fetch(`${BASE_URL}?key=${API_KEY}&page=${randomPage}&page_size=20`)
            .then(response => response.json())
            .then(data => data.results)
        );
      }
      
      const allResults = await Promise.all(fetchPromises);
      const allGames = allResults.flat();
      const shuffled = [...allGames].sort(() => 0.5 - Math.random());
      const selectedGames = shuffled.slice(0, 6);
      
      setGames(selectedGames);
      setSearchResults([]);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchGames = async(e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchRandomGames();
      return;
    }
    
    setLoading(true);
    setIsSearching(true);
    try {
      const response = await fetch(
        `${BASE_URL}?key=${API_KEY}&search=${encodeURIComponent(searchQuery)}&page_size=12`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results.slice(0, 6));
        setGames([]);
      } else {
        setSearchResults([]);
        alert(`No games found for "${searchQuery}"`);
        fetchRandomGames();
      }
    } catch (error) {
      console.error('Error searching games:', error);
      alert('Error searching games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomGames();
  }, []);

  const displayGames = isSearching ? searchResults : games;

  return (
    <div className="App">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
        isSearching={isSearching}
        onSearch={searchGames}
        onRefresh={fetchRandomGames}
      />

      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{isSearching ? 'Searching games...' : 'Loading exciting games for you...'}</p>
          </div>
        ) : displayGames.length > 0 ? (
          <>
            <div className="games-grid">
              {displayGames.map(game => (
                <div key={game.id} className="game-card-wrapper">
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="error-message">
            <p>No games found. Please try again.</p>
            <button onClick={fetchRandomGames}>Get Random Games</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;