import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Avatar,
  ListItemText,
  Menu,
  Divider,
  Tooltip,
  LinearProgress,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Add,
  Receipt,
  Payment,
  Search,
  FilterList,
  MoreVert,
  TrendingUp,
  TrendingDown,
  AccessTime,
  CheckCircle,
  Warning,
  Error,
  Print,
  Email,
  Delete,
  Edit,
  Visibility,
  AttachMoney,
  LocalHospital,
  CalendarToday,
  FileDownload,
  ReceiptLong,
  AccountBalance,
  CreditCard,
  Paid,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { format, parseISO, differenceInDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { AppDispatch, RootState } from '../store';
import {
  setSelectedInvoice,
  setFilters,
  clearFilters,
  updateInvoiceStatus,
  Invoice,
  Payment as PaymentType,
} from '../store/slices/billingSlice';
import { showNotification } from '../store/slices/notificationSlice';
import InvoiceDialog from './Billing/InvoiceDialog';
import InvoiceDetailsDialog from './Billing/InvoiceDetailsDialog';
import PaymentDialog from './Billing/PaymentDialog';

const Billing: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const {
    invoices,
    payments,
    services,
    loading,
    error,
    statistics,
    filters,
    selectedInvoice,
  } = useSelector((state: RootState) => state.billing);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Filter invoices based on filters
  const filteredInvoices = invoices.filter(invoice => {
    // Status filter
    if (filters.status !== 'all' && invoice.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const invoiceDate = parseISO(invoice.issue_date);
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          if (format(invoiceDate, 'yyyy-MM-dd') !== format(now, 'yyyy-MM-dd')) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (invoiceDate < weekAgo) return false;
          break;
        case 'month':
          const monthInterval = { start: startOfMonth(now), end: endOfMonth(now) };
          if (!isWithinInterval(invoiceDate, monthInterval)) return false;
          break;
        case '3months':
          const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          if (invoiceDate < threeMonthsAgo) return false;
          break;
      }
    }

    // Payment method filter
    if (filters.paymentMethod !== 'all') {
      const invoicePayments = payments.filter(p => p.invoice_id === invoice.id);
      if (!invoicePayments.some(p => p.payment_method === filters.paymentMethod)) {
        return false;
      }
    }

    // Search filter
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      return (
        invoice.invoice_number.toLowerCase().includes(searchLower) ||
        invoice.patient_name.toLowerCase().includes(searchLower) ||
        invoice.patient_email.toLowerCase().includes(searchLower) ||
        (invoice.doctor_name && invoice.doctor_name.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, invoiceId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedInvoiceId(invoiceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInvoiceId(null);
  };

  const handleCreateInvoice = () => {
    setEditMode(false);
    setOpenInvoiceDialog(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    dispatch(setSelectedInvoice(invoice));
    setEditMode(true);
    setOpenInvoiceDialog(true);
    handleMenuClose();
  };

  const handleViewInvoice = (invoice: Invoice) => {
    dispatch(setSelectedInvoice(invoice));
    setOpenDetailsDialog(true);
    handleMenuClose();
  };

  const handleRecordPayment = (invoice: Invoice) => {
    dispatch(setSelectedInvoice(invoice));
    setOpenPaymentDialog(true);
    handleMenuClose();
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        // In real app, dispatch deleteInvoice action
        dispatch(showNotification({
          message: 'Invoice deleted successfully',
          severity: 'success',
        }));
      } catch (error) {
        dispatch(showNotification({
          message: 'Failed to delete invoice',
          severity: 'error',
        }));
      }
    }
    handleMenuClose();
  };

  const handleSendInvoice = (invoice: Invoice) => {
    dispatch(showNotification({
      message: `Invoice sent to ${invoice.patient_email}`,
      severity: 'success',
    }));
    handleMenuClose();
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    window.print(); // In real app, generate PDF
    handleMenuClose();
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    dispatch(updateInvoiceStatus({ id: invoice.id, status: 'paid' }));
    dispatch(showNotification({
      message: 'Invoice marked as paid',
      severity: 'success',
    }));
    handleMenuClose();
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'partial':
        return 'warning';
      case 'pending':
        return 'info';
      case 'overdue':
        return 'error';
      case 'draft':
        return 'default';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle />;
      case 'partial':
        return <AccessTime />;
      case 'pending':
        return <AccessTime />;
      case 'overdue':
        return <Warning />;
      case 'draft':
        return <Receipt />;
      case 'cancelled':
        return <Error />;
      default:
        return <Receipt />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <AttachMoney />;
      case 'credit_card':
      case 'debit_card':
        return <CreditCard />;
      case 'bank_transfer':
        return <AccountBalance />;
      case 'insurance':
        return <LocalHospital />;
      default:
        return <Payment />;
    }
  };

  // Statistics cards data
  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${statistics.totalRevenue.toLocaleString()}`,
      icon: <TrendingUp />,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light,
    },
    {
      title: 'Pending Amount',
      value: `$${statistics.totalPending.toLocaleString()}`,
      icon: <AccessTime />,
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light,
    },
    {
      title: 'Overdue Amount',
      value: `$${statistics.totalOverdue.toLocaleString()}`,
      icon: <Warning />,
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light,
    },
    {
      title: 'This Month',
      value: `$${statistics.monthlyRevenue.toLocaleString()}`,
      icon: <CalendarToday />,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Billing & Invoices
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage invoices, payments, and financial transactions
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<LocalHospital />}
            onClick={() => {/* Open services dialog */}}
          >
            Services
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateInvoice}
          >
            New Invoice
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Success Rate
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Box flex={1}>
                  <LinearProgress
                    variant="determinate"
                    value={statistics.paymentSuccessRate}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="h6" color="primary">
                  {statistics.paymentSuccessRate.toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Invoice Value
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" color="primary">
                  ${statistics.averageInvoiceValue.toFixed(2)}
                </Typography>
                <Chip
                  label={`${invoices.length} invoices`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search invoices..."
              value={filters.searchQuery}
              onChange={(e) => dispatch(setFilters({ searchQuery: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={filters.status}
              onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="partial">Partial</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Date Range"
              value={filters.dateRange}
              onChange={(e) => dispatch(setFilters({ dateRange: e.target.value }))}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="3months">Last 3 Months</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Payment Method"
              value={filters.paymentMethod}
              onChange={(e) => dispatch(setFilters({ paymentMethod: e.target.value }))}
            >
              <MenuItem value="all">All Methods</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="debit_card">Debit Card</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="insurance">Insurance</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box display="flex" gap={1}>
              <Button
                size="small"
                startIcon={<FilterList />}
                onClick={() => dispatch(clearFilters())}
              >
                Clear
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<FileDownload />}
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Invoices Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((invoice) => {
                const daysOverdue = invoice.status === 'overdue' 
                  ? differenceInDays(new Date(), parseISO(invoice.due_date))
                  : 0;
                
                return (
                  <TableRow key={invoice.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {invoice.invoice_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">
                          {invoice.patient_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {invoice.patient_email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(parseISO(invoice.issue_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {format(parseISO(invoice.due_date), 'MMM dd, yyyy')}
                        </Typography>
                        {daysOverdue > 0 && (
                          <Typography variant="caption" color="error">
                            {daysOverdue} days overdue
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        ${invoice.total_amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="subtitle2" 
                        color={invoice.paid_amount > 0 ? 'success.main' : 'text.secondary'}
                      >
                        ${invoice.paid_amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="subtitle2"
                        color={invoice.balance_due > 0 ? 'error.main' : 'text.secondary'}
                      >
                        ${invoice.balance_due.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(invoice.status)}
                        label={invoice.status.toUpperCase()}
                        size="small"
                        color={getStatusColor(invoice.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {invoice.payment_method && (
                        <Chip
                          icon={getPaymentMethodIcon(invoice.payment_method)}
                          label={invoice.payment_method.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {invoice.insurance_claim && (
                        <Tooltip title={`Insurance: ${invoice.insurance_claim.insurance_provider}`}>
                          <Chip
                            icon={<LocalHospital />}
                            label="Insurance"
                            size="small"
                            color="secondary"
                            sx={{ ml: 0.5 }}
                          />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, invoice.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No invoices found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInvoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedInvoiceId && (() => {
          const invoice = invoices.find(inv => inv.id === selectedInvoiceId);
          if (!invoice) return null;
          
          return (
            <>
              <MenuItem onClick={() => handleViewInvoice(invoice)}>
                <Visibility sx={{ mr: 1 }} /> View Details
              </MenuItem>
              <MenuItem onClick={() => handleEditInvoice(invoice)}>
                <Edit sx={{ mr: 1 }} /> Edit Invoice
              </MenuItem>
              <MenuItem onClick={() => handlePrintInvoice(invoice)}>
                <Print sx={{ mr: 1 }} /> Print Invoice
              </MenuItem>
              <MenuItem onClick={() => handleSendInvoice(invoice)}>
                <Email sx={{ mr: 1 }} /> Send to Patient
              </MenuItem>
              <Divider />
              {invoice.status !== 'paid' && (
                <MenuItem onClick={() => handleRecordPayment(invoice)}>
                  <Payment sx={{ mr: 1 }} /> Record Payment
                </MenuItem>
              )}
              {invoice.balance_due === 0 && invoice.status !== 'paid' && (
                <MenuItem onClick={() => handleMarkAsPaid(invoice)}>
                  <Paid sx={{ mr: 1 }} /> Mark as Paid
                </MenuItem>
              )}
              <Divider />
              <MenuItem onClick={() => handleDeleteInvoice(invoice.id)} sx={{ color: 'error.main' }}>
                <Delete sx={{ mr: 1 }} /> Delete Invoice
              </MenuItem>
            </>
          );
        })()}
      </Menu>

      {/* Dialogs */}
      <InvoiceDialog 
        open={openInvoiceDialog}
        onClose={() => setOpenInvoiceDialog(false)}
        editMode={editMode}
        onSuccess={() => {
          // Refresh data if needed
        }}
      />
      <InvoiceDetailsDialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        onEdit={() => {
          setOpenDetailsDialog(false);
          if (selectedInvoice) {
            handleEditInvoice(selectedInvoice);
          }
        }}
        onRecordPayment={() => {
          setOpenDetailsDialog(false);
          if (selectedInvoice) {
            handleRecordPayment(selectedInvoice);
          }
        }}
      />
      <PaymentDialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        onSuccess={() => {
          // Refresh data if needed
        }}
      />
    </Box>
  );
};

export default Billing;