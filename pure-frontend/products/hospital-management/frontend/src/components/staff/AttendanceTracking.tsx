import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Avatar,
  LinearProgress,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  AccessTime,
  CheckCircle,
  Cancel,
  Schedule,
  Warning,
  Edit,
  Visibility,
  ClockIn,
  ClockOut,
  Today,
  CalendarMonth,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO, isToday } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { showNotification } from '../../store/slices/notificationSlice';

interface AttendanceRecord {
  id: string;
  staff_id: string;
  staff_name: string;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  status: string;
  total_hours: number;
  overtime_hours: number;
  late_minutes: number;
  early_departure_minutes: number;
  break_minutes: number;
  location: string;
  is_verified: boolean;
}

const AttendanceTracking: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff } = useSelector((state: RootState) => state.staff);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showClockDialog, setShowClockDialog] = useState(false);
  const [clockType, setClockType] = useState<'in' | 'out'>('in');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock attendance data
  useEffect(() => {
    const mockAttendance: AttendanceRecord[] = [
      {
        id: '1',
        staff_id: '1',
        staff_name: 'Sarah Johnson',
        date: '2024-06-08',
        clock_in_time: '08:00',
        clock_out_time: '16:30',
        status: 'present',
        total_hours: 8.5,
        overtime_hours: 0.5,
        late_minutes: 0,
        early_departure_minutes: 0,
        break_minutes: 60,
        location: 'Main Entrance',
        is_verified: true,
      },
      {
        id: '2',
        staff_id: '2',
        staff_name: 'Michael Davis',
        date: '2024-06-08',
        clock_in_time: '08:15',
        clock_out_time: '16:00',
        status: 'late',
        total_hours: 7.75,
        overtime_hours: 0,
        late_minutes: 15,
        early_departure_minutes: 0,
        break_minutes: 45,
        location: 'Emergency Entrance',
        is_verified: false,
      },
      {
        id: '3',
        staff_id: '3',
        staff_name: 'Emily Rodriguez',
        date: '2024-06-08',
        clock_in_time: null,
        clock_out_time: null,
        status: 'absent',
        total_hours: 0,
        overtime_hours: 0,
        late_minutes: 0,
        early_departure_minutes: 0,
        break_minutes: 0,
        location: '',
        is_verified: false,
      },
    ];
    setAttendanceRecords(mockAttendance);
  }, [selectedDate]);

  const handleClockIn = async () => {
    if (!selectedStaff) return;
    
    setLoading(true);
    try {
      const now = new Date();
      const timeString = format(now, 'HH:mm');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const staffMember = staff.find(s => s.id === selectedStaff);
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        staff_id: selectedStaff,
        staff_name: staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : '',
        date: format(now, 'yyyy-MM-dd'),
        clock_in_time: timeString,
        clock_out_time: null,
        status: 'present',
        total_hours: 0,
        overtime_hours: 0,
        late_minutes: 0,
        early_departure_minutes: 0,
        break_minutes: 0,
        location: 'Web Portal',
        is_verified: false,
      };

      setAttendanceRecords(prev => [...prev, newRecord]);
      dispatch(showNotification({
        message: 'Clocked in successfully',
        severity: 'success',
      }));
      
      setShowClockDialog(false);
      setSelectedStaff('');
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to clock in',
        severity: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!selectedStaff) return;
    
    setLoading(true);
    try {
      const now = new Date();
      const timeString = format(now, 'HH:mm');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAttendanceRecords(prev => 
        prev.map(record => {
          if (record.staff_id === selectedStaff && isToday(parseISO(record.date))) {
            return {
              ...record,
              clock_out_time: timeString,
              total_hours: 8, // Calculate based on times
              status: 'present',
            };
          }
          return record;
        })
      );
      
      dispatch(showNotification({
        message: 'Clocked out successfully',
        severity: 'success',
      }));
      
      setShowClockDialog(false);
      setSelectedStaff('');
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to clock out',
        severity: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'late':
        return 'warning';
      case 'absent':
        return 'error';
      case 'half_day':
        return 'info';
      case 'on_leave':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle />;
      case 'late':
        return <Warning />;
      case 'absent':
        return <Cancel />;
      case 'half_day':
        return <Schedule />;
      default:
        return <AccessTime />;
    }
  };

  const calculateAttendanceStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const totalHours = attendanceRecords.reduce((sum, r) => sum + r.total_hours, 0);
    const avgHours = total > 0 ? totalHours / total : 0;
    const attendanceRate = total > 0 ? ((present + late) / total) * 100 : 0;

    return {
      total,
      present,
      late,
      absent,
      totalHours,
      avgHours,
      attendanceRate,
    };
  };

  const stats = calculateAttendanceStats();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRecords = attendanceRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Attendance Tracking
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date || new Date())}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
            <Button
              variant="outlined"
              startIcon={<ClockIn />}
              onClick={() => {
                setClockType('in');
                setShowClockDialog(true);
              }}
            >
              Clock In
            </Button>
            <Button
              variant="outlined"
              startIcon={<ClockOut />}
              onClick={() => {
                setClockType('out');
                setShowClockDialog(true);
              }}
            >
              Clock Out
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle color="success" />
                  <Box>
                    <Typography variant="h6">
                      {stats.present}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Present
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Warning color="warning" />
                  <Box>
                    <Typography variant="h6">
                      {stats.late}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Late
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Cancel color="error" />
                  <Box>
                    <Typography variant="h6">
                      {stats.absent}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Absent
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingUp color="primary" />
                  <Box>
                    <Typography variant="h6">
                      {stats.attendanceRate.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Attendance Rate
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attendance Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Attendance ({attendanceRecords.length} records)
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Staff Member</TableCell>
                    <TableCell>Clock In</TableCell>
                    <TableCell>Clock Out</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Hours</TableCell>
                    <TableCell>Overtime</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Verified</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No attendance records found for this date
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRecords.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                              {record.staff_name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {record.staff_name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ID: {record.staff_id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {record.clock_in_time || '--:--'}
                            {record.late_minutes > 0 && (
                              <Chip
                                label={`+${record.late_minutes}m`}
                                size="small"
                                color="warning"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {record.clock_out_time || '--:--'}
                            {record.early_departure_minutes > 0 && (
                              <Chip
                                label={`-${record.early_departure_minutes}m`}
                                size="small"
                                color="error"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(record.status)}
                            label={record.status.replace('_', ' ')}
                            size="small"
                            color={getStatusColor(record.status) as any}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {record.total_hours.toFixed(2)}h
                          </Typography>
                          {record.break_minutes > 0 && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              Break: {record.break_minutes}m
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {record.overtime_hours > 0 ? (
                            <Chip
                              label={`${record.overtime_hours.toFixed(2)}h`}
                              size="small"
                              color="info"
                            />
                          ) : (
                            '--'
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {record.location || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {record.is_verified ? (
                            <CheckCircle color="success" fontSize="small" />
                          ) : (
                            <Warning color="warning" fontSize="small" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={attendanceRecords.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>

        {/* Clock In/Out Dialog */}
        <Dialog
          open={showClockDialog}
          onClose={() => setShowClockDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {clockType === 'in' ? 'Clock In' : 'Clock Out'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Select Staff Member</InputLabel>
                <Select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  label="Select Staff Member"
                >
                  {staff.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.first_name} {member.last_name} - {member.department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Current Time: {format(new Date(), 'HH:mm:ss')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowClockDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={clockType === 'in' ? handleClockIn : handleClockOut}
              disabled={!selectedStaff || loading}
            >
              {loading ? 'Processing...' : `Clock ${clockType === 'in' ? 'In' : 'Out'}`}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default AttendanceTracking;