import React, { useEffect, useRef } from 'react';
import './SearchBar.css';

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

function SearchBar({ 
  searchQuery, 
  setSearchQuery,
  loading, 
  onSearchInput,
  suggestions,
  showSuggestions,
  onSuggestionClick
}) {
  const isFirstRender = useRef(true);
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const searchContainerRef = useRef(null); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        if (showSuggestions) {
          onSearchInput('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions, onSearchInput]);

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

  const handleInputClick = () => {
    if (searchQuery.trim().length >= 2) {
      onSearchInput(searchQuery);
    }
  };

  return (
    <div className="search-wrapper" ref={searchContainerRef}>
      <div className="search-container"> 
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrapper"> 
            <input
              type="text"
              className="search-input"
              placeholder="Search for games..."
              value={searchQuery}
              onChange={handleInputChange}
              onClick={handleInputClick} 
              disabled={loading}
            />
            <span className="search-icon">🔍</span> 
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-container">
              {suggestions.map(game => (
                <div
                  key={game.id}
                  onClick={() => {
                    onSuggestionClick(game.name, game.id);
                    onSearchInput('');
                  }} 
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
      </div>
    </div>
  );
}

export default SearchBar;