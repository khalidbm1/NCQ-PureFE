import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  TrendingUpIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

import { adminApi } from '../services/api';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import StatsCard from '../components/StatsCard';
import AdminChart from '../components/AdminChart';
import PendingApplicationsTable from '../components/PendingApplicationsTable';
import TopPerformersTable from '../components/TopPerformersTable';
import RecentActivityFeed from '../components/RecentActivityFeed';
import FraudAlertsPanel from '../components/FraudAlertsPanel';

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboardStats,
  });

  const { data: fraudAlerts } = useQuery({
    queryKey: ['fraud-alerts'],
    queryFn: () => adminApi.getFraudCases({ status: 'flagged', limit: 5 }),
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow h-96"></div>
          <div className="bg-white p-6 rounded-lg shadow h-96"></div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.data || {};
  const alertsCount = fraudAlerts?.data?.pagination?.total || 0;

  const statsCards = [
    {
      title: 'Total Affiliates',
      value: formatNumber(stats.totalAffiliates || 0),
      change: `${stats.activeAffiliates || 0} active`,
      changeType: 'neutral' as const,
      icon: UsersIcon,
      color: 'blue',
    },
    {
      title: 'Pending Applications',
      value: formatNumber(stats.pendingApplications || 0),
      change: 'Require review',
      changeType: stats.pendingApplications > 0 ? 'warning' : 'neutral' as const,
      icon: ClockIcon,
      color: 'yellow',
    },
    {
      title: 'Total Payouts',
      value: formatCurrency(stats.totalCommissionsPaid || 0),
      change: formatCurrency(stats.pendingPayouts || 0) + ' pending',
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
      color: 'green',
    },
    {
      title: 'Monthly Growth',
      value: formatPercentage(stats.monthlyGrowth || 0),
      change: 'New affiliates',
      changeType: stats.monthlyGrowth > 0 ? 'positive' : 'neutral' as const,
      icon: TrendingUpIcon,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage affiliates and monitor system performance.
          </p>
        </div>
        
        {alertsCount > 0 && (
          <div className="flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-sm text-red-700">
              {alertsCount} fraud alert{alertsCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Commission Payouts Trend
          </h3>
          <AdminChart type="revenue" />
        </div>

        {/* Affiliates Growth */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Affiliate Growth
          </h3>
          <AdminChart type="affiliates" />
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Applications
            </h3>
          </div>
          <PendingApplicationsTable />
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performers
            </h3>
          </div>
          <TopPerformersTable />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
          <RecentActivityFeed />
        </div>
      </div>

      {/* Fraud Detection Panel */}
      {alertsCount > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
              Fraud Detection Alerts
            </h3>
          </div>
          <FraudAlertsPanel alerts={fraudAlerts?.data?.data || []} />
        </div>
      )}

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Health</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Gateway</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h4>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              Bulk approve applications
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              Process pending payouts
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              Generate reports
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              Review fraud cases
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Summary
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Signups</span>
              <span className="text-sm font-medium text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversions</span>
              <span className="text-sm font-medium text-gray-900">48</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Commissions Paid</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(2450)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}