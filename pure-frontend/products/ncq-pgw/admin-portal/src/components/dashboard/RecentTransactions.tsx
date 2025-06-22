'use client'

import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Button,
} from '@mui/material'
import {
  Visibility,
  ContentCopy,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Refresh,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { dashboardService } from '@/services/dashboard.service'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import { useState } from 'react'
import { useSnackbar } from 'notistack'

interface Transaction {
  id: string
  merchantName: string
  amount: number
  currency: string
  status: 'success' | 'failed' | 'pending' | 'refunded'
  paymentMethod: string
  processor: string
  timestamp: string
  reference: string
}

const statusConfig = {
  success: {
    color: 'success' as const,
    icon: <CheckCircle fontSize="small" />,
    label: 'Success',
  },
  failed: {
    color: 'error' as const,
    icon: <Cancel fontSize="small" />,
    label: 'Failed',
  },
  pending: {
    color: 'warning' as const,
    icon: <HourglassEmpty fontSize="small" />,
    label: 'Pending',
  },
  refunded: {
    color: 'info' as const,
    icon: <CheckCircle fontSize="small" />,
    label: 'Refunded',
  },
}

export function RecentTransactions() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => dashboardService.getRecentTransactions(),
    refetchInterval: 10000, // Refresh every 10 seconds
  })

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    enqueueSnackbar('Transaction ID copied', { variant: 'success' })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleViewTransaction = (id: string) => {
    router.push(`/transactions/${id}`)
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Recent Transactions</Typography>
          <Box display="flex" gap={1}>
            <Button
              size="small"
              onClick={() => router.push('/transactions')}
            >
              View All
            </Button>
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={() => refetch()}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Merchant</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7}>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                transactions?.map((transaction: Transaction) => (
                  <TableRow
                    key={transaction.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                          }}
                        >
                          {transaction.reference}
                        </Typography>
                        <Tooltip title={copiedId === transaction.id ? 'Copied!' : 'Copy ID'}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyId(transaction.id)
                            }}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.merchantName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {transaction.paymentMethod}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={statusConfig[transaction.status].label}
                        color={statusConfig[transaction.status].color}
                        icon={statusConfig[transaction.status].icon}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(transaction.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewTransaction(transaction.id)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!isLoading && transactions?.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
          >
            <Typography variant="body2" color="text.secondary">
              No transactions found
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}