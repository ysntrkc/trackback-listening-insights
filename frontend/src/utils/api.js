const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

const clearExpiredCache = () => {
  try {
    const now = Date.now();
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('spotify-api:')) {
        const item = JSON.parse(sessionStorage.getItem(key));
        if (now - item.timestamp > CACHE_EXPIRATION) {
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
    clearExpiredCache();
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    
    const parsedItem = JSON.parse(item);
    if (Date.now() - parsedItem.timestamp > CACHE_EXPIRATION) {
      sessionStorage.removeItem(key);
      return null;
    }
    return parsedItem;
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
  const data = await response.json();
  if (response.ok && data.status === 'success') {
    return data;
  }
  throw new Error(data.message || 'Something went wrong');
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const createRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: getAuthHeaders(),
  };

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });
  
  return handleResponse(response);
};

export const api = {
  get: (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    const cacheKey = `spotify-api:${url}`;
    
    const cachedData = getFromSessionStorage(cacheKey);
    if (cachedData) {
      return Promise.resolve(cachedData.data);
    }
    
    const promise = createRequest(url, { method: 'GET' })
      .then(data => {
        saveToSessionStorage(cacheKey, data);
        return data;
      });
    
    return promise;
  },

  post: (endpoint, data = null) => {
    return createRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  },
};