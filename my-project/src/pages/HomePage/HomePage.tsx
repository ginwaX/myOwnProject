import React from 'react';
import Header from '../../shared/Header/Header';
import './HomePage.css';
import useHomePage from '../../shared/hooks/HomePageHooks';
import GameGrid from '../../entities/GameGrid/GameGrid';

const HomePage = () => {
  const {
    loading,
    searchQuery,
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
  } = useHomePage();

  const handleGameClick = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="home-page">
      <div className="position-relative">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={handleSearchQueryChange}
          onSearchInput={handleSearchInput}
          loading={loading}
          isSearching={isSearching}
          onSearch={searchGames}
          onRefresh={fetchRandomGames}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>

      <main className="main-content">
        <div className="content-wrapper">
          <GameGrid
            games={displayGames}
            loading={loading}
            isSearching={isSearching}
            initialLoad={initialLoad}
            onGameClick={handleGameClick}
            onRefresh={fetchRandomGames}
          />
        </div>
      </main>
    </div>
  );
};

export default HomePage;