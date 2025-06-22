import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

// Interfaces
export interface Invoice {
  id: string;
  invoice_number: string;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_id?: string;
  doctor_id?: string;
  doctor_name?: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  currency: string;
  notes?: string;
  terms?: string;
  payment_method?: string;
  insurance_claim?: InsuranceClaim;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface InvoiceItem {
  id: string;
  service_id: string;
  service_name: string;
  service_code: string;
  description: string;
  category: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  invoice_number: string;
  patient_id: string;
  patient_name: string;
  payment_date: string;
  amount: number;
  payment_method: 'cash' | 'credit_card' | 'debit_card' | 'check' | 'bank_transfer' | 'insurance' | 'other';
  reference_number?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_by: string;
  created_at: string;
}

export interface Service {
  id: string;
  service_code: string;
  name: string;
  description: string;
  category: 'consultation' | 'procedure' | 'lab_test' | 'imaging' | 'medication' | 'supplies' | 'room_charge' | 'other';
  department: string;
  unit_price: number;
  tax_rate: number;
  is_taxable: boolean;
  is_active: boolean;
  requires_prescription: boolean;
  insurance_coverage: boolean;
  created_at: string;
  updated_at: string;
}

export interface InsuranceClaim {
  id: string;
  claim_number: string;
  insurance_provider: string;
  policy_number: string;
  policy_holder: string;
  relationship: 'self' | 'spouse' | 'child' | 'parent' | 'other';
  coverage_percentage: number;
  coverage_amount: number;
  deductible: number;
  copay: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'partially_approved';
  submitted_date?: string;
  approved_date?: string;
  rejection_reason?: string;
  notes?: string;
}

interface BillingState {
  invoices: Invoice[];
  payments: Payment[];
  services: Service[];
  selectedInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  statistics: {
    totalRevenue: number;
    totalPending: number;
    totalOverdue: number;
    monthlyRevenue: number;
    averageInvoiceValue: number;
    paymentSuccessRate: number;
  };
  filters: {
    status: string;
    dateRange: string;
    paymentMethod: string;
    searchQuery: string;
  };
}

// Mock data generators
const generateMockServices = (): Service[] => {
  return [
    // Consultation Services
    {
      id: 'srv1',
      service_code: 'CONS-001',
      name: 'General Consultation',
      description: 'Standard consultation with general physician',
      category: 'consultation',
      department: 'General Medicine',
      unit_price: 150,
      tax_rate: 0,
      is_taxable: false,
      is_active: true,
      requires_prescription: false,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'srv2',
      service_code: 'CONS-002',
      name: 'Specialist Consultation',
      description: 'Consultation with specialist doctor',
      category: 'consultation',
      department: 'Cardiology',
      unit_price: 200,
      tax_rate: 0,
      is_taxable: false,
      is_active: true,
      requires_prescription: false,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'srv3',
      service_code: 'CONS-003',
      name: 'Follow-up Consultation',
      description: 'Follow-up visit with doctor',
      category: 'consultation',
      department: 'General Medicine',
      unit_price: 100,
      tax_rate: 0,
      is_taxable: false,
      is_active: true,
      requires_prescription: false,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    // Lab Tests
    {
      id: 'srv4',
      service_code: 'LAB-001',
      name: 'Complete Blood Count (CBC)',
      description: 'Comprehensive blood test panel',
      category: 'lab_test',
      department: 'Laboratory',
      unit_price: 45,
      tax_rate: 5,
      is_taxable: true,
      is_active: true,
      requires_prescription: true,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'srv5',
      service_code: 'LAB-002',
      name: 'Lipid Profile',
      description: 'Cholesterol and triglycerides test',
      category: 'lab_test',
      department: 'Laboratory',
      unit_price: 60,
      tax_rate: 5,
      is_taxable: true,
      is_active: true,
      requires_prescription: true,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'srv6',
      service_code: 'LAB-003',
      name: 'Blood Sugar Test',
      description: 'Fasting and PP blood sugar',
      category: 'lab_test',
      department: 'Laboratory',
      unit_price: 30,
      tax_rate: 5,
      is_taxable: true,
      is_active: true,
      requires_prescription: false,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    // Imaging
    {
      id: 'srv7',
      service_code: 'IMG-001',
      name: 'X-Ray Chest PA',
      description: 'Chest X-ray posterior-anterior view',
      category: 'imaging',
      department: 'Radiology',
      unit_price: 120,
      tax_rate: 5,
      is_taxable: true,
      is_active: true,
      requires_prescription: true,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'srv8',
      service_code: 'IMG-002',
      name: 'Ultrasound Abdomen',
      description: 'Complete abdominal ultrasound',
      category: 'imaging',
      department: 'Radiology',
      unit_price: 180,
      tax_rate: 5,
      is_taxable: true,
      is_active: true,
      requires_prescription: true,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'srv9',
      service_code: 'IMG-003',
      name: 'CT Scan Head',
      description: 'Computed tomography scan of head',
      category: 'imaging',
      department: 'Radiology',
      unit_price: 800,
      tax_rate: 5,
      is_taxable: true,
      is_active: true,
      requires_prescription: true,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    // Procedures
    {
      id: 'srv10',
      service_code: 'PROC-001',
      name: 'ECG',
      description: 'Electrocardiogram test',
      category: 'procedure',
      department: 'Cardiology',
      unit_price: 50,
      tax_rate: 5,
      is_taxable: true,
      is_active: true,
      requires_prescription: false,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'srv11',
      service_code: 'PROC-002',
      name: 'Wound Dressing',
      description: 'Minor wound dressing and care',
      category: 'procedure',
      department: 'Emergency',
      unit_price: 40,
      tax_rate: 5,
      is_taxable: true,
      is_active: true,
      requires_prescription: false,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'srv12',
      service_code: 'PROC-003',
      name: 'Injection Administration',
      description: 'IM/IV injection administration',
      category: 'procedure',
      department: 'Nursing',
      unit_price: 20,
      tax_rate: 5,
      is_taxable: true,
      is_active: true,
      requires_prescription: true,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    // Room Charges
    {
      id: 'srv13',
      service_code: 'ROOM-001',
      name: 'General Ward (per day)',
      description: 'General ward accommodation per day',
      category: 'room_charge',
      department: 'Administration',
      unit_price: 200,
      tax_rate: 12,
      is_taxable: true,
      is_active: true,
      requires_prescription: false,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'srv14',
      service_code: 'ROOM-002',
      name: 'Private Room (per day)',
      description: 'Private room accommodation per day',
      category: 'room_charge',
      department: 'Administration',
      unit_price: 500,
      tax_rate: 12,
      is_taxable: true,
      is_active: true,
      requires_prescription: false,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'srv15',
      service_code: 'ROOM-003',
      name: 'ICU (per day)',
      description: 'Intensive care unit per day',
      category: 'room_charge',
      department: 'Critical Care',
      unit_price: 1500,
      tax_rate: 12,
      is_taxable: true,
      is_active: true,
      requires_prescription: false,
      insurance_coverage: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];
};

const generateMockInvoices = (services: Service[]): Invoice[] => {
  const patients = [
    { id: 'pat1', name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 123-4567' },
    { id: 'pat2', name: 'Mary Johnson', email: 'mary.johnson@email.com', phone: '(555) 234-5678' },
    { id: 'pat3', name: 'Robert Davis', email: 'robert.davis@email.com', phone: '(555) 345-6789' },
    { id: 'pat4', name: 'Sarah Wilson', email: 'sarah.wilson@email.com', phone: '(555) 456-7890' },
    { id: 'pat5', name: 'Michael Brown', email: 'michael.brown@email.com', phone: '(555) 567-8901' },
  ];

  const doctors = [
    { id: 'doc1', name: 'Dr. Sarah Johnson' },
    { id: 'doc2', name: 'Dr. Michael Chen' },
    { id: 'doc3', name: 'Dr. Emily Williams' },
  ];

  const invoices: Invoice[] = [];
  const currentDate = new Date();
  
  // Generate 15 invoices with various statuses
  for (let i = 0; i < 15; i++) {
    const patient = patients[i % patients.length];
    const doctor = doctors[i % doctors.length];
    const issueDate = new Date(currentDate);
    issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 60)); // Random date within last 60 days
    
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30); // 30 days payment terms
    
    // Random selection of services
    const selectedServices = [];
    const numServices = Math.floor(Math.random() * 4) + 1; // 1-4 services
    
    for (let j = 0; j < numServices; j++) {
      const service = services[Math.floor(Math.random() * services.length)];
      const quantity = service.category === 'room_charge' ? Math.floor(Math.random() * 3) + 1 : 1;
      
      const item: InvoiceItem = {
        id: `item_${i}_${j}`,
        service_id: service.id,
        service_name: service.name,
        service_code: service.service_code,
        description: service.description,
        category: service.category,
        quantity: quantity,
        unit_price: service.unit_price,
        discount_percentage: Math.random() < 0.3 ? Math.floor(Math.random() * 15) : 0,
        discount_amount: 0,
        tax_rate: service.tax_rate,
        tax_amount: 0,
        total: 0,
      };
      
      // Calculate amounts
      const subtotal = item.quantity * item.unit_price;
      item.discount_amount = (subtotal * item.discount_percentage) / 100;
      const afterDiscount = subtotal - item.discount_amount;
      item.tax_amount = (afterDiscount * item.tax_rate) / 100;
      item.total = afterDiscount + item.tax_amount;
      
      selectedServices.push(item);
    }
    
    // Calculate invoice totals
    const subtotal = selectedServices.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const itemDiscounts = selectedServices.reduce((sum, item) => sum + item.discount_amount, 0);
    const taxAmount = selectedServices.reduce((sum, item) => sum + item.tax_amount, 0);
    
    // Additional invoice-level discount
    const discountType = Math.random() < 0.5 ? 'percentage' : 'fixed';
    const discountValue = discountType === 'percentage' ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 50);
    const discountAmount = discountType === 'percentage' ? (subtotal * discountValue) / 100 : discountValue;
    
    const totalAmount = subtotal - itemDiscounts - discountAmount + taxAmount;
    
    // Determine status and payments
    let status: Invoice['status'];
    let paidAmount = 0;
    
    const random = Math.random();
    if (random < 0.3) {
      status = 'paid';
      paidAmount = totalAmount;
    } else if (random < 0.5) {
      status = 'partial';
      paidAmount = Math.floor(totalAmount * (0.3 + Math.random() * 0.6)); // 30-90% paid
    } else if (random < 0.7) {
      status = 'pending';
      paidAmount = 0;
    } else if (random < 0.85) {
      status = dueDate < currentDate ? 'overdue' : 'pending';
      paidAmount = 0;
    } else {
      status = 'draft';
      paidAmount = 0;
    }
    
    // Insurance claim for some invoices
    let insuranceClaim: InsuranceClaim | undefined;
    if (Math.random() < 0.4 && status !== 'draft') {
      insuranceClaim = {
        id: `claim_${i}`,
        claim_number: `CLM${String(1000 + i).padStart(6, '0')}`,
        insurance_provider: ['HealthFirst', 'MediCare Plus', 'Blue Shield', 'Aetna'][Math.floor(Math.random() * 4)],
        policy_number: `POL${Math.floor(Math.random() * 900000) + 100000}`,
        policy_holder: patient.name,
        relationship: 'self',
        coverage_percentage: [50, 60, 70, 80, 90][Math.floor(Math.random() * 5)],
        coverage_amount: 0,
        deductible: [100, 250, 500, 1000][Math.floor(Math.random() * 4)],
        copay: [20, 30, 40, 50][Math.floor(Math.random() * 4)],
        status: ['submitted', 'approved', 'rejected', 'partially_approved'][Math.floor(Math.random() * 4)] as InsuranceClaim['status'],
        submitted_date: issueDate.toISOString(),
        approved_date: ['approved', 'partially_approved'].includes(status) ? new Date(issueDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      };
      
      insuranceClaim.coverage_amount = (totalAmount * insuranceClaim.coverage_percentage) / 100;
    }
    
    const invoice: Invoice = {
      id: `inv_${i + 1}`,
      invoice_number: `INV-${String(1000 + i).padStart(6, '0')}`,
      patient_id: patient.id,
      patient_name: patient.name,
      patient_email: patient.email,
      patient_phone: patient.phone,
      appointment_id: `apt_${i + 1}`,
      doctor_id: doctor.id,
      doctor_name: doctor.name,
      issue_date: issueDate.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      status: status,
      items: selectedServices,
      subtotal: subtotal,
      tax_rate: 0, // Tax calculated at item level
      tax_amount: taxAmount,
      discount_type: discountType as Invoice['discount_type'],
      discount_value: discountValue,
      discount_amount: discountAmount + itemDiscounts,
      total_amount: totalAmount,
      paid_amount: paidAmount,
      balance_due: totalAmount - paidAmount,
      currency: 'USD',
      notes: 'Thank you for choosing our healthcare services.',
      terms: 'Payment is due within 30 days of invoice date.',
      payment_method: paidAmount > 0 ? ['cash', 'credit_card', 'bank_transfer'][Math.floor(Math.random() * 3)] : undefined,
      insurance_claim: insuranceClaim,
      created_at: issueDate.toISOString(),
      updated_at: issueDate.toISOString(),
      created_by: 'admin',
    };
    
    invoices.push(invoice);
  }
  
  return invoices.sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime());
};

const generateMockPayments = (invoices: Invoice[]): Payment[] => {
  const payments: Payment[] = [];
  
  invoices.forEach((invoice, index) => {
    if (invoice.paid_amount > 0) {
      // Generate payment records
      if (invoice.status === 'paid') {
        // Single full payment
        payments.push({
          id: `pay_${payments.length + 1}`,
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          patient_id: invoice.patient_id,
          patient_name: invoice.patient_name,
          payment_date: new Date(invoice.issue_date).toISOString().split('T')[0],
          amount: invoice.total_amount,
          payment_method: invoice.payment_method as Payment['payment_method'] || 'cash',
          reference_number: `REF${String(1000 + payments.length).padStart(6, '0')}`,
          notes: 'Full payment received',
          status: 'completed',
          created_by: 'admin',
          created_at: invoice.created_at,
        });
      } else if (invoice.status === 'partial') {
        // Multiple partial payments
        const numPayments = Math.floor(Math.random() * 3) + 1;
        let remainingAmount = invoice.paid_amount;
        
        for (let i = 0; i < numPayments && remainingAmount > 0; i++) {
          const paymentAmount = i === numPayments - 1 ? remainingAmount : Math.floor(remainingAmount / (numPayments - i));
          const paymentDate = new Date(invoice.issue_date);
          paymentDate.setDate(paymentDate.getDate() + (i * 10)); // Space payments 10 days apart
          
          payments.push({
            id: `pay_${payments.length + 1}`,
            invoice_id: invoice.id,
            invoice_number: invoice.invoice_number,
            patient_id: invoice.patient_id,
            patient_name: invoice.patient_name,
            payment_date: paymentDate.toISOString().split('T')[0],
            amount: paymentAmount,
            payment_method: ['cash', 'credit_card', 'bank_transfer', 'check'][Math.floor(Math.random() * 4)] as Payment['payment_method'],
            reference_number: `REF${String(1000 + payments.length).padStart(6, '0')}`,
            notes: `Partial payment ${i + 1} of ${numPayments}`,
            status: 'completed',
            created_by: 'admin',
            created_at: paymentDate.toISOString(),
          });
          
          remainingAmount -= paymentAmount;
        }
      }
    }
  });
  
  return payments.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
};

// Initialize mock data
const mockServices = generateMockServices();
const mockInvoices = generateMockInvoices(mockServices);
const mockPayments = generateMockPayments(mockInvoices);

// Calculate initial statistics
const calculateStatistics = (invoices: Invoice[], payments: Payment[]) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPending = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.balance_due, 0);
  
  const totalOverdue = invoices
    .filter(i => i.status === 'overdue')
    .reduce((sum, i) => sum + i.balance_due, 0);
  
  const monthlyPayments = payments.filter(p => {
    const paymentDate = new Date(p.payment_date);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear &&
           p.status === 'completed';
  });
  
  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
  
  const averageInvoiceValue = invoices.length > 0 
    ? invoices.reduce((sum, i) => sum + i.total_amount, 0) / invoices.length 
    : 0;
  
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const totalPayments = payments.length;
  const paymentSuccessRate = totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0;
  
  return {
    totalRevenue,
    totalPending,
    totalOverdue,
    monthlyRevenue,
    averageInvoiceValue,
    paymentSuccessRate,
  };
};

const initialState: BillingState = {
  invoices: mockInvoices,
  payments: mockPayments,
  services: mockServices,
  selectedInvoice: null,
  loading: false,
  error: null,
  statistics: calculateStatistics(mockInvoices, mockPayments),
  filters: {
    status: 'all',
    dateRange: 'all',
    paymentMethod: 'all',
    searchQuery: '',
  },
};

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'billing/fetchInvoices',
  async (params: { page?: number; per_page?: number; status?: string } = {}) => {
    const response = await api.get('/v1/invoices', { params });
    return response.data;
  }
);

export const createInvoice = createAsyncThunk(
  'billing/createInvoice',
  async (invoiceData: Partial<Invoice>) => {
    const response = await api.post('/v1/invoices', invoiceData);
    return response.data;
  }
);

export const updateInvoice = createAsyncThunk(
  'billing/updateInvoice',
  async ({ id, data }: { id: string; data: Partial<Invoice> }) => {
    const response = await api.put(`/v1/invoices/${id}`, data);
    return response.data;
  }
);

export const deleteInvoice = createAsyncThunk(
  'billing/deleteInvoice',
  async (id: string) => {
    await api.delete(`/v1/invoices/${id}`);
    return id;
  }
);

export const recordPayment = createAsyncThunk(
  'billing/recordPayment',
  async (paymentData: Partial<Payment>) => {
    const response = await api.post('/v1/payments', paymentData);
    return response.data;
  }
);

export const fetchServices = createAsyncThunk(
  'billing/fetchServices',
  async () => {
    const response = await api.get('/v1/services');
    return response.data;
  }
);

export const createService = createAsyncThunk(
  'billing/createService',
  async (serviceData: Partial<Service>) => {
    const response = await api.post('/v1/services', serviceData);
    return response.data;
  }
);

export const updateService = createAsyncThunk(
  'billing/updateService',
  async ({ id, data }: { id: string; data: Partial<Service> }) => {
    const response = await api.put(`/v1/services/${id}`, data);
    return response.data;
  }
);

// Slice
const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.selectedInvoice = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<BillingState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        dateRange: 'all',
        paymentMethod: 'all',
        searchQuery: '',
      };
    },
    updateInvoiceStatus: (state, action: PayloadAction<{ id: string; status: Invoice['status'] }>) => {
      const invoice = state.invoices.find(inv => inv.id === action.payload.id);
      if (invoice) {
        invoice.status = action.payload.status;
        // Recalculate statistics
        state.statistics = calculateStatistics(state.invoices, state.payments);
      }
    },
    addPaymentToInvoice: (state, action: PayloadAction<Payment>) => {
      const payment = action.payload;
      state.payments.unshift(payment);
      
      // Update invoice
      const invoice = state.invoices.find(inv => inv.id === payment.invoice_id);
      if (invoice) {
        invoice.paid_amount += payment.amount;
        invoice.balance_due = invoice.total_amount - invoice.paid_amount;
        
        // Update status
        if (invoice.balance_due <= 0) {
          invoice.status = 'paid';
        } else if (invoice.paid_amount > 0) {
          invoice.status = 'partial';
        }
      }
      
      // Recalculate statistics
      state.statistics = calculateStatistics(state.invoices, state.payments);
    },
    updateStatistics: (state) => {
      state.statistics = calculateStatistics(state.invoices, state.payments);
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
        state.invoices = action.payload.items || state.invoices;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invoices';
      })
      // Create invoice
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload);
        state.statistics = calculateStatistics(state.invoices, state.payments);
      })
      // Update invoice
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice?.id === action.payload.id) {
          state.selectedInvoice = action.payload;
        }
        state.statistics = calculateStatistics(state.invoices, state.payments);
      })
      // Delete invoice
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(inv => inv.id !== action.payload);
        if (state.selectedInvoice?.id === action.payload) {
          state.selectedInvoice = null;
        }
        state.statistics = calculateStatistics(state.invoices, state.payments);
      })
      // Record payment
      .addCase(recordPayment.fulfilled, (state, action) => {
        state.payments.unshift(action.payload);
        // Update related invoice
        const invoice = state.invoices.find(inv => inv.id === action.payload.invoice_id);
        if (invoice) {
          invoice.paid_amount += action.payload.amount;
          invoice.balance_due = invoice.total_amount - invoice.paid_amount;
          if (invoice.balance_due <= 0) {
            invoice.status = 'paid';
          } else {
            invoice.status = 'partial';
          }
        }
        state.statistics = calculateStatistics(state.invoices, state.payments);
      })
      // Services
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload.items || state.services;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex(srv => srv.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      });
  },
});

export const {
  setSelectedInvoice,
  setFilters,
  clearFilters,
  updateInvoiceStatus,
  addPaymentToInvoice,
  updateStatistics,
} = billingSlice.actions;

export default billingSlice.reducer;