import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  CubeIcon,
  CurrencyDollarIcon,
  CodeBracketIcon,
  SignalIcon,
  UsersIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { api } from '../services/api'
import StatsCard from '../components/StatsCard'
import RecentActivity from '../components/RecentActivity'

const Dashboard: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['blockchain-stats'],
    queryFn: () => api.get('/stats').then(res => res.data),
    refetchInterval: 30000,
  })

  const { data: recentBlocks } = useQuery({
    queryKey: ['recent-blocks'],
    queryFn: () => api.get('/blockchain?limit=10').then(res => res.data.chain.slice(-10)),
    refetchInterval: 30000,
  })

  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: () => api.get('/assets').then(res => res.data),
  })

  // Mock data for charts
  const blockchainGrowth = [
    { time: '00:00', blocks: 1250, transactions: 5670 },
    { time: '04:00', blocks: 1280, transactions: 5820 },
    { time: '08:00', blocks: 1320, transactions: 6100 },
    { time: '12:00', blocks: 1350, transactions: 6300 },
    { time: '16:00', blocks: 1380, transactions: 6450 },
    { time: '20:00', blocks: 1400, transactions: 6600 },
  ]

  const assetDistribution = [
    { name: 'NCQ Token', value: 45 },
    { name: 'USD Stablecoin', value: 25 },
    { name: 'Gold Token', value: 15 },
    { name: 'Real Estate', value: 10 },
    { name: 'Other', value: 5 },
  ]

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Enterprise blockchain network overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Blocks"
          value={stats.totalBlocks?.toLocaleString() || '0'}
          icon={CubeIcon}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Pending Txns"
          value={stats.pendingTransactions?.toString() || '0'}
          icon={CheckCircleIcon}
          color="yellow"
        />
        <StatsCard
          title="Assets"
          value={stats.assets?.totalAssets?.toString() || '0'}
          icon={CurrencyDollarIcon}
          trend={{ value: 8, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Smart Contracts"
          value={stats.smartContracts?.totalContracts?.toString() || '0'}
          icon={CodeBracketIcon}
          trend={{ value: 3, isPositive: true }}
          color="purple"
        />
        <StatsCard
          title="IoT Devices"
          value={stats.iotDevices?.totalDevices?.toString() || '0'}
          icon={SignalIcon}
          trend={{ value: 15, isPositive: true }}
          color="indigo"
        />
        <StatsCard
          title="Validators"
          value={stats.consensus?.activeValidators?.toString() || '0'}
          icon={UsersIcon}
          color="pink"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blockchain Growth Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blockchain Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={blockchainGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="blocks" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Blocks"
              />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Transactions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assetDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        
        {/* Network Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Consensus</span>
              <span className="status-badge status-active">
                {stats.consensus?.consensusType || 'PBFT'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Network Hash Rate</span>
              <span className="text-sm font-medium">2.5 TH/s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Difficulty</span>
              <span className="text-sm font-medium">{stats.difficulty || 4}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Block Time</span>
              <span className="text-sm font-medium">5.2s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Network Uptime</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard