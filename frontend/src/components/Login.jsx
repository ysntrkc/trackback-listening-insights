import React from 'react';
import '../styles/Login.css';

const Login = () => {
  // Get the current hostname and port for the frontend
  const frontendUrl = window.location.origin;
  
  // Get backend URL from environment variables
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const backendUrl = `${backendBaseUrl}/login`;
  
  return (
    <div className="login-container">
      <div className="login-card">
        <img 
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" 
          alt="Spotify Logo" 
          className="spotify-logo" 
        />
        <h1>Spotify Stats Tracker</h1>
        <p>Discover your most listened tracks and favorite artists</p>
        
        <a href={backendUrl} className="btn btn-primary login-btn">
          <i className="fab fa-spotify"></i> Login with Spotify
        </a>
      </div>
    </div>
  );
};

export default Login;
