import React from 'react';
import styles from './RandomGames.module.css';

interface RandomGamesProps {
  onRefresh: () => void;
  loading: boolean;
  isSearching: boolean;
}

function RandomGames({ onRefresh, loading, isSearching }: RandomGamesProps) {
  return (
    <button 
      className={styles['randomGamesButton']}
      onClick={onRefresh}
      disabled={loading}
    >
      {isSearching ? '🎲 Show Random Games' : '🎲 Random Games'}
    </button>
  );
}

export default RandomGames;