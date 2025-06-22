import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Rating,
  Chip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  LocalHospital,
  TrendingUp,
  Star,
  People,
  AttachMoney,
  Assessment,
} from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DoctorPerformance: React.FC = () => {
  const { reportData } = useSelector((state: RootState) => state.reports);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'revenue' | 'patients' | 'rating'>('revenue');

  if (!reportData) return null;

  const doctorData = reportData.doctors;

  // Sort doctor performance data
  const sortedDoctorPerformance = [...doctorData.doctorPerformance].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.revenue_generated - a.revenue_generated;
      case 'patients':
        return b.patients_seen - a.patients_seen;
      case 'rating':
        return b.average_rating - a.average_rating;
      default:
        return 0;
    }
  });

  // Prepare radar chart data for selected doctor
  const getRadarData = (doctorId: string) => {
    const doctor = doctorData.doctorPerformance.find(d => d.doctor_id === doctorId);
    if (!doctor) return [];

    const maxPatients = Math.max(...doctorData.doctorPerformance.map(d => d.patients_seen));
    const maxRevenue = Math.max(...doctorData.doctorPerformance.map(d => d.revenue_generated));
    const maxAppointments = Math.max(...doctorData.doctorPerformance.map(d => d.appointments_completed));

    return [
      {
        metric: 'Patients',
        value: (doctor.patients_seen / maxPatients) * 100,
        fullMark: 100,
      },
      {
        metric: 'Revenue',
        value: (doctor.revenue_generated / maxRevenue) * 100,
        fullMark: 100,
      },
      {
        metric: 'Rating',
        value: (doctor.average_rating / 5) * 100,
        fullMark: 100,
      },
      {
        metric: 'Appointments',
        value: (doctor.appointments_completed / maxAppointments) * 100,
        fullMark: 100,
      },
      {
        metric: 'Efficiency',
        value: 85, // Mock data
        fullMark: 100,
      },
    ];
  };

  // Calculate total metrics
  const totalRevenue = doctorData.doctorPerformance.reduce((sum, d) => sum + d.revenue_generated, 0);
  const totalPatients = doctorData.doctorPerformance.reduce((sum, d) => sum + d.patients_seen, 0);
  const averageRating = doctorData.doctorPerformance.reduce((sum, d) => sum + d.average_rating, 0) / doctorData.doctorPerformance.length;

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
                    Total Doctors
                  </Typography>
                  <Typography variant="h4">
                    {doctorData.totalDoctors}
                  </Typography>
                </Box>
                <LocalHospital fontSize="large" color="primary" />
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
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ${totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <AttachMoney fontSize="large" color="success" />
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
                    Patients Seen
                  </Typography>
                  <Typography variant="h4">
                    {totalPatients.toLocaleString()}
                  </Typography>
                </Box>
                <People fontSize="large" color="info" />
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
                    Average Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4">
                      {averageRating.toFixed(1)}
                    </Typography>
                    <Star fontSize="large" sx={{ color: '#FFB400' }} />
                  </Box>
                </Box>
                <Assessment fontSize="large" color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Doctors by Specialization */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Doctors by Specialization</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={doctorData.doctorsBySpecialization}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.specialization}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {doctorData.doctorsBySpecialization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Doctor Performance Radar */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Performance Analysis</Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  label="Select Doctor"
                >
                  <MenuItem value="all">All Doctors</MenuItem>
                  {doctorData.doctorPerformance.map(doctor => (
                    <MenuItem key={doctor.doctor_id} value={doctor.doctor_id}>
                      {doctor.doctor_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {selectedDoctor !== 'all' && (
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={getRadarData(selectedDoctor)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            )}
            {selectedDoctor === 'all' && (
              <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Select a doctor to view performance analysis</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Performance Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Doctor Performance Rankings</Typography>
              <FormControl size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  label="Sort By"
                >
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="patients">Patients</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell align="right">Patients Seen</TableCell>
                    <TableCell align="right">Revenue Generated</TableCell>
                    <TableCell align="right">Appointments</TableCell>
                    <TableCell align="center">Rating</TableCell>
                    <TableCell>Performance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedDoctorPerformance.map((doctor, index) => {
                    const performanceScore = (
                      (doctor.patients_seen / totalPatients) * 0.3 +
                      (doctor.revenue_generated / totalRevenue) * 0.4 +
                      (doctor.average_rating / 5) * 0.3
                    ) * 100;

                    return (
                      <TableRow key={doctor.doctor_id} hover>
                        <TableCell>
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            color={index < 3 ? 'primary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                              {doctor.doctor_name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">{doctor.doctor_name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{doctor.patients_seen.toLocaleString()}</TableCell>
                        <TableCell align="right">${doctor.revenue_generated.toLocaleString()}</TableCell>
                        <TableCell align="right">{doctor.appointments_completed}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Rating value={doctor.average_rating} readOnly size="small" />
                            <Typography variant="body2">{doctor.average_rating.toFixed(1)}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={performanceScore}
                              sx={{ flex: 1, height: 8, borderRadius: 4 }}
                              color={performanceScore > 70 ? 'success' : performanceScore > 40 ? 'warning' : 'error'}
                            />
                            <Typography variant="body2" sx={{ minWidth: 40 }}>
                              {performanceScore.toFixed(0)}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Busy Doctors Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Busiest Doctors (Today)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={doctorData.busyDoctors}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="doctor" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorPerformance;