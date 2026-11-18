import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { DEMO_ADMIN_USER, DEMO_STUDENT_USER } from '../services/demoData';

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

          // Only refresh from server if not in demo session
          if (!parsedUser?.isDemo && !savedToken.startsWith('demo-')) {
            const data = await api.get('/auth/me');
            if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem('iem_user', JSON.stringify(data.user));
            }
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

  const loginAsDemoAdmin = () => {
    const demoToken = 'demo-admin-token-iem-dean';
    setToken(demoToken);
    setUser(DEMO_ADMIN_USER);
    localStorage.setItem('iem_token', demoToken);
    localStorage.setItem('iem_user', JSON.stringify(DEMO_ADMIN_USER));
    return DEMO_ADMIN_USER;
  };

  const loginAsDemoStudent = () => {
    const demoToken = 'demo-student-token-rohan';
    setToken(demoToken);
    setUser(DEMO_STUDENT_USER);
    localStorage.setItem('iem_token', demoToken);
    localStorage.setItem('iem_user', JSON.stringify(DEMO_STUDENT_USER));
    localStorage.setItem('iem_registered_dob', '2005-04-15');
    return DEMO_STUDENT_USER;
  };

  const login = async (email, password) => {
    const isDemoStudent =
      email?.toLowerCase() === 'rohan.sharma@example.com' ||
      email?.toLowerCase() === 'student@example.com';

    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('iem_token', data.token);
        localStorage.setItem('iem_user', JSON.stringify(data.user));
        if (data.user?.dateOfBirth) {
          localStorage.setItem('iem_registered_dob', String(data.user.dateOfBirth).slice(0, 10));
        }
        return data.user;
      }
    } catch (err) {
      if (isDemoStudent) {
        return loginAsDemoStudent();
      }
      throw err;
    }

    if (isDemoStudent) {
      return loginAsDemoStudent();
    }

    throw new Error('Login failed');
  };

  const adminLogin = async (email, password) => {
    const isDemoAdmin =
      email?.toLowerCase() === 'admin@iem.edu' ||
      email?.toLowerCase() === 'dean@iem.edu';

    try {
      const data = await api.post('/auth/admin-login', { email, password: password || 'Admin@123' });
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('iem_token', data.token);
        localStorage.setItem('iem_user', JSON.stringify(data.user));
        return data.user;
      }
    } catch (err) {
      // If the backend has no admin account or returned an error, fallback smoothly to demo admin
      if (isDemoAdmin) {
        return loginAsDemoAdmin();
      }
      throw err;
    }

    if (isDemoAdmin) {
      return loginAsDemoAdmin();
    }

    throw new Error('Admin login failed');
  };

  const register = async (formData) => {
    const data = await api.post('/auth/register', formData);
    if (data.success) {
      const userWithDob = {
        ...data.user,
        dateOfBirth: data.user?.dateOfBirth || formData.dateOfBirth || ''
      };
      setToken(data.token);
      setUser(userWithDob);
      localStorage.setItem('iem_token', data.token);
      localStorage.setItem('iem_user', JSON.stringify(userWithDob));
      if (formData.dateOfBirth) {
        localStorage.setItem('iem_registered_dob', formData.dateOfBirth);
      }
      return userWithDob;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('iem_token');
    localStorage.removeItem('iem_user');
    localStorage.removeItem('iem_registered_dob');
  };

  const value = {
    user,
    token,
    loading,
    login,
    adminLogin,
    loginAsDemoAdmin,
    loginAsDemoStudent,
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
