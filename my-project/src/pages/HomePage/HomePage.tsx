import React, { useState, useEffect, useRef, useCallback } from 'react'; // Add useCallback
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import GameCard from '../../components/GameCard/GameCard';
import Header from '../../components/Header/Header';
import './HomePage.css';

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const currentRequestRef = useRef(0);
  const searchTimeoutRef = useRef(null);
  
  const navigate = useNavigate();

  const API_KEY = '';
  const BASE_URL = 'https://api.rawg.io/api/games';

  const fetchRandomGames = useCallback(async () => {
    setLoading(true);
    setIsSearching(false);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    try {
      const randomPage = Math.floor(Math.random() * 500) + 1;
      const response = await fetch(
        `${BASE_URL}?key=${API_KEY}&page=${randomPage}&page_size=40`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const shuffled = [...data.results].sort(() => 0.5 - Math.random());
        const selectedGames = shuffled.slice(0, 6);
        setGames(selectedGames);
        setSearchResults([]);
      } else {
        fetchRandomGames();
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  const handleSearchQueryChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleSearchInput = useCallback(async (query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      const requestId = ++currentRequestRef.current;
      
      if (query.length >= 2) {
        try {
          const response = await fetch(
            `${BASE_URL}?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=5`
          );
          const data = await response.json();
          
          if (requestId === currentRequestRef.current) {
            if (data.results && data.results.length > 0) {
              setSuggestions(data.results);
              setShowSuggestions(true);
            } else {
              setSuggestions([]);
              setShowSuggestions(false);
            }
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          if (requestId === currentRequestRef.current) {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      } else {
        if (requestId === currentRequestRef.current) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    }, 300);
  }, []);

  const searchGames = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchRandomGames();
      return;
    }
    
    setLoading(true);
    setIsSearching(true);
    setShowSuggestions(false); 
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    const requestId = ++currentRequestRef.current;
    
    fetch(`${BASE_URL}?key=${API_KEY}&search=${encodeURIComponent(searchQuery)}&page_size=12`)
      .then(response => response.json())
      .then(data => {
        if (requestId === currentRequestRef.current) {
          if (data.results && data.results.length > 0) {
            setSearchResults(data.results.slice(0, 6));
            setGames([]);
          } else {
            setSearchResults([]);
            alert(`No games found for "${searchQuery}"`);
            fetchRandomGames();
          }
        }
      })
      .catch(error => {
        console.error('Error searching games:', error);
        if (requestId === currentRequestRef.current) {
          alert('Error searching games. Please try again.');
        }
      })
      .finally(() => {
        if (requestId === currentRequestRef.current) {
          setLoading(false);
        }
      });
  }, [searchQuery, fetchRandomGames]);

  const handleSuggestionClick = useCallback((gameName, gameId) => {
    setSearchQuery(gameName);
    setShowSuggestions(false);
    navigate(`/game/${gameId}`);
  }, [navigate]);

  useEffect(() => {
    fetchRandomGames();
  }, [fetchRandomGames]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const displayGames = isSearching ? searchResults : games;

  return (
    <div className="home-page">
      <div className="position-relative">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={handleSearchQueryChange}
          onSearchInput={handleSearchInput}
          loading={loading}
          isSearching={isSearching}
          onSearch={searchGames}
          onRefresh={fetchRandomGames}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>

      <main className="main-content">
        <div className="content-wrapper">
          <div className={`games-grid ${loading && !initialLoad ? 'loading-hidden' : ''}`}>
            {displayGames.length > 0 ? (
              displayGames.map(game => (
                <div key={game.id} className="game-card-wrapper">
                  <div 
                    className="clickable-game-card"
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    <GameCard game={game} />
                  </div>
                </div>
              ))
            ) : (
              initialLoad ? (
                Array(6).fill(null).map((_, index) => (
                  <div key={`placeholder-${index}`} className="game-card-wrapper">
                    <div className="clickable-game-card placeholder-card">
                      <div className="game-card">
                        <div className="placeholder-image"></div>
                        <div className="placeholder-title"></div>
                        <div className="placeholder-text"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : null
            )}
          </div>
          
          {loading && !initialLoad && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{isSearching ? 'Searching games...' : 'Loading exciting games for you...'}</p>
            </div>
          )}
          
          {!loading && !initialLoad && displayGames.length === 0 && (
            <div className="error-message">
              <p>No games found. Please try again.</p>
              <button onClick={fetchRandomGames}>Get Random Games</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;