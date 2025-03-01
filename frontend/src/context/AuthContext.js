import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status only once when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const res = await apiService.getProfile();
        if (res.data.status === 'success') {
          setIsAuthenticated(true);
          setProfile(res.data.data);
          setError(null);
        }
      } catch (err) {
        console.log('Not authenticated:', err.message);
        setIsAuthenticated(false);
        if (err.message !== 'Unauthorized') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await apiService.logout();
      setIsAuthenticated(false);
      setProfile(null);
      return true;
    } catch (err) {
      console.error('Logout failed:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      profile,
      loading,
      error, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
