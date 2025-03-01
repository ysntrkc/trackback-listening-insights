import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';

function Dashboard() {
  const { profile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks' or 'artists'
  const [timeRange, setTimeRange] = useState('medium_term');
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
        <h2>Your Spotify Listening Stats</h2>
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'tracks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracks')}
          >
            Top Tracks
          </button>
          <button 
            className={`tab-button ${activeTab === 'artists' ? 'active' : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            Top Artists
          </button>
        </div>
        
        <div className="time-range">
          <button 
            className={timeRange === 'short_term' ? 'active' : ''}
            onClick={() => setTimeRange('short_term')}
          >
            Last 4 Weeks
          </button>
          <button 
            className={timeRange === 'medium_term' ? 'active' : ''}
            onClick={() => setTimeRange('medium_term')}
          >
            Last 6 Months
          </button>
          <button 
            className={timeRange === 'long_term' ? 'active' : ''}
            onClick={() => setTimeRange('long_term')}
          >
            All Time
          </button>
        </div>
        
        {activeTab === 'tracks' ? (
          <TopTracks timeRange={timeRange} />
        ) : (
          <TopArtists timeRange={timeRange} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
