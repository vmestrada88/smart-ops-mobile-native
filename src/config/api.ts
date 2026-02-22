/**
 * API Configuration
 * Centralized API URLs and endpoints
 */

// Change this to your backend URL
// For Android Emulator use: http://10.0.2.2:5000
// For iOS Simulator use: http://localhost:5000
// For physical device use your computer's IP: http://192.168.x.x:5000
// For EC2 production: https://smartsolutionfl.com
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:5000'  // Development (Android Emulator) - Backend runs on port 5000
  : 'https://smartsolutionfl.com';  // Production

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  RESET_PASSWORD: `${API_BASE_URL}/api/reset-password`,
  
  USERS: `${API_BASE_URL}/api/users`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  CLIENTS: `${API_BASE_URL}/api/clients`,
  INVOICES: `${API_BASE_URL}/api/invoices`,
  PROPOSALS: `${API_BASE_URL}/api/proposals`,
};
