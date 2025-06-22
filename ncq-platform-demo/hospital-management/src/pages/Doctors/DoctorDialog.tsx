import React, { useEffect, useState } from 'react';
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
  Typography,
  Divider,
  IconButton,
  Autocomplete,
  Chip,
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Close,
  Save,
  Person,
  LocalHospital,
  School,
  Work,
  Add,
  Delete,
  PhotoCamera,
  ContactPhone,
  Badge,
  Description,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createDoctor, updateDoctor, Doctor, Education, Experience } from '../../store/slices/doctorSlice';
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
      id={`doctor-tabpanel-${index}`}
      aria-labelledby={`doctor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface DoctorDialogProps {
  open: boolean;
  onClose: () => void;
  doctor?: Doctor | null;
  editMode: boolean;
  onSuccess: () => void;
}

const departments = [
  'General Medicine',
  'Cardiology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Neurology',
  'Psychiatry',
  'Radiology',
  'Emergency',
  'Anesthesiology',
  'Surgery',
  'Oncology',
  'Gynecology',
  'Ophthalmology',
  'ENT',
];

const specializations = [
  'General Medicine',
  'Family Medicine',
  'Cardiology',
  'Interventional Cardiology',
  'Pediatrics',
  'Neonatal Care',
  'Orthopedics',
  'Sports Medicine',
  'Dermatology',
  'Cosmetic Dermatology',
  'Neurology',
  'Stroke Medicine',
  'Psychiatry',
  'Child Psychiatry',
  'Radiology',
  'Interventional Radiology',
  'Emergency Medicine',
  'Trauma Care',
  'Anesthesiology',
  'Pain Management',
];

const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Mandarin',
  'Hindi',
  'Arabic',
  'Russian',
  'Japanese',
  'Korean',
];

const titles = ['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.'];
const genders = ['Male', 'Female', 'Other'];
const statuses = ['active', 'inactive', 'on_leave', 'suspended'];

const validationSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  title: Yup.string().required('Title is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  date_of_birth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  department: Yup.string().required('Department is required'),
  license_number: Yup.string().required('License number is required'),
  license_expiry: Yup.date()
    .min(new Date(), 'License must be valid')
    .required('License expiry is required'),
  consultation_fee: Yup.number()
    .positive('Fee must be positive')
    .required('Consultation fee is required'),
  follow_up_fee: Yup.number()
    .positive('Fee must be positive')
    .required('Follow-up fee is required'),
});

const DoctorDialog: React.FC<DoctorDialogProps> = ({
  open,
  onClose,
  doctor,
  editMode,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState(0);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);

  const formik = useFormik({
    initialValues: {
      // Basic Information
      title: 'Dr.',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      emergency_phone: '',
      date_of_birth: '',
      gender: '',
      
      // Address
      address: '',
      city: '',
      state: '',
      postal_code: '',
      
      // Professional Information
      doctor_id: '',
      department: '',
      specialization: [] as string[],
      license_number: '',
      license_expiry: '',
      status: 'active' as Doctor['status'],
      is_available: true,
      
      // Consultation
      consultation_fee: 0,
      follow_up_fee: 0,
      languages: [] as string[],
      bio: '',
      
      // Other
      joined_date: format(new Date(), 'yyyy-MM-dd'),
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Generate doctor ID if not provided
        const doctorId = values.doctor_id || `DOC${Date.now().toString().slice(-6)}`;
        
        const doctorData = {
          ...values,
          id: editMode && doctor ? doctor.id : `doc_${Date.now()}`,
          doctor_id: doctorId,
          education,
          experience,
          // Generate working hours template
          working_hours: {
            monday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
            tuesday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
            wednesday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
            thursday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
            friday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
            saturday: { is_working: false, start_time: '', end_time: '' },
            sunday: { is_working: false, start_time: '', end_time: '' }
          },
          time_slots: [
            { id: 'slot1', start_time: '09:00', end_time: '12:00', max_patients: 8, slot_duration: 30 },
            { id: 'slot2', start_time: '13:00', end_time: '17:00', max_patients: 8, slot_duration: 30 }
          ],
          leave_periods: [],
          // Default statistics for new doctors
          total_patients: 0,
          total_appointments: 0,
          completed_appointments: 0,
          cancelled_appointments: 0,
          revenue_this_month: 0,
          average_consultation_time: 30,
          rating: 0,
          total_reviews: 0,
        };

        if (editMode && doctor) {
          await dispatch(updateDoctor({ 
            id: doctor.id, 
            data: doctorData 
          })).unwrap();
          dispatch(showNotification({
            message: 'Doctor updated successfully',
            severity: 'success',
          }));
        } else {
          await dispatch(createDoctor(doctorData)).unwrap();
          dispatch(showNotification({
            message: 'Doctor added successfully',
            severity: 'success',
          }));
        }
        onSuccess();
        handleClose();
      } catch (error: any) {
        dispatch(showNotification({
          message: error.message || 'Failed to save doctor',
          severity: 'error',
        }));
      }
    },
  });

  useEffect(() => {
    if (doctor && editMode) {
      formik.setValues({
        title: doctor.title || 'Dr.',
        first_name: doctor.first_name || '',
        last_name: doctor.last_name || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        emergency_phone: doctor.emergency_phone || '',
        date_of_birth: doctor.date_of_birth || '',
        gender: doctor.gender || '',
        address: doctor.address || '',
        city: doctor.city || '',
        state: doctor.state || '',
        postal_code: doctor.postal_code || '',
        doctor_id: doctor.doctor_id || '',
        department: doctor.department || '',
        specialization: doctor.specialization || [],
        license_number: doctor.license_number || '',
        license_expiry: doctor.license_expiry || '',
        status: doctor.status || 'active',
        is_available: doctor.is_available !== undefined ? doctor.is_available : true,
        consultation_fee: doctor.consultation_fee || 0,
        follow_up_fee: doctor.follow_up_fee || 0,
        languages: doctor.languages || [],
        bio: doctor.bio || '',
        joined_date: doctor.joined_date || format(new Date(), 'yyyy-MM-dd'),
      });
      setEducation(doctor.education || []);
      setExperience(doctor.experience || []);
    } else {
      // Reset form for new doctor
      formik.resetForm();
      setEducation([]);
      setExperience([]);
    }
  }, [doctor, editMode, open]);

  const handleClose = () => {
    formik.resetForm();
    setEducation([]);
    setExperience([]);
    setTabValue(0);
    onClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Education Management
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      year: new Date().getFullYear(),
      specialization: '',
    };
    setEducation([...education, newEducation]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string | number) => {
    const updatedEducation = [...education];
    (updatedEducation[index] as any)[field] = value;
    setEducation(updatedEducation);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Experience Management
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      position: '',
      hospital: '',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: '',
      description: '',
    };
    setExperience([...experience, newExperience]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updatedExperience = [...experience];
    (updatedExperience[index] as any)[field] = value;
    setExperience(updatedExperience);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <LocalHospital />
            <Typography variant="h6">
              {editMode ? 'Edit Doctor' : 'Add New Doctor'}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Basic Information" />
            <Tab label="Professional Details" />
            <Tab label="Education & Experience" />
            <Tab label="Additional Information" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {/* Basic Information */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth required>
                  <InputLabel>Title</InputLabel>
                  <Select
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    label="Title"
                  >
                    {titles.map((title) => (
                      <MenuItem key={title} value={title}>
                        {title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={5}>
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

              <Grid item xs={12} sm={6} md={5}>
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
                  required
                />
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
                  label="Emergency Phone"
                  name="emergency_phone"
                  value={formik.values.emergency_phone}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    label="Gender"
                  >
                    {genders.map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Address Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
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
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Professional Details */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Professional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Doctor ID"
                  name="doctor_id"
                  value={formik.values.doctor_id}
                  onChange={formik.handleChange}
                  placeholder="Auto-generated if empty"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    label="Department"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={specializations}
                  value={formik.values.specialization}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('specialization', newValue);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Specializations"
                      placeholder="Select specializations"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="License Number"
                  name="license_number"
                  value={formik.values.license_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.license_number && Boolean(formik.errors.license_number)}
                  helperText={formik.touched.license_number && formik.errors.license_number}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="License Expiry"
                  name="license_expiry"
                  type="date"
                  value={formik.values.license_expiry}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.license_expiry && Boolean(formik.errors.license_expiry)}
                  helperText={formik.touched.license_expiry && formik.errors.license_expiry}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Consultation Fee"
                  name="consultation_fee"
                  type="number"
                  value={formik.values.consultation_fee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.consultation_fee && Boolean(formik.errors.consultation_fee)}
                  helperText={formik.touched.consultation_fee && formik.errors.consultation_fee}
                  InputProps={{ startAdornment: '$' }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Follow-up Fee"
                  name="follow_up_fee"
                  type="number"
                  value={formik.values.follow_up_fee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.follow_up_fee && Boolean(formik.errors.follow_up_fee)}
                  helperText={formik.touched.follow_up_fee && formik.errors.follow_up_fee}
                  InputProps={{ startAdornment: '$' }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    label="Status"
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.replace('_', ' ').toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Joined Date"
                  name="joined_date"
                  type="date"
                  value={formik.values.joined_date}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Education & Experience */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Education</Typography>
                  <Button startIcon={<Add />} onClick={addEducation}>
                    Add Education
                  </Button>
                </Box>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {education.map((edu, index) => (
                <Grid item xs={12} key={edu.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Degree"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            placeholder="e.g., MD, PhD, MBBS"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Institution"
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Year"
                            type="number"
                            value={edu.year}
                            onChange={(e) => updateEducation(index, 'year', parseInt(e.target.value))}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Specialization (Optional)"
                            value={edu.specialization || ''}
                            onChange={(e) => updateEducation(index, 'specialization', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <IconButton onClick={() => removeEducation(index)} color="error">
                              <Delete />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                  <Typography variant="h6">Experience</Typography>
                  <Button startIcon={<Add />} onClick={addExperience}>
                    Add Experience
                  </Button>
                </Box>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {experience.map((exp, index) => (
                <Grid item xs={12} key={exp.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Position"
                            value={exp.position}
                            onChange={(e) => updateExperience(index, 'position', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Hospital/Organization"
                            value={exp.hospital}
                            onChange={(e) => updateExperience(index, 'hospital', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            value={exp.start_date}
                            onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="End Date (Optional)"
                            type="date"
                            value={exp.end_date || ''}
                            onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <IconButton onClick={() => removeExperience(index)} color="error">
                              <Delete />
                            </IconButton>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={2}
                            value={exp.description}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {/* Additional Information */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={languages}
                  value={formik.values.languages}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('languages', newValue);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Languages Spoken"
                      placeholder="Select languages"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  placeholder="Brief professional biography..."
                />
              </Grid>
            </Grid>
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={formik.isSubmitting}
          >
            {editMode ? 'Update' : 'Add'} Doctor
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DoctorDialog;