import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define the backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  // Create a axios instance with credentials
  const apiClient = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      // Skip if we've already initialized
      if (initialized) {
        return;
      }
      
      try {
        setLoading(true);
        const response = await apiClient.get('/init');
        
        if (response.data.status === 'success') {
          // Store basic profile info from init
          setUserProfile(response.data.data);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsLoggedIn(false);
        setUserProfile(null);
        navigate('/login');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Load full profile details when needed
  const loadFullProfile = async () => {
    if (isLoggedIn && (!userProfile?.email)) {
      try {
        const response = await apiClient.get('/profile');
        if (response.data.status === 'success') {
          setUserProfile(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load full profile:', error);
      }
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      await apiClient.post('/logout');
      setIsLoggedIn(false);
      setUserProfile(null);
      setInitialized(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    isLoggedIn,
    userProfile,
    loading,
    apiClient,
    loadFullProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};