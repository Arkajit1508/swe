import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import {
  DEMO_ADMIN_USER,
  DEMO_STUDENT_USER,
  getApplicationForUser,
  addRegisteredUser
} from '../services/demoData';

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
    const cleanEmail = email?.toLowerCase()?.trim();
    if (cleanEmail !== 'admin@iem.edu') {
      throw new Error('Access denied: Only the authorized demo admin (admin@iem.edu) can sign in here.');
    }

    try {
      const data = await api.post('/auth/admin-login', { email: cleanEmail, password });
      if (data.success && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('iem_token', data.token);
        localStorage.setItem('iem_user', JSON.stringify(data.user));
        return data.user;
      }
      throw new Error(data.message || 'Invalid admin credentials');
    } catch (err) {
      if (err.message && !err.message.includes('fetch') && !err.message.includes('NetworkError') && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      // Offline fallback: strictly require valid demo admin password
      if (password === 'Admin@123' || password === 'admin@123') {
        return loginAsDemoAdmin();
      }
      throw new Error('Invalid admin credentials. Please enter the correct demo admin password.');
    }
  };

  const register = async (formData) => {
    let data;
    try {
      data = await api.post('/auth/register', formData);
    } catch (err) {
      // If backend fails or offline, provide seamless fallback registration
      const newUserId = 'user-' + Date.now();
      data = {
        success: true,
        token: 'token-reg-' + Date.now(),
        user: {
          id: newUserId,
          _id: newUserId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth || '',
          role: 'student'
        }
      };
    }

    if (data.success) {
      const userWithDob = {
        ...data.user,
        dateOfBirth: data.user?.dateOfBirth || formData.dateOfBirth || ''
      };
      // Immediately register applicant in persistent store for instant admin visibility
      addRegisteredUser(userWithDob);
      setToken(data.token);
      setUser(userWithDob);
      localStorage.setItem('iem_token', data.token);
      localStorage.setItem('iem_user', JSON.stringify(userWithDob));
      if (formData.dateOfBirth) {
        localStorage.setItem('iem_registered_dob', formData.dateOfBirth);
      }
      // Ensure application dossier exists in persistent store
      getApplicationForUser(userWithDob);
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
