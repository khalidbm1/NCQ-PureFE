import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tab,
  Tabs,
  Avatar,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Close,
  Print,
  Email,
  Download,
  Receipt,
  Payment,
  CheckCircle,
  AccessTime,
  Warning,
  Error,
  Person,
  LocalHospital,
  CalendarToday,
  AttachMoney,
  CreditCard,
  AccountBalance,
  Description,
  Edit,
  Delete,
  ContentCopy,
  Share,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { Invoice, Payment as PaymentType } from '../../store/slices/billingSlice';
import { showNotification } from '../../store/slices/notificationSlice';

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
      id={`invoice-tabpanel-${index}`}
      aria-labelledby={`invoice-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface InvoiceDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onRecordPayment?: () => void;
}

const InvoiceDetailsDialog: React.FC<InvoiceDetailsDialogProps> = ({
  open,
  onClose,
  onEdit,
  onRecordPayment,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedInvoice, payments } = useSelector((state: RootState) => state.billing);
  const [tabValue, setTabValue] = useState(0);

  if (!selectedInvoice) return null;

  const invoicePayments = payments.filter(p => p.invoice_id === selectedInvoice.id);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePrint = () => {
    window.print(); // In real app, generate PDF
  };

  const handleEmail = () => {
    dispatch(showNotification({
      message: `Invoice sent to ${selectedInvoice.patient_email}`,
      severity: 'success',
    }));
  };

  const handleDownload = () => {
    // In real app, download PDF
    dispatch(showNotification({
      message: 'Invoice downloaded',
      severity: 'success',
    }));
  };

  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(selectedInvoice.invoice_number);
    dispatch(showNotification({
      message: 'Invoice number copied to clipboard',
      severity: 'success',
    }));
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Receipt />
            </Avatar>
            <Box>
              <Typography variant="h5">
                Invoice #{selectedInvoice.invoice_number}
                <IconButton size="small" onClick={handleCopyInvoiceNumber} sx={{ ml: 1 }}>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  icon={getStatusIcon(selectedInvoice.status)}
                  label={selectedInvoice.status.toUpperCase()}
                  size="small"
                  color={getStatusColor(selectedInvoice.status)}
                />
                <Typography variant="caption" color="text.secondary">
                  Created on {format(parseISO(selectedInvoice.created_at), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Print">
              <IconButton onClick={handlePrint}>
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Email">
              <IconButton onClick={handleEmail}>
                <Email />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton onClick={handleDownload}>
                <Download />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Invoice Details" />
          <Tab label="Payment History" />
          {selectedInvoice.insurance_claim && <Tab label="Insurance Claim" />}
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Header Info */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Bill To
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Person color="action" />
                  <Typography variant="subtitle1">
                    {selectedInvoice.patient_name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedInvoice.patient_email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedInvoice.patient_phone}
                </Typography>
                {selectedInvoice.doctor_name && (
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Attending Doctor
                    </Typography>
                    <Typography variant="body1">
                      {selectedInvoice.doctor_name}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Invoice Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Issue Date" 
                      secondary={format(parseISO(selectedInvoice.issue_date), 'MMMM dd, yyyy')} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Due Date" 
                      secondary={format(parseISO(selectedInvoice.due_date), 'MMMM dd, yyyy')} 
                    />
                  </ListItem>
                  {selectedInvoice.appointment_id && (
                    <ListItem>
                      <ListItemIcon>
                        <LocalHospital color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Related Appointment" 
                        secondary={`#${selectedInvoice.appointment_id}`} 
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>

            {/* Items Table */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Services & Items
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="center">Qty</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Discount</TableCell>
                        <TableCell align="right">Tax</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedInvoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Typography variant="subtitle2">{item.service_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.service_code}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">${item.unit_price.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            {item.discount_amount > 0 ? (
                              <Typography variant="body2" color="error">
                                -${item.discount_amount.toFixed(2)}
                              </Typography>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {item.tax_amount > 0 ? (
                              <Typography variant="body2">
                                ${item.tax_amount.toFixed(2)}
                              </Typography>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              ${item.total.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Totals */}
            <Grid item xs={12} md={6}>
              {(selectedInvoice.notes || selectedInvoice.terms) && (
                <Paper sx={{ p: 3 }}>
                  {selectedInvoice.notes && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Notes
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {selectedInvoice.notes}
                      </Typography>
                    </>
                  )}
                  {selectedInvoice.terms && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Terms & Conditions
                      </Typography>
                      <Typography variant="body2">
                        {selectedInvoice.terms}
                      </Typography>
                    </>
                  )}
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Invoice Summary
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1">
                      ${selectedInvoice.subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                  {selectedInvoice.discount_amount > 0 && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body1" color="error">
                        Discount:
                      </Typography>
                      <Typography variant="body1" color="error">
                        -${selectedInvoice.discount_amount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  {selectedInvoice.tax_amount > 0 && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body1">Tax:</Typography>
                      <Typography variant="body1">
                        ${selectedInvoice.tax_amount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">
                      ${selectedInvoice.total_amount.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1" color="success.main">
                      Paid:
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      ${selectedInvoice.paid_amount.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Balance Due:</Typography>
                    <Typography 
                      variant="h6" 
                      color={selectedInvoice.balance_due > 0 ? 'error' : 'success.main'}
                    >
                      ${selectedInvoice.balance_due.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {invoicePayments.length > 0 ? (
                <List>
                  {invoicePayments.map((payment, index) => (
                    <ListItem 
                      key={payment.id} 
                      sx={{ 
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        position: 'relative',
                        pb: 3,
                        '&:not(:last-child)::after': {
                          content: '""',
                          position: 'absolute',
                          left: 40,
                          top: 56,
                          bottom: 0,
                          width: 2,
                          bgcolor: 'divider',
                        }
                      }}
                    >
                      <Box display="flex" alignItems="flex-start" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: payment.status === 'completed' ? 'success.main' : 'grey.500',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getPaymentMethodIcon(payment.payment_method)}
                        </Avatar>
                        <Paper sx={{ p: 2, flex: 1 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="start">
                            <Box>
                              <Typography variant="h6" color="primary">
                                ${payment.amount.toFixed(2)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {format(parseISO(payment.payment_date), 'MMM dd, yyyy')}
                              </Typography>
                              <Chip
                                label={payment.payment_method.replace('_', ' ')}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                              {payment.reference_number && (
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                  Ref: {payment.reference_number}
                                </Typography>
                              )}
                            </Box>
                            <Chip
                              label={payment.status}
                              size="small"
                              color={payment.status === 'completed' ? 'success' : 'default'}
                            />
                          </Box>
                          {payment.notes && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {payment.notes}
                            </Typography>
                          )}
                        </Paper>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Payment sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Payments Recorded
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    No payments have been recorded for this invoice yet.
                  </Typography>
                  {selectedInvoice.status !== 'paid' && onRecordPayment && (
                    <Button
                      variant="contained"
                      startIcon={<Payment />}
                      onClick={onRecordPayment}
                    >
                      Record Payment
                    </Button>
                  )}
                </Paper>
              )}
            </Grid>

            {/* Payment Summary */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Payment Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total Invoice
                    </Typography>
                    <Typography variant="h6">
                      ${selectedInvoice.total_amount.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total Paid
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      ${selectedInvoice.paid_amount.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Balance Due
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color={selectedInvoice.balance_due > 0 ? 'error.main' : 'success.main'}
                    >
                      ${selectedInvoice.balance_due.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Status
                    </Typography>
                    <Chip
                      label={selectedInvoice.status.toUpperCase()}
                      color={getStatusColor(selectedInvoice.status)}
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {selectedInvoice.insurance_claim && (
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert 
                  severity={
                    selectedInvoice.insurance_claim.status === 'approved' ? 'success' :
                    selectedInvoice.insurance_claim.status === 'rejected' ? 'error' :
                    selectedInvoice.insurance_claim.status === 'partially_approved' ? 'warning' :
                    'info'
                  }
                  sx={{ mb: 3 }}
                >
                  Insurance claim status: {selectedInvoice.insurance_claim.status.replace('_', ' ').toUpperCase()}
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Insurance Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Provider" 
                        secondary={selectedInvoice.insurance_claim.insurance_provider} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Policy Number" 
                        secondary={selectedInvoice.insurance_claim.policy_number} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Policy Holder" 
                        secondary={selectedInvoice.insurance_claim.policy_holder} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Relationship" 
                        secondary={selectedInvoice.insurance_claim.relationship} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Claim Number" 
                        secondary={selectedInvoice.insurance_claim.claim_number} 
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Coverage Details
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Coverage Percentage" 
                        secondary={`${selectedInvoice.insurance_claim.coverage_percentage}%`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Coverage Amount" 
                        secondary={`$${selectedInvoice.insurance_claim.coverage_amount.toFixed(2)}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Deductible" 
                        secondary={`$${selectedInvoice.insurance_claim.deductible.toFixed(2)}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Copay" 
                        secondary={`$${selectedInvoice.insurance_claim.copay.toFixed(2)}`} 
                      />
                    </ListItem>
                    {selectedInvoice.insurance_claim.approved_date && (
                      <ListItem>
                        <ListItemText 
                          primary="Approved Date" 
                          secondary={format(parseISO(selectedInvoice.insurance_claim.approved_date), 'MMM dd, yyyy')} 
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Grid>

              {selectedInvoice.insurance_claim.rejection_reason && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    <Typography variant="subtitle2" gutterBottom>
                      Rejection Reason
                    </Typography>
                    <Typography variant="body2">
                      {selectedInvoice.insurance_claim.rejection_reason}
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {selectedInvoice.insurance_claim.notes && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Claim Notes
                    </Typography>
                    <Typography variant="body2">
                      {selectedInvoice.insurance_claim.notes}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </TabPanel>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {onEdit && selectedInvoice.status === 'draft' && (
          <Button variant="outlined" onClick={onEdit} startIcon={<Edit />}>
            Edit Invoice
          </Button>
        )}
        {onRecordPayment && selectedInvoice.balance_due > 0 && (
          <Button variant="contained" onClick={onRecordPayment} startIcon={<Payment />}>
            Record Payment
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceDetailsDialog;