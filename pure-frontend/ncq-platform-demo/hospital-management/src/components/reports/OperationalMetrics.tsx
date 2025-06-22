import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
} from '@mui/material';
import {
  GaugeChart,
  Gauge,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  Hotel,
  Timer,
  EmergencyShare,
  People,
  DevicesOther,
  TrendingUp,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

const OperationalMetrics: React.FC = () => {
  const { reportData } = useSelector((state: RootState) => state.reports);

  if (!reportData) return null;

  const operationalData = reportData.operational;
  const labData = reportData.labTests;
  const medicationData = reportData.medications;

  // Prepare gauge data for bed occupancy
  const bedOccupancyData = [
    {
      name: 'Occupied',
      value: operationalData.bedOccupancyRate,
      fill: operationalData.bedOccupancyRate > 90 ? '#FF8042' : operationalData.bedOccupancyRate > 70 ? '#FFBB28' : '#00C49F',
    },
  ];

  // Equipment utilization with status
  const equipmentData = operationalData.equipmentUtilization.map(eq => ({
    ...eq,
    status: eq.utilization > 90 ? 'critical' : eq.utilization > 70 ? 'optimal' : 'underutilized',
    fill: eq.utilization > 90 ? '#FF8042' : eq.utilization > 70 ? '#00C49F' : '#0088FE',
  }));

  // Lab test efficiency
  const labEfficiencyData = [
    {
      name: 'Completed',
      value: (labData.completedTests / labData.totalTests) * 100,
      count: labData.completedTests,
    },
    {
      name: 'Pending',
      value: (labData.pendingTests / labData.totalTests) * 100,
      count: labData.pendingTests,
    },
  ];

  return (
    <Box>
      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="overline">
                    Bed Occupancy
                  </Typography>
                  <Typography variant="h4">
                    {operationalData.bedOccupancyRate}%
                  </Typography>
                </Box>
                <Hotel 
                  fontSize="large" 
                  color={operationalData.bedOccupancyRate > 90 ? 'error' : 'primary'} 
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={operationalData.bedOccupancyRate} 
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                color={operationalData.bedOccupancyRate > 90 ? 'error' : operationalData.bedOccupancyRate > 70 ? 'warning' : 'success'}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="overline">
                    Avg Stay Duration
                  </Typography>
                  <Typography variant="h4">
                    {operationalData.averageStayDuration} days
                  </Typography>
                </Box>
                <Timer fontSize="large" color="info" />
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
                    Emergency Response
                  </Typography>
                  <Typography variant="h4">
                    {operationalData.emergencyResponseTime} min
                  </Typography>
                </Box>
                <EmergencyShare 
                  fontSize="large" 
                  color={operationalData.emergencyResponseTime < 10 ? 'success' : 'warning'} 
                />
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
                    Staff Utilization
                  </Typography>
                  <Typography variant="h4">
                    {operationalData.staffUtilization}%
                  </Typography>
                </Box>
                <People fontSize="large" color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {operationalData.bedOccupancyRate > 90 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle1">High Bed Occupancy Alert</Typography>
          <Typography variant="body2">
            Current bed occupancy is at {operationalData.bedOccupancyRate}%. Consider discharge planning for stable patients.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Bed Occupancy Gauge */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Bed Occupancy Rate</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="60%" 
                outerRadius="90%" 
                barSize={20} 
                data={bedOccupancyData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  background
                  clockWise
                  dataKey="value"
                  cornerRadius={10}
                />
                <text 
                  x="50%" 
                  y="50%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="recharts-text"
                >
                  <tspan x="50%" dy="-0.5em" fontSize="36" fontWeight="bold">
                    {operationalData.bedOccupancyRate}%
                  </tspan>
                  <tspan x="50%" dy="1.5em" fontSize="14" fill="#666">
                    Occupancy
                  </tspan>
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
              <Chip 
                icon={<CheckCircle />} 
                label="Safe: 70-85%" 
                color="success" 
                variant="outlined" 
                size="small"
              />
              <Chip 
                icon={<Warning />} 
                label="High: >90%" 
                color="error" 
                variant="outlined" 
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Lab Test Efficiency */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Lab Test Processing</Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Tests: {labData.totalTests}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Turnaround: {labData.averageTurnaroundTime} hours
              </Typography>
            </Box>
            <List>
              {labEfficiencyData.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.count} tests (${item.value.toFixed(1)}%)`}
                  />
                  <Box sx={{ width: '60%', ml: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={item.value}
                      sx={{ height: 10, borderRadius: 5 }}
                      color={item.name === 'Completed' ? 'success' : 'warning'}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Popular Tests</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {labData.popularTests.slice(0, 5).map((test, index) => (
                <Chip
                  key={index}
                  label={`${test.test} (${test.count})`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Equipment Utilization */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Equipment Utilization</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={equipmentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="equipment" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="utilization" fill="#8884d8">
                  {equipmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Chip
                icon={<DevicesOther />}
                label="Underutilized: <70%"
                color="primary"
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<CheckCircle />}
                label="Optimal: 70-90%"
                color="success"
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<Warning />}
                label="Critical: >90%"
                color="error"
                variant="outlined"
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Medication Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Medication Statistics</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Total Prescriptions"
                  secondary={medicationData.totalPrescriptions.toLocaleString()}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Controlled Substances"
                  secondary={medicationData.controlledSubstances}
                />
              </ListItem>
            </List>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Most Prescribed Medications
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {medicationData.mostPrescribedMedications.slice(0, 3).map((med, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {med.medication}
                  </Typography>
                  <Chip label={med.count} size="small" color="primary" />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Prescriptions by Department */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Prescriptions by Department</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={medicationData.prescriptionsByDepartment}
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="department" />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OperationalMetrics;