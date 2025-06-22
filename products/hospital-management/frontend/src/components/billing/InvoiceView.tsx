import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Print,
  Email,
  Download,
  Payment,
  Edit,
  Cancel,
  CheckCircle,
  Warning,
  Schedule,
  AttachMoney,
  Receipt,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { Invoice, Payment as PaymentType, recordPayment } from '../../store/slices/invoiceSlice';
import { showNotification } from '../../store/slices/notificationSlice';

interface InvoiceViewProps {
  invoice: Invoice;
  onEdit?: () => void;
  onPayment?: (payment: PaymentType) => void;
  showActions?: boolean;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({
  invoice,
  onEdit,
  onPayment,
  showActions = true,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(invoice.balance_due);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

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

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      draft: <Schedule />,
      pending: <Schedule />,
      partially_paid: <AttachMoney />,
      paid: <CheckCircle />,
      overdue: <Warning />,
      cancelled: <Cancel />,
      refunded: <Receipt />,
    };
    return icons[status] || <Receipt />;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.invoice_number}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 30px; }
              .invoice-details { margin-bottom: 30px; }
              .invoice-details div { margin: 5px 0; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .totals { text-align: right; }
              .totals div { margin: 5px 0; }
              .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>INVOICE</h1>
              <h2>${invoice.invoice_number}</h2>
            </div>
            
            <div class="invoice-details">
              <div><strong>Date:</strong> ${format(new Date(invoice.issue_date), 'PPP')}</div>
              <div><strong>Due Date:</strong> ${format(new Date(invoice.due_date), 'PPP')}</div>
              <div><strong>Patient:</strong> ${invoice.patient_name}</div>
              ${invoice.patient_email ? `<div><strong>Email:</strong> ${invoice.patient_email}</div>` : ''}
              ${invoice.patient_phone ? `<div><strong>Phone:</strong> ${invoice.patient_phone}</div>` : ''}
              ${invoice.insurance_provider ? `<div><strong>Insurance:</strong> ${invoice.insurance_provider} - ${invoice.insurance_policy_number}</div>` : ''}
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.unit_price.toFixed(2)}</td>
                    <td>${item.discount || 0}%</td>
                    <td>${item.tax || 0}%</td>
                    <td>$${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <div><strong>Subtotal:</strong> $${invoice.subtotal.toFixed(2)}</div>
              <div><strong>Tax:</strong> $${invoice.tax_amount.toFixed(2)}</div>
              ${invoice.discount_amount > 0 ? `<div><strong>Discount:</strong> -$${invoice.discount_amount.toFixed(2)}</div>` : ''}
              <div><strong>Total:</strong> $${invoice.total_amount.toFixed(2)}</div>
              ${invoice.insurance_coverage && invoice.insurance_coverage > 0 ? `<div><strong>Insurance Coverage:</strong> -$${invoice.insurance_coverage.toFixed(2)}</div>` : ''}
              <div><strong>Patient Responsibility:</strong> $${invoice.patient_responsibility.toFixed(2)}</div>
              ${invoice.paid_amount > 0 ? `<div><strong>Paid:</strong> $${invoice.paid_amount.toFixed(2)}</div>` : ''}
              <div style="font-size: 18px; margin-top: 10px;"><strong>Balance Due:</strong> $${invoice.balance_due.toFixed(2)}</div>
            </div>
            
            ${invoice.notes ? `<div style="margin-top: 30px;"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
            ${invoice.terms_and_conditions ? `<div style="margin-top: 20px; font-size: 12px;"><strong>Terms:</strong> ${invoice.terms_and_conditions}</div>` : ''}
            
            <div class="footer">
              <p>Thank you for your business!</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleEmail = () => {
    dispatch(showNotification({
      message: 'Invoice email functionality would be implemented here',
      severity: 'info',
    }));
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    dispatch(showNotification({
      message: 'Invoice download functionality would be implemented here',
      severity: 'info',
    }));
  };

  const handlePaymentSubmit = async () => {
    if (paymentAmount <= 0 || paymentAmount > invoice.balance_due) {
      dispatch(showNotification({
        message: 'Invalid payment amount',
        severity: 'error',
      }));
      return;
    }

    const paymentData: Partial<PaymentType> = {
      invoice_id: invoice.id,
      amount: paymentAmount,
      payment_date: new Date().toISOString(),
      payment_method: paymentMethod as any,
      reference_number: paymentReference,
      notes: paymentNotes,
    };

    try {
      const result = await dispatch(recordPayment(paymentData)).unwrap();
      dispatch(showNotification({
        message: 'Payment recorded successfully',
        severity: 'success',
      }));
      setPaymentDialogOpen(false);
      if (onPayment) {
        onPayment(result);
      }
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to record payment',
        severity: 'error',
      }));
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Invoice #{invoice.invoice_number}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                icon={getStatusIcon(invoice.status)}
                label={invoice.status.replace('_', ' ').toUpperCase()}
                color={getStatusColor(invoice.status)}
              />
              <Chip
                label={invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)}
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            {showActions && (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Payment />}
                    onClick={() => setPaymentDialogOpen(true)}
                  >
                    Record Payment
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={onEdit}
                  >
                    Edit
                  </Button>
                )}
                <IconButton onClick={handlePrint} title="Print">
                  <Print />
                </IconButton>
                <IconButton onClick={handleEmail} title="Email">
                  <Email />
                </IconButton>
                <IconButton onClick={handleDownload} title="Download">
                  <Download />
                </IconButton>
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Issue Date</Typography>
            <Typography variant="body1">{format(new Date(invoice.issue_date), 'PPP')}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Due Date</Typography>
            <Typography variant="body1">{format(new Date(invoice.due_date), 'PPP')}</Typography>
          </Grid>
          {invoice.paid_date && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Paid Date</Typography>
              <Typography variant="body1">{format(new Date(invoice.paid_date), 'PPP')}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Patient Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Bill To</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Patient Name</Typography>
            <Typography variant="body1">{invoice.patient_name}</Typography>
          </Grid>
          {invoice.patient_email && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Email</Typography>
              <Typography variant="body1">{invoice.patient_email}</Typography>
            </Grid>
          )}
          {invoice.patient_phone && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
              <Typography variant="body1">{invoice.patient_phone}</Typography>
            </Grid>
          )}
          {invoice.patient_address && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Address</Typography>
              <Typography variant="body1">{invoice.patient_address}</Typography>
            </Grid>
          )}
          {invoice.insurance_provider && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Insurance</Typography>
              <Typography variant="body1">
                {invoice.insurance_provider} - Policy: {invoice.insurance_policy_number}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Invoice Items */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Items</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Discount</TableCell>
                <TableCell align="right">Tax</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Insurance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.description}
                    {item.code && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        Code: {item.code}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={item.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">${item.unit_price.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.discount || 0}%</TableCell>
                  <TableCell align="right">{item.tax || 0}%</TableCell>
                  <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={item.is_covered_by_insurance ? 'Covered' : 'Not Covered'}
                      size="small"
                      color={item.is_covered_by_insurance ? 'success' : 'default'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Totals */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {invoice.notes && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Notes</Typography>
              <Typography variant="body2">{invoice.notes}</Typography>
            </Paper>
          )}
          {invoice.terms_and_conditions && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Terms & Conditions</Typography>
              <Typography variant="body2">{invoice.terms_and_conditions}</Typography>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Summary</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Subtotal" />
                <ListItemSecondaryAction>
                  <Typography variant="body1">${invoice.subtotal.toFixed(2)}</Typography>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText primary={`Tax (${invoice.tax_rate}%)`} />
                <ListItemSecondaryAction>
                  <Typography variant="body1">${invoice.tax_amount.toFixed(2)}</Typography>
                </ListItemSecondaryAction>
              </ListItem>
              {invoice.discount_amount > 0 && (
                <ListItem>
                  <ListItemText primary="Discount" />
                  <ListItemSecondaryAction>
                    <Typography variant="body1" color="error">
                      -${invoice.discount_amount.toFixed(2)}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              )}
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <ListItemText primary={<Typography variant="subtitle1">Total Amount</Typography>} />
                <ListItemSecondaryAction>
                  <Typography variant="h6">${invoice.total_amount.toFixed(2)}</Typography>
                </ListItemSecondaryAction>
              </ListItem>
              {invoice.insurance_coverage && invoice.insurance_coverage > 0 && (
                <ListItem>
                  <ListItemText primary="Insurance Coverage" />
                  <ListItemSecondaryAction>
                    <Typography variant="body1" color="success.main">
                      -${invoice.insurance_coverage.toFixed(2)}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              )}
              <ListItem>
                <ListItemText primary={<Typography variant="subtitle1">Patient Responsibility</Typography>} />
                <ListItemSecondaryAction>
                  <Typography variant="h6" color="primary">
                    ${invoice.patient_responsibility.toFixed(2)}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
              {invoice.paid_amount > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <ListItem>
                    <ListItemText primary="Paid Amount" />
                    <ListItemSecondaryAction>
                      <Typography variant="body1" color="success.main">
                        ${invoice.paid_amount.toFixed(2)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </>
              )}
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <ListItemText 
                  primary={
                    <Typography variant="h6" color={invoice.balance_due > 0 ? 'error' : 'success.main'}>
                      Balance Due
                    </Typography>
                  } 
                />
                <ListItemSecondaryAction>
                  <Typography 
                    variant="h5" 
                    color={invoice.balance_due > 0 ? 'error' : 'success.main'}
                  >
                    ${invoice.balance_due.toFixed(2)}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Status Alert */}
      {invoice.status === 'overdue' && (
        <Alert severity="error" sx={{ mt: 3 }}>
          This invoice is overdue. Please process payment as soon as possible.
        </Alert>
      )}
      {invoice.status === 'paid' && (
        <Alert severity="success" sx={{ mt: 3 }}>
          This invoice has been paid in full.
        </Alert>
      )}

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                inputProps={{ 
                  min: 0, 
                  max: invoice.balance_due,
                  step: 0.01 
                }}
                helperText={`Balance due: $${invoice.balance_due.toFixed(2)}`}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reference Number"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Transaction ID, Check Number, etc."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handlePaymentSubmit}
            disabled={paymentAmount <= 0 || paymentAmount > invoice.balance_due}
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceView;