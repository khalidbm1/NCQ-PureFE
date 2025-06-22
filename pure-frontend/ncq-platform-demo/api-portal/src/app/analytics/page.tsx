'use client';

import { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  ChartBarIcon, 
  ClockIcon, 
  ServerIcon, 
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserGroupIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { MetricCard } from '@/components/analytics/MetricCard';
import { DateRangePicker } from '@/components/analytics/DateRangePicker';
import { ServiceFilter } from '@/components/analytics/ServiceFilter';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock data
const metrics = {
  totalRequests: {
    value: '2.4M',
    change: 12.5,
    trend: 'up'
  },
  avgLatency: {
    value: '124ms',
    change: -8.3,
    trend: 'down'
  },
  errorRate: {
    value: '0.12%',
    change: -2.1,
    trend: 'down'
  },
  activeUsers: {
    value: '8,421',
    change: 5.2,
    trend: 'up'
  }
};

const requestVolumeData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [{
    label: 'Requests',
    data: [1200, 1900, 3000, 5000, 4200, 3100, 2400],
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4,
    fill: true
  }]
};

const endpointUsageData = {
  labels: ['Auth Login', 'IoT Telemetry', 'Payment Process', 'User Profile', 'Device List'],
  datasets: [{
    label: 'Requests',
    data: [45000, 38000, 28000, 22000, 18000],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(239, 68, 68, 0.8)'
    ]
  }]
};

const statusCodeData = {
  labels: ['2xx Success', '4xx Client Error', '5xx Server Error'],
  datasets: [{
    data: [94.5, 5.2, 0.3],
    backgroundColor: [
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)'
    ]
  }]
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedServices, setSelectedServices] = useState<string[]>(['all']);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Analytics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Monitor API usage, performance, and health metrics
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <ServiceFilter 
            selectedServices={selectedServices} 
            onChange={setSelectedServices} 
          />
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Requests"
            value={metrics.totalRequests.value}
            change={metrics.totalRequests.change}
            trend={metrics.totalRequests.trend as 'up' | 'down'}
            icon={ChartBarIcon}
            color="blue"
          />
          <MetricCard
            title="Avg Latency"
            value={metrics.avgLatency.value}
            change={metrics.avgLatency.change}
            trend={metrics.avgLatency.trend as 'up' | 'down'}
            icon={ClockIcon}
            color="green"
          />
          <MetricCard
            title="Error Rate"
            value={metrics.errorRate.value}
            change={metrics.errorRate.change}
            trend={metrics.errorRate.trend as 'up' | 'down'}
            icon={ExclamationTriangleIcon}
            color="red"
          />
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers.value}
            change={metrics.activeUsers.change}
            trend={metrics.activeUsers.trend as 'up' | 'down'}
            icon={UserGroupIcon}
            color="purple"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Volume Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Request Volume
            </h3>
            <div className="h-64">
              <Line 
                data={requestVolumeData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Top Endpoints Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Endpoints
            </h3>
            <div className="h-64">
              <Bar 
                data={endpointUsageData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                      }
                    },
                    y: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Status Code Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Response Status Codes
            </h3>
            <div className="h-64 flex items-center justify-center">
              <div className="w-48 h-48">
                <Doughnut 
                  data={statusCodeData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">P50 Latency</span>
                <span className="font-mono text-gray-900 dark:text-white">98ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">P95 Latency</span>
                <span className="font-mono text-gray-900 dark:text-white">256ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">P99 Latency</span>
                <span className="font-mono text-gray-900 dark:text-white">512ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Uptime</span>
                <span className="font-mono text-green-600">99.98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Cache Hit Rate</span>
                <span className="font-mono text-gray-900 dark:text-white">87.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Incidents
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  All systems operational
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No incidents reported in the last 24 hours
                </p>
              </div>
              <span className="text-sm text-gray-500">Now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}