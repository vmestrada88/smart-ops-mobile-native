/**
 * useAuth Hook
 * Custom hook for authentication operations
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
  });

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          user,
          token,
          loading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Save token and user
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    setAuthState({
      isAuthenticated: true,
      user: data.user,
      token: data.token,
      loading: false,
    });

    return data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
    });
  };

  const getAuthHeader = () => {
    if (authState.token) {
      return {
        'Authorization': `Bearer ${authState.token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  };

  return {
    ...authState,
    login,
    logout,
    checkAuth,
    getAuthHeader,
  };
};
