import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clearCache } from '../utils/api';
import Loading from './Loading';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthToken = async () => {
      const token = new URLSearchParams(location.hash.slice(1)).get('token');

      if (new URLSearchParams(location.search).get('error')) {
        setError('Authentication error');
        return;
      }

      if (!token) {
        setError('No token received from authentication server');
        return;
      }

      // Drop any cached data from a previous account before logging in
      clearCache();
      localStorage.setItem('auth_token', token);
      if (await checkAuth()) {
        // replace: keep the token out of browser history
        navigate('/', { replace: true });
      } else {
        setError('Failed to complete authentication');
      }
    };

    handleAuthToken();
  }, [location, navigate, checkAuth]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="btn btn-primary"
          style={{ marginTop: '20px' }}
        >
          Return to Login
        </button>
      </div>
    );
  }

  return <Loading />;
};

export default AuthCallback;
