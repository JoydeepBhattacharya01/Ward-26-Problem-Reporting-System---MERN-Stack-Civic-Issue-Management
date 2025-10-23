import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      setUser(JSON.parse(userData));
      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (phone, password, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? API_ENDPOINTS.ADMIN_LOGIN : API_ENDPOINTS.LOGIN;
      const loginData = isAdmin ? { email: phone, password } : { phone, password };
      
      const response = await axios.post(endpoint, loginData);
      
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'লগইন ব্যর্থ হয়েছে'
      };
    }
  };

  const register = async (name, phone, email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.REGISTER, {
        name,
        phone,
        email,
        password
      });
      
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
