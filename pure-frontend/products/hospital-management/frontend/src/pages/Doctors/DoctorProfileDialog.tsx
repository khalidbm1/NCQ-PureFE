import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Card,
  CardContent,
  Rating,
  Divider,
  LinearProgress,
  Badge,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Close,
  Edit,
  Print,
  Phone,
  Email,
  LocationOn,
  CalendarMonth,
  Schedule,
  TrendingUp,
  People,
  AttachMoney,
  School,
  Work,
  Language,
  Badge as BadgeIcon,
  LocalHospital,
  Star,
  CheckCircle,
  Cancel,
  Warning,
  AccessTime,
  EventAvailable,
  Timeline,
} from '@mui/icons-material';
import { format, differenceInYears } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { Doctor, updateDoctorAvailability } from '../../store/slices/doctorSlice';
import { showNotification } from '../../store/slices/notificationSlice';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface DoctorProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const DoctorProfileDialog: React.FC<DoctorProfileDialogProps> = ({
  open,
  onClose,
  onEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedDoctor: doctor } = useSelector((state: RootState) => state.doctors);
  const [tabValue, setTabValue] = useState(0);

  if (!doctor) return null;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleAvailability = async () => {
    try {
      await dispatch(updateDoctorAvailability({
        id: doctor.id,
        is_available: !doctor.is_available
      })).unwrap();
      dispatch(showNotification({
        message: `Dr. ${doctor.last_name} marked as ${!doctor.is_available ? 'available' : 'unavailable'}`,
        severity: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to update availability',
        severity: 'error',
      }));
    }
  };

  const getStatusColor = (): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (doctor.status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'on_leave': return 'warning';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (doctor.status) {
      case 'active': return <CheckCircle />;
      case 'on_leave': return <Warning />;
      case 'suspended': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const age = differenceInYears(new Date(), new Date(doctor.date_of_birth));
  const experience = differenceInYears(new Date(), new Date(doctor.joined_date));

  // Mock appointments data for the doctor
  const todayAppointments = [
    { time: '09:00', patient: 'John Doe', type: 'Consultation', status: 'completed' },
    { time: '09:30', patient: 'Jane Smith', type: 'Follow-up', status: 'completed' },
    { time: '10:00', patient: 'Bob Johnson', type: 'Consultation', status: 'in_progress' },
    { time: '10:30', patient: 'Alice Brown', type: 'Follow-up', status: 'scheduled' },
    { time: '11:00', patient: 'Charlie Wilson', type: 'Consultation', status: 'scheduled' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: doctor.is_available ? 'success.main' : 'error.main',
                    border: 3,
                    borderColor: 'background.paper',
                  }}
                />
              }
            >
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
                src={doctor.profile_image}
              >
                {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h4">
                {doctor.title} {doctor.first_name} {doctor.last_name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {doctor.department} • {doctor.doctor_id}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Chip
                  icon={getStatusIcon()}
                  label={doctor.status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor()}
                  size="small"
                />
                <Rating value={doctor.rating} precision={0.1} size="small" readOnly />
                <Typography variant="caption">
                  ({doctor.total_reviews} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Tooltip title="Print Profile">
              <IconButton onClick={handlePrint}>
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Profile">
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
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Overview" />
          <Tab label="Schedule & Availability" />
          <Tab label="Education & Experience" />
          <Tab label="Performance" />
          <Tab label="Today's Appointments" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><BadgeIcon color="action" /></ListItemIcon>
                    <ListItemText primary="Age" secondary={`${age} years old`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Phone color="action" /></ListItemIcon>
                    <ListItemText primary="Phone" secondary={doctor.phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Email color="action" /></ListItemIcon>
                    <ListItemText primary="Email" secondary={doctor.email} />
                  </ListItem>
                  {doctor.emergency_phone && (
                    <ListItem>
                      <ListItemIcon><Phone color="error" /></ListItemIcon>
                      <ListItemText primary="Emergency Phone" secondary={doctor.emergency_phone} />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemIcon><LocationOn color="action" /></ListItemIcon>
                    <ListItemText 
                      primary="Address" 
                      secondary={`${doctor.address}, ${doctor.city}, ${doctor.state} ${doctor.postal_code}`} 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Professional Information */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Professional Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><LocalHospital color="action" /></ListItemIcon>
                    <ListItemText primary="Department" secondary={doctor.department} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CalendarMonth color="action" /></ListItemIcon>
                    <ListItemText 
                      primary="Experience" 
                      secondary={`${experience} years (Joined ${format(new Date(doctor.joined_date), 'MMM yyyy')})`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BadgeIcon color="action" /></ListItemIcon>
                    <ListItemText 
                      primary="License" 
                      secondary={`${doctor.license_number} (Expires: ${format(new Date(doctor.license_expiry), 'MMM dd, yyyy')})`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AttachMoney color="action" /></ListItemIcon>
                    <ListItemText 
                      primary="Consultation Fees" 
                      secondary={`$${doctor.consultation_fee} / $${doctor.follow_up_fee} (follow-up)`} 
                    />
                  </ListItem>
                  {doctor.languages.length > 0 && (
                    <ListItem>
                      <ListItemIcon><Language color="action" /></ListItemIcon>
                      <ListItemText 
                        primary="Languages" 
                        secondary={
                          <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
                            {doctor.languages.map((lang, index) => (
                              <Chip key={index} label={lang} size="small" variant="outlined" />
                            ))}
                          </Box>
                        } 
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>

            {/* Specializations */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Specializations
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {doctor.specialization.map((spec, index) => (
                    <Chip 
                      key={index} 
                      label={spec} 
                      color="primary" 
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Bio */}
            {doctor.bio && (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Biography
                  </Typography>
                  <Typography variant="body1">
                    {doctor.bio}
                  </Typography>
                </Paper>
              </Grid>
            )}

            {/* Statistics Cards */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Key Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <People color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="primary">
                        {doctor.total_patients}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Patients
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <CalendarMonth color="success" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="success.main">
                        {doctor.completed_appointments}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Completed
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AttachMoney color="warning" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="warning.main">
                        ${doctor.revenue_this_month.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        This Month
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AccessTime color="info" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="info.main">
                        {doctor.average_consultation_time}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Avg Minutes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Weekly Schedule</Typography>
                <Button
                  variant={doctor.is_available ? "outlined" : "contained"}
                  color={doctor.is_available ? "error" : "success"}
                  onClick={handleToggleAvailability}
                  startIcon={doctor.is_available ? <Cancel /> : <CheckCircle />}
                >
                  Mark {doctor.is_available ? 'Unavailable' : 'Available'}
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Working Hours</TableCell>
                      <TableCell>Break Time</TableCell>
                      <TableCell>Slots</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(doctor.working_hours).map(([day, schedule]) => (
                      <TableRow key={day}>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                            {day}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={schedule.is_working ? 'Working' : 'Off'}
                            color={schedule.is_working ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {schedule.is_working ? `${schedule.start_time} - ${schedule.end_time}` : '-'}
                        </TableCell>
                        <TableCell>
                          {schedule.break_start && schedule.break_end 
                            ? `${schedule.break_start} - ${schedule.break_end}` 
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {schedule.is_working ? doctor.time_slots.length : 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Leave Periods */}
            {doctor.leave_periods.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Upcoming Leave Periods
                </Typography>
                <List>
                  {doctor.leave_periods.map((leave) => (
                    <ListItem key={leave.id} divider>
                      <ListItemText
                        primary={leave.reason}
                        secondary={`${format(new Date(leave.start_date), 'MMM dd')} - ${format(new Date(leave.end_date), 'MMM dd, yyyy')}`}
                      />
                      <Chip
                        label={leave.status}
                        color={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'error' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {/* Education */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Education
              </Typography>
              <List>
                {doctor.education.map((edu) => (
                  <ListItem key={edu.id} divider>
                    <ListItemIcon>
                      <School color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${edu.degree} - ${edu.institution}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {edu.year}
                          </Typography>
                          {edu.specialization && (
                            <Typography variant="caption" color="text.secondary">
                              Specialization: {edu.specialization}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Experience */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Professional Experience
              </Typography>
              <List>
                {doctor.experience.map((exp) => (
                  <ListItem key={exp.id} divider>
                    <ListItemIcon>
                      <Work color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${exp.position} at ${exp.hospital}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {format(new Date(exp.start_date), 'MMM yyyy')} - {
                              exp.end_date ? format(new Date(exp.end_date), 'MMM yyyy') : 'Present'
                            }
                          </Typography>
                          {exp.description && (
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {exp.description}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            {/* Performance Metrics */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Appointment Statistics
                </Typography>
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Completion Rate</Typography>
                    <Typography variant="body2">
                      {Math.round((doctor.completed_appointments / doctor.total_appointments) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(doctor.completed_appointments / doctor.total_appointments) * 100} 
                    color="success"
                  />
                </Box>
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Cancellation Rate</Typography>
                    <Typography variant="body2">
                      {Math.round((doctor.cancelled_appointments / doctor.total_appointments) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(doctor.cancelled_appointments / doctor.total_appointments) * 100}
                    color="error"
                  />
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Total Appointments" secondary={doctor.total_appointments} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Completed" secondary={doctor.completed_appointments} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Cancelled" secondary={doctor.cancelled_appointments} />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Patient Satisfaction */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Patient Satisfaction
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <Rating value={doctor.rating} precision={0.1} size="large" readOnly />
                  <Typography variant="h4" sx={{ ml: 2 }}>
                    {doctor.rating.toFixed(1)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Based on {doctor.total_reviews} patient reviews
                </Typography>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Average consultation time: {doctor.average_consultation_time} minutes
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Revenue this month: ${doctor.revenue_this_month.toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Today's Appointments
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todayAppointments.map((appointment, index) => (
                      <TableRow key={index}>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.patient}</TableCell>
                        <TableCell>
                          <Chip label={appointment.type} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.status}
                            size="small"
                            color={
                              appointment.status === 'completed' ? 'success' :
                              appointment.status === 'in_progress' ? 'warning' : 'info'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <EventAvailable />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onEdit} startIcon={<Edit />}>
          Edit Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoctorProfileDialog;