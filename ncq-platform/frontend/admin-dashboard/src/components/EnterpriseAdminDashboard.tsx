import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Shield,
  Users,
  Database,
  Server,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Cpu,
  Memory,
  HardDrive,
  Network,
  Bell,
  Settings,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Zap,
  Cloud,
  Lock,
  Unlock,
  Key,
  Building,
  CreditCard,
  Smartphone,
  Laptop,
  Router,
  Wifi,
  MonitorSpeaker,
  Brain,
  Heart,
  Stethoscope,
  Hotel,
  Car,
  Plane,
  ShoppingCart,
  DollarSign,
  Euro,
  PoundSterling,
  Target,
  Flag,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Navigation,
  Home,
  Office,
  Factory,
  Warehouse,
  Store,
  School,
  Hospital,
  Truck,
  Package,
  Box,
  Archive,
  FileText,
  File,
  Folder,
  Image,
  Video,
  Music,
  Code,
  Terminal,
  Command,
  GitBranch,
  GitCommit,
  GitMerge,
  Bug,
  Wrench,
  Hammer,
  Screwdriver,
  Cog,
  Gear,
  Tool,
  Puzzle,
  Lightbulb,
  Flame,
  Snowflake,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Gauge,
  Speedometer,
  Timer,
  Stopwatch,
  Hourglass,
  Alarm,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react'

interface SystemMetrics {
  service: string
  status: 'healthy' | 'warning' | 'critical' | 'offline'
  uptime: number
  responseTime: number
  errorRate: number
  throughput: number
  memoryUsage: number
  cpuUsage: number
  diskUsage: number
  lastCheck: string
  version: string
  instances: number
  activeConnections: number
}

interface PlatformOverview {
  totalUsers: number
  activeUsers: number
  totalTransactions: number
  totalRevenue: number
  systemHealth: number
  dataVolume: number
  apiCalls: number
  errorRate: number
  uptime: number
  securityIncidents: number
}

interface UserActivity {
  id: string
  userId: string
  username: string
  action: string
  service: string
  timestamp: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'failed' | 'pending'
  details: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface ServiceConfiguration {
  service: string
  environment: 'development' | 'staging' | 'production'
  replicas: number
  autoScaling: boolean
  minReplicas: number
  maxReplicas: number
  cpuThreshold: number
  memoryThreshold: number
  healthCheckEndpoint: string
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  features: Record<string, boolean>
  secrets: Record<string, string>
  configMaps: Record<string, any>
}

interface SecurityEvent {
  id: string
  type: 'login_attempt' | 'permission_denied' | 'data_access' | 'api_abuse' | 'suspicious_activity'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  userId?: string
  ipAddress: string
  timestamp: string
  status: 'open' | 'investigating' | 'resolved' | 'false_positive'
  affectedService: string
  action: string
  metadata: Record<string, any>
}

interface DataIntegration {
  id: string
  name: string
  sourceSystem: string
  targetSystem: string
  status: 'active' | 'paused' | 'error' | 'stopped'
  lastSync: string
  nextSync: string
  recordsSynced: number
  errorCount: number
  syncFrequency: string
  dataTypes: string[]
  mappingRules: number
  conflictResolution: 'source_wins' | 'target_wins' | 'timestamp_wins' | 'manual'
}

export default function EnterpriseAdminDashboard() {
  const { t, isRTL } = useLanguage()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedEnvironment, setSelectedEnvironment] = useState('production')
  const [alertsOnly, setAlertsOnly] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview')
  const [selectedTab, setSelectedTab] = useState('overview')

  // Mock data - in real implementation, this would come from APIs
  const [platformOverview, setPlatformOverview] = useState<PlatformOverview>({
    totalUsers: 45892,
    activeUsers: 12347,
    totalTransactions: 1567890,
    totalRevenue: 2847593.45,
    systemHealth: 98.7,
    dataVolume: 847.2, // GB
    apiCalls: 9876543,
    errorRate: 0.23,
    uptime: 99.97,
    securityIncidents: 3
  })

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>([
    {
      service: 'User Service',
      status: 'healthy',
      uptime: 99.98,
      responseTime: 45,
      errorRate: 0.12,
      throughput: 2847,
      memoryUsage: 68,
      cpuUsage: 34,
      diskUsage: 42,
      lastCheck: '2024-06-20T10:30:00Z',
      version: '2.1.4',
      instances: 3,
      activeConnections: 1247
    },
    {
      service: 'Payment Service',
      status: 'healthy',
      uptime: 99.95,
      responseTime: 78,
      errorRate: 0.18,
      throughput: 1923,
      memoryUsage: 72,
      cpuUsage: 56,
      diskUsage: 38,
      lastCheck: '2024-06-20T10:30:00Z',
      version: '1.8.2',
      instances: 5,
      activeConnections: 2891
    },
    {
      service: 'Hospital Service',
      status: 'warning',
      uptime: 99.87,
      responseTime: 123,
      errorRate: 0.45,
      throughput: 847,
      memoryUsage: 84,
      cpuUsage: 67,
      diskUsage: 59,
      lastCheck: '2024-06-20T10:30:00Z',
      version: '1.5.7',
      instances: 2,
      activeConnections: 456
    },
    {
      service: 'IoT Service',
      status: 'healthy',
      uptime: 99.92,
      responseTime: 67,
      errorRate: 0.31,
      throughput: 5621,
      memoryUsage: 45,
      cpuUsage: 23,
      diskUsage: 67,
      lastCheck: '2024-06-20T10:30:00Z',
      version: '3.2.1',
      instances: 4,
      activeConnections: 18743
    },
    {
      service: 'Blockchain Service',
      status: 'healthy',
      uptime: 99.94,
      responseTime: 234,
      errorRate: 0.09,
      throughput: 234,
      memoryUsage: 91,
      cpuUsage: 78,
      diskUsage: 23,
      lastCheck: '2024-06-20T10:30:00Z',
      version: '2.0.3',
      instances: 3,
      activeConnections: 127
    },
    {
      service: 'AI Service',
      status: 'healthy',
      uptime: 99.91,
      responseTime: 456,
      errorRate: 0.27,
      throughput: 1456,
      memoryUsage: 89,
      cpuUsage: 82,
      diskUsage: 34,
      lastCheck: '2024-06-20T10:30:00Z',
      version: '1.9.8',
      instances: 6,
      activeConnections: 2341
    },
    {
      service: 'Integration Service',
      status: 'healthy',
      uptime: 99.96,
      responseTime: 89,
      errorRate: 0.15,
      throughput: 3247,
      memoryUsage: 56,
      cpuUsage: 41,
      diskUsage: 78,
      lastCheck: '2024-06-20T10:30:00Z',
      version: '1.3.5',
      instances: 2,
      activeConnections: 5678
    },
    {
      service: 'Hospitality Service',
      status: 'healthy',
      uptime: 99.89,
      responseTime: 112,
      errorRate: 0.22,
      throughput: 1089,
      memoryUsage: 63,
      cpuUsage: 39,
      diskUsage: 45,
      lastCheck: '2024-06-20T10:30:00Z',
      version: '1.4.2',
      instances: 2,
      activeConnections: 891
    }
  ])

  const [userActivities, setUserActivities] = useState<UserActivity[]>([
    {
      id: '1',
      userId: 'user_001',
      username: 'admin@ncq.com',
      action: 'Service Configuration Update',
      service: 'Payment Service',
      timestamp: '2024-06-20T10:25:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      details: 'Updated auto-scaling configuration',
      severity: 'medium'
    },
    {
      id: '2',
      userId: 'user_002',
      username: 'sysadmin@ncq.com',
      action: 'Failed Login Attempt',
      service: 'Authentication Service',
      timestamp: '2024-06-20T10:20:00Z',
      ipAddress: '45.123.45.67',
      userAgent: 'curl/7.68.0',
      status: 'failed',
      details: 'Multiple failed authentication attempts detected',
      severity: 'high'
    },
    {
      id: '3',
      userId: 'user_003',
      username: 'devops@ncq.com',
      action: 'Deployment',
      service: 'Hospital Service',
      timestamp: '2024-06-20T10:15:00Z',
      ipAddress: '10.0.0.50',
      userAgent: 'kubectl/1.28.0',
      status: 'success',
      details: 'Deployed version 1.5.7 to production',
      severity: 'low'
    }
  ])

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'api_abuse',
      severity: 'high',
      description: 'Unusual API request pattern detected from IP 45.123.45.67',
      userId: 'unknown',
      ipAddress: '45.123.45.67',
      timestamp: '2024-06-20T10:22:00Z',
      status: 'investigating',
      affectedService: 'Payment Service',
      action: 'Rate limiting applied',
      metadata: { requestCount: 5000, timeWindow: '5 minutes' }
    },
    {
      id: '2',
      type: 'permission_denied',
      severity: 'medium',
      description: 'User attempted to access restricted admin endpoint',
      userId: 'user_004',
      ipAddress: '192.168.1.245',
      timestamp: '2024-06-20T10:18:00Z',
      status: 'resolved',
      affectedService: 'User Service',
      action: 'Access denied, user notified',
      metadata: { endpoint: '/admin/users/delete', userRole: 'operator' }
    },
    {
      id: '3',
      type: 'suspicious_activity',
      severity: 'critical',
      description: 'Potential data exfiltration attempt detected',
      userId: 'user_005',
      ipAddress: '78.234.123.89',
      timestamp: '2024-06-20T10:10:00Z',
      status: 'open',
      affectedService: 'Hospital Service',
      action: 'Account temporarily suspended',
      metadata: { dataVolume: '500MB', suspiciousQueries: 47 }
    }
  ])

  const [dataIntegrations, setDataIntegrations] = useState<DataIntegration[]>([
    {
      id: '1',
      name: 'User-Payment Sync',
      sourceSystem: 'User Service',
      targetSystem: 'Payment Service',
      status: 'active',
      lastSync: '2024-06-20T10:25:00Z',
      nextSync: '2024-06-20T10:30:00Z',
      recordsSynced: 12847,
      errorCount: 2,
      syncFrequency: '5 minutes',
      dataTypes: ['user_profiles', 'preferences'],
      mappingRules: 15,
      conflictResolution: 'source_wins'
    },
    {
      id: '2',
      name: 'Hospital-IoT Integration',
      sourceSystem: 'Hospital Service',
      targetSystem: 'IoT Service',
      status: 'active',
      lastSync: '2024-06-20T10:20:00Z',
      nextSync: '2024-06-20T10:22:00Z',
      recordsSynced: 5623,
      errorCount: 0,
      syncFrequency: '2 minutes',
      dataTypes: ['patient_vitals', 'room_status'],
      mappingRules: 8,
      conflictResolution: 'timestamp_wins'
    },
    {
      id: '3',
      name: 'Payment-Blockchain Audit',
      sourceSystem: 'Payment Service',
      targetSystem: 'Blockchain Service',
      status: 'error',
      lastSync: '2024-06-20T10:15:00Z',
      nextSync: '2024-06-20T10:35:00Z',
      recordsSynced: 891,
      errorCount: 15,
      syncFrequency: '20 minutes',
      dataTypes: ['transactions', 'settlements'],
      mappingRules: 12,
      conflictResolution: 'manual'
    }
  ])

  // Real-time updates simulation
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setRefreshing(true)
      
      // Simulate real-time updates
      setPlatformOverview(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 1000) + 500,
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.1)
      }))

      setSystemMetrics(prev => prev.map(metric => ({
        ...metric,
        responseTime: Math.max(10, metric.responseTime + Math.floor(Math.random() * 20) - 10),
        cpuUsage: Math.max(5, Math.min(95, metric.cpuUsage + Math.floor(Math.random() * 10) - 5)),
        memoryUsage: Math.max(10, Math.min(98, metric.memoryUsage + Math.floor(Math.random() * 8) - 4)),
        activeConnections: Math.max(0, metric.activeConnections + Math.floor(Math.random() * 100) - 50)
      })))

      setTimeout(() => setRefreshing(false), 1000)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    
    try {
      // Simulate API calls to refresh data
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: t('dashboard.refreshed'),
        description: t('dashboard.dataUpdated'),
      })
    } catch (error) {
      toast({
        title: t('error.title'),
        description: t('error.refreshFailed'),
        variant: 'destructive',
      })
    } finally {
      setRefreshing(false)
    }
  }, [t, toast])

  const filteredUserActivities = useMemo(() => {
    return userActivities.filter(activity => {
      const matchesSearch = searchTerm === '' || 
        activity.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.service.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSeverity = filterSeverity === 'all' || activity.severity === filterSeverity
      
      return matchesSearch && matchesSeverity
    })
  }, [userActivities, searchTerm, filterSeverity])

  const filteredSecurityEvents = useMemo(() => {
    return securityEvents.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.affectedService.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity
      
      return matchesSearch && matchesSeverity
    })
  }, [securityEvents, searchTerm, filterSeverity])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'offline':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800',
      offline: 'bg-gray-100 text-gray-800',
      active: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800',
      paused: 'bg-yellow-100 text-yellow-800',
      stopped: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-orange-600'
      case 'critical':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('admin.dashboard.title', 'NCQ Enterprise Admin Dashboard')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('admin.dashboard.description', 'Centralized management and monitoring of the NCQ platform')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                id="auto-refresh"
              />
              <Label htmlFor="auto-refresh" className="text-sm">
                {t('admin.autoRefresh', 'Auto Refresh')}
              </Label>
            </div>
            
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? t('common.refreshing', 'Refreshing...') : t('common.refresh', 'Refresh')}
            </Button>
            
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Platform Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformOverview.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{platformOverview.activeUsers.toLocaleString()}</span> active now
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${platformOverview.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformOverview.systemHealth}%</div>
              <Progress value={platformOverview.systemHealth} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Incidents</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{platformOverview.securityIncidents}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">2 open</span>, 1 resolved
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="configuration">Config</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status Overview</CardTitle>
                  <CardDescription>Real-time status of all NCQ services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemMetrics.slice(0, 4).map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(metric.status)}
                          <div>
                            <p className="font-medium">{metric.service}</p>
                            <p className="text-sm text-gray-600">{metric.uptime}% uptime</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{metric.responseTime}ms</p>
                          <p className="text-xs text-gray-600">{metric.instances} instances</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest admin and system activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userActivities.slice(0, 4).map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`h-2 w-2 rounded-full mt-2 ${
                          activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.username} • {activity.service}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge className={getSeverityColor(activity.severity)}>
                          {activity.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>System performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{platformOverview.apiCalls.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">API Calls (24h)</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <ArrowUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">+15.3%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{platformOverview.dataVolume} GB</p>
                    <p className="text-sm text-gray-600">Data Volume</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <ArrowUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">+8.7%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{platformOverview.errorRate}%</p>
                    <p className="text-sm text-gray-600">Error Rate</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <ArrowDown className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">-2.1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Service Management</h2>
              <div className="flex items-center gap-3">
                <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
                <Switch
                  checked={alertsOnly}
                  onCheckedChange={setAlertsOnly}
                  id="alerts-only"
                />
                <Label htmlFor="alerts-only" className="text-sm">Alerts Only</Label>
              </div>
            </div>

            <div className="grid gap-6">
              {systemMetrics
                .filter(metric => !alertsOnly || metric.status !== 'healthy')
                .map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(metric.status)}
                          <CardTitle>{metric.service}</CardTitle>
                        </div>
                        {getStatusBadge(metric.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">v{metric.version}</Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Uptime</p>
                        <p className="text-lg font-semibold">{metric.uptime}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Response Time</p>
                        <p className="text-lg font-semibold">{metric.responseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Throughput</p>
                        <p className="text-lg font-semibold">{metric.throughput}/min</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Error Rate</p>
                        <p className="text-lg font-semibold">{metric.errorRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Instances</p>
                        <p className="text-lg font-semibold">{metric.instances}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Connections</p>
                        <p className="text-lg font-semibold">{metric.activeConnections}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">CPU Usage</span>
                          <span className="text-sm font-medium">{metric.cpuUsage}%</span>
                        </div>
                        <Progress value={metric.cpuUsage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Memory Usage</span>
                          <span className="text-sm font-medium">{metric.memoryUsage}%</span>
                        </div>
                        <Progress value={metric.memoryUsage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Disk Usage</span>
                          <span className="text-sm font-medium">{metric.diskUsage}%</span>
                        </div>
                        <Progress value={metric.diskUsage} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Activity Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent User Activities</CardTitle>
                <CardDescription>
                  Showing {filteredUserActivities.length} of {userActivities.length} activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUserActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{activity.action}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(activity.severity)}>
                              {activity.severity}
                            </Badge>
                            <Badge variant="outline">{activity.status}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {activity.username}
                          </span>
                          <span className="flex items-center gap-1">
                            <Server className="h-3 w-3" />
                            {activity.service}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.ipAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Security Management</h2>
              <div className="flex items-center gap-3">
                <Badge variant="destructive">
                  {securityEvents.filter(e => e.status === 'open').length} Open Incidents
                </Badge>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Configure Alerts
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Security Score</p>
                      <p className="text-2xl font-bold">94/100</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Active Sessions</p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600">Threats Blocked</p>
                      <p className="text-2xl font-bold">23</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">API Keys</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
                <CardDescription>Recent security incidents and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSecurityEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        event.severity === 'critical' ? 'bg-red-500' :
                        event.severity === 'high' ? 'bg-orange-500' :
                        event.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{event.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                            <Badge variant="outline">{event.status}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.action}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Server className="h-3 w-3" />
                            {event.affectedService}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.ipAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                          {event.userId && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.userId}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Data Integration Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </div>

            <div className="grid gap-6">
              {dataIntegrations.map((integration, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{integration.name}</CardTitle>
                        <CardDescription>
                          {integration.sourceSystem} → {integration.targetSystem}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(integration.status)}
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Records Synced</p>
                        <p className="text-lg font-semibold">{integration.recordsSynced.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Sync Frequency</p>
                        <p className="text-lg font-semibold">{integration.syncFrequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Error Count</p>
                        <p className={`text-lg font-semibold ${integration.errorCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {integration.errorCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Mapping Rules</p>
                        <p className="text-lg font-semibold">{integration.mappingRules}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Last Sync: {new Date(integration.lastSync).toLocaleString()}</span>
                      <span>Next Sync: {new Date(integration.nextSync).toLocaleString()}</span>
                      <Badge variant="outline">{integration.conflictResolution}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      {integration.dataTypes.map((type, typeIndex) => (
                        <Badge key={typeIndex} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">System Configuration</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Config
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global Settings</CardTitle>
                  <CardDescription>Platform-wide configuration options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <Switch id="maintenance-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="debug-logging">Debug Logging</Label>
                    <Switch id="debug-logging" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-scaling">Auto Scaling</Label>
                    <Switch id="auto-scaling" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rate-limiting">Rate Limiting</Label>
                    <Switch id="rate-limiting" defaultChecked />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Slider
                      id="session-timeout"
                      min={5}
                      max={480}
                      step={5}
                      defaultValue={[60]}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-connections">Max Connections per Service</Label>
                    <Slider
                      id="max-connections"
                      min={100}
                      max={10000}
                      step={100}
                      defaultValue={[1000]}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Configuration</CardTitle>
                  <CardDescription>Security and authentication settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mfa-required">Require MFA</Label>
                    <Switch id="mfa-required" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-complexity">Password Complexity</Label>
                    <Switch id="password-complexity" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="audit-logging">Audit Logging</Label>
                    <Switch id="audit-logging" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                    <Switch id="ip-whitelist" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="token-expiry">JWT Token Expiry (hours)</Label>
                    <Slider
                      id="token-expiry"
                      min={1}
                      max={168}
                      step={1}
                      defaultValue={[24]}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                    <Slider
                      id="max-login-attempts"
                      min={3}
                      max={10}
                      step={1}
                      defaultValue={[5]}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Alert and notification configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <Switch id="email-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-alerts">SMS Alerts</Label>
                    <Switch id="sms-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slack-integration">Slack Integration</Label>
                    <Switch id="slack-integration" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="webhook-notifications">Webhook Notifications</Label>
                    <Switch id="webhook-notifications" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Alert Severity Levels</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="alert-critical" defaultChecked />
                        <Label htmlFor="alert-critical">Critical</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="alert-high" defaultChecked />
                        <Label htmlFor="alert-high">High</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="alert-medium" />
                        <Label htmlFor="alert-medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="alert-low" />
                        <Label htmlFor="alert-low">Low</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Backup & Recovery</CardTitle>
                  <CardDescription>Data backup and disaster recovery settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup">Automated Backups</Label>
                    <Switch id="auto-backup" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="incremental-backup">Incremental Backups</Label>
                    <Switch id="incremental-backup" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="geo-replication">Geo Replication</Label>
                    <Switch id="geo-replication" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="disaster-recovery">Disaster Recovery</Label>
                    <Switch id="disaster-recovery" defaultChecked />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Backup Schedule</Label>
                    <RadioGroup defaultValue="daily">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hourly" id="backup-hourly" />
                        <Label htmlFor="backup-hourly">Every hour</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="backup-daily" />
                        <Label htmlFor="backup-daily">Daily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="backup-weekly" />
                        <Label htmlFor="backup-weekly">Weekly</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retention-period">Retention Period (days)</Label>
                    <Slider
                      id="retention-period"
                      min={7}
                      max={365}
                      step={1}
                      defaultValue={[30]}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}