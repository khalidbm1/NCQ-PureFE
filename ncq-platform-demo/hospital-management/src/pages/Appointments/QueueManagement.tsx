import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  TextField,
  MenuItem,
  Badge,
  Tooltip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  HourglassEmpty,
  People,
  Timer,
  TrendingUp,
  Login,
  Logout,
  Visibility,
  NotificationsActive,
  AccessTime,
  LocalHospital,
  PersonAdd,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { format, differenceInMinutes } from 'date-fns';
import { RootState, AppDispatch } from '../../store';
import { updateTodayQueue, checkInPatient, checkOutPatient, Appointment } from '../../store/slices/appointmentSlice';
import { showNotification } from '../../store/slices/notificationSlice';

const QueueManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todayQueue } = useSelector((state: RootState) => state.appointments);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');

  // Update queue every minute
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updateTodayQueue());
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Get unique departments and doctors
  const departments = Array.from(new Set(todayQueue.map(a => a.department))).sort();
  const doctors = Array.from(new Set(todayQueue.map(a => a.doctor_name))).sort();

  // Filter queue based on selections
  const filteredQueue = todayQueue.filter(appointment => {
    if (selectedDepartment !== 'all' && appointment.department !== selectedDepartment) return false;
    if (selectedDoctor !== 'all' && appointment.doctor_name !== selectedDoctor) return false;
    return true;
  });

  // Categorize appointments
  const waitingPatients = filteredQueue.filter(a => 
    a.status === 'confirmed' || (a.status === 'scheduled' && a.check_in_time)
  );
  const inProgressPatients = filteredQueue.filter(a => a.status === 'in_progress');
  const completedPatients = filteredQueue.filter(a => a.status === 'completed');
  const notArrivedPatients = filteredQueue.filter(a => 
    a.status === 'scheduled' && !a.check_in_time
  );

  // Calculate statistics
  const averageWaitTime = waitingPatients.reduce((acc, apt) => {
    if (apt.check_in_time) {
      const checkInTime = new Date(`${apt.appointment_date}T${apt.check_in_time}`);
      const waitMinutes = differenceInMinutes(new Date(), checkInTime);
      return acc + waitMinutes;
    }
    return acc;
  }, 0) / (waitingPatients.length || 1);

  const handleCheckIn = async (appointment: Appointment) => {
    try {
      await dispatch(checkInPatient(appointment.id)).unwrap();
      dispatch(showNotification({
        message: `${appointment.patient_name} checked in successfully`,
        severity: 'success',
      }));
      dispatch(updateTodayQueue());
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
      dispatch(updateTodayQueue());
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to check out patient',
        severity: 'error',
      }));
    }
  };

  const handleCallPatient = (appointment: Appointment) => {
    dispatch(showNotification({
      message: `Calling ${appointment.patient_name} to consultation room`,
      severity: 'info',
    }));
  };

  const getWaitTimeColor = (minutes: number) => {
    if (minutes < 15) return 'success';
    if (minutes < 30) return 'warning';
    return 'error';
  };

  const QueueCard = ({ appointment, showActions = true }: { appointment: Appointment; showActions?: boolean }) => {
    const waitMinutes = appointment.check_in_time
      ? differenceInMinutes(new Date(), new Date(`${appointment.appointment_date}T${appointment.check_in_time}`))
      : 0;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <Box display="flex" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                {appointment.patient_name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {appointment.patient_name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Chip
                    icon={<AccessTime />}
                    label={appointment.appointment_time}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={appointment.type}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {appointment.check_in_time && (
                    <Chip
                      icon={<Timer />}
                      label={`${waitMinutes} min wait`}
                      size="small"
                      color={getWaitTimeColor(waitMinutes)}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {appointment.doctor_name} • {appointment.department}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Reason: {appointment.reason}
                </Typography>
              </Box>
            </Box>
            {showActions && (
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="caption" color="text.secondary" align="right">
                  #{appointment.appointment_number}
                </Typography>
                <Box display="flex" gap={1}>
                  {appointment.status === 'scheduled' && !appointment.check_in_time && (
                    <Tooltip title="Check In">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleCheckIn(appointment)}
                      >
                        <Login />
                      </IconButton>
                    </Tooltip>
                  )}
                  {appointment.check_in_time && appointment.status !== 'in_progress' && (
                    <Tooltip title="Call Patient">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleCallPatient(appointment)}
                      >
                        <NotificationsActive />
                      </IconButton>
                    </Tooltip>
                  )}
                  {appointment.status === 'in_progress' && (
                    <Tooltip title="Check Out">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleCheckOut(appointment)}
                      >
                        <Logout />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Statistics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Not Arrived
                  </Typography>
                  <Typography variant="h4">
                    {notArrivedPatients.length}
                  </Typography>
                </Box>
                <PersonAdd color="action" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    In Waiting
                  </Typography>
                  <Typography variant="h4">
                    {waitingPatients.length}
                  </Typography>
                </Box>
                <HourglassEmpty color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    In Progress
                  </Typography>
                  <Typography variant="h4">
                    {inProgressPatients.length}
                  </Typography>
                </Box>
                <LocalHospital color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg Wait Time
                  </Typography>
                  <Typography variant="h4">
                    {Math.round(averageWaitTime)} min
                  </Typography>
                </Box>
                <Timer color={averageWaitTime > 30 ? 'error' : 'success'} sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            select
            size="small"
            label="Department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Departments</MenuItem>
            {departments.map(dept => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            size="small"
            label="Doctor"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Doctors</MenuItem>
            {doctors.map(doctor => (
              <MenuItem key={doctor} value={doctor}>{doctor}</MenuItem>
            ))}
          </TextField>

          <Box flexGrow={1} />

          <Button
            variant="outlined"
            startIcon={<TrendingUp />}
            onClick={() => dispatch(updateTodayQueue())}
          >
            Refresh Queue
          </Button>
        </Box>
      </Paper>

      {/* Queue Sections */}
      <Grid container spacing={3}>
        {/* Not Arrived */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Not Arrived</Typography>
              <Badge badgeContent={notArrivedPatients.length} color="default">
                <PersonAdd />
              </Badge>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {notArrivedPatients.length === 0 ? (
              <Alert severity="info">All scheduled patients have arrived</Alert>
            ) : (
              <Box>
                {notArrivedPatients.map(appointment => (
                  <QueueCard key={appointment.id} appointment={appointment} />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Waiting */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Waiting Room</Typography>
              <Badge badgeContent={waitingPatients.length} color="warning">
                <HourglassEmpty />
              </Badge>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {waitingPatients.length === 0 ? (
              <Alert severity="info">No patients in waiting room</Alert>
            ) : (
              <Box>
                {waitingPatients
                  .sort((a, b) => (a.check_in_time || '').localeCompare(b.check_in_time || ''))
                  .map(appointment => (
                    <QueueCard key={appointment.id} appointment={appointment} />
                  ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* In Progress */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">In Consultation</Typography>
              <Badge badgeContent={inProgressPatients.length} color="info">
                <LocalHospital />
              </Badge>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {inProgressPatients.length === 0 ? (
              <Alert severity="info">No active consultations</Alert>
            ) : (
              <Box>
                {inProgressPatients.map(appointment => (
                  <QueueCard key={appointment.id} appointment={appointment} />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Completed */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Completed Today</Typography>
              <Badge badgeContent={completedPatients.length} color="success">
                <CheckCircle />
              </Badge>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {completedPatients.length === 0 ? (
              <Alert severity="info">No completed appointments yet</Alert>
            ) : (
              <Box>
                {completedPatients
                  .slice(0, 5)
                  .map(appointment => (
                    <QueueCard key={appointment.id} appointment={appointment} showActions={false} />
                  ))}
                {completedPatients.length > 5 && (
                  <Typography variant="caption" color="text.secondary" align="center" display="block">
                    +{completedPatients.length - 5} more completed
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QueueManagement;