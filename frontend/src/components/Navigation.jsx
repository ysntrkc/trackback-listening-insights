import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/Navigation.css';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { userProfile, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/top-tracks">
            <i className="fab fa-spotify" aria-hidden="true"></i> TrackBack Listening Insights
          </Link>
        </div>

        <ul className="nav-menu">
          <li>
            <NavLink to="/top-tracks" className="nav-link">Top Tracks</NavLink>
          </li>
          <li>
            <NavLink to="/top-artists" className="nav-link">Top Artists</NavLink>
          </li>
          <li>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
          </li>
          <li>
            <a href="https://github.com/ysntrkc/trackback-listening-insights" target="_blank" rel="noopener noreferrer" aria-label="Source code on GitHub">
              <i className="fab fa-github" aria-hidden="true"></i>
            </a>
          </li>
        </ul>

        <div className="nav-user">
          {userProfile && (
            <>
              {userProfile.profile_image && (
                <img
                  src={userProfile.profile_image}
                  alt=""
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
