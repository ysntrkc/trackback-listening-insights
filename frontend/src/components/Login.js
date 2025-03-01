import React from 'react';

function Login() {
  return (
    <div className="login-page container">
      <img 
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" 
        alt="Spotify Logo" 
        className="spotify-logo" 
      />
      <h1>Spotify Stats Tracker</h1>
      <p>See your top tracks and artists from your Spotify account</p>
      <a href="/login" className="btn">Login with Spotify</a>
    </div>
  );
}

export default Login;
