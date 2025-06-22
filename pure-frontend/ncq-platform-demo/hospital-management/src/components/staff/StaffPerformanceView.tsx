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
  LinearProgress,
  Rating,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Add,
  Assessment,
  TrendingUp,
  TrendingDown,
  Star,
  Edit,
  Visibility,
  MoreVert,
  Person,
  Schedule,
  Assignment,
  CheckCircle,
  Warning,
  CalendarMonth,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO, subMonths } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { showNotification } from '../../store/slices/notificationSlice';

interface PerformanceReview {
  id: string;
  staff_id: string;
  staff_name: string;
  review_period: string;
  review_type: string;
  overall_rating: string;
  overall_score: number;
  status: string;
  attendance_rate: number;
  punctuality_rate: number;
  goals_achieved: number;
  goals_total: number;
  strengths: string[];
  improvement_areas: string[];
  reviewer_name: string;
  review_date: string;
  next_review_date: string;
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
      id={`performance-tabpanel-${index}`}
      aria-labelledby={`performance-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const StaffPerformanceView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff } = useSelector((state: RootState) => state.staff);
  
  const [tabValue, setTabValue] = useState(0);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviewDetails, setShowReviewDetails] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Mock performance data
  useEffect(() => {
    const mockReviews: PerformanceReview[] = [
      {
        id: '1',
        staff_id: '1',
        staff_name: 'Sarah Johnson',
        review_period: '2024 Q1',
        review_type: 'quarterly',
        overall_rating: 'exceeds_expectations',
        overall_score: 4.2,
        status: 'completed',
        attendance_rate: 96.5,
        punctuality_rate: 98.2,
        goals_achieved: 8,
        goals_total: 10,
        strengths: ['Patient Care', 'Team Leadership', 'Emergency Response'],
        improvement_areas: ['Documentation', 'Time Management'],
        reviewer_name: 'Dr. Smith',
        review_date: '2024-04-15',
        next_review_date: '2024-07-15',
      },
      {
        id: '2',
        staff_id: '2',
        staff_name: 'Michael Davis',
        review_period: '2024 Q1',
        review_type: 'quarterly',
        overall_rating: 'meets_expectations',
        overall_score: 3.8,
        status: 'completed',
        attendance_rate: 94.2,
        punctuality_rate: 92.5,
        goals_achieved: 6,
        goals_total: 8,
        strengths: ['Technical Skills', 'Equipment Handling'],
        improvement_areas: ['Communication', 'Initiative'],
        reviewer_name: 'Manager Johnson',
        review_date: '2024-04-10',
        next_review_date: '2024-07-10',
      },
      {
        id: '3',
        staff_id: '3',
        staff_name: 'Emily Rodriguez',
        review_period: '2024 Q2',
        review_type: 'quarterly',
        overall_rating: 'outstanding',
        overall_score: 4.7,
        status: 'pending',
        attendance_rate: 98.8,
        punctuality_rate: 99.1,
        goals_achieved: 9,
        goals_total: 9,
        strengths: ['Patient Counseling', 'Drug Knowledge', 'Accuracy'],
        improvement_areas: ['Leadership Development'],
        reviewer_name: 'Pharmacy Director',
        review_date: '2024-06-20',
        next_review_date: '2024-09-20',
      },
    ];
    setPerformanceReviews(mockReviews);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, review: PerformanceReview) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const handleViewDetails = () => {
    setShowReviewDetails(true);
    handleMenuClose();
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'outstanding':
        return 'success';
      case 'exceeds_expectations':
        return 'info';
      case 'meets_expectations':
        return 'primary';
      case 'below_expectations':
        return 'warning';
      case 'unsatisfactory':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRatingLabel = (rating: string) => {
    switch (rating) {
      case 'outstanding':
        return 'Outstanding';
      case 'exceeds_expectations':
        return 'Exceeds Expectations';
      case 'meets_expectations':
        return 'Meets Expectations';
      case 'below_expectations':
        return 'Below Expectations';
      case 'unsatisfactory':
        return 'Unsatisfactory';
      default:
        return rating;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'draft':
        return 'default';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculatePerformanceStats = () => {
    const completed = performanceReviews.filter(r => r.status === 'completed').length;
    const pending = performanceReviews.filter(r => r.status === 'pending').length;
    const overdue = performanceReviews.filter(r => r.status === 'overdue').length;
    const avgScore = performanceReviews.reduce((sum, r) => sum + r.overall_score, 0) / performanceReviews.length || 0;

    return {
      completed,
      pending,
      overdue,
      avgScore: Math.round(avgScore * 10) / 10,
    };
  };

  const stats = calculatePerformanceStats();

  const filteredReviews = performanceReviews.filter(review => {
    if (filterPeriod === 'all') return true;
    return review.review_period.includes(filterPeriod);
  });

  const paginatedReviews = filteredReviews.slice(
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

  const renderPerformanceOverview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Trends
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Performance trend chart would be displayed here showing:
                - Overall score trends over time
                - Department comparison
                - Goal achievement rates
                - Attendance and punctuality trends
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Star color="primary" />
                  <Box>
                    <Typography variant="h6">
                      {stats.avgScore}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Score
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle color="success" />
                  <Box>
                    <Typography variant="h6">
                      {stats.completed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Reviews
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Warning color="warning" />
                  <Box>
                    <Typography variant="h6">
                      {stats.pending}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Reviews
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderPerformanceReviews = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Performance Reviews ({filteredReviews.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowReviewForm(true)}
        >
          New Review
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Period</InputLabel>
                <Select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  label="Filter by Period"
                >
                  <MenuItem value="all">All Periods</MenuItem>
                  <MenuItem value="2024 Q1">2024 Q1</MenuItem>
                  <MenuItem value="2024 Q2">2024 Q2</MenuItem>
                  <MenuItem value="2024 Q3">2024 Q3</MenuItem>
                  <MenuItem value="2024 Q4">2024 Q4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Staff Member</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Overall Rating</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Goals</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Review Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No performance reviews found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReviews.map((review) => (
                    <TableRow key={review.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                            {review.staff_name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {review.staff_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {review.staff_id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {review.review_period}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={review.review_type}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRatingLabel(review.overall_rating)}
                          size="small"
                          color={getRatingColor(review.overall_rating) as any}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating
                            value={review.overall_score}
                            max={5}
                            precision={0.1}
                            size="small"
                            readOnly
                          />
                          <Typography variant="body2">
                            {review.overall_score}/5
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {review.goals_achieved}/{review.goals_total}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(review.goals_achieved / review.goals_total) * 100}
                            sx={{ width: 50, ml: 1 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={review.status}
                          size="small"
                          color={getStatusColor(review.status) as any}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(parseISO(review.review_date), 'MMM d, yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, review)}
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
            count={filteredReviews.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Staff Performance Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage staff performance reviews and development
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Assessment color="primary" />
                  <Box>
                    <Typography variant="h6">
                      {performanceReviews.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Reviews
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
                      {stats.completed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
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
                  <Schedule color="warning" />
                  <Box>
                    <Typography variant="h6">
                      {stats.pending}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
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
                  <Star color="info" />
                  <Box>
                    <Typography variant="h6">
                      {stats.avgScore}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Score
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<TrendingUp />} label="Overview" />
            <Tab icon={<Assignment />} label="Reviews" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              {renderPerformanceOverview()}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              {renderPerformanceReviews()}
            </Box>
          </TabPanel>
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
          <MenuItem onClick={() => handleMenuClose()}>
            <Edit sx={{ mr: 1 }} />
            Edit Review
          </MenuItem>
        </Menu>

        {/* Review Details Dialog */}
        <Dialog
          open={showReviewDetails}
          onClose={() => setShowReviewDetails(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Performance Review Details
          </DialogTitle>
          <DialogContent>
            {selectedReview && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      {selectedReview.staff_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {selectedReview.review_period} • {selectedReview.review_type}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Overall Rating
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Chip
                          label={getRatingLabel(selectedReview.overall_rating)}
                          color={getRatingColor(selectedReview.overall_rating) as any}
                        />
                        <Rating
                          value={selectedReview.overall_score}
                          max={5}
                          precision={0.1}
                          readOnly
                        />
                        <Typography variant="body2">
                          {selectedReview.overall_score}/5
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Key Metrics
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Attendance Rate
                          </Typography>
                          <Typography variant="body1">
                            {selectedReview.attendance_rate}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Punctuality Rate
                          </Typography>
                          <Typography variant="body1">
                            {selectedReview.punctuality_rate}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Goals Achieved
                          </Typography>
                          <Typography variant="body1">
                            {selectedReview.goals_achieved}/{selectedReview.goals_total}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Reviewer
                          </Typography>
                          <Typography variant="body1">
                            {selectedReview.reviewer_name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Strengths
                      </Typography>
                      {selectedReview.strengths.map((strength, index) => (
                        <Chip
                          key={index}
                          label={strength}
                          size="small"
                          color="success"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Areas for Improvement
                      </Typography>
                      {selectedReview.improvement_areas.map((area, index) => (
                        <Chip
                          key={index}
                          label={area}
                          size="small"
                          color="warning"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" color="text.secondary">
                      Review Date: {format(parseISO(selectedReview.review_date), 'MMM d, yyyy')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Next Review: {format(parseISO(selectedReview.next_review_date), 'MMM d, yyyy')}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowReviewDetails(false)}>
              Close
            </Button>
            <Button variant="contained">
              Edit Review
            </Button>
          </DialogActions>
        </Dialog>

        {/* Performance Review Form Dialog would go here */}
      </Box>
    </LocalizationProvider>
  );
};

export default StaffPerformanceView;