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
} from '@mui/material';
import {
  Add,
  CalendarMonth,
  EventAvailable,
  Schedule,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { Appointment, updateTodayQueue } from '../store/slices/appointmentSlice';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import AppointmentDialog from '../components/appointments/AppointmentDialog';
import AppointmentList from '../components/appointments/AppointmentList';
import QueueManagement from '../components/appointments/QueueManagement';

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
  const { appointments, calendarView, selectedDate, todayQueue } = useSelector(
    (state: RootState) => state.appointments
  );
  
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [defaultSlotStart, setDefaultSlotStart] = useState<Date | undefined>();
  const [defaultSlotEnd, setDefaultSlotEnd] = useState<Date | undefined>();

  useEffect(() => {
    // Update today's queue when component mounts
    dispatch(updateTodayQueue());
  }, [dispatch]);

  // Statistics
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointment_date === today);
  const upcomingAppointments = appointments.filter(a => 
    a.appointment_date > today && a.status !== 'cancelled'
  );
  const completedToday = todayAppointments.filter(a => a.status === 'completed').length;
  const pendingToday = todayAppointments.filter(a => 
    ['scheduled', 'confirmed'].includes(a.status)
  ).length;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setDefaultSlotStart(undefined);
    setDefaultSlotEnd(undefined);
    setOpenDialog(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleSelectSlot = (start: Date, end: Date) => {
    setSelectedAppointment(null);
    setDefaultSlotStart(start);
    setDefaultSlotEnd(end);
    setOpenDialog(true);
  };

  const handleSelectAppointment = (appointment: Appointment) => {
    handleEditAppointment(appointment);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setDefaultSlotStart(undefined);
    setDefaultSlotEnd(undefined);
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
          onClick={handleNewAppointment}
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
                  <Typography variant="h4" color="success.main">
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
                  <Typography variant="h4" color="warning.main">
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
                  <Typography variant="h4" color="info.main">
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
        <AppointmentCalendar
          onSelectSlot={handleSelectSlot}
          onSelectAppointment={handleSelectAppointment}
          view={calendarView}
          selectedDate={new Date(selectedDate)}
          onViewChange={(view) => {}}
          onDateChange={(date) => {}}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <AppointmentList
          onEdit={handleEditAppointment}
          showPagination={true}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <QueueManagement />
      </TabPanel>

      {/* Appointment Dialog */}
      <AppointmentDialog
        open={openDialog}
        onClose={handleCloseDialog}
        appointment={selectedAppointment}
        defaultDate={defaultSlotStart}
        defaultTime={defaultSlotStart}
      />
    </Box>
  );
};

export default Appointments;