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
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LocalHospital,
  Email,
  Lock,
  Domain,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { login, clearError } from '../store/slices/authSlice';

const loginSchema = Yup.object({
  subdomain: Yup.string()
    .required('Hospital subdomain is required')
    .matches(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Invalid subdomain format'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (values: any) => {
    // Demo mode - bypass authentication
    if (process.env.NODE_ENV === 'development' || values.email === 'admin@demo.com') {
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'Demo Admin',
        email: 'admin@demo.com',
        role: 'admin',
        hospitalId: 'demo-hospital'
      }));
      navigate('/dashboard');
      return;
    }
    
    try {
      await dispatch(login(values)).unwrap();
      navigate('/');
    } catch (err) {
      // Error handled by Redux
    }
  };

  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocalHospital sx={{ mr: 1, color: 'primary.main', fontSize: 40 }} />
            <Typography component="h1" variant="h5">
              Hospital Management
            </Typography>
          </Box>

          <Typography component="h2" variant="h6" gutterBottom>
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              subdomain: 'demo',
              email: 'admin@demo.com',
              password: 'demo123',
            }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <TextField
                  fullWidth
                  margin="normal"
                  name="subdomain"
                  label="Hospital Subdomain"
                  placeholder="myhospital"
                  value={values.subdomain}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.subdomain && Boolean(errors.subdomain)}
                  helperText={
                    touched.subdomain && errors.subdomain
                      ? errors.subdomain
                      : 'Your hospital\'s unique identifier'
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Domain />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        .hospital-saas.com
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  name="email"
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>

                <Grid container>
                  <Grid item xs>
                    <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" color="primary">
                        Forgot password?
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" color="primary">
                        Don't have an account? Sign Up
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Demo Mode:</strong> Click "Sign In" to access the dashboard
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Subdomain: demo | Email: admin@demo.com | Password: demo123
              </Typography>
            </Alert>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;