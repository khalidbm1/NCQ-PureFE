'use client'

import { useState, useEffect } from 'react'
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
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  People,
  ShoppingCart,
  AttachMoney,
  Warning,
  CheckCircle,
  Cancel,
  Refresh,
  Download,
  CalendarToday,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { dashboardService } from '@/services/dashboard.service'
import { TransactionChart } from './TransactionChart'
import { RevenueChart } from './RevenueChart'
import { ProcessorStatus } from './ProcessorStatus'
import { RecentTransactions } from './RecentTransactions'
import { ComplianceStatus } from './ComplianceStatus'
import { SystemHealth } from './SystemHealth'
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color: string
  loading?: boolean
}

const MetricCard = ({ title, value, change, icon, color, loading }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
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
                  </Box>
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

export function Dashboard() {
  const [dateRange, setDateRange] = useState('today')
  
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['dashboard-metrics', dateRange],
    queryFn: () => dashboardService.getMetrics(dateRange),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: () => dashboardService.getAlerts(),
    refetchInterval: 60000, // Refresh every minute
  })

  const handleExportReport = () => {
    dashboardService.exportReport(dateRange)
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
            Real-time payment gateway monitoring and analytics
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

      {/* Alerts */}
      {!alertsLoading && alerts && alerts.length > 0 && (
        <Box mb={3}>
          {alerts.map((alert: any) => (
            <Alert
              key={alert.id}
              severity={alert.severity}
              action={
                <Button color="inherit" size="small">
                  View Details
                </Button>
              }
              sx={{ mb: 1 }}
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

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
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Transactions"
            value={formatNumber(metrics?.totalTransactions || 0)}
            change={metrics?.transactionsChange}
            icon={<CreditCard sx={{ color: 'secondary.main' }} />}
            color="secondary"
            loading={metricsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Merchants"
            value={formatNumber(metrics?.activeMerchants || 0)}
            change={metrics?.merchantsChange}
            icon={<People sx={{ color: 'success.main' }} />}
            color="success"
            loading={metricsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Success Rate"
            value={formatPercentage(metrics?.successRate || 0)}
            change={metrics?.successRateChange}
            icon={<CheckCircle sx={{ color: 'info.main' }} />}
            color="info"
            loading={metricsLoading}
          />
        </Grid>
      </Grid>

      {/* Transaction Status Breakdown */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Transaction Status</Typography>
                <Typography variant="caption" color="text.secondary">
                  Last 24 hours
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Successful
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(metrics?.successfulTransactions || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Cancel sx={{ color: 'error.main', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Failed
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(metrics?.failedTransactions || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Warning sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Pending
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(metrics?.pendingTransactions || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ShoppingCart sx={{ color: 'info.main', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Refunded
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(metrics?.refundedTransactions || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Compliance Status */}
        <Grid item xs={12} md={4}>
          <ComplianceStatus />
        </Grid>
        
        {/* System Health */}
        <Grid item xs={12} md={4}>
          <SystemHealth />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} lg={8}>
          <TransactionChart dateRange={dateRange} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <RevenueChart dateRange={dateRange} />
        </Grid>
      </Grid>

      {/* Processor Status and Recent Transactions */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <ProcessorStatus />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RecentTransactions />
        </Grid>
      </Grid>
    </Box>
  )
}