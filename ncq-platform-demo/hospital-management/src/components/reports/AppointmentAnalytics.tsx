import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  EventNote,
  CheckCircle,
  Cancel,
  PersonOff,
  AccessTime,
  TrendingUp,
  LocalHospital,
} from '@mui/icons-material';

const COLORS = ['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0', '#00BCD4'];

const AppointmentAnalytics: React.FC = () => {
  const { reportData } = useSelector((state: RootState) => state.reports);

  if (!reportData) return null;

  const appointmentData = reportData.appointments;

  // Calculate completion rate
  const completionRate = (appointmentData.completedAppointments / appointmentData.totalAppointments) * 100;
  const cancellationRate = (appointmentData.cancelledAppointments / appointmentData.totalAppointments) * 100;
  const noShowRate = (appointmentData.noShowAppointments / appointmentData.totalAppointments) * 100;

  // Prepare data for radial chart
  const performanceData = [
    {
      name: 'Completion Rate',
      value: completionRate,
      fill: '#4CAF50',
    },
    {
      name: 'Show Rate',
      value: 100 - noShowRate,
      fill: '#2196F3',
    },
    {
      name: 'On-Time Rate',
      value: 85, // Mock data
      fill: '#FF9800',
    },
  ];

  // Format peak hours data
  const peakHoursData = appointmentData.peakHours.map(item => ({
    ...item,
    time: `${item.hour}:00`,
  }));

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="overline">
                    Total Appointments
                  </Typography>
                  <Typography variant="h4">
                    {appointmentData.totalAppointments.toLocaleString()}
                  </Typography>
                </Box>
                <EventNote fontSize="large" color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="overline">
                    Completion Rate
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {completionRate.toFixed(1)}%
                  </Typography>
                </Box>
                <CheckCircle fontSize="large" color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="overline">
                    Avg Wait Time
                  </Typography>
                  <Typography variant="h4">
                    {appointmentData.averageWaitTime} min
                  </Typography>
                </Box>
                <AccessTime fontSize="large" color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="overline">
                    No-Show Rate
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {noShowRate.toFixed(1)}%
                  </Typography>
                </Box>
                <PersonOff fontSize="large" color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Appointment Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Appointment Status Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentData.appointmentsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.status}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {appointmentData.appointmentsByStatus.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.status === 'Completed' ? '#4CAF50' :
                        entry.status === 'Cancelled' ? '#FF9800' :
                        '#F44336'
                      } 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="10%" 
                outerRadius="80%" 
                barSize={10} 
                data={performanceData}
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  clockWise
                  dataKey="value"
                />
                <Legend 
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Appointments by Department */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Appointments by Department</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={appointmentData.appointmentsByDepartment}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="department" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {appointmentData.appointmentsByDepartment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Doctors */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Top Doctors by Appointments</Typography>
            <List>
              {appointmentData.appointmentsByDoctor.slice(0, 5).map((doctor, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                      <LocalHospital />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={doctor.doctor}
                    secondary={`${doctor.count} appointments`}
                  />
                  <Chip
                    label={`#${index + 1}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Peak Hours Analysis */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Peak Hours Analysis</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={peakHoursData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#ff7300" 
                  strokeWidth={3}
                  dot={{ fill: '#ff7300', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<TrendingUp />} 
                label={`Peak Hour: ${peakHoursData.reduce((max, curr) => curr.count > max.count ? curr : max, peakHoursData[0]).time}`}
                color="primary"
              />
              <Chip 
                label={`Average Wait Time: ${appointmentData.averageWaitTime} minutes`}
                color="warning"
              />
              <Chip 
                label={`Busiest Day: Tuesday`} // Mock data
                color="secondary"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentAnalytics;