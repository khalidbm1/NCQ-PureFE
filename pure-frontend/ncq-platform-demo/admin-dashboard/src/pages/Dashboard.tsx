import { useState } from 'react'
import {
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  Building2,
  Bell,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { cn, formatCurrency, formatDate } from '../lib/utils'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyRevenue: number
  totalTransactions: number
  pendingTransactions: number
  activeTenants: number
  totalTenants: number
}

interface RecentActivity {
  id: string
  type: 'user' | 'payment' | 'tenant' | 'system'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color = 'blue' 
}: {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: any
  color?: string
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp 
                className={cn(
                  "w-4 h-4 mr-1",
                  changeType === 'increase' ? "text-green-500" : 
                  changeType === 'decrease' ? "text-red-500" : "text-gray-500"
                )}
              />
              <span className={cn(
                "text-sm font-medium",
                changeType === 'increase' ? "text-green-600" : 
                changeType === 'decrease' ? "text-red-600" : "text-gray-600"
              )}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", colorClasses[color as keyof typeof colorClasses])}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
  const statusIcons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertTriangle,
    info: Bell,
  }

  const statusColors = {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  }

  const Icon = statusIcons[activity.status]

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
      <Icon className={cn("w-5 h-5 mt-0.5", statusColors[activity.status])} />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {activity.title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {activity.description}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {formatDate(activity.timestamp, { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
      <Badge variant={activity.status === 'success' ? 'success' : 
                     activity.status === 'warning' ? 'warning' : 
                     activity.status === 'error' ? 'destructive' : 'info'}>
        {activity.status}
      </Badge>
    </div>
  )
}

export default function Dashboard() {
  const [stats] = useState<DashboardStats>({
    totalUsers: 12847,
    activeUsers: 8934,
    totalRevenue: 2849572,
    monthlyRevenue: 284957,
    totalTransactions: 15634,
    pendingTransactions: 23,
    activeTenants: 145,
    totalTenants: 167,
  })

  const [activities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'user',
      title: 'New User Registration',
      description: 'Ahmed Abdullah registered for Premium plan',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'success',
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Processed',
      description: 'Monthly subscription payment of 299 SAR',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'success',
    },
    {
      id: '3',
      type: 'system',
      title: 'System Alert',
      description: 'High CPU usage detected on server-01',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'warning',
    },
    {
      id: '4',
      type: 'tenant',
      title: 'New Tenant Created',
      description: 'Riyadh Medical Center joined the platform',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: 'info',
    },
    {
      id: '5',
      type: 'payment',
      title: 'Payment Failed',
      description: 'Credit card payment failed for user Sarah Mohammed',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: 'error',
    },
  ])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome to NCQ Platform Admin Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+12.5%"
          changeType="increase"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          change="+8.2%"
          changeType="increase"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Active Transactions"
          value={stats.totalTransactions.toLocaleString()}
          change="+15.3%"
          changeType="increase"
          icon={CreditCard}
          color="purple"
        />
        <StatCard
          title="Active Tenants"
          value={stats.activeTenants}
          change="+5.1%"
          changeType="increase"
          icon={Building2}
          color="indigo"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Users"
          value={`${stats.activeUsers.toLocaleString()} / ${stats.totalUsers.toLocaleString()}`}
          change="69.6%"
          changeType="neutral"
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Pending Transactions"
          value={stats.pendingTransactions}
          change={stats.pendingTransactions > 20 ? "High" : "Normal"}
          changeType={stats.pendingTransactions > 20 ? "increase" : "neutral"}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change="+23.8%"
          changeType="increase"
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Badge variant="secondary">Live</Badge>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-primary hover:text-primary/80 font-medium">
            View all activity →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
          <Users className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="font-medium text-gray-900 dark:text-white">Manage Users</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Add, edit, or remove users
          </p>
        </button>

        <button className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
          <Building2 className="w-8 h-8 text-green-500 mb-3" />
          <h3 className="font-medium text-gray-900 dark:text-white">Tenant Management</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure tenant settings
          </p>
        </button>

        <button className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
          <CreditCard className="w-8 h-8 text-purple-500 mb-3" />
          <h3 className="font-medium text-gray-900 dark:text-white">Payment Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure payment options
          </p>
        </button>

        <button className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
          <FileText className="w-8 h-8 text-indigo-500 mb-3" />
          <h3 className="font-medium text-gray-900 dark:text-white">System Reports</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View detailed analytics
          </p>
        </button>
      </div>
    </div>
  )
}