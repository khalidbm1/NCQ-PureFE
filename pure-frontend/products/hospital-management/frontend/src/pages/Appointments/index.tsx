import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Tooltip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Add,
  CalendarMonth,
  CalendarViewWeek,
  CalendarViewDay,
  ViewList,
  NavigateNext,
  NavigateBefore,
  Today,
  EventAvailable,
  EventBusy,
  Schedule,
  People,
  LocalHospital,
  AttachMoney,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths, isSameDay, isToday, isPast, isFuture } from 'date-fns';
import { AppDispatch, RootState } from '../../store';
import { setCalendarView, setSelectedDate, Appointment } from '../../store/slices/appointmentSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import AppointmentDialog from './AppointmentDialog';
import AppointmentDetailsDialog from './AppointmentDetailsDialog';
import QueueManagement from './QueueManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`appointments-tabpanel-${index}`}
      aria-labelledby={`appointments-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Appointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, calendarView, selectedDate, loading } = useSelector((state: RootState) => state.appointments);
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get unique doctors and departments from appointments
  const doctors = Array.from(new Set(appointments.map(a => a.doctor_name))).sort();
  const departments = Array.from(new Set(appointments.map(a => a.department))).sort();

  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter(appointment => {
    if (selectedDoctor !== 'all' && appointment.doctor_name !== selectedDoctor) return false;
    if (selectedDepartment !== 'all' && appointment.department !== selectedDepartment) return false;
    return true;
  });

  // Get appointments for the current view
  const getViewAppointments = () => {
    let startDate: Date;
    let endDate: Date;

    switch (calendarView) {
      case 'day':
        startDate = new Date(currentDate);
        endDate = new Date(currentDate);
        break;
      case 'week':
        startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
        endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
        break;
      case 'month':
      default:
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
        break;
    }

    return filteredAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointment_date);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
  };

  // Statistics
  const todayAppointments = filteredAppointments.filter(a => 
    isSameDay(new Date(a.appointment_date), new Date())
  );
  
  const upcomingAppointments = filteredAppointments.filter(a => 
    isFuture(new Date(a.appointment_date)) && a.status !== 'cancelled'
  );

  const completedToday = todayAppointments.filter(a => a.status === 'completed').length;
  const pendingToday = todayAppointments.filter(a => ['scheduled', 'confirmed'].includes(a.status)).length;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: 'month' | 'week' | 'day' | null) => {
    if (newView !== null) {
      dispatch(setCalendarView(newView));
    }
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    switch (calendarView) {
      case 'day':
        setCurrentDate(direction === 'prev' ? addDays(currentDate, -1) : addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(direction === 'prev' ? addWeeks(currentDate, -1) : addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(direction === 'prev' ? addMonths(currentDate, -1) : addMonths(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleCreateAppointment = () => {
    setSelectedAppointment(null);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenDetailsDialog(true);
  };

  const getDateRangeText = () => {
    switch (calendarView) {
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'scheduled': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      case 'no_show': return 'error';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <LocalHospital fontSize="small" />;
      case 'follow_up': return <EventAvailable fontSize="small" />;
      case 'procedure': return <Schedule fontSize="small" />;
      case 'emergency': return <EventBusy fontSize="small" />;
      default: return <EventAvailable fontSize="small" />;
    }
  };

  // Calendar view component
  const CalendarView = () => {
    const viewAppointments = getViewAppointments();

    if (calendarView === 'month') {
      return <MonthView appointments={viewAppointments} currentDate={currentDate} />;
    } else if (calendarView === 'week') {
      return <WeekView appointments={viewAppointments} currentDate={currentDate} />;
    } else {
      return <DayView appointments={viewAppointments} currentDate={currentDate} />;
    }
  };

  // Month view component
  const MonthView = ({ appointments, currentDate }: { appointments: Appointment[], currentDate: Date }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const weeks = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dayAppointments = appointments.filter(a => 
          isSameDay(new Date(a.appointment_date), day)
        );
        const currentDay = new Date(day); // Create a copy for closure

        days.push(
          <Grid item xs key={day.toString()}>
            <Paper
              sx={{
                p: 1,
                minHeight: 100,
                bgcolor: !isSameDay(currentDay, monthStart) && !isSameDay(currentDay, monthEnd) && 
                        (currentDay < monthStart || currentDay > monthEnd) ? 'grey.50' : 'background.paper',
                border: isToday(currentDay) ? 2 : 1,
                borderColor: isToday(currentDay) ? 'primary.main' : 'divider',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={() => {
                setCurrentDate(currentDay);
                dispatch(setCalendarView('day'));
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography 
                  variant="caption" 
                  fontWeight={isToday(currentDay) ? 'bold' : 'normal'}
                  color={isToday(currentDay) ? 'primary' : 'text.secondary'}
                >
                  {format(currentDay, 'd')}
                </Typography>
                {dayAppointments.length > 0 && (
                  <Chip label={dayAppointments.length} size="small" color="primary" />
                )}
              </Box>
              <Box sx={{ overflow: 'hidden', maxHeight: 60 }}>
                {dayAppointments.slice(0, 3).map((apt, index) => (
                  <Box
                    key={apt.id}
                    sx={{
                      fontSize: '0.7rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: apt.status === 'cancelled' ? 'text.disabled' : 'text.primary',
                      mb: 0.25,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAppointment(apt);
                    }}
                  >
                    <Chip
                      label={`${apt.appointment_time} ${apt.patient_name.split(' ')[1]}`}
                      size="small"
                      color={getStatusColor(apt.status)}
                      sx={{ fontSize: '0.65rem', height: 16 }}
                    />
                  </Box>
                ))}
                {dayAppointments.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    +{dayAppointments.length - 3} more
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        );
        day = addDays(day, 1);
      }
      weeks.push(
        <Grid container spacing={1} key={day.toString()}>
          {days}
        </Grid>
      );
      days = [];
    }

    return (
      <Box>
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(dayName => (
            <Grid item xs key={dayName}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" align="center" display="block">
                {dayName}
              </Typography>
            </Grid>
          ))}
        </Grid>
        {weeks}
      </Box>
    );
  };

  // Week view component
  const WeekView = ({ appointments, currentDate }: { appointments: Appointment[], currentDate: Date }) => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 10 }, (_, i) => i + 9); // 9 AM to 6 PM

    return (
      <Box>
        <Grid container>
          <Grid item xs={1}>
            {/* Time column */}
            <Box sx={{ height: 50 }} /> {/* Header spacer */}
            {hours.map(hour => (
              <Box key={hour} sx={{ height: 60, borderTop: 1, borderColor: 'divider', pt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date().setHours(hour, 0), 'h a')}
                </Typography>
              </Box>
            ))}
          </Grid>
          {days.map(day => (
            <Grid item xs key={day.toString()}>
              <Box sx={{ borderLeft: 1, borderColor: 'divider', height: '100%' }}>
                <Box
                  sx={{
                    height: 50,
                    bgcolor: isToday(day) ? 'primary.light' : 'grey.100',
                    p: 1,
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    {format(day, 'EEE d')}
                  </Typography>
                </Box>
                <Box position="relative" sx={{ height: hours.length * 60 }}>
                  {appointments
                    .filter(apt => isSameDay(new Date(apt.appointment_date), day))
                    .map(apt => {
                      const hour = parseInt(apt.appointment_time.split(':')[0]);
                      const minute = parseInt(apt.appointment_time.split(':')[1]);
                      const top = (hour - 9) * 60 + minute;
                      
                      return (
                        <Box
                          key={apt.id}
                          position="absolute"
                          top={top}
                          left={4}
                          right={4}
                          sx={{
                            bgcolor: apt.status === 'cancelled' ? 'grey.300' : 'primary.main',
                            color: 'white',
                            p: 0.5,
                            borderRadius: 1,
                            height: (apt.duration / 60) * 60 - 4,
                            cursor: 'pointer',
                            overflow: 'hidden',
                            '&:hover': { opacity: 0.9 },
                          }}
                          onClick={() => handleViewAppointment(apt)}
                        >
                          <Typography variant="caption" fontWeight="bold">
                            {apt.appointment_time}
                          </Typography>
                          <Typography variant="caption" display="block" noWrap>
                            {apt.patient_name}
                          </Typography>
                        </Box>
                      );
                    })}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Day view component
  const DayView = ({ appointments, currentDate }: { appointments: Appointment[], currentDate: Date }) => {
    const dayAppointments = appointments
      .filter(apt => isSameDay(new Date(apt.appointment_date), currentDate))
      .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));

    return (
      <Box>
        {dayAppointments.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <EventBusy sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No appointments scheduled for this day
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ mt: 2 }}
              onClick={handleCreateAppointment}
            >
              Book Appointment
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {dayAppointments.map(appointment => (
              <Grid item xs={12} key={appointment.id}>
                <Paper sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box display="flex" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {appointment.patient_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {appointment.patient_name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Chip
                            icon={getTypeIcon(appointment.type)}
                            label={appointment.type}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={appointment.status}
                            size="small"
                            color={getStatusColor(appointment.status)}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {appointment.appointment_time} - {appointment.duration} min
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {appointment.reason}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="caption">
                            <strong>Doctor:</strong> {appointment.doctor_name}
                          </Typography>
                          <Typography variant="caption">
                            <strong>Dept:</strong> {appointment.department}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                      <Typography variant="caption" color="text.secondary">
                        #{appointment.appointment_number}
                      </Typography>
                      <Box>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          sx={{ mr: 1 }}
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => {
                            dispatch(showNotification({
                              message: 'Cancel appointment functionality to be implemented',
                              severity: 'info',
                            }));
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Appointments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage patient appointments and schedules
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateAppointment}
        >
          New Appointment
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Today's Total
                  </Typography>
                  <Typography variant="h4">
                    {todayAppointments.length}
                  </Typography>
                </Box>
                <CalendarMonth color="primary" sx={{ fontSize: 40 }} />
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
                    Completed Today
                  </Typography>
                  <Typography variant="h4">
                    {completedToday}
                  </Typography>
                </Box>
                <EventAvailable color="success" sx={{ fontSize: 40 }} />
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
                    Pending Today
                  </Typography>
                  <Typography variant="h4">
                    {pendingToday}
                  </Typography>
                </Box>
                <Schedule color="warning" sx={{ fontSize: 40 }} />
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
                    Upcoming
                  </Typography>
                  <Typography variant="h4">
                    {upcomingAppointments.length}
                  </Typography>
                </Box>
                <EventAvailable color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Calendar View" />
          <Tab label="List View" />
          <Tab label="Today's Queue" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {/* Calendar Controls */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <ToggleButtonGroup
                value={calendarView}
                exclusive
                onChange={handleViewChange}
                size="small"
              >
                <ToggleButton value="month">
                  <CalendarMonth />
                </ToggleButton>
                <ToggleButton value="week">
                  <CalendarViewWeek />
                </ToggleButton>
                <ToggleButton value="day">
                  <CalendarViewDay />
                </ToggleButton>
              </ToggleButtonGroup>

              <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={() => handleNavigate('prev')}>
                  <NavigateBefore />
                </IconButton>
                <Button onClick={handleToday}>Today</Button>
                <IconButton onClick={() => handleNavigate('next')}>
                  <NavigateNext />
                </IconButton>
              </Box>

              <Typography variant="h6">
                {getDateRangeText()}
              </Typography>
            </Box>

            <Box display="flex" gap={2}>
              <TextField
                select
                size="small"
                label="Doctor"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Doctors</MenuItem>
                {doctors.map(doctor => (
                  <MenuItem key={doctor} value={doctor}>{doctor}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label="Department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Departments</MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </Paper>

        {/* Calendar View */}
        <Paper sx={{ p: 2 }}>
          <CalendarView />
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* List View - To be implemented */}
        <Typography>List view of appointments - Coming soon</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Today's Queue */}
        <QueueManagement />
      </TabPanel>

      {/* Appointment Dialog */}
      <AppointmentDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        appointment={selectedAppointment}
        editMode={editMode}
        onSuccess={() => {
          setOpenDialog(false);
          // Refresh appointments if needed
        }}
      />

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <AppointmentDetailsDialog
          open={openDetailsDialog}
          onClose={() => setOpenDetailsDialog(false)}
          appointment={selectedAppointment}
          onEdit={() => {
            setOpenDetailsDialog(false);
            handleEditAppointment(selectedAppointment);
          }}
        />
      )}
    </Box>
  );
};

export default Appointments;