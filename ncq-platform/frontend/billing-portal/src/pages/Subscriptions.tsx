import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material'
import { CheckCircle, Cancel, Upgrade } from '@mui/icons-material'
import { AppDispatch, RootState } from '../store'
import {
  fetchCurrentSubscription,
  fetchPlans,
  updateSubscription,
  cancelSubscription,
  reactivateSubscription,
} from '../store/slices/subscriptionSlice'
import { Plan } from '../types'

const Subscriptions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentSubscription, plans, loading, error } = useSelector(
    (state: RootState) => state.subscriptions
  )

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    dispatch(fetchCurrentSubscription())
    dispatch(fetchPlans())
  }, [dispatch])

  const handleUpgrade = async () => {
    if (!selectedPlan || !currentSubscription) return
    
    try {
      await dispatch(updateSubscription({
        id: currentSubscription.id,
        data: {
          planId: selectedPlan.id,
          billingCycle,
        },
      })).unwrap()
      setShowUpgradeDialog(false)
      setSelectedPlan(null)
    } catch (error) {
      // Error handled by Redux slice
    }
  }

  const handleCancel = async () => {
    if (!currentSubscription) return
    
    try {
      await dispatch(cancelSubscription(currentSubscription.id)).unwrap()
      setShowCancelDialog(false)
    } catch (error) {
      // Error handled by Redux slice
    }
  }

  const handleReactivate = async () => {
    if (!currentSubscription) return
    
    try {
      await dispatch(reactivateSubscription(currentSubscription.id)).unwrap()
    } catch (error) {
      // Error handled by Redux slice
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'past_due':
        return 'warning'
      case 'canceled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getPlanPrice = (plan: Plan, cycle: 'monthly' | 'yearly') => {
    return cycle === 'yearly' ? plan.yearlyPrice || plan.price * 10 : plan.price
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Subscriptions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Current Subscription */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Subscription
          </Typography>
          {currentSubscription ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {currentSubscription.plan.name}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${currentSubscription.plan.price}/{currentSubscription.plan.billingCycle}
                  </Typography>
                  <Chip
                    label={currentSubscription.status}
                    color={getStatusColor(currentSubscription.status) as any}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {currentSubscription.plan.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Next billing date:</strong> {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Started:</strong> {new Date(currentSubscription.startDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Plan Features
                  </Typography>
                  {currentSubscription.plan.features.map((feature, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={1}>
                      <CheckCircle color="success" sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  {currentSubscription.status === 'active' && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => setShowCancelDialog(true)}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                  {currentSubscription.status === 'canceled' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleReactivate}
                    >
                      Reactivate Subscription
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No active subscription found
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Typography variant="h5" gutterBottom>
        Available Plans
      </Typography>
      <Box display="flex" justifyContent="center" mb={3}>
        <Button
          variant={billingCycle === 'monthly' ? 'contained' : 'outlined'}
          onClick={() => setBillingCycle('monthly')}
          sx={{ mr: 1 }}
        >
          Monthly
        </Button>
        <Button
          variant={billingCycle === 'yearly' ? 'contained' : 'outlined'}
          onClick={() => setBillingCycle('yearly')}
        >
          Yearly
        </Button>
      </Box>

      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card
              sx={{
                height: '100%',
                border: currentSubscription?.plan.id === plan.id ? 2 : 1,
                borderColor: currentSubscription?.plan.id === plan.id ? 'primary.main' : 'divider',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  ${getPlanPrice(plan, billingCycle)}
                  <Typography component="span" variant="body1" color="textSecondary">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </Typography>
                </Typography>
                {billingCycle === 'yearly' && plan.yearlyPrice && (
                  <Typography variant="body2" color="success.main" gutterBottom>
                    Save ${(plan.price * 12 - (plan.yearlyPrice || plan.price * 10)).toFixed(0)}/year
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary" paragraph>
                  {plan.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box textAlign="left">
                  {plan.features.map((feature, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={1}>
                      <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box mt={3}>
                  {currentSubscription?.plan.id === plan.id ? (
                    <Chip label="Current Plan" color="primary" />
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Upgrade />}
                      onClick={() => {
                        setSelectedPlan(plan)
                        setShowUpgradeDialog(true)
                      }}
                    >
                      {currentSubscription ? 'Switch Plan' : 'Select Plan'}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onClose={() => setShowUpgradeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentSubscription ? 'Change Subscription Plan' : 'Subscribe to Plan'}
        </DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedPlan.name} - ${getPlanPrice(selectedPlan, billingCycle)}/{billingCycle === 'yearly' ? 'year' : 'month'}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {selectedPlan.description}
              </Typography>
              {currentSubscription && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  You will be charged a prorated amount based on your current billing cycle.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpgradeDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpgrade} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.
          </Alert>
          <Typography variant="body2">
            Your subscription will remain active until {currentSubscription && new Date(currentSubscription.nextBillingDate).toLocaleDateString()}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)}>Keep Subscription</Button>
          <Button variant="contained" color="error" onClick={handleCancel} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Cancel Subscription'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Subscriptions