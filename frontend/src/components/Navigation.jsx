import React from 'react';
import '../styles/Navigation.css';
import { useAuth } from '../context/AuthContext';

const Navigation = ({ currentPage, onPageChange }) => {
  const { userProfile, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span onClick={() => onPageChange('top-tracks')} style={{ cursor: 'pointer' }}>
            <i className="fab fa-spotify"></i> TrackBack Listening Insights
          </span>
        </div>
        
        <ul className="nav-menu">
          <li className={currentPage === 'top-tracks' ? 'active' : ''}>
            <span onClick={() => onPageChange('top-tracks')}>Top Tracks</span>
          </li>
          <li className={currentPage === 'top-artists' ? 'active' : ''}>
            <span onClick={() => onPageChange('top-artists')}>Top Artists</span>
          </li>
          <li className={currentPage === 'profile' ? 'active' : ''}>
            <span onClick={() => onPageChange('profile')}>Profile</span>
          </li>
          <li>
            <a href="https://github.com/ysntrkc/trackback-listening-insights" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          </li>
        </ul>
        
        <div className="nav-user">
          {userProfile && (
            <>
              {userProfile.profile_image && (
                <img 
                  src={userProfile.profile_image} 
                  alt={userProfile.display_name || 'User'} 
                  className="user-avatar" 
                />
              )}
              <span className="username">{userProfile.display_name}</span>
            </>
          )}
          <button onClick={logout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
