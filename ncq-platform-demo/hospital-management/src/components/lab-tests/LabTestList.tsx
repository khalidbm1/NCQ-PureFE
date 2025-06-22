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
  IconButton,
  Chip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Tooltip,
  Typography,
  Button,
} from '@mui/material';
import {
  MoreVert,
  Search,
  Visibility,
  Edit,
  Print,
  CheckCircle,
  Schedule,
  Cancel,
  Science,
  Assignment,
  FilterList,
  Clear,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { LabTest } from '../../store/slices/labTestSlice';

interface LabTestListProps {
  labTests: LabTest[];
  onView?: (test: LabTest) => void;
  onEdit?: (test: LabTest) => void;
  onEnterResults?: (test: LabTest) => void;
  onPrint?: (test: LabTest) => void;
}

const LabTestList: React.FC<LabTestListProps> = ({
  labTests,
  onView,
  onEdit,
  onEnterResults,
  onPrint,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter tests
  const filteredTests = labTests.filter(test => {
    const matchesSearch = 
      test.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.test_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || test.test_category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || test.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, test: LabTest) => {
    setAnchorEl(event.currentTarget);
    setSelectedTest(test);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTest(null);
  };

  const handleAction = (action: string) => {
    if (!selectedTest) return;

    switch (action) {
      case 'view':
        onView?.(selectedTest);
        break;
      case 'edit':
        onEdit?.(selectedTest);
        break;
      case 'results':
        onEnterResults?.(selectedTest);
        break;
      case 'print':
        onPrint?.(selectedTest);
        break;
    }
    handleMenuClose();
  };

  const getStatusIcon = (status: LabTest['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle fontSize="small" />;
      case 'in_progress':
        return <Science fontSize="small" />;
      case 'sample_collected':
        return <Assignment fontSize="small" />;
      case 'ordered':
        return <Schedule fontSize="small" />;
      case 'cancelled':
        return <Cancel fontSize="small" />;
      default:
        return undefined;
    }
  };

  const getStatusColor = (status: LabTest['status']): any => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'sample_collected': return 'info';
      case 'ordered': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: LabTest['priority']): any => {
    switch (priority) {
      case 'stat': return 'error';
      case 'urgent': return 'warning';
      case 'routine': return 'default';
      default: return 'default';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all';

  return (
    <Paper>
      {/* Filters */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="ordered">Ordered</MenuItem>
                <MenuItem value="sample_collected">Sample Collected</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="hematology">Hematology</MenuItem>
                <MenuItem value="biochemistry">Biochemistry</MenuItem>
                <MenuItem value="microbiology">Microbiology</MenuItem>
                <MenuItem value="immunology">Immunology</MenuItem>
                <MenuItem value="pathology">Pathology</MenuItem>
                <MenuItem value="radiology">Radiology</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                label="Priority"
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="routine">Routine</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="stat">STAT</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              {hasActiveFilters && (
                <Button
                  size="small"
                  startIcon={<Clear />}
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
              <Chip
                icon={<FilterList />}
                label={`${filteredTests.length} results`}
                size="small"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test ID</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ordered Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((test) => (
                <TableRow key={test.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {test.test_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{test.patient_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {test.patient_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {test.test_name}
                    </Typography>
                    {test.notes && (
                      <Tooltip title={test.notes}>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                          {test.notes}
                        </Typography>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={test.test_category}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={test.priority.toUpperCase()}
                      size="small"
                      color={getPriorityColor(test.priority)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(test.status)}
                      label={test.status.replace('_', ' ')}
                      size="small"
                      color={getStatusColor(test.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(test.ordered_date), 'dd MMM yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(test.ordered_date), 'HH:mm')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, test)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Results
        </MenuItem>
        {selectedTest?.status === 'ordered' && (
          <MenuItem onClick={() => handleAction('results')}>
            <Science fontSize="small" sx={{ mr: 1 }} />
            Enter Results
          </MenuItem>
        )}
        {selectedTest?.status === 'in_progress' && (
          <MenuItem onClick={() => handleAction('results')}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Update Results
          </MenuItem>
        )}
        <MenuItem onClick={() => handleAction('print')}>
          <Print fontSize="small" sx={{ mr: 1 }} />
          Print Report
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default LabTestList;