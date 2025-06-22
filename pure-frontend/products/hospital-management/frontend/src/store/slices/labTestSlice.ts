import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface LabTest {
  id: string;
  test_id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  appointment_id?: string;
  test_name: string;
  test_category: 'hematology' | 'biochemistry' | 'microbiology' | 'immunology' | 'pathology' | 'radiology' | 'cardiology';
  test_type: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'ordered' | 'sample_collected' | 'in_progress' | 'completed' | 'cancelled';
  sample_type?: string;
  sample_collected_at?: string;
  sample_collected_by?: string;
  results?: LabTestResult[];
  report_url?: string;
  notes?: string;
  ordered_date: string;
  due_date?: string;
  completed_date?: string;
  price: number;
  is_paid: boolean;
}

export interface LabTestResult {
  id: string;
  parameter: string;
  value: string;
  unit: string;
  normal_range: string;
  flag?: 'high' | 'low' | 'critical';
  notes?: string;
}

export interface LabTestTemplate {
  id: string;
  name: string;
  category: string;
  tests: TestItem[];
  is_package: boolean;
  price: number;
  turnaround_time: string;
  sample_required: string;
  preparation_instructions?: string;
}

export interface TestItem {
  name: string;
  code: string;
  parameters: TestParameter[];
}

export interface TestParameter {
  name: string;
  unit: string;
  normal_range: string;
  critical_values?: {
    low?: number;
    high?: number;
  };
}

interface LabTestState {
  labTests: LabTest[];
  templates: LabTestTemplate[];
  selectedLabTest: LabTest | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string;
    category: string;
    priority: string;
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
}

// Mock data for development
const mockTemplates: LabTestTemplate[] = [
  {
    id: 'temp1',
    name: 'Complete Blood Count (CBC)',
    category: 'hematology',
    tests: [{
      name: 'Complete Blood Count',
      code: 'CBC',
      parameters: [
        { name: 'Hemoglobin', unit: 'g/dL', normal_range: '12-16' },
        { name: 'RBC Count', unit: 'million/μL', normal_range: '4.2-5.4' },
        { name: 'WBC Count', unit: 'thousand/μL', normal_range: '4.5-11' },
        { name: 'Platelet Count', unit: 'thousand/μL', normal_range: '150-450' },
        { name: 'Hematocrit', unit: '%', normal_range: '36-44' },
      ]
    }],
    is_package: false,
    price: 35,
    turnaround_time: '2-4 hours',
    sample_required: 'EDTA Blood (Purple top)',
  },
  {
    id: 'temp2',
    name: 'Liver Function Test (LFT)',
    category: 'biochemistry',
    tests: [{
      name: 'Liver Function Test',
      code: 'LFT',
      parameters: [
        { name: 'Total Bilirubin', unit: 'mg/dL', normal_range: '0.3-1.2' },
        { name: 'Direct Bilirubin', unit: 'mg/dL', normal_range: '0.0-0.3' },
        { name: 'ALT (SGPT)', unit: 'U/L', normal_range: '7-56' },
        { name: 'AST (SGOT)', unit: 'U/L', normal_range: '10-40' },
        { name: 'Alkaline Phosphatase', unit: 'U/L', normal_range: '44-147' },
        { name: 'Total Protein', unit: 'g/dL', normal_range: '6.3-8.2' },
        { name: 'Albumin', unit: 'g/dL', normal_range: '3.5-5.0' },
      ]
    }],
    is_package: false,
    price: 55,
    turnaround_time: '4-6 hours',
    sample_required: 'Serum (Red/Gold top)',
  },
  {
    id: 'temp3',
    name: 'Lipid Profile',
    category: 'biochemistry',
    tests: [{
      name: 'Lipid Profile',
      code: 'LIPID',
      parameters: [
        { name: 'Total Cholesterol', unit: 'mg/dL', normal_range: '<200', critical_values: { high: 240 } },
        { name: 'HDL Cholesterol', unit: 'mg/dL', normal_range: '>40', critical_values: { low: 40 } },
        { name: 'LDL Cholesterol', unit: 'mg/dL', normal_range: '<100', critical_values: { high: 160 } },
        { name: 'Triglycerides', unit: 'mg/dL', normal_range: '<150', critical_values: { high: 200 } },
        { name: 'VLDL Cholesterol', unit: 'mg/dL', normal_range: '5-40' },
      ]
    }],
    is_package: false,
    price: 45,
    turnaround_time: '4-6 hours',
    sample_required: 'Serum (12 hour fasting)',
    preparation_instructions: 'Patient must fast for 12 hours before sample collection',
  },
  {
    id: 'temp4',
    name: 'Thyroid Function Test',
    category: 'immunology',
    tests: [{
      name: 'Thyroid Function Test',
      code: 'TFT',
      parameters: [
        { name: 'TSH', unit: 'μIU/mL', normal_range: '0.4-4.0' },
        { name: 'Free T3', unit: 'pg/mL', normal_range: '2.3-4.2' },
        { name: 'Free T4', unit: 'ng/dL', normal_range: '0.8-1.8' },
      ]
    }],
    is_package: false,
    price: 65,
    turnaround_time: '4-6 hours',
    sample_required: 'Serum (Red/Gold top)',
  },
  {
    id: 'temp5',
    name: 'Urine Routine & Microscopy',
    category: 'pathology',
    tests: [{
      name: 'Urine Analysis',
      code: 'URINE',
      parameters: [
        { name: 'Color', unit: '', normal_range: 'Pale yellow' },
        { name: 'Clarity', unit: '', normal_range: 'Clear' },
        { name: 'pH', unit: '', normal_range: '4.6-8.0' },
        { name: 'Specific Gravity', unit: '', normal_range: '1.003-1.030' },
        { name: 'Protein', unit: 'mg/dL', normal_range: 'Negative' },
        { name: 'Glucose', unit: 'mg/dL', normal_range: 'Negative' },
        { name: 'RBC', unit: '/hpf', normal_range: '0-2' },
        { name: 'WBC', unit: '/hpf', normal_range: '0-5' },
      ]
    }],
    is_package: false,
    price: 25,
    turnaround_time: '2-3 hours',
    sample_required: 'Fresh urine sample',
  },
  {
    id: 'temp6',
    name: 'Basic Health Checkup',
    category: 'biochemistry',
    tests: [
      { name: 'CBC', code: 'CBC', parameters: [] },
      { name: 'Blood Sugar', code: 'BS', parameters: [] },
      { name: 'Lipid Profile', code: 'LIPID', parameters: [] },
      { name: 'Liver Function', code: 'LFT', parameters: [] },
      { name: 'Kidney Function', code: 'KFT', parameters: [] },
      { name: 'Thyroid Function', code: 'TFT', parameters: [] },
      { name: 'Urine Routine', code: 'URINE', parameters: [] },
    ],
    is_package: true,
    price: 250,
    turnaround_time: '24 hours',
    sample_required: 'Multiple samples required',
    preparation_instructions: '12 hour fasting required',
  },
];

const mockLabTests: LabTest[] = [
  {
    id: 'lab1',
    test_id: 'LAB001',
    patient_id: 'pat1',
    patient_name: 'John Doe',
    doctor_id: 'doc1',
    doctor_name: 'Dr. Sarah Johnson',
    test_name: 'Complete Blood Count (CBC)',
    test_category: 'hematology',
    test_type: 'CBC',
    priority: 'routine',
    status: 'completed',
    sample_type: 'Blood',
    sample_collected_at: '2024-01-15T10:30:00',
    sample_collected_by: 'Nurse Mary',
    results: [
      { id: 'r1', parameter: 'Hemoglobin', value: '14.5', unit: 'g/dL', normal_range: '12-16', flag: undefined },
      { id: 'r2', parameter: 'RBC Count', value: '4.8', unit: 'million/μL', normal_range: '4.2-5.4', flag: undefined },
      { id: 'r3', parameter: 'WBC Count', value: '12.5', unit: 'thousand/μL', normal_range: '4.5-11', flag: 'high' },
      { id: 'r4', parameter: 'Platelet Count', value: '250', unit: 'thousand/μL', normal_range: '150-450', flag: undefined },
    ],
    ordered_date: '2024-01-15T09:00:00',
    completed_date: '2024-01-15T14:00:00',
    price: 35,
    is_paid: true,
  },
  {
    id: 'lab2',
    test_id: 'LAB002',
    patient_id: 'pat2',
    patient_name: 'Jane Smith',
    doctor_id: 'doc2',
    doctor_name: 'Dr. Michael Chen',
    test_name: 'Lipid Profile',
    test_category: 'biochemistry',
    test_type: 'LIPID',
    priority: 'urgent',
    status: 'in_progress',
    sample_type: 'Blood (Fasting)',
    sample_collected_at: '2024-01-15T08:00:00',
    sample_collected_by: 'Lab Tech John',
    ordered_date: '2024-01-15T07:30:00',
    due_date: '2024-01-15T18:00:00',
    price: 45,
    is_paid: false,
  },
];

const initialState: LabTestState = {
  labTests: mockLabTests,
  templates: mockTemplates,
  selectedLabTest: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    category: 'all',
    priority: 'all',
    dateRange: {
      start: null,
      end: null,
    },
  },
};

// Async thunks
export const fetchLabTests = createAsyncThunk(
  'labTests/fetchLabTests',
  async (params?: any) => {
    const response = await api.get('/lab-tests', { params });
    return response.data;
  }
);

export const createLabTest = createAsyncThunk(
  'labTests/createLabTest',
  async (labTestData: Partial<LabTest>) => {
    const response = await api.post('/lab-tests', labTestData);
    return response.data;
  }
);

export const updateLabTest = createAsyncThunk(
  'labTests/updateLabTest',
  async ({ id, data }: { id: string; data: Partial<LabTest> }) => {
    const response = await api.put(`/lab-tests/${id}`, data);
    return response.data;
  }
);

export const uploadLabResults = createAsyncThunk(
  'labTests/uploadResults',
  async ({ id, results }: { id: string; results: LabTestResult[] }) => {
    const response = await api.post(`/lab-tests/${id}/results`, { results });
    return response.data;
  }
);

const labTestSlice = createSlice({
  name: 'labTests',
  initialState,
  reducers: {
    setSelectedLabTest: (state, action: PayloadAction<LabTest | null>) => {
      state.selectedLabTest = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<LabTestState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateLabTestStatus: (state, action: PayloadAction<{ id: string; status: LabTest['status'] }>) => {
      const test = state.labTests.find(t => t.id === action.payload.id);
      if (test) {
        test.status = action.payload.status;
        if (action.payload.status === 'completed') {
          test.completed_date = new Date().toISOString();
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch lab tests
      .addCase(fetchLabTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabTests.fulfilled, (state, action) => {
        state.loading = false;
        state.labTests = action.payload.data || state.labTests;
      })
      .addCase(fetchLabTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch lab tests';
      })
      // Create lab test
      .addCase(createLabTest.fulfilled, (state, action) => {
        state.labTests.unshift(action.payload);
      })
      // Update lab test
      .addCase(updateLabTest.fulfilled, (state, action) => {
        const index = state.labTests.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.labTests[index] = action.payload;
        }
      })
      // Upload results
      .addCase(uploadLabResults.fulfilled, (state, action) => {
        const test = state.labTests.find(t => t.id === action.payload.id);
        if (test) {
          test.results = action.payload.results;
          test.status = 'completed';
          test.completed_date = new Date().toISOString();
        }
      });
  },
});

export const {
  setSelectedLabTest,
  setFilters,
  clearFilters,
  updateLabTestStatus,
} = labTestSlice.actions;

export default labTestSlice.reducer;