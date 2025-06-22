import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Chip,
  OutlinedInput,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import { Close, Save, Person } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createPatient, updatePatient } from '../../store/slices/patientSlice';
import { showNotification } from '../../store/slices/notificationSlice';

interface PatientDialogProps {
  open: boolean;
  onClose: () => void;
  patient?: any;
  editMode: boolean;
  onSuccess: () => void;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genders = ['Male', 'Female', 'Other'];
const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];

const commonChronicDiseases = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Heart Disease',
  'Arthritis',
  'COPD',
  'Cancer',
  'Kidney Disease',
  'Thyroid Disorder',
  'Depression',
];

const validationSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  date_of_birth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  phone: Yup.string()
    .matches(/^[\d\s()-]+$/, 'Invalid phone number')
    .required('Phone number is required'),
  email: Yup.string().email('Invalid email address'),
  address: Yup.string().required('Address is required'),
  emergency_contact_name: Yup.string().required('Emergency contact name is required'),
  emergency_contact_phone: Yup.string()
    .matches(/^[\d\s()-]+$/, 'Invalid phone number')
    .required('Emergency contact phone is required'),
});

const PatientDialog: React.FC<PatientDialogProps> = ({
  open,
  onClose,
  patient,
  editMode,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      blood_group: '',
      marital_status: '',
      occupation: '',
      chronic_diseases: [] as string[],
      allergies: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      insurance_provider: '',
      insurance_policy_number: '',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const patientData = {
          ...values,
          chronic_diseases: values.chronic_diseases.length > 0 ? values.chronic_diseases : [],
          allergies: values.allergies ? values.allergies.split(',').map(a => a.trim()).filter(a => a) : [],
        };

        if (editMode && patient) {
          await dispatch(updatePatient({ id: patient.id, data: patientData })).unwrap();
          dispatch(showNotification({
            message: 'Patient updated successfully',
            severity: 'success',
          }));
        } else {
          await dispatch(createPatient(patientData)).unwrap();
          dispatch(showNotification({
            message: 'Patient created successfully',
            severity: 'success',
          }));
        }
        onSuccess();
      } catch (error: any) {
        dispatch(showNotification({
          message: error.message || 'Failed to save patient',
          severity: 'error',
        }));
      }
    },
  });

  useEffect(() => {
    if (patient && editMode) {
      formik.setValues({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        date_of_birth: patient.date_of_birth ? format(new Date(patient.date_of_birth), 'yyyy-MM-dd') : '',
        gender: patient.gender || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        city: patient.city || '',
        state: patient.state || '',
        postal_code: patient.postal_code || '',
        blood_group: patient.blood_group || '',
        marital_status: patient.marital_status || '',
        occupation: patient.occupation || '',
        chronic_diseases: patient.chronic_diseases || [],
        allergies: patient.allergies || '',
        emergency_contact_name: patient.emergency_contact_name || '',
        emergency_contact_phone: patient.emergency_contact_phone || '',
        emergency_contact_relationship: patient.emergency_contact_relationship || '',
        insurance_provider: patient.insurance_provider || '',
        insurance_policy_number: patient.insurance_policy_number || '',
        notes: patient.notes || '',
      });
    } else {
      formik.resetForm();
    }
  }, [patient, editMode, open]);

  const handleChronicDiseaseChange = (event: any) => {
    const value = event.target.value;
    formik.setFieldValue('chronic_diseases', typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Person />
            <Typography variant="h6">
              {editMode ? 'Edit Patient' : 'New Patient Registration'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={formik.values.date_of_birth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required error={formik.touched.gender && Boolean(formik.errors.gender)}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Gender"
                >
                  {genders.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.gender && formik.errors.gender && (
                  <FormHelperText>{formik.errors.gender}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  name="marital_status"
                  value={formik.values.marital_status}
                  onChange={formik.handleChange}
                  label="Marital Status"
                >
                  <MenuItem value="">None</MenuItem>
                  {maritalStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 2 }}>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postal_code"
                value={formik.values.postal_code}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Medical Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 2 }}>
                Medical Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Select
                  name="blood_group"
                  value={formik.values.blood_group}
                  onChange={formik.handleChange}
                  label="Blood Group"
                >
                  <MenuItem value="">None</MenuItem>
                  {bloodGroups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel>Chronic Diseases</InputLabel>
                <Select
                  multiple
                  name="chronic_diseases"
                  value={formik.values.chronic_diseases}
                  onChange={handleChronicDiseaseChange}
                  input={<OutlinedInput label="Chronic Diseases" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {commonChronicDiseases.map((disease) => (
                    <MenuItem key={disease} value={disease}>
                      {disease}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Allergies"
                name="allergies"
                value={formik.values.allergies}
                onChange={formik.handleChange}
                multiline
                rows={2}
                placeholder="List any allergies to medications, food, or environmental factors"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Occupation"
                name="occupation"
                value={formik.values.occupation}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 2 }}>
                Emergency Contact
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Contact Name"
                name="emergency_contact_name"
                value={formik.values.emergency_contact_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.emergency_contact_name && Boolean(formik.errors.emergency_contact_name)}
                helperText={formik.touched.emergency_contact_name && formik.errors.emergency_contact_name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Contact Phone"
                name="emergency_contact_phone"
                value={formik.values.emergency_contact_phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.emergency_contact_phone && Boolean(formik.errors.emergency_contact_phone)}
                helperText={formik.touched.emergency_contact_phone && formik.errors.emergency_contact_phone}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Relationship"
                name="emergency_contact_relationship"
                value={formik.values.emergency_contact_relationship}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Insurance Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 2 }}>
                Insurance Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Insurance Provider"
                name="insurance_provider"
                value={formik.values.insurance_provider}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy Number"
                name="insurance_policy_number"
                value={formik.values.insurance_policy_number}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Additional Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                multiline
                rows={3}
                placeholder="Any additional information or special requirements"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={formik.isSubmitting}
          >
            {editMode ? 'Update' : 'Create'} Patient
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PatientDialog;