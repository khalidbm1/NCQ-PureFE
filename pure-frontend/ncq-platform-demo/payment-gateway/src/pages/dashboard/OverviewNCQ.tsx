import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import {
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { Line, Doughnut } from 'react-chartjs-2'
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
import type { AppDispatch } from '@/shared/store'
import { useTranslation } from '@/shared/hooks/useTranslation'
import { useTheme } from '@/shared/contexts/ThemeContext'

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

const OverviewNCQ: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const metrics = useSelector(selectDashboardMetrics)
  const realTimeMetrics = useSelector(selectRealTimeMetrics)
  const isLoading = useSelector(selectDashboardLoading)
  const dateRange = useSelector(selectDateRange)
  const { t, language } = useTranslation()
  const { theme } = useTheme()
  
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

  // Format currency based on language
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
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
      title: t('dashboard.totalRevenue'),
      value: formatCurrency(metrics?.totalRevenue || 0),
      change: metrics?.monthlyGrowth || 0,
      icon: BanknotesIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: t('dashboard.transactions'),
      value: (metrics?.totalTransactions || 0).toLocaleString(),
      change: 12.5,
      icon: CreditCardIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: t('dashboard.successRate'),
      value: formatPercentage(metrics?.successRate || 0),
      change: 2.1,
      icon: CheckCircleIcon,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      title: 'Avg. Transaction',
      value: formatCurrency(metrics?.averageTransactionValue || 0),
      change: -5.3,
      icon: ChartBarIcon,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ]

  // Chart options for dark mode
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        },
      },
    },
  }

  // Revenue chart data
  const revenueChartData = {
    labels: metrics?.revenueChart?.map(point => 
      new Date(point.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    ) || [],
    datasets: [
      {
        label: 'Revenue (SAR)',
        data: metrics?.revenueChart?.map(point => point.value / 100) || [],
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
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
          '#16a34a',
          '#22c55e',
          '#86efac',
          '#bbf7d0',
          '#dcfce7',
        ],
        borderWidth: 0,
      },
    ],
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your payment gateway performance</p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
            {['today', '7days', '30days', '90days'].map((preset) => (
              <motion.button
                key={preset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDateRangeChange(preset as any)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                  dateRange.preset === preset
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {preset === 'today' ? 'Today' : 
                 preset === '7days' ? '7 Days' :
                 preset === '30days' ? '30 Days' : '90 Days'}
              </motion.button>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg border transition-all ${
              autoRefresh 
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400' 
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
          >
            <ClockIcon className={`h-5 w-5 ${autoRefresh ? 'animate-pulse' : ''}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Real-time Status */}
      {realTimeMetrics && (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  realTimeMetrics.systemHealth === 'healthy' ? 'bg-green-500' :
                  realTimeMetrics.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  System {realTimeMetrics.systemHealth}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {realTimeMetrics.transactionsPerMinute} TPM
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {realTimeMetrics.responseTime}ms avg response
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatPercentage(realTimeMetrics.errorRate)} error rate
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last updated: {new Date(realTimeMetrics.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </motion.div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="card hover:shadow-lg transition-all duration-300"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                  <div className="flex items-center mt-2">
                    {card.change >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1 rtl:ml-1 rtl:mr-0" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1 rtl:ml-1 rtl:mr-0" />
                    )}
                    <span className={`text-sm font-medium ${
                      card.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {card.change >= 0 ? '+' : ''}{card.change.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1 rtl:mr-1 rtl:ml-0">vs last period</span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`p-3 rounded-xl ${card.bgColor}`}
                >
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 chart-container bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total: {formatCurrency(metrics?.totalRevenue || 0)}
            </div>
          </div>
          <div className="h-64">
            <Line data={revenueChartData} options={lineChartOptions} />
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          variants={itemVariants}
          className="chart-container bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
          <div className="h-64">
            <Doughnut 
              data={paymentMethodsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
                    },
                  },
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        variants={itemVariants}
        className="card"
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.recentTransactions')}</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              {t('dashboard.viewAll')}
            </motion.button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('dashboard.amount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('dashboard.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {metrics?.recentTransactions?.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                    {transaction.merchantReference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {transaction.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      transaction.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : 
                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.createdAt).toLocaleTimeString()}
                  </td>
                </motion.tr>
              )) || (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No recent transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default OverviewNCQ