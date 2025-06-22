import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { LocalHospital } from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { register, clearError } from '../store/slices/authSlice';

const registerSchema = Yup.object({
  // Company Info
  company_name: Yup.string().required('Hospital name is required'),
  subdomain: Yup.string()
    .required('Subdomain is required')
    .matches(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Only lowercase letters, numbers, and hyphens'),
  
  // Admin User Info
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  
  // Contact Info
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  postal_code: Yup.string(),
});

const steps = ['Hospital Information', 'Admin Account', 'Contact Details'];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleSubmit = async (values: any) => {
    const { confirmPassword, ...registerData } = values;
    try {
      await dispatch(register(registerData)).unwrap();
      navigate('/');
    } catch (err) {
      // Error handled by Redux
    }
  };

  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const getStepContent = (step: number, formikProps: any) => {
    const { values, errors, touched, handleChange, handleBlur } = formikProps;

    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="company_name"
                label="Hospital/Clinic Name"
                value={values.company_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.company_name && Boolean(errors.company_name)}
                helperText={touched.company_name && errors.company_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="subdomain"
                label="Choose Your Subdomain"
                placeholder="myhospital"
                value={values.subdomain}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.subdomain && Boolean(errors.subdomain)}
                helperText={
                  touched.subdomain && errors.subdomain
                    ? errors.subdomain
                    : `Your URL will be: ${values.subdomain || 'subdomain'}.hospital-saas.com`
                }
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
                name="first_name"
                label="First Name"
                value={values.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="last_name"
                label="Last Name"
                value={values.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="city"
                label="City"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="state"
                label="State"
                value={values.state}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="postal_code"
                label="Postal Code"
                value={values.postal_code}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 4, marginBottom: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocalHospital sx={{ mr: 1, color: 'primary.main', fontSize: 40 }} />
            <Typography component="h1" variant="h5">
              Create Your Hospital Account
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            Start your 14-day free trial. No credit card required.
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              company_name: '',
              subdomain: '',
              first_name: '',
              last_name: '',
              email: '',
              password: '',
              confirmPassword: '',
              phone: '',
              address: '',
              city: '',
              state: '',
              postal_code: '',
              country: 'US',
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {(formikProps) => (
              <Form>
                {getStepContent(activeStep, formikProps)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(activeStep - 1)}
                  >
                    Back
                  </Button>

                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Create Account'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(activeStep + 1)}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography component="span" color="primary">
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;