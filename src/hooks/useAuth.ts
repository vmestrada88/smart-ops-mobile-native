/**
 * useAuth Hook
 * Custom hook for authentication operations
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../constants/api';

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

const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,  // Changed from /auth/login to /login
  REGISTER: `${API_BASE_URL}/register`,
  RESET_PASSWORD: `${API_BASE_URL}/reset-password`,
};

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
    console.log('🔐 Attempting login to:', AUTH_ENDPOINTS.LOGIN);
    console.log('📧 Email:', email);
    
    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      // Get response text first to debug
      const responseText = await response.text();
      console.log('📄 Response text:', responseText.substring(0, 200));

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📦 Response data:', data);
      } catch (parseError) {
        console.error('❌ JSON Parse Error. Response was:', responseText.substring(0, 500));
        throw new Error(`Server returned invalid JSON. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
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

      console.log('✅ Login successful!');
      return data;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('Error message:', error.message);
      throw error;
    }
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
