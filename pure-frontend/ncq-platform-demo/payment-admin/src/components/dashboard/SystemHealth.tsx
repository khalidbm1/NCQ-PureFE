'use client'

import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Tooltip,
  Chip,
  Alert,
} from '@mui/material'
import {
  Memory,
  Storage,
  Speed,
  NetworkCheck,
  Security,
  Cloud,
  Warning,
  CheckCircle,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'
import { formatPercentage, formatBytes } from '@/utils/formatters'

interface HealthMetric {
  name: string
  value: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
  threshold: number
}

interface SystemComponent {
  name: string
  status: 'operational' | 'degraded' | 'down'
  uptime: number
  lastChecked: string
}

const getMetricColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'success'
    case 'warning':
      return 'warning'
    case 'critical':
      return 'error'
    default:
      return 'info'
  }
}

const getMetricIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'cpu usage':
      return <Speed />
    case 'memory usage':
      return <Memory />
    case 'disk usage':
      return <Storage />
    case 'network latency':
      return <NetworkCheck />
    case 'ssl certificate':
      return <Security />
    case 'api availability':
      return <Cloud />
    default:
      return <CheckCircle />
  }
}

export function SystemHealth() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => dashboardService.getSystemHealth(),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const criticalIssues = health?.metrics?.filter((m: HealthMetric) => m.status === 'critical') || []
  const warningIssues = health?.metrics?.filter((m: HealthMetric) => m.status === 'warning') || []

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">System Health</Typography>
          <Chip
            size="small"
            label={health?.overallStatus || 'Checking...'}
            color={
              health?.overallStatus === 'operational'
                ? 'success'
                : health?.overallStatus === 'degraded'
                ? 'warning'
                : 'error'
            }
          />
        </Box>

        {/* Critical Alerts */}
        {criticalIssues.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Critical Issues Detected
            </Typography>
            {criticalIssues.map((issue: HealthMetric) => (
              <Typography key={issue.name} variant="caption" display="block">
                • {issue.name}: {issue.value}{issue.unit}
              </Typography>
            ))}
          </Alert>
        )}

        {/* Warning Alerts */}
        {warningIssues.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Warnings
            </Typography>
            {warningIssues.map((issue: HealthMetric) => (
              <Typography key={issue.name} variant="caption" display="block">
                • {issue.name}: {issue.value}{issue.unit}
              </Typography>
            ))}
          </Alert>
        )}

        {/* Metrics Grid */}
        <Grid container spacing={2}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={6} key={index}>
                <LinearProgress />
              </Grid>
            ))
          ) : (
            health?.metrics?.slice(0, 4).map((metric: HealthMetric) => (
              <Grid item xs={6} key={metric.name}>
                <Box
                  p={1.5}
                  bgcolor="action.hover"
                  borderRadius={1}
                  sx={{
                    borderLeft: 3,
                    borderColor: `${getMetricColor(metric.status)}.main`,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Box
                      sx={{
                        color: `${getMetricColor(metric.status)}.main`,
                        display: 'flex',
                      }}
                    >
                      {getMetricIcon(metric.name)}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {metric.name}
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {metric.value}{metric.unit}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(metric.value / metric.threshold) * 100}
                    sx={{
                      mt: 1,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: 'action.selected',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: `${getMetricColor(metric.status)}.main`,
                      },
                    }}
                  />
                </Box>
              </Grid>
            ))
          )}
        </Grid>

        {/* Components Status */}
        <Box mt={3}>
          <Typography variant="subtitle2" gutterBottom>
            Component Status
          </Typography>
          <Grid container spacing={1}>
            {health?.components?.map((component: SystemComponent) => (
              <Grid item xs={6} key={component.name}>
                <Tooltip
                  title={`Uptime: ${formatPercentage(component.uptime)} • Last checked: ${new Date(
                    component.lastChecked
                  ).toLocaleTimeString()}`}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    p={1}
                    bgcolor="action.hover"
                    borderRadius={1}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    }}
                  >
                    {component.status === 'operational' ? (
                      <CheckCircle color="success" fontSize="small" />
                    ) : (
                      <Warning color="warning" fontSize="small" />
                    )}
                    <Typography variant="caption">{component.name}</Typography>
                  </Box>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Resource Usage Summary */}
        <Box mt={3} p={1.5} bgcolor="primary.light" borderRadius={1}>
          <Typography variant="caption" color="text.secondary">
            <strong>Resources:</strong> CPU {health?.resources?.cpu || 0}% • Memory{' '}
            {formatBytes(health?.resources?.memoryUsed || 0)} /{' '}
            {formatBytes(health?.resources?.memoryTotal || 0)} • Disk{' '}
            {formatBytes(health?.resources?.diskUsed || 0)} /{' '}
            {formatBytes(health?.resources?.diskTotal || 0)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}