import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StaffMember {
  id: string;
  staff_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'nurse' | 'technician' | 'receptionist' | 'admin' | 'pharmacist' | 'lab_technician' | 'radiologist' | 'therapist' | 'maintenance' | 'security';
  department: string;
  specialization?: string;
  qualification: string;
  experience_years: number;
  license_number?: string;
  license_expiry?: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  shift_preference: 'morning' | 'afternoon' | 'night' | 'flexible';
  status: 'active' | 'on_leave' | 'terminated' | 'suspended';
  join_date: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bank_details?: {
    account_number: string;
    bank_name: string;
    ifsc_code: string;
  };
  salary: number;
  allowances: number;
  photo_url?: string;
  documents: {
    type: string;
    url: string;
    uploaded_date: string;
  }[];
  skills: string[];
  languages: string[];
  created_at: string;
  updated_at: string;
}

export interface Shift {
  id: string;
  shift_id: string;
  staff_id: string;
  staff_name: string;
  date: string;
  shift_type: 'morning' | 'afternoon' | 'night' | 'custom';
  start_time: string;
  end_time: string;
  department: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  check_in_time?: string;
  check_out_time?: string;
  break_duration: number; // in minutes
  overtime_hours: number;
  notes?: string;
  replacement_staff_id?: string;
  replacement_staff_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  attendance_id: string;
  staff_id: string;
  staff_name: string;
  date: string;
  check_in_time: string;
  check_out_time?: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'holiday' | 'leave';
  late_minutes?: number;
  overtime_minutes?: number;
  shift_id?: string;
  leave_type?: 'sick' | 'casual' | 'earned' | 'maternity' | 'paternity' | 'unpaid';
  reason?: string;
  approved_by?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  device_info?: string;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  request_id: string;
  staff_id: string;
  staff_name: string;
  leave_type: 'sick' | 'casual' | 'earned' | 'maternity' | 'paternity' | 'unpaid' | 'emergency';
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: string;
  approved_date?: string;
  rejection_reason?: string;
  supporting_document?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffPerformance {
  staff_id: string;
  staff_name: string;
  role: string;
  department: string;
  attendance_rate: number;
  punctuality_score: number;
  patient_feedback_score: number;
  tasks_completed: number;
  efficiency_score: number;
  overtime_hours: number;
  leave_days_taken: number;
  training_hours: number;
  certifications_earned: number;
  warnings_received: number;
  commendations_received: number;
  overall_rating: number;
}

export interface Schedule {
  id: string;
  schedule_id: string;
  department: string;
  week_start_date: string;
  shifts: {
    date: string;
    morning: string[];
    afternoon: string[];
    night: string[];
  }[];
  published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface StaffState {
  staff: StaffMember[];
  shifts: Shift[];
  attendance: Attendance[];
  leaveRequests: LeaveRequest[];
  schedules: Schedule[];
  performance: StaffPerformance[];
  loading: boolean;
  error: string | null;
  filters: {
    department: string;
    role: string;
    status: string;
    searchTerm: string;
  };
  stats: {
    totalStaff: number;
    activeStaff: number;
    onLeaveStaff: number;
    todayPresent: number;
    todayAbsent: number;
    pendingLeaveRequests: number;
    staffByDepartment: { department: string; count: number }[];
    staffByRole: { role: string; count: number }[];
    averageAttendance: number;
    overtimeHours: number;
  };
}

const initialState: StaffState = {
  staff: [],
  shifts: [],
  attendance: [],
  leaveRequests: [],
  schedules: [],
  performance: [],
  loading: false,
  error: null,
  filters: {
    department: 'all',
    role: 'all',
    status: 'all',
    searchTerm: '',
  },
  stats: {
    totalStaff: 0,
    activeStaff: 0,
    onLeaveStaff: 0,
    todayPresent: 0,
    todayAbsent: 0,
    pendingLeaveRequests: 0,
    staffByDepartment: [],
    staffByRole: [],
    averageAttendance: 0,
    overtimeHours: 0,
  },
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaff: (state, action: PayloadAction<StaffMember[]>) => {
      state.staff = action.payload;
      state.loading = false;
      state.error = null;
    },
    addStaff: (state, action: PayloadAction<StaffMember>) => {
      state.staff.unshift(action.payload);
    },
    updateStaff: (state, action: PayloadAction<StaffMember>) => {
      const index = state.staff.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.staff[index] = action.payload;
      }
    },
    deleteStaff: (state, action: PayloadAction<string>) => {
      state.staff = state.staff.filter(s => s.id !== action.payload);
    },
    setShifts: (state, action: PayloadAction<Shift[]>) => {
      state.shifts = action.payload;
    },
    addShift: (state, action: PayloadAction<Shift>) => {
      state.shifts.unshift(action.payload);
    },
    updateShift: (state, action: PayloadAction<Shift>) => {
      const index = state.shifts.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.shifts[index] = action.payload;
      }
    },
    deleteShift: (state, action: PayloadAction<string>) => {
      state.shifts = state.shifts.filter(s => s.id !== action.payload);
    },
    setAttendance: (state, action: PayloadAction<Attendance[]>) => {
      state.attendance = action.payload;
    },
    markAttendance: (state, action: PayloadAction<Attendance>) => {
      const existingIndex = state.attendance.findIndex(
        a => a.staff_id === action.payload.staff_id && a.date === action.payload.date
      );
      if (existingIndex !== -1) {
        state.attendance[existingIndex] = action.payload;
      } else {
        state.attendance.unshift(action.payload);
      }
    },
    setLeaveRequests: (state, action: PayloadAction<LeaveRequest[]>) => {
      state.leaveRequests = action.payload;
    },
    addLeaveRequest: (state, action: PayloadAction<LeaveRequest>) => {
      state.leaveRequests.unshift(action.payload);
    },
    updateLeaveRequest: (state, action: PayloadAction<LeaveRequest>) => {
      const index = state.leaveRequests.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.leaveRequests[index] = action.payload;
      }
    },
    setSchedules: (state, action: PayloadAction<Schedule[]>) => {
      state.schedules = action.payload;
    },
    addSchedule: (state, action: PayloadAction<Schedule>) => {
      state.schedules.unshift(action.payload);
    },
    updateSchedule: (state, action: PayloadAction<Schedule>) => {
      const index = state.schedules.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.schedules[index] = action.payload;
      }
    },
    setPerformance: (state, action: PayloadAction<StaffPerformance[]>) => {
      state.performance = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<StaffState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setStats: (state, action: PayloadAction<StaffState['stats']>) => {
      state.stats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  setShifts,
  addShift,
  updateShift,
  deleteShift,
  setAttendance,
  markAttendance,
  setLeaveRequests,
  addLeaveRequest,
  updateLeaveRequest,
  setSchedules,
  addSchedule,
  updateSchedule,
  setPerformance,
  setFilters,
  setStats,
  setLoading,
  setError,
} = staffSlice.actions;

export default staffSlice.reducer;