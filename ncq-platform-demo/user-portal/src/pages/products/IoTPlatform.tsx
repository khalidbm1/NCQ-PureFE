import { useState } from 'react'
import { 
  Wifi, Cpu, Activity, Zap, Globe, Shield, AlertTriangle,
  Thermometer, Droplets, Wind, Battery, Signal, Settings,
  PlayCircle, PauseCircle, RefreshCw, Download, Upload
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import { Switch } from '../../components/ui/switch'
import { toast } from 'sonner'

// Mock data
const platformStats = {
  totalDevices: 3847,
  activeDevices: 3254,
  dataPoints: 12850000,
  alerts: 23,
  uptime: 99.97,
  avgLatency: 45,
  messagesPerSecond: 8432,
  storageUsed: 67.3
}

const devices = [
  {
    id: 'DEV-001',
    name: 'Temperature Sensor - Building A',
    type: 'Temperature',
    status: 'online',
    lastSeen: '2 min ago',
    battery: 85,
    signal: 92,
    data: { temperature: 23.5, unit: '°C' },
    location: 'Floor 2, Room 201'
  },
  {
    id: 'DEV-002',
    name: 'Smart Meter - Main',
    type: 'Energy',
    status: 'online',
    lastSeen: '1 min ago',
    battery: 100,
    signal: 88,
    data: { power: 4.2, unit: 'kW' },
    location: 'Electrical Room'
  },
  {
    id: 'DEV-003',
    name: 'Air Quality Monitor',
    type: 'Environmental',
    status: 'warning',
    lastSeen: '5 min ago',
    battery: 45,
    signal: 75,
    data: { aqi: 72, unit: 'AQI' },
    location: 'Parking Level B1'
  },
  {
    id: 'DEV-004',
    name: 'Water Flow Sensor',
    type: 'Water',
    status: 'offline',
    lastSeen: '2 hours ago',
    battery: 12,
    signal: 0,
    data: { flow: 0, unit: 'L/min' },
    location: 'Pump Room'
  },
  {
    id: 'DEV-005',
    name: 'Motion Detector - Entrance',
    type: 'Security',
    status: 'online',
    lastSeen: 'Just now',
    battery: 67,
    signal: 95,
    data: { motion: true, count: 342 },
    location: 'Main Entrance'
  }
]

const alerts = [
  { id: 1, device: 'Water Flow Sensor', type: 'critical', message: 'Device offline for 2 hours', time: '2 hours ago' },
  { id: 2, device: 'Air Quality Monitor', type: 'warning', message: 'AQI above threshold (72)', time: '1 hour ago' },
  { id: 3, device: 'Temperature Sensor - Building B', type: 'info', message: 'Battery below 20%', time: '3 hours ago' },
  { id: 4, device: 'Smart Meter - Backup', type: 'warning', message: 'Unusual power consumption pattern', time: '4 hours ago' }
]

const automationRules = [
  { id: 1, name: 'Temperature Control', trigger: 'Temperature > 26°C', action: 'Turn on AC', enabled: true, executions: 145 },
  { id: 2, name: 'Security Alert', trigger: 'Motion detected after hours', action: 'Send notification', enabled: true, executions: 23 },
  { id: 3, name: 'Energy Saver', trigger: 'No motion for 30 min', action: 'Turn off lights', enabled: false, executions: 89 },
  { id: 4, name: 'Water Leak Detection', trigger: 'Abnormal flow rate', action: 'Shut valve & alert', enabled: true, executions: 2 }
]

const DeviceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Temperature':
      return <Thermometer className="w-5 h-5" />
    case 'Energy':
      return <Zap className="w-5 h-5" />
    case 'Environmental':
      return <Wind className="w-5 h-5" />
    case 'Water':
      return <Droplets className="w-5 h-5" />
    case 'Security':
      return <Shield className="w-5 h-5" />
    default:
      return <Cpu className="w-5 h-5" />
  }
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    online: 'default',
    offline: 'destructive',
    warning: 'secondary'
  }
  
  return (
    <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
      {status}
    </Badge>
  )
}

export default function IoTPlatform() {
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [isSimulating, setIsSimulating] = useState(false)

  const handleAddDevice = () => {
    toast.success('Device provisioning wizard opened')
  }

  const handleExportData = () => {
    toast.success('Exporting device data...')
  }

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating)
    toast.info(isSimulating ? 'Simulation stopped' : 'Simulation started')
  }

  const handleDeviceAction = (deviceId: string, action: string) => {
    toast.success(`${action} command sent to device ${deviceId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">IoT Platform</h1>
          <p className="text-muted-foreground">
            Manage and monitor your connected devices
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleSimulation}>
            {isSimulating ? (
              <>
                <PauseCircle className="w-4 h-4 mr-2" />
                Stop Simulation
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Simulation
              </>
            )}
          </Button>
          <Button onClick={handleAddDevice}>
            <Wifi className="w-4 h-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.totalDevices.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {platformStats.activeDevices.toLocaleString()} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(platformStats.dataPoints / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              {platformStats.messagesPerSecond.toLocaleString()} msg/s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              {platformStats.avgLatency}ms latency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.alerts}</div>
            <p className="text-xs text-muted-foreground">
              3 critical, 12 warnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Device Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Device Status</CardTitle>
                <CardDescription>
                  Real-time device connectivity status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm">Online</span>
                    </div>
                    <span className="font-medium">{platformStats.activeDevices}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-sm">Warning</span>
                    </div>
                    <span className="font-medium">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-sm">Offline</span>
                    </div>
                    <span className="font-medium">251</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={(platformStats.activeDevices / platformStats.totalDevices) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {((platformStats.activeDevices / platformStats.totalDevices) * 100).toFixed(1)}% devices online
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Data Usage</CardTitle>
                <CardDescription>
                  Platform storage and bandwidth metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Storage Used</span>
                      <span className="text-sm font-medium">{platformStats.storageUsed}%</span>
                    </div>
                    <Progress value={platformStats.storageUsed} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Bandwidth (Today)</span>
                      <span className="text-sm font-medium">2.3 GB / 5 GB</span>
                    </div>
                    <Progress value={46} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">API Quota</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Device Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices.slice(0, 3).map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <DeviceIcon type={device.type} />
                      </div>
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {device.data.value || device.data.temperature || device.data.power} {device.data.unit} • {device.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <StatusBadge status={device.status} />
                        <p className="text-xs text-muted-foreground mt-1">{device.lastSeen}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>
                Manage and monitor all IoT devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices.map((device) => (
                  <div key={device.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <DeviceIcon type={device.type} />
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-muted-foreground">{device.id} • {device.location}</p>
                        </div>
                      </div>
                      <StatusBadge status={device.status} />
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Last Seen</p>
                        <p className="font-medium">{device.lastSeen}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Battery</p>
                        <div className="flex items-center space-x-1">
                          <Battery className="w-4 h-4" />
                          <span className="font-medium">{device.battery}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Signal</p>
                        <div className="flex items-center space-x-1">
                          <Signal className="w-4 h-4" />
                          <span className="font-medium">{device.signal}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeviceAction(device.id, 'Restart')}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeviceAction(device.id, 'Configure')}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="telemetry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Telemetry</CardTitle>
              <CardDescription>
                Live data streaming from devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">
                  Real-time telemetry charts and data visualization would be displayed here
                </p>
                <Button className="mt-4" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>
                Configure automated actions based on device data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">
                        When: {rule.trigger} → Then: {rule.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Executed {rule.executions} times
                      </p>
                    </div>
                    <Switch checked={rule.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Device alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`w-5 h-5 ${
                        alert.type === 'critical' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium">{alert.device}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{alert.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}