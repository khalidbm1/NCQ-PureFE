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
  Wifi,
  Zap,
  Thermometer,
  Shield,
  Activity,
  Database,
  Settings,
  Smartphone,
  Router,
  Cpu,
  HardDrive,
  Server,
  Cloud,
  Radio,
  Bluetooth,
  Cast,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Camera,
  Mic,
  Speaker,
  Lightbulb,
  Fan,
  Wind,
  Droplets,
  Sun,
  Moon,
  Gauge,
  AlertCircle,
  CheckCircle,
  Clock,
  Timer,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Terminal,
  Code,
  Package,
  Layers,
  Grid,
  Layout,
  Map,
  MapPin,
  Navigation,
  Compass,
  Globe,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Edit,
  Trash2,
  Copy,
  Share2,
  Bell,
  BellOff,
  Lock,
  Unlock,
  Eye,
  EyeOff
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

// Mock data for devices
const mockDevices = [
  { id: 'DEV001', name: 'Temperature Sensor A1', type: 'temperature', location: 'Building A - Floor 1', status: 'online', battery: 85, signal: 'high', lastSeen: '2 mins ago', data: { value: 23.5, unit: '°C' } },
  { id: 'DEV002', name: 'Smart Meter B2', type: 'power', location: 'Building B - Floor 2', status: 'online', battery: 92, signal: 'medium', lastSeen: '1 min ago', data: { value: 1245, unit: 'kWh' } },
  { id: 'DEV003', name: 'Security Camera C3', type: 'camera', location: 'Parking Area', status: 'online', battery: 100, signal: 'high', lastSeen: '30 secs ago', data: { recording: true, storage: '78%' } },
  { id: 'DEV004', name: 'Motion Sensor D4', type: 'motion', location: 'Lobby', status: 'offline', battery: 12, signal: 'zero', lastSeen: '1 hour ago', data: { detected: false } },
  { id: 'DEV005', name: 'Air Quality Monitor E5', type: 'air', location: 'Office Area', status: 'online', battery: 67, signal: 'high', lastSeen: '5 mins ago', data: { aqi: 42, pm25: 12, co2: 420 } },
  { id: 'DEV006', name: 'Smart Light F6', type: 'light', location: 'Conference Room', status: 'online', battery: 100, signal: 'high', lastSeen: '10 secs ago', data: { brightness: 75, color: '#ffffff' } },
  { id: 'DEV007', name: 'Water Flow Sensor G7', type: 'water', location: 'Basement', status: 'warning', battery: 45, signal: 'low', lastSeen: '15 mins ago', data: { flow: 12.3, unit: 'L/min' } },
  { id: 'DEV008', name: 'HVAC Controller H8', type: 'hvac', location: 'Building A', status: 'online', battery: 100, signal: 'high', lastSeen: '1 min ago', data: { temp: 22, humidity: 45 } }
];

// Mock workflow templates
const workflowTemplates = [
  { id: 'WF001', name: 'Energy Optimization', description: 'Automatically adjust lighting and HVAC based on occupancy', devices: 12, triggers: 5, actions: 8, status: 'active' },
  { id: 'WF002', name: 'Security Alert', description: 'Send notifications when motion detected after hours', devices: 24, triggers: 3, actions: 4, status: 'active' },
  { id: 'WF003', name: 'Predictive Maintenance', description: 'Alert when device battery or performance drops', devices: 156, triggers: 8, actions: 12, status: 'active' },
  { id: 'WF004', name: 'Water Leak Detection', description: 'Shut off water and alert on leak detection', devices: 8, triggers: 2, actions: 3, status: 'draft' }
];

export default function IoTPlatformEnhanced() {
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('devices');

  // Device status metrics
  const deviceMetrics = {
    total: 1847,
    online: 1654,
    offline: 89,
    warning: 104,
    types: {
      sensors: 892,
      actuators: 456,
      gateways: 124,
      controllers: 375
    }
  };

  // Real-time data for charts
  const realtimeData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
      {
        label: 'Data Points',
        data: [1200, 1450, 1890, 2200, 2100, 1950, 1800],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Active Devices',
        data: [1580, 1590, 1610, 1654, 1645, 1638, 1654],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Device type distribution
  const deviceTypeData = {
    labels: ['Temperature', 'Power', 'Security', 'Motion', 'Air Quality', 'Lighting', 'Water', 'HVAC'],
    datasets: [{
      data: [345, 289, 198, 167, 145, 234, 98, 121],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(250, 204, 21, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ]
    }]
  };

  // Network performance data
  const networkPerformanceData = {
    labels: ['Latency', 'Throughput', 'Packet Loss', 'Uptime', 'Coverage', 'Security'],
    datasets: [{
      label: 'Current',
      data: [92, 88, 95, 99.9, 87, 94],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)'
    }, {
      label: 'Target',
      data: [95, 90, 98, 99.99, 90, 95],
      borderColor: 'rgb(156, 163, 175)',
      backgroundColor: 'rgba(156, 163, 175, 0.1)'
    }]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400';
      case 'offline': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'high': return <SignalHigh className="h-4 w-4 text-green-600" />;
      case 'medium': return <SignalMedium className="h-4 w-4 text-yellow-600" />;
      case 'low': return <SignalLow className="h-4 w-4 text-orange-600" />;
      case 'zero': return <SignalZero className="h-4 w-4 text-red-600" />;
      default: return <Signal className="h-4 w-4 text-gray-400" />;
    }
  };

  const getBatteryIcon = (level: number) => {
    if (level > 80) return <BatteryFull className="h-4 w-4 text-green-600" />;
    if (level > 50) return <BatteryMedium className="h-4 w-4 text-yellow-600" />;
    if (level > 20) return <BatteryLow className="h-4 w-4 text-orange-600" />;
    return <Battery className="h-4 w-4 text-red-600" />;
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <Thermometer className="h-5 w-5" />;
      case 'power': return <Zap className="h-5 w-5" />;
      case 'camera': return <Camera className="h-5 w-5" />;
      case 'motion': return <Radio className="h-5 w-5" />;
      case 'air': return <Wind className="h-5 w-5" />;
      case 'light': return <Lightbulb className="h-5 w-5" />;
      case 'water': return <Droplets className="h-5 w-5" />;
      case 'hvac': return <Fan className="h-5 w-5" />;
      default: return <Cpu className="h-5 w-5" />;
    }
  };

  const filteredDevices = mockDevices.filter(device => {
    const matchesFilter = deviceFilter === 'all' || device.status === deviceFilter;
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              IoT Platform
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive device management and analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </div>
        </motion.div>

        {/* Metrics Overview */}
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
                  <p className="text-sm text-muted-foreground">Total Devices</p>
                  <p className="text-3xl font-bold">{deviceMetrics.total.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +127 this week
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Wifi className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Online Devices</p>
                  <p className="text-3xl font-bold text-green-600">{deviceMetrics.online.toLocaleString()}</p>
                  <Progress value={89.5} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">89.5% online rate</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Data Points/Day</p>
                  <p className="text-3xl font-bold">2.1M</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <Activity className="mr-1 h-3 w-3" />
                      Real-time
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                  <p className="text-3xl font-bold">99.9%</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400">
                      <Shield className="mr-1 h-3 w-3" />
                      Stable
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Devices Tab */}
            <TabsContent value="devices" className="space-y-4">
              {/* Device Filters */}
              <Card className="glass border-0">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search devices..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Devices</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      More Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Device Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredDevices.map((device, index) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                          onClick={() => setSelectedDevice(device)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              {getDeviceIcon(device.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{device.name}</h3>
                                <Badge className={getStatusColor(device.status)}>
                                  {device.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{device.location}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                  {getSignalIcon(device.signal)}
                                  <span className="text-xs text-muted-foreground">Signal</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {getBatteryIcon(device.battery)}
                                  <span className="text-xs text-muted-foreground">{device.battery}%</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Last seen: {device.lastSeen}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                        {/* Device Data Preview */}
                        <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                          {device.type === 'temperature' && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Temperature</span>
                              <span className="font-semibold">{device.data.value}{device.data.unit}</span>
                            </div>
                          )}
                          {device.type === 'power' && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Energy Usage</span>
                              <span className="font-semibold">{device.data.value} {device.data.unit}</span>
                            </div>
                          )}
                          {device.type === 'camera' && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Status</span>
                              <div className="flex items-center gap-2">
                                {device.data.recording && (
                                  <Badge variant="destructive" className="text-xs">
                                    <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                                    Recording
                                  </Badge>
                                )}
                                <span className="text-sm">Storage: {device.data.storage}</span>
                              </div>
                            </div>
                          )}
                          {device.type === 'air' && (
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <p className="text-xs text-muted-foreground">AQI</p>
                                <p className="font-semibold">{device.data.aqi}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">PM2.5</p>
                                <p className="font-semibold">{device.data.pm25}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">CO₂</p>
                                <p className="font-semibold">{device.data.co2}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Real-time Activity */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Real-time Activity</span>
                      <Badge variant="secondary">
                        <Activity className="mr-1 h-3 w-3" />
                        Live
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Line
                      data={realtimeData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                          },
                          title: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Device Type Distribution */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Device Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Doughnut
                      data={deviceTypeData}
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

                {/* Network Performance */}
                <Card className="glass border-0 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Network Performance Metrics</CardTitle>
                    <CardDescription>System performance compared to targets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Radar
                      data={networkPerformanceData}
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
              </div>
            </TabsContent>

            {/* Workflows Tab */}
            <TabsContent value="workflows" className="space-y-4">
              <Card className="glass border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Automation Workflows</CardTitle>
                      <CardDescription>Create and manage IoT automation rules</CardDescription>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Workflow
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workflowTemplates.map((workflow) => (
                      <div key={workflow.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{workflow.name}</h3>
                              <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                                {workflow.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm">
                              <div className="flex items-center gap-1">
                                <Cpu className="h-4 w-4 text-muted-foreground" />
                                <span>{workflow.devices} devices</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GitBranch className="h-4 w-4 text-muted-foreground" />
                                <span>{workflow.triggers} triggers</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="h-4 w-4 text-muted-foreground" />
                                <span>{workflow.actions} actions</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Builder Preview */}
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Workflow Builder</CardTitle>
                  <CardDescription>Visual workflow editor with drag-and-drop interface</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <GitMerge className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Drag and drop workflow components here</p>
                      <Button variant="outline" className="mt-3">
                        Open Workflow Editor
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Network Tab */}
            <TabsContent value="network" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Network Topology */}
                <Card className="glass border-0 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Network Topology</CardTitle>
                    <CardDescription>Real-time network visualization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 rounded-lg bg-gray-900 relative overflow-hidden">
                      {/* Network visualization placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
                          <p className="text-gray-400">Network topology visualization</p>
                          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <Router className="h-8 w-8 text-green-400 mx-auto mb-2" />
                              <p className="text-gray-500">12 Gateways</p>
                            </div>
                            <div className="text-center">
                              <Cast className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                              <p className="text-gray-500">48 Hubs</p>
                            </div>
                            <div className="text-center">
                              <Radio className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                              <p className="text-gray-500">1,787 Endpoints</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Connection Statistics */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Connection Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">WiFi Devices</span>
                        <span className="font-semibold">847</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">LoRaWAN</span>
                        <span className="font-semibold">523</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Zigbee</span>
                        <span className="font-semibold">312</span>
                      </div>
                      <Progress value={17} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Bluetooth</span>
                        <span className="font-semibold">165</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure IoT platform preferences and security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Data Collection</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="realtime">Real-time Data Collection</Label>
                          <p className="text-sm text-muted-foreground">Collect and process data in real-time</p>
                        </div>
                        <Switch id="realtime" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="historical">Store Historical Data</Label>
                          <p className="text-sm text-muted-foreground">Keep device data for analytics</p>
                        </div>
                        <Switch id="historical" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Security</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="encryption">End-to-End Encryption</Label>
                          <p className="text-sm text-muted-foreground">Encrypt all device communications</p>
                        </div>
                        <Switch id="encryption" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auth">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Require 2FA for device management</p>
                        </div>
                        <Switch id="auth" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="alerts">Device Alerts</Label>
                          <p className="text-sm text-muted-foreground">Notify when devices go offline</p>
                        </div>
                        <Switch id="alerts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="maintenance">Maintenance Reminders</Label>
                          <p className="text-sm text-muted-foreground">Alert for scheduled maintenance</p>
                        </div>
                        <Switch id="maintenance" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Device Details Modal */}
      <AnimatePresence>
        {selectedDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDevice(null)}
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
                  <h2 className="text-2xl font-bold">Device Details</h2>
                  <Button size="icon" variant="ghost" onClick={() => setSelectedDevice(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Device Info */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {getDeviceIcon(selectedDevice.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{selectedDevice.name}</h3>
                      <p className="text-muted-foreground">{selectedDevice.location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(selectedDevice.status)}>
                          {selectedDevice.status}
                        </Badge>
                        <Badge variant="outline">ID: {selectedDevice.id}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Device Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Signal Strength</span>
                          {getSignalIcon(selectedDevice.signal)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Battery Level</span>
                          <div className="flex items-center gap-2">
                            {getBatteryIcon(selectedDevice.battery)}
                            <span className="font-semibold">{selectedDevice.battery}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Device Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Restart Device
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4" />
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