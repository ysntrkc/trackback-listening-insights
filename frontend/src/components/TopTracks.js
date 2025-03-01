import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function TopTracks({ timeRange }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        setLoading(true);
        const res = await apiService.getTopTracks(timeRange);
        
        if (res.data.status === 'success') {
          setTracks(res.data.data.tracks);
          setError(null);
        } else {
          setError('Failed to load tracks');
        }
      } catch (err) {
        setError(err.message || 'Error loading tracks');
        console.error('Error fetching top tracks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, [timeRange]);

  if (loading) return <div className="loading">Loading tracks...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="top-tracks">
      <h2>Your Top Tracks</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
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
                <div className="item-row">
                  {track.image && <img src={track.image} alt={track.name} className="item-image" />}
                  <span>{track.name}</span>
                </div>
              </td>
              <td>{track.artist}</td>
              <td>{track.album}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopTracks;
