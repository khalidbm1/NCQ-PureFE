'use client'

import { useState } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Skeleton,
  Alert,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  AttachMoney,
  ShoppingCart,
  Assessment,
  Warning,
  CheckCircle,
  Cancel,
  Refresh,
  Download,
  CalendarToday,
  ArrowForward,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { merchantService } from '@/services/merchant.service'
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters'
import { PaymentOverview } from './PaymentOverview'
import { RevenueAnalytics } from './RevenueAnalytics'
import { TransactionList } from './TransactionList'
import { QuickActions } from './QuickActions'
import { PaymentMethods } from './PaymentMethods'
import { SettlementInfo } from './SettlementInfo'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color: string
  loading?: boolean
  action?: () => void
  actionLabel?: string
}

const MetricCard = ({ title, value, change, icon, color, loading, action, actionLabel }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={120} height={40} />
            ) : (
              <>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {value}
                </Typography>
                {change !== undefined && (
                  <Box display="flex" alignItems="center" mt={1}>
                    {change >= 0 ? (
                      <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />
                    )}
                    <Typography
                      variant="body2"
                      color={change >= 0 ? 'success.main' : 'error.main'}
                      sx={{ ml: 0.5 }}
                    >
                      {formatPercentage(Math.abs(change))}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      vs last month
                    </Typography>
                  </Box>
                )}
                {action && (
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    onClick={action}
                    sx={{ mt: 1 }}
                  >
                    {actionLabel}
                  </Button>
                )}
              </>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
)

export function MerchantDashboard() {
  const [dateRange, setDateRange] = useState('today')
  
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['merchant-metrics', dateRange],
    queryFn: () => merchantService.getDashboardMetrics(dateRange),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['merchant-alerts'],
    queryFn: () => merchantService.getAlerts(),
    refetchInterval: 60000, // Refresh every minute
  })

  const { data: accountStatus } = useQuery({
    queryKey: ['account-status'],
    queryFn: () => merchantService.getAccountStatus(),
  })

  const handleExportReport = () => {
    merchantService.exportReport(dateRange)
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's your payment activity overview
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            startIcon={<CalendarToday />}
            variant="outlined"
            size="small"
          >
            {dateRange === 'today' ? 'Today' : dateRange}
          </Button>
          <Tooltip title="Refresh data">
            <IconButton onClick={() => refetchMetrics()} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            startIcon={<Download />}
            variant="contained"
            size="small"
            onClick={handleExportReport}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Account Status Alert */}
      {accountStatus && accountStatus.requiresAttention && (
        <Alert 
          severity="warning" 
          action={
            <Button color="inherit" size="small">
              View Details
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {accountStatus.message}
        </Alert>
      )}

      {/* Alerts */}
      {!alertsLoading && alerts && alerts.length > 0 && (
        <Box mb={3}>
          {alerts.map((alert: any) => (
            <Alert
              key={alert.id}
              severity={alert.severity}
              action={
                <Button color="inherit" size="small">
                  Dismiss
                </Button>
              }
              sx={{ mb: 1 }}
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Quick Actions */}
      <Box mb={3}>
        <QuickActions />
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics?.totalRevenue || 0)}
            change={metrics?.revenueChange}
            icon={<AttachMoney sx={{ color: 'primary.main' }} />}
            color="primary"
            loading={metricsLoading}
            action={() => {}}
            actionLabel="View details"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Successful Transactions"
            value={formatNumber(metrics?.successfulTransactions || 0)}
            change={metrics?.transactionsChange}
            icon={<CheckCircle sx={{ color: 'success.main' }} />}
            color="success"
            loading={metricsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Average Order Value"
            value={formatCurrency(metrics?.averageOrderValue || 0)}
            change={metrics?.aovChange}
            icon={<ShoppingCart sx={{ color: 'secondary.main' }} />}
            color="secondary"
            loading={metricsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Success Rate"
            value={formatPercentage(metrics?.successRate || 0)}
            change={metrics?.successRateChange}
            icon={<Assessment sx={{ color: 'info.main' }} />}
            color="info"
            loading={metricsLoading}
          />
        </Grid>
      </Grid>

      {/* Payment Overview and Settlement Info */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <PaymentOverview dateRange={dateRange} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SettlementInfo />
        </Grid>
      </Grid>

      {/* Revenue Analytics */}
      <Box mb={3}>
        <RevenueAnalytics dateRange={dateRange} />
      </Box>

      {/* Payment Methods Performance */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <PaymentMethods />
        </Grid>
        <Grid item xs={12} md={8}>
          <TransactionList />
        </Grid>
      </Grid>

      {/* Integration Status */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Integration Status</Typography>
            <Chip 
              label={metrics?.integrationStatus || 'Active'} 
              color="success" 
              size="small" 
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  API Health
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body1">All systems operational</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Webhook Status
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body1">
                    {metrics?.webhookDeliveryRate || '99.9'}% delivery rate
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  API Response Time
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <Typography variant="body1">{metrics?.apiResponseTime || '45'}ms avg</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={85} 
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Uptime (30 days)
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <Typography variant="body1">{metrics?.uptime || '99.99'}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={99.99} 
                  sx={{ mt: 0.5 }}
                  color="success"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}