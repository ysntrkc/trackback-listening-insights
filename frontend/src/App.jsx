import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import TopTracks from './components/TopTracks';
import TopArtists from './components/TopArtists';
import Navigation from './components/Navigation';
import Loading from './components/Loading';
import { useAuth } from './context/AuthContext';

function App() {
  const { isLoggedIn, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('top-tracks');

  if (loading) {
    return <Loading />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'top-tracks':
        return <TopTracks />;
      case 'top-artists':
        return <TopArtists />;
      case 'profile':
        return <Profile />;
      default:
        return <TopTracks />;
    }
  };

  return (
    <div className="app">
      {isLoggedIn && <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />}
      <div className="container">
        {!isLoggedIn ? (
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}

export default App;
