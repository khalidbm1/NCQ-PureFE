import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale } from 'chart.js';
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  Target,
  Calendar,
  Clock,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Settings,
  Bell,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Eye,
  EyeOff,
  Layers,
  Grid,
  List,
  Map,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Briefcase,
  Package,
  Truck,
  CreditCard,
  Receipt,
  Calculator,
  Percent
} from 'lucide-react';

export default function BusinessDashboardEnhanced() {
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [dateRange, setDateRange] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('grid');
  const [showComparison, setShowComparison] = useState(true);

  // Mock KPI data
  const kpiData = [
    {
      id: 1,
      title: 'Total Revenue',
      value: '$847,293',
      change: '+12.5%',
      trend: 'up',
      target: '$900,000',
      completion: 94,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      sparklineData: [30, 40, 35, 50, 49, 60, 70, 91, 85, 95, 92, 94]
    },
    {
      id: 2,
      title: 'Active Customers',
      value: '12,847',
      change: '+8.3%',
      trend: 'up',
      target: '15,000',
      completion: 86,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      sparklineData: [10, 20, 15, 25, 30, 35, 40, 45, 50, 48, 52, 56]
    },
    {
      id: 3,
      title: 'Conversion Rate',
      value: '3.74%',
      change: '+0.42%',
      trend: 'up',
      target: '4.0%',
      completion: 93,
      icon: Percent,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      sparklineData: [3.1, 3.2, 3.3, 3.4, 3.5, 3.4, 3.6, 3.7, 3.65, 3.7, 3.72, 3.74]
    },
    {
      id: 4,
      title: 'Average Order Value',
      value: '$127.45',
      change: '-2.1%',
      trend: 'down',
      target: '$135.00',
      completion: 94,
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      sparklineData: [130, 132, 128, 129, 131, 130, 128, 125, 127, 128, 126, 127]
    }
  ];

  // Mock department performance
  const departments = [
    { name: 'Sales', performance: 92, revenue: '$324,500', growth: '+15%' },
    { name: 'Marketing', performance: 87, revenue: '$189,200', growth: '+12%' },
    { name: 'Support', performance: 95, revenue: '$45,700', growth: '+8%' },
    { name: 'Development', performance: 89, revenue: '$287,900', growth: '+22%' },
    { name: 'Operations', performance: 91, revenue: '$156,300', growth: '+10%' }
  ];

  // Revenue chart data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 72000, 68000, 75000, 82000, 87000, 91000, 94000, 89000, 96000, 92000, 94000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Target',
        data: [70000, 70000, 75000, 75000, 80000, 80000, 85000, 85000, 90000, 90000, 95000, 95000],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };

  // Customer segments data
  const segmentData = {
    labels: ['Enterprise', 'Mid-Market', 'Small Business', 'Startup', 'Individual'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  // Performance radar data
  const performanceData = {
    labels: ['Sales', 'Customer Satisfaction', 'Product Quality', 'Delivery Time', 'Support Response', 'Innovation'],
    datasets: [
      {
        label: 'Current Quarter',
        data: [88, 92, 85, 90, 94, 82],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
      },
      {
        label: 'Previous Quarter',
        data: [82, 88, 80, 85, 90, 78],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.2)',
        pointBackgroundColor: 'rgb(156, 163, 175)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(156, 163, 175)'
      }
    ]
  };

  // Product performance data
  const productPerformance = [
    { name: 'Smart Building Platform', revenue: '$234,500', units: 156, growth: '+18%', margin: '42%' },
    { name: 'IoT Solutions', revenue: '$189,300', units: 423, growth: '+25%', margin: '38%' },
    { name: 'LLM Services', revenue: '$156,800', units: 89, growth: '+45%', margin: '65%' },
    { name: 'Hospital Management', revenue: '$142,200', units: 34, growth: '+12%', margin: '35%' },
    { name: 'Payment Gateway', revenue: '$124,500', units: 2847, growth: '+8%', margin: '28%' }
  ];

  // Activity timeline
  const activities = [
    { time: '2 min ago', event: 'New order received', details: 'Order #12847 - $458.00', type: 'order' },
    { time: '15 min ago', event: 'Customer milestone', details: '12,000 active customers reached', type: 'milestone' },
    { time: '1 hour ago', event: 'Support ticket resolved', details: 'Average response time: 3.2 minutes', type: 'support' },
    { time: '2 hours ago', event: 'Marketing campaign launched', details: 'Summer Sale 2024 - 25% off', type: 'marketing' },
    { time: '3 hours ago', event: 'System update completed', details: 'Version 2.4.1 deployed successfully', type: 'system' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Business Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights and analytics for your business</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => setSelectedMetric(kpi)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardDescription>{kpi.title}</CardDescription>
                    <CardTitle className="text-2xl font-bold">{kpi.value}</CardTitle>
                  </div>
                  <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  {kpi.trend === 'up' ? (
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {kpi.change}
                  </span>
                  <span className="text-muted-foreground text-sm">vs last period</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target</span>
                    <span>{kpi.target}</span>
                  </div>
                  <Progress value={kpi.completion} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 max-w-4xl mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Monthly revenue vs target</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Line
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        ticks: {
                          callback: function(value) {
                            return '$' + value.toLocaleString();
                          }
                        }
                      }
                    }
                  }}
                  height={300}
                />
              </CardContent>
            </Card>

            {/* Customer Segments */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Customer Segments</CardTitle>
                    <CardDescription>Revenue distribution by segment</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Doughnut
                  data={segmentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    }
                  }}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Key metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <motion.div
                    key={dept.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{dept.name}</h4>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">Revenue: {dept.revenue}</span>
                          <Badge variant={dept.growth.startsWith('+') ? 'default' : 'destructive'}>
                            {dept.growth}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={dept.performance} className="h-2" />
                      <span className="text-xs text-muted-foreground">Performance: {dept.performance}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="relative">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'order' ? 'bg-green-600' :
                        activity.type === 'milestone' ? 'bg-blue-600' :
                        activity.type === 'support' ? 'bg-yellow-600' :
                        activity.type === 'marketing' ? 'bg-purple-600' :
                        'bg-gray-600'
                      }`} />
                      {index < activities.length - 1 && (
                        <div className="absolute top-4 left-1 w-px h-full bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{activity.event}</p>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Funnel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sales Funnel</CardTitle>
                <CardDescription>Conversion rates at each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stage: 'Leads', count: '15,847', conversion: '100%', color: 'bg-blue-600' },
                    { stage: 'Qualified', count: '8,423', conversion: '53.1%', color: 'bg-indigo-600' },
                    { stage: 'Proposals', count: '3,156', conversion: '37.5%', color: 'bg-purple-600' },
                    { stage: 'Negotiation', count: '1,247', conversion: '39.5%', color: 'bg-pink-600' },
                    { stage: 'Closed Won', count: '487', conversion: '39.1%', color: 'bg-green-600' }
                  ].map((stage, index) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{stage.stage}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">{stage.count}</span>
                          <Badge variant="outline">{stage.conversion}</Badge>
                        </div>
                      </div>
                      <Progress 
                        value={parseInt(stage.conversion)} 
                        className="h-3"
                        style={{
                          '--progress-background': stage.color
                        } as any}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Sales Reps */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>This month's leaders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Sarah Johnson', sales: '$127,450', deals: 23, avatar: 'SJ' },
                    { name: 'Mike Chen', sales: '$118,230', deals: 21, avatar: 'MC' },
                    { name: 'Emily Davis', sales: '$105,890', deals: 19, avatar: 'ED' },
                    { name: 'John Smith', sales: '$98,470', deals: 17, avatar: 'JS' },
                    { name: 'Lisa Wang', sales: '$92,340', deals: 16, avatar: 'LW' }
                  ].map((rep, index) => (
                    <div key={rep.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold">{rep.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium">{rep.name}</p>
                          <p className="text-sm text-muted-foreground">{rep.deals} deals</p>
                        </div>
                      </div>
                      <span className="font-semibold">{rep.sales}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales by Region */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Region</CardTitle>
              <CardDescription>Geographic distribution of sales</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'],
                  datasets: [{
                    label: 'Sales',
                    data: [345000, 287000, 198000, 87000, 65000, 42000],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        }
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New vs returning customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                      {
                        label: 'New Customers',
                        data: [450, 520, 480, 590, 650, 720],
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.4
                      },
                      {
                        label: 'Returning Customers',
                        data: [1200, 1350, 1400, 1480, 1550, 1620],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Customer Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>NPS and satisfaction scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Net Promoter Score</span>
                      <span className="text-2xl font-bold text-green-600">72</span>
                    </div>
                    <Progress value={72} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Customer Satisfaction</span>
                      <span className="text-2xl font-bold text-blue-600">4.6/5</span>
                    </div>
                    <Progress value={92} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Support Response Time</span>
                      <span className="text-sm font-semibold">3.2 min avg</span>
                    </div>
                    <Progress value={85} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Segments Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Lifetime Value by Segment</CardTitle>
              <CardDescription>Average CLV across different customer segments</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels: ['Enterprise', 'Mid-Market', 'Small Business', 'Startup', 'Individual'],
                  datasets: [{
                    label: 'CLV',
                    data: [125000, 45000, 15000, 8000, 2500],
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(168, 85, 247, 0.8)',
                      'rgba(251, 146, 60, 0.8)',
                      'rgba(239, 68, 68, 0.8)'
                    ],
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        }
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Product Performance Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Product Performance</CardTitle>
                  <CardDescription>Sales metrics by product line</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Product</th>
                      <th className="text-right py-2">Revenue</th>
                      <th className="text-right py-2">Units Sold</th>
                      <th className="text-right py-2">Growth</th>
                      <th className="text-right py-2">Margin</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productPerformance.map((product, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3">{product.name}</td>
                        <td className="text-right py-3 font-medium">{product.revenue}</td>
                        <td className="text-right py-3">{product.units}</td>
                        <td className="text-right py-3">
                          <Badge variant={product.growth.startsWith('+') ? 'default' : 'destructive'}>
                            {product.growth}
                          </Badge>
                        </td>
                        <td className="text-right py-3">{product.margin}</td>
                        <td className="text-right py-3">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Product Mix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Product Category</CardTitle>
                <CardDescription>Contribution to total revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <Doughnut
                  data={{
                    labels: ['Software', 'Services', 'Hardware', 'Support', 'Training'],
                    datasets: [{
                      data: [45, 25, 15, 10, 5],
                      backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                      ],
                      borderWidth: 0
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Launch Timeline</CardTitle>
                <CardDescription>Upcoming product releases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { product: 'AI Assistant v2.0', date: 'Jul 15, 2024', status: 'On Track' },
                    { product: 'Mobile App Update', date: 'Aug 1, 2024', status: 'On Track' },
                    { product: 'Enterprise Suite', date: 'Sep 10, 2024', status: 'At Risk' },
                    { product: 'Analytics Dashboard', date: 'Oct 5, 2024', status: 'Planning' }
                  ].map((launch, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{launch.product}</p>
                        <p className="text-sm text-muted-foreground">{launch.date}</p>
                      </div>
                      <Badge variant={
                        launch.status === 'On Track' ? 'default' :
                        launch.status === 'At Risk' ? 'destructive' :
                        'secondary'
                      }>
                        {launch.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Company Performance Metrics</CardTitle>
                <CardDescription>Comparison with previous quarter</CardDescription>
              </CardHeader>
              <CardContent>
                <Radar
                  data={performanceData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100,
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Goal Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Goals Progress</CardTitle>
                <CardDescription>Track progress toward key objectives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { goal: 'Revenue Target', target: '$1M', current: '$847K', progress: 85 },
                    { goal: 'New Customers', target: '500', current: '423', progress: 85 },
                    { goal: 'Product Launches', target: '3', current: '2', progress: 67 },
                    { goal: 'Customer Satisfaction', target: '4.5', current: '4.6', progress: 102 },
                    { goal: 'Employee Retention', target: '95%', current: '92%', progress: 97 }
                  ].map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{goal.goal}</span>
                        <div className="text-sm">
                          <span className="font-semibold">{goal.current}</span>
                          <span className="text-muted-foreground"> / {goal.target}</span>
                        </div>
                      </div>
                      <Progress 
                        value={Math.min(goal.progress, 100)} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Overview</CardTitle>
              <CardDescription>Key metrics by team</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels: ['Sales', 'Marketing', 'Support', 'Development', 'Operations'],
                  datasets: [
                    {
                      label: 'Efficiency',
                      data: [92, 87, 95, 89, 91],
                      backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    },
                    {
                      label: 'Satisfaction',
                      data: [88, 91, 93, 85, 87],
                      backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    },
                    {
                      label: 'Productivity',
                      data: [90, 85, 91, 92, 88],
                      backgroundColor: 'rgba(168, 85, 247, 0.8)',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Monthly Revenue Report',
                description: 'Detailed revenue analysis for June 2024',
                date: 'Generated Jul 1, 2024',
                icon: DollarSign,
                color: 'text-green-600',
                bgColor: 'bg-green-100'
              },
              {
                title: 'Customer Analytics',
                description: 'Customer behavior and trends analysis',
                date: 'Generated Jun 28, 2024',
                icon: Users,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100'
              },
              {
                title: 'Product Performance',
                description: 'Q2 2024 product metrics and insights',
                date: 'Generated Jun 30, 2024',
                icon: Package,
                color: 'text-purple-600',
                bgColor: 'bg-purple-100'
              },
              {
                title: 'Sales Forecast',
                description: 'Q3 2024 sales predictions and targets',
                date: 'Generated Jul 2, 2024',
                icon: TrendingUp,
                color: 'text-orange-600',
                bgColor: 'bg-orange-100'
              },
              {
                title: 'Marketing ROI',
                description: 'Campaign performance and ROI analysis',
                date: 'Generated Jun 29, 2024',
                icon: Target,
                color: 'text-pink-600',
                bgColor: 'bg-pink-100'
              },
              {
                title: 'Operations Efficiency',
                description: 'Process optimization opportunities',
                date: 'Generated Jun 27, 2024',
                icon: Activity,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-100'
              }
            ].map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${report.bgColor}`}>
                        <report.icon className={`h-6 w-6 ${report.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription className="mt-1">{report.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{report.date}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Report</CardTitle>
              <CardDescription>Create a new report with custom parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue Analysis</SelectItem>
                    <SelectItem value="customer">Customer Insights</SelectItem>
                    <SelectItem value="product">Product Performance</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Metric Detail Modal */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMetric(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card p-6 rounded-lg shadow-lg max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{selectedMetric.title}</h3>
                  <p className="text-muted-foreground">Detailed analysis and trends</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMetric(null)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="text-2xl font-bold">{selectedMetric.value}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Target</p>
                    <p className="text-2xl font-bold">{selectedMetric.target}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Change</p>
                    <p className={`text-2xl font-bold ${selectedMetric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedMetric.change}
                    </p>
                  </div>
                </div>
                <div>
                  <Line
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                      datasets: [{
                        label: selectedMetric.title,
                        data: selectedMetric.sparklineData,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                      }]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                    height={200}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}