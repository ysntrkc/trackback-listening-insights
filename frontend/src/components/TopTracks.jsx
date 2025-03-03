import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Loading from './Loading';
import '../styles/TopItems.css';

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('medium_term');

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/top-tracks', {
          time_range: timeRange,
          limit: 50
        });
        setTracks(response.data.tracks || []);
      } catch (error) {
        console.error('Error fetching top tracks:', error);
        setError(error.message || 'Failed to fetch top tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="top-items-container">
      <h1 className="page-title">Your Top Tracks</h1>
      
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
        <div className="tracks-table-container">
          <table className="tracks-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cover</th>
                <th>Track</th>
                <th>Artist</th>
                <th>Album</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {track.image && (
                      <img src={track.image} alt={track.name} className="track-image" />
                    )}
                  </td>
                  <td>
                    <a 
                      href={track.spotify_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="spotify-link"
                    >
                      {track.name}
                    </a>
                  </td>
                  <td>
                    <a 
                      href={track.artist_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="spotify-link"
                    >
                      {track.artist}
                    </a>
                  </td>
                  <td>{track.album}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopTracks;
