'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/dashboard/StatCard'
import { OccupancyChart } from '@/components/dashboard/OccupancyChart'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { TaskOverview } from '@/components/dashboard/TaskOverview'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import {
  UserGroupIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => apiClient.dashboard.getMetrics(),
  })

  const { data: activity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => apiClient.dashboard.getRecentActivity(),
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Here's what's happening at your property today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Occupancy Rate"
            value={`${metrics?.data?.occupancyRate || 0}%`}
            icon={HomeIcon}
            trend={{
              value: 5.4,
              isPositive: true,
            }}
            isLoading={metricsLoading}
          />
          <StatCard
            title="Available Rooms"
            value={metrics?.data?.availableRooms || 0}
            subtitle={`of ${metrics?.data?.totalRooms || 0} total`}
            icon={HomeIcon}
            isLoading={metricsLoading}
          />
          <StatCard
            title="Today's Revenue"
            value={`$${(metrics?.data?.totalRevenue || 0).toLocaleString()}`}
            icon={CurrencyDollarIcon}
            trend={{
              value: 12.3,
              isPositive: true,
            }}
            isLoading={metricsLoading}
          />
          <StatCard
            title="Pending Tasks"
            value={metrics?.data?.pendingTasks || 0}
            icon={ClipboardDocumentCheckIcon}
            variant={metrics?.data?.pendingTasks > 10 ? 'warning' : 'default'}
            isLoading={metricsLoading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <OccupancyChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
        </div>

        {/* Activity and Tasks */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity activities={activity?.data || []} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Task Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskOverview />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <UserGroupIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">New Guest</span>
              </button>
              <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <HomeIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Check In</span>
              </button>
              <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <ClipboardDocumentCheckIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">New Task</span>
              </button>
              <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <CurrencyDollarIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Reports</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}