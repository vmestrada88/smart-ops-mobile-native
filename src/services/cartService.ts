import { API_ENDPOINTS } from '../constants/api';

export interface CartProduct {
  id: number;
  name: string;
  price?: number;
  priceSell?: number;
  image_url?: string;
  description?: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product?: CartProduct;
}

const authHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const fetchCart = async (token?: string): Promise<CartItem[]> => {
  const response = await fetch(API_ENDPOINTS.cart, {
    method: 'GET',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

export const addToCart = async (productId: number, quantity = 1, token?: string) => {
  const response = await fetch(API_ENDPOINTS.cart, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

export const updateCartItem = async (id: number, quantity: number, token?: string) => {
  const response = await fetch(`${API_ENDPOINTS.cart}/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

export const removeCartItem = async (id: number, token?: string) => {
  const response = await fetch(`${API_ENDPOINTS.cart}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

