import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  AlertTitle,
  Stack,
  Tooltip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Gavel as GavelIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  CreditCard as CreditCardIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { showNotification } from '../store/slices/notificationSlice';
import { format } from 'date-fns';

interface InsuranceCompany {
  id: string;
  name: string;
  phone: string;
  address: string;
  planTypes: string[];
  activePatients: number;
  totalClaims: number;
  averageApprovalRate: number;
  averageProcessingDays: number;
}

interface InsurancePlan {
  id: string;
  patientId: string;
  patientName: string;
  companyName: string;
  planName: string;
  planType: 'HMO' | 'PPO' | 'POS' | 'EPO' | 'HDHP';
  policyNumber: string;
  memberID: string;
  effectiveDate: string;
  expirationDate: string;
  isActive: boolean;
  isPrimary: boolean;
  isVerified: boolean;
  verifiedDate?: string;
  coverageDetails: {
    deductible: { individual: number; family: number; met: number };
    outOfPocketMax: { individual: number; family: number; met: number };
    copay: {
      primaryCare: number;
      specialist: number;
      emergency: number;
      urgentCare: number;
    };
  };
}

interface InsuranceClaim {
  id: string;
  claimNumber: string;
  patientName: string;
  insuranceCompany: string;
  serviceDate: string;
  claimDate: string;
  billedAmount: number;
  allowedAmount: number;
  paidAmount: number;
  patientResponsibility: number;
  status: 'draft' | 'submitted' | 'pending' | 'approved' | 'partially_approved' | 'denied' | 'appealed' | 'paid';
  diagnosisCodes: string[];
  procedureCodes: string[];
  denialReason?: string;
  appealDeadline?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`insurance-tabpanel-${index}`}
      aria-labelledby={`insurance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Insurance: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);

  // Mock data
  const [companies] = useState<InsuranceCompany[]>([
    {
      id: '1',
      name: 'Blue Cross Blue Shield',
      phone: '1-800-262-2583',
      address: '123 Insurance Blvd, Chicago, IL',
      planTypes: ['HMO', 'PPO', 'HDHP'],
      activePatients: 156,
      totalClaims: 892,
      averageApprovalRate: 87,
      averageProcessingDays: 12,
    },
    {
      id: '2',
      name: 'United Healthcare',
      phone: '1-800-357-0978',
      address: '456 Health Ave, Minneapolis, MN',
      planTypes: ['HMO', 'PPO', 'POS', 'EPO'],
      activePatients: 134,
      totalClaims: 756,
      averageApprovalRate: 91,
      averageProcessingDays: 10,
    },
    {
      id: '3',
      name: 'Aetna',
      phone: '1-800-872-3862',
      address: '789 Coverage St, Hartford, CT',
      planTypes: ['HMO', 'PPO', 'EPO'],
      activePatients: 98,
      totalClaims: 523,
      averageApprovalRate: 85,
      averageProcessingDays: 14,
    },
  ]);

  const [plans] = useState<InsurancePlan[]>([
    {
      id: '1',
      patientId: 'p1',
      patientName: 'John Doe',
      companyName: 'Blue Cross Blue Shield',
      planName: 'BCBS Gold PPO',
      planType: 'PPO',
      policyNumber: 'BCBS123456',
      memberID: 'MB789012',
      effectiveDate: '2023-01-01',
      expirationDate: '2024-12-31',
      isActive: true,
      isPrimary: true,
      isVerified: true,
      verifiedDate: '2023-12-15',
      coverageDetails: {
        deductible: { individual: 1000, family: 2000, met: 650 },
        outOfPocketMax: { individual: 5000, family: 10000, met: 1200 },
        copay: {
          primaryCare: 20,
          specialist: 40,
          emergency: 150,
          urgentCare: 50,
        },
      },
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Jane Smith',
      companyName: 'United Healthcare',
      planName: 'UHC Choice Plus',
      planType: 'HMO',
      policyNumber: 'UHC987654',
      memberID: 'UH321098',
      effectiveDate: '2023-03-01',
      expirationDate: '2024-02-28',
      isActive: true,
      isPrimary: true,
      isVerified: false,
      coverageDetails: {
        deductible: { individual: 500, family: 1500, met: 200 },
        outOfPocketMax: { individual: 3000, family: 6000, met: 500 },
        copay: {
          primaryCare: 15,
          specialist: 30,
          emergency: 100,
          urgentCare: 40,
        },
      },
    },
  ]);

  const [claims] = useState<InsuranceClaim[]>([
    {
      id: '1',
      claimNumber: 'CLM-202312-0001',
      patientName: 'John Doe',
      insuranceCompany: 'Blue Cross Blue Shield',
      serviceDate: '2023-12-01',
      claimDate: '2023-12-05',
      billedAmount: 1500,
      allowedAmount: 1200,
      paidAmount: 960,
      patientResponsibility: 240,
      status: 'paid',
      diagnosisCodes: ['J45.909', 'R05'],
      procedureCodes: ['99213', '94640'],
    },
    {
      id: '2',
      claimNumber: 'CLM-202312-0002',
      patientName: 'Jane Smith',
      insuranceCompany: 'United Healthcare',
      serviceDate: '2023-12-10',
      claimDate: '2023-12-12',
      billedAmount: 2500,
      allowedAmount: 2000,
      paidAmount: 0,
      patientResponsibility: 0,
      status: 'pending',
      diagnosisCodes: ['M54.5', 'M79.3'],
      procedureCodes: ['99214', '97110'],
    },
    {
      id: '3',
      claimNumber: 'CLM-202312-0003',
      patientName: 'Robert Johnson',
      insuranceCompany: 'Aetna',
      serviceDate: '2023-12-08',
      claimDate: '2023-12-10',
      billedAmount: 3000,
      allowedAmount: 0,
      paidAmount: 0,
      patientResponsibility: 3000,
      status: 'denied',
      diagnosisCodes: ['E11.9'],
      procedureCodes: ['99215', '83036'],
      denialReason: 'Pre-authorization required',
      appealDeadline: '2024-06-10',
    },
  ]);

  const [claimStats] = useState({
    totalClaims: 156,
    pendingClaims: 23,
    approvedClaims: 118,
    deniedClaims: 15,
    totalBilled: 245680,
    totalPaid: 189430,
    averageApprovalTime: 12,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleVerifyInsurance = async (plan: InsurancePlan) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      dispatch(showNotification({
        message: 'Insurance verified successfully',
        severity: 'success',
      }));
      setVerifyDialogOpen(false);
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to verify insurance',
        severity: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaim = async (claim: any) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      dispatch(showNotification({
        message: 'Claim submitted successfully',
        severity: 'success',
      }));
      setClaimDialogOpen(false);
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to submit claim',
        severity: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleAppealClaim = (claim: InsuranceClaim) => {
    dispatch(showNotification({
      message: 'Appeal form opened',
      severity: 'info',
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
      case 'approved':
        return 'success';
      case 'pending':
      case 'submitted':
        return 'warning';
      case 'denied':
      case 'expired':
        return 'error';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateDeductibleProgress = (deductible: any) => {
    return (deductible.met / deductible.individual) * 100;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Insurance Management</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            sx={{ mr: 1 }}
          >
            Import EDI
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add Insurance
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Plans
                  </Typography>
                  <Typography variant="h4">
                    {plans.filter(p => p.isActive).length}
                  </Typography>
                </Box>
                <CreditCardIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pending Claims
                  </Typography>
                  <Typography variant="h4">
                    {claimStats.pendingClaims}
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Approval Rate
                  </Typography>
                  <Typography variant="h4">
                    {Math.round((claimStats.approvedClaims / claimStats.totalClaims) * 100)}%
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Paid
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(claimStats.totalPaid)}
                  </Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Insurance Plans" icon={<CreditCardIcon />} iconPosition="start" />
          <Tab label="Claims" icon={<AssignmentIcon />} iconPosition="start" />
          <Tab label="Companies" icon={<BusinessIcon />} iconPosition="start" />
          <Tab label="Pre-Authorization" icon={<LocalHospitalIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Insurance Plans Tab */}
      <TabPanel value={activeTab} index={0}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search insurance plans..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Insurance Company</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Policy Number</TableCell>
                <TableCell>Member ID</TableCell>
                <TableCell>Effective Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Verification</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id} hover>
                  <TableCell>{plan.patientName}</TableCell>
                  <TableCell>{plan.companyName}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{plan.planName}</Typography>
                      <Chip label={plan.planType} size="small" />
                    </Box>
                  </TableCell>
                  <TableCell>{plan.policyNumber}</TableCell>
                  <TableCell>{plan.memberID}</TableCell>
                  <TableCell>{format(new Date(plan.effectiveDate), 'MM/dd/yyyy')}</TableCell>
                  <TableCell>
                    <Chip
                      label={plan.isActive ? 'Active' : 'Expired'}
                      color={plan.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {plan.isVerified ? (
                      <Tooltip title={`Verified on ${format(new Date(plan.verifiedDate!), 'MM/dd/yyyy')}`}>
                        <CheckCircleIcon color="success" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Not verified">
                        <WarningIcon color="warning" />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, plan)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Claims Tab */}
      <TabPanel value={activeTab} index={1}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search claims..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="denied">Denied</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setClaimDialogOpen(true)}
          >
            New Claim
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Claim #</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Insurance</TableCell>
                <TableCell>Service Date</TableCell>
                <TableCell align="right">Billed</TableCell>
                <TableCell align="right">Allowed</TableCell>
                <TableCell align="right">Paid</TableCell>
                <TableCell align="right">Patient Resp.</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id} hover>
                  <TableCell>{claim.claimNumber}</TableCell>
                  <TableCell>{claim.patientName}</TableCell>
                  <TableCell>{claim.insuranceCompany}</TableCell>
                  <TableCell>{format(new Date(claim.serviceDate), 'MM/dd/yyyy')}</TableCell>
                  <TableCell align="right">{formatCurrency(claim.billedAmount)}</TableCell>
                  <TableCell align="right">{formatCurrency(claim.allowedAmount)}</TableCell>
                  <TableCell align="right">{formatCurrency(claim.paidAmount)}</TableCell>
                  <TableCell align="right">{formatCurrency(claim.patientResponsibility)}</TableCell>
                  <TableCell>
                    <Chip
                      label={claim.status.toUpperCase()}
                      color={getStatusColor(claim.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => {
                          setSelectedItem(claim);
                          setDetailsDialogOpen(true);
                        }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {claim.status === 'denied' && claim.appealDeadline && (
                        <Tooltip title="File Appeal">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleAppealClaim(claim)}
                          >
                            <GavelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Companies Tab */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          {companies.map((company) => (
            <Grid item xs={12} md={6} lg={4} key={company.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6">{company.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {company.phone}
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {company.address}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    {company.planTypes.map((type) => (
                      <Chip key={type} label={type} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Active Patients</Typography>
                      <Typography variant="h6">{company.activePatients}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Total Claims</Typography>
                      <Typography variant="h6">{company.totalClaims}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Approval Rate</Typography>
                      <Typography variant="h6">{company.averageApprovalRate}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Avg. Processing</Typography>
                      <Typography variant="h6">{company.averageProcessingDays} days</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Pre-Authorization Tab */}
      <TabPanel value={activeTab} index={3}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Pre-Authorization Management</AlertTitle>
          Track and manage pre-authorization requests for procedures and treatments.
        </Alert>
        
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <LocalHospitalIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Pre-Authorization feature coming soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage pre-authorization requests, track approvals, and automate submissions
          </Typography>
        </Box>
      </TabPanel>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          setDetailsDialogOpen(true);
          handleMenuClose();
        }}>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          setVerifyDialogOpen(true);
          handleMenuClose();
        }}>
          <ListItemText>Verify Eligibility</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemText>Deactivate</ListItemText>
        </MenuItem>
      </Menu>

      {/* Insurance Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedItem?.planName || selectedItem?.claimNumber || 'Details'}
        </DialogTitle>
        <DialogContent>
          {selectedItem && 'coverageDetails' in selectedItem && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Plan Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Patient" secondary={selectedItem.patientName} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Insurance Company" secondary={selectedItem.companyName} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Plan Type" secondary={selectedItem.planType} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Policy Number" secondary={selectedItem.policyNumber} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Coverage Details</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Deductible Progress</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={calculateDeductibleProgress(selectedItem.coverageDetails.deductible)}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2">
                      {formatCurrency(selectedItem.coverageDetails.deductible.met)} / {formatCurrency(selectedItem.coverageDetails.deductible.individual)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle2" gutterBottom>Copay Amounts</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Primary Care"
                      secondary={formatCurrency(selectedItem.coverageDetails.copay.primaryCare)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Specialist"
                      secondary={formatCurrency(selectedItem.coverageDetails.copay.specialist)}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}
          
          {selectedItem && 'diagnosisCodes' in selectedItem && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Claim Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Claim Number" secondary={selectedItem.claimNumber} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Patient" secondary={selectedItem.patientName} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Service Date" secondary={format(new Date(selectedItem.serviceDate), 'MM/dd/yyyy')} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Status" secondary={
                      <Chip
                        label={selectedItem.status.toUpperCase()}
                        color={getStatusColor(selectedItem.status)}
                        size="small"
                      />
                    } />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Financial Details</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Billed Amount" secondary={formatCurrency(selectedItem.billedAmount)} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Allowed Amount" secondary={formatCurrency(selectedItem.allowedAmount)} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Paid Amount" secondary={formatCurrency(selectedItem.paidAmount)} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Patient Responsibility" secondary={formatCurrency(selectedItem.patientResponsibility)} />
                  </ListItem>
                </List>
              </Grid>
              {selectedItem.denialReason && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    <AlertTitle>Denial Reason</AlertTitle>
                    {selectedItem.denialReason}
                    {selectedItem.appealDeadline && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Appeal deadline: {format(new Date(selectedItem.appealDeadline), 'MM/dd/yyyy')}
                      </Typography>
                    )}
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Verify Insurance Dialog */}
      <Dialog
        open={verifyDialogOpen}
        onClose={() => setVerifyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Verify Insurance Eligibility</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This will check the patient's current eligibility status with the insurance company.
          </Alert>
          {selectedItem && (
            <List>
              <ListItem>
                <ListItemText primary="Patient" secondary={selectedItem.patientName} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Insurance" secondary={selectedItem.companyName} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Policy Number" secondary={selectedItem.policyNumber} />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleVerifyInsurance(selectedItem)}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Verifying...' : 'Verify Eligibility'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Insurance;