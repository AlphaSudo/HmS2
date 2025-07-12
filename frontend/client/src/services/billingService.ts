import { api } from '@/lib/api';
import type { AxiosResponse } from 'axios';

// Types aligned with backend entity
export interface Money {
  amount: number;
  currency: string;
}

export interface BillingItem {
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
  category: string;
}

export interface Insurance {
  insuranceCompany: string;
  policyNumber: string;
  coveragePercentage: number;
  copayAmount: Money;
  deductible: Money;
  maxCoverage: Money;
}

export interface Payment {
  paymentId: string;
  amount: Money;
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  status: string;
}

export interface Invoice {
  id: string;
  patientId: number;
  doctorId: number;
  appointmentId: number;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  billingItems: BillingItem[];
  subtotal: Money;
  taxAmount: Money;
  discountAmount: Money;
  totalAmount: Money;
  insurance?: Insurance;
  insuranceCoverage: Money;
  patientResponsibility: Money;
  payments: Payment[];
  paidAmount: Money;
  outstandingAmount: Money;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  notes: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for display (populated by frontend)
  doctorName?: string;
}

export interface InvoiceFilters {
  status?: string;
  patientId?: number;
  doctorId?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export interface InvoiceResponse {
  content: Invoice[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
}

export interface PaymentRequest {
  amount: Money;
  paymentMethod: string;
  notes?: string;
}

export interface InvoiceStats {
  patientId: number;
  totalBilled: Money;
  totalPaid: Money;
  totalOutstanding: Money;
}

// API Endpoints for Billing Service
const INVOICES_API_URL = '/invoices';

// Invoice Management
export const getAllInvoices = async () => {
  // Since there's no GET /invoices endpoint, we'll get invoices from all statuses
  const statuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'];
  const allInvoices: Invoice[] = [];
  
  try {
    // Fetch invoices for each status and combine them
    const statusPromises = statuses.map(status => 
      api.get<Invoice[]>(`${INVOICES_API_URL}/status/${status}`)
    );
    
    const responses = await Promise.all(statusPromises);
    
    // Combine all invoices from different statuses
    responses.forEach(response => {
      if (response.data && Array.isArray(response.data)) {
        allInvoices.push(...response.data);
      }
    });
    
    // Return in the expected format
    return {
      data: allInvoices,
      status: 200,
      statusText: 'OK'
    } as any;
  } catch (error) {
    console.error('Error fetching invoices by status:', error);
    throw error;
  }
};

export const getInvoices = (filters?: InvoiceFilters) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }
  return api.get<InvoiceResponse>(`${INVOICES_API_URL}?${params.toString()}`);
};

export const getInvoiceById = (id: string) => 
  api.get<Invoice>(`${INVOICES_API_URL}/${id}`);

export const getInvoicesByPatient = async (patientId: number, filters?: InvoiceFilters): Promise<AxiosResponse<InvoiceResponse>> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }
  const response = await api.get<Invoice[]>(`${INVOICES_API_URL}/patient/${patientId}?${params.toString()}`);
  const invoices = response.data;

  // Build object matching expected InvoiceResponse shape
  const invoiceResponse: InvoiceResponse = {
    content: invoices,
    totalElements: invoices.length,
    totalPages: 1,
    size: invoices.length,
    page: 0,
  };

  // Return an object that looks like AxiosResponse<InvoiceResponse>
  return {
    ...response,
    data: invoiceResponse,
  } as AxiosResponse<InvoiceResponse>;
};

export const getInvoicesByUserId = async (userId: number, filters?: InvoiceFilters): Promise<AxiosResponse<InvoiceResponse>> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }
  const response = await api.get<Invoice[]>(`${INVOICES_API_URL}/user/${userId}?${params.toString()}`);
  const invoices = response.data;

  // Build object matching expected InvoiceResponse shape
  const invoiceResponse: InvoiceResponse = {
    content: invoices,
    totalElements: invoices.length,
    totalPages: 1,
    size: invoices.length,
    page: 0,
  };

  // Return an object that looks like AxiosResponse<InvoiceResponse>
  return {
    ...response,
    data: invoiceResponse,
  } as AxiosResponse<InvoiceResponse>;
};

export const getInvoicesByDoctor = (doctorId: number, filters?: InvoiceFilters) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }
  return api.get<InvoiceResponse>(`${INVOICES_API_URL}/doctor/${doctorId}?${params.toString()}`);
};

export const createInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) =>
  api.post<Invoice>(INVOICES_API_URL, invoice);

export const updateInvoice = (id: string, invoice: Partial<Invoice>) =>
  api.put<Invoice>(`${INVOICES_API_URL}/${id}`, invoice);

export const deleteInvoice = (id: string) =>
  api.delete(`${INVOICES_API_URL}/${id}`);

// Payment Management
export const addPayment = (invoiceId: string, payment: PaymentRequest) =>
  api.post<Invoice>(`${INVOICES_API_URL}/${invoiceId}/payments`, payment);

export const getPaymentHistory = (invoiceId: string) =>
  api.get<Payment[]>(`${INVOICES_API_URL}/${invoiceId}/payments`);

// Invoice Status Management
export const updateInvoiceStatus = (invoiceId: string, status: Invoice['status']) =>
  api.patch<Invoice>(`${INVOICES_API_URL}/${invoiceId}/status`, { status });

export const sendInvoice = (invoiceId: string) =>
  api.post<Invoice>(`${INVOICES_API_URL}/${invoiceId}/send`);

export const markInvoiceAsPaid = (invoiceId: string) =>
  api.patch<Invoice>(`${INVOICES_API_URL}/${invoiceId}/mark-paid`);

// Statistics and Reports
export const getInvoiceStats = (patientId?: number, fromDate?: string, toDate?: string) => {
  const params = new URLSearchParams();
  if (patientId) params.append('patientId', String(patientId));
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  return api.get<InvoiceStats>(`${INVOICES_API_URL}/stats?${params.toString()}`);
};

export const getPatientBillingStats = (patientId: number) =>
  api.get<InvoiceStats>(`${INVOICES_API_URL}/stats/${patientId}`);

export const getPatientBillingStatsByUserId = (userId: number) =>
  api.get<InvoiceStats>(`${INVOICES_API_URL}/stats/user/${userId}`);

// Export and Download
export const downloadInvoicePDF = (invoiceId: string) =>
  api.get(`${INVOICES_API_URL}/${invoiceId}/download-pdf`, {
    responseType: 'blob',
    headers: {
      'Accept': 'application/pdf'
    }
  });

export const exportInvoicesCSV = (filters?: InvoiceFilters) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
  }
  return api.get(`${INVOICES_API_URL}/export/csv?${params.toString()}`, {
    responseType: 'blob',
    headers: {
      'Accept': 'text/csv'
    }
  });
};

// Insurance Claims
export const submitInsuranceClaim = (invoiceId: string) =>
  api.post<Invoice>(`${INVOICES_API_URL}/${invoiceId}/insurance/submit`);

export const getInsuranceClaimStatus = (invoiceId: string) =>
  api.get<{ status: string; submittedAt?: string; processedAt?: string; notes?: string }>(`${INVOICES_API_URL}/${invoiceId}/insurance/status`);

// Utility functions for frontend
export const formatMoney = (money: Money | number, currency: string = 'USD'): string => {
  if (typeof money === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(money);
  }
  if (!money || typeof money.amount !== 'number' || typeof money.currency !== 'string') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(0);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currency,
  }).format(money.amount);
};

export const createMoneyObject = (amount: number, currency: string = 'USD'): Money => ({
  amount,
  currency
});

export const addMoney = (money1: Money, money2: Money): Money => {
  if (money1.currency !== money2.currency) {
    throw new Error('Cannot add money with different currencies');
  }
  return {
    amount: money1.amount + money2.amount,
    currency: money1.currency
  };
};

export const subtractMoney = (money1: Money, money2: Money): Money => {
  if (money1.currency !== money2.currency) {
    throw new Error('Cannot subtract money with different currencies');
  }
  return {
    amount: money1.amount - money2.amount,
    currency: money1.currency
  };
}; 

// Sample data for development and fallback
export const createSampleInvoice = (id: string, overrides?: Partial<Invoice>): Invoice => ({
  id,
  patientId: 1,
  doctorId: 1,
  appointmentId: 1,
  invoiceNumber: `SAMPLE-${id}`,
  invoiceDate: new Date().toISOString(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  billingItems: [
    {
      itemCode: "DEMO_CONS",
      description: "Sample Consultation (Demo Data)",
      quantity: 1,
      unitPrice: { amount: 150.00, currency: "USD" },
      totalPrice: { amount: 150.00, currency: "USD" },
      category: "CONSULTATION"
    }
  ],
  subtotal: { amount: 150.00, currency: "USD" },
  taxAmount: { amount: 12.00, currency: "USD" },
  discountAmount: { amount: 0.00, currency: "USD" },
  totalAmount: { amount: 162.00, currency: "USD" },
  insuranceCoverage: { amount: 0.00, currency: "USD" },
  patientResponsibility: { amount: 162.00, currency: "USD" },
  payments: [],
  paidAmount: { amount: 0.00, currency: "USD" },
  outstandingAmount: { amount: 162.00, currency: "USD" },
  status: "SENT",
  notes: "This is sample data for demonstration purposes.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  doctorName: "Dr. Sample (Demo)"
});

export const createSampleStats = (): InvoiceStats => ({
  patientId: 1,
  totalBilled: { amount: 850.00, currency: "USD" },
  totalPaid: { amount: 450.00, currency: "USD" },
  totalOutstanding: { amount: 400.00, currency: "USD" }
});

export const getSampleInvoices = (count: number = 3): Invoice[] => {
  return Array.from({ length: count }, (_, i) => {
    const statuses: Invoice['status'][] = ['PAID', 'SENT', 'OVERDUE'];
    const status = statuses[i % statuses.length];
    
    return createSampleInvoice(`demo-${i + 1}`, {
      status,
      paidAmount: status === 'PAID' ? { amount: 162.00, currency: "USD" } : { amount: 0.00, currency: "USD" },
      outstandingAmount: status === 'PAID' ? { amount: 0.00, currency: "USD" } : { amount: 162.00, currency: "USD" },
      doctorName: [`Dr. Smith (Demo)`, `Dr. Johnson (Demo)`, `Dr. Wilson (Demo)`][i % 3]
    });
  });
}; 