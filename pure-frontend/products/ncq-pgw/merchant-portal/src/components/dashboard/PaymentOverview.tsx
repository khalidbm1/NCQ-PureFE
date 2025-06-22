'use client'

import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { merchantService } from '@/services/merchant.service'
import { formatCurrency } from '@/utils/formatters'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface PaymentOverviewProps {
  dateRange: string
}

export function PaymentOverview({ dateRange }: PaymentOverviewProps) {
  const [view, setView] = useState<'amount' | 'count'>('amount')
  
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['payment-overview', dateRange, view],
    queryFn: () => merchantService.getPaymentOverview(dateRange, view),
    refetchInterval: 60000,
  })

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            if (view === 'amount') {
              return `${label}: ${formatCurrency(value)}`
            }
            return `${label}: ${value} transactions`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            if (view === 'amount') {
              return formatCurrency(value)
            }
            return value
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  }

  const data = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: 'Successful',
        data: chartData?.successful || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Failed',
        data: chartData?.failed || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Refunded',
        data: chartData?.refunded || [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Payment Overview</Typography>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, newView) => newView && setView(newView)}
            size="small"
          >
            <ToggleButton value="amount">
              Amount
            </ToggleButton>
            <ToggleButton value="count">
              Count
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ height: 350 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={350} />
          ) : (
            <Line options={options} data={data} />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}