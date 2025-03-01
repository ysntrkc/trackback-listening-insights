import axios from 'axios';

// Get configuration from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const REQUEST_TIMEOUT = parseInt(process.env.REACT_APP_REQUEST_TIMEOUT || '10000', 10);

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // Include cookies in requests
  timeout: REQUEST_TIMEOUT,
});

// Add response interceptor for standard error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('API connection error:', error);
      return Promise.reject({
        status: 'error',
        message: `Unable to connect to the server at ${API_URL}. Please check if the backend is running.`,
        data: null
      });
    }
    
    // Let the AuthContext handle redirects instead of doing it here
    return Promise.reject(
      error.response?.data || {
        status: 'error',
        message: 'An unexpected error occurred',
        data: null
      }
    );
  }
);

// API methods
export const apiService = {
  // Auth
  getProfile: () => api.get('/profile'),
  logout: () => api.post('/logout'),
  
  // Stats
  getTopTracks: (timeRange = 'medium_term', limit = 20) => 
    api.get(`/top-tracks?time_range=${timeRange}&limit=${limit}`),
  
  getTopArtists: (timeRange = 'medium_term', limit = 20) => 
    api.get(`/top-artists?time_range=${timeRange}&limit=${limit}`),
};

export default apiService;
