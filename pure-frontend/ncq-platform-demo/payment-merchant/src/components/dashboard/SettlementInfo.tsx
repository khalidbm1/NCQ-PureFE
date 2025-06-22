'use client'

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material'
import {
  AccountBalance,
  Schedule,
  TrendingUp,
  Download,
  ArrowForward,
  CheckCircle,
  HourglassEmpty,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { merchantService } from '@/services/merchant.service'
import { formatCurrency, formatDate } from '@/utils/formatters'

interface Settlement {
  id: string
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'processing'
  scheduledDate: string
  completedDate?: string
}

export function SettlementInfo() {
  const router = useRouter()
  
  const { data: settlementData, isLoading } = useQuery({
    queryKey: ['settlement-info'],
    queryFn: () => merchantService.getSettlementInfo(),
    refetchInterval: 300000, // 5 minutes
  })

  const statusConfig = {
    completed: {
      color: 'success' as const,
      icon: <CheckCircle fontSize="small" />,
      label: 'Completed',
    },
    pending: {
      color: 'warning' as const,
      icon: <HourglassEmpty fontSize="small" />,
      label: 'Pending',
    },
    processing: {
      color: 'info' as const,
      icon: <Schedule fontSize="small" />,
      label: 'Processing',
    },
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <AccountBalance color="primary" />
            <Typography variant="h6">Settlement Info</Typography>
          </Box>
          <Button
            size="small"
            endIcon={<ArrowForward />}
            onClick={() => router.push('/settlements')}
          >
            View All
          </Button>
        </Box>

        {/* Current Balance */}
        <Box
          p={2}
          bgcolor="primary.light"
          borderRadius={1}
          mb={3}
          sx={{ backgroundColor: 'rgba(33, 150, 243, 0.08)' }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Available Balance
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            {formatCurrency(settlementData?.availableBalance || 0)}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5} mt={1}>
            <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant="caption" color="success.main">
              Next payout: {formatCurrency(settlementData?.nextPayout?.amount || 0)}
            </Typography>
          </Box>
        </Box>

        {/* Settlement Schedule */}
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Settlement Schedule
          </Typography>
          <Box display="flex" alignItems="center" gap={2} p={1.5} bgcolor="action.hover" borderRadius={1}>
            <Schedule color="action" />
            <Box>
              <Typography variant="body2">
                {settlementData?.schedule?.frequency || 'Daily'} settlements
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Next: {settlementData?.nextPayout?.date ? formatDate(settlementData.nextPayout.date) : 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Recent Settlements */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Recent Settlements
          </Typography>
          <List dense sx={{ py: 0 }}>
            {isLoading ? (
              <LinearProgress />
            ) : settlementData?.recentSettlements?.length > 0 ? (
              settlementData.recentSettlements.map((settlement: Settlement) => (
                <ListItem key={settlement.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">
                          {formatCurrency(settlement.amount, settlement.currency)}
                        </Typography>
                        <Chip
                          size="small"
                          label={statusConfig[settlement.status].label}
                          color={statusConfig[settlement.status].color}
                          icon={statusConfig[settlement.status].icon}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {settlement.status === 'completed' && settlement.completedDate
                          ? `Completed ${formatDate(settlement.completedDate)}`
                          : `Scheduled for ${formatDate(settlement.scheduledDate)}`}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" py={2}>
                No recent settlements
              </Typography>
            )}
          </List>
        </Box>

        {/* Actions */}
        <Box mt={3} display="flex" gap={1}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={() => merchantService.downloadSettlementReport()}
          >
            Download Report
          </Button>
        </Box>

        {/* Bank Account Info */}
        <Box
          mt={3}
          p={2}
          bgcolor="action.hover"
          borderRadius={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Settlement Account
            </Typography>
            <Typography variant="body2">
              {settlementData?.bankAccount?.name || 'Not configured'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              •••• {settlementData?.bankAccount?.last4 || '0000'}
            </Typography>
          </Box>
          <Button size="small" onClick={() => router.push('/settings/bank-account')}>
            Update
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}