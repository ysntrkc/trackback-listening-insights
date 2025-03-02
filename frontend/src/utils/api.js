const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Use local storage as persistent cache
const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsedItem = JSON.parse(item);
    return parsedItem;
  } catch (error) {
    console.error('Error retrieving from local storage:', error);
    return null;
  }
};

const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok && data.status === 'success') {
    return data;
  }
  throw new Error(data.message || 'Something went wrong');
};

const createRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });
  
  return handleResponse(response);
};

export const api = {
  get: (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    const cacheKey = `spotify-api:${url}`;
    
    // Check if we have the data in local storage
    const cachedData = getFromLocalStorage(cacheKey);
    if (cachedData) {
      return Promise.resolve(cachedData.data);
    }
    
    // Make the request and save to local storage
    const promise = createRequest(url, { method: 'GET' })
      .then(data => {
        saveToLocalStorage(cacheKey, data);
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