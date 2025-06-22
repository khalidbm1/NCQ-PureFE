import React from 'react'
import { motion } from 'framer-motion'
import { 
  FiTrendingUp, FiDollarSign, FiUsers, FiActivity,
  FiCreditCard, FiShoppingCart, FiCpu, FiWifi
} from 'react-icons/fi'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import toast from 'react-hot-toast'

// Mock data
const revenueData = [
  { name: 'Jan', value: 120000 },
  { name: 'Feb', value: 135000 },
  { name: 'Mar', value: 128000 },
  { name: 'Apr', value: 142000 },
  { name: 'May', value: 156000 },
  { name: 'Jun', value: 168000 },
]

const transactionData = [
  { name: 'Mon', success: 850, failed: 45 },
  { name: 'Tue', success: 920, failed: 38 },
  { name: 'Wed', success: 980, failed: 52 },
  { name: 'Thu', success: 1050, failed: 41 },
  { name: 'Fri', success: 1200, failed: 48 },
  { name: 'Sat', success: 890, failed: 35 },
  { name: 'Sun', success: 750, failed: 28 },
]

const serviceUsage = [
  { name: 'Payment Gateway', value: 35, color: '#0284c7' },
  { name: 'Hospital Management', value: 25, color: '#10b981' },
  { name: 'Smart Hospitality', value: 20, color: '#8b5cf6' },
  { name: 'IoT Platform', value: 12, color: '#f59e0b' },
  { name: 'AI Platform', value: 8, color: '#6366f1' },
]

const metrics = [
  {
    title: 'Total Revenue',
    value: 'SAR 2.4M',
    change: '+12.5%',
    trend: 'up',
    icon: FiDollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Active Users',
    value: '52,841',
    change: '+8.2%',
    trend: 'up',
    icon: FiUsers,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Transactions',
    value: '124,523',
    change: '+15.3%',
    trend: 'up',
    icon: FiCreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'System Health',
    value: '99.9%',
    change: '+0.1%',
    trend: 'up',
    icon: FiActivity,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
]

const recentActivities = [
  { id: 1, type: 'payment', message: 'Payment of SAR 1,250 processed for Hospital ABC', time: '2 min ago' },
  { id: 2, type: 'user', message: 'New merchant onboarded: Tech Solutions Ltd', time: '15 min ago' },
  { id: 3, type: 'iot', message: 'IoT device maintenance completed in Building A', time: '1 hour ago' },
  { id: 4, type: 'ai', message: 'AI model training completed with 95% accuracy', time: '2 hours ago' },
  { id: 5, type: 'booking', message: 'Suite 501 booked for 3 nights at Grand Hotel', time: '3 hours ago' },
]

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-600 mt-1">
          Real-time insights across all NCQ Platform services
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => toast.success(`${metric.title} details coming soon!`)}
            data-tooltip={`Click to view ${metric.title} details`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{metric.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `SAR ${value.toLocaleString()}`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Area type="monotone" dataKey="value" stroke="#0284c7" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Transaction Success Rate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Legend />
              <Bar dataKey="success" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Service Usage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.type === 'payment' && <FiCreditCard className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'user' && <FiUsers className="w-5 h-5 text-green-600" />}
                  {activity.type === 'iot' && <FiWifi className="w-5 h-5 text-orange-600" />}
                  {activity.type === 'ai' && <FiCpu className="w-5 h-5 text-purple-600" />}
                  {activity.type === 'booking' && <FiShoppingCart className="w-5 h-5 text-pink-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-sm p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">System Status</h3>
            <p className="text-white/80 mt-1">All services operational</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">Live</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard