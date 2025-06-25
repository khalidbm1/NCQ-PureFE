import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  Activity,
  AlertCircle,
  CheckCircle,
  Star,
  MessageSquare,
  Eye,
  Download,
  Filter,
  Plus,
  Edit,
  Search,
  Shield,
  Zap,
  Thermometer
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

// Mock data for business dashboard
const businessMetrics = {
  totalRevenue: 156780,
  monthlyGrowth: 12.5,
  totalBookings: 542,
  avgRating: 4.8,
  occupancyRate: 87,
  customerSatisfaction: 94
};

const recentBookings = [
  { id: 1, customer: 'Ahmed Al-Rashid', service: 'Luxury Suite', amount: 450, date: '2024-06-24', status: 'confirmed', rating: 5 },
  { id: 2, customer: 'Sarah Mitchell', service: 'Fine Dining', amount: 120, date: '2024-06-24', status: 'completed', rating: 4 },
  { id: 3, customer: 'Mohammed Hassan', service: 'Desert Safari', amount: 200, date: '2024-06-23', status: 'pending', rating: null },
  { id: 4, customer: 'Lisa Rodriguez', service: 'Spa Package', amount: 180, date: '2024-06-23', status: 'confirmed', rating: 5 },
  { id: 5, customer: 'Omar Khalil', service: 'Conference Room', amount: 350, date: '2024-06-22', status: 'completed', rating: 4 }
];

const revenueData = [
  { source: 'Room Bookings', amount: 89420, percentage: 57, trend: '+8%' },
  { source: 'Restaurant', amount: 34560, percentage: 22, trend: '+15%' },
  { source: 'Event Hosting', amount: 23800, percentage: 15, trend: '+12%' },
  { source: 'Additional Services', amount: 9000, percentage: 6, trend: '+5%' }
];

const inventory = [
  { id: 1, name: 'Luxury Suites', available: 12, total: 15, revenue: 45000, bookingRate: 80 },
  { id: 2, name: 'Standard Rooms', available: 8, total: 25, revenue: 32000, bookingRate: 68 },
  { id: 3, name: 'Conference Halls', available: 2, total: 3, revenue: 15000, bookingRate: 67 },
  { id: 4, name: 'Restaurant Tables', available: 15, total: 40, revenue: 28000, bookingRate: 62 }
];

const customerReviews = [
  {
    id: 1,
    customer: 'Ahmed K.',
    rating: 5,
    comment: 'Amazing smart room controls and excellent service!',
    service: 'Luxury Suite',
    date: '2024-06-23',
    verified: true
  },
  {
    id: 2,
    customer: 'Sarah M.',
    rating: 4,
    comment: 'Great atmosphere and delicious food. Will come back!',
    service: 'Restaurant',
    date: '2024-06-22',
    verified: true
  },
  {
    id: 3,
    customer: 'Mohammed R.',
    rating: 5,
    comment: 'Perfect venue for our corporate event.',
    service: 'Conference Hall',
    date: '2024-06-21',
    verified: true
  }
];

const iotSensors = [
  { name: 'Temperature Control', value: '22.5°C', status: 'optimal', efficiency: 96, location: 'Main Building' },
  { name: 'Energy Monitoring', value: '847 kW', status: 'efficient', efficiency: 94, location: 'Entire Property' },
  { name: 'Security System', value: 'All Clear', status: 'secure', efficiency: 100, location: 'All Areas' },
  { name: 'Air Quality', value: 'Excellent', status: 'healthy', efficiency: 98, location: 'Indoor Spaces' }
];

const alerts = [
  { id: 1, type: 'warning', message: 'AC unit in Room 204 needs maintenance', time: '2 hours ago', priority: 'medium' },
  { id: 2, type: 'info', message: 'High demand predicted for weekend - consider dynamic pricing', time: '4 hours ago', priority: 'low' },
  { id: 3, type: 'success', message: 'Energy efficiency improved by 3% this week', time: '1 day ago', priority: 'low' },
  { id: 4, type: 'error', message: 'Payment gateway integration needs attention', time: '2 days ago', priority: 'high' }
];

export default function BusinessDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [liveMetrics, setLiveMetrics] = useState(businessMetrics);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 1000),
        totalBookings: prev.totalBookings + Math.floor(Math.random() * 3)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Business Owner Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your hospitality business with real-time insights and AI-powered analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${liveMetrics.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{liveMetrics.monthlyGrowth}% from last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-600">{liveMetrics.totalBookings}</p>
                <p className="text-sm text-blue-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +23 this week
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{liveMetrics.avgRating}★</p>
                <p className="text-sm text-yellow-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +0.2 this month
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                <p className="text-2xl font-bold text-purple-600">{liveMetrics.occupancyRate}%</p>
                <p className="text-sm text-purple-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% from last week
                </p>
              </div>
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="iot">IoT Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Revenue Breakdown */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Today's revenue by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.map((item) => (
                    <div key={item.source} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">${item.amount.toLocaleString()}</span>
                          <span className="text-xs text-green-600">{item.trend}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your business efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Room
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Update Pricing
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Customer Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Business Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest customer reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{booking.customer}</p>
                        <p className="text-xs text-muted-foreground">{booking.service}</p>
                        <p className="text-xs text-muted-foreground">{booking.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${booking.amount}</p>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>Recent customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerReviews.map((review) => (
                    <div key={review.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{review.customer}</span>
                          {review.verified && <CheckCircle className="w-3 h-3 text-green-500" />}
                        </div>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{review.comment}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{review.service}</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Booking Management</CardTitle>
                  <CardDescription>Manage all customer reservations</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-1" />
                    Search
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.customer}</p>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                        <p className="text-xs text-muted-foreground">{booking.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-green-600">${booking.amount}</p>
                        {booking.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{booking.rating}</span>
                          </div>
                        )}
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>Monitor availability and performance</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Inventory
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {inventory.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">{item.name}</h3>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Availability</span>
                        <span className="text-sm font-medium">{item.available} / {item.total}</span>
                      </div>
                      
                      <Progress value={(item.available / item.total) * 100} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Revenue</span>
                          <p className="font-bold text-green-600">${item.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Booking Rate</span>
                          <p className="font-bold text-blue-600">{item.bookingRate}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Business performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-bold text-green-600">{liveMetrics.customerSatisfaction}%</span>
                  </div>
                  <Progress value={liveMetrics.customerSatisfaction} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Occupancy Rate</span>
                    <span className="font-bold text-blue-600">{liveMetrics.occupancyRate}%</span>
                  </div>
                  <Progress value={liveMetrics.occupancyRate} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Repeat Customers</span>
                    <span className="font-bold text-purple-600">72%</span>
                  </div>
                  <Progress value={72} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: 'June 2024', revenue: 156780, growth: 12.5 },
                    { month: 'May 2024', revenue: 139420, growth: 8.3 },
                    { month: 'April 2024', revenue: 128650, growth: 5.2 },
                    { month: 'March 2024', revenue: 122190, growth: 3.1 }
                  ].map((data) => (
                    <div key={data.month} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{data.month}</p>
                        <p className="text-xs text-muted-foreground">+{data.growth}% growth</p>
                      </div>
                      <p className="font-bold">${data.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="iot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IoT System Control</CardTitle>
              <CardDescription>Monitor and control smart building systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {iotSensors.map((sensor) => (
                  <div key={sensor.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {sensor.name.includes('Temperature') && <Thermometer className="w-4 h-4 text-orange-500" />}
                        {sensor.name.includes('Energy') && <Zap className="w-4 h-4 text-yellow-500" />}
                        {sensor.name.includes('Security') && <Shield className="w-4 h-4 text-green-500" />}
                        {sensor.name.includes('Air') && <Activity className="w-4 h-4 text-blue-500" />}
                        <span className="font-medium text-sm">{sensor.name}</span>
                      </div>
                      <Badge className={`${
                        sensor.status === 'optimal' || sensor.status === 'secure' || sensor.status === 'healthy' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {sensor.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">{sensor.value}</span>
                        <span className="text-xs text-muted-foreground">{sensor.efficiency}% efficiency</span>
                      </div>
                      
                      <Progress value={sensor.efficiency} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{sensor.location}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                            Control
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                            Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications and maintenance alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                        <Badge variant="outline" className="text-xs">
                          {alert.priority} priority
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}