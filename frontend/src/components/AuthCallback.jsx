import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleAuthentication } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthToken = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        
        if (error) {
          setError(`Authentication error`);
          return;
        }
        
        if (!token) {
          setError('No token received from authentication server');
          return;
        }
        
        localStorage.setItem('auth_token', token);
        await handleAuthentication();
        navigate('/');
      } catch (err) {
        setError('Failed to complete authentication');
      }
    };
    
    handleAuthToken();
  }, [location, navigate, handleAuthentication]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/login')} 
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