import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  CreditCard as CreditCardIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { showNotification } from '../store/slices/notificationSlice';
import { fetchSubscription, fetchUsageStats, cancelSubscription, resumeSubscription } from '../store/slices/tenantSlice';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import paymentService from '../services/payment';
import StripePaymentForm from '../components/StripePaymentForm';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { tenant, subscription, usageStats } = useSelector((state: RootState) => state.tenant);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [addPaymentDialogOpen, setAddPaymentDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    name: user ? `${user.first_name} ${user.last_name}` : '',
    email: user?.email || '',
    phone: '',
  });

  // Organization form
  const [orgData, setOrgData] = useState({
    name: tenant?.name || '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    timezone: 'UTC',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailAppointmentReminders: true,
    smsAppointmentReminders: false,
    emailBilling: true,
    emailReports: false,
    pushNotifications: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        dispatch(fetchSubscription() as any),
        dispatch(fetchUsageStats() as any),
        fetchPaymentMethods(),
      ]);
    } catch (error) {
      console.error('Failed to load settings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get('/payment-methods');
      setPaymentMethods(response.data.paymentMethods);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', profileData);
      dispatch(showNotification({
        message: 'Profile updated successfully',
        severity: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to update profile',
        severity: 'error',
      }));
    }
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/tenant/settings', orgData);
      dispatch(showNotification({
        message: 'Organization settings updated successfully',
        severity: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to update organization settings',
        severity: 'error',
      }));
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/users/notifications', notifications);
      dispatch(showNotification({
        message: 'Notification preferences updated successfully',
        severity: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to update notification preferences',
        severity: 'error',
      }));
    }
  };

  const handleAddPaymentMethod = async (paymentMethodId: string) => {
    try {
      setProcessingPayment(true);
      await api.post('/payment-methods/attach', {
        paymentMethodId,
        setAsDefault: paymentMethods.length === 0,
      });
      dispatch(showNotification({
        message: 'Payment method added successfully',
        severity: 'success',
      }));
      setAddPaymentDialogOpen(false);
      fetchPaymentMethods();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to add payment method',
        severity: 'error',
      }));
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await api.delete(`/payment-methods/${paymentMethodId}`);
      dispatch(showNotification({
        message: 'Payment method deleted successfully',
        severity: 'success',
      }));
      fetchPaymentMethods();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to delete payment method',
        severity: 'error',
      }));
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await api.put('/payment-methods/default', { paymentMethodId });
      dispatch(showNotification({
        message: 'Default payment method updated',
        severity: 'success',
      }));
      fetchPaymentMethods();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to update default payment method',
        severity: 'error',
      }));
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await dispatch(cancelSubscription(false) as any);
      dispatch(showNotification({
        message: 'Subscription will be canceled at the end of the billing period',
        severity: 'info',
      }));
      setCancelDialogOpen(false);
      loadData();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to cancel subscription',
        severity: 'error',
      }));
    }
  };

  const handleResumeSubscription = async () => {
    try {
      await dispatch(resumeSubscription() as any);
      dispatch(showNotification({
        message: 'Subscription resumed successfully',
        severity: 'success',
      }));
      loadData();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to resume subscription',
        severity: 'error',
      }));
    }
  };

  const formatCardNumber = (last4: string, brand: string) => {
    return `${brand} •••• ${last4}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Organization" icon={<BusinessIcon />} iconPosition="start" />
          <Tab label="Billing & Subscription" icon={<CreditCardIcon />} iconPosition="start" />
          <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
          <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Profile Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <form onSubmit={handleProfileSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained">
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Role"
                      secondary={user?.role || 'User'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Account Created"
                      secondary={new Date(Date.now()).toLocaleDateString()}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Organization Tab */}
      <TabPanel value={activeTab} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Organization Settings
            </Typography>
            <form onSubmit={handleOrgSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Organization Name"
                    value={orgData.name}
                    onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={orgData.address}
                    onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={orgData.city}
                    onChange={(e) => setOrgData({ ...orgData, city: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    value={orgData.state}
                    onChange={(e) => setOrgData({ ...orgData, state: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={orgData.country}
                    onChange={(e) => setOrgData({ ...orgData, country: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={orgData.postalCode}
                    onChange={(e) => setOrgData({ ...orgData, postalCode: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained">
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Billing & Subscription Tab */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          {/* Current Subscription */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Current Subscription</Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/subscription')}
                  >
                    Change Plan
                  </Button>
                </Stack>
                
                {subscription && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">Plan</Typography>
                      <Typography variant="h6">{subscription.planName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip
                        label={subscription.status.toUpperCase()}
                        color={subscription.status === 'active' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        {subscription.status === 'trial' ? 'Trial Ends' : 'Renews'}
                      </Typography>
                      <Typography variant="body1">
                        {new Date(subscription.trialEndsAt || subscription.expiresAt || Date.now()).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {subscription?.status === 'active' && !subscription.canceledAt && (
                  <Box mt={2}>
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => setCancelDialogOpen(true)}
                    >
                      Cancel Subscription
                    </Button>
                  </Box>
                )}

                {subscription?.canceledAt && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Your subscription is set to cancel on {new Date(subscription.expiresAt || Date.now()).toLocaleDateString()}.
                    <Button
                      size="small"
                      onClick={handleResumeSubscription}
                      sx={{ ml: 2 }}
                    >
                      Resume Subscription
                    </Button>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Methods */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Payment Methods</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setAddPaymentDialogOpen(true)}
                  >
                    Add Payment Method
                  </Button>
                </Stack>

                {paymentMethods.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No payment methods on file
                  </Typography>
                ) : (
                  <List>
                    {paymentMethods.map((method, index) => (
                      <React.Fragment key={method.id}>
                        {index > 0 && <Divider />}
                        <ListItem>
                          <ListItemText
                            primary={formatCardNumber(method.card.last4, method.card.brand)}
                            secondary={`Expires ${method.card.expMonth}/${method.card.expYear}`}
                          />
                          <ListItemSecondaryAction>
                            {method.isDefault && (
                              <Chip label="Default" size="small" sx={{ mr: 1 }} />
                            )}
                            {!method.isDefault && (
                              <Button
                                size="small"
                                onClick={() => handleSetDefaultPaymentMethod(method.id)}
                              >
                                Set as Default
                              </Button>
                            )}
                            <IconButton
                              edge="end"
                              onClick={() => handleDeletePaymentMethod(method.id)}
                              disabled={method.isDefault}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Usage Statistics */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Usage Statistics
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigate('/subscription')}
                  sx={{ mb: 2 }}
                >
                  View Detailed Usage
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={activeTab} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <form onSubmit={handleNotificationSubmit}>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.emailAppointmentReminders}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        emailAppointmentReminders: e.target.checked
                      })}
                    />
                  }
                  label="Email appointment reminders"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.smsAppointmentReminders}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        smsAppointmentReminders: e.target.checked
                      })}
                    />
                  }
                  label="SMS appointment reminders"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.emailBilling}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        emailBilling: e.target.checked
                      })}
                    />
                  }
                  label="Billing and invoice emails"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.emailReports}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        emailReports: e.target.checked
                      })}
                    />
                  }
                  label="Weekly report emails"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.pushNotifications}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        pushNotifications: e.target.checked
                      })}
                    />
                  }
                  label="Browser push notifications"
                />
                <Box>
                  <Button type="submit" variant="contained">
                    Save Preferences
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Security Tab */}
      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Current Password"
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                  />
                  <Button variant="contained">
                    Update Password
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Two-Factor Authentication
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Add an extra layer of security to your account
                </Typography>
                <Button variant="outlined">
                  Enable 2FA
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active Sessions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your active sessions across devices
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Add Payment Method Dialog */}
      <Dialog open={addPaymentDialogOpen} onClose={() => setAddPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Payment Method</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <StripePaymentForm
              onPaymentMethodCreated={handleAddPaymentMethod}
              loading={processingPayment}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPaymentDialogOpen(false)} disabled={processingPayment}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <WarningIcon color="warning" />
            <Typography>Cancel Subscription</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your subscription? You will continue to have access
            until the end of your current billing period.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Subscription
          </Button>
          <Button onClick={handleCancelSubscription} color="error">
            Yes, Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;