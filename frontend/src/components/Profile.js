import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';

function Profile() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (await logout()) {
      navigate('/login');
    }
  };

  return (
    <div className="container">
      <UserProfile profile={profile} onLogout={handleLogout} />
      <div className="main-content">
        <h2>Your Spotify Profile</h2>
        <p>Here's your detailed Spotify profile information:</p>
        <ul>
          <li><strong>Display Name:</strong> {profile.display_name}</li>
          <li><strong>Email:</strong> {profile.email}</li>
          <li><strong>Followers:</strong> {profile.followers}</li>
          <li><strong>Spotify Profile:</strong> <a href={profile.spotify_url} target="_blank" rel="noopener noreferrer">Open in Spotify</a></li>
        </ul>
        <div className="action-buttons">
          <button className="btn" onClick={() => navigate('/')}>View Your Stats</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
