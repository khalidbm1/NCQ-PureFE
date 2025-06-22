import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useWebSocket } from '@/contexts/WebSocketContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import {
  Activity,
  AlertTriangle,
  Cpu,
  Droplet,
  Home,
  Lightbulb,
  Power,
  Thermometer,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

interface DashboardStats {
  totalDevices: number
  activeDevices: number
  totalTelemetry: number
  activeAlerts: number
  automationRules: number
  dataPointsToday: number
}

interface DeviceSummary {
  type: string
  count: number
  active: number
}

interface RecentAlert {
  id: string
  deviceId: string
  deviceName: string
  type: string
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  title: string
  timestamp: string
}

export default function Dashboard() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const { isConnected, subscribe, unsubscribe } = useWebSocket()
  const [realtimeTelemetry, setRealtimeTelemetry] = useState<any[]>([])
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([])

  // Fetch dashboard stats
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/api/v1/dashboard/stats').then(res => res.data),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Fetch device summary
  const { data: deviceSummary } = useQuery<DeviceSummary[]>({
    queryKey: ['device-summary'],
    queryFn: () => api.get('/api/v1/dashboard/device-summary').then(res => res.data),
  })

  // Fetch telemetry trends
  const { data: telemetryTrends } = useQuery({
    queryKey: ['telemetry-trends'],
    queryFn: () => api.get('/api/v1/dashboard/telemetry-trends').then(res => res.data),
  })

  // Subscribe to real-time updates
  useEffect(() => {
    if (isConnected) {
      // Subscribe to telemetry updates
      subscribe('dashboard:telemetry', (data: any) => {
        setRealtimeTelemetry(prev => [...prev.slice(-50), data].slice(-50))
      })

      // Subscribe to alerts
      subscribe('dashboard:alerts', (alert: RecentAlert) => {
        setRecentAlerts(prev => [alert, ...prev].slice(0, 10))
        
        // Show toast for critical alerts
        if (alert.severity === 'CRITICAL' || alert.severity === 'ERROR') {
          toast({
            title: alert.title,
            description: `${alert.deviceName} - ${alert.type}`,
            variant: 'destructive',
          })
        }
      })
    }

    return () => {
      unsubscribe('dashboard:telemetry')
      unsubscribe('dashboard:alerts')
    }
  }, [isConnected, subscribe, unsubscribe, toast])

  const deviceTypeIcons: Record<string, any> = {
    temperature_sensor: Thermometer,
    smart_light: Lightbulb,
    motion_sensor: Activity,
    smart_meter_electricity: Zap,
    smart_meter_water: Droplet,
  }

  const COLORS = ['#16a34a', '#10b981', '#059669', '#047857', '#065f46']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Monitor and control your IoT devices in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={isConnected ? 'default' : 'destructive'}
            className={isConnected ? 'bg-primary hover:bg-primary/90' : ''}
          >
            {isConnected ? (
              <>
                <Wifi className="mr-1 h-3 w-3" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="mr-1 h-3 w-3" />
                Disconnected
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="ncq-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalDevices')}</CardTitle>
            <Cpu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDevices || 0}</div>
          </CardContent>
        </Card>

        <Card className="ncq-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeDevices')}</CardTitle>
            <Power className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeDevices || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalDevices && stats.totalDevices > 0
                ? `${Math.round((stats.activeDevices / stats.totalDevices) * 100)}% ${t('online')}`
                : `0% ${t('online')}`}
            </p>
          </CardContent>
        </Card>

        <Card className="ncq-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points Today</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.dataPointsToday?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="ncq-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeAlerts || 0}</div>
            {stats?.activeAlerts && stats.activeAlerts > 0 && (
              <p className="text-xs text-destructive">Requires attention</p>
            )}
          </CardContent>
        </Card>

        <Card className="ncq-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('automationRules')}</CardTitle>
            <Home className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.automationRules || 0}</div>
          </CardContent>
        </Card>

        <Card className="ncq-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalTelemetry')}</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalTelemetry?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Device Summary */}
        <Card className="ncq-card lg:col-span-1">
          <CardHeader>
            <CardTitle>Device Summary</CardTitle>
            <CardDescription>Distribution by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceSummary}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={entry => entry.type}
                >
                  {deviceSummary?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {deviceSummary?.map((item, index) => {
                const Icon = deviceTypeIcons[item.type] || Cpu
                return (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{item.type.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.count}</Badge>
                      <Badge 
                        variant={item.active > 0 ? 'default' : 'secondary'}
                        className={item.active > 0 ? 'bg-primary hover:bg-primary/90' : ''}
                      >
                        {item.active} {t('online')}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Telemetry Trends */}
        <Card className="ncq-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Telemetry Trends</CardTitle>
            <CardDescription>Data points over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="temperature" className="space-y-4">
              <TabsList>
                <TabsTrigger value="temperature">Temperature</TabsTrigger>
                <TabsTrigger value="humidity">Humidity</TabsTrigger>
                <TabsTrigger value="power">Power</TabsTrigger>
                <TabsTrigger value="motion">Motion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="temperature" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={telemetryTrends?.temperature || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => format(new Date(value), 'PPp')}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#16a34a"
                      name="Temperature (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="humidity" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={telemetryTrends?.humidity || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => format(new Date(value), 'PPp')}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                      name="Humidity (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="power" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={telemetryTrends?.power || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => format(new Date(value), 'PPp')}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#059669" name="Power (kWh)" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="motion" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={telemetryTrends?.motion || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => format(new Date(value), 'PPp')}
                    />
                    <Legend />
                    <Area
                      type="stepAfter"
                      dataKey="value"
                      stroke="#047857"
                      fill="#047857"
                      fillOpacity={0.3}
                      name="Motion Events"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="ncq-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('recentActivity')}</CardTitle>
              <CardDescription>Latest system alerts and notifications</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="hover:text-primary hover:border-primary">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No recent alerts
              </p>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between space-x-4 rounded-lg border p-4 transition-all hover:shadow-sm"
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle
                      className={`h-5 w-5 mt-0.5 ${
                        alert.severity === 'CRITICAL' || alert.severity === 'ERROR'
                          ? 'text-destructive'
                          : alert.severity === 'WARNING'
                          ? 'text-yellow-500'
                          : 'text-blue-500'
                      }`}
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.deviceName} • {alert.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(alert.timestamp), 'PPp')}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      alert.severity === 'CRITICAL' || alert.severity === 'ERROR'
                        ? 'destructive'
                        : alert.severity === 'WARNING'
                        ? 'outline'
                        : 'secondary'
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}