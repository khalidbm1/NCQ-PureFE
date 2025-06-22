import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, DollarSign, Users, Server, TrendingUp, Package, Heart, Banknote } from 'lucide-react';

interface DashboardStats {
  platform: {
    totalTransactions: number;
    activeUsers: number;
    revenue: number;
    uptime: number;
  };
  subscriptions: {
    total: number;
    active: number;
    cancelled: number;
    revenue: number;
  };
  modules: {
    manufacturing: {
      totalProducts: number;
      qualityCheckPassRate: number;
    };
    healthcare: {
      totalPatients: number;
      complianceScore: number;
    };
    financial: {
      totalTradingAccounts: number;
      totalCommissionsEarned: number;
    };
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        platform: {
          totalTransactions: 1250000,
          activeUsers: 5432,
          revenue: 892000,
          uptime: 99.9
        },
        subscriptions: {
          total: 1234,
          active: 987,
          cancelled: 123,
          revenue: 450000
        },
        modules: {
          manufacturing: {
            totalProducts: 15678,
            qualityCheckPassRate: 98.5
          },
          healthcare: {
            totalPatients: 8901,
            complianceScore: 96.2
          },
          financial: {
            totalTradingAccounts: 3456,
            totalCommissionsEarned: 78900
          }
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  const revenueData = [
    { month: 'Jan', revenue: 45000, subscriptions: 800 },
    { month: 'Feb', revenue: 52000, subscriptions: 850 },
    { month: 'Mar', revenue: 48000, subscriptions: 820 },
    { month: 'Apr', revenue: 61000, subscriptions: 900 },
    { month: 'May', revenue: 55000, subscriptions: 875 },
    { month: 'Jun', revenue: 67000, subscriptions: 987 }
  ];

  const moduleUsageData = [
    { name: 'Manufacturing', value: 45, color: '#0088FE' },
    { name: 'Healthcare', value: 30, color: '#00C49F' },
    { name: 'Financial', value: 20, color: '#FFBB28' },
    { name: 'Other', value: 5, color: '#FF8042' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading NCQ Enterprise Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>NCQ Enterprise Blockchain - Admin Dashboard</title>
        <meta name="description" content="NCQ Enterprise Blockchain Administration Dashboard" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">NCQ Enterprise Blockchain</h1>
                <p className="text-sm text-gray-500">Administration Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-green-800 text-sm font-medium">System Healthy</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Uptime</p>
                <p className="text-lg font-semibold text-gray-900">{stats?.platform.uptime}%</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.platform.totalTransactions.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.platform.activeUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats?.platform.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Server className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.subscriptions.active}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Module Usage */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Module Usage Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moduleUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moduleUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manufacturing Module */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Manufacturing</h3>
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats?.modules.manufacturing.totalProducts.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quality Pass Rate</p>
                <p className="text-xl font-semibold text-green-600">
                  {stats?.modules.manufacturing.qualityCheckPassRate}%
                </p>
              </div>
            </div>
          </div>

          {/* Healthcare Module */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Healthcare</h3>
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats?.modules.healthcare.totalPatients.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Compliance Score</p>
                <p className="text-xl font-semibold text-green-600">
                  {stats?.modules.healthcare.complianceScore}%
                </p>
              </div>
            </div>
          </div>

          {/* Financial Module */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Financial Services</h3>
              <Banknote className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Trading Accounts</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats?.modules.financial.totalTradingAccounts.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Commission Revenue</p>
                <p className="text-xl font-semibold text-green-600">
                  ${stats?.modules.financial.totalCommissionsEarned.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Platform Activity</h3>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {[
                  { action: 'New subscription created', user: 'TechCorp Industries', time: '2 minutes ago', type: 'subscription' },
                  { action: 'Quality check passed', user: 'Manufacturing Plant A', time: '5 minutes ago', type: 'manufacturing' },
                  { action: 'Patient consent granted', user: 'City General Hospital', time: '8 minutes ago', type: 'healthcare' },
                  { action: 'Trading account created', user: 'Investment Firm B', time: '12 minutes ago', type: 'financial' },
                  { action: 'Payment processed', user: 'Global Solutions Inc', time: '15 minutes ago', type: 'payment' }
                ].map((activity, idx) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      {idx !== 4 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.type === 'subscription' ? 'bg-blue-500' :
                            activity.type === 'manufacturing' ? 'bg-orange-500' :
                            activity.type === 'healthcare' ? 'bg-red-500' :
                            activity.type === 'financial' ? 'bg-green-500' : 'bg-purple-500'
                          }`}>
                            {activity.type === 'subscription' && <Users className="h-4 w-4 text-white" />}
                            {activity.type === 'manufacturing' && <Package className="h-4 w-4 text-white" />}
                            {activity.type === 'healthcare' && <Heart className="h-4 w-4 text-white" />}
                            {activity.type === 'financial' && <TrendingUp className="h-4 w-4 text-white" />}
                            {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-white" />}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.action} by <span className="font-medium text-gray-900">{activity.user}</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}