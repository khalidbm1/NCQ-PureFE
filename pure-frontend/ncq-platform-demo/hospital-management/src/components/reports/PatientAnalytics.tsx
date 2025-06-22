import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { People, TrendingUp, Cake, LocalHospital } from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PatientAnalytics: React.FC = () => {
  const { reportData } = useSelector((state: RootState) => state.reports);

  if (!reportData) return null;

  const patientData = reportData.patients;

  // Calculate growth rate
  const currentMonth = patientData.patientGrowth[0]?.count || 0;
  const previousMonth = patientData.patientGrowth[1]?.count || 0;
  const growthRate = previousMonth ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

  // Calculate age distribution percentages
  const totalByAge = patientData.patientsByAgeGroup.reduce((sum, group) => sum + group.count, 0);
  const ageDistribution = patientData.patientsByAgeGroup.map(group => ({
    ...group,
    percentage: ((group.count / totalByAge) * 100).toFixed(1),
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
                    Total Patients
                  </Typography>
                  <Typography variant="h4">
                    {patientData.totalPatients.toLocaleString()}
                  </Typography>
                </Box>
                <People fontSize="large" color="primary" />
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
                    New This Month
                  </Typography>
                  <Typography variant="h4">
                    {patientData.newPatientsThisMonth}
                  </Typography>
                </Box>
                <TrendingUp fontSize="large" color="success" />
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
                    Growth Rate
                  </Typography>
                  <Typography 
                    variant="h4"
                    color={growthRate >= 0 ? 'success.main' : 'error.main'}
                  >
                    {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
                  </Typography>
                </Box>
                <TrendingUp fontSize="large" color={growthRate >= 0 ? 'success' : 'error'} />
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
                    With Insurance
                  </Typography>
                  <Typography variant="h4">
                    {((patientData.totalPatients - patientData.patientsByInsurance.find(i => i.insurance === 'No Insurance')?.count!) / patientData.totalPatients * 100).toFixed(0)}%
                  </Typography>
                </Box>
                <LocalHospital fontSize="large" color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Patient Growth */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Patient Growth Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={patientData.patientGrowth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gender Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Gender Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patientData.patientsByGender}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.gender}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {patientData.patientsByGender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Age Distribution */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Age Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={patientData.patientsByAgeGroup}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Age Distribution Details */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Age Group Details</Typography>
            <List>
              {ageDistribution.map((group, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={group.ageGroup}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(group.percentage)}
                          sx={{ flex: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 50 }}>
                          {group.percentage}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Insurance Coverage */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Insurance Coverage Distribution</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={patientData.patientsByInsurance}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="insurance" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FF8042">
                  {patientData.patientsByInsurance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientAnalytics;