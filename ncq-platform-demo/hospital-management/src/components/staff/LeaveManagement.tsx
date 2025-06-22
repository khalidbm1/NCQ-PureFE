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
  Paper,
  Avatar,
  Tabs,
  Tab,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Add,
  CheckCircle,
  Cancel,
  Schedule,
  Warning,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  CalendarMonth,
  EventAvailable,
  EventBusy,
  Pending,
  Approval,
  Description,
  Person,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { showNotification } from '../../store/slices/notificationSlice';

interface LeaveRequest {
  id: string;
  staff_id: string;
  staff_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewer_comments?: string;
  is_emergency: boolean;
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
      id={`leave-tabpanel-${index}`}
      aria-labelledby={`leave-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const LeaveManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff } = useSelector((state: RootState) => state.staff);
  
  const [tabValue, setTabValue] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock leave requests data
  useEffect(() => {
    const mockLeaveRequests: LeaveRequest[] = [
      {
        id: '1',
        staff_id: '1',
        staff_name: 'Sarah Johnson',
        leave_type: 'annual',
        start_date: '2024-06-15',
        end_date: '2024-06-19',
        total_days: 5,
        reason: 'Family vacation',
        status: 'pending',
        submitted_at: '2024-06-01T10:00:00Z',
        is_emergency: false,
      },
      {
        id: '2',
        staff_id: '2',
        staff_name: 'Michael Davis',
        leave_type: 'sick',
        start_date: '2024-06-10',
        end_date: '2024-06-12',
        total_days: 3,
        reason: 'Flu symptoms',
        status: 'approved',
        submitted_at: '2024-06-09T08:00:00Z',
        reviewed_at: '2024-06-09T14:00:00Z',
        reviewer_comments: 'Approved - medical certificate provided',
        is_emergency: true,
      },
      {
        id: '3',
        staff_id: '3',
        staff_name: 'Emily Rodriguez',
        leave_type: 'annual',
        start_date: '2024-07-01',
        end_date: '2024-07-05',
        total_days: 5,
        reason: 'Wedding celebration',
        status: 'rejected',
        submitted_at: '2024-05-20T15:00:00Z',
        reviewed_at: '2024-05-21T09:00:00Z',
        reviewer_comments: 'Rejected - insufficient leave balance',
        is_emergency: false,
      },
    ];
    setLeaveRequests(mockLeaveRequests);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, request: LeaveRequest) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(request);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequest(null);
  };

  const handleApprove = () => {
    setShowApprovalDialog(true);
    handleMenuClose();
  };

  const handleReject = () => {
    if (selectedRequest) {
      setLeaveRequests(requests => 
        requests.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'rejected', reviewed_at: new Date().toISOString() }
            : req
        )
      );
      dispatch(showNotification({
        message: 'Leave request rejected',
        severity: 'warning',
      }));
    }
    handleMenuClose();
  };

  const confirmApproval = () => {
    if (selectedRequest) {
      setLeaveRequests(requests => 
        requests.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'approved', reviewed_at: new Date().toISOString() }
            : req
        )
      );
      dispatch(showNotification({
        message: 'Leave request approved successfully',
        severity: 'success',
      }));
    }
    setShowApprovalDialog(false);
    setSelectedRequest(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual':
        return 'primary';
      case 'sick':
        return 'error';
      case 'maternity':
      case 'paternity':
        return 'info';
      case 'emergency':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case 'annual':
        return 'Annual Leave';
      case 'sick':
        return 'Sick Leave';
      case 'maternity':
        return 'Maternity Leave';
      case 'paternity':
        return 'Paternity Leave';
      case 'emergency':
        return 'Emergency Leave';
      case 'bereavement':
        return 'Bereavement Leave';
      case 'unpaid':
        return 'Unpaid Leave';
      default:
        return type;
    }
  };

  const calculateLeaveStats = () => {
    const total = leaveRequests.length;
    const pending = leaveRequests.filter(r => r.status === 'pending').length;
    const approved = leaveRequests.filter(r => r.status === 'approved').length;
    const rejected = leaveRequests.filter(r => r.status === 'rejected').length;
    const totalDays = leaveRequests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.total_days, 0);

    return { total, pending, approved, rejected, totalDays };
  };

  const stats = calculateLeaveStats();

  const filteredRequests = leaveRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderLeaveRequestsTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Staff Member</TableCell>
            <TableCell>Leave Type</TableCell>
            <TableCell>Dates</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Submitted</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No leave requests found
              </TableCell>
            </TableRow>
          ) : (
            paginatedRequests.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                      {request.staff_name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {request.staff_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {request.staff_id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={getLeaveTypeLabel(request.leave_type)}
                      size="small"
                      color={getLeaveTypeColor(request.leave_type) as any}
                    />
                    {request.is_emergency && (
                      <Warning color="warning" fontSize="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {format(parseISO(request.start_date), 'MMM d')} - {format(parseISO(request.end_date), 'MMM d, yyyy')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {request.total_days} day{request.total_days !== 1 ? 's' : ''}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {request.reason}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.status}
                    size="small"
                    color={getStatusColor(request.status) as any}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {format(parseISO(request.submitted_at), 'MMM d, yyyy')}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, request)}
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Leave Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowLeaveForm(true)}
          >
            Request Leave
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Pending color="warning" />
                  <Box>
                    <Typography variant="h6">
                      {stats.pending}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Requests
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
                  <CheckCircle color="success" />
                  <Box>
                    <Typography variant="h6">
                      {stats.approved}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Approved
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
                      {stats.rejected}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rejected
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
                  <CalendarMonth color="primary" />
                  <Box>
                    <Typography variant="h6">
                      {stats.totalDays}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Days Approved
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Filter by Status"
                  >
                    <MenuItem value="all">All Requests</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Leave Requests Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Leave Requests ({filteredRequests.length} total)
            </Typography>
            
            {renderLeaveRequestsTable()}

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRequests.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuClose()}>
            <Visibility sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          {selectedRequest?.status === 'pending' && (
            <>
              <MenuItem onClick={handleApprove}>
                <CheckCircle sx={{ mr: 1 }} color="success" />
                Approve
              </MenuItem>
              <MenuItem onClick={handleReject}>
                <Cancel sx={{ mr: 1 }} color="error" />
                Reject
              </MenuItem>
            </>
          )}
          <MenuItem onClick={() => handleMenuClose()}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        </Menu>

        {/* Approval Dialog */}
        <Dialog
          open={showApprovalDialog}
          onClose={() => setShowApprovalDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Approve Leave Request
          </DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Staff: {selectedRequest.staff_name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Leave Type: {getLeaveTypeLabel(selectedRequest.leave_type)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Duration: {format(parseISO(selectedRequest.start_date), 'MMM d')} - {format(parseISO(selectedRequest.end_date), 'MMM d, yyyy')} ({selectedRequest.total_days} days)
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Reason: {selectedRequest.reason}
                </Typography>
                
                <TextField
                  fullWidth
                  label="Approval Comments (Optional)"
                  multiline
                  rows={3}
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="success" onClick={confirmApproval}>
              Approve Request
            </Button>
          </DialogActions>
        </Dialog>

        {/* Leave Request Form */}
        <LeaveRequestForm
          open={showLeaveForm}
          onClose={() => setShowLeaveForm(false)}
          onSubmit={(formData) => {
            const newRequest: LeaveRequest = {
              id: Date.now().toString(),
              staff_id: formData.staff_id,
              staff_name: staff.find(s => s.id === formData.staff_id)?.first_name + ' ' + staff.find(s => s.id === formData.staff_id)?.last_name || '',
              leave_type: formData.leave_type,
              start_date: format(formData.start_date, 'yyyy-MM-dd'),
              end_date: format(formData.end_date, 'yyyy-MM-dd'),
              total_days: differenceInDays(formData.end_date, formData.start_date) + 1,
              reason: formData.reason,
              status: 'pending',
              submitted_at: new Date().toISOString(),
              is_emergency: formData.is_emergency,
            };

            setLeaveRequests(prev => [newRequest, ...prev]);
            dispatch(showNotification({
              message: 'Leave request submitted successfully',
              severity: 'success',
            }));
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

// Leave Request Form Component
interface LeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ open, onClose, onSubmit }) => {
  const { staff } = useSelector((state: RootState) => state.staff);
  const [formData, setFormData] = useState({
    staff_id: '',
    leave_type: 'annual',
    start_date: new Date(),
    end_date: new Date(),
    reason: '',
    is_emergency: false,
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    setFormData({
      staff_id: '',
      leave_type: 'annual',
      start_date: new Date(),
      end_date: new Date(),
      reason: '',
      is_emergency: false,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Submit Leave Request
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Staff Member</InputLabel>
              <Select
                value={formData.staff_id}
                onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                label="Staff Member"
              >
                {staff.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.first_name} {member.last_name} - {member.department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={formData.leave_type}
                onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                label="Leave Type"
              >
                <MenuItem value="annual">Annual Leave</MenuItem>
                <MenuItem value="sick">Sick Leave</MenuItem>
                <MenuItem value="maternity">Maternity Leave</MenuItem>
                <MenuItem value="paternity">Paternity Leave</MenuItem>
                <MenuItem value="emergency">Emergency Leave</MenuItem>
                <MenuItem value="bereavement">Bereavement Leave</MenuItem>
                <MenuItem value="unpaid">Unpaid Leave</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={formData.start_date}
              onChange={(date) => setFormData({ ...formData, start_date: date || new Date() })}
              renderInput={(params) => <TextField {...params} fullWidth required />}
              minDate={new Date()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={formData.end_date}
              onChange={(date) => setFormData({ ...formData, end_date: date || new Date() })}
              renderInput={(params) => <TextField {...params} fullWidth required />}
              minDate={formData.start_date}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason for Leave"
              multiline
              rows={4}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info">
              Duration: {differenceInDays(formData.end_date, formData.start_date) + 1} day(s)
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={!formData.staff_id || !formData.reason}
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveManagement;