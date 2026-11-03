const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

export const clearCache = (onlyExpired = false) => {
  try {
    const now = Date.now();
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('spotify-api:')) {
        const item = JSON.parse(sessionStorage.getItem(key));
        if (!onlyExpired || now - item.timestamp > CACHE_EXPIRATION) {
          sessionStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    // Silent cleanup failure
  }
};

const getFromSessionStorage = (key) => {
  try {
    clearCache(true);
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    return null;
  }
};

const saveToSessionStorage = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    // Ignore storage errors
  }
};

const handleResponse = async (response) => {
  // An expired or invalid token cannot recover: drop it and go back to login
  if (response.status === 401 && localStorage.getItem('auth_token')) {
    localStorage.removeItem('auth_token');
    clearCache();
    window.location.assign('/');
  }
  const data = await response.json().catch(() => ({}));
  if (response.ok && data.status === 'success') {
    return data;
  }
  throw new Error(data.message || 'Something went wrong');
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  get: async (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    const cacheKey = `spotify-api:${url}`;

    const cachedData = getFromSessionStorage(cacheKey);
    if (cachedData) {
      return cachedData.data;
    }

    const response = await fetch(`${BACKEND_URL}${url}`, { headers: getAuthHeaders() });
    const data = await handleResponse(response);
    saveToSessionStorage(cacheKey, data);
    return data;
  },
};
