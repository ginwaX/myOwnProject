import React, { Component } from 'react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  isSearching: boolean;
  onSearch: (e: React.FormEvent) => void;
  onRefresh: () => void;
}

class Header extends Component<HeaderProps> {
  render() {
    const { 
      searchQuery, 
      setSearchQuery, 
      loading, 
      isSearching, 
      onSearch, 
      onRefresh 
    } = this.props;

    return (
      <header className="app-header">
        <div className="header-content">
          <div className="search-container">
            <form onSubmit={onSearch} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for games..."
                className="search-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                className="search-button"
                disabled={loading}
              >
                🔍
              </button>
            </form>
          </div>
          
          <button 
            onClick={onRefresh} 
            disabled={loading}
            className="refresh-button"
          >
            {loading ? 'Loading...' : isSearching ? 'Back to Random' : 'Random Games'}
          </button>
        </div>
      </header>
    );
  }
}

export default Header;