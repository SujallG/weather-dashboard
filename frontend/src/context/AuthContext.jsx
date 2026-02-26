// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verify token with backend
        try {
          await authService.getProfile();
          setServerStatus('online');
        } catch (error) {
          // Token might be expired, try to refresh
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await authService.refreshToken(refreshToken);
              localStorage.setItem('accessToken', response.accessToken);
              setToken(response.accessToken);
              setServerStatus('online');
            }
          } catch (refreshError) {
            // Refresh failed, clear storage
            localStorage.clear();
            setToken(null);
            setUser(null);
            setServerStatus('offline');
          }
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { accessToken, refreshToken, user } = response;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(accessToken);
      setUser(user);
      setServerStatus('online');
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      if (error.status === 0) {
        toast.error('Cannot connect to server. Please make sure backend is running on port 3000');
      } else {
        toast.error(error.message || 'Login failed');
      }
      setServerStatus('offline');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { accessToken, refreshToken, user } = response;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(accessToken);
      setUser(user);
      setServerStatus('online');
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      if (error.status === 0) {
        toast.error('Cannot connect to server. Please make sure backend is running on port 3000');
      } else {
        toast.error(error.message || 'Registration failed');
      }
      setServerStatus('offline');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        serverStatus,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};