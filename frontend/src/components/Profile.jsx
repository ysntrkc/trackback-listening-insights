import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Loading from './Loading';
import '../styles/Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/profile');
        setProfileData(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container">
        <div className="error-message">Profile data not available</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {profileData.profile_image && (
            <img 
              src={profileData.profile_image}
              alt={profileData.display_name}
              className="profile-image"
            />
          )}
          <h1>{profileData.display_name || 'Spotify User'}</h1>
        </div>
        
        <div className="profile-details">
          {profileData.email && (
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{profileData.email}</span>
            </div>
          )}
          
          {profileData.followers !== undefined && (
            <div className="detail-item">
              <span className="detail-label">Followers:</span>
              <span className="detail-value">{profileData.followers.toLocaleString()}</span>
            </div>
          )}
          
          {profileData.spotify_url && (
            <div className="detail-item">
              <span className="detail-label">Spotify Profile:</span>
              <a 
                href={profileData.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="spotify-link"
              >
                Open in Spotify <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
