import React, { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Download from "yet-another-react-lightbox/plugins/download";
import './GameScreenshots.css';

interface GameScreenshotsProps {
  screenshots: Array<{ id: number; image: string }>;
  gameName: string;
}

const GameScreenshots = ({ screenshots, gameName }: GameScreenshotsProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  const slides = screenshots.map(screenshot => ({
    src: screenshot.image,
    alt: `${gameName} screenshot`,
    title: `${gameName} - Screenshot`,
    description: `Screenshot from ${gameName}`,
    downloadUrl: screenshot.image,
  }));

  return (
    <div className="game-screenshots">
      <h2>Screenshots</h2>
      <div className="screenshots-grid">
        {screenshots.slice(0, 4).map((screenshot, index) => (
          <img
            key={screenshot.id}
            src={screenshot.image}
            alt={`${gameName} screenshot`}
            className="screenshot-thumbnail"
            onClick={() => {
              setPhotoIndex(index);
              setLightboxOpen(true);
            }}
          />
        ))}
      </div>
      
      {screenshots.length > 4 && (
        <p className="more-screenshots">
          +{screenshots.length - 4} more screenshots available
        </p>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
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
          filename: () => `${gameName || 'game'}-screenshot.jpg`,
        }}
        animation={{
          fade: 300,
          swipe: 500,
        }}
        controller={{
          closeOnPullUp: true,
          closeOnBackdropClick: true,
        }}
      />
    </div>
  );
};

export default GameScreenshots;