'use client'

import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material'
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
import { dashboardService } from '@/services/dashboard.service'
import { formatCurrency, formatNumber } from '@/utils/formatters'

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

interface TransactionChartProps {
  dateRange: string
}

export function TransactionChart({ dateRange }: TransactionChartProps) {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['transaction-chart', dateRange],
    queryFn: () => dashboardService.getTransactionChartData(dateRange),
    refetchInterval: 60000, // Refresh every minute
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
            if (label.includes('Revenue')) {
              return `${label}: ${formatCurrency(value)}`
            }
            return `${label}: ${formatNumber(value)}`
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
          callback: (value: any) => formatNumber(value),
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
        label: 'Successful Transactions',
        data: chartData?.successful || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Failed Transactions',
        data: chartData?.failed || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Pending Transactions',
        data: chartData?.pending || [],
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Transaction Trends</Typography>
          <Typography variant="caption" color="text.secondary">
            {dateRange === 'today' ? 'Last 24 hours' : `Last ${dateRange}`}
          </Typography>
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