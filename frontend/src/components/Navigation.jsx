import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { userProfile, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <i className="fab fa-spotify"></i> Spotify Stats Tracker
          </Link>
        </div>
        
        <ul className="nav-menu">
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Top Tracks</Link>
          </li>
          <li className={location.pathname === '/top-artists' ? 'active' : ''}>
            <Link to="/top-artists">Top Artists</Link>
          </li>
          <li className={location.pathname === '/profile' ? 'active' : ''}>
            <Link to="/profile">Profile</Link>
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
