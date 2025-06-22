import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tenantReducer from './slices/tenantSlice';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import doctorReducer from './slices/doctorSlice';
import billingReducer from './slices/billingSlice';
import notificationReducer from './slices/notificationSlice';
import prescriptionReducer from './slices/prescriptionSlice';
import labTestReducer from './slices/labTestSlice';
import medicalRecordReducer from './slices/medicalRecordSlice';
import invoiceReducer from './slices/invoiceSlice';
import reportsReducer from './slices/reportsSlice';
import staffReducer from './slices/staffSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    patients: patientReducer,
    appointments: appointmentReducer,
    doctors: doctorReducer,
    billing: billingReducer,
    notifications: notificationReducer,
    prescriptions: prescriptionReducer,
    labTests: labTestReducer,
    medicalRecords: medicalRecordReducer,
    invoices: invoiceReducer,
    reports: reportsReducer,
    staff: staffReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;