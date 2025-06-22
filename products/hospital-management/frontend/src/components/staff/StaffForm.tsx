import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createStaff, updateStaff } from '../../store/slices/staffSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import { format } from 'date-fns';

interface StaffFormData {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: string;
  alternate_phone: string;
  date_of_birth: Date | null;
  gender: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  employee_type: string;
  department: string;
  position: string;
  job_title: string;
  job_description: string;
  hire_date: Date | null;
  salary_type: string;
  base_salary: number;
  hourly_rate: number;
  health_insurance: boolean;
  paid_time_off_days: number;
  sick_leave_days: number;
}

interface StaffFormProps {
  open: boolean;
  onClose: () => void;
  staffData?: any;
  mode?: 'create' | 'edit';
}

const steps = ['Personal Information', 'Contact Details', 'Employment Information', 'Compensation'];

const departments = [
  'administration', 'reception', 'billing', 'housekeeping', 
  'security', 'maintenance', 'it', 'pharmacy', 'laboratory',
  'radiology', 'physiotherapy', 'nutrition', 'social_work',
  'hr', 'finance', 'purchasing', 'medical_records'
];

const StaffForm: React.FC<StaffFormProps> = ({ 
  open, 
  onClose, 
  staffData, 
  mode = 'create' 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState<StaffFormData>({
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    phone: '',
    alternate_phone: '',
    date_of_birth: null,
    gender: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
    employee_type: 'full_time',
    department: '',
    position: '',
    job_title: '',
    job_description: '',
    hire_date: new Date(),
    salary_type: 'monthly',
    base_salary: 0,
    hourly_rate: 0,
    health_insurance: false,
    paid_time_off_days: 21,
    sick_leave_days: 10,
  });

  useEffect(() => {
    if (mode === 'edit' && staffData) {
      setFormData({
        first_name: staffData.first_name || '',
        last_name: staffData.last_name || '',
        middle_name: staffData.middle_name || '',
        email: staffData.email || '',
        phone: staffData.phone || '',
        alternate_phone: staffData.alternate_phone || '',
        date_of_birth: staffData.date_of_birth ? new Date(staffData.date_of_birth) : null,
        gender: staffData.gender || '',
        address: staffData.address || '',
        city: staffData.city || '',
        state: staffData.state || '',
        postal_code: staffData.postal_code || '',
        emergency_contact_name: staffData.emergency_contact_name || '',
        emergency_contact_relationship: staffData.emergency_contact_relationship || '',
        emergency_contact_phone: staffData.emergency_contact_phone || '',
        employee_type: staffData.employee_type || 'full_time',
        department: staffData.department || '',
        position: staffData.position || '',
        job_title: staffData.job_title || '',
        job_description: staffData.job_description || '',
        hire_date: staffData.hire_date ? new Date(staffData.hire_date) : new Date(),
        salary_type: staffData.salary_type || 'monthly',
        base_salary: staffData.base_salary || 0,
        hourly_rate: staffData.hourly_rate || 0,
        health_insurance: staffData.health_insurance || false,
        paid_time_off_days: staffData.paid_time_off_days || 21,
        sick_leave_days: staffData.sick_leave_days || 10,
      });
    }
  }, [mode, staffData]);

  const handleInputChange = (field: keyof StaffFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: any = {};

    switch (step) {
      case 0: // Personal Information
        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        break;

      case 1: // Contact Details
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;

      case 2: // Employment Information
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.position.trim()) newErrors.position = 'Position is required';
        if (!formData.employee_type) newErrors.employee_type = 'Employee type is required';
        if (!formData.hire_date) newErrors.hire_date = 'Hire date is required';
        break;

      case 3: // Compensation
        if (formData.base_salary <= 0) newErrors.base_salary = 'Base salary must be greater than 0';
        if (formData.salary_type === 'hourly' && formData.hourly_rate <= 0) {
          newErrors.hourly_rate = 'Hourly rate must be greater than 0';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        date_of_birth: formData.date_of_birth ? format(formData.date_of_birth, 'yyyy-MM-dd') : null,
        hire_date: formData.hire_date ? format(formData.hire_date, 'yyyy-MM-dd') : null,
      };

      if (mode === 'edit' && staffData) {
        await dispatch(updateStaff({ id: staffData.id, data: submitData })).unwrap();
        dispatch(showNotification({
          message: 'Staff member updated successfully',
          severity: 'success',
        }));
      } else {
        await dispatch(createStaff(submitData)).unwrap();
        dispatch(showNotification({
          message: 'Staff member created successfully',
          severity: 'success',
        }));
      }

      onClose();
    } catch (error: any) {
      dispatch(showNotification({
        message: error.message || 'Failed to save staff member',
        severity: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="First Name"
          value={formData.first_name}
          onChange={(e) => handleInputChange('first_name', e.target.value)}
          error={!!errors.first_name}
          helperText={errors.first_name}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Last Name"
          value={formData.last_name}
          onChange={(e) => handleInputChange('last_name', e.target.value)}
          error={!!errors.last_name}
          helperText={errors.last_name}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Middle Name"
          value={formData.middle_name}
          onChange={(e) => handleInputChange('middle_name', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!errors.gender} required>
          <InputLabel>Gender</InputLabel>
          <Select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            label="Gender"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date of Birth"
            value={formData.date_of_birth}
            onChange={(date) => handleInputChange('date_of_birth', date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
            maxDate={new Date()}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );

  const renderContactDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Alternate Phone"
          value={formData.alternate_phone}
          onChange={(e) => handleInputChange('alternate_phone', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          multiline
          rows={2}
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="City"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="State"
          value={formData.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Postal Code"
          value={formData.postal_code}
          onChange={(e) => handleInputChange('postal_code', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Emergency Contact
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Emergency Contact Name"
          value={formData.emergency_contact_name}
          onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Relationship"
          value={formData.emergency_contact_relationship}
          onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Emergency Contact Phone"
          value={formData.emergency_contact_phone}
          onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
        />
      </Grid>
    </Grid>
  );

  const renderEmploymentInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!errors.department} required>
          <InputLabel>Department</InputLabel>
          <Select
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            label="Department"
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept.charAt(0).toUpperCase() + dept.slice(1).replace('_', ' ')}
              </MenuItem>
            ))}
          </Select>
          {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Position"
          value={formData.position}
          onChange={(e) => handleInputChange('position', e.target.value)}
          error={!!errors.position}
          helperText={errors.position}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Job Title"
          value={formData.job_title}
          onChange={(e) => handleInputChange('job_title', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!errors.employee_type} required>
          <InputLabel>Employee Type</InputLabel>
          <Select
            value={formData.employee_type}
            onChange={(e) => handleInputChange('employee_type', e.target.value)}
            label="Employee Type"
          >
            <MenuItem value="full_time">Full Time</MenuItem>
            <MenuItem value="part_time">Part Time</MenuItem>
            <MenuItem value="contract">Contract</MenuItem>
            <MenuItem value="intern">Intern</MenuItem>
            <MenuItem value="volunteer">Volunteer</MenuItem>
          </Select>
          {errors.employee_type && <FormHelperText>{errors.employee_type}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Job Description"
          multiline
          rows={3}
          value={formData.job_description}
          onChange={(e) => handleInputChange('job_description', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Hire Date"
            value={formData.hire_date}
            onChange={(date) => handleInputChange('hire_date', date)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                fullWidth 
                required
                error={!!errors.hire_date}
                helperText={errors.hire_date}
              />
            )}
            maxDate={new Date()}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );

  const renderCompensation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Salary Type</InputLabel>
          <Select
            value={formData.salary_type}
            onChange={(e) => handleInputChange('salary_type', e.target.value)}
            label="Salary Type"
          >
            <MenuItem value="hourly">Hourly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="annual">Annual</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Base Salary"
          type="number"
          value={formData.base_salary}
          onChange={(e) => handleInputChange('base_salary', parseFloat(e.target.value) || 0)}
          error={!!errors.base_salary}
          helperText={errors.base_salary}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          required
        />
      </Grid>
      {formData.salary_type === 'hourly' && (
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Hourly Rate"
            type="number"
            value={formData.hourly_rate}
            onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
            error={!!errors.hourly_rate}
            helperText={errors.hourly_rate}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Paid Time Off Days"
          type="number"
          value={formData.paid_time_off_days}
          onChange={(e) => handleInputChange('paid_time_off_days', parseInt(e.target.value) || 0)}
          InputProps={{
            inputProps: { min: 0, max: 365 }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Sick Leave Days"
          type="number"
          value={formData.sick_leave_days}
          onChange={(e) => handleInputChange('sick_leave_days', parseInt(e.target.value) || 0)}
          InputProps={{
            inputProps: { min: 0, max: 365 }
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.health_insurance}
              onChange={(e) => handleInputChange('health_insurance', e.target.checked)}
            />
          }
          label="Health Insurance Coverage"
        />
      </Grid>
    </Grid>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderPersonalInformation();
      case 1:
        return renderContactDetails();
      case 2:
        return renderEmploymentInformation();
      case 3:
        return renderCompensation();
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {mode === 'edit' ? 'Edit Staff Member' : 'Add New Staff Member'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fix the errors below before proceeding.
            </Alert>
          )}

          <Box sx={{ mt: 2 }}>
            {renderStepContent(activeStep)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext} disabled={loading}>
              Next
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? 'Saving...' : mode === 'edit' ? 'Update Staff' : 'Create Staff'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default StaffForm;