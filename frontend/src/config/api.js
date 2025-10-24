// API Configuration for Ward 26 Problem Reporting System
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

console.log('API_BASE_URL:', API_BASE_URL); // Debug log

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Helper function for exponential backoff
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry logic for failed requests
const retryRequest = async (config, retryCount = 0) => {
  try {
    return await axios(config);
  } catch (error) {
    // Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
    const shouldRetry = 
      retryCount < MAX_RETRIES &&
      (!error.response || 
       error.response.status >= 500 || 
       error.response.status === 408 || 
       error.response.status === 429 ||
       error.code === 'ECONNABORTED' ||
       error.code === 'ETIMEDOUT' ||
       error.message === 'Network Error');

    if (shouldRetry) {
      const delayTime = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
      console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES}) after ${delayTime}ms...`);
      await delay(delayTime);
      return retryRequest(config, retryCount + 1);
    }
    
    throw error;
  }
};

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

// Add response interceptor for error handling with retry
axios.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.config.url);
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Check if this is a retryable error and hasn't been retried yet
    if (!config || config.__retryCount !== undefined) {
      // Already retried or not retryable
      console.error('API Error:', error.response?.data || error.message);
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout - API took too long to respond');
      }
      return Promise.reject(error);
    }

    // Check if should retry
    const shouldRetry = 
      !error.response || 
      error.response.status >= 500 || 
      error.response.status === 408 || 
      error.response.status === 429 ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      error.message === 'Network Error';

    if (shouldRetry) {
      config.__retryCount = 0;
      console.log('Attempting retry for failed request...');
      return retryRequest(config);
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API_BASE_URL;
