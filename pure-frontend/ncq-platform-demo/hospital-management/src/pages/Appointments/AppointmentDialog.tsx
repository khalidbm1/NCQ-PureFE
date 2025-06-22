import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Typography,
  Divider,
  IconButton,
  Autocomplete,
  Chip,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Save,
  CalendarMonth,
  AccessTime,
  Person,
  LocalHospital,
  Note,
  Schedule,
  EventAvailable,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, addDays, setHours, setMinutes, isBefore, isAfter, parseISO } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createAppointment, updateAppointment, fetchAvailableSlots, Appointment } from '../../store/slices/appointmentSlice';
import { showNotification } from '../../store/slices/notificationSlice';

interface AppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
  editMode?: boolean;
  onSuccess: () => void;
  preSelectedDate?: Date;
  preSelectedPatient?: string;
  preSelectedDoctor?: string;
}

const appointmentTypes = [
  { value: 'consultation', label: 'Consultation', duration: 30 },
  { value: 'follow_up', label: 'Follow-up', duration: 15 },
  { value: 'procedure', label: 'Procedure', duration: 60 },
  { value: 'emergency', label: 'Emergency', duration: 45 },
];

const validationSchema = Yup.object({
  patient_id: Yup.string().required('Patient is required'),
  doctor_id: Yup.string().required('Doctor is required'),
  appointment_date: Yup.date()
    .min(new Date().setHours(0, 0, 0, 0), 'Cannot book appointments in the past')
    .required('Date is required'),
  appointment_time: Yup.string().required('Time is required'),
  type: Yup.string().required('Appointment type is required'),
  reason: Yup.string().required('Reason is required'),
  duration: Yup.number().min(15, 'Minimum duration is 15 minutes').required('Duration is required'),
});

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  open,
  onClose,
  appointment,
  editMode = false,
  onSuccess,
  preSelectedDate,
  preSelectedPatient,
  preSelectedDoctor,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { patients } = useSelector((state: RootState) => state.patients);
  const { availableSlots } = useSelector((state: RootState) => state.appointments);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock doctors data - in real app, this would come from Redux
  const doctors = [
    { id: 'doc1', name: 'Dr. Sarah Johnson', department: 'General Medicine', specialization: 'Family Medicine' },
    { id: 'doc2', name: 'Dr. Michael Chen', department: 'Cardiology', specialization: 'Interventional Cardiology' },
    { id: 'doc3', name: 'Dr. Emily Williams', department: 'Pediatrics', specialization: 'General Pediatrics' },
    { id: 'doc4', name: 'Dr. James Brown', department: 'Orthopedics', specialization: 'Sports Medicine' },
    { id: 'doc5', name: 'Dr. Lisa Davis', department: 'Dermatology', specialization: 'Cosmetic Dermatology' },
  ];

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formik = useFormik({
    initialValues: {
      patient_id: preSelectedPatient || '',
      doctor_id: preSelectedDoctor || '',
      appointment_date: preSelectedDate ? format(preSelectedDate, 'yyyy-MM-dd') : '',
      appointment_time: '',
      type: 'consultation',
      reason: '',
      notes: '',
      duration: 30,
      send_reminder: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const appointmentData = {
          ...values,
          status: 'scheduled' as Appointment['status'],
          type: values.type as Appointment['type'],
          // In real app, these would be fetched from patient/doctor data
          patient_name: patients.find(p => p.id === values.patient_id)?.first_name + ' ' + 
                       patients.find(p => p.id === values.patient_id)?.last_name || '',
          patient_phone: patients.find(p => p.id === values.patient_id)?.phone || '',
          doctor_name: doctors.find(d => d.id === values.doctor_id)?.name || '',
          department: doctors.find(d => d.id === values.doctor_id)?.department || '',
        };

        if (editMode && appointment) {
          await dispatch(updateAppointment({ 
            id: appointment.id, 
            data: appointmentData 
          })).unwrap();
          dispatch(showNotification({
            message: 'Appointment updated successfully',
            severity: 'success',
          }));
        } else {
          await dispatch(createAppointment(appointmentData)).unwrap();
          dispatch(showNotification({
            message: 'Appointment booked successfully',
            severity: 'success',
          }));
        }
        onSuccess();
        handleClose();
      } catch (error: any) {
        dispatch(showNotification({
          message: error.message || 'Failed to save appointment',
          severity: 'error',
        }));
      }
    },
  });

  useEffect(() => {
    if (appointment && editMode) {
      formik.setValues({
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        type: appointment.type,
        reason: appointment.reason,
        notes: appointment.notes || '',
        duration: appointment.duration,
        send_reminder: true,
      });
    }
  }, [appointment, editMode]);

  useEffect(() => {
    // Fetch available slots when doctor and date are selected
    if (formik.values.doctor_id && formik.values.appointment_date) {
      setLoadingSlots(true);
      // Simulate API call
      setTimeout(() => {
        setLoadingSlots(false);
      }, 500);
    }
  }, [formik.values.doctor_id, formik.values.appointment_date]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleTypeChange = (event: any) => {
    const type = event.target.value;
    formik.setFieldValue('type', type);
    const selectedType = appointmentTypes.find(t => t.value === type);
    if (selectedType) {
      formik.setFieldValue('duration', selectedType.duration);
    }
  };

  const getNextAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = addDays(new Date(), i);
      if (date.getDay() !== 0) { // Exclude Sundays
        dates.push(date);
      }
    }
    return dates;
  };

  const availableDates = getNextAvailableDates();

  // Check if a time slot is available
  const isSlotAvailable = (time: string) => {
    // In real app, this would check against booked appointments
    // For now, randomly mark some slots as unavailable
    return Math.random() > 0.3;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarMonth />
            <Typography variant="h6">
              {editMode ? 'Edit Appointment' : 'Book New Appointment'}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Patient Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Patient Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={patients}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name} - ${option.patient_id}`}
                value={patients.find(p => p.id === formik.values.patient_id) || null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('patient_id', newValue?.id || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Patient"
                    error={formik.touched.patient_id && Boolean(formik.errors.patient_id)}
                    helperText={formik.touched.patient_id && formik.errors.patient_id}
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">
                        {option.first_name} {option.last_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {option.patient_id} | Phone: {option.phone}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>

            {/* Doctor Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 1 }}>
                Doctor & Schedule
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={formik.touched.doctor_id && Boolean(formik.errors.doctor_id)}>
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  name="doctor_id"
                  value={formik.values.doctor_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Select Doctor"
                  startAdornment={<LocalHospital sx={{ mr: 1, ml: 1, color: 'action.active' }} />}
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      <Box>
                        <Typography variant="body2">{doctor.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {doctor.department} - {doctor.specialization}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.doctor_id && formik.errors.doctor_id && (
                  <FormHelperText>{formik.errors.doctor_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Appointment Type</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={handleTypeChange}
                  label="Appointment Type"
                >
                  {appointmentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box display="flex" justifyContent="space-between" width="100%">
                        <Typography>{type.label}</Typography>
                        <Chip label={`${type.duration} min`} size="small" />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Date Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Select Date
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {availableDates.slice(0, 7).map((date) => (
                  <Paper
                    key={date.toISOString()}
                    elevation={formik.values.appointment_date === format(date, 'yyyy-MM-dd') ? 3 : 1}
                    sx={{
                      p: 1.5,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: formik.values.appointment_date === format(date, 'yyyy-MM-dd') 
                        ? 'primary.main' 
                        : 'transparent',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => formik.setFieldValue('appointment_date', format(date, 'yyyy-MM-dd'))}
                  >
                    <Typography variant="caption" display="block" align="center">
                      {format(date, 'EEE')}
                    </Typography>
                    <Typography variant="h6" align="center">
                      {format(date, 'd')}
                    </Typography>
                    <Typography variant="caption" display="block" align="center">
                      {format(date, 'MMM')}
                    </Typography>
                  </Paper>
                ))}
              </Box>
              {formik.touched.appointment_date && formik.errors.appointment_date && (
                <FormHelperText error>{formik.errors.appointment_date}</FormHelperText>
              )}
            </Grid>

            {/* Time Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Select Time
              </Typography>
              {loadingSlots ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box display="flex" gap={1} flexWrap="wrap">
                  {timeSlots.map((time) => {
                    const available = isSlotAvailable(time);
                    return (
                      <ToggleButton
                        key={time}
                        value={time}
                        selected={formik.values.appointment_time === time}
                        onChange={() => formik.setFieldValue('appointment_time', time)}
                        disabled={!available}
                        size="small"
                        sx={{
                          px: 2,
                          py: 1,
                          textTransform: 'none',
                        }}
                      >
                        <Box textAlign="center">
                          <Typography variant="body2">
                            {time}
                          </Typography>
                          {!available && (
                            <Typography variant="caption" color="text.disabled">
                              Booked
                            </Typography>
                          )}
                        </Box>
                      </ToggleButton>
                    );
                  })}
                </Box>
              )}
              {formik.touched.appointment_time && formik.errors.appointment_time && (
                <FormHelperText error>{formik.errors.appointment_time}</FormHelperText>
              )}
            </Grid>

            {/* Appointment Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 1 }}>
                Appointment Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Visit"
                name="reason"
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.reason && Boolean(formik.errors.reason)}
                helperText={formik.touched.reason && formik.errors.reason}
                required
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                multiline
                rows={3}
                placeholder="Any special requirements or additional information"
              />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" icon={<EventAvailable />}>
                <Typography variant="body2">
                  Appointment duration: <strong>{formik.values.duration} minutes</strong>
                </Typography>
                {formik.values.appointment_date && formik.values.appointment_time && (
                  <Typography variant="body2">
                    Scheduled for: <strong>
                      {format(parseISO(formik.values.appointment_date), 'EEEE, MMMM d, yyyy')} at {formik.values.appointment_time}
                    </strong>
                  </Typography>
                )}
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={formik.isSubmitting}
          >
            {editMode ? 'Update' : 'Book'} Appointment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AppointmentDialog;