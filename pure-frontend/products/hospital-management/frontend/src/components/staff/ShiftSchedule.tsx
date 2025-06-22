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
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Tabs,
  Tab,
  Calendar,
  Paper,
  Avatar,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  CalendarToday,
  Schedule,
  AccessTime,
  People,
  ViewWeek,
  ViewDay,
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { showNotification } from '../../store/slices/notificationSlice';

interface Shift {
  id: string;
  staff_id: string;
  staff_name: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  department: string;
  status: string;
  scheduled_hours: number;
}

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
      id={`schedule-tabpanel-${index}`}
      aria-labelledby={`schedule-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const ShiftSchedule: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff } = useSelector((state: RootState) => state.staff);
  
  const [view, setView] = useState(0); // 0: Weekly, 1: Daily, 2: Monthly
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [showShiftForm, setShowShiftForm] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  // Mock shift data
  useEffect(() => {
    const mockShifts: Shift[] = [
      {
        id: '1',
        staff_id: '1',
        staff_name: 'Sarah Johnson',
        shift_date: '2024-06-10',
        start_time: '08:00',
        end_time: '16:00',
        shift_type: 'morning',
        department: 'Emergency',
        status: 'scheduled',
        scheduled_hours: 8,
      },
      {
        id: '2',
        staff_id: '2',
        staff_name: 'Michael Davis',
        shift_date: '2024-06-10',
        start_time: '16:00',
        end_time: '00:00',
        shift_type: 'evening',
        department: 'Radiology',
        status: 'scheduled',
        scheduled_hours: 8,
      },
      {
        id: '3',
        staff_id: '1',
        staff_name: 'Sarah Johnson',
        shift_date: '2024-06-11',
        start_time: '08:00',
        end_time: '16:00',
        shift_type: 'morning',
        department: 'Emergency',
        status: 'active',
        scheduled_hours: 8,
      },
    ];
    setShifts(mockShifts);
  }, []);

  const handleViewChange = (event: React.SyntheticEvent, newValue: number) => {
    setView(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, shift: Shift) => {
    setAnchorEl(event.currentTarget);
    setSelectedShift(shift);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedShift(null);
  };

  const handleEditShift = () => {
    setEditingShift(selectedShift);
    setShowShiftForm(true);
    handleMenuClose();
  };

  const handleDeleteShift = () => {
    if (selectedShift) {
      setShifts(shifts.filter(s => s.id !== selectedShift.id));
      dispatch(showNotification({
        message: 'Shift deleted successfully',
        severity: 'success',
      }));
    }
    handleMenuClose();
  };

  const getShiftColor = (shiftType: string) => {
    switch (shiftType) {
      case 'morning':
        return '#4caf50';
      case 'afternoon':
        return '#ff9800';
      case 'evening':
        return '#2196f3';
      case 'night':
        return '#9c27b0';
      default:
        return '#757575';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderWeeklyView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }

    return (
      <Grid container spacing={1}>
        {days.map((day) => {
          const dayShifts = shifts.filter(shift => 
            isSameDay(parseISO(shift.shift_date), day)
          );
          
          return (
            <Grid item xs={12/7} key={day.toISOString()}>
              <Paper sx={{ p: 1, minHeight: 200 }}>
                <Typography variant="subtitle2" align="center" gutterBottom>
                  {format(day, 'EEE')}
                </Typography>
                <Typography variant="h6" align="center" gutterBottom>
                  {format(day, 'd')}
                </Typography>
                
                {dayShifts.map((shift) => (
                  <Box
                    key={shift.id}
                    sx={{
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: getShiftColor(shift.shift_type),
                      color: 'white',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => handleMenuOpen(e, shift)}
                  >
                    <Typography variant="caption" display="block">
                      {shift.staff_name}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {shift.start_time} - {shift.end_time}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {shift.department}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderDailyView = () => {
    const dayShifts = shifts.filter(shift => 
      isSameDay(parseISO(shift.shift_date), currentDate)
    );

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Staff Member</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Shift Type</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dayShifts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No shifts scheduled for this day
                </TableCell>
              </TableRow>
            ) : (
              dayShifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                        {shift.staff_name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      {shift.staff_name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {shift.start_time} - {shift.end_time}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={shift.shift_type}
                      size="small"
                      sx={{
                        backgroundColor: getShiftColor(shift.shift_type),
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>{shift.department}</TableCell>
                  <TableCell>{shift.scheduled_hours}h</TableCell>
                  <TableCell>
                    <Chip
                      label={shift.status}
                      size="small"
                      color={getStatusColor(shift.status) as any}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, shift)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderMonthlyView = () => {
    // Simplified monthly view - would need a proper calendar component
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Schedule Overview
        </Typography>
        <Alert severity="info">
          Monthly calendar view coming soon. Use weekly or daily view for detailed scheduling.
        </Alert>
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Shift Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(currentDate, 'MMMM yyyy')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <DatePicker
              label="Select Date"
              value={currentDate}
              onChange={(date) => setCurrentDate(date || new Date())}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowShiftForm(true)}
            >
              Add Shift
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Schedule color="primary" />
                  <Box>
                    <Typography variant="h6">
                      {shifts.filter(s => s.status === 'scheduled').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scheduled
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccessTime color="success" />
                  <Box>
                    <Typography variant="h6">
                      {shifts.filter(s => s.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Now
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <People color="info" />
                  <Box>
                    <Typography variant="h6">
                      {new Set(shifts.map(s => s.staff_id)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Staff Scheduled
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarToday color="warning" />
                  <Box>
                    <Typography variant="h6">
                      {shifts.reduce((sum, s) => sum + s.scheduled_hours, 0)}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Hours
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Navigation */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
            variant="outlined"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentDate(new Date())}
            variant="outlined"
          >
            Today
          </Button>
          <Button
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
            variant="outlined"
          >
            Next
          </Button>
        </Box>

        {/* View Tabs */}
        <Card>
          <Tabs value={view} onChange={handleViewChange}>
            <Tab icon={<ViewWeek />} label="Weekly" />
            <Tab icon={<ViewDay />} label="Daily" />
            <Tab icon={<CalendarToday />} label="Monthly" />
          </Tabs>

          <TabPanel value={view} index={0}>
            <Box sx={{ p: 2 }}>
              {renderWeeklyView()}
            </Box>
          </TabPanel>

          <TabPanel value={view} index={1}>
            <Box sx={{ p: 2 }}>
              {renderDailyView()}
            </Box>
          </TabPanel>

          <TabPanel value={view} index={2}>
            {renderMonthlyView()}
          </TabPanel>
        </Card>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditShift}>
            <Edit sx={{ mr: 1 }} />
            Edit Shift
          </MenuItem>
          <MenuItem onClick={handleDeleteShift} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} />
            Delete Shift
          </MenuItem>
        </Menu>

        {/* Shift Form Dialog */}
        <ShiftFormDialog
          open={showShiftForm}
          onClose={() => {
            setShowShiftForm(false);
            setEditingShift(null);
          }}
          shift={editingShift}
          onSave={(shiftData) => {
            if (editingShift) {
              // Update existing shift
              setShifts(shifts.map(s => s.id === editingShift.id ? { ...s, ...shiftData } : s));
              dispatch(showNotification({
                message: 'Shift updated successfully',
                severity: 'success',
              }));
            } else {
              // Create new shift
              const newShift = {
                id: Date.now().toString(),
                ...shiftData,
              };
              setShifts([...shifts, newShift]);
              dispatch(showNotification({
                message: 'Shift created successfully',
                severity: 'success',
              }));
            }
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

// Shift Form Dialog Component
interface ShiftFormDialogProps {
  open: boolean;
  onClose: () => void;
  shift?: Shift | null;
  onSave: (shiftData: any) => void;
}

const ShiftFormDialog: React.FC<ShiftFormDialogProps> = ({ open, onClose, shift, onSave }) => {
  const { staff } = useSelector((state: RootState) => state.staff);
  const [formData, setFormData] = useState({
    staff_id: '',
    staff_name: '',
    shift_date: new Date(),
    start_time: new Date(),
    end_time: new Date(),
    shift_type: 'morning',
    department: '',
    status: 'scheduled',
  });

  useEffect(() => {
    if (shift) {
      setFormData({
        staff_id: shift.staff_id,
        staff_name: shift.staff_name,
        shift_date: parseISO(shift.shift_date),
        start_time: new Date(`2000-01-01T${shift.start_time}`),
        end_time: new Date(`2000-01-01T${shift.end_time}`),
        shift_type: shift.shift_type,
        department: shift.department,
        status: shift.status,
      });
    } else {
      setFormData({
        staff_id: '',
        staff_name: '',
        shift_date: new Date(),
        start_time: new Date(),
        end_time: new Date(),
        shift_type: 'morning',
        department: '',
        status: 'scheduled',
      });
    }
  }, [shift]);

  const handleSave = () => {
    const shiftData = {
      ...formData,
      shift_date: format(formData.shift_date, 'yyyy-MM-dd'),
      start_time: format(formData.start_time, 'HH:mm'),
      end_time: format(formData.end_time, 'HH:mm'),
      scheduled_hours: 8, // Calculate based on start/end time
    };
    onSave(shiftData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {shift ? 'Edit Shift' : 'Create New Shift'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Staff Member</InputLabel>
              <Select
                value={formData.staff_id}
                onChange={(e) => {
                  const selectedStaff = staff.find(s => s.id === e.target.value);
                  setFormData({
                    ...formData,
                    staff_id: e.target.value,
                    staff_name: selectedStaff ? `${selectedStaff.first_name} ${selectedStaff.last_name}` : '',
                  });
                }}
                label="Staff Member"
              >
                {staff.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Shift Date"
              value={formData.shift_date}
              onChange={(date) => setFormData({ ...formData, shift_date: date || new Date() })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Shift Type</InputLabel>
              <Select
                value={formData.shift_type}
                onChange={(e) => setFormData({ ...formData, shift_type: e.target.value })}
                label="Shift Type"
              >
                <MenuItem value="morning">Morning</MenuItem>
                <MenuItem value="afternoon">Afternoon</MenuItem>
                <MenuItem value="evening">Evening</MenuItem>
                <MenuItem value="night">Night</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label="Start Time"
              value={formData.start_time}
              onChange={(time) => setFormData({ ...formData, start_time: time || new Date() })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label="End Time"
              value={formData.end_time}
              onChange={(time) => setFormData({ ...formData, end_time: time || new Date() })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {shift ? 'Update' : 'Create'} Shift
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShiftSchedule;