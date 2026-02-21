import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ must match backend
});

// Set or remove Authorization header globally
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

// Load token if already saved
const savedToken = localStorage.getItem('token');
if (savedToken) {
  setAuthToken(savedToken);
}

// Request interceptor - Always check for token before each request
API.interceptors.request.use(
  (config) => {
    // Always get the latest token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // If 401 Unauthorized, clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete API.defaults.headers.common['Authorization'];
      
      // Only redirect if not already on a login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;