import React, { useEffect, useRef } from 'react';
import './Header.css';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Header({ 
  searchQuery, 
  setSearchQuery,
  loading, 
  isSearching, 
  onSearch, 
  onRefresh,
  suggestions,
  showSuggestions,
  onSuggestionClick,
  onSearchInput
}) {
  const isFirstRender = useRef(true);
  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debouncedSearchTerm.trim()) {
      onSearchInput(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearchInput]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchInput(searchQuery);
    }
  };

  return (
    <header className="header-section">
      <div className="header-content">
        <h1 className="app-title">🎮 GameFinder</h1>
        <p className="app-subtitle">Discover your next favorite game</p>
        
        <div className="search-wrapper">
          <div className="search-container">
            <form className="search-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder="Search for games..."
                value={searchQuery}
                onChange={handleInputChange}
                disabled={loading}
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-container">
                  {suggestions.map(game => (
                    <div
                      key={game.id}
                      onClick={() => onSuggestionClick(game.name, game.id)} 
                      className="suggestion-item"
                    >
                      {game.background_image && (
                        <img 
                          src={game.background_image} 
                          alt=""
                          className="suggestion-image"
                        />
                      )}
                      <div className="suggestion-info">
                        <div className="suggestion-name">{game.name}</div>
                        <div className="suggestion-year">
                          {game.released ? game.released.split('-')[0] : 'TBA'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
            
            <button 
              className="refresh-button"
              onClick={onRefresh}
              disabled={loading}
            >
              {isSearching ? '🎲 Show Random Games' : '🎲 Random Games'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;