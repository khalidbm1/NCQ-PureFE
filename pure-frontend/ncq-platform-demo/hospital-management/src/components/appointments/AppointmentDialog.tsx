import React, { useState, useEffect } from 'react';
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
  Autocomplete,
  Box,
  Chip,
  Typography,
  IconButton,
  Divider,
  Alert,
  FormHelperText,
} from '@mui/material';
import {
  Close,
  CalendarMonth,
  AccessTime,
  Person,
  LocalHospital,
  Note,
  AttachMoney,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { 
  createAppointment, 
  updateAppointment, 
  fetchAvailableSlots,
  Appointment 
} from '../../store/slices/appointmentSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import { format, parse, addMinutes } from 'date-fns';

interface AppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
  defaultDate?: Date;
  defaultTime?: Date;
}

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  open,
  onClose,
  appointment,
  defaultDate,
  defaultTime,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { patients } = useSelector((state: RootState) => state.patients);
  const { doctors } = useSelector((state: RootState) => state.doctors);
  const { availableSlots } = useSelector((state: RootState) => state.appointments);

  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: defaultDate || new Date(),
    appointment_time: defaultTime || new Date(),
    duration: 30,
    type: 'consultation' as Appointment['type'],
    reason: '',
    notes: '',
    service_id: '',
    amount: 100,
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      const appointmentDate = parse(appointment.appointment_date, 'yyyy-MM-dd', new Date());
      const appointmentTime = parse(appointment.appointment_time, 'HH:mm', new Date());
      
      setFormData({
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        duration: appointment.duration,
        type: appointment.type,
        reason: appointment.reason,
        notes: appointment.notes || '',
        service_id: appointment.service_id || '',
        amount: appointment.amount || 100,
      });
    } else if (defaultDate) {
      setFormData(prev => ({
        ...prev,
        appointment_date: defaultDate,
        appointment_time: defaultTime || new Date(),
      }));
    }
  }, [appointment, defaultDate, defaultTime]);

  useEffect(() => {
    if (formData.doctor_id && formData.appointment_date) {
      dispatch(fetchAvailableSlots({
        doctor_id: formData.doctor_id,
        date: format(formData.appointment_date, 'yyyy-MM-dd'),
      }));
    }
  }, [formData.doctor_id, formData.appointment_date, dispatch]);

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.patient_id) newErrors.patient_id = 'Patient is required';
    if (!formData.doctor_id) newErrors.doctor_id = 'Doctor is required';
    if (!formData.appointment_date) newErrors.appointment_date = 'Date is required';
    if (!formData.appointment_time) newErrors.appointment_time = 'Time is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    if (formData.duration < 15) newErrors.duration = 'Duration must be at least 15 minutes';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const appointmentData = {
        ...formData,
        appointment_date: format(formData.appointment_date, 'yyyy-MM-dd'),
        appointment_time: format(formData.appointment_time, 'HH:mm'),
      };

      if (appointment) {
        await dispatch(updateAppointment({
          id: appointment.id,
          data: appointmentData,
        })).unwrap();
        
        dispatch(showNotification({
          message: 'Appointment updated successfully',
          severity: 'success',
        }));
      } else {
        await dispatch(createAppointment(appointmentData)).unwrap();
        
        dispatch(showNotification({
          message: 'Appointment created successfully',
          severity: 'success',
        }));
      }
      
      onClose();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to save appointment',
        severity: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'emergency', label: 'Emergency' },
  ];

  const durations = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
  ];

  const selectedDoctor = doctors.find(d => d.id === formData.doctor_id);
  const endTime = addMinutes(formData.appointment_time, formData.duration);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        pb: 2,
      }}>
        <Typography variant="h6">
          {appointment ? 'Edit Appointment' : 'New Appointment'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Patient Selection */}
          <Grid item xs={12}>
            <Autocomplete
              value={patients.find(p => p.id === formData.patient_id) || null}
              onChange={(_, newValue) => {
                setFormData({ ...formData, patient_id: newValue?.id || '' });
                setErrors({ ...errors, patient_id: '' });
              }}
              options={patients}
              getOptionLabel={(option) => `${option.first_name} ${option.last_name} - ${option.phone}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Patient"
                  required
                  error={!!errors.patient_id}
                  helperText={errors.patient_id}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1">{option.first_name} {option.last_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.phone} • {option.email}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Grid>

          {/* Doctor Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.doctor_id}>
              <InputLabel>Doctor</InputLabel>
              <Select
                value={formData.doctor_id}
                onChange={(e) => {
                  setFormData({ ...formData, doctor_id: e.target.value });
                  setErrors({ ...errors, doctor_id: '' });
                }}
                label="Doctor"
                startAdornment={<LocalHospital sx={{ mr: 1, ml: 1, color: 'text.secondary' }} />}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    <Box>
                      <Typography variant="body2">{doctor.first_name} {doctor.last_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {doctor.specialization} - {doctor.department}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.doctor_id && <FormHelperText>{errors.doctor_id}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Date and Time */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Appointment Date"
                value={formData.appointment_date}
                onChange={(newValue) => {
                  if (newValue) {
                    setFormData({ ...formData, appointment_date: newValue });
                    setErrors({ ...errors, appointment_date: '' });
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.appointment_date,
                    helperText: errors.appointment_date,
                    InputProps: {
                      startAdornment: <CalendarMonth sx={{ mr: 1, color: 'text.secondary' }} />,
                    },
                  },
                }}
                disablePast
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Appointment Time"
                value={formData.appointment_time}
                onChange={(newValue) => {
                  if (newValue) {
                    setFormData({ ...formData, appointment_time: newValue });
                    setErrors({ ...errors, appointment_time: '' });
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.appointment_time,
                    helperText: errors.appointment_time,
                    InputProps: {
                      startAdornment: <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />,
                    },
                  },
                }}
                minutesStep={15}
              />
            </LocalizationProvider>
          </Grid>

          {/* Show available slots if doctor is selected */}
          {selectedDoctor && availableSlots.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Available Time Slots
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableSlots.map((slot: any) => (
                  <Chip
                    key={slot.time}
                    label={slot.time}
                    onClick={() => {
                      const time = parse(slot.time, 'HH:mm', new Date());
                      setFormData({ ...formData, appointment_time: time });
                    }}
                    color={slot.available ? 'primary' : 'default'}
                    disabled={!slot.available}
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
          )}

          {/* Duration and Type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Duration</InputLabel>
              <Select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                label="Duration"
              >
                {durations.map((duration) => (
                  <MenuItem key={duration.value} value={duration.value}>
                    {duration.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Appointment Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Appointment['type'] })}
                label="Appointment Type"
              >
                {appointmentTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Time Summary */}
          {formData.appointment_time && (
            <Grid item xs={12}>
              <Alert severity="info" icon={<AccessTime />}>
                Appointment scheduled from{' '}
                <strong>{format(formData.appointment_time, 'h:mm a')}</strong> to{' '}
                <strong>{format(endTime, 'h:mm a')}</strong>
                {selectedDoctor && ` with ${selectedDoctor.first_name} ${selectedDoctor.last_name}`}
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Reason and Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason for Visit"
              value={formData.reason}
              onChange={(e) => {
                setFormData({ ...formData, reason: e.target.value });
                setErrors({ ...errors, reason: '' });
              }}
              required
              error={!!errors.reason}
              helperText={errors.reason}
              multiline
              rows={2}
              InputProps={{
                startAdornment: <Note sx={{ mr: 1, mt: 1, color: 'text.secondary', alignSelf: 'flex-start' }} />,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              multiline
              rows={2}
              placeholder="Any special requirements or notes..."
            />
          </Grid>

          {/* Service and Amount */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Service"
              value={formData.service_id}
              onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
              placeholder="General Consultation"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              InputProps={{
                startAdornment: <AttachMoney sx={{ color: 'text.secondary' }} />,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {appointment ? 'Update' : 'Create'} Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDialog;