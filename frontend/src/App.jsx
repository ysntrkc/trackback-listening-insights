import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Profile from './components/Profile';
import TopTracks from './components/TopTracks';
import TopArtists from './components/TopArtists';
import Navigation from './components/Navigation';
import Loading from './components/Loading';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Define the backend URL
const BACKEND_URL = 'http://localhost:8000';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the user is logged in by fetching the profile
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/profile`);
        if (response.data.status === 'success') {
          setUserProfile(response.data.data);
          setIsLoggedIn(true);
          
          // Redirect to home if we're on the login page
          if (location.pathname === '/login') {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsLoggedIn(false);
        setUserProfile(null);
        
        // If we're not on the login page, redirect there
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/logout`);
      setIsLoggedIn(false);
      setUserProfile(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Create a custom axios instance for API requests
  const apiClient = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app">
      {isLoggedIn && <Navigation userProfile={userProfile} onLogout={handleLogout} />}
      <div className="container">
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
          <Route
            path="/"
            element={isLoggedIn ? <TopTracks apiClient={apiClient} /> : <Navigate to="/login" />}
          />
          <Route
            path="/top-artists"
            element={isLoggedIn ? <TopArtists apiClient={apiClient} /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile userProfile={userProfile} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
