import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  CurrencyDollarIcon, 
  UsersIcon, 
  ChartBarIcon, 
  TrendingUpIcon,
  EyeIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline';

import { affiliateApi } from '../services/api';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import StatsCard from '../components/StatsCard';
import EarningsChart from '../components/EarningsChart';
import TopLinksTable from '../components/TopLinksTable';
import RecentActivity from '../components/RecentActivity';

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: affiliateApi.getDashboard,
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

  const { stats, commissionSummary, payoutSummary } = dashboardData?.data || {};

  const statsCards = [
    {
      title: 'Total Earnings',
      value: formatCurrency(commissionSummary?.paid_amount || 0),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
      color: 'green',
    },
    {
      title: 'Pending Commissions',
      value: formatCurrency(commissionSummary?.pending_amount || 0),
      change: `${commissionSummary?.pending_count || 0} pending`,
      changeType: 'neutral' as const,
      icon: ChartBarIcon,
      color: 'yellow',
    },
    {
      title: 'Total Clicks',
      value: formatNumber(stats?.total_clicks || 0),
      change: formatNumber(stats?.unique_clicks || 0) + ' unique',
      changeType: 'neutral' as const,
      icon: CursorArrowRaysIcon,
      color: 'blue',
    },
    {
      title: 'Conversion Rate',
      value: formatPercentage(stats?.conversion_rate || 0),
      change: `${stats?.total_conversions || 0} conversions`,
      changeType: stats?.conversion_rate > 3 ? 'positive' : 'neutral' as const,
      icon: TrendingUpIcon,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's an overview of your affiliate performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Earnings Overview
          </h3>
          <EarningsChart />
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <a
              href="/links"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <EyeIcon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Create New Link
                </p>
                <p className="text-sm text-gray-500">
                  Generate a new referral link
                </p>
              </div>
            </a>

            <a
              href="/payouts"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Request Payout
                </p>
                <p className="text-sm text-gray-500">
                  Withdraw your earnings
                </p>
              </div>
            </a>

            <a
              href="/materials"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Marketing Materials
                </p>
                <p className="text-sm text-gray-500">
                  Download promotional content
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Links */}
        <div className="bg-white rounded-lg shadow">
          <TopLinksTable />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <RecentActivity />
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            This Month's Performance
          </h3>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(commissionSummary?.this_month_amount || 0)}
            </div>
            <div className="text-sm text-gray-500">Earnings This Month</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(stats?.total_clicks || 0)}
            </div>
            <div className="text-sm text-gray-500">Total Clicks</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stats?.total_conversions || 0}
            </div>
            <div className="text-sm text-gray-500">Conversions</div>
          </div>
        </div>
      </div>
    </div>
  );
}