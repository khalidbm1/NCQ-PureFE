'use client'

import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Skeleton,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress,
} from '@mui/material'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { merchantService } from '@/services/merchant.service'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface RevenueAnalyticsProps {
  dateRange: string
}

export function RevenueAnalytics({ dateRange }: RevenueAnalyticsProps) {
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day')
  
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['revenue-analytics', dateRange, groupBy],
    queryFn: () => merchantService.getRevenueAnalytics(dateRange, groupBy),
    refetchInterval: 300000, // 5 minutes
  })

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return formatCurrency(context.parsed.y)
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
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
  }

  const data = {
    labels: analyticsData?.labels || [],
    datasets: [
      {
        data: analyticsData?.revenue || [],
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
        borderColor: 'rgb(33, 150, 243)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Revenue Analytics</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <ToggleButtonGroup
              value={groupBy}
              exclusive
              onChange={(_, newValue) => newValue && setGroupBy(newValue)}
              size="small"
            >
              <ToggleButton value="day">Daily</ToggleButton>
              <ToggleButton value="week">Weekly</ToggleButton>
              <ToggleButton value="month">Monthly</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Summary Stats */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              {isLoading ? (
                <Skeleton width={100} height={28} />
              ) : (
                <>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(analyticsData?.summary?.totalRevenue || 0)}
                  </Typography>
                  <Chip
                    label={`${analyticsData?.summary?.revenueGrowth >= 0 ? '+' : ''}${formatPercentage(analyticsData?.summary?.revenueGrowth || 0)}`}
                    color={analyticsData?.summary?.revenueGrowth >= 0 ? 'success' : 'error'}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Average Daily Revenue
              </Typography>
              {isLoading ? (
                <Skeleton width={100} height={28} />
              ) : (
                <Typography variant="h5" fontWeight="bold">
                  {formatCurrency(analyticsData?.summary?.avgDailyRevenue || 0)}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Best Day
              </Typography>
              {isLoading ? (
                <Skeleton width={100} height={28} />
              ) : (
                <>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(analyticsData?.summary?.bestDay?.amount || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {analyticsData?.summary?.bestDay?.date}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Revenue Target
              </Typography>
              {isLoading ? (
                <Skeleton width={100} height={28} />
              ) : (
                <>
                  <Box display="flex" alignItems="baseline" gap={1}>
                    <Typography variant="h5" fontWeight="bold">
                      {formatPercentage(analyticsData?.summary?.targetProgress || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      of target
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analyticsData?.summary?.targetProgress || 0}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Chart */}
        <Box sx={{ height: 300 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={300} />
          ) : (
            <Bar options={options} data={data} />
          )}
        </Box>

        {/* Top Products */}
        {analyticsData?.topProducts && (
          <Box mt={3}>
            <Typography variant="subtitle2" gutterBottom>
              Top Performing Products
            </Typography>
            <Grid container spacing={1}>
              {analyticsData.topProducts.map((product: any, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.quantity} sold
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(product.revenue)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}