'use client'

import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  CreditCard,
  Smartphone,
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Settings,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { merchantService } from '@/services/merchant.service'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

interface PaymentMethodData {
  id: string
  name: string
  type: string
  volume: number
  count: number
  successRate: number
  avgTransactionValue: number
  trend: number
  enabled: boolean
}

const methodIcons: Record<string, React.ReactNode> = {
  card: <CreditCard />,
  mada: <CreditCard />,
  applepay: <Smartphone />,
  samsungpay: <Smartphone />,
  banktransfer: <AccountBalance />,
}

const methodColors: Record<string, string> = {
  card: '#1976d2',
  mada: '#00897b',
  applepay: '#000000',
  samsungpay: '#1565c0',
  banktransfer: '#6a1b9a',
}

export function PaymentMethods() {
  const { data: methods, isLoading } = useQuery({
    queryKey: ['payment-methods-performance'],
    queryFn: () => merchantService.getPaymentMethodsPerformance(),
    refetchInterval: 300000, // 5 minutes
  })

  const totalVolume = methods?.reduce((sum: number, method: PaymentMethodData) => sum + method.volume, 0) || 1

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Payment Methods</Typography>
          <Tooltip title="Configure payment methods">
            <IconButton size="small">
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>

        <List sx={{ py: 0 }}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <LinearProgress sx={{ width: '100%' }} />
              </ListItem>
            ))
          ) : (
            methods?.map((method: PaymentMethodData) => {
              const volumePercentage = (method.volume / totalVolume) * 100
              
              return (
                <ListItem
                  key={method.id}
                  sx={{
                    px: 0,
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 0 },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: `${methodColors[method.type.toLowerCase()]}20`,
                        color: methodColors[method.type.toLowerCase()],
                      }}
                    >
                      {methodIcons[method.type.toLowerCase()] || <CreditCard />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">
                            {method.name}
                          </Typography>
                          {!method.enabled && (
                            <Chip label="Disabled" size="small" color="default" />
                          )}
                        </Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {formatCurrency(method.volume)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box mt={1}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            {formatPercentage(volumePercentage)} of total volume
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            {method.trend > 0 ? (
                              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                            ) : (
                              <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                            )}
                            <Typography
                              variant="caption"
                              color={method.trend > 0 ? 'success.main' : 'error.main'}
                            >
                              {formatPercentage(Math.abs(method.trend))}
                            </Typography>
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={volumePercentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'action.hover',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: methodColors[method.type.toLowerCase()],
                            },
                          }}
                        />
                        <Box display="flex" justifyContent="space-between" mt={1}>
                          <Typography variant="caption" color="text.secondary">
                            {method.count} transactions
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatPercentage(method.successRate)} success rate
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              )
            })
          )}
        </List>

        <Box
          mt={2}
          p={2}
          bgcolor="action.hover"
          borderRadius={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Average Transaction Value
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {formatCurrency(
                methods?.reduce((sum: number, m: PaymentMethodData) => sum + m.avgTransactionValue, 0) / (methods?.length || 1) || 0
              )}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="body2" fontWeight="medium">
              Overall Success Rate
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {formatPercentage(
                methods?.reduce((sum: number, m: PaymentMethodData) => sum + m.successRate, 0) / (methods?.length || 1) || 0
              )}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}