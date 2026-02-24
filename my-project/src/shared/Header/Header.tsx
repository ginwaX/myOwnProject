import React from 'react';
import './Header.css';
import SearchBar from '../../features/SearchBar/SearchBar';
import RandomGames from '../../features/RandomGames/RandomGames';

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
  return (
    <header className="header-section">
      <div className="header-content">
        <h1 className="app-title">🎮 GameFinder</h1>
        <p className="app-subtitle">Discover your next favorite game</p>
        
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loading={loading}
          onSearchInput={onSearchInput}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSuggestionClick={onSuggestionClick}
        />
        
        <RandomGames 
          onRefresh={onRefresh}
          loading={loading}
          isSearching={isSearching}
        />
      </div>
    </header>
  );
}

export default Header;