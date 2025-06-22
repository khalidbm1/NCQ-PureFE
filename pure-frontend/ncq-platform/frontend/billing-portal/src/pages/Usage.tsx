import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Button,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  TrendingUp,
  Download,
  Warning,
  Notifications,
  Add,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { AppDispatch, RootState } from '../store'
import { fetchCurrentUsage, fetchUsageHistory } from '../store/slices/usageSlice'
import usageService from '../services/usageService'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const granularityOptions = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

interface UsageAlert {
  id: string
  metric: string
  threshold: number
  currentValue: number
  isActive: boolean
  createdAt: string
}

const Usage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentUsage, usageHistory, loading, error } = useSelector(
    (state: RootState) => state.usage
  )

  const [period, setPeriod] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
    granularity: 'daily' as 'hourly' | 'daily' | 'weekly' | 'monthly',
  })
  const [alerts, setAlerts] = useState<UsageAlert[]>([])
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [newAlert, setNewAlert] = useState({ metric: '', threshold: 0 })
  const [alertsLoading, setAlertsLoading] = useState(false)
  const [projection, setProjection] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchCurrentUsage())
    dispatch(fetchUsageHistory(period))
    loadAlerts()
    loadProjection()
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchUsageHistory(period))
  }, [dispatch, period])

  const loadAlerts = async () => {
    try {
      const alertsData = await usageService.getUsageAlerts()
      setAlerts(alertsData)
    } catch (error) {
      console.error('Failed to load usage alerts:', error)
    }
  }

  const loadProjection = async () => {
    try {
      const projectionData = await usageService.getUsageProjection()
      setProjection(projectionData)
    } catch (error) {
      console.error('Failed to load usage projection:', error)
    }
  }

  const handleExport = async () => {
    try {
      await usageService.exportUsageData(period)
    } catch (error) {
      console.error('Failed to export usage data:', error)
    }
  }

  const handleCreateAlert = async () => {
    if (!newAlert.metric || newAlert.threshold <= 0) return
    
    setAlertsLoading(true)
    try {
      await usageService.createUsageAlert(newAlert.metric, newAlert.threshold)
      await loadAlerts()
      setShowAlertDialog(false)
      setNewAlert({ metric: '', threshold: 0 })
    } catch (error) {
      console.error('Failed to create alert:', error)
    } finally {
      setAlertsLoading(false)
    }
  }

  const handleDeleteAlert = async (id: string) => {
    try {
      await usageService.deleteUsageAlert(id)
      await loadAlerts()
    } catch (error) {
      console.error('Failed to delete alert:', error)
    }
  }

  const getUsagePercentage = (metric: string) => {
    if (!currentUsage?.current || !currentUsage?.limits) return 0
    const current = currentUsage.current[metric] || 0
    const limit = currentUsage.limits[metric] || 0
    return limit > 0 ? (current / limit) * 100 : 0
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'error'
    if (percentage >= 75) return 'warning'
    return 'primary'
  }

  const formatUsageValue = (value: number, metric: string) => {
    if (metric.includes('storage') || metric.includes('bandwidth')) {
      return `${(value / 1024 / 1024).toFixed(2)} MB`
    }
    return value.toLocaleString()
  }

  const chartData = usageHistory.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    ...item.metrics,
  }))

  const pieData = currentUsage?.current ? Object.entries(currentUsage.current).map(([key, value], index) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: COLORS[index % COLORS.length],
  })) : []

  if (loading && !currentUsage) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Usage Analytics
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Notifications />}
            onClick={() => setShowAlertDialog(true)}
          >
            Manage Alerts
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Export Data
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Active Alerts */}
      {alerts.filter(alert => alert.isActive).length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Active Usage Alerts
          </Typography>
          {alerts.filter(alert => alert.isActive).map(alert => (
            <Typography key={alert.id} variant="body2">
              {alert.metric}: {alert.currentValue} / {alert.threshold} ({((alert.currentValue / alert.threshold) * 100).toFixed(1)}%)
            </Typography>
          ))}
        </Alert>
      )}

      {/* Current Usage Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {currentUsage?.current && Object.entries(currentUsage.current).map(([metric, value]) => {
          const percentage = getUsagePercentage(metric)
          const limit = currentUsage.limits?.[metric] || 0
          return (
            <Grid item xs={12} sm={6} md={4} key={metric}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {formatUsageValue(value, metric)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    of {formatUsageValue(limit, metric)} ({percentage.toFixed(1)}%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(percentage, 100)}
                    color={getUsageColor(percentage) as any}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Usage Projection */}
      {projection && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Projection
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Projected Cost
                </Typography>
                <Typography variant="h5" color="primary">
                  ${projection.projectedCost.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Confidence
                </Typography>
                <Typography variant="h5">
                  {(projection.confidence * 100).toFixed(0)}%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Based on
                </Typography>
                <Typography variant="h5">
                  {projection.basedOnDays} days
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Time Period Controls */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Historical Usage
          </Typography>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={period.start}
                onChange={(e) => setPeriod(prev => ({ ...prev, start: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={period.end}
                onChange={(e) => setPeriod(prev => ({ ...prev, end: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="Granularity"
                value={period.granularity}
                onChange={(e) => setPeriod(prev => ({ ...prev, granularity: e.target.value as any }))}
              >
                {granularityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Usage Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Typography variant="subtitle1" gutterBottom>
                Usage Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  {currentUsage?.current && Object.keys(currentUsage.current).map((metric, index) => (
                    <Line
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Typography variant="subtitle1" gutterBottom>
                Current Usage Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Usage Alerts Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Usage Alerts
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setShowAlertDialog(true)}
            >
              Add Alert
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell>Threshold</TableCell>
                  <TableCell>Current Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.metric}</TableCell>
                    <TableCell>{alert.threshold.toLocaleString()}</TableCell>
                    <TableCell>{alert.currentValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={alert.isActive ? 'Active' : 'Normal'}
                        color={alert.isActive ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(alert.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {alerts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No usage alerts configured
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Alert Dialog */}
      <Dialog open={showAlertDialog} onClose={() => setShowAlertDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Usage Alert</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Metric"
                value={newAlert.metric}
                onChange={(e) => setNewAlert(prev => ({ ...prev, metric: e.target.value }))}
              >
                {currentUsage?.current && Object.keys(currentUsage.current).map((metric) => (
                  <MenuItem key={metric} value={metric}>
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Threshold"
                type="number"
                value={newAlert.threshold}
                onChange={(e) => setNewAlert(prev => ({ ...prev, threshold: parseInt(e.target.value) || 0 }))}
                helperText="Alert will trigger when usage exceeds this value"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAlertDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateAlert}
            disabled={!newAlert.metric || newAlert.threshold <= 0 || alertsLoading}
          >
            {alertsLoading ? <CircularProgress size={20} /> : 'Create Alert'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Usage