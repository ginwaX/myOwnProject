import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRandomGamesAPI, fetchSuggestionsAPI, searchGamesAPI } from '../../shared/api/HomePageApi';

const useHomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const currentRequestRef = useRef(0);
  const searchTimeoutRef = useRef(null);
  const hasMountedRef = useRef(false); 
  
  const navigate = useNavigate();

  const fetchRandomGames = useCallback(async () => {
    console.log('fetchRandomGames called', new Date().toISOString()); 
    
    setLoading(true);
    setIsSearching(false);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    
    const result = await fetchRandomGamesAPI();
    
    if (result.success) {
      setGames(result.games);
      setSearchResults([]);
    }
    
    setLoading(false);
    setInitialLoad(false);
  }, []);

  const handleSearchQueryChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleSearchInput = useCallback(async (query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      const requestId = ++currentRequestRef.current;
      
      if (query.length >= 2) {
        const result = await fetchSuggestionsAPI(query, requestId);
        
        if (result.requestId === currentRequestRef.current) {
          if (result.success && result.suggestions.length > 0) {
            setSuggestions(result.suggestions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      } else {
        if (requestId === currentRequestRef.current) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    }, 300);
  }, []);

  const searchGames = useCallback(async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchRandomGames();
      return;
    }
    
    setLoading(true);
    setIsSearching(true);
    setShowSuggestions(false);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    const requestId = ++currentRequestRef.current;
    
    const result = await searchGamesAPI(searchQuery, 12);
    
    if (requestId === currentRequestRef.current) {
      if (result.success && result.results.length > 0) {
        setSearchResults(result.results.slice(0, 6));
        setGames([]);
      } else if (result.success && result.results.length === 0) {
        setSearchResults([]);
        alert(`No games found for "${searchQuery}"`);
        fetchRandomGames();
      } else {
        alert('Error searching games. Please try again.');
      }
      setLoading(false);
    }
  }, [searchQuery, fetchRandomGames]);

  const handleSuggestionClick = useCallback((gameName, gameId) => {
    setSearchQuery(gameName);
    setShowSuggestions(false);
    navigate(`/game/${gameId}`);
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      fetchRandomGames();
    }
  }, [fetchRandomGames]);

  // Derived state
  const displayGames = isSearching ? searchResults : games;

  return {
    games,
    loading,
    searchQuery,
    searchResults,
    isSearching,
    suggestions,
    showSuggestions,
    initialLoad,
    displayGames,
    
    fetchRandomGames,
    handleSearchQueryChange,
    handleSearchInput,
    searchGames,
    handleSuggestionClick,
    
    navigate
  };
};

export default useHomePage;