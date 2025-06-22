import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Close,
  Payment,
  Save,
  AttachMoney,
  CreditCard,
  AccountBalance,
  Receipt,
  CalendarToday,
  CheckCircle,
  Info,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { 
  recordPayment,
  addPaymentToInvoice,
  Payment as PaymentType,
} from '../../store/slices/billingSlice';
import { showNotification } from '../../store/slices/notificationSlice';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const paymentMethods = [
  { value: 'cash', label: 'Cash', icon: <AttachMoney /> },
  { value: 'credit_card', label: 'Credit Card', icon: <CreditCard /> },
  { value: 'debit_card', label: 'Debit Card', icon: <CreditCard /> },
  { value: 'check', label: 'Check', icon: <Receipt /> },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: <AccountBalance /> },
  { value: 'insurance', label: 'Insurance', icon: <Receipt /> },
  { value: 'other', label: 'Other', icon: <Payment /> },
];

const validationSchema = Yup.object({
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  payment_method: Yup.string().required('Payment method is required'),
  payment_date: Yup.date().required('Payment date is required'),
  reference_number: Yup.string().when('payment_method', {
    is: (value: string) => ['credit_card', 'debit_card', 'check', 'bank_transfer'].includes(value),
    then: (schema) => schema.required('Reference number is required for this payment method'),
    otherwise: (schema) => schema,
  }),
});

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedInvoice } = useSelector((state: RootState) => state.billing);
  const [isProcessing, setIsProcessing] = useState(false);

  const formik = useFormik({
    initialValues: {
      amount: 0,
      payment_method: '',
      payment_date: format(new Date(), 'yyyy-MM-dd'),
      reference_number: '',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedInvoice) return;

      try {
        setIsProcessing(true);

        // Check if payment amount exceeds balance due
        if (values.amount > selectedInvoice.balance_due) {
          dispatch(showNotification({
            message: 'Payment amount cannot exceed balance due',
            severity: 'error',
          }));
          setIsProcessing(false);
          return;
        }

        const paymentData: Partial<PaymentType> = {
          invoice_id: selectedInvoice.id,
          invoice_number: selectedInvoice.invoice_number,
          patient_id: selectedInvoice.patient_id,
          patient_name: selectedInvoice.patient_name,
          payment_date: values.payment_date,
          amount: values.amount,
          payment_method: values.payment_method as PaymentType['payment_method'],
          reference_number: values.reference_number || undefined,
          notes: values.notes || undefined,
          status: 'completed',
          created_by: 'admin',
          created_at: new Date().toISOString(),
        };

        // In a real app, this would call the API
        // await dispatch(recordPayment(paymentData)).unwrap();
        
        // For now, we'll just update the local state
        dispatch(addPaymentToInvoice({
          ...paymentData as PaymentType,
          id: `pay_${Date.now()}`,
        }));

        dispatch(showNotification({
          message: 'Payment recorded successfully',
          severity: 'success',
        }));

        handleClose();
        if (onSuccess) onSuccess();
      } catch (error: any) {
        dispatch(showNotification({
          message: error.message || 'Failed to record payment',
          severity: 'error',
        }));
      } finally {
        setIsProcessing(false);
      }
    },
  });

  useEffect(() => {
    if (selectedInvoice && open) {
      // Set default amount to balance due
      formik.setFieldValue('amount', selectedInvoice.balance_due);
    } else {
      formik.resetForm();
    }
  }, [selectedInvoice, open]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  if (!selectedInvoice) return null;

  const remainingBalance = selectedInvoice.balance_due - formik.values.amount;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Payment />
            <Typography variant="h6">
              Record Payment
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Invoice Summary */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Invoice Summary
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Receipt color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Invoice Number" 
                      secondary={selectedInvoice.invoice_number}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Patient" 
                      secondary={selectedInvoice.patient_name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Total Amount" 
                      secondary={`$${selectedInvoice.total_amount.toFixed(2)}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Amount Paid" 
                      secondary={
                        <Typography variant="body2" color="success.main">
                          ${selectedInvoice.paid_amount.toFixed(2)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Balance Due" 
                      secondary={
                        <Typography variant="body2" color="error.main" fontWeight="bold">
                          ${selectedInvoice.balance_due.toFixed(2)}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Payment Amount */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Amount"
                name="amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
              {formik.values.amount > 0 && (
                <Box mt={1}>
                  {remainingBalance > 0 ? (
                    <Alert severity="info" icon={<Info />}>
                      After this payment, ${remainingBalance.toFixed(2)} will remain outstanding.
                    </Alert>
                  ) : remainingBalance === 0 ? (
                    <Alert severity="success" icon={<CheckCircle />}>
                      This payment will fully settle the invoice.
                    </Alert>
                  ) : (
                    <Alert severity="warning">
                      Payment amount exceeds balance due by ${Math.abs(remainingBalance).toFixed(2)}.
                    </Alert>
                  )}
                </Box>
              )}
            </Grid>

            {/* Payment Method */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="payment_method"
                  value={formik.values.payment_method}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.payment_method && Boolean(formik.errors.payment_method)}
                  label="Payment Method"
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {method.icon}
                        {method.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Payment Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payment Date"
                name="payment_date"
                type="date"
                value={formik.values.payment_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.payment_date && Boolean(formik.errors.payment_date)}
                helperText={formik.touched.payment_date && formik.errors.payment_date}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* Reference Number */}
            {['credit_card', 'debit_card', 'check', 'bank_transfer'].includes(formik.values.payment_method) && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={
                    formik.values.payment_method === 'check' ? 'Check Number' :
                    formik.values.payment_method === 'bank_transfer' ? 'Transaction ID' :
                    'Card Reference Number'
                  }
                  name="reference_number"
                  value={formik.values.reference_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.reference_number && Boolean(formik.errors.reference_number)}
                  helperText={formik.touched.reference_number && formik.errors.reference_number}
                  required
                />
              </Grid>
            )}

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes (Optional)"
                name="notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
                placeholder="Add any additional information about this payment..."
              />
            </Grid>

            {/* Payment Summary */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Payment Amount:</Typography>
                <Typography variant="h5" color="primary">
                  ${formik.values.amount.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting || isProcessing || formik.values.amount <= 0}
            startIcon={<Save />}
          >
            Record Payment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentDialog;