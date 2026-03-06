/**
 * API Configuration
 * 
 * Central configuration for API endpoints
 */

// Change this based on your environment
// Development: 'http://localhost:5000/api' or 'http://YOUR_IP:5000/api'
// Production: 'https://smartsolutionfl.com/api' (requires SSL certificate)
// EC2 without SSL: 'http://3.128.196.83/api'
// For Android Emulator use 10.0.2.2 (maps to host machine's localhost)
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:5000/api'
  : 'https://smartsolutionfl.com/api';

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/products`,
  clients: `${API_BASE_URL}/clients`,
  invoices: `${API_BASE_URL}/invoices`,
  proposals: `${API_BASE_URL}/proposals`,
  jobs: `${API_BASE_URL}/jobs`,
};

export default API_BASE_URL;
