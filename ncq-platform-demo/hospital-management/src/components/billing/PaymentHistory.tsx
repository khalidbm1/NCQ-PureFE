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
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import {
  Receipt,
  CreditCard,
  AccountBalance,
  LocalAtm,
  HealthAndSafety,
  Info,
  Print,
  Search,
  TrendingUp,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Payment } from '../../store/slices/invoiceSlice';

interface PaymentHistoryProps {
  invoiceId?: string;
  patientId?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ invoiceId, patientId }) => {
  const { payments, invoices } = useSelector((state: RootState) => state.invoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('month');

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    if (invoiceId && payment.invoice_id !== invoiceId) return false;
    
    const invoice = invoices.find(inv => inv.id === payment.invoice_id);
    if (patientId && invoice?.patient_id !== patientId) return false;
    
    if (searchTerm) {
      return (
        payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice?.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice?.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Date filtering
    const paymentDate = new Date(payment.payment_date);
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        return paymentDate.toDateString() === now.toDateString();
      case 'week':
        return paymentDate >= subDays(now, 7);
      case 'month':
        return paymentDate >= startOfMonth(now) && paymentDate <= endOfMonth(now);
      default:
        return true;
    }
  });

  // Calculate statistics
  const stats = {
    totalPayments: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
    paymentCount: filteredPayments.length,
    averagePayment: filteredPayments.length > 0 
      ? filteredPayments.reduce((sum, p) => sum + p.amount, 0) / filteredPayments.length 
      : 0,
    paymentMethods: filteredPayments.reduce((acc, payment) => {
      acc[payment.payment_method] = (acc[payment.payment_method] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>),
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons: Record<string, JSX.Element> = {
      cash: <LocalAtm />,
      card: <CreditCard />,
      bank_transfer: <AccountBalance />,
      insurance: <HealthAndSafety />,
      other: <Receipt />,
    };
    return icons[method] || <Receipt />;
  };

  const getPaymentMethodColor = (method: string) => {
    const colors: Record<string, any> = {
      cash: 'success',
      card: 'primary',
      bank_transfer: 'info',
      insurance: 'secondary',
      other: 'default',
    };
    return colors[method] || 'default';
  };

  const handlePrintReceipt = (payment: Payment) => {
    const invoice = invoices.find(inv => inv.id === payment.invoice_id);
    if (!invoice) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt - ${payment.reference_number || payment.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 30px; }
              .receipt-details { margin-bottom: 20px; }
              .receipt-details div { margin: 5px 0; }
              .amount { font-size: 24px; font-weight: bold; margin: 20px 0; }
              .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>PAYMENT RECEIPT</h1>
              <p>Receipt #: ${payment.reference_number || payment.id}</p>
            </div>
            
            <div class="receipt-details">
              <div><strong>Date:</strong> ${format(new Date(payment.payment_date), 'PPP')}</div>
              <div><strong>Invoice:</strong> ${invoice.invoice_number}</div>
              <div><strong>Patient:</strong> ${invoice.patient_name}</div>
              <div><strong>Payment Method:</strong> ${payment.payment_method.replace('_', ' ').toUpperCase()}</div>
              ${payment.reference_number ? `<div><strong>Reference:</strong> ${payment.reference_number}</div>` : ''}
            </div>
            
            <div class="amount">
              Amount Paid: $${payment.amount.toFixed(2)}
            </div>
            
            ${payment.notes ? `<div><strong>Notes:</strong> ${payment.notes}</div>` : ''}
            
            <div class="footer">
              <p>Thank you for your payment!</p>
              <p>Processed by: ${payment.created_by}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Box>
      {/* Statistics Cards */}
      {!invoiceId && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Total Collected
                    </Typography>
                    <Typography variant="h5">${stats.totalPayments.toFixed(2)}</Typography>
                  </Box>
                  <AttachMoney fontSize="large" color="success" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Payments
                    </Typography>
                    <Typography variant="h5">{stats.paymentCount}</Typography>
                  </Box>
                  <Receipt fontSize="large" color="primary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Average Payment
                    </Typography>
                    <Typography variant="h5">${stats.averagePayment.toFixed(2)}</Typography>
                  </Box>
                  <TrendingUp fontSize="large" color="info" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Today's Collection
                    </Typography>
                    <Typography variant="h5">
                      ${payments
                        .filter(p => new Date(p.payment_date).toDateString() === new Date().toDateString())
                        .reduce((sum, p) => sum + p.amount, 0)
                        .toFixed(2)}
                    </Typography>
                  </Box>
                  <CalendarToday fontSize="large" color="secondary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by invoice number, patient, or reference..."
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
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['all', 'today', 'week', 'month'].map((filter) => (
                <Button
                  key={filter}
                  variant={dateFilter === filter ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setDateFilter(filter as any)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Payment Methods Breakdown */}
      {!invoiceId && Object.keys(stats.paymentMethods).length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Payment Methods</Typography>
          <Grid container spacing={2}>
            {Object.entries(stats.paymentMethods).map(([method, amount]) => (
              <Grid item xs={12} sm={6} md={3} key={method}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getPaymentMethodIcon(method)}
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {method.replace('_', ' ').toUpperCase()}
                    </Typography>
                    <Typography variant="h6">${amount.toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Payments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => {
              const invoice = invoices.find(inv => inv.id === payment.invoice_id);
              if (!invoice) return null;
              
              return (
                <TableRow key={payment.id} hover>
                  <TableCell>{format(new Date(payment.payment_date), 'PP p')}</TableCell>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.patient_name}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      ${payment.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getPaymentMethodIcon(payment.payment_method)}
                      label={payment.payment_method.replace('_', ' ')}
                      size="small"
                      color={getPaymentMethodColor(payment.payment_method)}
                    />
                  </TableCell>
                  <TableCell>{payment.reference_number || '-'}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setDetailsDialogOpen(true);
                          }}
                        >
                          <Info />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Print Receipt">
                        <IconButton
                          size="small"
                          onClick={() => handlePrintReceipt(payment)}
                        >
                          <Print />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredPayments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No payments found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <List>
              <ListItem>
                <ListItemText primary="Payment Date" />
                <ListItemSecondaryAction>
                  {format(new Date(selectedPayment.payment_date), 'PPP p')}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText primary="Amount" />
                <ListItemSecondaryAction>
                  <Typography color="success.main" fontWeight="bold">
                    ${selectedPayment.amount.toFixed(2)}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText primary="Payment Method" />
                <ListItemSecondaryAction>
                  <Chip
                    icon={getPaymentMethodIcon(selectedPayment.payment_method)}
                    label={selectedPayment.payment_method.replace('_', ' ')}
                    size="small"
                    color={getPaymentMethodColor(selectedPayment.payment_method)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {selectedPayment.reference_number && (
                <ListItem>
                  <ListItemText primary="Reference Number" />
                  <ListItemSecondaryAction>
                    {selectedPayment.reference_number}
                  </ListItemSecondaryAction>
                </ListItem>
              )}
              <ListItem>
                <ListItemText primary="Processed By" />
                <ListItemSecondaryAction>
                  {selectedPayment.created_by}
                </ListItemSecondaryAction>
              </ListItem>
              {selectedPayment.notes && (
                <ListItem>
                  <ListItemText 
                    primary="Notes" 
                    secondary={selectedPayment.notes}
                  />
                </ListItem>
              )}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PaymentHistory;