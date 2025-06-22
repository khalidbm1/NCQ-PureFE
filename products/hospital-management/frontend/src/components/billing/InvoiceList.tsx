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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
  Typography,
  Grid,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Edit,
  Print,
  Email,
  Payment,
  MoreVert,
  Download,
  Cancel,
  Clear,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  Invoice,
  setFilters,
  clearFilters,
  updateInvoiceStatus,
} from '../../store/slices/invoiceSlice';
import { showNotification } from '../../store/slices/notificationSlice';

interface InvoiceListProps {
  onInvoiceSelect?: (invoice: Invoice) => void;
  onEdit?: (invoice: Invoice) => void;
  onPayment?: (invoice: Invoice) => void;
  patientId?: string;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  onInvoiceSelect,
  onEdit,
  onPayment,
  patientId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { invoices, filters, loading } = useSelector((state: RootState) => state.invoices);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    if (patientId && invoice.patient_id !== patientId) return false;
    
    if (filters.status !== 'all' && invoice.status !== filters.status) return false;
    
    if (filters.type !== 'all' && invoice.type !== filters.type) return false;
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        invoice.invoice_number.toLowerCase().includes(searchLower) ||
        invoice.patient_name.toLowerCase().includes(searchLower) ||
        invoice.items.some(item => item.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.dateRange.start && filters.dateRange.end) {
      const invoiceDate = new Date(invoice.issue_date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      return invoiceDate >= startDate && invoiceDate <= endDate;
    }
    
    return true;
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'partially_paid', label: 'Partially Paid' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'lab_test', label: 'Lab Test' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'hospitalization', label: 'Hospitalization' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'other', label: 'Other' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      draft: 'default',
      pending: 'warning',
      partially_paid: 'info',
      paid: 'success',
      overdue: 'error',
      cancelled: 'default',
      refunded: 'secondary',
    };
    return colors[status] || 'default';
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, invoice: Invoice) => {
    setAnchorEl(event.currentTarget);
    setSelectedInvoice(invoice);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInvoice(null);
  };

  const handleStatusChange = (newStatus: Invoice['status']) => {
    if (selectedInvoice) {
      dispatch(updateInvoiceStatus({ id: selectedInvoice.id, status: newStatus }));
      dispatch(showNotification({
        message: `Invoice status updated to ${newStatus}`,
        severity: 'success',
      }));
      handleMenuClose();
    }
  };

  const handlePrint = (invoice: Invoice) => {
    // Print functionality would be implemented here
    dispatch(showNotification({
      message: 'Print functionality would open print dialog',
      severity: 'info',
    }));
  };

  const handleEmail = (invoice: Invoice) => {
    // Email functionality would be implemented here
    dispatch(showNotification({
      message: 'Email functionality would send invoice to patient',
      severity: 'info',
    }));
  };

  const handleExport = () => {
    // Export filtered invoices as CSV
    const csvContent = [
      ['Invoice Number', 'Date', 'Patient', 'Type', 'Status', 'Total', 'Paid', 'Balance'],
      ...filteredInvoices.map(invoice => [
        invoice.invoice_number,
        format(new Date(invoice.issue_date), 'yyyy-MM-dd'),
        invoice.patient_name,
        invoice.type,
        invoice.status,
        invoice.total_amount.toFixed(2),
        invoice.paid_amount.toFixed(2),
        invoice.balance_due.toFixed(2),
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoices_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search invoices..."
              value={filters.searchTerm}
              onChange={(e) => dispatch(setFilters({ searchTerm: e.target.value }))}
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
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
                label="Status"
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => dispatch(setFilters({ type: e.target.value }))}
                label="Type"
              >
                {typeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={() => dispatch(clearFilters())}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
              fullWidth
            >
              Export CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Invoices Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => onInvoiceSelect && onInvoiceSelect(invoice)}
                    >
                      {invoice.invoice_number}
                    </Typography>
                  </TableCell>
                  <TableCell>{format(new Date(invoice.issue_date), 'PP')}</TableCell>
                  <TableCell>{invoice.patient_name}</TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(invoice.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">${invoice.total_amount.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      color={invoice.paid_amount > 0 ? 'success.main' : 'text.secondary'}
                    >
                      ${invoice.paid_amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      color={invoice.balance_due > 0 ? 'error.main' : 'success.main'}
                      fontWeight={invoice.balance_due > 0 ? 'bold' : 'normal'}
                    >
                      ${invoice.balance_due.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => onInvoiceSelect && onInvoiceSelect(invoice)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {onEdit && invoice.status === 'draft' && (
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(invoice)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onPayment && invoice.balance_due > 0 && invoice.status !== 'cancelled' && (
                        <Tooltip title="Record Payment">
                          <IconButton
                            size="small"
                            onClick={() => onPayment(invoice)}
                            color="primary"
                          >
                            <Payment />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="More Actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, invoice)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
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
        <MenuItem onClick={() => selectedInvoice && handlePrint(selectedInvoice)}>
          <ListItemIcon>
            <Print fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedInvoice && handleEmail(selectedInvoice)}>
          <ListItemIcon>
            <Email fontSize="small" />
          </ListItemIcon>
          <ListItemText>Email</ListItemText>
        </MenuItem>
        {selectedInvoice && selectedInvoice.status !== 'cancelled' && selectedInvoice.status !== 'paid' && (
          <MenuItem onClick={() => handleStatusChange('cancelled')}>
            <ListItemIcon>
              <Cancel fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cancel Invoice</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default InvoiceList;