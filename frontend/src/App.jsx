import React from 'react';
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app">
      {isLoggedIn && <Navigation />}
      <div className="container">
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
          <Route
            path="/"
            element={isLoggedIn ? <TopTracks /> : <Navigate to="/login" />}
          />
          <Route
            path="/top-artists"
            element={isLoggedIn ? <TopArtists /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
