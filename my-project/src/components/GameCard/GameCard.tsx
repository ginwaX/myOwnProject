import React, { Component } from 'react';
// import './GameCard.module.css';

interface Genre {
  id: number;
  name: string;
}

interface Game {
  id: number;
  name: string;
  background_image: string;
  released: string;
  rating: number;
  rating_top: number;
  genres: Genre[];
  description_raw?: string;
  website?: string;
  slug: string;
}

interface GameCardProps {
  game: Game;
}

class GameCard extends Component<GameCardProps> {
  render() {
    const { game } = this.props;

    return (
      <div className="game-card">
        <img 
          src={game.background_image} 
          alt={game.name}
          className="game-image"
        />
        <div className="game-info">
          <h2>{game.name}</h2>
          <p className="release-date">
            Released: {new Date(game.released).toLocaleDateString()}
          </p>
          <p className="rating">
            Rating: {'⭐'.repeat(Math.round(game.rating))} {game.rating}/{game.rating_top || 5}
          </p>
          <div className="genres">
            {game.genres.slice(0, 3).map(genre => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>
          <p className="description">
            {game.description_raw 
              ? `${game.description_raw.substring(0, 200)}...`
              : 'No description available.'}
          </p>
          <a 
            href={game.website || `https://rawg.io/games/${game.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="more-info"
          >
            More Info →
          </a>
        </div>
      </div>
    );
  }
}

export default GameCard;