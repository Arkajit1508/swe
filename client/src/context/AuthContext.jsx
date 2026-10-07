import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('iem_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage and verify profile
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('iem_token');
      const savedUser = localStorage.getItem('iem_user');

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setToken(savedToken);
          // Refresh user data from server
          const data = await api.get('/auth/me');
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('iem_user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('iem_token', data.token);
      localStorage.setItem('iem_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error(data.message || 'Login failed');
  };

  const adminLogin = async (email, password) => {
    const data = await api.post('/auth/admin-login', { email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('iem_token', data.token);
      localStorage.setItem('iem_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error(data.message || 'Admin login failed');
  };

  const register = async (formData) => {
    const data = await api.post('/auth/register', formData);
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('iem_token', data.token);
      localStorage.setItem('iem_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('iem_token');
    localStorage.removeItem('iem_user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    adminLogin,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
