import { API_ENDPOINTS } from '../constants/api';

export interface LineItemPayload {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  laborCost: number;
  subtotal: number;
  price: number;
  total: number;
  description?: string;
}

export interface CreateInvoicePayload {
  clientId: number;
  date: string;
  laborHours: number;
  laborRate: number;
  taxRate: number;
  taxExempt: boolean;
  totalAmount: number;
  items: LineItemPayload[];
}

export interface CreateProposalPayload {
  clientId: number;
  clientInfoName: string;
  clientInfoEmail?: string;
  clientInfoPhone?: string;
  clientInfoAddress?: string;
  tax: number;
  notes?: string;
  items: LineItemPayload[];
}

const authHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const createInvoice = async (payload: CreateInvoicePayload, token?: string): Promise<any> => {
  const response = await fetch(API_ENDPOINTS.invoices, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const createProposal = async (payload: CreateProposalPayload, token?: string): Promise<any> => {
  console.log('📤 Creating proposal at:', API_ENDPOINTS.proposals);
  console.log('📤 Payload:', JSON.stringify(payload));
  console.log('📤 Token present:', !!token);

  const response = await fetch(API_ENDPOINTS.proposals, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Proposal save failed:', response.status, errorText);
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }

  return response.json();
};
