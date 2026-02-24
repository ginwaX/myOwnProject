import React from 'react';

interface RandomGamesProps {
  onRefresh: () => void;
  loading: boolean;
  isSearching: boolean;
}

function RandomGames({ onRefresh, loading, isSearching }: RandomGamesProps) {
  return (
    <button 
      className="refresh-button"
      onClick={onRefresh}
      disabled={loading}
    >
      {isSearching ? '🎲 Show Random Games' : '🎲 Random Games'}
    </button>
  );
}

export default RandomGames;