import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  Button,
  alpha,
  useTheme,
} from '@mui/material';
import {
  People,
  EventNote,
  LocalHospital,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  AccessTime,
  MoreVert,
  CheckCircle,
  Schedule,
  Add,
  ArrowForward,
  MedicalServices,
  Vaccines,
  LocalPharmacy,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  activeDoctors: number;
  monthRevenue: number;
  appointmentTrend: number[];
  revenueTrend: number[];
}

interface TodayAppointment {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  status: string;
  type: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    activeDoctors: 0,
    monthRevenue: 0,
    appointmentTrend: [],
    revenueTrend: [],
  });
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      // This would be actual API calls
      setStats({
        totalPatients: 1234,
        todayAppointments: 28,
        activeDoctors: 15,
        monthRevenue: 125000,
        appointmentTrend: [65, 59, 80, 81, 56, 72, 85],
        revenueTrend: [28000, 32000, 29000, 35000, 31000, 33000, 36000],
      });

      setTodayAppointments([
        {
          id: '1',
          patientName: 'John Doe',
          doctorName: 'Dr. Smith',
          time: '09:00 AM',
          status: 'confirmed',
          type: 'consultation',
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          doctorName: 'Dr. Johnson',
          time: '10:30 AM',
          status: 'in_progress',
          type: 'follow_up',
        },
        {
          id: '3',
          patientName: 'Bob Wilson',
          doctorName: 'Dr. Davis',
          time: '02:00 PM',
          status: 'scheduled',
          type: 'check_up',
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('dashboard.totalPatients'),
      value: stats.totalPatients.toLocaleString(),
      icon: <People />,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
      trend: '+12%',
      trendUp: true,
    },
    {
      title: t('dashboard.todayAppointments'),
      value: stats.todayAppointments,
      icon: <EventNote />,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      trend: '+5%',
      trendUp: true,
    },
    {
      title: t('dashboard.activeDoctors'),
      value: stats.activeDoctors,
      icon: <LocalHospital />,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      trend: '0%',
      trendUp: true,
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthRevenue.toLocaleString()}`,
      icon: <AttachMoney />,
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.1),
      trend: '+18%',
      trendUp: true,
    },
  ];

  const appointmentChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Appointments',
        data: stats.appointmentTrend,
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: theme.palette.background.paper,
        pointBorderColor: theme.palette.primary.main,
        pointBorderWidth: 2,
      },
    ],
  };

  const revenueChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: stats.revenueTrend,
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
        borderColor: theme.palette.primary.main,
        borderWidth: 0,
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  const getStatusChip = (status: string) => {
    const statusConfig: any = {
      confirmed: { 
        color: 'success', 
        label: 'Confirmed',
        bgColor: alpha(theme.palette.success.main, 0.1),
        textColor: theme.palette.success.dark,
      },
      in_progress: { 
        color: 'warning', 
        label: 'In Progress',
        bgColor: alpha(theme.palette.warning.main, 0.1),
        textColor: theme.palette.warning.dark,
      },
      scheduled: { 
        color: 'info', 
        label: 'Scheduled',
        bgColor: alpha(theme.palette.info.main, 0.1),
        textColor: theme.palette.info.dark,
      },
      completed: { 
        color: 'default', 
        label: 'Completed',
        bgColor: alpha(theme.palette.text.primary, 0.1),
        textColor: theme.palette.text.primary,
      },
    };

    const config = statusConfig[status] || statusConfig.scheduled;
    return (
      <Chip 
        size="small" 
        label={config.label} 
        sx={{
          bgcolor: config.bgColor,
          color: config.textColor,
          fontWeight: 500,
          border: 'none',
        }}
      />
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {t('navigation.dashboard')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.welcome')} 👋
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ 
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              {t('dashboard.newPatient')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<EventNote />}
              sx={{ 
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': { 
                  borderColor: 'primary.dark',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              {t('dashboard.newAppointment')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<LocalPharmacy />}
              sx={{ 
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': { 
                  borderColor: 'primary.dark',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              New Prescription
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  boxShadow: 'none',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                      <Typography 
                        color="text.secondary" 
                        variant="caption" 
                        fontWeight="medium"
                        sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                      >
                        {card.title}
                      </Typography>
                      <Typography 
                        variant="h3" 
                        fontWeight="bold" 
                        sx={{ mt: 1, mb: 2 }}
                      >
                        {card.value}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {card.trendUp ? (
                          <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                        )}
                        <Typography
                          variant="caption"
                          fontWeight="medium"
                          color={card.trendUp ? 'success.main' : 'error.main'}
                        >
                          {card.trend}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          vs last month
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: card.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: card.color,
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts and Today's Appointments */}
      <Grid container spacing={3}>
        {/* Appointment Trend Chart */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper 
              sx={{ 
                p: 3, 
                height: '100%',
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="600">
                  Weekly Appointments
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ height: 300 }}>
                <Line
                  data={appointmentChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: alpha(theme.palette.divider, 0.5),
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Paper 
              sx={{ 
                p: 3, 
                height: '100%',
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="600">
                  Revenue Trend
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ height: 300 }}>
                <Bar
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: alpha(theme.palette.divider, 0.5),
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Today's Appointments */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Paper 
              sx={{ 
                p: 3,
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {t('dashboard.todayAppointments')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {todayAppointments.length} appointments scheduled for today
                  </Typography>
                </Box>
                <Button
                  endIcon={<ArrowForward />}
                  sx={{ color: 'primary.main' }}
                >
                  View All
                </Button>
              </Box>
              <List>
                {todayAppointments.map((appointment, index) => (
                  <ListItem
                    key={appointment.id}
                    sx={{
                      bgcolor: alpha(theme.palette.background.default, 0.5),
                      mb: 1,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }}
                      >
                        {appointment.patientName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2" fontWeight="600">
                            {appointment.patientName}
                          </Typography>
                          {getStatusChip(appointment.status)}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.doctorName} • {appointment.time}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1).replace('_', ' ')}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        icon={<AccessTime />}
                        label={appointment.time}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: theme.palette.divider }}
                      />
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;