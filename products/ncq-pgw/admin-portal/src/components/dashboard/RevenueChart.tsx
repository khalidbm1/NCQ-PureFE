'use client'

import { Card, CardContent, Typography, Box, Skeleton, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { dashboardService } from '@/services/dashboard.service'
import { formatCurrency } from '@/utils/formatters'

ChartJS.register(ArcElement, Tooltip, Legend)

interface RevenueChartProps {
  dateRange: string
}

export function RevenueChart({ dateRange }: RevenueChartProps) {
  const [view, setView] = useState<'payment-method' | 'processor'>('payment-method')
  
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['revenue-chart', dateRange, view],
    queryFn: () => dashboardService.getRevenueChartData(dateRange, view),
    refetchInterval: 60000,
  })

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.parsed
            const percentage = ((value / (chartData?.total || 1)) * 100).toFixed(1)
            return `${label}: ${formatCurrency(value)} (${percentage}%)`
          },
        },
      },
    },
  }

  const paymentMethodColors = [
    'rgba(25, 118, 210, 0.8)',  // Credit Card
    'rgba(220, 0, 78, 0.8)',     // Debit Card
    'rgba(46, 125, 50, 0.8)',    // MADA
    'rgba(237, 108, 2, 0.8)',    // Apple Pay
    'rgba(156, 39, 176, 0.8)',   // Samsung Pay
    'rgba(0, 172, 193, 0.8)',    // Bank Transfer
  ]

  const processorColors = [
    'rgba(25, 118, 210, 0.8)',  // SABB
    'rgba(220, 0, 78, 0.8)',     // Al Rajhi
    'rgba(46, 125, 50, 0.8)',    // NCB
    'rgba(237, 108, 2, 0.8)',    // Alinma
    'rgba(156, 39, 176, 0.8)',   // Alahli
  ]

  const data = {
    labels: chartData?.labels || [],
    datasets: [
      {
        data: chartData?.values || [],
        backgroundColor: view === 'payment-method' ? paymentMethodColors : processorColors,
        borderWidth: 0,
      },
    ],
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Revenue Distribution</Typography>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, newView) => newView && setView(newView)}
            size="small"
          >
            <ToggleButton value="payment-method">
              By Method
            </ToggleButton>
            <ToggleButton value="processor">
              By Processor
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <Box sx={{ height: 300 }}>
          {isLoading ? (
            <Skeleton variant="circular" width={250} height={250} sx={{ mx: 'auto' }} />
          ) : (
            <>
              <Doughnut options={options} data={data} />
              <Box mt={2} textAlign="center">
                <Typography variant="h5" fontWeight="bold">
                  {formatCurrency(chartData?.total || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}