import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Download,
  Print,
  Share,
  MoreVert,
  TrendingUp,
  People,
  EventNote,
  LocalHospital,
  AttachMoney,
  Assessment,
  Speed,
  DateRange,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchReportData,
  fetchDashboardMetrics,
  setFilters,
  exportReport,
} from '../store/slices/reportsSlice';
import { showNotification } from '../store/slices/notificationSlice';
import RevenueChart from '../components/reports/RevenueChart';
import PatientAnalytics from '../components/reports/PatientAnalytics';
import AppointmentAnalytics from '../components/reports/AppointmentAnalytics';
import DoctorPerformance from '../components/reports/DoctorPerformance';
import OperationalMetrics from '../components/reports/OperationalMetrics';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Reports: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reportData, dashboardMetrics, loading, filters } = useSelector(
    (state: RootState) => state.reports
  );
  
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(filters.dateRange.start),
    end: new Date(filters.dateRange.end),
  });

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchReportData(filters));
    dispatch(fetchDashboardMetrics());
  }, [dispatch, filters]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      const reportTypes = ['revenue', 'patients', 'appointments', 'doctors', 'operational'];
      await dispatch(exportReport({
        format,
        reportType: reportTypes[tabValue],
        filters,
      })).unwrap();
      
      dispatch(showNotification({
        message: `Report exported as ${format.toUpperCase()}`,
        severity: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to export report',
        severity: 'error',
      }));
    }
    handleMenuClose();
  };

  const handlePrint = () => {
    window.print();
    handleMenuClose();
  };

  const handleDateChange = (type: 'start' | 'end', date: Date | null) => {
    if (date) {
      const newDateRange = { ...dateRange, [type]: date };
      setDateRange(newDateRange);
      dispatch(setFilters({
        dateRange: {
          start: newDateRange.start.toISOString(),
          end: newDateRange.end.toISOString(),
        },
      }));
    }
  };

  const quickDateRanges = [
    { label: 'Today', days: 0 },
    { label: '7 Days', days: 7 },
    { label: '30 Days', days: 30 },
    { label: '90 Days', days: 90 },
  ];

  const handleQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setDateRange({ start, end });
    dispatch(setFilters({
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Reports & Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comprehensive insights and performance metrics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleMenuOpen}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Dashboard Metrics */}
        {dashboardMetrics && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" variant="overline">
                        Today's Revenue
                      </Typography>
                      <Typography variant="h5">
                        ${dashboardMetrics.todayRevenue.toLocaleString()}
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
                        Appointments Today
                      </Typography>
                      <Typography variant="h5">
                        {dashboardMetrics.todayAppointments}
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
                        Active Patients
                      </Typography>
                      <Typography variant="h5">
                        {dashboardMetrics.activePatients.toLocaleString()}
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
                        Occupancy Rate
                      </Typography>
                      <Typography variant="h5">
                        {dashboardMetrics.occupancyRate}%
                      </Typography>
                    </Box>
                    <Speed fontSize="large" color="secondary" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Date Range Selector */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DateRange /> Date Range
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Start Date"
                value={dateRange.start}
                onChange={(date) => handleDateChange('start', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="End Date"
                value={dateRange.end}
                onChange={(date) => handleDateChange('end', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {quickDateRanges.map((range) => (
                  <Button
                    key={range.label}
                    size="small"
                    variant="outlined"
                    onClick={() => handleQuickDateRange(range.days)}
                  >
                    {range.label}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Report Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<AttachMoney />} label="Revenue" />
            <Tab icon={<People />} label="Patients" />
            <Tab icon={<EventNote />} label="Appointments" />
            <Tab icon={<LocalHospital />} label="Doctors" />
            <Tab icon={<Assessment />} label="Operations" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          <RevenueChart />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PatientAnalytics />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AppointmentAnalytics />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <DoctorPerformance />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <OperationalMetrics />
        </TabPanel>

        {/* Export Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleExport('pdf')}>
            Export as PDF
          </MenuItem>
          <MenuItem onClick={() => handleExport('excel')}>
            Export as Excel
          </MenuItem>
          <MenuItem onClick={() => handleExport('csv')}>
            Export as CSV
          </MenuItem>
          <Divider />
          <MenuItem onClick={handlePrint}>
            Print Report
          </MenuItem>
        </Menu>

        {/* Upcoming Appointments (if on dashboard) */}
        {dashboardMetrics && dashboardMetrics.upcomingAppointments.length > 0 && tabValue === 0 && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            <Grid container spacing={2}>
              {dashboardMetrics.upcomingAppointments.map((appointment, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="primary">
                        {appointment.time}
                      </Typography>
                      <Typography variant="body1">
                        {appointment.patient}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {appointment.doctor}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.department}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;