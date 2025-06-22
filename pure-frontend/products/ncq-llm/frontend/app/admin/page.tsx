'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  CreditCard,
  TrendingUp,
  Server,
  Activity,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardMetrics {
  users: {
    total: number;
    active: number;
    new_this_month: number;
    growth_percentage: number;
  };
  subscriptions: {
    total: number;
    by_plan: {
      basic: number;
      professional: number;
      enterprise: number;
    };
    mrr: number;
    churn_rate: number;
  };
  usage: {
    api_calls_today: number;
    api_calls_month: number;
    average_response_time: number;
    error_rate: number;
  };
  system: {
    uptime_percentage: number;
    cpu_usage: number;
    memory_usage: number;
    storage_usage: number;
  };
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [usageData, setUsageData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, usageRes, revenueRes] = await Promise.all([
        fetch('/api/v1/admin/metrics', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch(`/api/v1/admin/usage-chart?range=${timeRange}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch(`/api/v1/admin/revenue-chart?range=${timeRange}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      if (metricsRes.ok && usageRes.ok && revenueRes.ok) {
        setMetrics(await metricsRes.json());
        setUsageData(await usageRes.json());
        setRevenueData(await revenueRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const subscriptionDistribution = [
    { name: 'Basic', value: metrics.subscriptions.by_plan.basic, color: '#60a5fa' },
    { name: 'Professional', value: metrics.subscriptions.by_plan.professional, color: '#10b981' },
    { name: 'Enterprise', value: metrics.subscriptions.by_plan.enterprise, color: '#8b5cf6' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Monitor your NCQ LLM platform performance and metrics
        </p>
      </div>

      {/* System Status Alert */}
      {metrics.system.uptime_percentage < 99.9 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            System uptime is below target at {metrics.system.uptime_percentage}%
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.users.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics.users.growth_percentage > 0 ? 'text-green-600' : 'text-red-600'}>
                {metrics.users.growth_percentage > 0 ? '+' : ''}{metrics.users.growth_percentage}%
              </span>
              {' '}from last month
            </p>
            <div className="mt-2">
              <Progress value={(metrics.users.active / metrics.users.total) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.users.active} active users
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.subscriptions.mrr)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.subscriptions.total} active subscriptions
            </p>
            <div className="mt-2 text-xs">
              <span className="text-red-600">Churn: {metrics.subscriptions.churn_rate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.usage.api_calls_month / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              API calls this month
            </p>
            <div className="mt-2 text-xs">
              <span className="text-green-600">Avg: {metrics.usage.average_response_time}ms</span>
              <span className="text-muted-foreground"> | </span>
              <span className="text-red-600">Errors: {metrics.usage.error_rate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.system.uptime_percentage}%</div>
            <p className="text-xs text-muted-foreground">Uptime</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-xs">
                <span className="w-12">CPU:</span>
                <Progress value={metrics.system.cpu_usage} className="h-2 flex-1" />
                <span className="ml-2 w-10 text-right">{metrics.system.cpu_usage}%</span>
              </div>
              <div className="flex items-center text-xs">
                <span className="w-12">RAM:</span>
                <Progress value={metrics.system.memory_usage} className="h-2 flex-1" />
                <span className="ml-2 w-10 text-right">{metrics.system.memory_usage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* API Usage Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>API Usage Trend</CardTitle>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <CardDescription>API calls over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Users by plan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subscriptionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {subscriptionDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
          <CardDescription>Monthly recurring revenue trend</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: CheckCircle, text: 'New Enterprise subscription: Acme Corp', time: '5 minutes ago', color: 'text-green-600' },
              { icon: AlertCircle, text: 'High API usage alert for User #1234', time: '1 hour ago', color: 'text-yellow-600' },
              { icon: Users, text: '15 new users registered today', time: '2 hours ago', color: 'text-blue-600' },
              { icon: Clock, text: 'Scheduled maintenance completed', time: '5 hours ago', color: 'text-gray-600' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <activity.icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 