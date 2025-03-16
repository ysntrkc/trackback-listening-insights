import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import TopTracks from './components/TopTracks';
import TopArtists from './components/TopArtists';
import Navigation from './components/Navigation';
import Loading from './components/Loading';
import AuthCallback from './components/AuthCallback';
import { useAuth } from './context/AuthContext';

function App() {
  const { isLoggedIn, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('top-tracks');
  const location = useLocation();
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Auth route detection
  const isAuthRoute = location.pathname === '/auth';

  if (loading && !isAuthRoute) {
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
      {isLoggedIn && !isAuthRoute && <Navigation currentPage={currentPage} onPageChange={handlePageChange} />}
      <div className="container">
        <Routes>
          {/* Auth callback route - highest priority and always accessible */}
          <Route path="/auth" element={<AuthCallback />} />
          
          {/* Regular app routes */}
          {isLoggedIn ? (
            <Route path="*" element={renderContent()} />
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
