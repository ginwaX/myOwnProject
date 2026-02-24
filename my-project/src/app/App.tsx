import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import HomePage from '../pages/HomePage/HomePage';
import GameDetailPage from '../pages/GameDetailPage/GameDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:gameId" element={<GameDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;