import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Autocomplete,
  Chip,
  Alert,
  Divider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  Cancel,
  Calculate,
  Print,
  Email,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  Invoice,
  InvoiceItem,
  createInvoice,
  updateInvoice,
} from '../../store/slices/invoiceSlice';
import { showNotification } from '../../store/slices/notificationSlice';

interface InvoiceFormProps {
  invoiceToEdit?: Invoice;
  patientId?: string;
  onSuccess?: (invoice: Invoice) => void;
  onCancel?: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceToEdit,
  patientId,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { patients } = useSelector((state: RootState) => state.patients);
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<Partial<Invoice>>({
    type: 'consultation',
    status: 'draft',
    issue_date: new Date().toISOString(),
    due_date: addDays(new Date(), 30).toISOString(),
    items: [],
    subtotal: 0,
    tax_rate: 10,
    tax_amount: 0,
    discount_type: 'percentage',
    discount_value: 0,
    discount_amount: 0,
    insurance_coverage: 0,
    patient_responsibility: 0,
    total_amount: 0,
    paid_amount: 0,
    balance_due: 0,
    terms_and_conditions: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
  });

  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    description: '',
    category: 'consultation',
    quantity: 1,
    unit_price: 0,
    discount: 0,
    tax: 0,
    total: 0,
    is_covered_by_insurance: false,
  });

  useEffect(() => {
    if (invoiceToEdit) {
      setFormData(invoiceToEdit);
      setItems(invoiceToEdit.items || []);
      const patient = patients.find(p => p.id === invoiceToEdit.patient_id);
      if (patient) {
        setSelectedPatient(patient);
      }
    } else if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setSelectedPatient(patient);
        setFormData(prev => ({
          ...prev,
          patient_id: patient.id,
          patient_name: `${patient.first_name} ${patient.last_name}`,
          patient_email: patient.email,
          patient_phone: patient.phone,
          patient_address: patient.address,
          insurance_provider: patient.insurance_provider,
          insurance_policy_number: patient.insurance_policy_number,
        }));
      }
    }
  }, [invoiceToEdit, patientId, patients]);

  const invoiceTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'lab_test', label: 'Lab Test' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'hospitalization', label: 'Hospitalization' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'other', label: 'Other' },
  ];

  const itemCategories = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'medication', label: 'Medication' },
    { value: 'lab_test', label: 'Lab Test' },
    { value: 'room_charge', label: 'Room Charge' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'other', label: 'Other' },
  ];

  const calculateItemTotal = (item: Partial<InvoiceItem>) => {
    const quantity = item.quantity || 0;
    const unitPrice = item.unit_price || 0;
    const discount = item.discount || 0;
    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * ((item.tax || 0) / 100);
    return afterDiscount + taxAmount;
  };

  const addItem = () => {
    if (newItem.description && newItem.unit_price) {
      const total = calculateItemTotal(newItem);
      const itemToAdd: InvoiceItem = {
        id: `item_${Date.now()}`,
        description: newItem.description,
        category: newItem.category || 'consultation',
        code: newItem.code,
        quantity: newItem.quantity || 1,
        unit_price: newItem.unit_price,
        discount: newItem.discount || 0,
        tax: newItem.tax || formData.tax_rate || 10,
        total,
        is_covered_by_insurance: newItem.is_covered_by_insurance,
      };
      setItems([...items, itemToAdd]);
      setNewItem({
        description: '',
        category: 'consultation',
        quantity: 1,
        unit_price: 0,
        discount: 0,
        tax: formData.tax_rate || 10,
        total: 0,
        is_covered_by_insurance: false,
      });
      calculateTotals([...items, itemToAdd]);
    }
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const calculateTotals = (currentItems: InvoiceItem[] = items) => {
    const subtotal = currentItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const itemDiscounts = currentItems.reduce((sum, item) => {
      const itemSubtotal = item.unit_price * item.quantity;
      return sum + (itemSubtotal * (item.discount || 0) / 100);
    }, 0);
    
    const afterItemDiscounts = subtotal - itemDiscounts;
    const taxAmount = afterItemDiscounts * (formData.tax_rate || 0) / 100;
    
    let discountAmount = 0;
    if (formData.discount_type === 'percentage') {
      discountAmount = afterItemDiscounts * (formData.discount_value || 0) / 100;
    } else {
      discountAmount = formData.discount_value || 0;
    }
    
    const totalAmount = afterItemDiscounts + taxAmount - discountAmount;
    const insuranceCoverage = formData.insurance_coverage || 0;
    const patientResponsibility = Math.max(0, totalAmount - insuranceCoverage);
    const balanceDue = totalAmount - (formData.paid_amount || 0);

    setFormData(prev => ({
      ...prev,
      items: currentItems,
      subtotal: afterItemDiscounts,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      patient_responsibility: patientResponsibility,
      balance_due: balanceDue,
    }));
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patient_id: patient.id,
        patient_name: `${patient.first_name} ${patient.last_name}`,
        patient_email: patient.email,
        patient_phone: patient.phone,
        patient_address: patient.address,
        insurance_provider: patient.insurance_provider,
        insurance_policy_number: patient.insurance_policy_number,
      }));
    }
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}-${random}`;
  };

  const handleSubmit = async () => {
    if (!selectedPatient || items.length === 0) {
      dispatch(showNotification({
        message: 'Please select a patient and add at least one item',
        severity: 'error',
      }));
      return;
    }

    const invoiceData: Partial<Invoice> = {
      ...formData,
      invoice_number: formData.invoice_number || generateInvoiceNumber(),
      items,
      created_by: user?.id || 'system',
    };

    try {
      let result;
      if (invoiceToEdit) {
        result = await dispatch(updateInvoice({ 
          id: invoiceToEdit.id, 
          data: invoiceData 
        })).unwrap();
      } else {
        result = await dispatch(createInvoice(invoiceData)).unwrap();
      }

      dispatch(showNotification({
        message: `Invoice ${invoiceToEdit ? 'updated' : 'created'} successfully`,
        severity: 'success',
      }));

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      dispatch(showNotification({
        message: `Failed to ${invoiceToEdit ? 'update' : 'create'} invoice`,
        severity: 'error',
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    // In a real app, this would trigger an email
    dispatch(showNotification({
      message: 'Email functionality would be implemented here',
      severity: 'info',
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {invoiceToEdit ? 'Edit Invoice' : 'New Invoice'}
          </Typography>
          
          <Grid container spacing={3}>
            {/* Patient Selection */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                value={selectedPatient}
                onChange={(_, newValue) => handlePatientSelect(newValue)}
                options={patients}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name} - ${option.medical_record_number}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Patient"
                    required
                  />
                )}
                disabled={!!invoiceToEdit}
              />
            </Grid>

            {/* Invoice Details */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                value={formData.invoice_number || ''}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                placeholder="Auto-generated if left empty"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Invoice Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  label="Invoice Type"
                >
                  {invoiceTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <DatePicker
                label="Issue Date"
                value={new Date(formData.issue_date || '')}
                onChange={(newValue) => setFormData({ 
                  ...formData, 
                  issue_date: newValue?.toISOString() || '' 
                })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <DatePicker
                label="Due Date"
                value={new Date(formData.due_date || '')}
                onChange={(newValue) => setFormData({ 
                  ...formData, 
                  due_date: newValue?.toISOString() || '' 
                })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Patient Information */}
        {selectedPatient && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Patient Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Name</Typography>
                <Typography variant="body1">{formData.patient_name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{formData.patient_email || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Phone</Typography>
                <Typography variant="body1">{formData.patient_phone || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Insurance</Typography>
                <Typography variant="body1">
                  {formData.insurance_provider || 'No Insurance'} 
                  {formData.insurance_policy_number && ` - ${formData.insurance_policy_number}`}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Invoice Items */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Invoice Items</Typography>
          
          {/* Add Item Form */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                  label="Category"
                >
                  {itemCategories.map(cat => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <TextField
                fullWidth
                label="Qty"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Unit Price"
                type="number"
                value={newItem.unit_price}
                onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <TextField
                fullWidth
                label="Discount"
                type="number"
                value={newItem.discount}
                onChange={(e) => setNewItem({ ...newItem, discount: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <TextField
                fullWidth
                label="Tax"
                type="number"
                value={newItem.tax}
                onChange={(e) => setNewItem({ ...newItem, tax: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="contained"
                onClick={addItem}
                startIcon={<Add />}
                sx={{ height: '56px' }}
              >
                Add
              </Button>
            </Grid>
          </Grid>

          {/* Items Table */}
          <TableContainer>
            <Table size="small">
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
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell align="right">{item.discount}%</TableCell>
                    <TableCell align="right">{item.tax}%</TableCell>
                    <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.is_covered_by_insurance ? 'Covered' : 'Not Covered'}
                        size="small"
                        color={item.is_covered_by_insurance ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => removeItem(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No items added yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Totals and Adjustments */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Adjustments</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tax Rate"
                    type="number"
                    value={formData.tax_rate}
                    onChange={(e) => {
                      setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 });
                      calculateTotals();
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Discount Type</InputLabel>
                    <Select
                      value={formData.discount_type}
                      onChange={(e) => {
                        setFormData({ ...formData, discount_type: e.target.value as any });
                        calculateTotals();
                      }}
                      label="Discount Type"
                    >
                      <MenuItem value="percentage">Percentage</MenuItem>
                      <MenuItem value="fixed">Fixed Amount</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Discount Value"
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => {
                      setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 });
                      calculateTotals();
                    }}
                    InputProps={{
                      startAdornment: formData.discount_type === 'fixed' && <InputAdornment position="start">$</InputAdornment>,
                      endAdornment: formData.discount_type === 'percentage' && <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Insurance Coverage"
                    type="number"
                    value={formData.insurance_coverage}
                    onChange={(e) => {
                      setFormData({ ...formData, insurance_coverage: parseFloat(e.target.value) || 0 });
                      calculateTotals();
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Summary</Typography>
              
              <Box sx={{ '& > div': { display: 'flex', justifyContent: 'space-between', mb: 1 } }}>
                <Box>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="h6">${formData.subtotal?.toFixed(2) || '0.00'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2">Tax ({formData.tax_rate}%):</Typography>
                  <Typography variant="h6">${formData.tax_amount?.toFixed(2) || '0.00'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2">Discount:</Typography>
                  <Typography variant="h6" color="error">-${formData.discount_amount?.toFixed(2) || '0.00'}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="body2">Total Amount:</Typography>
                  <Typography variant="h5">${formData.total_amount?.toFixed(2) || '0.00'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2">Insurance Coverage:</Typography>
                  <Typography variant="h6" color="success.main">-${formData.insurance_coverage?.toFixed(2) || '0.00'}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="body2">Patient Responsibility:</Typography>
                  <Typography variant="h5" color="primary">${formData.patient_responsibility?.toFixed(2) || '0.00'}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Notes and Terms */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Terms and Conditions"
                value={formData.terms_and_conditions || ''}
                onChange={(e) => setFormData({ ...formData, terms_and_conditions: e.target.value })}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<Email />}
              onClick={handleEmail}
            >
              Email
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {onCancel && (
              <Button variant="outlined" onClick={onCancel} startIcon={<Cancel />}>
                Cancel
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleSubmit}
              startIcon={<Save />}
              disabled={!selectedPatient || items.length === 0}
            >
              {invoiceToEdit ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default InvoiceForm;