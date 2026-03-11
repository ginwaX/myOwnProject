import React, { useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

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
        onSearchInput('__HIDE_SUGGESTIONS__');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSearchInput]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debouncedSearchTerm.trim()) {
      onSearchInput(debouncedSearchTerm);
    } else {
      onSearchInput('');
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

  const shouldShowNoResults = () => {
    if (!searchQuery.trim()) {
      return true;
    }
    if (suggestions.length === 0 && searchQuery.trim().length >= 2) {
      return true;
    }
    return false;
  };

  return (
    <div className={styles.searchWrapper} ref={searchContainerRef}>
      <div className={styles.searchContainer}> 
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div className={styles.searchInputWrapper}> 
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search for games..."
              value={searchQuery}
              onChange={handleInputChange}
              onClick={handleInputClick} 
              disabled={loading}
            />
            <span className={styles.searchIcon}>🔍</span> 
          </div>
          
          {showSuggestions && (
            <div className={styles.suggestionsContainer}>
              {shouldShowNoResults() ? (
                <div className={styles.noResultsMessage}>
                  <p>🔍 No games found</p>
                  <span>
                    {!searchQuery.trim() 
                      ? "Type something to search for games" 
                      : "Try searching with different keywords"}
                  </span>
                </div>
              ) : (
                suggestions.length > 0 ? (
                  suggestions.map(game => (
                    <div
                      key={game.id}
                      onClick={() => {
                        onSuggestionClick(game.name, game.id);
                        onSearchInput('__HIDE_SUGGESTIONS__');
                      }} 
                      className={styles.suggestionItem}
                    >
                      {game.background_image && (
                        <img 
                          src={game.background_image} 
                          alt=""
                          className={styles.suggestionImage}
                        />
                      )}
                      <div className={styles.suggestionInfo}>
                        <div className={styles.suggestionName}>{game.name}</div>
                        <div className={styles.suggestionYear}>
                          {game.released ? game.released.split('-')[0] : 'TBA'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : null
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SearchBar;