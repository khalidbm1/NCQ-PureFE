import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js'

import {
  fetchDashboardMetrics,
  fetchRealTimeMetrics,
  selectDashboardMetrics,
  selectRealTimeMetrics,
  selectDashboardLoading,
  selectDateRange,
  setDateRange,
  getDateRangePreset,
} from '@/shared/store/slices/dashboardSlice'
import type { AppDispatch, RootState } from '@/shared/store'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
)

const Overview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const metrics = useSelector(selectDashboardMetrics)
  const realTimeMetrics = useSelector(selectRealTimeMetrics)
  const isLoading = useSelector(selectDashboardLoading)
  const dateRange = useSelector(selectDateRange)
  
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Fetch data on component mount and date range changes
  useEffect(() => {
    dispatch(fetchDashboardMetrics({ dateRange }))
    dispatch(fetchRealTimeMetrics())
  }, [dispatch, dateRange])

  // Auto-refresh real-time metrics
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      dispatch(fetchRealTimeMetrics())
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [dispatch, autoRefresh])

  // Handle date range change
  const handleDateRangeChange = (preset: 'today' | '7days' | '30days' | '90days') => {
    const newRange = getDateRangePreset(preset)
    dispatch(setDateRange(newRange))
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    }).format(amount / 100) // Convert from halalas
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // Metric cards data
  const metricCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics?.totalRevenue || 0),
      change: metrics?.monthlyGrowth || 0,
      icon: BanknotesIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Transactions',
      value: (metrics?.totalTransactions || 0).toLocaleString(),
      change: 12.5, // This would come from API
      icon: CreditCardIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Success Rate',
      value: formatPercentage(metrics?.successRate || 0),
      change: 2.1,
      icon: CheckCircleIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Avg. Transaction',
      value: formatCurrency(metrics?.averageTransactionValue || 0),
      change: -5.3,
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  // Revenue chart data
  const revenueChartData = {
    labels: metrics?.revenueChart?.map(point => 
      new Date(point.date).toLocaleDateString('ar-SA', { 
        month: 'short', 
        day: 'numeric' 
      })
    ) || [],
    datasets: [
      {
        label: 'Revenue (SAR)',
        data: metrics?.revenueChart?.map(point => point.value / 100) || [],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // Transaction chart data
  const transactionChartData = {
    labels: metrics?.transactionChart?.map(point => 
      new Date(point.date).toLocaleDateString('ar-SA', { 
        month: 'short', 
        day: 'numeric' 
      })
    ) || [],
    datasets: [
      {
        label: 'Transactions',
        data: metrics?.transactionChart?.map(point => point.value) || [],
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // Payment methods chart data
  const paymentMethodsData = {
    labels: metrics?.topPaymentMethods?.map(method => method.method) || [],
    datasets: [
      {
        data: metrics?.topPaymentMethods?.map(method => method.percentage) || [],
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FF9800',
          '#9C27B0',
          '#F44336',
        ],
        borderWidth: 0,
      },
    ],
  }

  if (isLoading && !metrics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="card-body">
                <div className="skeleton h-4 w-20 mb-2"></div>
                <div className="skeleton h-8 w-32 mb-2"></div>
                <div className="skeleton h-4 w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor your payment gateway performance</p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-white rounded-lg border border-gray-300 p-1">
            {['today', '7days', '30days', '90days'].map((preset) => (
              <button
                key={preset}
                onClick={() => handleDateRangeChange(preset as any)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  dateRange.preset === preset
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {preset === 'today' ? 'Today' : 
                 preset === '7days' ? '7 Days' :
                 preset === '30days' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg border ${
              autoRefresh 
                ? 'bg-primary-50 border-primary-200 text-primary-600' 
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}
            title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
          >
            <ClockIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Real-time Status */}
      {realTimeMetrics && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  realTimeMetrics.systemHealth === 'healthy' ? 'bg-green-500' :
                  realTimeMetrics.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-900">
                  System {realTimeMetrics.systemHealth}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                {realTimeMetrics.transactionsPerMinute} TPM
              </div>
              
              <div className="text-sm text-gray-600">
                {realTimeMetrics.responseTime}ms avg response
              </div>
              
              <div className="text-sm text-gray-600">
                {formatPercentage(realTimeMetrics.errorRate)} error rate
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              Last updated: {new Date(realTimeMetrics.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => (
          <div key={card.title} className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <div className="flex items-center mt-1">
                    {card.change >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      card.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.change >= 0 ? '+' : ''}{card.change.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="text-sm text-gray-500">
              Total: {formatCurrency(metrics?.totalRevenue || 0)}
            </div>
          </div>
          <div className="h-64">
            <Line data={revenueChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Transaction Chart */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Transaction Volume</h3>
            <div className="text-sm text-gray-500">
              Total: {(metrics?.totalTransactions || 0).toLocaleString()}
            </div>
          </div>
          <div className="h-64">
            <Line data={transactionChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="h-48">
            <Doughnut 
              data={paymentMethodsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          <div className="card-body p-0">
            <div className="overflow-hidden">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Reference</th>
                    <th className="table-header-cell">Amount</th>
                    <th className="table-header-cell">Method</th>
                    <th className="table-header-cell">Status</th>
                    <th className="table-header-cell">Time</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {metrics?.recentTransactions?.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="table-cell font-mono text-sm">
                        {transaction.merchantReference}
                      </td>
                      <td className="table-cell font-medium">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="table-cell">
                        <span className="badge badge-gray">
                          {transaction.paymentMethod}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${
                          transaction.status === 'COMPLETED' ? 'badge-success' :
                          transaction.status === 'PENDING' ? 'badge-warning' : 'badge-error'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="table-cell text-gray-500">
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={5} className="table-cell text-center text-gray-500">
                        No recent transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview