import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Invoice {
  id: string;
  invoice_number: string;
  patient_id: string;
  patient_name: string;
  patient_email?: string;
  patient_phone?: string;
  patient_address?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  type: 'consultation' | 'procedure' | 'surgery' | 'lab_test' | 'pharmacy' | 'hospitalization' | 'emergency' | 'other';
  status: 'draft' | 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  issue_date: string;
  due_date: string;
  paid_date?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  discount_amount: number;
  insurance_coverage?: number;
  patient_responsibility: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  payment_method?: 'cash' | 'card' | 'bank_transfer' | 'insurance' | 'mixed';
  payment_reference?: string;
  notes?: string;
  terms_and_conditions?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'consultation' | 'procedure' | 'medication' | 'lab_test' | 'room_charge' | 'equipment' | 'other';
  code?: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  tax?: number;
  total: number;
  is_covered_by_insurance?: boolean;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'insurance' | 'other';
  reference_number?: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface InsuranceClaim {
  id: string;
  invoice_id: string;
  claim_number: string;
  insurance_provider: string;
  policy_number: string;
  claim_amount: number;
  approved_amount?: number;
  status: 'pending' | 'approved' | 'rejected' | 'partially_approved';
  submission_date: string;
  approval_date?: string;
  notes?: string;
}

export interface BillingStatistics {
  total_revenue: number;
  outstanding_balance: number;
  overdue_invoices: number;
  paid_this_month: number;
  pending_insurance_claims: number;
  average_payment_time: number;
  revenue_by_category: Record<string, number>;
  revenue_by_month: { month: string; amount: number }[];
}

interface InvoiceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  payments: Payment[];
  insuranceClaims: InsuranceClaim[];
  statistics: BillingStatistics | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string;
    dateRange: {
      start: string | null;
      end: string | null;
    };
    searchTerm: string;
    type: string;
  };
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    invoice_number: 'INV-2024-001',
    patient_id: 'pat1',
    patient_name: 'John Doe',
    patient_email: 'john.doe@email.com',
    patient_phone: '+1 234-567-8900',
    patient_address: '123 Main St, Anytown, USA',
    insurance_provider: 'HealthCare Plus',
    insurance_policy_number: 'HCP123456',
    type: 'consultation',
    status: 'paid',
    issue_date: '2024-01-15T10:00:00',
    due_date: '2024-02-15T10:00:00',
    paid_date: '2024-01-20T10:00:00',
    items: [
      {
        id: 'item1',
        description: 'General Consultation - Dr. Sarah Johnson',
        category: 'consultation',
        code: 'CONS-001',
        quantity: 1,
        unit_price: 150,
        discount: 0,
        tax: 15,
        total: 165,
        is_covered_by_insurance: true,
      },
      {
        id: 'item2',
        description: 'Blood Test - Complete Blood Count',
        category: 'lab_test',
        code: 'LAB-CBC',
        quantity: 1,
        unit_price: 50,
        discount: 0,
        tax: 5,
        total: 55,
        is_covered_by_insurance: true,
      },
    ],
    subtotal: 200,
    tax_rate: 10,
    tax_amount: 20,
    discount_type: 'percentage',
    discount_value: 10,
    discount_amount: 20,
    insurance_coverage: 150,
    patient_responsibility: 50,
    total_amount: 200,
    paid_amount: 200,
    balance_due: 0,
    payment_method: 'mixed',
    payment_reference: 'PAY-2024-001',
    notes: 'Insurance covered 75% of the total amount',
    created_by: 'admin',
    created_at: '2024-01-15T10:00:00',
    updated_at: '2024-01-20T10:00:00',
  },
  {
    id: 'inv2',
    invoice_number: 'INV-2024-002',
    patient_id: 'pat2',
    patient_name: 'Jane Smith',
    patient_email: 'jane.smith@email.com',
    patient_phone: '+1 234-567-8901',
    type: 'procedure',
    status: 'pending',
    issue_date: '2024-01-20T14:00:00',
    due_date: '2024-02-20T14:00:00',
    items: [
      {
        id: 'item3',
        description: 'Cardiac Catheterization',
        category: 'procedure',
        code: 'PROC-CATH',
        quantity: 1,
        unit_price: 5000,
        discount: 0,
        tax: 500,
        total: 5500,
        is_covered_by_insurance: true,
      },
      {
        id: 'item4',
        description: 'Anesthesia Services',
        category: 'procedure',
        code: 'ANES-001',
        quantity: 1,
        unit_price: 800,
        discount: 0,
        tax: 80,
        total: 880,
        is_covered_by_insurance: true,
      },
      {
        id: 'item5',
        description: 'Recovery Room - 4 hours',
        category: 'room_charge',
        code: 'ROOM-REC',
        quantity: 4,
        unit_price: 100,
        discount: 0,
        tax: 40,
        total: 440,
        is_covered_by_insurance: true,
      },
    ],
    subtotal: 6200,
    tax_rate: 10,
    tax_amount: 620,
    discount_amount: 0,
    insurance_coverage: 5000,
    patient_responsibility: 1820,
    total_amount: 6820,
    paid_amount: 0,
    balance_due: 6820,
    notes: 'Pending insurance approval',
    created_by: 'admin',
    created_at: '2024-01-20T14:00:00',
    updated_at: '2024-01-20T14:00:00',
  },
  {
    id: 'inv3',
    invoice_number: 'INV-2024-003',
    patient_id: 'pat3',
    patient_name: 'Robert Johnson',
    type: 'pharmacy',
    status: 'overdue',
    issue_date: '2023-12-15T10:00:00',
    due_date: '2024-01-15T10:00:00',
    items: [
      {
        id: 'item6',
        description: 'Amoxicillin 500mg - 20 tablets',
        category: 'medication',
        code: 'MED-AMX500',
        quantity: 1,
        unit_price: 25,
        discount: 0,
        tax: 2.5,
        total: 27.5,
      },
      {
        id: 'item7',
        description: 'Paracetamol 500mg - 30 tablets',
        category: 'medication',
        code: 'MED-PARA500',
        quantity: 2,
        unit_price: 10,
        discount: 0,
        tax: 2,
        total: 22,
      },
    ],
    subtotal: 45,
    tax_rate: 10,
    tax_amount: 4.5,
    discount_amount: 0,
    insurance_coverage: 0,
    patient_responsibility: 49.5,
    total_amount: 49.5,
    paid_amount: 0,
    balance_due: 49.5,
    created_by: 'pharmacy',
    created_at: '2023-12-15T10:00:00',
    updated_at: '2023-12-15T10:00:00',
  },
];

const mockPayments: Payment[] = [
  {
    id: 'pay1',
    invoice_id: 'inv1',
    amount: 50,
    payment_date: '2024-01-20T10:00:00',
    payment_method: 'card',
    reference_number: 'CARD-001',
    notes: 'Patient copayment',
    created_by: 'cashier1',
    created_at: '2024-01-20T10:00:00',
  },
  {
    id: 'pay2',
    invoice_id: 'inv1',
    amount: 150,
    payment_date: '2024-01-25T10:00:00',
    payment_method: 'insurance',
    reference_number: 'INS-CLAIM-001',
    notes: 'Insurance payment received',
    created_by: 'system',
    created_at: '2024-01-25T10:00:00',
  },
];

const mockStatistics: BillingStatistics = {
  total_revenue: 125000,
  outstanding_balance: 15000,
  overdue_invoices: 5,
  paid_this_month: 45000,
  pending_insurance_claims: 12,
  average_payment_time: 15,
  revenue_by_category: {
    consultation: 35000,
    procedure: 45000,
    medication: 15000,
    lab_test: 20000,
    room_charge: 10000,
  },
  revenue_by_month: [
    { month: 'Jan 2024', amount: 45000 },
    { month: 'Dec 2023', amount: 38000 },
    { month: 'Nov 2023', amount: 42000 },
  ],
};

const initialState: InvoiceState = {
  invoices: mockInvoices,
  selectedInvoice: null,
  payments: mockPayments,
  insuranceClaims: [],
  statistics: mockStatistics,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    dateRange: {
      start: null,
      end: null,
    },
    searchTerm: '',
    type: 'all',
  },
};

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (params?: { patientId?: string; status?: string }) => {
    const response = await api.get('/invoices', { params });
    return response.data;
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (invoiceId: string) => {
    const response = await api.get(`/invoices/${invoiceId}`);
    return response.data;
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData: Partial<Invoice>) => {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, data }: { id: string; data: Partial<Invoice> }) => {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data;
  }
);

export const recordPayment = createAsyncThunk(
  'invoices/recordPayment',
  async (paymentData: Partial<Payment>) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  }
);

export const submitInsuranceClaim = createAsyncThunk(
  'invoices/submitInsuranceClaim',
  async (claimData: Partial<InsuranceClaim>) => {
    const response = await api.post('/insurance-claims', claimData);
    return response.data;
  }
);

export const fetchBillingStatistics = createAsyncThunk(
  'invoices/fetchStatistics',
  async () => {
    const response = await api.get('/billing/statistics');
    return response.data;
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.selectedInvoice = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<InvoiceState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateInvoiceStatus: (state, action: PayloadAction<{ id: string; status: Invoice['status'] }>) => {
      const invoice = state.invoices.find(inv => inv.id === action.payload.id);
      if (invoice) {
        invoice.status = action.payload.status;
        invoice.updated_at = new Date().toISOString();
      }
    },
    addInvoiceItem: (state, action: PayloadAction<{ invoiceId: string; item: InvoiceItem }>) => {
      const invoice = state.invoices.find(inv => inv.id === action.payload.invoiceId);
      if (invoice) {
        invoice.items.push(action.payload.item);
        // Recalculate totals
        invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
        invoice.tax_amount = invoice.subtotal * (invoice.tax_rate / 100);
        invoice.total_amount = invoice.subtotal + invoice.tax_amount - invoice.discount_amount;
        invoice.balance_due = invoice.total_amount - invoice.paid_amount;
      }
    },
    removeInvoiceItem: (state, action: PayloadAction<{ invoiceId: string; itemId: string }>) => {
      const invoice = state.invoices.find(inv => inv.id === action.payload.invoiceId);
      if (invoice) {
        invoice.items = invoice.items.filter(item => item.id !== action.payload.itemId);
        // Recalculate totals
        invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
        invoice.tax_amount = invoice.subtotal * (invoice.tax_rate / 100);
        invoice.total_amount = invoice.subtotal + invoice.tax_amount - invoice.discount_amount;
        invoice.balance_due = invoice.total_amount - invoice.paid_amount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload || state.invoices;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invoices';
      })
      // Create invoice
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload);
      })
      // Update invoice
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      })
      // Record payment
      .addCase(recordPayment.fulfilled, (state, action) => {
        state.payments.push(action.payload);
        // Update invoice paid amount and balance
        const invoice = state.invoices.find(inv => inv.id === action.payload.invoice_id);
        if (invoice) {
          invoice.paid_amount += action.payload.amount;
          invoice.balance_due = invoice.total_amount - invoice.paid_amount;
          if (invoice.balance_due === 0) {
            invoice.status = 'paid';
            invoice.paid_date = action.payload.payment_date;
          } else if (invoice.paid_amount > 0) {
            invoice.status = 'partially_paid';
          }
        }
      })
      // Fetch statistics
      .addCase(fetchBillingStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });
  },
});

export const {
  setSelectedInvoice,
  setFilters,
  clearFilters,
  updateInvoiceStatus,
  addInvoiceItem,
  removeInvoiceItem,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;