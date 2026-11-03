import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Auth route detection
  const isAuthRoute = location.pathname === '/auth';

  if (loading && !isAuthRoute) {
    return <Loading />;
  }

  return (
    <div className="app">
      {isLoggedIn && !isAuthRoute && <Navigation />}
      <div className="container">
        <Routes>
          {/* Auth callback route - highest priority and always accessible */}
          <Route path="/auth" element={<AuthCallback />} />

          {/* Regular app routes */}
          {isLoggedIn ? (
            <>
              <Route path="/top-tracks" element={<TopTracks />} />
              <Route path="/top-artists" element={<TopArtists />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/top-tracks" replace />} />
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
