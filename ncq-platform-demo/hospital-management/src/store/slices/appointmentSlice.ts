import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Appointment {
  id: string;
  appointment_number: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  doctor_id: string;
  doctor_name: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  type: 'consultation' | 'follow_up' | 'procedure' | 'emergency';
  reason: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Additional fields for queue management
  check_in_time?: string;
  check_out_time?: string;
  wait_time?: number;
  // Billing
  service_id?: string;
  service_name?: string;
  amount?: number;
  payment_status?: 'pending' | 'paid' | 'partial';
}

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  todayQueue: Appointment[];
  calendarView: 'month' | 'week' | 'day';
  selectedDate: string;
  availableSlots: any[];
}

// Mock data for development
const generateMockAppointments = (): Appointment[] => {
  const appointments: Appointment[] = [];
  const statuses: Appointment['status'][] = ['scheduled', 'confirmed', 'completed', 'cancelled'];
  const types: Appointment['type'][] = ['consultation', 'follow_up', 'procedure'];
  const departments = ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology'];
  const doctors = [
    { id: 'doc1', name: 'Dr. Sarah Johnson', department: 'General Medicine' },
    { id: 'doc2', name: 'Dr. Michael Chen', department: 'Cardiology' },
    { id: 'doc3', name: 'Dr. Emily Williams', department: 'Pediatrics' },
    { id: 'doc4', name: 'Dr. James Brown', department: 'Orthopedics' },
    { id: 'doc5', name: 'Dr. Lisa Davis', department: 'Dermatology' },
  ];
  const patients = [
    { id: '1', name: 'John Doe', phone: '(555) 123-4567' },
    { id: '2', name: 'Jane Smith', phone: '(555) 234-5678' },
    { id: '3', name: 'Robert Johnson', phone: '(555) 345-6789' },
    { id: '4', name: 'Maria Garcia', phone: '(555) 456-7890' },
    { id: '5', name: 'David Wilson', phone: '(555) 567-8901' },
  ];
  const reasons = [
    'General Checkup',
    'Follow-up Visit',
    'Chest Pain',
    'Skin Rash',
    'Joint Pain',
    'Fever and Cough',
    'Routine Examination',
    'Vaccination',
    'Blood Pressure Check',
    'Diabetes Consultation',
  ];

  // Generate appointments for the current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  for (let day = 1; day <= 30; day++) {
    const appointmentsPerDay = Math.floor(Math.random() * 8) + 3; // 3-10 appointments per day
    
    for (let i = 0; i < appointmentsPerDay; i++) {
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const hour = Math.floor(Math.random() * 9) + 9; // 9 AM to 5 PM
      const minute = Math.random() < 0.5 ? '00' : '30';
      const appointmentDate = new Date(currentYear, currentMonth, day);
      const isToday = day === today.getDate();
      const isPast = day < today.getDate();
      
      let status: Appointment['status'] = 'scheduled';
      if (isPast) {
        status = Math.random() < 0.7 ? 'completed' : (Math.random() < 0.5 ? 'cancelled' : 'no_show');
      } else if (isToday) {
        const statusOptions: Appointment['status'][] = ['scheduled', 'confirmed', 'in_progress', 'completed'];
        status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      } else {
        status = Math.random() < 0.6 ? 'confirmed' : 'scheduled';
      }

      const appointment: Appointment = {
        id: `apt-${day}-${i}`,
        appointment_number: `APT${currentYear}${String(currentMonth + 1).padStart(2, '0')}${String(day).padStart(2, '0')}${String(i + 1).padStart(3, '0')}`,
        patient_id: patient.id,
        patient_name: patient.name,
        patient_phone: patient.phone,
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        department: doctor.department,
        appointment_date: appointmentDate.toISOString().split('T')[0],
        appointment_time: `${String(hour).padStart(2, '0')}:${minute}`,
        duration: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
        status,
        type: types[Math.floor(Math.random() * types.length)],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        notes: Math.random() < 0.3 ? 'Patient requested early morning appointment' : undefined,
        created_at: new Date(currentYear, currentMonth, day - 7).toISOString(),
        updated_at: appointmentDate.toISOString(),
        service_name: 'General Consultation',
        amount: [50, 75, 100, 150][Math.floor(Math.random() * 4)],
        payment_status: status === 'completed' ? (Math.random() < 0.8 ? 'paid' : 'pending') : 'pending',
      };

      // Add queue management data for today's appointments
      if (isToday && (status === 'in_progress' || status === 'completed')) {
        appointment.check_in_time = `${String(hour).padStart(2, '0')}:${String(parseInt(minute) - 5).padStart(2, '0')}`;
        if (status === 'completed') {
          appointment.check_out_time = `${String(hour).padStart(2, '0')}:${String(parseInt(minute) + appointment.duration).padStart(2, '0')}`;
        }
        appointment.wait_time = Math.floor(Math.random() * 30) + 5; // 5-35 minutes
      }

      appointments.push(appointment);
    }
  }

  return appointments.sort((a, b) => {
    const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
    const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
    return dateA.getTime() - dateB.getTime();
  });
};

const mockAppointments = generateMockAppointments();

const initialState: AppointmentState = {
  appointments: mockAppointments,
  selectedAppointment: null,
  loading: false,
  error: null,
  totalCount: mockAppointments.length,
  currentPage: 1,
  todayQueue: mockAppointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.appointment_date === today;
  }),
  calendarView: 'month',
  selectedDate: new Date().toISOString().split('T')[0],
  availableSlots: [],
};

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (params: { 
    page?: number; 
    per_page?: number; 
    date?: string; 
    doctor_id?: string; 
    status?: string;
    search?: string;
  }) => {
    const response = await api.get('/v1/appointments', { params });
    return response.data;
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData: Partial<Appointment>) => {
    const response = await api.post('/v1/appointments', appointmentData);
    return response.data;
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ id, data }: { id: string; data: Partial<Appointment> }) => {
    const response = await api.put(`/v1/appointments/${id}`, data);
    return response.data;
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async ({ id, reason }: { id: string; reason: string }) => {
    const response = await api.post(`/v1/appointments/${id}/cancel`, { reason });
    return response.data;
  }
);

export const checkInPatient = createAsyncThunk(
  'appointments/checkIn',
  async (id: string) => {
    const response = await api.post(`/v1/appointments/${id}/check-in`);
    return response.data;
  }
);

export const checkOutPatient = createAsyncThunk(
  'appointments/checkOut',
  async (id: string) => {
    const response = await api.post(`/v1/appointments/${id}/check-out`);
    return response.data;
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  'appointments/fetchAvailableSlots',
  async (params: { doctor_id: string; date: string }) => {
    const response = await api.get('/v1/appointments/slots', { params });
    return response.data;
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selectedAppointment = action.payload;
    },
    setCalendarView: (state, action: PayloadAction<'month' | 'week' | 'day'>) => {
      state.calendarView = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    updateTodayQueue: (state) => {
      const today = new Date().toISOString().split('T')[0];
      state.todayQueue = state.appointments.filter(apt => apt.appointment_date === today);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.items || state.appointments;
        state.totalCount = action.payload.total || state.totalCount;
        state.currentPage = action.payload.page || state.currentPage;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointments';
      })
      // Create appointment
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.unshift(action.payload);
        state.totalCount += 1;
      })
      // Update appointment
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.selectedAppointment?.id === action.payload.id) {
          state.selectedAppointment = action.payload;
        }
      })
      // Cancel appointment
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = { ...state.appointments[index], status: 'cancelled' };
        }
      })
      // Check in
      .addCase(checkInPatient.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        // Update today's queue
        const queueIndex = state.todayQueue.findIndex(a => a.id === action.payload.id);
        if (queueIndex !== -1) {
          state.todayQueue[queueIndex] = action.payload;
        }
      })
      // Check out
      .addCase(checkOutPatient.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        // Update today's queue
        const queueIndex = state.todayQueue.findIndex(a => a.id === action.payload.id);
        if (queueIndex !== -1) {
          state.todayQueue[queueIndex] = action.payload;
        }
      })
      // Available slots
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.availableSlots = action.payload;
      });
  },
});

export const { 
  setSelectedAppointment, 
  setCalendarView, 
  setSelectedDate, 
  updateTodayQueue,
  clearError 
} = appointmentSlice.actions;

export default appointmentSlice.reducer;