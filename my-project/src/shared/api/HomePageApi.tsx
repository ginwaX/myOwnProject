const API_KEY = '';
const BASE_URL = 'https://api.rawg.io/api/games';

let requestCounter = 0;
export const getCurrentRequestId = () => requestCounter;
export const incrementRequestId = () => ++requestCounter;

export const fetchRandomGamesAPI = async () => {
  try {
    const randomPage = Math.floor(Math.random() * 500) + 1;
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&page=${randomPage}&page_size=40`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const shuffled = [...data.results].sort(() => 0.5 - Math.random());
      const selectedGames = shuffled.slice(0, 6);
      return { success: true, games: selectedGames };
    } else {
      return fetchRandomGamesAPI();
    }
  } catch (error) {
    console.error('Error fetching games:', error);
    return { success: false, error: error.message };
  }
};

export const fetchSuggestionsAPI = async (query: string, requestId: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=5`
    );
    const data = await response.json();
    
    return {
      success: true,
      suggestions: data.results || [],
      requestId
    };
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return {
      success: false,
      error: error.message,
      requestId
    };
  }
};

export const searchGamesAPI = async (query: string, pageSize: number = 12) => {
  try {
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=${pageSize}`
    );
    const data = await response.json();
    
    return {
      success: true,
      results: data.results || [],
      count: data.count
    };
  } catch (error) {
    console.error('Error searching games:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const useGameAPI = () => {
  const fetchRandomGames = async () => {
    const result = await fetchRandomGamesAPI();
    return result;
  };

  const fetchSuggestions = async (query: string, requestId: number) => {
    const result = await fetchSuggestionsAPI(query, requestId);
    return result;
  };

  const searchGames = async (query: string, pageSize: number = 12) => {
    const result = await searchGamesAPI(query, pageSize);
    return result;
  };

  return {
    fetchRandomGames,
    fetchSuggestions,
    searchGames
  };
};