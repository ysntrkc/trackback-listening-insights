import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Loading from './Loading';
import TimeRangeSelector from './TimeRangeSelector';
import '../styles/TopItems.css';

const TopArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('medium_term');

  useEffect(() => {
    let ignore = false;
    const fetchTopArtists = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/top-artists', {
          time_range: timeRange,
          limit: 50
        });
        if (!ignore) setArtists(response.data.artists || []);
      } catch (error) {
        if (!ignore) setError(error.message || 'Failed to fetch top artists');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchTopArtists();
    return () => { ignore = true; };
  }, [timeRange]);

  return (
    <div className="top-items-container">
      <h1 className="page-title">Your Top Artists</h1>
      
      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      
      {error ? (
        <div className="error-message">{error}</div>
      ) : loading ? (
        <Loading />
      ) : (
        <div className="artists-grid">
          {artists.map((artist, index) => (
            <a 
              key={index} 
              href={artist.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="artist-card"
            >
              {artist.image && (
                <img src={artist.image} alt={artist.name} className="artist-image" />
              )}
              <div className="artist-info">
                <span className="artist-rank">{index + 1}</span>
                <h3 className="artist-name">{artist.name}</h3>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopArtists;
