import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Paper,
  Tabs,
  Tab,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  Language,
  Star,
  Edit,
  Schedule,
  CalendarMonth,
  AttachMoney,
  People,
  TrendingUp,
  CheckCircle,
  Cancel,
  Warning,
  MedicalServices,
  LocalHospital,
  EmojiEvents,
  Download,
  Print,
} from '@mui/icons-material';
import { Doctor } from '../../store/slices/doctorSlice';
import { format } from 'date-fns';

interface DoctorProfileProps {
  doctor: Doctor;
  onEdit: () => void;
  onScheduleEdit: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctor, onEdit, onScheduleEdit }) => {
  const [tabValue, setTabValue] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'on_leave': return 'warning';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getAvailabilityIcon = () => {
    if (doctor.status === 'active' && doctor.is_available) {
      return <CheckCircle color="success" />;
    } else if (doctor.status === 'on_leave') {
      return <Warning color="warning" />;
    } else {
      return <Cancel color="error" />;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getExperienceYears = () => {
    if (!doctor.experience || doctor.experience.length === 0) return 0;
    
    const earliestExperience = doctor.experience.reduce((earliest, exp) => {
      const expDate = new Date(exp.start_date);
      return expDate < new Date(earliest.start_date) ? exp : earliest;
    });
    
    const startDate = new Date(earliestExperience.start_date);
    const endDate = new Date();
    return Math.floor((endDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <Box>
      {/* Header Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
              <Avatar
                src={doctor.profile_image}
                sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
              >
                {doctor.first_name[0]}{doctor.last_name[0]}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {doctor.title} {doctor.first_name} {doctor.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {doctor.doctor_id}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Chip
                  label={doctor.status}
                  color={getStatusColor(doctor.status) as any}
                  size="small"
                  icon={getAvailabilityIcon()}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Rating value={doctor.rating} readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({doctor.total_reviews})
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button variant="contained" startIcon={<Edit />} onClick={onEdit}>
                  Edit Profile
                </Button>
                <Button variant="outlined" startIcon={<Schedule />} onClick={onScheduleEdit}>
                  Schedule
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                {/* Basic Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Basic Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><LocalHospital /></ListItemIcon>
                      <ListItemText
                        primary="Department"
                        secondary={doctor.department}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><MedicalServices /></ListItemIcon>
                      <ListItemText
                        primary="Specialization"
                        secondary={doctor.specialization.join(', ')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><EmojiEvents /></ListItemIcon>
                      <ListItemText
                        primary="Experience"
                        secondary={`${getExperienceYears()} years`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Language /></ListItemIcon>
                      <ListItemText
                        primary="Languages"
                        secondary={doctor.languages.join(', ')}
                      />
                    </ListItem>
                  </List>
                </Grid>

                {/* Contact Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contact Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Email /></ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={doctor.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Phone /></ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={doctor.phone}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Phone /></ListItemIcon>
                      <ListItemText
                        primary="Emergency"
                        secondary={doctor.emergency_phone || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><LocationOn /></ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary={`${doctor.address}, ${doctor.city}, ${doctor.state} ${doctor.postal_code}`}
                      />
                    </ListItem>
                  </List>
                </Grid>

                {/* Stats */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Performance Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <People color="primary" />
                        <Typography variant="h6">{doctor.total_patients}</Typography>
                        <Typography variant="caption">Total Patients</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <CalendarMonth color="info" />
                        <Typography variant="h6">{doctor.total_appointments}</Typography>
                        <Typography variant="caption">Appointments</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <TrendingUp color="success" />
                        <Typography variant="h6">
                          {Math.round((doctor.completed_appointments / doctor.total_appointments) * 100)}%
                        </Typography>
                        <Typography variant="caption">Completion Rate</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <AttachMoney color="warning" />
                        <Typography variant="h6">${doctor.revenue_this_month}</Typography>
                        <Typography variant="caption">This Month</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="About" />
            <Tab label="Education" />
            <Tab label="Experience" />
            <Tab label="Schedule" />
            <Tab label="Fees" />
            <Tab label="Leave History" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>About</Typography>
            <Typography variant="body1" paragraph>
              {doctor.bio || 'No bio available'}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Age</Typography>
                <Typography variant="body1">{calculateAge(doctor.date_of_birth)} years</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Gender</Typography>
                <Typography variant="body1">{doctor.gender}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">License Number</Typography>
                <Typography variant="body1">{doctor.license_number}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">License Expiry</Typography>
                <Typography variant="body1">
                  {format(new Date(doctor.license_expiry), 'MMM dd, yyyy')}
                </Typography>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>Education</Typography>
            <List>
              {doctor.education.map((edu) => (
                <ListItem key={edu.id}>
                  <ListItemIcon>
                    <School color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${edu.degree} ${edu.specialization ? `in ${edu.specialization}` : ''}`}
                    secondary={`${edu.institution} - ${edu.year}`}
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Experience</Typography>
            <List>
              {doctor.experience.map((exp) => (
                <ListItem key={exp.id} alignItems="flex-start">
                  <ListItemIcon>
                    <Work color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={exp.position}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {exp.hospital}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(exp.start_date), 'MMM yyyy')} - 
                          {exp.end_date ? format(new Date(exp.end_date), 'MMM yyyy') : 'Present'}
                        </Typography>
                        <Typography variant="body2">
                          {exp.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>Working Hours</Typography>
            <Grid container spacing={2}>
              {Object.entries(doctor.working_hours).map(([day, schedule]) => (
                <Grid item xs={12} sm={6} md={4} key={day}>
                  <Paper sx={{ p: 2, bgcolor: schedule.is_working ? 'background.paper' : 'grey.100' }}>
                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                      {day}
                    </Typography>
                    {schedule.is_working ? (
                      <>
                        <Typography variant="body2">
                          {schedule.start_time} - {schedule.end_time}
                        </Typography>
                        {schedule.break_start && (
                          <Typography variant="caption" color="text.secondary">
                            Break: {schedule.break_start} - {schedule.break_end}
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Day Off
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Time Slots</Typography>
            <Grid container spacing={1}>
              {doctor.time_slots.map((slot) => (
                <Grid item key={slot.id}>
                  <Chip
                    label={`${slot.start_time} - ${slot.end_time} (${slot.max_patients} patients)`}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>Consultation Fees</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <AttachMoney sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4">${doctor.consultation_fee}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Consultation Fee
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <AttachMoney sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h4">${doctor.follow_up_fee}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Follow-up Fee
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Average consultation time: {doctor.average_consultation_time} minutes
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            <Typography variant="h6" gutterBottom>Leave History</Typography>
            {doctor.leave_periods.length > 0 ? (
              <List>
                {doctor.leave_periods.map((leave) => (
                  <ListItem key={leave.id}>
                    <ListItemText
                      primary={`${format(new Date(leave.start_date), 'MMM dd, yyyy')} - ${format(new Date(leave.end_date), 'MMM dd, yyyy')}`}
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} - {leave.reason}
                          </Typography>
                          <Chip
                            label={leave.status}
                            size="small"
                            color={
                              leave.status === 'approved' ? 'success' :
                              leave.status === 'rejected' ? 'error' : 'default'
                            }
                            sx={{ ml: 1 }}
                          />
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No leave history
              </Typography>
            )}
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DoctorProfile;