import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Close,
  Edit,
  Print,
  Phone,
  Email,
  CalendarMonth,
  AccessTime,
  Person,
  LocalHospital,
  LocationOn,
  AttachMoney,
  Receipt,
  CheckCircle,
  Cancel,
  Schedule,
  EventNote,
  Message,
  History,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Appointment } from '../../store/slices/appointmentSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { checkInPatient, checkOutPatient, cancelAppointment } from '../../store/slices/appointmentSlice';
import { showNotification } from '../../store/slices/notificationSlice';

interface AppointmentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
  onEdit: () => void;
}

const AppointmentDetailsDialog: React.FC<AppointmentDetailsDialogProps> = ({
  open,
  onClose,
  appointment,
  onEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCheckIn = async () => {
    try {
      await dispatch(checkInPatient(appointment.id)).unwrap();
      dispatch(showNotification({
        message: 'Patient checked in successfully',
        severity: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to check in patient',
        severity: 'error',
      }));
    }
  };

  const handleCheckOut = async () => {
    try {
      await dispatch(checkOutPatient(appointment.id)).unwrap();
      dispatch(showNotification({
        message: 'Patient checked out successfully',
        severity: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to check out patient',
        severity: 'error',
      }));
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await dispatch(cancelAppointment({
          id: appointment.id,
          reason: 'Cancelled by staff',
        })).unwrap();
        dispatch(showNotification({
          message: 'Appointment cancelled successfully',
          severity: 'success',
        }));
        onClose();
      } catch (error) {
        dispatch(showNotification({
          message: 'Failed to cancel appointment',
          severity: 'error',
        }));
      }
    }
  };

  const getStatusColor = (): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (appointment.status) {
      case 'confirmed': return 'success';
      case 'scheduled': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      case 'no_show': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (appointment.status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle />;
      case 'cancelled':
      case 'no_show':
        return <Cancel />;
      case 'in_progress':
        return <Schedule />;
      default:
        return <EventNote />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
              {appointment.patient_name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5">
                Appointment Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                #{appointment.appointment_number}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Tooltip title="Print">
              <IconButton onClick={handlePrint}>
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton onClick={onEdit} color="primary">
                <Edit />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Status and Quick Actions */}
          <Grid item xs={12}>
            <Alert 
              severity={appointment.status === 'cancelled' ? 'error' : 'info'}
              icon={getStatusIcon()}
              action={
                appointment.status === 'scheduled' || appointment.status === 'confirmed' ? (
                  <Box>
                    {!appointment.check_in_time && (
                      <Button size="small" onClick={handleCheckIn}>
                        Check In
                      </Button>
                    )}
                    <Button size="small" color="error" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Box>
                ) : appointment.status === 'in_progress' ? (
                  <Button size="small" onClick={handleCheckOut}>
                    Check Out
                  </Button>
                ) : null
              }
            >
              <Typography variant="body1">
                Status: <Chip label={appointment.status.toUpperCase()} size="small" color={getStatusColor()} />
              </Typography>
            </Alert>
          </Grid>

          {/* Appointment Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Appointment Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CalendarMonth color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date"
                    secondary={format(new Date(appointment.appointment_date), 'EEEE, MMMM d, yyyy')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Time"
                    secondary={`${appointment.appointment_time} (${appointment.duration} minutes)`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EventNote color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Type"
                    secondary={appointment.type}
                    secondaryTypographyProps={{ textTransform: 'capitalize' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Message color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Reason"
                    secondary={appointment.reason}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Patient Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Patient Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Name"
                    secondary={appointment.patient_name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={appointment.patient_phone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocalHospital color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Doctor"
                    secondary={`${appointment.doctor_name} - ${appointment.department}`}
                  />
                </ListItem>
                {appointment.service_name && (
                  <ListItem>
                    <ListItemIcon>
                      <Receipt color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Service"
                      secondary={appointment.service_name}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Additional Notes */}
          {appointment.notes && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2">
                  {appointment.notes}
                </Typography>
              </Paper>
            </Grid>
          )}

          {/* Queue Management Info */}
          {(appointment.check_in_time || appointment.check_out_time) && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Queue Management
                </Typography>
                <Grid container spacing={2}>
                  {appointment.check_in_time && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Check-in Time
                      </Typography>
                      <Typography variant="body1">
                        {appointment.check_in_time}
                      </Typography>
                    </Grid>
                  )}
                  {appointment.check_out_time && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Check-out Time
                      </Typography>
                      <Typography variant="body1">
                        {appointment.check_out_time}
                      </Typography>
                    </Grid>
                  )}
                  {appointment.wait_time && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Wait Time
                      </Typography>
                      <Typography variant="body1">
                        {appointment.wait_time} minutes
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Billing Information */}
          {appointment.amount && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Billing Information
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="h5">
                      ${appointment.amount}
                    </Typography>
                  </Box>
                  <Chip
                    label={appointment.payment_status || 'Pending'}
                    color={appointment.payment_status === 'paid' ? 'success' : 'warning'}
                  />
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Activity History */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Activity History
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <History color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Appointment created"
                    secondary={format(new Date(appointment.created_at), 'MMM d, yyyy at h:mm a')}
                  />
                </ListItem>
                
                {appointment.status === 'confirmed' && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Appointment confirmed"
                      secondary={format(new Date(appointment.updated_at), 'MMM d, yyyy at h:mm a')}
                    />
                  </ListItem>
                )}

                {appointment.check_in_time && (
                  <ListItem>
                    <ListItemIcon>
                      <Schedule color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Patient checked in"
                      secondary={`Today at ${appointment.check_in_time}`}
                    />
                  </ListItem>
                )}

                {appointment.check_out_time && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Patient checked out"
                      secondary={`Today at ${appointment.check_out_time}`}
                    />
                  </ListItem>
                )}

                {appointment.status === 'cancelled' && (
                  <ListItem>
                    <ListItemIcon>
                      <Cancel color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Appointment cancelled"
                      secondary={format(new Date(appointment.updated_at), 'MMM d, yyyy at h:mm a')}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <>
            <Button variant="outlined" onClick={onEdit} startIcon={<Edit />}>
              Edit Appointment
            </Button>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel Appointment
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDetailsDialog;