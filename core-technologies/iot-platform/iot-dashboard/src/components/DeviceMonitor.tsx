import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useWebSocket } from '@/contexts/WebSocketContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import {
  Activity,
  AlertTriangle,
  Battery,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Settings,
  Signal,
  ThermometerSun,
  Wifi,
  WifiOff,
  Zap,
  Lightbulb,
  Droplet,
  Home,
  Eye,
  EyeOff,
  Download,
  Upload,
  Clock,
  Cpu,
  BarChart3
} from 'lucide-react'
import { FixedSizeList as List } from 'react-window'
import { format, formatDistanceToNow } from 'date-fns'

interface Device {
  id: string
  name: string
  type: string
  status: 'online' | 'offline' | 'warning' | 'error'
  location: {
    latitude: number
    longitude: number
    address?: string
    building?: string
    floor?: string
    room?: string
  }
  lastSeen: string
  batteryLevel?: number
  signalStrength?: number
  firmwareVersion: string
  telemetry: {
    temperature?: number
    humidity?: number
    power?: number
    motion?: boolean
    lightLevel?: number
    waterUsage?: number
  }
  alerts: Alert[]
  metrics: {
    uptime: number
    dataPointsToday: number
    lastMaintenanceDate: string
    avgResponseTime: number
  }
}

interface Alert {
  id: string
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  message: string
  timestamp: string
  acknowledged: boolean
}

interface FilterState {
  search: string
  status: string[]
  deviceType: string[]
  location: string
  batteryThreshold: number
  signalThreshold: number
  showOnlyAlerts: boolean
  sortBy: 'name' | 'lastSeen' | 'status' | 'batteryLevel' | 'signalStrength'
  sortOrder: 'asc' | 'desc'
}

interface DeviceMonitorProps {
  onDeviceSelect?: (device: Device) => void
  selectedDeviceId?: string
  viewMode?: 'grid' | 'list' | 'map'
}

const DeviceMonitor: React.FC<DeviceMonitorProps> = ({
  onDeviceSelect,
  selectedDeviceId,
  viewMode = 'grid'
}) => {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { isConnected, subscribe, unsubscribe } = useWebSocket()
  const queryClient = useQueryClient()

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    deviceType: [],
    location: '',
    batteryThreshold: 0,
    signalThreshold: 0,
    showOnlyAlerts: false,
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5000)

  // Fetch devices with real-time updates
  const { data: devices = [], isLoading, error, refetch } = useQuery<Device[]>({
    queryKey: ['devices', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.status.length) params.append('status', filters.status.join(','))
      if (filters.deviceType.length) params.append('type', filters.deviceType.join(','))
      if (filters.location) params.append('location', filters.location)
      if (filters.batteryThreshold > 0) params.append('batteryMin', filters.batteryThreshold.toString())
      if (filters.signalThreshold > 0) params.append('signalMin', filters.signalThreshold.toString())
      if (filters.showOnlyAlerts) params.append('hasAlerts', 'true')
      
      params.append('sortBy', filters.sortBy)
      params.append('sortOrder', filters.sortOrder)

      const response = await api.get(`/api/v1/devices?${params}`)
      return response.data
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchIntervalInBackground: true
  })

  // Subscribe to real-time device updates
  useEffect(() => {
    if (!isConnected) return

    const handleDeviceUpdate = (update: { deviceId: string; data: Partial<Device> }) => {
      queryClient.setQueryData(['devices', filters], (oldDevices: Device[] = []) => {
        return oldDevices.map(device => 
          device.id === update.deviceId 
            ? { ...device, ...update.data }
            : device
        )
      })
    }

    const handleNewAlert = (alert: Alert & { deviceId: string }) => {
      queryClient.setQueryData(['devices', filters], (oldDevices: Device[] = []) => {
        return oldDevices.map(device => 
          device.id === alert.deviceId 
            ? { ...device, alerts: [alert, ...device.alerts] }
            : device
        )
      })

      // Show notification for critical alerts
      if (alert.severity === 'CRITICAL' || alert.severity === 'ERROR') {
        const device = devices.find(d => d.id === alert.deviceId)
        toast({
          title: `${alert.severity} Alert`,
          description: `${device?.name}: ${alert.message}`,
          variant: 'destructive'
        })
      }
    }

    subscribe('device:update', handleDeviceUpdate)
    subscribe('device:alert', handleNewAlert)
    subscribe('device:status', handleDeviceUpdate)

    return () => {
      unsubscribe('device:update')
      unsubscribe('device:alert')
      unsubscribe('device:status')
    }
  }, [isConnected, subscribe, unsubscribe, queryClient, filters, devices, toast])

  // Filtered and sorted devices
  const filteredDevices = useMemo(() => {
    let filtered = [...devices]

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(device => 
        device.name.toLowerCase().includes(searchLower) ||
        device.type.toLowerCase().includes(searchLower) ||
        device.location.address?.toLowerCase().includes(searchLower)
      )
    }

    if (filters.status.length) {
      filtered = filtered.filter(device => filters.status.includes(device.status))
    }

    if (filters.deviceType.length) {
      filtered = filtered.filter(device => filters.deviceType.includes(device.type))
    }

    if (filters.batteryThreshold > 0) {
      filtered = filtered.filter(device => 
        device.batteryLevel !== undefined && device.batteryLevel >= filters.batteryThreshold
      )
    }

    if (filters.signalThreshold > 0) {
      filtered = filtered.filter(device => 
        device.signalStrength !== undefined && device.signalStrength >= filters.signalThreshold
      )
    }

    if (filters.showOnlyAlerts) {
      filtered = filtered.filter(device => device.alerts.length > 0)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any, bVal: any

      switch (filters.sortBy) {
        case 'name':
          aVal = a.name
          bVal = b.name
          break
        case 'lastSeen':
          aVal = new Date(a.lastSeen)
          bVal = new Date(b.lastSeen)
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        case 'batteryLevel':
          aVal = a.batteryLevel || 0
          bVal = b.batteryLevel || 0
          break
        case 'signalStrength':
          aVal = a.signalStrength || 0
          bVal = b.signalStrength || 0
          break
        default:
          aVal = a.name
          bVal = b.name
      }

      if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [devices, filters])

  // Device statistics
  const deviceStats = useMemo(() => {
    const total = devices.length
    const online = devices.filter(d => d.status === 'online').length
    const offline = devices.filter(d => d.status === 'offline').length
    const warning = devices.filter(d => d.status === 'warning').length
    const error = devices.filter(d => d.status === 'error').length
    const withAlerts = devices.filter(d => d.alerts.length > 0).length
    const lowBattery = devices.filter(d => d.batteryLevel !== undefined && d.batteryLevel < 20).length
    const weakSignal = devices.filter(d => d.signalStrength !== undefined && d.signalStrength < 30).length

    return {
      total,
      online,
      offline,
      warning,
      error,
      withAlerts,
      lowBattery,
      weakSignal,
      uptime: total > 0 ? Math.round((online / total) * 100) : 0
    }
  }, [devices])

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'temperature_sensor': return ThermometerSun
      case 'smart_light': return Lightbulb
      case 'motion_sensor': return Activity
      case 'smart_meter_electricity': return Zap
      case 'smart_meter_water': return Droplet
      case 'smart_thermostat': return Home
      default: return Cpu
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'offline': return 'bg-gray-400'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'online': return 'default'
      case 'offline': return 'secondary'
      case 'warning': return 'outline'
      case 'error': return 'destructive'
      default: return 'secondary'
    }
  }

  const handleDeviceClick = useCallback((device: Device) => {
    setSelectedDevice(device)
    onDeviceSelect?.(device)
  }, [onDeviceSelect])

  const handleRefresh = useCallback(() => {
    refetch()
    toast({
      title: t('refreshing'),
      description: 'Updating device status...'
    })
  }, [refetch, toast, t])

  const exportDeviceData = useCallback(() => {
    const csvData = filteredDevices.map(device => ({
      name: device.name,
      type: device.type,
      status: device.status,
      lastSeen: device.lastSeen,
      batteryLevel: device.batteryLevel || 'N/A',
      signalStrength: device.signalStrength || 'N/A',
      location: device.location.address || 'Unknown',
      alerts: device.alerts.length
    }))

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `devices-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }, [filteredDevices])

  if (error) {
    return (
      <Card className="ncq-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load devices</h3>
            <p className="text-muted-foreground mb-4">
              Unable to fetch device data. Please try again.
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Device Monitor
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredDevices.length} of {devices.length} devices
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
                Live
              </>
            ) : (
              <>
                <WifiOff className="mr-1 h-3 w-3" />
                Offline
              </>
            )}
          </Badge>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
              id="auto-refresh"
            />
            <Label htmlFor="auto-refresh" className="text-sm">
              Auto-refresh
            </Label>
          </div>

          <Button
            onClick={handleRefresh}
            size="sm"
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            variant="outline"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Button
            onClick={exportDeviceData}
            size="sm"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Device Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="ncq-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Cpu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {deviceStats.uptime}% uptime
            </p>
          </CardContent>
        </Card>

        <Card className="ncq-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <Signal className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {deviceStats.online}
            </div>
          </CardContent>
        </Card>

        <Card className="ncq-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {deviceStats.withAlerts}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card className="ncq-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Battery</CardTitle>
            <Battery className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {deviceStats.lowBattery}
            </div>
            <p className="text-xs text-muted-foreground">
              Below 20%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="ncq-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search devices..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status.join(',')}
                  onValueChange={(value) => 
                    setFilters(prev => ({ 
                      ...prev, 
                      status: value ? value.split(',') : [] 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort">Sort by</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: any) => 
                    setFilters(prev => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="lastSeen">Last Seen</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="batteryLevel">Battery</SelectItem>
                    <SelectItem value="signalStrength">Signal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value: any) => 
                    setFilters(prev => ({ ...prev, sortOrder: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="alerts-only"
                  checked={filters.showOnlyAlerts}
                  onCheckedChange={(checked) =>
                    setFilters(prev => ({ ...prev, showOnlyAlerts: checked }))
                  }
                />
                <Label htmlFor="alerts-only">Show only devices with alerts</Label>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({
                  search: '',
                  status: [],
                  deviceType: [],
                  location: '',
                  batteryThreshold: 0,
                  signalThreshold: 0,
                  showOnlyAlerts: false,
                  sortBy: 'name',
                  sortOrder: 'asc'
                })}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="ncq-card animate-pulse">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredDevices.length === 0 ? (
          <Card className="ncq-card col-span-full">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No devices found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search criteria.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredDevices.map((device) => {
            const DeviceIcon = getDeviceIcon(device.type)
            const isSelected = selectedDeviceId === device.id

            return (
              <Card
                key={device.id}
                className={`ncq-card cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleDeviceClick(device)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DeviceIcon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm font-medium truncate">
                        {device.name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(device.status)}`} />
                      <Badge
                        variant={getStatusBadgeVariant(device.status)}
                        className="text-xs"
                      >
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground truncate">
                      {device.type.replace(/_/g, ' ')}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
                      </span>
                    </div>

                    {device.location.address && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{device.location.address}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {device.batteryLevel !== undefined && (
                        <div className="flex items-center gap-1">
                          <Battery 
                            className={`h-3 w-3 ${
                              device.batteryLevel < 20 ? 'text-red-500' : 
                              device.batteryLevel < 50 ? 'text-yellow-500' : 
                              'text-green-500'
                            }`} 
                          />
                          <span className="text-xs">{device.batteryLevel}%</span>
                        </div>
                      )}

                      {device.signalStrength !== undefined && (
                        <div className="flex items-center gap-1">
                          <Signal 
                            className={`h-3 w-3 ${
                              device.signalStrength < 30 ? 'text-red-500' : 
                              device.signalStrength < 70 ? 'text-yellow-500' : 
                              'text-green-500'
                            }`} 
                          />
                          <span className="text-xs">{device.signalStrength}%</span>
                        </div>
                      )}

                      {device.alerts.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {device.alerts.length}
                        </Badge>
                      )}
                    </div>

                    {/* Telemetry Preview */}
                    {Object.keys(device.telemetry).length > 0 && (
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {device.telemetry.temperature !== undefined && (
                            <div className="flex items-center gap-1">
                              <ThermometerSun className="h-3 w-3 text-orange-500" />
                              <span>{device.telemetry.temperature}°C</span>
                            </div>
                          )}
                          {device.telemetry.power !== undefined && (
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-yellow-500" />
                              <span>{device.telemetry.power}W</span>
                            </div>
                          )}
                          {device.telemetry.motion !== undefined && (
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3 text-blue-500" />
                              <span>{device.telemetry.motion ? 'Motion' : 'Still'}</span>
                            </div>
                          )}
                          {device.telemetry.lightLevel !== undefined && (
                            <div className="flex items-center gap-1">
                              <Lightbulb className="h-3 w-3 text-yellow-500" />
                              <span>{device.telemetry.lightLevel}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Device Detail Dialog */}
      {selectedDevice && (
        <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {React.createElement(getDeviceIcon(selectedDevice.type), {
                  className: "h-5 w-5 text-primary"
                })}
                {selectedDevice.name}
              </DialogTitle>
              <DialogDescription>
                {selectedDevice.type.replace(/_/g, ' ')} • Last seen {formatDistanceToNow(new Date(selectedDevice.lastSeen), { addSuffix: true })}
              </DialogDescription>
            </DialogHeader>

            {/* Device details content would go here */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Status & Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant={getStatusBadgeVariant(selectedDevice.status)}>
                      {selectedDevice.status}
                    </Badge>
                  </div>
                  
                  {selectedDevice.batteryLevel !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Battery</span>
                      <span className="text-sm font-medium">{selectedDevice.batteryLevel}%</span>
                    </div>
                  )}
                  
                  {selectedDevice.signalStrength !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Signal</span>
                      <span className="text-sm font-medium">{selectedDevice.signalStrength}%</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">{selectedDevice.metrics.uptime}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Points Today</span>
                    <span className="text-sm font-medium">{selectedDevice.metrics.dataPointsToday}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Current Telemetry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(selectedDevice.telemetry).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-sm font-medium">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                        {key.includes('temperature') && typeof value === 'number' ? '°C' : ''}
                        {key.includes('humidity') && typeof value === 'number' ? '%' : ''}
                        {key.includes('power') && typeof value === 'number' ? 'W' : ''}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {selectedDevice.alerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedDevice.alerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className="flex items-start justify-between p-2 border rounded">
                        <div className="flex items-start gap-2">
                          <AlertTriangle 
                            className={`h-4 w-4 mt-0.5 ${
                              alert.severity === 'CRITICAL' || alert.severity === 'ERROR'
                                ? 'text-red-500'
                                : alert.severity === 'WARNING'
                                ? 'text-yellow-500'
                                : 'text-blue-500'
                            }`} 
                          />
                          <div>
                            <p className="text-sm font-medium">{alert.message}</p>
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default DeviceMonitor