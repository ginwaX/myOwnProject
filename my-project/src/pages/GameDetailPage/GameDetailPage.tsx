import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Download from "yet-another-react-lightbox/plugins/download";
import './GameDetailPage.css';
import useGameDetails from '../../shared/hooks/GamePageHooks';

const GameDetailPage = () => {
  const navigate = useNavigate();
  const {
    game,
    loading,
    screenshots,
    lightboxOpen,
    photoIndex,
    slides,
    openLightbox,
    closeLightbox
  } = useGameDetails();

  if (loading) {
    return (
      <div className="game-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading game details...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-detail-error">
        <h2>Game not found</h2>
        <button onClick={() => navigate('/')} className="back-button">
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="game-detail-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Games
      </button>

      <div className="game-detail-header">
        <div className="game-detail-hero">
          <img 
            src={game.background_image || game.background_image_additional} 
            alt={game.name}
            className="game-detail-background"
          />
          <div className="game-detail-overlay">
            <h1 className="game-detail-title">{game.name}</h1>
            {game.released && (
              <p className="game-detail-release">
                Released: {new Date(game.released).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="game-detail-content">
        <div className="game-detail-main">
          <div className="game-detail-description">
            <h2>About</h2>
            <div 
              className="description-text"
              dangerouslySetInnerHTML={{ __html: game.description }}
            />
          </div>

          {screenshots.length > 0 && (
            <div className="game-screenshots">
              <h2>Screenshots</h2>
              <div className="screenshots-grid">
                {screenshots.slice(0, 4).map((screenshot, index) => (
                  <img
                    key={screenshot.id}
                    src={screenshot.image}
                    alt={`${game.name} screenshot`}
                    className="screenshot"
                    onClick={() => openLightbox(index)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
              {screenshots.length > 4 && (
                <p className="more-screenshots-hint">
                  +{screenshots.length - 4} more screenshots available
                </p>
              )}
            </div>
          )}
        </div>

        <div className="game-detail-sidebar">
          <div className="game-info-card">
            <img 
              src={game.background_image} 
              alt={game.name}
              className="game-detail-poster"
            />
            
            <div className="game-metadata">
              <div className="metadata-item">
                <strong>Rating:</strong>
                <span className="rating-badge">{game.rating || 'N/A'}/5</span>
              </div>
              
              <div className="metadata-item">
                <strong>Metacritic:</strong>
                <span className={`metacritic-score ${game.metacritic >= 75 ? 'high' : game.metacritic >= 50 ? 'medium' : 'low'}`}>
                  {game.metacritic || 'N/A'}
                </span>
              </div>
              
              <div className="metadata-item">
                <strong>Platforms:</strong>
                <div className="platforms-list">
                  {game.platforms?.map(p => (
                    <span key={p.platform.id} className="platform-tag">
                      {p.platform.name}
                    </span>
                  )) || 'N/A'}
                </div>
              </div>
              
              <div className="metadata-item">
                <strong>Genres:</strong>
                <div className="genres-list">
                  {game.genres?.map(genre => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="metadata-item">
                <strong>Developers:</strong>
                <div className="developers-list">
                  {game.developers?.map(dev => (
                    <span key={dev.id} className="developer-tag">
                      {dev.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="metadata-item">
                <strong>Publishers:</strong>
                <div className="publishers-list">
                  {game.publishers?.map(pub => (
                    <span key={pub.id} className="publisher-tag">
                      {pub.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {game.website && (
              <a 
                href={game.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="official-website"
              >
                Visit Official Website
              </a>
            )}
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={closeLightbox}
        slides={slides}
        index={photoIndex}
        plugins={[Zoom, Fullscreen, Thumbnails, Download]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          border: 1,
          borderRadius: 4,
          padding: 4,
        }}
        download={{
          filename: (slide) => `${game?.name || 'game'}-screenshot.jpg`,
        }}
        animation={{
          fade: 300,
          swipe: 500,
        }}
        controller={{
          closeOnPullUp: true,
          closeOnBackdropClick: true,
        }}
        render={{
          buttonPrev: slides.length > 1 ? undefined : () => null,
          buttonNext: slides.length > 1 ? undefined : () => null,
        }}
      />
    </div>
  );
};

export default GameDetailPage;