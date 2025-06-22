'use client'

import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Zap,
  Database,
  Clock,
  AlertCircle,
  Brain,
  Key,
  FileText,
  Users
} from 'lucide-react'
import Link from 'next/link'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useLanguage } from '@/hooks/useLanguage'
import { motion } from 'framer-motion'

const tokenUsageData = [
  { date: 'Jan 1', tokens: 12000 },
  { date: 'Jan 2', tokens: 15000 },
  { date: 'Jan 3', tokens: 18000 },
  { date: 'Jan 4', tokens: 14000 },
  { date: 'Jan 5', tokens: 22000 },
  { date: 'Jan 6', tokens: 19000 },
  { date: 'Jan 7', tokens: 25000 },
]

const modelUsageData = [
  { name: 'GPT-4', value: 45, color: '#16a34a' },
  { name: 'GPT-3.5', value: 30, color: '#22c55e' },
  { name: 'Claude', value: 15, color: '#10b981' },
  { name: 'Others', value: 10, color: '#6ee7b7' },
]

const recentRequests = [
  { id: 1, model: 'GPT-4', tokens: 450, status: 'success', time: '2 min ago' },
  { id: 2, model: 'GPT-3.5', tokens: 1200, status: 'success', time: '5 min ago' },
  { id: 3, model: 'Claude', tokens: 380, status: 'success', time: '12 min ago' },
  { id: 4, model: 'GPT-4', tokens: 650, status: 'failed', time: '15 min ago' },
  { id: 5, model: 'GPT-3.5', tokens: 890, status: 'success', time: '18 min ago' },
]

export default function DashboardPage() {
  const { t, language } = useLanguage()
  const isRTL = language === 'ar'

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const quickActions = [
    { icon: Key, label: t('dashboard.createApiKey'), href: '/dashboard/api-keys', color: 'bg-primary' },
    { icon: Brain, label: t('dashboard.deployModel'), href: '/dashboard/models', color: 'bg-blue-500' },
    { icon: FileText, label: t('dashboard.viewDocs'), href: '/docs', color: 'bg-purple-500' },
    { icon: Users, label: t('dashboard.inviteTeam'), href: '/dashboard/team', color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div {...fadeIn} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('dashboard.welcome')}, {t('user.name')}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('dashboard.overview')}
        </p>
      </motion.div>

      {/* Usage Alert */}
      <motion.div 
        {...fadeIn}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-900 dark:text-amber-200">
              High usage alert
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              You've used 162,500 of your 250,000 monthly tokens (65%). Consider upgrading for more tokens.
            </p>
            <Link 
              href="/dashboard/billing" 
              className="inline-flex items-center mt-3 text-sm font-medium text-amber-900 dark:text-amber-200 hover:text-amber-800 dark:hover:text-amber-100"
            >
              Upgrade Plan →
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('dashboard.tokensUsed')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">162,500</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">of 250,000</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Database className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className={`h-4 w-4 text-green-500 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            <span className="text-green-600 dark:text-green-400 font-medium">12%</span>
            <span className={`text-gray-600 dark:text-gray-400 ${isRTL ? 'mr-1' : 'ml-1'}`}>vs last month</span>
          </div>
        </motion.div>

        <motion.div
          {...fadeIn}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('dashboard.apiCalls')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">3,428</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">this month</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className={`h-4 w-4 text-green-500 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            <span className="text-green-600 dark:text-green-400 font-medium">8%</span>
            <span className={`text-gray-600 dark:text-gray-400 ${isRTL ? 'mr-1' : 'ml-1'}`}>vs last month</span>
          </div>
        </motion.div>

        <motion.div
          {...fadeIn}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('dashboard.activeModels')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">4</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">models running</p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">All systems operational</span>
          </div>
        </motion.div>

        <motion.div
          {...fadeIn}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('dashboard.totalCost')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">$342.50</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">this month</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className={`h-4 w-4 text-green-500 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            <span className="text-green-600 dark:text-green-400 font-medium">5%</span>
            <span className={`text-gray-600 dark:text-gray-400 ${isRTL ? 'mr-1' : 'ml-1'}`}>lower than average</span>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        {...fadeIn}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Token Usage Chart */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Token Usage Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tokenUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                  dot={{ fill: '#16a34a', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Model Usage Distribution */}
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Model Usage
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modelUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {modelUsageData.map((model) => (
              <div key={model.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: model.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">{model.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">{model.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        {...fadeIn}
        transition={{ delay: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('dashboard.recentActivity')}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                  Model
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                  Tokens Used
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {request.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {request.tokens.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'success' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {request.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}