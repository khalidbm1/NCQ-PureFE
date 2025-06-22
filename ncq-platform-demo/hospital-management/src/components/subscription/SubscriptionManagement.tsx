import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Snackbar
} from '@mui/material';
import {
  CancelOutlined,
  CheckCircle,
  Warning,
  Info,
  Upgrade,
  TrendingDown,
  RestartAlt,
  Receipt,
  Download,
  CreditCard,
  AccountBalance
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../services/api';

interface SubscriptionInfo {
  tenant: {
    name: string;
    subdomain: string;
    subscription_status: string;
    subscription_expires_at?: string;
    grace_period_ends_at?: string;
    is_subscription_active: boolean;
    is_in_grace_period: boolean;
  };
  current_plan?: {
    id: string;
    name: string;
    code: string;
    monthly_price: number;
    annual_price?: number;
    features: string[];
  };
  usage: {
    users: number;
    patients: number;
    appointments_this_month: number;
    storage_used_gb: number;
  };
  limits: {
    max_users?: number;
    max_patients?: number;
    max_appointments_per_month?: number;
    storage_limit_gb: number;
  };
  billing: {
    next_billing_date?: string;
    billing_period?: string;
    cancel_at_period_end: boolean;
    stripe_subscription_id?: string;
  };
}

interface Plan {
  id: string;
  name: string;
  code: string;
  monthly_price: number;
  annual_price?: number;
  features: string[];
  max_users?: number;
  max_patients?: number;
  max_appointments_per_month?: number;
  storage_limit_gb: number;
  is_popular?: boolean;
  annual_discount?: number;
}

const SubscriptionManagement: React.FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Dialog states
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(true);
  
  // Feedback states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  useEffect(() => {
    loadSubscriptionData();
    loadAvailablePlans();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      const response = await api.get('/subscriptions/current');
      setSubscription(response.data);
    } catch (error) {
      console.error('Error loading subscription data:', error);
      showSnackbar('Failed to load subscription information', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailablePlans = async () => {
    try {
      const response = await api.get('/subscriptions/plans');
      setAvailablePlans(response.data.plans);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCancelSubscription = async () => {
    setActionLoading(true);
    try {
      await api.post('/subscriptions/cancel', {
        at_period_end: cancelAtPeriodEnd
      });
      
      const message = cancelAtPeriodEnd 
        ? 'Subscription will be canceled at the end of the billing period'
        : 'Subscription has been canceled immediately';
      
      showSnackbar(message, 'success');
      setCancelDialogOpen(false);
      await loadSubscriptionData(); // Refresh data
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to cancel subscription';
      showSnackbar(errorMessage, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setActionLoading(true);
    try {
      await api.post('/subscriptions/reactivate');
      showSnackbar('Subscription has been reactivated successfully', 'success');
      await loadSubscriptionData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to reactivate subscription';
      showSnackbar(errorMessage, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePlan = async (plan: Plan, billingPeriod: 'monthly' | 'annual') => {
    setActionLoading(true);
    try {
      await api.post('/subscriptions/change-plan', {
        plan_id: plan.id,
        billing_period: billingPeriod
      });
      
      showSnackbar(`Successfully changed to ${plan.name} plan`, 'success');
      setUpgradeDialogOpen(false);
      setSelectedPlan(null);
      await loadSubscriptionData();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to change subscription plan';
      showSnackbar(errorMessage, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', color: 'success' as const, icon: <CheckCircle /> },
      trial: { label: 'Trial', color: 'info' as const, icon: <Info /> },
      past_due: { label: 'Past Due', color: 'warning' as const, icon: <Warning /> },
      canceled: { label: 'Canceled', color: 'error' as const, icon: <CancelOutlined /> },
      suspended: { label: 'Suspended', color: 'error' as const, icon: <CancelOutlined /> }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.canceled;
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="filled"
        icon={config.icon}
        size="small"
      />
    );
  };

  const getUsagePercentage = (used: number, limit?: number) => {
    if (!limit || limit >= 999999) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading subscription information...</Typography>
      </Box>
    );
  }

  if (!subscription) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load subscription information. Please refresh the page.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Subscription Management
      </Typography>

      {/* Current Subscription Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Current Subscription
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h5">
                  {subscription.current_plan?.name || 'No Plan'}
                </Typography>
                {getStatusChip(subscription.tenant.subscription_status)}
              </Box>

              {subscription.current_plan && (
                <>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {formatCurrency(subscription.current_plan.monthly_price)}/month
                  </Typography>
                  
                  {subscription.billing.next_billing_date && (
                    <Typography variant="body2" color="text.secondary">
                      Next billing: {format(new Date(subscription.billing.next_billing_date), 'PPP')}
                    </Typography>
                  )}

                  {subscription.billing.cancel_at_period_end && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Your subscription will be canceled at the end of the current billing period.
                    </Alert>
                  )}
                </>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {subscription.tenant.subscription_status === 'active' && !subscription.billing.cancel_at_period_end && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Upgrade />}
                      onClick={() => setUpgradeDialogOpen(true)}
                      fullWidth
                    >
                      Change Plan
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelOutlined />}
                      onClick={() => setCancelDialogOpen(true)}
                      fullWidth
                    >
                      Cancel Subscription
                    </Button>
                  </>
                )}

                {subscription.billing.cancel_at_period_end && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RestartAlt />}
                    onClick={handleReactivateSubscription}
                    disabled={actionLoading}
                    fullWidth
                  >
                    Reactivate Subscription
                  </Button>
                )}

                <Button
                  variant="outlined"
                  startIcon={<Receipt />}
                  fullWidth
                >
                  View Billing History
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Usage Overview
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">Users</Typography>
                <Typography variant="h6">
                  {subscription.usage.users}
                  {subscription.limits.max_users && subscription.limits.max_users < 999999 && 
                    ` / ${subscription.limits.max_users}`
                  }
                </Typography>
                {subscription.limits.max_users && subscription.limits.max_users < 999999 && (
                  <LinearProgress
                    variant="determinate"
                    value={getUsagePercentage(subscription.usage.users, subscription.limits.max_users)}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">Patients</Typography>
                <Typography variant="h6">
                  {subscription.usage.patients.toLocaleString()}
                  {subscription.limits.max_patients && subscription.limits.max_patients < 999999 && 
                    ` / ${subscription.limits.max_patients.toLocaleString()}`
                  }
                </Typography>
                {subscription.limits.max_patients && subscription.limits.max_patients < 999999 && (
                  <LinearProgress
                    variant="determinate"
                    value={getUsagePercentage(subscription.usage.patients, subscription.limits.max_patients)}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">Appointments This Month</Typography>
                <Typography variant="h6">
                  {subscription.usage.appointments_this_month}
                  {subscription.limits.max_appointments_per_month && subscription.limits.max_appointments_per_month < 999999 && 
                    ` / ${subscription.limits.max_appointments_per_month}`
                  }
                </Typography>
                {subscription.limits.max_appointments_per_month && subscription.limits.max_appointments_per_month < 999999 && (
                  <LinearProgress
                    variant="determinate"
                    value={getUsagePercentage(subscription.usage.appointments_this_month, subscription.limits.max_appointments_per_month)}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">Storage Used</Typography>
                <Typography variant="h6">
                  {subscription.usage.storage_used_gb.toFixed(1)} GB / {subscription.limits.storage_limit_gb} GB
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={getUsagePercentage(subscription.usage.storage_used_gb, subscription.limits.storage_limit_gb)}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Plan Features */}
      {subscription.current_plan && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Plan Features
            </Typography>
            <Grid container spacing={1}>
              {subscription.current_plan.features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Cancel Subscription Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" />
            Cancel Subscription
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to cancel your subscription? This action cannot be undone.
          </Typography>
          
          <Alert severity="info" sx={{ my: 2 }}>
            <Typography variant="body2">
              If you cancel at the end of the billing period, you'll continue to have access 
              to all features until {subscription.billing.next_billing_date ? 
                format(new Date(subscription.billing.next_billing_date), 'PPP') : 'the end of your current period'}.
            </Typography>
          </Alert>

          <FormControlLabel
            control={
              <Switch
                checked={cancelAtPeriodEnd}
                onChange={(e) => setCancelAtPeriodEnd(e.target.checked)}
              />
            }
            label="Cancel at the end of the billing period (recommended)"
          />

          {!cancelAtPeriodEnd && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Canceling immediately will end your access right away. You will not receive a refund 
                for the remaining time in your billing period.
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Subscription
          </Button>
          <Button
            onClick={handleCancelSubscription}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? 'Canceling...' : 'Cancel Subscription'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Plan Dialog */}
      <Dialog
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Change Subscription Plan</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {availablePlans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: plan.id === subscription.current_plan?.id ? '2px solid' : '1px solid',
                    borderColor: plan.id === subscription.current_plan?.id ? 'primary.main' : 'divider',
                    position: 'relative'
                  }}
                >
                  {plan.is_popular && (
                    <Chip
                      label="Popular"
                      color="primary"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  )}
                  
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {plan.name}
                    </Typography>
                    
                    <Typography variant="h4" color="primary" gutterBottom>
                      {formatCurrency(plan.monthly_price)}
                      <Typography component="span" variant="body2" color="text.secondary">
                        /month
                      </Typography>
                    </Typography>

                    {plan.annual_price && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        or {formatCurrency(plan.annual_price)}/year 
                        {plan.annual_discount && (
                          <Chip 
                            label={`Save ${plan.annual_discount}%`} 
                            size="small" 
                            color="success" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box>
                      <Typography variant="body2" gutterBottom>
                        <strong>Users:</strong> {plan.max_users && plan.max_users < 999999 ? plan.max_users : 'Unlimited'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Patients:</strong> {plan.max_patients && plan.max_patients < 999999 ? plan.max_patients.toLocaleString() : 'Unlimited'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Storage:</strong> {plan.storage_limit_gb} GB
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      {plan.id === subscription.current_plan?.id ? (
                        <Button fullWidth disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleChangePlan(plan, 'monthly')}
                            disabled={actionLoading}
                          >
                            Switch to Monthly
                          </Button>
                          {plan.annual_price && (
                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={() => handleChangePlan(plan, 'annual')}
                              disabled={actionLoading}
                            >
                              Switch to Annual
                            </Button>
                          )}
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubscriptionManagement;