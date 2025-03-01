import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function TopArtists({ timeRange }) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        setLoading(true);
        const res = await apiService.getTopArtists(timeRange);
        
        if (res.data.status === 'success') {
          setArtists(res.data.data.artists);
          setError(null);
        } else {
          setError('Failed to load artists');
        }
      } catch (err) {
        setError(err.message || 'Error loading artists');
        console.error('Error fetching top artists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [timeRange]);

  if (loading) return <div className="loading">Loading artists...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="top-artists">
      <h2>Your Top Artists</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Artist</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <div className="item-row">
                  {artist.image && <img src={artist.image} alt={artist.name} className="item-image" />}
                  <span>{artist.name}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopArtists;
