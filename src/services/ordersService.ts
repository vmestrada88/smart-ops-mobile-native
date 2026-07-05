import { API_ENDPOINTS } from '../constants/api';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    price?: number;
    priceSell?: number;
    image_url?: string;
  };
}

export interface Order {
  id: number;
  totalAmount: number;
  shippingAddress?: any;
  paymentIntentId?: string | null;
  status?: string;
  createdAt?: string;
  orderItems?: OrderItem[];
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

export const createOrder = async (
  shippingAddress: any,
  items: Array<{ productId: number; quantity: number; price: number }> = [],
  token?: string,
): Promise<{ order: Order }> => {
  const payload = {
    shippingAddress,
    // Backend actualmente ignora `items`, pero lo enviamos para mantener compatibilidad
    items,
  };

  const response = await fetch(API_ENDPOINTS.orders, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status} ${errorText}`.trim());
  }

  return response.json();
};

export const fetchOrders = async (token?: string): Promise<Order[]> => {
  const response = await fetch(API_ENDPOINTS.orders, {
    method: 'GET',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

export const fetchOrderById = async (id: number, token?: string): Promise<Order> => {
  const response = await fetch(`${API_ENDPOINTS.orders}/${id}`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

