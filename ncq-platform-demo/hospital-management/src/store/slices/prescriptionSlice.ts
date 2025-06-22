import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Drug {
  id: string;
  name: string;
  generic_name: string;
  category: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops' | 'inhaler' | 'patch';
  strength: string;
  manufacturer: string;
  price: number;
  requires_prescription: boolean;
  controlled_substance: boolean;
  common_dosages: string[];
  side_effects: string[];
  contraindications: string[];
  interactions: string[];
}

export interface PrescriptionItem {
  id: string;
  drug_id: string;
  drug_name: string;
  generic_name: string;
  form: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  substitution_allowed: boolean;
}

export interface Prescription {
  id: string;
  prescription_number: string;
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  doctor_id: string;
  doctor_name: string;
  doctor_license: string;
  appointment_id?: string;
  date_prescribed: string;
  valid_until: string;
  diagnosis: string;
  chief_complaint: string;
  items: PrescriptionItem[];
  notes?: string;
  follow_up_date?: string;
  is_printed: boolean;
  is_emailed: boolean;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  dental_data?: {
    selected_teeth: number[];
    teeth_names: string;
  };
  dermatology_data?: {
    injection_sites: any[];
    total_units: number;
  };
  created_at: string;
  updated_at: string;
}

export interface PrescriptionTemplate {
  id: string;
  name: string;
  doctor_id: string;
  diagnosis: string;
  items: Omit<PrescriptionItem, 'id'>[];
  notes: string;
  is_favorite: boolean;
}

interface PrescriptionState {
  prescriptions: Prescription[];
  drugs: Drug[];
  templates: PrescriptionTemplate[];
  selectedPrescription: Prescription | null;
  loading: boolean;
  error: string | null;
  searchResults: Drug[];
}

// Mock drug database
const mockDrugs: Drug[] = [
  {
    id: 'drug1',
    name: 'Amoxicillin',
    generic_name: 'Amoxicillin',
    category: 'Antibiotic',
    form: 'capsule',
    strength: '500mg',
    manufacturer: 'Generic Pharma',
    price: 15.99,
    requires_prescription: true,
    controlled_substance: false,
    common_dosages: ['500mg three times daily', '875mg twice daily'],
    side_effects: ['Nausea', 'Diarrhea', 'Rash'],
    contraindications: ['Penicillin allergy'],
    interactions: ['Methotrexate', 'Warfarin'],
  },
  {
    id: 'drug2',
    name: 'Paracetamol',
    generic_name: 'Acetaminophen',
    category: 'Analgesic',
    form: 'tablet',
    strength: '500mg',
    manufacturer: 'Generic Pharma',
    price: 5.99,
    requires_prescription: false,
    controlled_substance: false,
    common_dosages: ['500-1000mg every 4-6 hours', 'Maximum 4g daily'],
    side_effects: ['Rare at therapeutic doses'],
    contraindications: ['Severe liver disease'],
    interactions: ['Warfarin', 'Alcohol'],
  },
  {
    id: 'drug3',
    name: 'Metformin',
    generic_name: 'Metformin HCl',
    category: 'Antidiabetic',
    form: 'tablet',
    strength: '500mg',
    manufacturer: 'Diabetes Care Inc',
    price: 25.99,
    requires_prescription: true,
    controlled_substance: false,
    common_dosages: ['500mg twice daily with meals', 'Can increase to 1000mg twice daily'],
    side_effects: ['GI upset', 'Diarrhea', 'Nausea'],
    contraindications: ['Renal impairment', 'Metabolic acidosis'],
    interactions: ['Contrast media', 'Alcohol'],
  },
  {
    id: 'drug4',
    name: 'Lisinopril',
    generic_name: 'Lisinopril',
    category: 'ACE Inhibitor',
    form: 'tablet',
    strength: '10mg',
    manufacturer: 'CardioHealth',
    price: 18.99,
    requires_prescription: true,
    controlled_substance: false,
    common_dosages: ['10mg once daily', 'Can increase to 20-40mg daily'],
    side_effects: ['Dry cough', 'Dizziness', 'Hyperkalemia'],
    contraindications: ['Pregnancy', 'Angioedema history'],
    interactions: ['Potassium supplements', 'NSAIDs'],
  },
  {
    id: 'drug5',
    name: 'Omeprazole',
    generic_name: 'Omeprazole',
    category: 'Proton Pump Inhibitor',
    form: 'capsule',
    strength: '20mg',
    manufacturer: 'GI Solutions',
    price: 22.99,
    requires_prescription: true,
    controlled_substance: false,
    common_dosages: ['20mg once daily before breakfast', '40mg for severe cases'],
    side_effects: ['Headache', 'Abdominal pain', 'Nausea'],
    contraindications: ['Hypersensitivity to PPIs'],
    interactions: ['Clopidogrel', 'Methotrexate'],
  },
  {
    id: 'drug6',
    name: 'Salbutamol',
    generic_name: 'Albuterol',
    category: 'Bronchodilator',
    form: 'inhaler',
    strength: '100mcg',
    manufacturer: 'Respiratory Care',
    price: 35.99,
    requires_prescription: true,
    controlled_substance: false,
    common_dosages: ['1-2 puffs every 4-6 hours as needed', 'Max 8 puffs daily'],
    side_effects: ['Tremor', 'Tachycardia', 'Nervousness'],
    contraindications: ['Tachyarrhythmias'],
    interactions: ['Beta blockers', 'Diuretics'],
  },
  {
    id: 'drug7',
    name: 'Prednisolone',
    generic_name: 'Prednisolone',
    category: 'Corticosteroid',
    form: 'tablet',
    strength: '5mg',
    manufacturer: 'Steroid Pharma',
    price: 12.99,
    requires_prescription: true,
    controlled_substance: false,
    common_dosages: ['5-60mg daily', 'Taper dose when discontinuing'],
    side_effects: ['Weight gain', 'Mood changes', 'Increased appetite'],
    contraindications: ['Systemic fungal infections'],
    interactions: ['NSAIDs', 'Vaccines'],
  },
  {
    id: 'drug8',
    name: 'Diazepam',
    generic_name: 'Diazepam',
    category: 'Benzodiazepine',
    form: 'tablet',
    strength: '5mg',
    manufacturer: 'CNS Pharma',
    price: 28.99,
    requires_prescription: true,
    controlled_substance: true,
    common_dosages: ['2-10mg 2-4 times daily', 'Start with lowest dose'],
    side_effects: ['Drowsiness', 'Confusion', 'Dependence'],
    contraindications: ['Acute narrow-angle glaucoma', 'Sleep apnea'],
    interactions: ['Alcohol', 'Opioids', 'Other CNS depressants'],
  },
];

// Mock prescription templates
const mockTemplates: PrescriptionTemplate[] = [
  {
    id: 'template1',
    name: 'Common Cold',
    doctor_id: 'doc1',
    diagnosis: 'Upper Respiratory Tract Infection',
    items: [
      {
        drug_id: 'drug2',
        drug_name: 'Paracetamol',
        generic_name: 'Acetaminophen',
        form: 'tablet',
        strength: '500mg',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '3 days',
        quantity: 9,
        instructions: 'Take after meals',
        substitution_allowed: true,
      },
    ],
    notes: 'Rest and plenty of fluids',
    is_favorite: true,
  },
  {
    id: 'template2',
    name: 'Bacterial Infection',
    doctor_id: 'doc1',
    diagnosis: 'Bacterial Infection',
    items: [
      {
        drug_id: 'drug1',
        drug_name: 'Amoxicillin',
        generic_name: 'Amoxicillin',
        form: 'capsule',
        strength: '500mg',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '7 days',
        quantity: 21,
        instructions: 'Complete full course',
        substitution_allowed: false,
      },
    ],
    notes: 'Complete the full course even if symptoms improve',
    is_favorite: true,
  },
];

// Generate mock prescriptions
const generateMockPrescriptions = (): Prescription[] => {
  const prescriptions: Prescription[] = [];
  const patients = [
    { id: '1', name: 'John Doe', age: 45, gender: 'Male' },
    { id: '2', name: 'Jane Smith', age: 32, gender: 'Female' },
    { id: '3', name: 'Robert Johnson', age: 58, gender: 'Male' },
    { id: '4', name: 'Maria Garcia', age: 28, gender: 'Female' },
    { id: '5', name: 'David Wilson', age: 65, gender: 'Male' },
  ];
  
  const doctors = [
    { id: 'doc1', name: 'Dr. Sarah Johnson', license: 'MED12345' },
    { id: 'doc2', name: 'Dr. Michael Chen', license: 'MED23456' },
  ];
  
  const diagnoses = [
    'Upper Respiratory Tract Infection',
    'Hypertension',
    'Type 2 Diabetes Mellitus',
    'Gastroesophageal Reflux Disease',
    'Asthma',
    'Bacterial Infection',
  ];
  
  // Generate prescriptions for the last 30 days
  for (let i = 0; i < 20; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const prescriptionDate = new Date();
    prescriptionDate.setDate(prescriptionDate.getDate() - daysAgo);
    
    const items: PrescriptionItem[] = [];
    const numItems = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < numItems; j++) {
      const drug = mockDrugs[Math.floor(Math.random() * mockDrugs.length)];
      items.push({
        id: `item-${i}-${j}`,
        drug_id: drug.id,
        drug_name: drug.name,
        generic_name: drug.generic_name,
        form: drug.form,
        strength: drug.strength,
        dosage: drug.common_dosages[0],
        frequency: 'As directed',
        duration: '7 days',
        quantity: 21,
        instructions: 'Take with food',
        substitution_allowed: !drug.controlled_substance,
      });
    }
    
    prescriptions.push({
      id: `rx-${i}`,
      prescription_number: `RX${prescriptionDate.getFullYear()}${String(prescriptionDate.getMonth() + 1).padStart(2, '0')}${String(i + 1).padStart(4, '0')}`,
      patient_id: patient.id,
      patient_name: patient.name,
      patient_age: patient.age,
      patient_gender: patient.gender,
      doctor_id: doctor.id,
      doctor_name: doctor.name,
      doctor_license: doctor.license,
      appointment_id: `apt-${i}`,
      date_prescribed: prescriptionDate.toISOString().split('T')[0],
      valid_until: new Date(prescriptionDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      diagnosis,
      chief_complaint: 'Patient presents with symptoms',
      items,
      notes: 'Follow up if symptoms persist',
      is_printed: Math.random() > 0.5,
      is_emailed: Math.random() > 0.5,
      status: daysAgo > 20 ? 'completed' : 'active',
      created_at: prescriptionDate.toISOString(),
      updated_at: prescriptionDate.toISOString(),
    });
  }
  
  return prescriptions.sort((a, b) => 
    new Date(b.date_prescribed).getTime() - new Date(a.date_prescribed).getTime()
  );
};

const mockPrescriptions = generateMockPrescriptions();

const initialState: PrescriptionState = {
  prescriptions: mockPrescriptions,
  drugs: mockDrugs,
  templates: mockTemplates,
  selectedPrescription: null,
  loading: false,
  error: null,
  searchResults: [],
};

export const fetchPrescriptions = createAsyncThunk(
  'prescriptions/fetchPrescriptions',
  async (params: { 
    patient_id?: string; 
    doctor_id?: string; 
    date_from?: string; 
    date_to?: string;
  }) => {
    const response = await api.get('/v1/prescriptions', { params });
    return response.data;
  }
);

export const createPrescription = createAsyncThunk(
  'prescriptions/createPrescription',
  async (prescriptionData: Partial<Prescription>) => {
    const response = await api.post('/v1/prescriptions', prescriptionData);
    return response.data;
  }
);

export const updatePrescription = createAsyncThunk(
  'prescriptions/updatePrescription',
  async ({ id, data }: { id: string; data: Partial<Prescription> }) => {
    const response = await api.put(`/v1/prescriptions/${id}`, data);
    return response.data;
  }
);

export const searchDrugs = createAsyncThunk(
  'prescriptions/searchDrugs',
  async (query: string) => {
    const response = await api.get('/v1/drugs/search', { params: { q: query } });
    return response.data;
  }
);

export const fetchTemplates = createAsyncThunk(
  'prescriptions/fetchTemplates',
  async (doctor_id: string) => {
    const response = await api.get('/v1/prescription-templates', { params: { doctor_id } });
    return response.data;
  }
);

export const saveTemplate = createAsyncThunk(
  'prescriptions/saveTemplate',
  async (templateData: Partial<PrescriptionTemplate>) => {
    const response = await api.post('/v1/prescription-templates', templateData);
    return response.data;
  }
);

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    setSelectedPrescription: (state, action: PayloadAction<Prescription | null>) => {
      state.selectedPrescription = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    searchDrugsLocal: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      state.searchResults = state.drugs.filter(drug =>
        drug.name.toLowerCase().includes(query) ||
        drug.generic_name.toLowerCase().includes(query) ||
        drug.category.toLowerCase().includes(query)
      );
    },
    toggleTemplateFavorite: (state, action: PayloadAction<string>) => {
      const template = state.templates.find(t => t.id === action.payload);
      if (template) {
        template.is_favorite = !template.is_favorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch prescriptions
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch prescriptions';
      })
      // Create prescription
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.prescriptions.unshift(action.payload);
      })
      // Update prescription
      .addCase(updatePrescription.fulfilled, (state, action) => {
        const index = state.prescriptions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.prescriptions[index] = action.payload;
        }
      })
      // Search drugs
      .addCase(searchDrugs.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      // Fetch templates
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
      })
      // Save template
      .addCase(saveTemplate.fulfilled, (state, action) => {
        state.templates.push(action.payload);
      });
  },
});

export const { 
  setSelectedPrescription, 
  clearSearchResults, 
  searchDrugsLocal,
  toggleTemplateFavorite 
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;