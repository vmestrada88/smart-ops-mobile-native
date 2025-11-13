/**
 * Client Service
 * Service module for handling client-related API calls
 */

import { API_ENDPOINTS } from '../constants/api';

export interface Contact {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  cellphone?: string;
  clientId: number;
}

export interface Job {
  id: number;
  date: string;
  description?: string;
  equipmentInstalled?: string[];
  images?: string[];
  notes?: string;
  invoiceId?: number;
  clientId: number;
}

export interface Client {
  id: number;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  createdAt?: string;
  contacts?: Contact[];
  jobs?: Job[];
}

/**
 * Fetch all clients from the API
 * @param {string} token - Authentication token
 * @returns {Promise<Client[]>} Array of clients
 * @throws {Error} If the API request fails
 */
export const getClients = async (token?: string): Promise<Client[]> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(API_ENDPOINTS.clients, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

/**
 * Fetch a single client by ID
 * @param {number} id - Client ID
 * @param {string} token - Authentication token
 * @returns {Promise<Client>} Client data
 * @throws {Error} If the API request fails
 */
export const getClientById = async (id: number, token?: string): Promise<Client> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_ENDPOINTS.clients}/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching client ${id}:`, error);
    throw error;
  }
};
