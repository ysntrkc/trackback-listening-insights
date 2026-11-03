import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, clearCache } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(window.location.pathname !== '/auth');
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setIsLoggedIn(false);
        setUserProfile(null);
        return false;
      }

      const response = await api.get('/init');
      setUserProfile(response.data);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      setIsLoggedIn(false);
      setUserProfile(null);
      localStorage.removeItem('auth_token');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // AuthCallback handles the login redirect itself
    if (window.location.pathname !== '/auth') {
      checkAuth();
    }
  }, [checkAuth]);

  const logout = () => {
    localStorage.removeItem('auth_token');
    clearCache();
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate('/');
  };

  const value = {
    isLoggedIn,
    userProfile,
    loading,
    logout,
    checkAuth
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
