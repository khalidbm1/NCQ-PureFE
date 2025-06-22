import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  FilterList,
  Search,
  MoreVert,
  People,
  Schedule,
  AccessTime,
  Assignment,
  Assessment,
  PersonAdd,
  CalendarMonth,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { setFilters } from '../store/slices/staffSlice';
import StaffList from '../components/staff/StaffList';
import ShiftSchedule from '../components/staff/ShiftSchedule';
import AttendanceTracking from '../components/staff/AttendanceTracking';
import LeaveManagement from '../components/staff/LeaveManagement';
import StaffPerformanceView from '../components/staff/StaffPerformanceView';
import StaffForm from '../components/staff/StaffForm';
import { showNotification } from '../store/slices/notificationSlice';

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
      id={`staff-tabpanel-${index}`}
      aria-labelledby={`staff-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const StaffManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff, stats, filters, loading } = useSelector(
    (state: RootState) => state.staff
  );
  
  const [tabValue, setTabValue] = useState(0);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Mock staff data
    const mockStaff = [
      {
        id: '1',
        staff_id: 'STF001',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@hospital.com',
        phone: '+1234567890',
        role: 'nurse' as const,
        department: 'Emergency',
        qualification: 'BSN, RN',
        experience_years: 5,
        license_number: 'RN123456',
        license_expiry: '2025-12-31',
        employment_type: 'full_time' as const,
        shift_preference: 'morning' as const,
        status: 'active' as const,
        join_date: '2020-01-15',
        birth_date: '1990-05-20',
        gender: 'female' as const,
        address: '123 Main St, City, State 12345',
        emergency_contact: {
          name: 'John Johnson',
          relationship: 'Spouse',
          phone: '+1234567891',
        },
        salary: 75000,
        allowances: 5000,
        skills: ['Emergency Care', 'IV Therapy', 'Patient Assessment'],
        languages: ['English', 'Spanish'],
        documents: [],
        created_at: '2020-01-15T09:00:00Z',
        updated_at: '2024-06-08T10:30:00Z',
      },
      {
        id: '2',
        staff_id: 'STF002',
        first_name: 'Michael',
        last_name: 'Davis',
        email: 'michael.davis@hospital.com',
        phone: '+1234567892',
        role: 'technician' as const,
        department: 'Radiology',
        qualification: 'Associate Degree in Radiologic Technology',
        experience_years: 8,
        license_number: 'RT789012',
        license_expiry: '2026-06-30',
        employment_type: 'full_time' as const,
        shift_preference: 'afternoon' as const,
        status: 'active' as const,
        join_date: '2018-03-10',
        birth_date: '1985-11-15',
        gender: 'male' as const,
        address: '456 Oak Ave, City, State 12345',
        emergency_contact: {
          name: 'Lisa Davis',
          relationship: 'Wife',
          phone: '+1234567893',
        },
        salary: 68000,
        allowances: 3000,
        skills: ['X-Ray', 'CT Scan', 'MRI', 'Equipment Maintenance'],
        languages: ['English'],
        documents: [],
        created_at: '2018-03-10T09:00:00Z',
        updated_at: '2024-06-08T10:30:00Z',
      },
      {
        id: '3',
        staff_id: 'STF003',
        first_name: 'Emily',
        last_name: 'Rodriguez',
        email: 'emily.rodriguez@hospital.com',
        phone: '+1234567894',
        role: 'pharmacist' as const,
        department: 'Pharmacy',
        qualification: 'PharmD',
        experience_years: 6,
        license_number: 'PH345678',
        license_expiry: '2025-09-30',
        employment_type: 'full_time' as const,
        shift_preference: 'morning' as const,
        status: 'active' as const,
        join_date: '2019-06-01',
        birth_date: '1988-02-28',
        gender: 'female' as const,
        address: '789 Pine St, City, State 12345',
        emergency_contact: {
          name: 'Carlos Rodriguez',
          relationship: 'Father',
          phone: '+1234567895',
        },
        salary: 95000,
        allowances: 4000,
        skills: ['Drug Dispensing', 'Clinical Pharmacy', 'Patient Counseling'],
        languages: ['English', 'Spanish'],
        documents: [],
        created_at: '2019-06-01T09:00:00Z',
        updated_at: '2024-06-08T10:30:00Z',
      },
    ];

    // Mock stats
    const mockStats = {
      totalStaff: mockStaff.length,
      activeStaff: mockStaff.filter(s => s.status === 'active').length,
      onLeaveStaff: 5,
      todayPresent: 42,
      todayAbsent: 3,
      pendingLeaveRequests: 8,
      staffByDepartment: [
        { department: 'Emergency', count: 15 },
        { department: 'Radiology', count: 8 },
        { department: 'Pharmacy', count: 6 },
        { department: 'Laboratory', count: 10 },
        { department: 'ICU', count: 12 },
      ],
      staffByRole: [
        { role: 'Nurse', count: 25 },
        { role: 'Technician', count: 12 },
        { role: 'Pharmacist', count: 6 },
        { role: 'Admin', count: 8 },
      ],
      averageAttendance: 94.5,
      overtimeHours: 125,
    };

    dispatch({ type: 'staff/setStaff', payload: mockStaff });
    dispatch({ type: 'staff/setStats', payload: mockStats });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setFilters({ [field]: value }));
  };

  const handleAddStaff = () => {
    setShowStaffForm(true);
  };

  const handleExport = (format: string) => {
    dispatch(showNotification({
      message: `Staff data exported as ${format.toUpperCase()}`,
      severity: 'success',
    }));
    handleMenuClose();
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Staff Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage staff, schedules, attendance, and performance
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleAddStaff}
          >
            Add Staff
          </Button>
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Dashboard Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="overline">
                    Total Staff
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalStaff}
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
                    Present Today
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.todayPresent}
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
                    On Leave
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.onLeaveStaff}
                  </Typography>
                </Box>
                <CalendarMonth fontSize="large" color="warning" />
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
                    Attendance Rate
                  </Typography>
                  <Typography variant="h4">
                    {stats.averageAttendance}%
                  </Typography>
                </Box>
                <Assessment fontSize="large" color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search staff..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                label="Department"
              >
                <MenuItem value="all">All Departments</MenuItem>
                <MenuItem value="Emergency">Emergency</MenuItem>
                <MenuItem value="Radiology">Radiology</MenuItem>
                <MenuItem value="Pharmacy">Pharmacy</MenuItem>
                <MenuItem value="Laboratory">Laboratory</MenuItem>
                <MenuItem value="ICU">ICU</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                label="Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="nurse">Nurse</MenuItem>
                <MenuItem value="technician">Technician</MenuItem>
                <MenuItem value="pharmacist">Pharmacist</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on_leave">On Leave</MenuItem>
                <MenuItem value="terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<People />} label="Staff Directory" />
          <Tab icon={<Schedule />} label="Shift Schedule" />
          <Tab icon={<AccessTime />} label="Attendance" />
          <Tab icon={<Assignment />} label="Leave Management" />
          <Tab icon={<Assessment />} label="Performance" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <StaffList />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ShiftSchedule />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AttendanceTracking />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <LeaveManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <StaffPerformanceView />
        </TabPanel>
      </Card>

      {/* Export Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleExport('pdf')}>Export as PDF</MenuItem>
        <MenuItem onClick={() => handleExport('excel')}>Export as Excel</MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
      </Menu>

      {/* Staff Form Dialog */}
      {showStaffForm && (
        <StaffForm
          open={showStaffForm}
          onClose={() => setShowStaffForm(false)}
        />
      )}
    </Box>
  );
};

export default StaffManagement;