import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
  Button,
} from '@mui/material'
import {
  TrendingUp,
  Receipt,
  CreditCard,
  Warning,
  CheckCircle,
  Error,
} from '@mui/icons-material'
import { AppDispatch, RootState } from '../store'
import { fetchCurrentSubscription } from '../store/slices/subscriptionSlice'
import { fetchCurrentUsage } from '../store/slices/usageSlice'
import { fetchInvoices } from '../store/slices/invoiceSlice'
import { fetchPaymentMethods } from '../store/slices/paymentSlice'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  subtitle?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box color={`${color}.main`} sx={{ fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentSubscription, loading: subscriptionLoading } = useSelector(
    (state: RootState) => state.subscriptions
  )
  const { currentUsage, loading: usageLoading } = useSelector(
    (state: RootState) => state.usage
  )
  const { invoices, loading: invoicesLoading } = useSelector(
    (state: RootState) => state.invoices
  )
  const { paymentMethods, loading: paymentLoading } = useSelector(
    (state: RootState) => state.payments
  )

  useEffect(() => {
    dispatch(fetchCurrentSubscription())
    dispatch(fetchCurrentUsage())
    dispatch(fetchInvoices({}))
    dispatch(fetchPaymentMethods())
  }, [dispatch])

  const isLoading = subscriptionLoading || usageLoading || invoicesLoading || paymentLoading

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending')
  const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue')
  const totalPending = pendingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const defaultPaymentMethod = paymentMethods.find(pm => pm.isDefault)

  const getSubscriptionStatus = () => {
    if (!currentSubscription) return { color: 'error' as const, text: 'No Subscription' }
    switch (currentSubscription.status) {
      case 'active':
        return { color: 'success' as const, text: 'Active' }
      case 'past_due':
        return { color: 'warning' as const, text: 'Past Due' }
      case 'canceled':
        return { color: 'error' as const, text: 'Canceled' }
      default:
        return { color: 'primary' as const, text: currentSubscription.status }
    }
  }

  const getUsagePercentage = () => {
    if (!currentUsage?.limits || !currentUsage?.current) return 0
    const totalUsed = Object.values(currentUsage.current).reduce((sum, val) => sum + val, 0)
    const totalLimit = Object.values(currentUsage.limits).reduce((sum, val) => sum + val, 0)
    return totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0
  }

  const usagePercentage = getUsagePercentage()
  const subscriptionStatus = getSubscriptionStatus()

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {overdueInvoices.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          You have {overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''}. 
          Please update your payment method or pay manually to avoid service interruption.
        </Alert>
      )}

      {!defaultPaymentMethod && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No default payment method set. Add a payment method to ensure uninterrupted service.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Plan"
            value={currentSubscription?.plan?.name || 'No Plan'}
            icon={<Receipt />}
            color="primary"
            subtitle={`$${currentSubscription?.plan?.price || 0}/${currentSubscription?.plan?.billingCycle || 'month'}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usage This Month"
            value={`${Math.round(usagePercentage)}%`}
            icon={<TrendingUp />}
            color={usagePercentage > 80 ? 'warning' : 'success'}
            subtitle="of plan limits"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Amount"
            value={`$${totalPending.toFixed(2)}`}
            icon={<Warning />}
            color={totalPending > 0 ? 'warning' : 'success'}
            subtitle={`${pendingInvoices.length} invoice${pendingInvoices.length !== 1 ? 's' : ''}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Payment Methods"
            value={paymentMethods.length}
            icon={<CreditCard />}
            color="primary"
            subtitle={defaultPaymentMethod ? 'Default set' : 'No default'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subscription Status
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="body1">
                  Status
                </Typography>
                <Chip
                  label={subscriptionStatus.text}
                  color={subscriptionStatus.color}
                  size="small"
                />
              </Box>
              {currentSubscription && (
                <>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="textSecondary">
                      Next billing date
                    </Typography>
                    <Typography variant="body2">
                      {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">
                      Plan
                    </Typography>
                    <Typography variant="body2">
                      {currentSubscription.plan.name}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usage Overview
              </Typography>
              {currentUsage ? (
                <Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      Overall Usage
                    </Typography>
                    <Typography variant="body2">
                      {Math.round(usagePercentage)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(usagePercentage, 100)}
                    color={usagePercentage > 80 ? 'warning' : 'primary'}
                    sx={{ mb: 2 }}
                  />
                  {Object.entries(currentUsage.current || {}).map(([key, value]) => (
                    <Box key={key} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Typography>
                      <Typography variant="body2">
                        {value.toLocaleString()} / {(currentUsage.limits?.[key] || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No usage data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">
                  Recent Invoices
                </Typography>
                <Button variant="outlined" size="small" href="/invoices">
                  View All
                </Button>
              </Box>
              {invoices.slice(0, 5).map((invoice) => (
                <Box key={invoice.id} display="flex" alignItems="center" justifyContent="space-between" py={1}>
                  <Box display="flex" alignItems="center">
                    {invoice.status === 'paid' && <CheckCircle color="success" sx={{ mr: 1 }} />}
                    {invoice.status === 'pending' && <Warning color="warning" sx={{ mr: 1 }} />}
                    {invoice.status === 'overdue' && <Error color="error" sx={{ mr: 1 }} />}
                    <Box>
                      <Typography variant="body2">
                        Invoice #{invoice.invoiceNumber}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="body2">
                      ${invoice.amount.toFixed(2)}
                    </Typography>
                    <Chip
                      label={invoice.status}
                      size="small"
                      color={
                        invoice.status === 'paid' ? 'success' :
                        invoice.status === 'pending' ? 'warning' : 'error'
                      }
                    />
                  </Box>
                </Box>
              ))}
              {invoices.length === 0 && (
                <Typography variant="body2" color="textSecondary" textAlign="center" py={2}>
                  No invoices found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard