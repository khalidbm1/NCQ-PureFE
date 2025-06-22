import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Pagination,
} from '@mui/material'
import {
  Download,
  Payment,
  Refresh,
  FilterList,
  Receipt,
} from '@mui/icons-material'
import { AppDispatch, RootState } from '../store'
import { fetchInvoices, downloadInvoice, payInvoice, retryPayment } from '../store/slices/invoiceSlice'
import { fetchPaymentMethods } from '../store/slices/paymentSlice'
import { Invoice, InvoiceFilters } from '../types'

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
]

const Invoices: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { invoices, loading, error, pagination } = useSelector(
    (state: RootState) => state.invoices
  )
  const { paymentMethods } = useSelector((state: RootState) => state.payments)

  const [filters, setFilters] = useState<InvoiceFilters>({
    page: 1,
    limit: 10,
  })
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchInvoices(filters))
  }, [dispatch, filters])

  useEffect(() => {
    dispatch(fetchPaymentMethods())
  }, [dispatch])

  const handleFilterChange = (field: keyof InvoiceFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1, // Reset to first page when filtering
    }))
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleDownload = async (invoice: Invoice) => {
    try {
      await dispatch(downloadInvoice(invoice.id)).unwrap()
    } catch (error) {
      // Error handled by Redux slice
    }
  }

  const handlePayment = async () => {
    if (!selectedInvoice || !selectedPaymentMethod) return
    
    setPaymentLoading(true)
    try {
      await dispatch(payInvoice({
        id: selectedInvoice.id,
        paymentMethodId: selectedPaymentMethod,
      })).unwrap()
      setShowPaymentDialog(false)
      setSelectedInvoice(null)
      setSelectedPaymentMethod('')
      // Refresh invoices
      dispatch(fetchInvoices(filters))
    } catch (error) {
      // Error handled by Redux slice
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleRetryPayment = async (invoice: Invoice) => {
    try {
      await dispatch(retryPayment(invoice.id)).unwrap()
      // Refresh invoices
      dispatch(fetchInvoices(filters))
    } catch (error) {
      // Error handled by Redux slice
    }
  }

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'paid':
        return 'success'
      case 'pending':
        return 'warning'
      case 'overdue':
        return 'error'
      case 'cancelled':
        return 'default'
      default:
        return 'primary'
    }
  }

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const paidAmount = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const pendingAmount = invoices
    .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Invoices
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Amount
              </Typography>
              <Typography variant="h5">
                ${totalAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Paid Amount
              </Typography>
              <Typography variant="h5" color="success.main">
                ${paidAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Amount
              </Typography>
              <Typography variant="h5" color="warning.main">
                ${pendingAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                placeholder="Invoice number..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box textAlign="center" py={4}>
                    <Receipt sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      No invoices found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Invoices will appear here once you have an active subscription
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {invoice.invoiceNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      ${invoice.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      color={getStatusColor(invoice.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(invoice)}
                        title="Download PDF"
                      >
                        <Download />
                      </IconButton>
                      {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedInvoice(invoice)
                            setShowPaymentDialog(true)
                          }}
                          title="Pay Invoice"
                        >
                          <Payment />
                        </IconButton>
                      )}
                      {invoice.status === 'overdue' && (
                        <IconButton
                          size="small"
                          onClick={() => handleRetryPayment(invoice)}
                          title="Retry Payment"
                        >
                          <Refresh />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Pay Invoice</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Invoice #{selectedInvoice.invoiceNumber}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ${selectedInvoice.amount.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Due: {new Date(selectedInvoice.dueDate).toLocaleDateString()}
              </Typography>
              
              <TextField
                select
                fullWidth
                label="Payment Method"
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                sx={{ mt: 2 }}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.id} value={method.id}>
                    {method.type === 'card' 
                      ? `**** ${method.last4} (${method.brand})`
                      : method.type
                    }
                    {method.isDefault && ' (Default)'}
                  </MenuItem>
                ))}
              </TextField>
              
              {paymentMethods.length === 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  No payment methods available. Please add a payment method first.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || paymentLoading || paymentMethods.length === 0}
          >
            {paymentLoading ? <CircularProgress size={20} /> : 'Pay Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Invoices