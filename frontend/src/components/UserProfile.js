import React from 'react';

function UserProfile({ profile, onLogout }) {
  if (!profile) return null;
  
  return (
    <div className="profile-container">
      <div className="profile-header-expanded">
        <div className="profile-info-main">
          {profile.profile_image && (
            <img 
              src={profile.profile_image} 
              alt={profile.display_name} 
              className="profile-image"
            />
          )}
          <div className="profile-name-section">
            <h1>{profile.display_name}</h1>
            <div className="profile-email">{profile.email}</div>
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="profile-stat-item">
            <span className="profile-stat-value">{profile.followers}</span>
            <span className="profile-stat-label">Followers</span>
          </div>
          <div className="profile-stat-item">
            <a 
              href={profile.spotify_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="profile-stat-link"
            >
              <span className="profile-stat-value">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM16.586 16.424C16.404 16.713 16.024 16.822 15.735 16.64C13.423 15.26 10.607 14.916 6.633 15.879C6.306 15.948 5.976 15.731 5.907 15.403C5.837 15.076 6.054 14.746 6.382 14.677C10.743 13.612 13.902 14.009 16.537 15.573C16.826 15.755 16.935 16.135 16.753 16.424ZM17.81 13.7C17.581 14.057 17.105 14.189 16.749 13.96C14.035 12.352 10.047 11.856 6.445 12.988C6.037 13.109 5.604 12.886 5.482 12.477C5.362 12.068 5.584 11.636 5.993 11.514C10.075 10.235 14.508 10.793 17.65 12.64C18.006 12.868 18.138 13.344 17.91 13.7ZM17.914 10.871C14.627 8.996 8.868 8.777 5.364 9.949C4.874 10.105 4.345 9.834 4.19 9.344C4.034 8.854 4.305 8.326 4.795 8.17C8.784 6.838 15.148 7.094 18.966 9.271C19.403 9.516 19.565 10.072 19.32 10.508C19.076 10.944 18.519 11.107 18.083 10.862L17.914 10.871Z" fill="#1DB954"/>
                </svg>
              </span>
              <span className="profile-stat-label">Spotify</span>
            </a>
          </div>
        </div>
        
        <button onClick={onLogout} className="btn btn-logout">
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
