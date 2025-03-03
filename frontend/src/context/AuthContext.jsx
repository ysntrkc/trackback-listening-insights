import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (initialized) return;
      
      try {
        setLoading(true);
        const response = await api.get('/init');
        setUserProfile(response.data);
        setIsLoggedIn(true);
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

  const loadFullProfile = async () => {
    if (isLoggedIn && (!userProfile?.email)) {
      try {
        const response = await api.get('/profile');
        setUserProfile(response.data);
      } catch (error) {
        console.error('Failed to load full profile:', error);
      }
    }
  };

  const logout = async () => {
    try {
      navigate('/login');
      
      await api.post('/logout');
      setIsLoggedIn(false);
      setUserProfile(null);
      setInitialized(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    isLoggedIn,
    userProfile,
    loading,
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