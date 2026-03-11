import React from 'react';
import GameCard from '../../shared/GameCard/GameCard';
import styles from './GameGrid.module.css';

const GameGrid = ({ 
  games, 
  loading, 
  isSearching, 
  onGameClick,
  onRefresh 
}) => {
  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles['loading-spinner']}></div>
        <p>{isSearching ? 'Searching games...' : 'Loading exciting games for you...'}</p>
      </div>
    );
  }

  if (!loading && games.length === 0) {
    return (
      <div className={styles['error-message']}>
        <p>No games found. Please try again.</p>
        <button onClick={onRefresh}>Get Random Games</button>
      </div>
    );
  }

  return (
    <div className={styles['games-grid']}>
      {games.map(game => (
        <div key={game.id} className={styles['game-card-wrapper']}>
          <div 
            className={styles['clickable-game-card']}
            onClick={() => onGameClick(game.id)}
          >
            <GameCard game={game} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameGrid;