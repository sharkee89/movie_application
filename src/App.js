import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ActorDetail from './components/ActorDetail';
import MovieDetail from './components/MovieDetail';
import Popular from './components/Popular';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [selectedGenre, setSelectedGenre] = useState('popular');

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <Sidebar selectedId={selectedGenre} onGenreChange={handleGenreChange} />
            <Popular selectedGenre={selectedGenre} />
          </div>
        } />
        <Route path="/movie/:id" element={
          <div className="App">
            <Sidebar selectedId={selectedGenre} onGenreChange={handleGenreChange} />
            <MovieDetail />
          </div>
        } />
        <Route path="/actor/:id" element={
          <div className="App">
            <Sidebar selectedId={selectedGenre} onGenreChange={handleGenreChange} />
            <ActorDetail />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;