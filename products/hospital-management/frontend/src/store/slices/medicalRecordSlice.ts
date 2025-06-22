import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface MedicalRecord {
  id: string;
  record_id: string;
  patient_id: string;
  patient_name: string;
  type: 'consultation' | 'admission' | 'procedure' | 'surgery' | 'emergency' | 'followup' | 'diagnostic';
  date: string;
  department: string;
  doctor_id: string;
  doctor_name: string;
  chief_complaint: string;
  history_of_present_illness: string;
  past_medical_history?: string;
  family_history?: string;
  social_history?: string;
  review_of_systems?: ReviewOfSystems;
  physical_examination?: PhysicalExamination;
  vital_signs?: VitalSigns;
  diagnosis: Diagnosis[];
  treatment_plan?: string;
  medications_prescribed?: string[];
  procedures_performed?: string[];
  lab_results_summary?: string;
  imaging_summary?: string;
  clinical_notes?: string;
  follow_up_instructions?: string;
  attachments?: Attachment[];
  is_confidential: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewOfSystems {
  constitutional?: string;
  cardiovascular?: string;
  respiratory?: string;
  gastrointestinal?: string;
  genitourinary?: string;
  musculoskeletal?: string;
  neurological?: string;
  psychiatric?: string;
  endocrine?: string;
  hematologic?: string;
  allergic_immunologic?: string;
}

export interface PhysicalExamination {
  general_appearance?: string;
  head_eyes_ears_nose_throat?: string;
  cardiovascular?: string;
  respiratory?: string;
  abdomen?: string;
  extremities?: string;
  neurological?: string;
  skin?: string;
  psychiatric?: string;
}

export interface VitalSigns {
  temperature?: number;
  temperature_unit?: 'C' | 'F';
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  weight?: number;
  weight_unit?: 'kg' | 'lbs';
  height?: number;
  height_unit?: 'cm' | 'ft';
  bmi?: number;
  pain_scale?: number;
}

export interface Diagnosis {
  code: string;
  description: string;
  type: 'primary' | 'secondary' | 'differential';
}

export interface Attachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'lab_report' | 'imaging' | 'other';
  url: string;
  size: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface MedicalRecordTemplate {
  id: string;
  name: string;
  type: string;
  department: string;
  content: Partial<MedicalRecord>;
  created_by: string;
  is_shared: boolean;
}

export interface PatientSummary {
  patient_id: string;
  patient_name: string;
  date_of_birth: string;
  gender: string;
  blood_type?: string;
  allergies: string[];
  chronic_conditions: string[];
  current_medications: string[];
  emergency_contact: string;
  insurance_info: string;
  last_visit: string;
  total_visits: number;
}

interface MedicalRecordState {
  records: MedicalRecord[];
  selectedRecord: MedicalRecord | null;
  patientSummary: PatientSummary | null;
  templates: MedicalRecordTemplate[];
  loading: boolean;
  error: string | null;
  filters: {
    type: string;
    department: string;
    dateRange: {
      start: string | null;
      end: string | null;
    };
    searchTerm: string;
  };
}

// Mock data
const mockTemplates: MedicalRecordTemplate[] = [
  {
    id: 'temp1',
    name: 'General Consultation',
    type: 'consultation',
    department: 'General Medicine',
    content: {
      type: 'consultation',
      review_of_systems: {
        constitutional: 'No fever, weight loss, or fatigue',
        cardiovascular: 'No chest pain, palpitations, or edema',
        respiratory: 'No cough, shortness of breath, or wheezing',
        gastrointestinal: 'No nausea, vomiting, or abdominal pain',
      },
      physical_examination: {
        general_appearance: 'Well-appearing, in no acute distress',
        cardiovascular: 'Regular rate and rhythm, no murmurs',
        respiratory: 'Clear to auscultation bilaterally',
        abdomen: 'Soft, non-tender, no masses',
      },
    },
    created_by: 'system',
    is_shared: true,
  },
  {
    id: 'temp2',
    name: 'Emergency Department Note',
    type: 'emergency',
    department: 'Emergency',
    content: {
      type: 'emergency',
      vital_signs: {
        temperature: 98.6,
        temperature_unit: 'F',
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        heart_rate: 72,
        respiratory_rate: 16,
        oxygen_saturation: 98,
      },
    },
    created_by: 'system',
    is_shared: true,
  },
];

const mockRecords: MedicalRecord[] = [
  {
    id: 'rec1',
    record_id: 'MR001',
    patient_id: 'pat1',
    patient_name: 'John Doe',
    type: 'consultation',
    date: '2024-01-15T10:00:00',
    department: 'General Medicine',
    doctor_id: 'doc1',
    doctor_name: 'Dr. Sarah Johnson',
    chief_complaint: 'Persistent cough and fever for 3 days',
    history_of_present_illness: 'Patient presents with a 3-day history of productive cough with yellowish sputum, associated with fever (max 102°F), chills, and mild chest discomfort.',
    past_medical_history: 'Hypertension, controlled on medication. No previous respiratory issues.',
    vital_signs: {
      temperature: 101.2,
      temperature_unit: 'F',
      blood_pressure_systolic: 130,
      blood_pressure_diastolic: 85,
      heart_rate: 88,
      respiratory_rate: 20,
      oxygen_saturation: 96,
    },
    physical_examination: {
      general_appearance: 'Mild distress due to coughing',
      respiratory: 'Decreased breath sounds in right lower lobe, crackles present',
      cardiovascular: 'Regular rate and rhythm, no murmurs',
    },
    diagnosis: [
      { code: 'J18.9', description: 'Pneumonia, unspecified organism', type: 'primary' },
      { code: 'I10', description: 'Essential hypertension', type: 'secondary' },
    ],
    treatment_plan: 'Antibiotic therapy with Amoxicillin-Clavulanate 875mg PO BID x 7 days. Chest X-ray ordered. Follow-up in 3 days if no improvement.',
    medications_prescribed: ['Amoxicillin-Clavulanate 875mg', 'Paracetamol 500mg PRN'],
    clinical_notes: 'Patient advised to rest, maintain hydration, and monitor temperature. Return if symptoms worsen.',
    is_confidential: false,
    created_at: '2024-01-15T11:00:00',
    updated_at: '2024-01-15T11:00:00',
  },
  {
    id: 'rec2',
    record_id: 'MR002',
    patient_id: 'pat2',
    patient_name: 'Jane Smith',
    type: 'procedure',
    date: '2024-01-10T14:00:00',
    department: 'Cardiology',
    doctor_id: 'doc2',
    doctor_name: 'Dr. Michael Chen',
    chief_complaint: 'Scheduled cardiac catheterization',
    history_of_present_illness: 'Patient with history of chest pain on exertion, positive stress test',
    diagnosis: [
      { code: 'I25.10', description: 'Atherosclerotic heart disease', type: 'primary' },
    ],
    procedures_performed: ['Cardiac catheterization', 'Coronary angiography'],
    clinical_notes: 'Procedure completed without complications. 70% stenosis in LAD, recommended for PCI.',
    attachments: [
      {
        id: 'att1',
        name: 'Cath_Report.pdf',
        type: 'document',
        url: '/files/cath_report.pdf',
        size: 524288,
        uploaded_at: '2024-01-10T16:00:00',
        uploaded_by: 'Dr. Michael Chen',
      },
    ],
    is_confidential: false,
    created_at: '2024-01-10T16:30:00',
    updated_at: '2024-01-10T16:30:00',
  },
];

const initialState: MedicalRecordState = {
  records: mockRecords,
  selectedRecord: null,
  patientSummary: null,
  templates: mockTemplates,
  loading: false,
  error: null,
  filters: {
    type: 'all',
    department: 'all',
    dateRange: {
      start: null,
      end: null,
    },
    searchTerm: '',
  },
};

// Async thunks
export const fetchMedicalRecords = createAsyncThunk(
  'medicalRecords/fetchRecords',
  async (patientId: string) => {
    const response = await api.get(`/patients/${patientId}/medical-records`);
    return response.data;
  }
);

export const fetchPatientSummary = createAsyncThunk(
  'medicalRecords/fetchPatientSummary',
  async (patientId: string) => {
    const response = await api.get(`/patients/${patientId}/summary`);
    return response.data;
  }
);

export const createMedicalRecord = createAsyncThunk(
  'medicalRecords/createRecord',
  async (recordData: Partial<MedicalRecord>) => {
    const response = await api.post('/medical-records', recordData);
    return response.data;
  }
);

export const updateMedicalRecord = createAsyncThunk(
  'medicalRecords/updateRecord',
  async ({ id, data }: { id: string; data: Partial<MedicalRecord> }) => {
    const response = await api.put(`/medical-records/${id}`, data);
    return response.data;
  }
);

export const uploadAttachment = createAsyncThunk(
  'medicalRecords/uploadAttachment',
  async ({ recordId, file }: { recordId: string; file: File }) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/medical-records/${recordId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
);

const medicalRecordSlice = createSlice({
  name: 'medicalRecords',
  initialState,
  reducers: {
    setSelectedRecord: (state, action: PayloadAction<MedicalRecord | null>) => {
      state.selectedRecord = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MedicalRecordState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    addAttachment: (state, action: PayloadAction<{ recordId: string; attachment: Attachment }>) => {
      const record = state.records.find(r => r.id === action.payload.recordId);
      if (record) {
        if (!record.attachments) {
          record.attachments = [];
        }
        record.attachments.push(action.payload.attachment);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch medical records
      .addCase(fetchMedicalRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload || state.records;
      })
      .addCase(fetchMedicalRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch medical records';
      })
      // Fetch patient summary
      .addCase(fetchPatientSummary.fulfilled, (state, action) => {
        state.patientSummary = action.payload;
      })
      // Create medical record
      .addCase(createMedicalRecord.fulfilled, (state, action) => {
        state.records.unshift(action.payload);
      })
      // Update medical record
      .addCase(updateMedicalRecord.fulfilled, (state, action) => {
        const index = state.records.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      });
  },
});

export const {
  setSelectedRecord,
  setFilters,
  clearFilters,
  addAttachment,
} = medicalRecordSlice.actions;

export default medicalRecordSlice.reducer;