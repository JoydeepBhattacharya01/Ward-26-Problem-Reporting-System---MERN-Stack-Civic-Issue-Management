// API Configuration for Ward 26 Problem Reporting System
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

console.log('API_BASE_URL:', API_BASE_URL); // Debug log

export const API_ENDPOINTS = {
  // Authentication endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/auth/admin/login`,
  
  // Problem endpoints
  PROBLEMS: `${API_BASE_URL}/api/problems`,
  PROBLEMS_STATS: `${API_BASE_URL}/api/problems/stats/summary`,
  USER_PROBLEMS: (phone) => `${API_BASE_URL}/api/problems/user/${phone}`,
  PROBLEM_BY_ID: (id) => `${API_BASE_URL}/api/problems/${id}`,
  UPDATE_PROBLEM_STATUS: (id) => `${API_BASE_URL}/api/problems/${id}/status`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`
};

// Configure axios defaults
import axios from 'axios';

axios.defaults.timeout = 30000; // 30 second timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - API took too long to respond');
    }
    return Promise.reject(error);
  }
);

export default API_BASE_URL;
