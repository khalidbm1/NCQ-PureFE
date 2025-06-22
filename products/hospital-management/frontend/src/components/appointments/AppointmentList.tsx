import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Collapse,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Edit,
  Cancel,
  EventRepeat,
  Visibility,
  Phone,
  Email,
  AttachMoney,
  KeyboardArrowDown,
  KeyboardArrowUp,
  FilterList,
  Download,
  Print,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  Appointment,
  setSelectedAppointment,
  cancelAppointment,
} from '../../store/slices/appointmentSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import { format } from 'date-fns';

interface AppointmentListProps {
  onEdit: (appointment: Appointment) => void;
  appointments?: Appointment[];
  showPagination?: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  onEdit, 
  appointments: propAppointments,
  showPagination = true 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments: storeAppointments } = useSelector((state: RootState) => state.appointments);
  const appointments = propAppointments || storeAppointments;
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppointment, setSelectedAppointmentLocal] = useState<Appointment | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'info';
      case 'scheduled': return 'primary';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'no_show': return 'default';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return '🩺';
      case 'follow_up': return '📋';
      case 'procedure': return '💉';
      case 'emergency': return '🚨';
      default: return '📅';
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.appointment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAppointments = showPagination
    ? filteredAppointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredAppointments;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointmentLocal(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointmentLocal(null);
  };

  const handleCancelAppointment = async () => {
    if (selectedAppointment) {
      try {
        await dispatch(cancelAppointment({
          id: selectedAppointment.id,
          reason: 'Cancelled by staff'
        })).unwrap();
        
        dispatch(showNotification({
          message: 'Appointment cancelled successfully',
          severity: 'success',
        }));
      } catch (error) {
        dispatch(showNotification({
          message: 'Failed to cancel appointment',
          severity: 'error',
        }));
      }
    }
    handleMenuClose();
  };

  const handleViewDetails = () => {
    if (selectedAppointment) {
      dispatch(setSelectedAppointment(selectedAppointment));
      setExpandedRow(expandedRow === selectedAppointment.id ? null : selectedAppointment.id);
    }
    handleMenuClose();
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Patient', 'Doctor', 'Department', 'Status', 'Type', 'Duration'];
    const data = filteredAppointments.map(apt => [
      apt.appointment_date,
      apt.appointment_time,
      apt.patient_name,
      apt.doctor_name,
      apt.department,
      apt.status,
      apt.type,
      `${apt.duration} min`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointments_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <Box>
      {/* Search and Actions Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Filter">
            <IconButton>
              <FilterList />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton onClick={exportToCSV}>
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton>
              <Print />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Appointments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Appointment #</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAppointments.map((appointment) => (
              <React.Fragment key={appointment.id}>
                <TableRow
                  hover
                  sx={{
                    '& > *': { borderBottom: expandedRow === appointment.id ? 'unset' : undefined },
                    opacity: appointment.status === 'cancelled' || appointment.status === 'no_show' ? 0.6 : 1,
                  }}
                >
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => setExpandedRow(expandedRow === appointment.id ? null : appointment.id)}
                    >
                      {expandedRow === appointment.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {appointment.appointment_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.appointment_time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {appointment.patient_name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{appointment.patient_name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {appointment.patient_phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{appointment.doctor_name}</TableCell>
                  <TableCell>{appointment.department}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span>{getTypeIcon(appointment.type)}</span>
                      <Typography variant="body2">
                        {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1).replace('_', ' ')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status.replace('_', ' ')}
                      size="small"
                      color={getStatusColor(appointment.status) as any}
                    />
                  </TableCell>
                  <TableCell>{appointment.duration} min</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, appointment)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                    <Collapse in={expandedRow === appointment.id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Appointment Details
                        </Typography>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              Reason for Visit
                            </Typography>
                            <Typography variant="body2">{appointment.reason}</Typography>
                          </Box>
                          {appointment.notes && (
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Notes
                              </Typography>
                              <Typography variant="body2">{appointment.notes}</Typography>
                            </Box>
                          )}
                          <Box sx={{ display: 'flex', gap: 4 }}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Service
                              </Typography>
                              <Typography variant="body2">
                                {appointment.service_name || 'General Consultation'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Amount
                              </Typography>
                              <Typography variant="body2">
                                ${appointment.amount || 0}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Payment Status
                              </Typography>
                              <Chip
                                label={appointment.payment_status || 'pending'}
                                size="small"
                                color={appointment.payment_status === 'paid' ? 'success' : 'warning'}
                              />
                            </Box>
                          </Box>
                          {appointment.check_in_time && (
                            <Box sx={{ display: 'flex', gap: 4 }}>
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Check In Time
                                </Typography>
                                <Typography variant="body2">{appointment.check_in_time}</Typography>
                              </Box>
                              {appointment.check_out_time && (
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Check Out Time
                                  </Typography>
                                  <Typography variant="body2">{appointment.check_out_time}</Typography>
                                </Box>
                              )}
                              {appointment.wait_time && (
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Wait Time
                                  </Typography>
                                  <Typography variant="body2">{appointment.wait_time} minutes</Typography>
                                </Box>
                              )}
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            
            {paginatedAppointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No appointments found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'Try adjusting your search terms' : 'No appointments to display'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {showPagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredAppointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedAppointment) onEdit(selectedAppointment);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          // Reschedule logic
          handleMenuClose();
        }}>
          <EventRepeat sx={{ mr: 1 }} fontSize="small" />
          Reschedule
        </MenuItem>
        <MenuItem onClick={() => {
          // Contact patient
          handleMenuClose();
        }}>
          <Phone sx={{ mr: 1 }} fontSize="small" />
          Contact Patient
        </MenuItem>
        <MenuItem onClick={() => {
          // Send reminder
          handleMenuClose();
        }}>
          <Email sx={{ mr: 1 }} fontSize="small" />
          Send Reminder
        </MenuItem>
        <MenuItem onClick={() => {
          // Process payment
          handleMenuClose();
        }}>
          <AttachMoney sx={{ mr: 1 }} fontSize="small" />
          Process Payment
        </MenuItem>
        <MenuItem 
          onClick={handleCancelAppointment}
          sx={{ color: 'error.main' }}
        >
          <Cancel sx={{ mr: 1 }} fontSize="small" />
          Cancel Appointment
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AppointmentList;