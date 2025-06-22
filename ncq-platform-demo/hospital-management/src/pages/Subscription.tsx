import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
  CreditCard as CreditCardIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { showNotification } from '../store/slices/notificationSlice';
import api from '../services/api';
import paymentService from '../services/payment';
import StripePaymentForm from '../components/StripePaymentForm';

interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  maxUsers: number;
  maxPatients: number | null;
  maxAppointmentsPerMonth: number | null;
  storageLimitGb: number;
  features: {
    coreFeatures: string[];
    advancedFeatures?: string[];
    integrations?: string[];
    supportLevel: string;
    apiAccess: boolean;
    customBranding: boolean;
    multiLocation: boolean;
    dedicatedSupport?: boolean;
  };
  description: string;
  isPopular: boolean;
  badgeText: string | null;
  trialDays: number;
}

interface CurrentSubscription {
  status: 'trial' | 'active' | 'past_due' | 'canceled' | 'suspended';
  planId: string;
  planName: string;
  expiresAt: string;
  trialEndsAt?: string;
  canceledAt?: string;
  currentUsersCount: number;
  currentPatientsCount: number;
  currentMonthAppointments: number;
  currentStorageUsedGb: number;
}

const featureLabels: Record<string, string> = {
  patient_management: 'Patient Management',
  appointment_scheduling: 'Appointment Scheduling',
  basic_reporting: 'Basic Reporting',
  advanced_reporting: 'Advanced Reporting',
  prescription_management: 'Prescription Management',
  lab_management: 'Lab Management',
  inventory_management: 'Inventory Management',
  insurance_claims: 'Insurance Claims Processing',
  financial_analytics: 'Financial Analytics',
  staff_scheduling: 'Staff Scheduling',
  commission_management: 'Commission Management',
  multi_specialty: 'Multi-Specialty Support',
  dental_module: 'Dental Module',
  dermatology_module: 'Dermatology Module',
  email: 'Email Support',
  priority_email: 'Priority Email Support',
  phone_and_email: 'Phone & Email Support',
  stripe: 'Stripe Payment Integration',
  twilio: 'SMS Notifications',
  all: 'All Integrations',
};

const Subscription: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchPlansAndSubscription();
  }, []);

  const fetchPlansAndSubscription = async () => {
    try {
      setLoading(true);
      
      // Fetch plans and current subscription
      const [plansResponse, subscriptionResponse] = await Promise.all([
        api.get('/subscriptions/plans'),
        api.get('/subscriptions/current')
      ]);
      
      setPlans(plansResponse.data.plans);
      setCurrentSubscription(subscriptionResponse.data.subscription);
    } catch (error) {
      // For development, use mock data if API fails
      const mockPlans: SubscriptionPlan[] = [
        {
          id: '1',
          name: 'Basic',
          code: 'basic',
          monthlyPrice: 99,
          annualPrice: 990,
          currency: 'USD',
          maxUsers: 5,
          maxPatients: 1000,
          maxAppointmentsPerMonth: 500,
          storageLimitGb: 10,
          features: {
            coreFeatures: [
              'patient_management',
              'appointment_scheduling',
              'basic_reporting',
              'prescription_management',
            ],
            supportLevel: 'email',
            apiAccess: false,
            customBranding: false,
            multiLocation: false,
          },
          description: 'Perfect for small clinics and solo practitioners',
          isPopular: false,
          badgeText: null,
          trialDays: 14,
        },
        {
          id: '2',
          name: 'Professional',
          code: 'professional',
          monthlyPrice: 299,
          annualPrice: 2990,
          currency: 'USD',
          maxUsers: 20,
          maxPatients: 5000,
          maxAppointmentsPerMonth: 2000,
          storageLimitGb: 50,
          features: {
            coreFeatures: [
              'patient_management',
              'appointment_scheduling',
              'advanced_reporting',
              'prescription_management',
              'lab_management',
              'inventory_management',
            ],
            advancedFeatures: [
              'insurance_claims',
              'financial_analytics',
              'staff_scheduling',
            ],
            integrations: ['stripe', 'twilio', 'email'],
            supportLevel: 'priority_email',
            apiAccess: true,
            customBranding: true,
            multiLocation: false,
          },
          description: 'Ideal for growing medical practices',
          isPopular: true,
          badgeText: 'Most Popular',
          trialDays: 14,
        },
        {
          id: '3',
          name: 'Enterprise',
          code: 'enterprise',
          monthlyPrice: 599,
          annualPrice: 5990,
          currency: 'USD',
          maxUsers: 100,
          maxPatients: null,
          maxAppointmentsPerMonth: null,
          storageLimitGb: 200,
          features: {
            coreFeatures: [
              'patient_management',
              'appointment_scheduling',
              'advanced_reporting',
              'prescription_management',
              'lab_management',
              'inventory_management',
              'dental_module',
              'dermatology_module',
            ],
            advancedFeatures: [
              'insurance_claims',
              'financial_analytics',
              'staff_scheduling',
              'commission_management',
              'multi_specialty',
            ],
            integrations: ['all'],
            supportLevel: 'phone_and_email',
            apiAccess: true,
            customBranding: true,
            multiLocation: true,
            dedicatedSupport: true,
          },
          description: 'Complete solution for hospitals and large clinics',
          isPopular: false,
          badgeText: 'Best Value',
          trialDays: 14,
        },
      ];

      const mockCurrentSubscription: CurrentSubscription = {
        status: 'trial',
        planId: '1',
        planName: 'Basic',
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        currentUsersCount: 2,
        currentPatientsCount: 45,
        currentMonthAppointments: 120,
        currentStorageUsedGb: 2.5,
      };

      setPlans(mockPlans);
      setCurrentSubscription(mockCurrentSubscription);
      
      dispatch(showNotification({
        message: 'Failed to load subscription information',
        severity: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (currentSubscription && plan.id === currentSubscription.planId) {
      dispatch(showNotification({
        message: 'You are already on this plan',
        severity: 'info',
      }));
      return;
    }
    setSelectedPlan(plan);
    setPaymentDialogOpen(true);
  };

  const handleSubscribe = async (paymentMethodId?: string) => {
    if (!selectedPlan) return;

    try {
      setProcessingPayment(true);
      
      // If we have a payment method, create the subscription
      if (paymentMethodId) {
        await paymentService.createSubscription(
          selectedPlan.id,
          paymentMethodId,
          billingPeriod
        );
      } else {
        // Mock subscription for trial without payment
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      dispatch(showNotification({
        message: `Successfully subscribed to ${selectedPlan.name} plan`,
        severity: 'success',
      }));
      
      setPaymentDialogOpen(false);
      fetchPlansAndSubscription();
    } catch (error: any) {
      dispatch(showNotification({
        message: error.response?.data?.message || 'Failed to process subscription',
        severity: 'error',
      }));
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatLimit = (limit: number | null) => {
    return limit === null ? 'Unlimited' : limit.toLocaleString();
  };

  const calculateSavings = (monthlyPrice: number, annualPrice: number) => {
    const yearlyFromMonthly = monthlyPrice * 12;
    const savings = yearlyFromMonthly - annualPrice;
    const percentage = Math.round((savings / yearlyFromMonthly) * 100);
    return { amount: savings, percentage };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trial': return 'info';
      case 'active': return 'success';
      case 'past_due': return 'warning';
      case 'canceled': return 'error';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const daysUntilExpiry = () => {
    if (!currentSubscription) return 0;
    const expiryDate = new Date(currentSubscription.trialEndsAt || currentSubscription.expiresAt);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
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
        Subscription & Billing
      </Typography>

      {/* Current Subscription Status */}
      {currentSubscription && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Current Subscription</Typography>
            <Chip 
              label={currentSubscription.status.toUpperCase()} 
              color={getStatusColor(currentSubscription.status)}
              size="small"
            />
          </Stack>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Plan</Typography>
              <Typography variant="h6">{currentSubscription.planName}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                {currentSubscription.status === 'trial' ? 'Trial Ends' : 'Expires'}
              </Typography>
              <Typography variant="h6">
                {daysUntilExpiry()} days
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Usage
              </Typography>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Users</Typography>
                  <Typography variant="body2">
                    {currentSubscription.currentUsersCount} / {plans.find(p => p.id === currentSubscription.planId)?.maxUsers || 0}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Patients</Typography>
                  <Typography variant="body2">
                    {currentSubscription.currentPatientsCount} / {formatLimit(plans.find(p => p.id === currentSubscription.planId)?.maxPatients || 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Storage</Typography>
                  <Typography variant="body2">
                    {currentSubscription.currentStorageUsedGb}GB / {plans.find(p => p.id === currentSubscription.planId)?.storageLimitGb || 0}GB
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {currentSubscription.status === 'trial' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>Free Trial Active</AlertTitle>
              Your free trial ends in {daysUntilExpiry()} days. Subscribe to a plan to continue using all features.
            </Alert>
          )}
        </Paper>
      )}

      {/* Billing Period Toggle */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>Monthly</Typography>
          <Button
            variant={billingPeriod === 'monthly' ? 'contained' : 'outlined'}
            onClick={() => setBillingPeriod('monthly')}
            size="small"
          >
            Monthly
          </Button>
          <Button
            variant={billingPeriod === 'annual' ? 'contained' : 'outlined'}
            onClick={() => setBillingPeriod('annual')}
            size="small"
            color="success"
          >
            Annual
            <Chip 
              label="Save up to 17%" 
              size="small" 
              color="success" 
              sx={{ ml: 1 }}
            />
          </Button>
        </Stack>
      </Box>

      {/* Subscription Plans */}
      <Grid container spacing={3}>
        {plans.map((plan) => {
          const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice / 12;
          const savings = calculateSavings(plan.monthlyPrice, plan.annualPrice);
          const isCurrentPlan = currentSubscription?.planId === plan.id;

          return (
            <Grid item xs={12} md={4} key={plan.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  border: plan.isPopular ? '2px solid' : '1px solid',
                  borderColor: plan.isPopular ? 'primary.main' : 'divider',
                }}
              >
                {plan.badgeText && (
                  <Chip
                    label={plan.badgeText}
                    color={plan.isPopular ? 'primary' : 'secondary'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                    }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {plan.description}
                  </Typography>

                  <Box my={3}>
                    <Typography variant="h3" component="span">
                      {formatPrice(price)}
                    </Typography>
                    <Typography variant="body2" component="span" color="text.secondary">
                      /month
                    </Typography>
                    {billingPeriod === 'annual' && (
                      <Typography variant="body2" color="success.main">
                        Save {formatPrice(savings.amount)} ({savings.percentage}%)
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Limits */}
                  <Stack spacing={1} mb={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Users</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {plan.maxUsers}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Patients</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatLimit(plan.maxPatients)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Appointments/Month</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatLimit(plan.maxAppointmentsPerMonth)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Storage</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {plan.storageLimitGb}GB
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Features */}
                  <Typography variant="subtitle2" gutterBottom>
                    Core Features
                  </Typography>
                  <List dense>
                    {plan.features.coreFeatures.map((feature) => (
                      <ListItem key={feature} disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={featureLabels[feature] || feature}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {plan.features.advancedFeatures && (
                    <>
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                        Advanced Features
                      </Typography>
                      <List dense>
                        {plan.features.advancedFeatures.map((feature) => (
                          <ListItem key={feature} disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={featureLabels[feature] || feature}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}

                  {/* Additional Features */}
                  <Stack spacing={1} mt={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {plan.features.apiAccess ? (
                        <CheckIcon fontSize="small" color="success" />
                      ) : (
                        <CloseIcon fontSize="small" color="disabled" />
                      )}
                      <Typography variant="body2">API Access</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      {plan.features.customBranding ? (
                        <CheckIcon fontSize="small" color="success" />
                      ) : (
                        <CloseIcon fontSize="small" color="disabled" />
                      )}
                      <Typography variant="body2">Custom Branding</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      {plan.features.multiLocation ? (
                        <CheckIcon fontSize="small" color="success" />
                      ) : (
                        <CloseIcon fontSize="small" color="disabled" />
                      )}
                      <Typography variant="body2">Multi-Location Support</Typography>
                    </Box>
                  </Stack>

                  {/* Support Level */}
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Support: {featureLabels[plan.features.supportLevel] || plan.features.supportLevel}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant={isCurrentPlan ? 'outlined' : 'contained'}
                    color={plan.isPopular ? 'primary' : 'inherit'}
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Subscribe to {selectedPlan?.name} Plan
        </DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Alert severity="info">
                <AlertTitle>14-Day Free Trial</AlertTitle>
                Start with a free trial. Your card won't be charged until the trial ends.
              </Alert>

              <Box>
                <Typography variant="h6" gutterBottom>
                  {formatPrice(billingPeriod === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.annualPrice / 12)}
                  <Typography variant="body2" component="span" color="text.secondary">
                    /month {billingPeriod === 'annual' && '(billed annually)'}
                  </Typography>
                </Typography>
                {billingPeriod === 'annual' && (
                  <Typography variant="body2" color="text.secondary">
                    Total: {formatPrice(selectedPlan.annualPrice)} per year
                  </Typography>
                )}
              </Box>

              <StripePaymentForm
                onPaymentMethodCreated={(paymentMethodId) => handleSubscribe(paymentMethodId)}
                loading={processingPayment}
              />

              <Typography variant="caption" color="text.secondary">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
                You can cancel anytime.
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)} disabled={processingPayment}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleSubscribe()} 
            variant="outlined"
            disabled={processingPayment}
          >
            Start Trial Without Card
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subscription;