import React from 'react';
import './Profile.css';

const Profile = ({ userProfile }) => {
  if (!userProfile) {
    return (
      <div className="profile-container">
        <div className="error-message">
          Profile data not available
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {userProfile.profile_image && (
            <img 
              src={userProfile.profile_image}
              alt={userProfile.display_name}
              className="profile-image"
            />
          )}
          <h1>{userProfile.display_name || 'Spotify User'}</h1>
        </div>
        
        <div className="profile-details">
          {userProfile.email && (
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{userProfile.email}</span>
            </div>
          )}
          
          {userProfile.followers !== undefined && (
            <div className="detail-item">
              <span className="detail-label">Followers:</span>
              <span className="detail-value">{userProfile.followers.toLocaleString()}</span>
            </div>
          )}
          
          {userProfile.spotify_url && (
            <div className="detail-item">
              <span className="detail-label">Spotify Profile:</span>
              <a 
                href={userProfile.spotify_url}
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
