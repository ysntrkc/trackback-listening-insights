import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Loading from './Loading';
import './TopItems.css';

const TopArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('medium_term');

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/top-artists', {
          time_range: timeRange,
          limit: 50
        });
        setArtists(response.data.artists || []);
      } catch (error) {
        console.error('Error fetching top artists:', error);
        setError(error.message || 'Failed to fetch top artists');
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="top-items-container">
      <h1 className="page-title">Your Top Artists</h1>
      
      <div className="time-range-selector">
        <button 
          className={timeRange === 'short_term' ? 'active' : ''} 
          onClick={() => handleTimeRangeChange('short_term')}
        >
          Last 4 Weeks
        </button>
        <button 
          className={timeRange === 'medium_term' ? 'active' : ''} 
          onClick={() => handleTimeRangeChange('medium_term')}
        >
          Last 6 Months
        </button>
        <button 
          className={timeRange === 'long_term' ? 'active' : ''} 
          onClick={() => handleTimeRangeChange('long_term')}
        >
          All Time
        </button>
      </div>
      
      {loading ? (
        <Loading />
      ) : (
        <div className="artists-grid">
          {artists.map((artist, index) => (
            <div key={index} className="artist-card">
              {artist.image && (
                <img src={artist.image} alt={artist.name} className="artist-image" />
              )}
              <div className="artist-info">
                <span className="artist-rank">{index + 1}</span>
                <h3 className="artist-name">{artist.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopArtists;
