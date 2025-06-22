'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
)

export function RevenueChart() {
  const endDate = new Date()
  const startDate = subDays(endDate, 7)

  const { data, isLoading } = useQuery({
    queryKey: ['revenue-chart', startDate, endDate],
    queryFn: () =>
      apiClient.analytics.getRevenue(
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
    labels: data?.data?.map((d: any) => format(new Date(d.date), 'EEE')) || [],
    datasets: [
      {
        label: 'Room Revenue',
        data: data?.data?.map((d: any) => d.roomRevenue) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'F&B Revenue',
        data: data?.data?.map((d: any) => d.foodBeverageRevenue) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Other Revenue',
        data: data?.data?.map((d: any) => d.otherRevenue) || [],
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  )
}