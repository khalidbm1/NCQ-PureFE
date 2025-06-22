import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Patient {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  blood_group?: string;
  marital_status?: string;
  occupation?: string;
  allergies?: string[];
  chronic_diseases?: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  notes?: string;
  created_at?: string;
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
}

// Mock data for development
const mockPatients: Patient[] = [
  {
    id: '1',
    patient_id: 'P001',
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: '1985-03-15',
    gender: 'Male',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    postal_code: '10001',
    blood_group: 'O+',
    marital_status: 'Married',
    occupation: 'Software Engineer',
    allergies: ['Penicillin'],
    chronic_diseases: ['Diabetes', 'Hypertension'],
    emergency_contact_name: 'Mary Doe',
    emergency_contact_phone: '(555) 123-4568',
    emergency_contact_relationship: 'Wife',
    insurance_provider: 'Blue Cross Blue Shield',
    insurance_policy_number: 'BCBS123456',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    patient_id: 'P002',
    first_name: 'Jane',
    last_name: 'Smith',
    date_of_birth: '1990-07-22',
    gender: 'Female',
    email: 'jane.smith@email.com',
    phone: '(555) 234-5678',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    postal_code: '90001',
    blood_group: 'A+',
    marital_status: 'Single',
    occupation: 'Teacher',
    allergies: [],
    chronic_diseases: ['Asthma'],
    emergency_contact_name: 'Robert Smith',
    emergency_contact_phone: '(555) 234-5679',
    emergency_contact_relationship: 'Father',
    insurance_provider: 'Aetna',
    insurance_policy_number: 'AET789012',
    created_at: '2024-02-20T14:45:00Z',
  },
  {
    id: '3',
    patient_id: 'P003',
    first_name: 'Robert',
    last_name: 'Johnson',
    date_of_birth: '1978-11-30',
    gender: 'Male',
    email: 'robert.j@email.com',
    phone: '(555) 345-6789',
    address: '789 Elm Street',
    city: 'Chicago',
    state: 'IL',
    postal_code: '60601',
    blood_group: 'B+',
    marital_status: 'Divorced',
    occupation: 'Accountant',
    allergies: ['Nuts', 'Shellfish'],
    chronic_diseases: [],
    emergency_contact_name: 'Sarah Johnson',
    emergency_contact_phone: '(555) 345-6790',
    emergency_contact_relationship: 'Sister',
    created_at: '2024-03-01T09:15:00Z',
  },
];

const initialState: PatientState = {
  patients: mockPatients, // Using mock data for now
  selectedPatient: null,
  loading: false,
  error: null,
  totalCount: 3,
  currentPage: 1,
};

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (params: { page?: number; per_page?: number; search?: string }) => {
    const response = await api.get('/v1/patients', { params });
    return response.data;
  }
);

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData: Partial<Patient>) => {
    const response = await api.post('/v1/patients', patientData);
    return response.data;
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, data }: { id: string; data: Partial<Patient> }) => {
    const response = await api.put(`/v1/patients/${id}`, data);
    return response.data;
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.items;
        state.totalCount = action.payload.total;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.patients.unshift(action.payload);
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const index = state.patients.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (state.selectedPatient?.id === action.payload.id) {
          state.selectedPatient = action.payload;
        }
      });
  },
});

export const { setSelectedPatient, clearError } = patientSlice.actions;
export default patientSlice.reducer;