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
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  Bed,
  Utensils,
  Coffee,
  Wifi,
  Car,
  Shield,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Moon,
  Zap,
  Key,
  CreditCard,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Navigation,
  Heart,
  Sparkles,
  Bell,
  BellOff,
  Camera,
  Tv,
  Wine,
  Dumbbell,
  Waves,
  Trees,
  ShowerHead,
  Lightbulb,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Settings,
  Home,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  Plus,
  Minus,
  Edit,
  Trash2,
  Copy,
  Share2,
  Eye,
  EyeOff,
  Globe,
  Briefcase,
  Package,
  Gift,
  ShoppingBag,
  Receipt,
  QrCode,
  Smartphone,
  Tablet,
  Monitor,
  Headphones,
  Mic,
  Speaker,
  Battery,
  BatteryCharging,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Award,
  Trophy,
  Medal,
  Flag,
  Bookmark,
  Tag,
  Hash,
  Percent,
  DollarSign as Dollar,
  Euro,
  PoundSterling,
  Banknote,
  Coins,
  Wallet,
  ShoppingCart,
  Store,
  Building,
  Hotel,
  Tent,
  Mountain,
  Umbrella,
  CloudRain,
  CloudSnow,
  Cloud,
  Plane,
  Train,
  Bus,
  Ship,
  Anchor,
  Compass,
  Map,
  Milestone,
  Signpost,
  Info,
  HelpCircle,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Mock data for rooms
const mockRooms = [
  { id: 'R101', type: 'Standard', floor: 1, status: 'occupied', guest: 'Ahmed S.', checkIn: '2024-01-15', checkOut: '2024-01-18', rate: 180, occupancy: 2, maxOccupancy: 2, amenities: ['wifi', 'tv', 'minibar'], temperature: 22, humidity: 45, lastCleaned: '2 hours ago' },
  { id: 'R102', type: 'Standard', floor: 1, status: 'available', guest: null, checkIn: null, checkOut: null, rate: 180, occupancy: 0, maxOccupancy: 2, amenities: ['wifi', 'tv', 'minibar'], temperature: 21, humidity: 48, lastCleaned: '1 hour ago' },
  { id: 'R103', type: 'Deluxe', floor: 1, status: 'cleaning', guest: null, checkIn: null, checkOut: null, rate: 250, occupancy: 0, maxOccupancy: 3, amenities: ['wifi', 'tv', 'minibar', 'balcony'], temperature: 23, humidity: 50, lastCleaned: 'In progress' },
  { id: 'R201', type: 'Suite', floor: 2, status: 'occupied', guest: 'Sarah M.', checkIn: '2024-01-14', checkOut: '2024-01-20', rate: 450, occupancy: 3, maxOccupancy: 4, amenities: ['wifi', 'tv', 'minibar', 'balcony', 'jacuzzi', 'kitchen'], temperature: 22, humidity: 46, lastCleaned: '5 hours ago' },
  { id: 'R202', type: 'Deluxe', floor: 2, status: 'reserved', guest: 'Mohammed K.', checkIn: '2024-01-16', checkOut: '2024-01-19', rate: 250, occupancy: 0, maxOccupancy: 3, amenities: ['wifi', 'tv', 'minibar', 'balcony'], temperature: 21, humidity: 47, lastCleaned: '30 mins ago' },
  { id: 'R203', type: 'Suite', floor: 2, status: 'maintenance', guest: null, checkIn: null, checkOut: null, rate: 450, occupancy: 0, maxOccupancy: 4, amenities: ['wifi', 'tv', 'minibar', 'balcony', 'jacuzzi', 'kitchen'], temperature: 20, humidity: 52, lastCleaned: '1 day ago' },
  { id: 'R301', type: 'Presidential', floor: 3, status: 'occupied', guest: 'VIP Guest', checkIn: '2024-01-10', checkOut: '2024-01-25', rate: 1200, occupancy: 4, maxOccupancy: 6, amenities: ['wifi', 'tv', 'minibar', 'balcony', 'jacuzzi', 'kitchen', 'office', 'butler'], temperature: 21, humidity: 44, lastCleaned: '3 hours ago' },
  { id: 'R302', type: 'Suite', floor: 3, status: 'available', guest: null, checkIn: null, checkOut: null, rate: 450, occupancy: 0, maxOccupancy: 4, amenities: ['wifi', 'tv', 'minibar', 'balcony', 'jacuzzi', 'kitchen'], temperature: 22, humidity: 45, lastCleaned: '1 hour ago' }
];

// Mock guest requests
const mockGuestRequests = [
  { id: 'REQ001', room: 'R201', guest: 'Sarah M.', type: 'housekeeping', request: 'Extra towels needed', time: '10 mins ago', status: 'pending', priority: 'medium' },
  { id: 'REQ002', room: 'R301', guest: 'VIP Guest', type: 'room-service', request: 'Dinner for 4 at 8 PM', time: '25 mins ago', status: 'in-progress', priority: 'high' },
  { id: 'REQ003', room: 'R101', guest: 'Ahmed S.', type: 'maintenance', request: 'AC not cooling properly', time: '1 hour ago', status: 'assigned', priority: 'high' },
  { id: 'REQ004', room: 'R201', guest: 'Sarah M.', type: 'concierge', request: 'Restaurant reservation for tomorrow', time: '2 hours ago', status: 'completed', priority: 'low' }
];

// Mock restaurant data
const mockRestaurantData = {
  tables: [
    { id: 'T01', capacity: 2, status: 'occupied', reservation: 'Walk-in', time: '18:30' },
    { id: 'T02', capacity: 4, status: 'available', reservation: null, time: null },
    { id: 'T03', capacity: 4, status: 'reserved', reservation: 'Ahmed K.', time: '19:00' },
    { id: 'T04', capacity: 6, status: 'occupied', reservation: 'Sarah M.', time: '18:00' },
    { id: 'T05', capacity: 2, status: 'cleaning', reservation: null, time: null },
    { id: 'T06', capacity: 8, status: 'available', reservation: null, time: null }
  ],
  orders: [
    { table: 'T01', items: 3, total: 125, status: 'preparing' },
    { table: 'T04', items: 8, total: 340, status: 'served' }
  ]
};

export default function HospitalityHubEnhanced() {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [roomFilter, setRoomFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Room status statistics
  const roomStats = {
    total: mockRooms.length,
    occupied: mockRooms.filter(r => r.status === 'occupied').length,
    available: mockRooms.filter(r => r.status === 'available').length,
    cleaning: mockRooms.filter(r => r.status === 'cleaning').length,
    reserved: mockRooms.filter(r => r.status === 'reserved').length,
    maintenance: mockRooms.filter(r => r.status === 'maintenance').length
  };

  const occupancyRate = Math.round((roomStats.occupied / roomStats.total) * 100);

  // Revenue data for charts
  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Room Revenue',
        data: [12500, 14200, 13800, 15600, 16200, 18900, 17500],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'F&B Revenue',
        data: [4500, 5200, 4800, 5600, 6200, 7900, 6500],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      },
      {
        label: 'Other Services',
        data: [1500, 1800, 1600, 2100, 2400, 2900, 2200],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Guest satisfaction metrics
  const satisfactionData = {
    labels: ['Cleanliness', 'Service', 'Comfort', 'Location', 'Value', 'Facilities'],
    datasets: [{
      label: 'Current Month',
      data: [94, 92, 88, 95, 86, 90],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)'
    }, {
      label: 'Previous Month',
      data: [91, 89, 85, 95, 84, 87],
      borderColor: 'rgb(156, 163, 175)',
      backgroundColor: 'rgba(156, 163, 175, 0.1)'
    }]
  };

  // Occupancy trends
  const occupancyTrends = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Occupancy Rate',
      data: [78, 82, 85, 88, 92, 94, 96, 95, 91, 87, 84, 89],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4
    }]
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400';
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400';
      case 'reserved': return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400';
      case 'maintenance': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'Standard': return <Bed className="h-5 w-5" />;
      case 'Deluxe': return <Home className="h-5 w-5" />;
      case 'Suite': return <Building className="h-5 w-5" />;
      case 'Presidential': return <Crown className="h-5 w-5" />;
      default: return <Hotel className="h-5 w-5" />;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'tv': return <Tv className="h-4 w-4" />;
      case 'minibar': return <Wine className="h-4 w-4" />;
      case 'balcony': return <Trees className="h-4 w-4" />;
      case 'jacuzzi': return <Waves className="h-4 w-4" />;
      case 'kitchen': return <Utensils className="h-4 w-4" />;
      case 'office': return <Briefcase className="h-4 w-4" />;
      case 'butler': return <UserCheck className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredRooms = mockRooms.filter(room => {
    const matchesFilter = roomFilter === 'all' || room.status === roomFilter;
    const matchesSearch = room.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (room.guest && room.guest.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Add Crown icon fallback
  const Crown = () => <Trophy className="h-5 w-5" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Hospitality Hub
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered hospitality management with IoT integration
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                  <p className="text-3xl font-bold">{occupancyRate}%</p>
                  <Progress value={occupancyRate} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">{roomStats.occupied} of {roomStats.total} rooms</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Hotel className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Today</p>
                  <p className="text-3xl font-bold">$45,680</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +12% vs yesterday
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Guest Satisfaction</p>
                  <p className="text-3xl font-bold">4.8</p>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on 234 reviews</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Requests</p>
                  <p className="text-3xl font-bold">7</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400">
                      <Clock className="mr-1 h-3 w-3" />
                      3 urgent
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="guests">Guests</TabsTrigger>
              <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Room Status Grid */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Room Status Overview</CardTitle>
                    <CardDescription>Real-time room availability and status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                        <p className="text-3xl font-bold text-blue-600">{roomStats.occupied}</p>
                        <p className="text-sm text-muted-foreground">Occupied</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/50">
                        <p className="text-3xl font-bold text-green-600">{roomStats.available}</p>
                        <p className="text-sm text-muted-foreground">Available</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/50">
                        <p className="text-3xl font-bold text-yellow-600">{roomStats.cleaning}</p>
                        <p className="text-sm text-muted-foreground">Cleaning</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/50">
                        <p className="text-3xl font-bold text-purple-600">{roomStats.reserved}</p>
                        <p className="text-sm text-muted-foreground">Reserved</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/50">
                        <p className="text-3xl font-bold text-red-600">{roomStats.maintenance}</p>
                        <p className="text-sm text-muted-foreground">Maintenance</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-950/50">
                        <p className="text-3xl font-bold text-gray-600">{roomStats.total}</p>
                        <p className="text-sm text-muted-foreground">Total Rooms</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Guest Requests */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Recent Guest Requests</CardTitle>
                    <CardDescription>Active service requests from guests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockGuestRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              request.type === 'housekeeping' ? 'bg-blue-100 dark:bg-blue-950' :
                              request.type === 'room-service' ? 'bg-green-100 dark:bg-green-950' :
                              request.type === 'maintenance' ? 'bg-orange-100 dark:bg-orange-950' :
                              'bg-purple-100 dark:bg-purple-950'
                            }`}>
                              {request.type === 'housekeeping' && <ShowerHead className="h-4 w-4 text-blue-600" />}
                              {request.type === 'room-service' && <Utensils className="h-4 w-4 text-green-600" />}
                              {request.type === 'maintenance' && <Settings className="h-4 w-4 text-orange-600" />}
                              {request.type === 'concierge' && <UserCheck className="h-4 w-4 text-purple-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{request.room} - {request.guest}</p>
                                <Badge className={
                                  request.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }>
                                  {request.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{request.request}</p>
                              <p className="text-xs text-muted-foreground mt-1">{request.time}</p>
                            </div>
                          </div>
                          <Badge className={
                            request.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                            request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {request.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Chart */}
                <Card className="glass border-0 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Daily revenue breakdown by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Line
                      data={revenueData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
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
              </div>
            </TabsContent>

            {/* Rooms Tab */}
            <TabsContent value="rooms" className="space-y-4">
              {/* Room Filters */}
              <Card className="glass border-0">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search rooms, guests..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={roomFilter} onValueChange={setRoomFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Rooms</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      More Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Room Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                          onClick={() => setSelectedRoom(room)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getRoomTypeIcon(room.type)}
                            <div>
                              <h3 className="font-semibold">{room.id}</h3>
                              <p className="text-sm text-muted-foreground">{room.type} Room</p>
                            </div>
                          </div>
                          <Badge className={getRoomStatusColor(room.status)}>
                            {room.status}
                          </Badge>
                        </div>

                        {room.guest && (
                          <div className="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                            <p className="text-sm font-medium">{room.guest}</p>
                            <p className="text-xs text-muted-foreground">
                              Check-in: {room.checkIn} • Check-out: {room.checkOut}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Rate</p>
                            <p className="font-semibold">${room.rate}/night</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Occupancy</p>
                            <p className="font-semibold">{room.occupancy}/{room.maxOccupancy}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Temperature</p>
                            <p className="font-semibold">{room.temperature}°C</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Humidity</p>
                            <p className="font-semibold">{room.humidity}%</p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Amenities</p>
                          <div className="flex flex-wrap gap-1">
                            {room.amenities.map((amenity) => (
                              <div key={amenity} className="p-1 rounded bg-gray-100 dark:bg-gray-800">
                                {getAmenityIcon(amenity)}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>Last cleaned: {room.lastCleaned}</span>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Guests Tab */}
            <TabsContent value="guests" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Guest Satisfaction */}
                <Card className="glass border-0 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Guest Satisfaction Metrics</CardTitle>
                    <CardDescription>Monthly comparison of key satisfaction areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Radar
                      data={satisfactionData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                          },
                        },
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Recent Reviews */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Recent Reviews</CardTitle>
                    <CardDescription>Latest guest feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { guest: 'Sarah M.', rating: 5, comment: 'Amazing smart room features!', time: '2 hours ago' },
                        { guest: 'Ahmed K.', rating: 4, comment: 'Great service, loved the app', time: '5 hours ago' },
                        { guest: 'Lisa R.', rating: 5, comment: 'Perfect temperature control', time: '1 day ago' },
                        { guest: 'John D.', rating: 4, comment: 'Very clean and modern', time: '2 days ago' }
                      ].map((review, index) => (
                        <div key={index} className="p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm">{review.guest}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-1">{review.time}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* VIP Guests */}
                <Card className="glass border-0 shadow-lg lg:col-span-3">
                  <CardHeader>
                    <CardTitle>VIP Guest Management</CardTitle>
                    <CardDescription>Premium guests requiring special attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { 
                          name: 'VIP Guest', 
                          room: 'R301', 
                          type: 'Presidential Suite',
                          preferences: ['Butler Service', 'Late Checkout', 'Private Dining'],
                          requests: 3,
                          loyalty: 'Diamond',
                          spending: '$45,000'
                        },
                        { 
                          name: 'Sarah M.', 
                          room: 'R201', 
                          type: 'Suite',
                          preferences: ['Gym Access', 'Spa', 'Room Service'],
                          requests: 1,
                          loyalty: 'Gold',
                          spending: '$12,000'
                        }
                      ].map((vip, index) => (
                        <Card key={index} className="border-2 border-yellow-200 dark:border-yellow-800">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold">{vip.name}</h4>
                                <p className="text-sm text-muted-foreground">{vip.room} - {vip.type}</p>
                              </div>
                              <Badge className="bg-yellow-100 text-yellow-800">
                                {vip.loyalty}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-muted-foreground">Preferences</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {vip.preferences.map((pref) => (
                                    <Badge key={pref} variant="secondary" className="text-xs">
                                      {pref}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Active Requests</span>
                                <span className="font-medium">{vip.requests}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Spending</span>
                                <span className="font-medium text-green-600">{vip.spending}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Restaurant Tab */}
            <TabsContent value="restaurant" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Table Management */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Table Management</CardTitle>
                    <CardDescription>Real-time restaurant floor status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {mockRestaurantData.tables.map((table) => (
                        <div
                          key={table.id}
                          className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all ${
                            table.status === 'occupied' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50' :
                            table.status === 'available' ? 'border-green-500 bg-green-50 dark:bg-green-950/50' :
                            table.status === 'reserved' ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50' :
                            'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/50'
                          }`}
                        >
                          <h4 className="font-semibold">{table.id}</h4>
                          <p className="text-sm text-muted-foreground">Seats {table.capacity}</p>
                          <Badge className={`mt-2 ${
                            table.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                            table.status === 'available' ? 'bg-green-100 text-green-800' :
                            table.status === 'reserved' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {table.status}
                          </Badge>
                          {table.reservation && (
                            <p className="text-xs mt-1">{table.reservation}</p>
                          )}
                          {table.time && (
                            <p className="text-xs text-muted-foreground">{table.time}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Menu Performance */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Menu Performance</CardTitle>
                    <CardDescription>Top performing dishes today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { dish: 'Grilled Salmon', orders: 34, revenue: 1020, trend: 'up' },
                        { dish: 'Caesar Salad', orders: 28, revenue: 420, trend: 'up' },
                        { dish: 'Beef Steak', orders: 22, revenue: 880, trend: 'down' },
                        { dish: 'Pasta Carbonara', orders: 19, revenue: 380, trend: 'stable' },
                        { dish: 'Dessert Platter', orders: 16, revenue: 240, trend: 'up' }
                      ].map((item) => (
                        <div key={item.dish} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">{item.dish}</p>
                            <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${item.revenue}</p>
                            <div className="flex items-center justify-end gap-1">
                              {item.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                              {item.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                              {item.trend === 'stable' && <Minus className="h-3 w-3 text-gray-600" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Kitchen Status */}
                <Card className="glass border-0 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Kitchen Operations</CardTitle>
                    <CardDescription>Real-time kitchen performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/50">
                        <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold">18 min</p>
                        <p className="text-sm text-muted-foreground">Avg. Prep Time</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/50">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold">142</p>
                        <p className="text-sm text-muted-foreground">Orders Complete</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                        <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-sm text-muted-foreground">Active Orders</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/50">
                        <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold">6</p>
                        <p className="text-sm text-muted-foreground">Staff On Duty</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Occupancy Trends */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Occupancy Trends</CardTitle>
                    <CardDescription>12-month occupancy rate analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Line
                      data={occupancyTrends}
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
                            max: 100,
                            ticks: {
                              callback: function(value) {
                                return value + '%';
                              }
                            }
                          }
                        }
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Revenue Breakdown */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Revenue Sources</CardTitle>
                    <CardDescription>Monthly revenue by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Doughnut
                      data={{
                        labels: ['Rooms', 'F&B', 'Spa', 'Other Services'],
                        datasets: [{
                          data: [65, 20, 10, 5],
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(168, 85, 247, 0.8)',
                            'rgba(251, 146, 60, 0.8)'
                          ]
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'right' as const,
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Predictive Analytics */}
                <Card className="glass border-0 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle>AI-Powered Insights</CardTitle>
                    <CardDescription>Predictive analytics and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          type: 'prediction',
                          title: 'Weekend Occupancy Forecast',
                          description: 'Expected 95% occupancy this weekend based on booking patterns',
                          confidence: 92,
                          action: 'Optimize staffing schedules',
                          impact: '+$8,500 potential revenue'
                        },
                        {
                          type: 'optimization',
                          title: 'Dynamic Pricing Opportunity',
                          description: 'Increase rates by 15% for next week due to high demand',
                          confidence: 88,
                          action: 'Update pricing strategy',
                          impact: '+$12,000 additional revenue'
                        },
                        {
                          type: 'maintenance',
                          title: 'Preventive Maintenance Alert',
                          description: 'HVAC system in R203 showing irregular patterns',
                          confidence: 85,
                          action: 'Schedule inspection',
                          impact: 'Prevent $2,000 emergency repair'
                        },
                        {
                          type: 'guest',
                          title: 'Guest Experience Enhancement',
                          description: 'Spa bookings correlate with 20% higher satisfaction',
                          confidence: 94,
                          action: 'Promote spa packages',
                          impact: '+0.3 rating improvement'
                        }
                      ].map((insight, index) => (
                        <Card key={index} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {insight.type === 'prediction' && <Target className="h-5 w-5 text-blue-600" />}
                                {insight.type === 'optimization' && <TrendingUp className="h-5 w-5 text-green-600" />}
                                {insight.type === 'maintenance' && <Settings className="h-5 w-5 text-orange-600" />}
                                {insight.type === 'guest' && <Heart className="h-5 w-5 text-purple-600" />}
                                <h4 className="font-semibold">{insight.title}</h4>
                              </div>
                              <Badge variant="secondary">{insight.confidence}% confidence</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-green-600 font-medium">{insight.impact}</p>
                              <Button size="sm" variant="outline">
                                {insight.action}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Smart Hospitality Settings</CardTitle>
                  <CardDescription>Configure IoT integrations and automation rules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Room Automation</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-climate">Automatic Climate Control</Label>
                          <p className="text-sm text-muted-foreground">Adjust temperature based on occupancy</p>
                        </div>
                        <Switch id="auto-climate" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="smart-lighting">Smart Lighting</Label>
                          <p className="text-sm text-muted-foreground">Automated lighting based on time and presence</p>
                        </div>
                        <Switch id="smart-lighting" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="voice-control">Voice Control</Label>
                          <p className="text-sm text-muted-foreground">Enable voice commands for room controls</p>
                        </div>
                        <Switch id="voice-control" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Guest Services</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="mobile-checkin">Mobile Check-in</Label>
                          <p className="text-sm text-muted-foreground">Allow guests to check in via mobile app</p>
                        </div>
                        <Switch id="mobile-checkin" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="digital-key">Digital Room Keys</Label>
                          <p className="text-sm text-muted-foreground">Enable smartphone room access</p>
                        </div>
                        <Switch id="digital-key" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="ai-concierge">AI Concierge</Label>
                          <p className="text-sm text-muted-foreground">24/7 AI-powered guest assistance</p>
                        </div>
                        <Switch id="ai-concierge" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Analytics & Reporting</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="real-time">Real-time Dashboard</Label>
                          <p className="text-sm text-muted-foreground">Live updates every 5 seconds</p>
                        </div>
                        <Switch id="real-time" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="predictive">Predictive Analytics</Label>
                          <p className="text-sm text-muted-foreground">AI-powered forecasting and insights</p>
                        </div>
                        <Switch id="predictive" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Room Details Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRoom(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {getRoomTypeIcon(selectedRoom.type)}
                    <div>
                      <h2 className="text-2xl font-bold">{selectedRoom.id} - {selectedRoom.type}</h2>
                      <p className="text-muted-foreground">Floor {selectedRoom.floor}</p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setSelectedRoom(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Room Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge className={getRoomStatusColor(selectedRoom.status)}>
                            {selectedRoom.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Rate</span>
                          <span className="font-semibold">${selectedRoom.rate}/night</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Guest Information */}
                  {selectedRoom.guest && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Guest Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Guest Name</span>
                            <span className="font-medium">{selectedRoom.guest}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-in</span>
                            <span className="font-medium">{selectedRoom.checkIn}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-out</span>
                            <span className="font-medium">{selectedRoom.checkOut}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Occupancy</span>
                            <span className="font-medium">{selectedRoom.occupancy}/{selectedRoom.maxOccupancy} guests</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* IoT Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle>IoT Room Controls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Temperature</Label>
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-orange-600" />
                            <span className="font-semibold">{selectedRoom.temperature}°C</span>
                            <div className="flex gap-1 ml-auto">
                              <Button size="sm" variant="outline">
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Humidity</Label>
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold">{selectedRoom.humidity}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Room Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Key className="mr-2 h-4 w-4" />
                      Generate Digital Key
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <ShowerHead className="mr-2 h-4 w-4" />
                      Request Cleaning
                    </Button>
                    <Button variant="outline">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}