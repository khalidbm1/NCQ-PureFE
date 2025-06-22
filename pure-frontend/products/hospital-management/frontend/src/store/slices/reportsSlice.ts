import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface ReportData {
  revenue: {
    daily: { date: string; amount: number }[];
    weekly: { week: string; amount: number }[];
    monthly: { month: string; amount: number }[];
    yearly: { year: string; amount: number }[];
    byDepartment: { department: string; amount: number }[];
    byPaymentMethod: { method: string; amount: number }[];
  };
  patients: {
    totalPatients: number;
    newPatientsThisMonth: number;
    patientsByGender: { gender: string; count: number }[];
    patientsByAgeGroup: { ageGroup: string; count: number }[];
    patientsByInsurance: { insurance: string; count: number }[];
    patientGrowth: { month: string; count: number }[];
  };
  appointments: {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    noShowAppointments: number;
    appointmentsByStatus: { status: string; count: number }[];
    appointmentsByDepartment: { department: string; count: number }[];
    appointmentsByDoctor: { doctor: string; count: number }[];
    peakHours: { hour: number; count: number }[];
    averageWaitTime: number;
  };
  doctors: {
    totalDoctors: number;
    doctorsBySpecialization: { specialization: string; count: number }[];
    doctorPerformance: {
      doctor_id: string;
      doctor_name: string;
      patients_seen: number;
      revenue_generated: number;
      average_rating: number;
      appointments_completed: number;
    }[];
    busyDoctors: { doctor: string; appointments: number }[];
  };
  labTests: {
    totalTests: number;
    testsByCategory: { category: string; count: number }[];
    pendingTests: number;
    completedTests: number;
    averageTurnaroundTime: number;
    popularTests: { test: string; count: number }[];
  };
  medications: {
    totalPrescriptions: number;
    mostPrescribedMedications: { medication: string; count: number }[];
    prescriptionsByDepartment: { department: string; count: number }[];
    controlledSubstances: number;
  };
  operational: {
    bedOccupancyRate: number;
    averageStayDuration: number;
    emergencyResponseTime: number;
    staffUtilization: number;
    equipmentUtilization: { equipment: string; utilization: number }[];
  };
}

export interface DashboardMetrics {
  todayRevenue: number;
  todayAppointments: number;
  activePatients: number;
  pendingBills: number;
  occupancyRate: number;
  staffOnDuty: number;
  criticalAlerts: number;
  upcomingAppointments: {
    time: string;
    patient: string;
    doctor: string;
    department: string;
  }[];
}

export interface ReportFilters {
  dateRange: {
    start: string;
    end: string;
  };
  department: string;
  doctor: string;
  reportType: string;
}

interface ReportsState {
  reportData: ReportData | null;
  dashboardMetrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
  filters: ReportFilters;
  customReports: any[];
}

// Mock data
const mockReportData: ReportData = {
  revenue: {
    daily: [
      { date: '2024-01-01', amount: 12500 },
      { date: '2024-01-02', amount: 15200 },
      { date: '2024-01-03', amount: 18900 },
      { date: '2024-01-04', amount: 14300 },
      { date: '2024-01-05', amount: 16700 },
      { date: '2024-01-06', amount: 19200 },
      { date: '2024-01-07', amount: 13800 },
    ],
    weekly: [
      { week: 'Week 1', amount: 95000 },
      { week: 'Week 2', amount: 102000 },
      { week: 'Week 3', amount: 98000 },
      { week: 'Week 4', amount: 105000 },
    ],
    monthly: [
      { month: 'Jan 2024', amount: 420000 },
      { month: 'Dec 2023', amount: 385000 },
      { month: 'Nov 2023', amount: 398000 },
      { month: 'Oct 2023', amount: 412000 },
      { month: 'Sep 2023', amount: 390000 },
      { month: 'Aug 2023', amount: 405000 },
    ],
    yearly: [
      { year: '2024', amount: 420000 },
      { year: '2023', amount: 4650000 },
      { year: '2022', amount: 4200000 },
    ],
    byDepartment: [
      { department: 'Cardiology', amount: 125000 },
      { department: 'Orthopedics', amount: 98000 },
      { department: 'General Medicine', amount: 87000 },
      { department: 'Pediatrics', amount: 65000 },
      { department: 'Emergency', amount: 45000 },
    ],
    byPaymentMethod: [
      { method: 'Insurance', amount: 250000 },
      { method: 'Cash', amount: 85000 },
      { method: 'Credit Card', amount: 65000 },
      { method: 'Debit Card', amount: 20000 },
    ],
  },
  patients: {
    totalPatients: 5420,
    newPatientsThisMonth: 234,
    patientsByGender: [
      { gender: 'Male', count: 2890 },
      { gender: 'Female', count: 2530 },
    ],
    patientsByAgeGroup: [
      { ageGroup: '0-18', count: 1250 },
      { ageGroup: '19-35', count: 1680 },
      { ageGroup: '36-50', count: 1420 },
      { ageGroup: '51-65', count: 780 },
      { ageGroup: '65+', count: 290 },
    ],
    patientsByInsurance: [
      { insurance: 'HealthCare Plus', count: 2100 },
      { insurance: 'MediCover', count: 1850 },
      { insurance: 'No Insurance', count: 890 },
      { insurance: 'Other', count: 580 },
    ],
    patientGrowth: [
      { month: 'Jan', count: 234 },
      { month: 'Dec', count: 198 },
      { month: 'Nov', count: 212 },
      { month: 'Oct', count: 189 },
      { month: 'Sep', count: 225 },
      { month: 'Aug', count: 203 },
    ],
  },
  appointments: {
    totalAppointments: 8750,
    completedAppointments: 7250,
    cancelledAppointments: 890,
    noShowAppointments: 610,
    appointmentsByStatus: [
      { status: 'Completed', count: 7250 },
      { status: 'Cancelled', count: 890 },
      { status: 'No Show', count: 610 },
    ],
    appointmentsByDepartment: [
      { department: 'General Medicine', count: 2850 },
      { department: 'Cardiology', count: 1920 },
      { department: 'Orthopedics', count: 1650 },
      { department: 'Pediatrics', count: 1480 },
      { department: 'Dermatology', count: 850 },
    ],
    appointmentsByDoctor: [
      { doctor: 'Dr. Sarah Johnson', count: 850 },
      { doctor: 'Dr. Michael Chen', count: 780 },
      { doctor: 'Dr. Emily Brown', count: 720 },
      { doctor: 'Dr. James Wilson', count: 690 },
      { doctor: 'Dr. Lisa Anderson', count: 650 },
    ],
    peakHours: [
      { hour: 9, count: 450 },
      { hour: 10, count: 620 },
      { hour: 11, count: 580 },
      { hour: 14, count: 490 },
      { hour: 15, count: 520 },
      { hour: 16, count: 380 },
    ],
    averageWaitTime: 22.5,
  },
  doctors: {
    totalDoctors: 45,
    doctorsBySpecialization: [
      { specialization: 'General Practitioner', count: 12 },
      { specialization: 'Cardiologist', count: 6 },
      { specialization: 'Orthopedic Surgeon', count: 5 },
      { specialization: 'Pediatrician', count: 8 },
      { specialization: 'Dermatologist', count: 4 },
      { specialization: 'Neurologist', count: 3 },
      { specialization: 'Other', count: 7 },
    ],
    doctorPerformance: [
      {
        doctor_id: 'doc1',
        doctor_name: 'Dr. Sarah Johnson',
        patients_seen: 850,
        revenue_generated: 125000,
        average_rating: 4.8,
        appointments_completed: 820,
      },
      {
        doctor_id: 'doc2',
        doctor_name: 'Dr. Michael Chen',
        patients_seen: 780,
        revenue_generated: 145000,
        average_rating: 4.9,
        appointments_completed: 760,
      },
      {
        doctor_id: 'doc3',
        doctor_name: 'Dr. Emily Brown',
        patients_seen: 720,
        revenue_generated: 98000,
        average_rating: 4.7,
        appointments_completed: 700,
      },
    ],
    busyDoctors: [
      { doctor: 'Dr. Sarah Johnson', appointments: 32 },
      { doctor: 'Dr. Michael Chen', appointments: 28 },
      { doctor: 'Dr. Emily Brown', appointments: 26 },
      { doctor: 'Dr. James Wilson', appointments: 24 },
      { doctor: 'Dr. Lisa Anderson', appointments: 22 },
    ],
  },
  labTests: {
    totalTests: 3250,
    testsByCategory: [
      { category: 'Blood Tests', count: 1450 },
      { category: 'Imaging', count: 680 },
      { category: 'Urine Tests', count: 520 },
      { category: 'Pathology', count: 350 },
      { category: 'Other', count: 250 },
    ],
    pendingTests: 125,
    completedTests: 3125,
    averageTurnaroundTime: 2.5,
    popularTests: [
      { test: 'Complete Blood Count', count: 450 },
      { test: 'Lipid Profile', count: 380 },
      { test: 'Liver Function Test', count: 320 },
      { test: 'Chest X-Ray', count: 280 },
      { test: 'Blood Sugar', count: 250 },
    ],
  },
  medications: {
    totalPrescriptions: 6890,
    mostPrescribedMedications: [
      { medication: 'Paracetamol', count: 890 },
      { medication: 'Amoxicillin', count: 650 },
      { medication: 'Ibuprofen', count: 580 },
      { medication: 'Omeprazole', count: 420 },
      { medication: 'Metformin', count: 380 },
    ],
    prescriptionsByDepartment: [
      { department: 'General Medicine', count: 2450 },
      { department: 'Cardiology', count: 1890 },
      { department: 'Pediatrics', count: 1250 },
      { department: 'Orthopedics', count: 890 },
      { department: 'Other', count: 410 },
    ],
    controlledSubstances: 234,
  },
  operational: {
    bedOccupancyRate: 78.5,
    averageStayDuration: 3.2,
    emergencyResponseTime: 8.5,
    staffUtilization: 82.3,
    equipmentUtilization: [
      { equipment: 'MRI Scanner', utilization: 85 },
      { equipment: 'CT Scanner', utilization: 78 },
      { equipment: 'X-Ray Machine', utilization: 92 },
      { equipment: 'Ultrasound', utilization: 88 },
      { equipment: 'ECG Machine', utilization: 75 },
    ],
  },
};

const mockDashboardMetrics: DashboardMetrics = {
  todayRevenue: 18900,
  todayAppointments: 45,
  activePatients: 5420,
  pendingBills: 23,
  occupancyRate: 78.5,
  staffOnDuty: 125,
  criticalAlerts: 3,
  upcomingAppointments: [
    {
      time: '10:00 AM',
      patient: 'John Doe',
      doctor: 'Dr. Sarah Johnson',
      department: 'Cardiology',
    },
    {
      time: '10:30 AM',
      patient: 'Jane Smith',
      doctor: 'Dr. Michael Chen',
      department: 'General Medicine',
    },
    {
      time: '11:00 AM',
      patient: 'Robert Brown',
      doctor: 'Dr. Emily Brown',
      department: 'Pediatrics',
    },
  ],
};

const initialState: ReportsState = {
  reportData: mockReportData,
  dashboardMetrics: mockDashboardMetrics,
  loading: false,
  error: null,
  filters: {
    dateRange: {
      start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
      end: new Date().toISOString(),
    },
    department: 'all',
    doctor: 'all',
    reportType: 'revenue',
  },
  customReports: [],
};

// Async thunks
export const fetchReportData = createAsyncThunk(
  'reports/fetchReportData',
  async (filters: ReportFilters) => {
    const response = await api.get('/reports/data', { params: filters });
    return response.data;
  }
);

export const fetchDashboardMetrics = createAsyncThunk(
  'reports/fetchDashboardMetrics',
  async () => {
    const response = await api.get('/reports/dashboard-metrics');
    return response.data;
  }
);

export const generateCustomReport = createAsyncThunk(
  'reports/generateCustomReport',
  async (params: any) => {
    const response = await api.post('/reports/custom', params);
    return response.data;
  }
);

export const exportReport = createAsyncThunk(
  'reports/exportReport',
  async (params: { format: 'pdf' | 'excel' | 'csv'; reportType: string; filters: any }) => {
    const response = await api.post('/reports/export', params, {
      responseType: 'blob',
    });
    return response.data;
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ReportFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateDashboardMetric: (state, action: PayloadAction<Partial<DashboardMetrics>>) => {
      if (state.dashboardMetrics) {
        state.dashboardMetrics = { ...state.dashboardMetrics, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch report data
      .addCase(fetchReportData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportData.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload || state.reportData;
      })
      .addCase(fetchReportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch report data';
      })
      // Fetch dashboard metrics
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.dashboardMetrics = action.payload || state.dashboardMetrics;
      })
      // Generate custom report
      .addCase(generateCustomReport.fulfilled, (state, action) => {
        state.customReports.push(action.payload);
      });
  },
});

export const {
  setFilters,
  clearFilters,
  updateDashboardMetric,
} = reportsSlice.actions;

export default reportsSlice.reducer;