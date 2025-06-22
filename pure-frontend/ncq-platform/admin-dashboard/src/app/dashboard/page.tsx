'use client'

import { Card } from '@/components/ui/card'
import { Overview } from '@/components/dashboard/overview'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { ProductMetrics } from '@/components/dashboard/product-metrics'
import { SystemHealth } from '@/components/dashboard/system-health'
import { 
  Users, 
  Package, 
  CreditCard, 
  Activity,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { useStats } from '@/hooks/useStats'

export default function DashboardPage() {
  const { data: stats, isLoading } = useStats()

  const statCards = [
    {
      title: 'Total Tenants',
      value: stats?.totalTenants || 0,
      change: '+12.5%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Licenses',
      value: stats?.activeLicenses || 0,
      change: '+8.2%',
      icon: Package,
      color: 'green'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue?.toLocaleString() || 0}`,
      change: '+15.3%',
      icon: CreditCard,
      color: 'purple'
    },
    {
      title: 'API Calls Today',
      value: stats?.apiCallsToday?.toLocaleString() || 0,
      change: '+5.7%',
      icon: Activity,
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to NCQ Platform Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Overview />
        </div>
        <div>
          <SystemHealth />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductMetrics />
        <RecentActivity />
      </div>
    </div>
  )
}