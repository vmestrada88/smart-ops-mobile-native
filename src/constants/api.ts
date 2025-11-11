/**
 * API Configuration
 * 
 * Central configuration for API endpoints
 */

const API_BASE_URL = 'https://smartsolutionfl.com/api';

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/products`,
  clients: `${API_BASE_URL}/clients`,
  invoices: `${API_BASE_URL}/invoices`,
  proposals: `${API_BASE_URL}/proposals`,
  jobs: `${API_BASE_URL}/jobs`,
};

export default API_BASE_URL;
