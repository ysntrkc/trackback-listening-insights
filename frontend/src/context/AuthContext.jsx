import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
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

  const handleAuthentication = useCallback(async () => {
    setInitialized(false);
    const result = await checkAuth();
    setInitialized(true);
    return result;
  }, [checkAuth]);
  
  useEffect(() => {
    const initializeAuth = async () => {
      if (initialized) return;
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        await handleAuthentication();
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
        setLoading(false);
        setInitialized(true);
        navigate('/login');
      }
    };
    
    initializeAuth();
  }, [navigate, initialized, handleAuthentication]);

  const loadFullProfile = async () => {
    if (isLoggedIn && (!userProfile?.email)) {
      try {
        const response = await api.get('/profile');
        setUserProfile(response.data);
      } catch (error) {
        // Silent error handling for profile loading
      }
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
      setUserProfile(null);
      setInitialized(false);
      navigate('/login');
    } catch (error) {
      // Silent error handling for logout
    }
  };

  const value = {
    isLoggedIn,
    userProfile,
    loading,
    loadFullProfile,
    logout,
    handleAuthentication
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