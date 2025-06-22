'use client'

import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material'
import {
  CheckCircle,
  Warning,
  Error,
  Info,
  Refresh,
  Speed,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'
import { formatNumber, formatPercentage } from '@/utils/formatters'

interface ProcessorInfo {
  id: string
  name: string
  status: 'operational' | 'degraded' | 'down'
  uptime: number
  responseTime: number
  successRate: number
  transactionCount: number
  lastChecked: string
  logo?: string
}

const statusConfig = {
  operational: {
    color: 'success' as const,
    icon: <CheckCircle />,
    label: 'Operational',
  },
  degraded: {
    color: 'warning' as const,
    icon: <Warning />,
    label: 'Degraded',
  },
  down: {
    color: 'error' as const,
    icon: <Error />,
    label: 'Down',
  },
}

export function ProcessorStatus() {
  const { data: processors, isLoading, refetch } = useQuery({
    queryKey: ['processor-status'],
    queryFn: () => dashboardService.getProcessorStatus(),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const getProcessorLogo = (name: string) => {
    const logoMap: Record<string, string> = {
      'SABB': '/logos/sabb.png',
      'Al Rajhi': '/logos/alrajhi.png',
      'NCB': '/logos/ncb.png',
      'Alinma': '/logos/alinma.png',
      'Alahli': '/logos/alahli.png',
    }
    return logoMap[name] || '/logos/default-bank.png'
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Payment Processor Status</Typography>
          <Tooltip title="Refresh status">
            <IconButton size="small" onClick={() => refetch()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        <List sx={{ py: 0 }}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <ListItem key={index} divider>
                <LinearProgress sx={{ width: '100%' }} />
              </ListItem>
            ))
          ) : (
            processors?.map((processor: ProcessorInfo, index: number) => (
              <ListItem
                key={processor.id}
                divider={index < processors.length - 1}
                sx={{ px: 0 }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={getProcessorLogo(processor.name)}
                    alt={processor.name}
                    sx={{ width: 40, height: 40 }}
                  >
                    {processor.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2">
                        {processor.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={statusConfig[processor.status].label}
                        color={statusConfig[processor.status].color}
                        icon={statusConfig[processor.status].icon}
                      />
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Uptime: {formatPercentage(processor.uptime)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Success Rate: {formatPercentage(processor.successRate)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={processor.uptime}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'action.hover',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor:
                              processor.status === 'operational'
                                ? 'success.main'
                                : processor.status === 'degraded'
                                ? 'warning.main'
                                : 'error.main',
                          },
                        }}
                      />
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Speed sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {processor.responseTime}ms
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatNumber(processor.transactionCount)} txns today
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))
          )}
        </List>

        <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Info fontSize="small" color="primary" />
            <Typography variant="subtitle2">System Health</Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            All payment processors are monitored 24/7. Response times are averaged over the last 5 minutes.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}