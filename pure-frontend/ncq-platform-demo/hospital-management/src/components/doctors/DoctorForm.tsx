import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Close,
  Add,
  Delete,
  PhotoCamera,
  Person,
  LocalHospital,
  Phone,
  Email,
  LocationOn,
  School,
  Work,
  AttachMoney,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Doctor, Education, Experience } from '../../store/slices/doctorSlice';
import { format } from 'date-fns';

interface DoctorFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (doctor: Partial<Doctor>) => void;
  doctor?: Doctor | null;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ open, onClose, onSave, doctor }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Doctor>>({
    title: 'Dr.',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    emergency_phone: '',
    date_of_birth: '',
    gender: 'male',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    license_number: '',
    license_expiry: '',
    department: '',
    specialization: [],
    languages: [],
    bio: '',
    consultation_fee: 100,
    follow_up_fee: 50,
    status: 'active',
    education: [],
    experience: [],
  });

  const [errors, setErrors] = useState<any>({});
  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    degree: '',
    institution: '',
    year: new Date().getFullYear(),
    specialization: '',
  });
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    position: '',
    hospital: '',
    start_date: '',
    end_date: '',
    description: '',
  });

  const steps = ['Personal Info', 'Professional Info', 'Education & Experience', 'Fees & Settings'];

  const departments = [
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Neurology',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Emergency Medicine',
  ];

  const specializations = [
    'General Practitioner',
    'Cardiologist',
    'Orthopedic Surgeon',
    'Pediatrician',
    'Dermatologist',
    'Neurologist',
    'Psychiatrist',
    'Radiologist',
    'General Surgeon',
    'Emergency Medicine Specialist',
    'Anesthesiologist',
    'Gynecologist',
    'Urologist',
    'Oncologist',
    'Endocrinologist',
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Arabic',
    'Chinese',
    'Hindi',
    'Portuguese',
    'Russian',
    'Japanese',
  ];

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
    }
  }, [doctor]);

  const validateStep = (step: number): boolean => {
    const newErrors: any = {};

    switch (step) {
      case 0: // Personal Info
        if (!formData.first_name) newErrors.first_name = 'First name is required';
        if (!formData.last_name) newErrors.last_name = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        break;

      case 1: // Professional Info
        if (!formData.license_number) newErrors.license_number = 'License number is required';
        if (!formData.license_expiry) newErrors.license_expiry = 'License expiry is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.specialization || formData.specialization.length === 0) {
          newErrors.specialization = 'At least one specialization is required';
        }
        break;

      case 2: // Education & Experience
        if (!formData.education || formData.education.length === 0) {
          newErrors.education = 'At least one education entry is required';
        }
        break;

      case 3: // Fees & Settings
        if (!formData.consultation_fee || formData.consultation_fee <= 0) {
          newErrors.consultation_fee = 'Consultation fee must be greater than 0';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      // Generate doctor ID if new doctor
      if (!doctor) {
        formData.doctor_id = `DOC${Date.now().toString().slice(-6)}`;
        formData.joined_date = new Date().toISOString();
      }
      onSave(formData);
      onClose();
    }
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      const education: Education = {
        ...newEducation as Education,
        id: `edu-${Date.now()}`,
      };
      setFormData({
        ...formData,
        education: [...(formData.education || []), education],
      });
      setNewEducation({
        degree: '',
        institution: '',
        year: new Date().getFullYear(),
        specialization: '',
      });
    }
  };

  const removeEducation = (id: string) => {
    setFormData({
      ...formData,
      education: formData.education?.filter(edu => edu.id !== id) || [],
    });
  };

  const addExperience = () => {
    if (newExperience.position && newExperience.hospital && newExperience.start_date) {
      const experience: Experience = {
        ...newExperience as Experience,
        id: `exp-${Date.now()}`,
      };
      setFormData({
        ...formData,
        experience: [...(formData.experience || []), experience],
      });
      setNewExperience({
        position: '',
        hospital: '',
        start_date: '',
        end_date: '',
        description: '',
      });
    }
  };

  const removeExperience = (id: string) => {
    setFormData({
      ...formData,
      experience: formData.experience?.filter(exp => exp.id !== id) || [],
    });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Avatar
                src={formData.profile_image}
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
              >
                {formData.first_name?.[0]}{formData.last_name?.[0]}
              </Avatar>
              <Button
                variant="outlined"
                startIcon={<PhotoCamera />}
                size="small"
              >
                Upload Photo
              </Button>
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                select
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              >
                <MenuItem value="Dr.">Dr.</MenuItem>
                <MenuItem value="Prof.">Prof.</MenuItem>
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Ms.">Ms.</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                error={!!errors.first_name}
                helperText={errors.first_name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                error={!!errors.last_name}
                helperText={errors.last_name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                required
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={!!errors.phone}
                helperText={errors.phone}
                required
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Phone"
                value={formData.emergency_phone}
                onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
                  onChange={(value) => setFormData({ 
                    ...formData, 
                    date_of_birth: value ? format(value, 'yyyy-MM-dd') : '' 
                  })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.date_of_birth,
                      helperText: errors.date_of_birth,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={!!errors.address}
                helperText={errors.address}
                required
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                error={!!errors.city}
                helperText={errors.city}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                error={!!errors.state}
                helperText={errors.state}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Postal Code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="License Number"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                error={!!errors.license_number}
                helperText={errors.license_number}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="License Expiry"
                  value={formData.license_expiry ? new Date(formData.license_expiry) : null}
                  onChange={(value) => setFormData({ 
                    ...formData, 
                    license_expiry: value ? format(value, 'yyyy-MM-dd') : '' 
                  })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.license_expiry,
                      helperText: errors.license_expiry,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                error={!!errors.department}
                helperText={errors.department}
                required
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.specialization}>
                <InputLabel>Specializations</InputLabel>
                <Select
                  multiple
                  value={formData.specialization || []}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    specialization: e.target.value as string[] 
                  })}
                  input={<OutlinedInput label="Specializations" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {specializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Languages</InputLabel>
                <Select
                  multiple
                  value={formData.languages || []}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    languages: e.target.value as string[] 
                  })}
                  input={<OutlinedInput label="Languages" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Write a brief bio about the doctor..."
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            {errors.education && (
              <Typography color="error" variant="body2" gutterBottom>
                {errors.education}
              </Typography>
            )}
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Degree"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  placeholder="e.g., MBBS, MD"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Institution"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Year"
                  value={newEducation.year}
                  onChange={(e) => setNewEducation({ ...newEducation, year: parseInt(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={addEducation}
                  sx={{ height: '100%' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>

            <List>
              {formData.education?.map((edu) => (
                <ListItem key={edu.id}>
                  <ListItemText
                    primary={`${edu.degree} ${edu.specialization ? `- ${edu.specialization}` : ''}`}
                    secondary={`${edu.institution}, ${edu.year}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => removeEducation(edu.id)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Experience
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Position"
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Hospital"
                  value={newExperience.hospital}
                  onChange={(e) => setNewExperience({ ...newExperience, hospital: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={newExperience.start_date ? new Date(newExperience.start_date) : null}
                    onChange={(value) => setNewExperience({ 
                      ...newExperience, 
                      start_date: value ? format(value, 'yyyy-MM-dd') : '' 
                    })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={newExperience.end_date ? new Date(newExperience.end_date) : null}
                    onChange={(value) => setNewExperience({ 
                      ...newExperience, 
                      end_date: value ? format(value, 'yyyy-MM-dd') : '' 
                    })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={addExperience}
                  sx={{ height: '100%' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>

            <List>
              {formData.experience?.map((exp) => (
                <ListItem key={exp.id} alignItems="flex-start">
                  <ListItemText
                    primary={exp.position}
                    secondary={
                      <>
                        <Typography variant="body2">
                          {exp.hospital}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(exp.start_date), 'MMM yyyy')} - 
                          {exp.end_date ? format(new Date(exp.end_date), 'MMM yyyy') : 'Present'}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => removeExperience(exp.id)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Consultation Fee"
                value={formData.consultation_fee}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  consultation_fee: parseFloat(e.target.value) 
                })}
                error={!!errors.consultation_fee}
                helperText={errors.consultation_fee}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Follow-up Fee"
                value={formData.follow_up_fee}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  follow_up_fee: parseFloat(e.target.value) 
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Doctor['status'] })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="on_leave">On Leave</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {doctor ? 'Edit Doctor' : 'Add New Doctor'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Box sx={{ flex: 1 }} />
        {activeStep > 0 && (
          <Button onClick={handleBack}>Back</Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSubmit}>
            {doctor ? 'Update' : 'Create'} Doctor
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DoctorForm;