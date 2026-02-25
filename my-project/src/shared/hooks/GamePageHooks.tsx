import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const useGameDetails = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screenshots, setScreenshots] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const hasMountedRef = useRef(false);
  const API_KEY = '';

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      
      const fetchGameDetails = async () => {
        setLoading(true);
        try {
          const gameResponse = await fetch(
            `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`
          );
          const gameData = await gameResponse.json();
          setGame(gameData);

          const screenshotsResponse = await fetch(
            `https://api.rawg.io/api/games/${gameId}/screenshots?key=${API_KEY}`
          );
          const screenshotsData = await screenshotsResponse.json();
          setScreenshots(screenshotsData.results || []);
        } catch (error) {
          console.error('Error fetching game details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchGameDetails();
    }
  }, [gameId]);

  const slides = screenshots.map(screenshot => ({
    src: screenshot.image,
    alt: `${game?.name} screenshot`,
    title: `${game?.name} - Screenshot`,
    description: `Screenshot from ${game?.name}`,
    downloadUrl: screenshot.image,
  }));

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return {
    game,
    loading,
    screenshots,
    lightboxOpen,
    photoIndex,
    slides,
    openLightbox,
    closeLightbox,
    gameId 
  };
};

export default useGameDetails;