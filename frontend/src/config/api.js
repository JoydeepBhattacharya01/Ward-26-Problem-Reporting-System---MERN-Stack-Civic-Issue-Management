// API Configuration for Ward 26 Problem Reporting System
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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

export default API_BASE_URL;
