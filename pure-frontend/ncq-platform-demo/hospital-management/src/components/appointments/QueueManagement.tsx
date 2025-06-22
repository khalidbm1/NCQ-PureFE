import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Button,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tooltip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search,
  CheckCircle,
  Cancel,
  MoreVert,
  AccessTime,
  Person,
  LocalHospital,
  Timer,
  TimerOff,
  Assignment,
  TrendingUp,
  People,
  Schedule,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  Appointment, 
  checkInPatient, 
  checkOutPatient,
  updateAppointment,
} from '../../store/slices/appointmentSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import { format, differenceInMinutes } from 'date-fns';

const QueueManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todayQueue } = useSelector((state: RootState) => state.appointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'no_show': return 'default';
      default: return 'primary';
    }
  };

  const filteredQueue = todayQueue.filter(appointment => {
    const matchesSearch = 
      appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const queueStats = {
    total: todayQueue.length,
    waiting: todayQueue.filter(a => a.status === 'confirmed' || a.status === 'scheduled').length,
    inProgress: todayQueue.filter(a => a.status === 'in_progress').length,
    completed: todayQueue.filter(a => a.status === 'completed').length,
    avgWaitTime: Math.round(
      todayQueue
        .filter(a => a.wait_time)
        .reduce((sum, a) => sum + (a.wait_time || 0), 0) / 
      (todayQueue.filter(a => a.wait_time).length || 1)
    ),
  };

  const handleCheckIn = async (appointment: Appointment) => {
    try {
      await dispatch(checkInPatient(appointment.id)).unwrap();
      dispatch(showNotification({
        message: `${appointment.patient_name} checked in successfully`,
        severity: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to check in patient',
        severity: 'error',
      }));
    }
  };

  const handleCheckOut = async (appointment: Appointment) => {
    try {
      await dispatch(checkOutPatient(appointment.id)).unwrap();
      dispatch(showNotification({
        message: `${appointment.patient_name} checked out successfully`,
        severity: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to check out patient',
        severity: 'error',
      }));
    }
  };

  const handleStartConsultation = async (appointment: Appointment) => {
    try {
      await dispatch(updateAppointment({
        id: appointment.id,
        data: { status: 'in_progress' }
      })).unwrap();
      dispatch(showNotification({
        message: 'Consultation started',
        severity: 'info',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to start consultation',
        severity: 'error',
      }));
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  const calculateWaitTime = (appointment: Appointment) => {
    if (appointment.check_in_time && !appointment.check_out_time) {
      const checkInTime = new Date(`${appointment.appointment_date}T${appointment.check_in_time}`);
      return differenceInMinutes(new Date(), checkInTime);
    }
    return appointment.wait_time || 0;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Appointments
                  </Typography>
                  <Typography variant="h4">{queueStats.total}</Typography>
                </Box>
                <People sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Waiting
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {queueStats.waiting}
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    In Progress
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {queueStats.inProgress}
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Avg Wait Time
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {queueStats.avgWaitTime}m
                  </Typography>
                </Box>
                <Timer sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Queue Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Search by patient, appointment number, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="no_show">No Show</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* Queue List */}
      <Paper sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: 0 }}>
          {filteredQueue.map((appointment, index) => (
            <React.Fragment key={appointment.id}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  py: 2,
                  '&:hover': { bgcolor: 'action.hover' },
                  opacity: appointment.status === 'cancelled' || appointment.status === 'no_show' ? 0.6 : 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {appointment.patient_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        #{appointment.appointment_number}
                      </Typography>
                      <Chip
                        label={appointment.status.replace('_', ' ')}
                        size="small"
                        color={getStatusColor(appointment.status) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocalHospital sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {appointment.doctor_name} • {appointment.department}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {appointment.appointment_time} ({appointment.duration}min)
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {appointment.reason}
                      </Typography>
                      {appointment.check_in_time && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                          <Chip
                            icon={<Timer />}
                            label={`Checked in: ${appointment.check_in_time}`}
                            size="small"
                            variant="outlined"
                            color="success"
                          />
                          {!appointment.check_out_time && (
                            <Chip
                              label={`Waiting: ${calculateWaitTime(appointment)} min`}
                              size="small"
                              color="warning"
                            />
                          )}
                          {appointment.check_out_time && (
                            <Chip
                              icon={<TimerOff />}
                              label={`Checked out: ${appointment.check_out_time}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {appointment.status === 'scheduled' || appointment.status === 'confirmed' ? (
                      <>
                        {!appointment.check_in_time && (
                          <Tooltip title="Check In">
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handleCheckIn(appointment)}
                              startIcon={<CheckCircle />}
                            >
                              Check In
                            </Button>
                          </Tooltip>
                        )}
                        {appointment.check_in_time && (
                          <Tooltip title="Start Consultation">
                            <Button
                              size="small"
                              variant="contained"
                              color="info"
                              onClick={() => handleStartConsultation(appointment)}
                              startIcon={<Assignment />}
                            >
                              Start
                            </Button>
                          </Tooltip>
                        )}
                      </>
                    ) : appointment.status === 'in_progress' ? (
                      <Tooltip title="Complete Consultation">
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleCheckOut(appointment)}
                          startIcon={<CheckCircle />}
                        >
                          Complete
                        </Button>
                      </Tooltip>
                    ) : null}
                    
                    <IconButton
                      onClick={(e) => handleMenuClick(e, appointment)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
              {appointment.status === 'in_progress' && (
                <LinearProgress
                  variant="indeterminate"
                  sx={{ height: 2 }}
                />
              )}
            </React.Fragment>
          ))}
          
          {filteredQueue.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No appointments found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'No appointments scheduled for today'}
              </Typography>
            </Box>
          )}
        </List>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          // View details action
          handleMenuClose();
        }}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          // Edit appointment action
          handleMenuClose();
        }}>
          Edit Appointment
        </MenuItem>
        <MenuItem onClick={() => {
          // Reschedule action
          handleMenuClose();
        }}>
          Reschedule
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          // Mark as no show
          if (selectedAppointment) {
            dispatch(updateAppointment({
              id: selectedAppointment.id,
              data: { status: 'no_show' }
            }));
          }
          handleMenuClose();
        }} sx={{ color: 'error.main' }}>
          Mark as No Show
        </MenuItem>
        <MenuItem onClick={() => {
          // Cancel appointment
          if (selectedAppointment) {
            dispatch(updateAppointment({
              id: selectedAppointment.id,
              data: { status: 'cancelled' }
            }));
          }
          handleMenuClose();
        }} sx={{ color: 'error.main' }}>
          Cancel Appointment
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default QueueManagement;