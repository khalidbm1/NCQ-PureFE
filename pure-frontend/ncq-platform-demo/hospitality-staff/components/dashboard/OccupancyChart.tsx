'use client'

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
  ChartOptions,
} from 'chart.js'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { format, subDays } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export function OccupancyChart() {
  const endDate = new Date()
  const startDate = subDays(endDate, 30)

  const { data, isLoading } = useQuery({
    queryKey: ['occupancy-chart', startDate, endDate],
    queryFn: () =>
      apiClient.analytics.getOccupancy(
        startDate.toISOString(),
        endDate.toISOString()
      ),
  })

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const chartData = {
    labels: data?.data?.map((d: any) => format(new Date(d.date), 'MMM dd')) || [],
    datasets: [
      {
        label: 'Occupancy Rate',
        data: data?.data?.map((d: any) => d.occupancyRate) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  }

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  )
}