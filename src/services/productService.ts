/**
 * Product Service
 * 
 * Service module for handling product-related API calls
 */

import { API_ENDPOINTS } from '../constants/api';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
  brand?: string;
  model?: string;
  stock_quantity?: number;
}

/**
 * Fetch all products from the API
 * @returns {Promise<Product[]>} Array of products
 * @throws {Error} If the API request fails
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.products, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 * @param {number} id - Product ID
 * @returns {Promise<Product>} Product data
 * @throws {Error} If the API request fails
 */
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.products}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};
