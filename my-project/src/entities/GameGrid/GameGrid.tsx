import React from 'react';
import GameCard from '../../shared/GameCard/GameCard';

const GameGrid = ({ 
  games, 
  loading, 
  isSearching, 
  initialLoad, 
  onGameClick,
  onRefresh 
}) => {
  if (loading && !initialLoad) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{isSearching ? 'Searching games...' : 'Loading exciting games for you...'}</p>
      </div>
    );
  }

  if (!loading && !initialLoad && games.length === 0) {
    return (
      <div className="error-message">
        <p>No games found. Please try again.</p>
        <button onClick={onRefresh}>Get Random Games</button>
      </div>
    );
  }

  return (
    <div className={`games-grid ${loading && !initialLoad ? 'loading-hidden' : ''}`}>
      {games.length > 0 ? (
        games.map(game => (
          <div key={game.id} className="game-card-wrapper">
            <div 
              className="clickable-game-card"
              onClick={() => onGameClick(game.id)}
            >
              <GameCard game={game} />
            </div>
          </div>
        ))
      ) : (
        initialLoad && Array(6).fill(null).map((_, index) => (
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
      )}
    </div>
  );
};

export default GameGrid;