import React from 'react';
import styles from './Header.module.css'; 
import SearchBar from '../../features/SearchBar/SearchBar';
import RandomGames from '../../features/RandomGames/RandomGames';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  isSearching: boolean;
  onSearch: () => void;
  onRefresh: () => void;
  suggestions: string[];
  showSuggestions: boolean;
  onSuggestionClick: (suggestion: string) => void;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Header({ 
  searchQuery, 
  setSearchQuery,
  loading, 
  isSearching,
  onRefresh,
  suggestions,
  showSuggestions,
  onSuggestionClick,
  onSearchInput
}: HeaderProps) {  
  return (
    <header className={styles['header-section']}>  
      <div className={styles['header-content']}>
        <h1 className={styles['app-title']}>🎮 GameFinder</h1>
        <p className={styles['app-subtitle']}>Discover your next favorite game</p>
        
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