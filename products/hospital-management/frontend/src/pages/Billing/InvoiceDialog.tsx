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
  Divider,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Close,
  Add,
  Delete,
  Save,
  Receipt,
  Search,
  LocalHospital,
  AttachMoney,
  Percent,
  CalendarToday,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, addDays } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { 
  createInvoice, 
  updateInvoice, 
  Invoice, 
  InvoiceItem, 
  Service,
  addPaymentToInvoice,
} from '../../store/slices/billingSlice';
import { showNotification } from '../../store/slices/notificationSlice';

interface InvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  onSuccess?: () => void;
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
  open,
  onClose,
  editMode,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedInvoice, services } = useSelector((state: RootState) => state.billing);
  const { patients } = useSelector((state: RootState) => state.patients);
  const { doctors } = useSelector((state: RootState) => state.doctors);
  const { appointments } = useSelector((state: RootState) => state.appointments);

  const [activeStep, setActiveStep] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [itemDiscount, setItemDiscount] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const steps = ['Patient Details', 'Services & Items', 'Invoice Details', 'Review & Save'];

  const validationSchema = Yup.object({
    patient_id: Yup.string().required('Patient is required'),
    issue_date: Yup.date().required('Issue date is required'),
    due_date: Yup.date()
      .min(Yup.ref('issue_date'), 'Due date must be after issue date')
      .required('Due date is required'),
    discount_type: Yup.string().oneOf(['percentage', 'fixed']),
    discount_value: Yup.number().min(0),
    tax_rate: Yup.number().min(0).max(100),
  });

  const formik = useFormik({
    initialValues: {
      patient_id: '',
      appointment_id: '',
      doctor_id: '',
      issue_date: format(new Date(), 'yyyy-MM-dd'),
      due_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      status: 'draft' as Invoice['status'],
      discount_type: 'percentage' as Invoice['discount_type'],
      discount_value: 0,
      tax_rate: 0,
      notes: 'Thank you for choosing our healthcare services.',
      terms: 'Payment is due within 30 days of invoice date.',
      payment_method: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (invoiceItems.length === 0) {
          dispatch(showNotification({
            message: 'Please add at least one item to the invoice',
            severity: 'error',
          }));
          return;
        }

        // Calculate totals
        const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        const itemDiscounts = invoiceItems.reduce((sum, item) => sum + item.discount_amount, 0);
        const taxAmount = invoiceItems.reduce((sum, item) => sum + item.tax_amount, 0);
        
        // Apply invoice-level discount
        const discountAmount = values.discount_type === 'percentage' 
          ? (subtotal * values.discount_value) / 100 
          : values.discount_value;
        
        const totalAmount = subtotal - itemDiscounts - discountAmount + taxAmount;

        const invoiceData: Partial<Invoice> = {
          ...values,
          invoice_number: editMode && selectedInvoice 
            ? selectedInvoice.invoice_number 
            : `INV-${Date.now().toString().slice(-6)}`,
          patient_name: selectedPatient?.name || '',
          patient_email: selectedPatient?.email || '',
          patient_phone: selectedPatient?.phone || '',
          doctor_name: selectedDoctor ? `Dr. ${selectedDoctor.first_name} ${selectedDoctor.last_name}` : undefined,
          items: invoiceItems,
          subtotal,
          tax_amount: taxAmount,
          discount_amount: discountAmount + itemDiscounts,
          total_amount: totalAmount,
          paid_amount: 0,
          balance_due: totalAmount,
          currency: 'USD',
          created_by: 'admin',
        };

        if (editMode && selectedInvoice) {
          await dispatch(updateInvoice({ 
            id: selectedInvoice.id, 
            data: invoiceData 
          })).unwrap();
          dispatch(showNotification({
            message: 'Invoice updated successfully',
            severity: 'success',
          }));
        } else {
          await dispatch(createInvoice(invoiceData)).unwrap();
          dispatch(showNotification({
            message: 'Invoice created successfully',
            severity: 'success',
          }));
        }

        handleClose();
        if (onSuccess) onSuccess();
      } catch (error: any) {
        dispatch(showNotification({
          message: error.message || 'Failed to save invoice',
          severity: 'error',
        }));
      }
    },
  });

  useEffect(() => {
    if (selectedInvoice && editMode && open) {
      // Load invoice data for editing
      formik.setValues({
        patient_id: selectedInvoice.patient_id || '',
        appointment_id: selectedInvoice.appointment_id || '',
        doctor_id: selectedInvoice.doctor_id || '',
        issue_date: selectedInvoice.issue_date || format(new Date(), 'yyyy-MM-dd'),
        due_date: selectedInvoice.due_date || format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        status: selectedInvoice.status || 'draft',
        discount_type: selectedInvoice.discount_type || 'percentage',
        discount_value: selectedInvoice.discount_value || 0,
        tax_rate: selectedInvoice.tax_rate || 0,
        notes: selectedInvoice.notes || '',
        terms: selectedInvoice.terms || '',
        payment_method: selectedInvoice.payment_method || '',
      });
      setInvoiceItems(selectedInvoice.items || []);
      
      // Set selected entities
      const patient = patients.find(p => p.id === selectedInvoice.patient_id);
      const doctor = doctors.find(d => d.id === selectedInvoice.doctor_id);
      const appointment = appointments.find(a => a.id === selectedInvoice.appointment_id);
      
      setSelectedPatient(patient || null);
      setSelectedDoctor(doctor || null);
      setSelectedAppointment(appointment || null);
    } else {
      // Reset form for new invoice
      formik.resetForm();
      setInvoiceItems([]);
      setSelectedPatient(null);
      setSelectedDoctor(null);
      setSelectedAppointment(null);
      setActiveStep(0);
    }
  }, [selectedInvoice, editMode, open]);

  const handleClose = () => {
    formik.resetForm();
    setInvoiceItems([]);
    setSelectedService(null);
    setQuantity(1);
    setItemDiscount(0);
    setActiveStep(0);
    onClose();
  };

  const handleNext = () => {
    if (activeStep === 0 && !formik.values.patient_id) {
      formik.setFieldTouched('patient_id', true);
      return;
    }
    if (activeStep === 1 && invoiceItems.length === 0) {
      dispatch(showNotification({
        message: 'Please add at least one service',
        severity: 'error',
      }));
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddItem = () => {
    if (!selectedService) return;

    const subtotal = quantity * selectedService.unit_price;
    const discountAmount = (subtotal * itemDiscount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = selectedService.is_taxable ? (afterDiscount * selectedService.tax_rate) / 100 : 0;
    const total = afterDiscount + taxAmount;

    const newItem: InvoiceItem = {
      id: `item_${Date.now()}`,
      service_id: selectedService.id,
      service_name: selectedService.name,
      service_code: selectedService.service_code,
      description: selectedService.description,
      category: selectedService.category,
      quantity: quantity,
      unit_price: selectedService.unit_price,
      discount_percentage: itemDiscount,
      discount_amount: discountAmount,
      tax_rate: selectedService.tax_rate,
      tax_amount: taxAmount,
      total: total,
    };

    setInvoiceItems([...invoiceItems, newItem]);
    setSelectedService(null);
    setQuantity(1);
    setItemDiscount(0);
  };

  const handleRemoveItem = (itemId: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemId));
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const itemDiscounts = invoiceItems.reduce((sum, item) => sum + item.discount_amount, 0);
    const taxAmount = invoiceItems.reduce((sum, item) => sum + item.tax_amount, 0);
    
    const invoiceDiscount = formik.values.discount_type === 'percentage' 
      ? (subtotal * formik.values.discount_value) / 100 
      : formik.values.discount_value;
    
    const totalAmount = subtotal - itemDiscounts - invoiceDiscount + taxAmount;

    return {
      subtotal,
      itemDiscounts,
      invoiceDiscount,
      taxAmount,
      totalAmount,
    };
  };

  const totals = calculateTotals();

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                options={patients}
                value={selectedPatient}
                onChange={(event, newValue) => {
                  setSelectedPatient(newValue);
                  formik.setFieldValue('patient_id', newValue?.id || '');
                  
                  // Load patient's appointments
                  if (newValue) {
                    const patientAppointments = appointments.filter(
                      apt => apt.patient_id === newValue.id && apt.status === 'completed'
                    );
                    if (patientAppointments.length > 0 && !selectedAppointment) {
                      const latestAppointment = patientAppointments[0];
                      setSelectedAppointment(latestAppointment);
                      formik.setFieldValue('appointment_id', latestAppointment.id);
                      
                      // Set doctor from appointment
                      const appointmentDoctor = doctors.find(d => d.id === latestAppointment.doctor_id);
                      if (appointmentDoctor) {
                        setSelectedDoctor(appointmentDoctor);
                        formik.setFieldValue('doctor_id', appointmentDoctor.id);
                      }
                    }
                  }
                }}
                getOptionLabel={(option) => `${option.name} - ${option.patient_id}`}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="subtitle2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.patient_id} • {option.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Patient"
                    required
                    error={formik.touched.patient_id && Boolean(formik.errors.patient_id)}
                    helperText={formik.touched.patient_id && formik.errors.patient_id}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {selectedPatient && (
              <>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Patient Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">Name</Typography>
                        <Typography variant="body1">{selectedPatient.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{selectedPatient.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{selectedPatient.phone}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={appointments.filter(apt => apt.patient_id === selectedPatient.id)}
                    value={selectedAppointment}
                    onChange={(event, newValue) => {
                      setSelectedAppointment(newValue);
                      formik.setFieldValue('appointment_id', newValue?.id || '');
                      
                      // Set doctor from appointment
                      if (newValue) {
                        const appointmentDoctor = doctors.find(d => d.id === newValue.doctor_id);
                        if (appointmentDoctor) {
                          setSelectedDoctor(appointmentDoctor);
                          formik.setFieldValue('doctor_id', appointmentDoctor.id);
                        }
                      }
                    }}
                    getOptionLabel={(option) => 
                      `${format(new Date(option.date), 'MMM dd, yyyy')} - ${option.service_type}`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Related Appointment (Optional)"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={doctors}
                    value={selectedDoctor}
                    onChange={(event, newValue) => {
                      setSelectedDoctor(newValue);
                      formik.setFieldValue('doctor_id', newValue?.id || '');
                    }}
                    getOptionLabel={(option) => 
                      `Dr. ${option.first_name} ${option.last_name} - ${option.specialization.join(', ')}`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Doctor (Optional)"
                      />
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" gap={2} mb={2}>
                <Box flex={1}>
                  <Autocomplete
                    options={services.filter(s => s.is_active)}
                    value={selectedService}
                    onChange={(event, newValue) => setSelectedService(newValue)}
                    groupBy={(option) => option.category}
                    getOptionLabel={(option) => `${option.name} - $${option.unit_price}`}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Typography variant="subtitle2">{option.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                          {option.service_code} • ${option.unit_price}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Service"
                      placeholder="Search services..."
                    />
                  )}
                  fullWidth
                  />
                </Box>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1 }}
                  sx={{ width: 100 }}
                />
                <TextField
                  label="Discount %"
                  type="number"
                  value={itemDiscount}
                  onChange={(e) => setItemDiscount(parseFloat(e.target.value) || 0)}
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ width: 120 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddItem}
                  disabled={!selectedService}
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Discount</TableCell>
                      <TableCell align="right">Tax</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant="subtitle2">{item.service_name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.service_code}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${item.unit_price.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          {item.discount_percentage > 0 && (
                            <Typography variant="body2" color="error">
                              -{item.discount_percentage}% (${item.discount_amount.toFixed(2)})
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {item.tax_rate > 0 && (
                            <Typography variant="body2">
                              {item.tax_rate}% (${item.tax_amount.toFixed(2)})
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2">
                            ${item.total.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(item.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {invoiceItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            No items added yet
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Subtotal: ${totals.subtotal.toFixed(2)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issue Date"
                name="issue_date"
                type="date"
                value={formik.values.issue_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.issue_date && Boolean(formik.errors.issue_date)}
                helperText={formik.touched.issue_date && formik.errors.issue_date}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                name="due_date"
                type="date"
                value={formik.values.due_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.due_date && Boolean(formik.errors.due_date)}
                helperText={formik.touched.due_date && formik.errors.due_date}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  label="Status"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Invoice Discount
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  name="discount_type"
                  value={formik.values.discount_type}
                  onChange={formik.handleChange}
                  label="Discount Type"
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={formik.values.discount_type === 'percentage' ? 'Discount %' : 'Discount Amount'}
                name="discount_value"
                type="number"
                value={formik.values.discount_value}
                onChange={formik.handleChange}
                InputProps={{
                  startAdornment: formik.values.discount_type === 'fixed' ? '$' : undefined,
                  endAdornment: formik.values.discount_type === 'percentage' ? '%' : undefined,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Terms & Conditions"
                name="terms"
                multiline
                rows={2}
                value={formik.values.terms}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Please review the invoice details before saving.
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Bill To
                </Typography>
                <Typography variant="subtitle2">{selectedPatient?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPatient?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPatient?.phone}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Invoice Details
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Issue Date:</Typography>
                  <Typography variant="body2">
                    {format(new Date(formik.values.issue_date), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Due Date:</Typography>
                  <Typography variant="body2">
                    {format(new Date(formik.values.due_date), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip 
                    label={formik.values.status.toUpperCase()} 
                    size="small" 
                    color={formik.values.status === 'paid' ? 'success' : 'default'}
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.service_name}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${item.unit_price.toFixed(2)}</TableCell>
                        <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1">${totals.subtotal.toFixed(2)}</Typography>
                </Box>
                {totals.itemDiscounts > 0 && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1" color="error">Item Discounts:</Typography>
                    <Typography variant="body1" color="error">
                      -${totals.itemDiscounts.toFixed(2)}
                    </Typography>
                  </Box>
                )}
                {totals.invoiceDiscount > 0 && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1" color="error">Invoice Discount:</Typography>
                    <Typography variant="body1" color="error">
                      -${totals.invoiceDiscount.toFixed(2)}
                    </Typography>
                  </Box>
                )}
                {totals.taxAmount > 0 && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">Tax:</Typography>
                    <Typography variant="body1">${totals.taxAmount.toFixed(2)}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    ${totals.totalAmount.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Receipt />
            <Typography variant="h6">
              {editMode ? 'Edit Invoice' : 'Create New Invoice'}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting || invoiceItems.length === 0}
              startIcon={<Save />}
            >
              {editMode ? 'Update' : 'Create'} Invoice
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InvoiceDialog;