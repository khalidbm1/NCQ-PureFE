import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  Work,
  LocationOn,
  Person,
  Badge,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchStaff, updateStaff, deleteStaff } from '../../store/slices/staffSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import StaffForm from './StaffForm';

interface StaffMember {
  id: string;
  staff_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employee_type: string;
  employment_status: string;
  hire_date: string;
  base_salary: number;
  is_active: boolean;
  created_at: string;
}

const StaffList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff, loading, error, filters } = useSelector((state: RootState) => state.staff);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchStaff(filters));
  }, [dispatch, filters]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, staff: StaffMember) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaff(staff);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStaff(null);
  };

  const handleViewDetails = () => {
    setShowDetailsDialog(true);
    handleMenuClose();
  };

  const handleEdit = () => {
    setShowEditForm(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (selectedStaff) {
      try {
        await dispatch(deleteStaff(selectedStaff.id)).unwrap();
        dispatch(showNotification({
          message: 'Staff member deleted successfully',
          severity: 'success',
        }));
        setShowDeleteDialog(false);
        setSelectedStaff(null);
      } catch (error) {
        dispatch(showNotification({
          message: 'Failed to delete staff member',
          severity: 'error',
        }));
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'on_leave':
        return 'warning';
      case 'terminated':
        return 'error';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEmployeeTypeLabel = (type: string) => {
    switch (type) {
      case 'full_time':
        return 'Full Time';
      case 'part_time':
        return 'Part Time';
      case 'contract':
        return 'Contract';
      case 'intern':
        return 'Intern';
      case 'volunteer':
        return 'Volunteer';
      default:
        return type;
    }
  };

  const filteredStaff = staff.filter((staffMember: StaffMember) => {
    const matchesSearch = 
      staffMember.first_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      staffMember.last_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      staffMember.staff_id.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesDepartment = filters.department === 'all' || staffMember.department === filters.department;
    const matchesStatus = filters.status === 'all' || staffMember.employment_status === filters.status;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const paginatedStaff = filteredStaff.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Staff Directory ({filteredStaff.length} members)
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Staff</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Hire Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : paginatedStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No staff members found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStaff.map((staffMember: StaffMember) => (
                    <TableRow key={staffMember.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {staffMember.first_name[0]}{staffMember.last_name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {staffMember.first_name} {staffMember.last_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {staffMember.staff_id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {staffMember.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {staffMember.department}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {staffMember.position}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getEmployeeTypeLabel(staffMember.employee_type)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={staffMember.employment_status.replace('_', ' ')}
                          size="small"
                          color={getStatusColor(staffMember.employment_status) as any}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(staffMember.hire_date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, staffMember)}
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStaff.length}
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
        <MenuItem onClick={handleViewDetails}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Staff Details Dialog */}
      <Dialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Staff Details
        </DialogTitle>
        <DialogContent>
          {selectedStaff && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
                    {selectedStaff.first_name[0]}{selectedStaff.last_name[0]}
                  </Avatar>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">
                      {selectedStaff.first_name} {selectedStaff.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedStaff.staff_id}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Email color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {selectedStaff.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Phone color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1">
                          {selectedStaff.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Work color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Department
                        </Typography>
                        <Typography variant="body1">
                          {selectedStaff.department}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Badge color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Position
                        </Typography>
                        <Typography variant="body1">
                          {selectedStaff.position}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Person color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Employee Type
                        </Typography>
                        <Typography variant="body1">
                          {getEmployeeTypeLabel(selectedStaff.employee_type)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocationOn color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={selectedStaff.employment_status.replace('_', ' ')}
                          size="small"
                          color={getStatusColor(selectedStaff.employment_status) as any}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Hire Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedStaff.hire_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Base Salary
                    </Typography>
                    <Typography variant="body1">
                      ${selectedStaff.base_salary?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsDialog(false)}>
            Close
          </Button>
          <Button variant="contained" onClick={handleEdit}>
            Edit Staff
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedStaff?.first_name} {selectedStaff?.last_name}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Staff Form */}
      {showEditForm && selectedStaff && (
        <StaffForm
          open={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setSelectedStaff(null);
          }}
          staffData={selectedStaff}
          mode="edit"
        />
      )}
    </Box>
  );
};

export default StaffList;