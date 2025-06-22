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
  Avatar,
} from '@mui/material'
import {
  Visibility,
  ContentCopy,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Refresh,
  Download,
  CreditCard,
  Smartphone,
  AccountBalance,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { merchantService } from '@/services/merchant.service'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import { useState } from 'react'
import { useSnackbar } from 'notistack'

interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'success' | 'failed' | 'pending' | 'refunded'
  paymentMethod: {
    type: string
    brand?: string
    last4?: string
  }
  customer: {
    name: string
    email: string
  }
  createdAt: string
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

const paymentMethodIcons: Record<string, React.ReactNode> = {
  card: <CreditCard fontSize="small" />,
  mada: <CreditCard fontSize="small" />,
  applepay: <Smartphone fontSize="small" />,
  samsungpay: <Smartphone fontSize="small" />,
  banktransfer: <AccountBalance fontSize="small" />,
}

export function TransactionList() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => merchantService.getRecentTransactions(),
    refetchInterval: 30000, // Refresh every 30 seconds
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

  const handleExportTransactions = () => {
    merchantService.exportTransactions()
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Recent Transactions</Typography>
          <Box display="flex" gap={1}>
            <Button
              size="small"
              startIcon={<Download />}
              onClick={handleExportTransactions}
            >
              Export
            </Button>
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
                <TableCell>Transaction</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
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
                      <Box>
                        <Typography variant="body2">
                          {transaction.customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.customer.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {paymentMethodIcons[transaction.paymentMethod.type.toLowerCase()] || <CreditCard fontSize="small" />}
                        <Box>
                          <Typography variant="caption">
                            {transaction.paymentMethod.brand || transaction.paymentMethod.type}
                          </Typography>
                          {transaction.paymentMethod.last4 && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              •••• {transaction.paymentMethod.last4}
                            </Typography>
                          )}
                        </Box>
                      </Box>
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
                        {formatDateTime(transaction.createdAt)}
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
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
              onClick={() => router.push('/integration')}
            >
              Start Integration
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}