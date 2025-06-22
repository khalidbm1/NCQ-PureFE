import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useWebSocket } from '@/contexts/WebSocketContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import {
  Activity,
  AlertTriangle,
  Battery,
  Layers,
  MapPin,
  Settings,
  Signal,
  ThermometerSun,
  Wifi,
  WifiOff,
  Zap,
  Lightbulb,
  Droplet,
  Home,
  Cpu,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Filter
} from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.your_token_here'

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
  telemetry: {
    temperature?: number
    humidity?: number
    power?: number
    motion?: boolean
    lightLevel?: number
    waterUsage?: number
  }
  alerts: Alert[]
}

interface Alert {
  id: string
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  message: string
  timestamp: string
  acknowledged: boolean
}

interface DeviceCluster {
  id: string
  count: number
  coordinates: [number, number]
  devices: Device[]
  bounds: [[number, number], [number, number]]
}

interface MapSettings {
  style: 'streets' | 'satellite' | 'outdoors' | 'light' | 'dark'
  showClusters: boolean
  clusterRadius: number
  showHeatmap: boolean
  filterByStatus: string[]
  filterByType: string[]
  showOfflineDevices: boolean
}

interface DeviceMapProps {
  devices?: Device[]
  selectedDeviceId?: string
  onDeviceSelect?: (device: Device) => void
  height?: string
  interactive?: boolean
}

const DeviceMap: React.FC<DeviceMapProps> = ({
  devices: externalDevices,
  selectedDeviceId,
  onDeviceSelect,
  height = '600px',
  interactive = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const { t } = useLanguage()
  const { toast } = useToast()
  const { isConnected, subscribe, unsubscribe } = useWebSocket()

  const [mapSettings, setMapSettings] = useState<MapSettings>({
    style: 'streets',
    showClusters: true,
    clusterRadius: 50,
    showHeatmap: false,
    filterByStatus: [],
    filterByType: [],
    showOfflineDevices: true
  })

  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [clusteredDevices, setClustered] = useState<DeviceCluster[]>([])

  // Fetch devices if not provided externally
  const { data: fetchedDevices = [] } = useQuery<Device[]>({
    queryKey: ['map-devices'],
    queryFn: async () => {
      const response = await api.get('/api/v1/devices?includeLocation=true')
      return response.data
    },
    enabled: !externalDevices,
    refetchInterval: 30000
  })

  const devices = externalDevices || fetchedDevices

  // Filter devices based on map settings
  const filteredDevices = useMemo(() => {
    let filtered = [...devices]

    if (!mapSettings.showOfflineDevices) {
      filtered = filtered.filter(device => device.status !== 'offline')
    }

    if (mapSettings.filterByStatus.length > 0) {
      filtered = filtered.filter(device => mapSettings.filterByStatus.includes(device.status))
    }

    if (mapSettings.filterByType.length > 0) {
      filtered = filtered.filter(device => mapSettings.filterByType.includes(device.type))
    }

    return filtered
  }, [devices, mapSettings])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapSettings.style}-v11`,
      center: [46.6753, 24.7136], // Riyadh, Saudi Arabia
      zoom: 10,
      interactive
    })

    map.current.on('load', () => {
      setIsMapLoaded(true)
    })

    // Add navigation controls
    if (interactive) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Update map style
  useEffect(() => {
    if (map.current && isMapLoaded) {
      map.current.setStyle(`mapbox://styles/mapbox/${mapSettings.style}-v11`)
    }
  }, [mapSettings.style, isMapLoaded])

  // Create device clusters for performance
  const createClusters = useMemo(() => {
    if (!mapSettings.showClusters || filteredDevices.length === 0) {
      return filteredDevices.map(device => ({
        id: device.id,
        count: 1,
        coordinates: [device.location.longitude, device.location.latitude] as [number, number],
        devices: [device],
        bounds: [[device.location.longitude, device.location.latitude], [device.location.longitude, device.location.latitude]] as [[number, number], [number, number]]
      }))
    }

    // Simple clustering algorithm based on distance
    const clusters: DeviceCluster[] = []
    const processed = new Set<string>()
    const radiusKm = mapSettings.clusterRadius / 1000 // Convert to km

    filteredDevices.forEach(device => {
      if (processed.has(device.id)) return

      const cluster: DeviceCluster = {
        id: `cluster-${device.id}`,
        count: 1,
        coordinates: [device.location.longitude, device.location.latitude],
        devices: [device],
        bounds: [[device.location.longitude, device.location.latitude], [device.location.longitude, device.location.latitude]]
      }

      processed.add(device.id)

      // Find nearby devices
      filteredDevices.forEach(otherDevice => {
        if (processed.has(otherDevice.id)) return

        const distance = getDistance(
          device.location.latitude,
          device.location.longitude,
          otherDevice.location.latitude,
          otherDevice.location.longitude
        )

        if (distance <= radiusKm) {
          cluster.devices.push(otherDevice)
          cluster.count++
          processed.add(otherDevice.id)

          // Update cluster center (centroid)
          const totalLat = cluster.devices.reduce((sum, d) => sum + d.location.latitude, 0)
          const totalLng = cluster.devices.reduce((sum, d) => sum + d.location.longitude, 0)
          cluster.coordinates = [totalLng / cluster.count, totalLat / cluster.count]

          // Update bounds
          const lngs = cluster.devices.map(d => d.location.longitude)
          const lats = cluster.devices.map(d => d.location.latitude)
          cluster.bounds = [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)]
          ]
        }
      })

      clusters.push(cluster)
    })

    return clusters
  }, [filteredDevices, mapSettings.showClusters, mapSettings.clusterRadius])

  // Calculate distance between two points in km
  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Add markers to map
  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.device-marker')
    existingMarkers.forEach(marker => marker.remove())

    createClusters.forEach(cluster => {
      const el = document.createElement('div')
      el.className = 'device-marker'
      
      if (cluster.count === 1) {
        // Single device marker
        const device = cluster.devices[0]
        const isSelected = selectedDeviceId === device.id
        
        el.innerHTML = `
          <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${
            isSelected ? 'ring-2 ring-blue-500' : ''
          } ${getDeviceMarkerColor(device.status)}" style="box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            ${getDeviceIcon(device.type)}
            ${device.alerts.length > 0 ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>' : ''}
          </div>
        `

        el.addEventListener('click', () => {
          onDeviceSelect?.(device)
          
          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2 max-w-xs">
                <h3 class="font-semibold text-sm">${device.name}</h3>
                <p class="text-xs text-gray-600 mb-2">${device.type.replace(/_/g, ' ')}</p>
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-xs">
                    <span class="w-2 h-2 rounded-full ${getStatusColor(device.status)}"></span>
                    <span class="capitalize">${device.status}</span>
                  </div>
                  ${device.batteryLevel !== undefined ? `
                    <div class="flex items-center gap-2 text-xs">
                      <span class="text-gray-500">Battery:</span>
                      <span>${device.batteryLevel}%</span>
                    </div>
                  ` : ''}
                  ${Object.keys(device.telemetry).length > 0 ? `
                    <div class="pt-1 border-t">
                      ${Object.entries(device.telemetry).slice(0, 2).map(([key, value]) => `
                        <div class="text-xs">${key}: ${value}${key.includes('temperature') ? '°C' : key.includes('humidity') ? '%' : key.includes('power') ? 'W' : ''}</div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>
            `)

          new mapboxgl.Marker(el)
            .setLngLat(cluster.coordinates)
            .setPopup(popup)
            .addTo(map.current!)
        })
      } else {
        // Cluster marker
        const hasAlerts = cluster.devices.some(d => d.alerts.length > 0)
        const onlineCount = cluster.devices.filter(d => d.status === 'online').length
        
        el.innerHTML = `
          <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-semibold text-sm cursor-pointer transition-all hover:scale-110" style="box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            ${cluster.count}
            ${hasAlerts ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>' : ''}
          </div>
        `

        el.addEventListener('click', () => {
          // Zoom to cluster bounds
          if (map.current) {
            map.current.fitBounds(cluster.bounds, { padding: 50 })
          }
        })
      }

      new mapboxgl.Marker(el)
        .setLngLat(cluster.coordinates)
        .addTo(map.current!)
    })
  }, [createClusters, selectedDeviceId, isMapLoaded, onDeviceSelect])

  // Add heatmap layer
  useEffect(() => {
    if (!map.current || !isMapLoaded || !mapSettings.showHeatmap) return

    const heatmapData = {
      type: 'FeatureCollection' as const,
      features: filteredDevices.map(device => ({
        type: 'Feature' as const,
        properties: {
          intensity: device.status === 'online' ? 1 : 0.3
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [device.location.longitude, device.location.latitude]
        }
      }))
    }

    if (map.current.getSource('device-heatmap')) {
      (map.current.getSource('device-heatmap') as mapboxgl.GeoJSONSource).setData(heatmapData)
    } else {
      map.current.addSource('device-heatmap', {
        type: 'geojson',
        data: heatmapData
      })

      map.current.addLayer({
        id: 'device-heatmap-layer',
        type: 'heatmap',
        source: 'device-heatmap',
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          'heatmap-radius': 20,
          'heatmap-opacity': 0.6
        }
      })
    }

    return () => {
      if (map.current?.getLayer('device-heatmap-layer')) {
        map.current.removeLayer('device-heatmap-layer')
        map.current.removeSource('device-heatmap')
      }
    }
  }, [filteredDevices, mapSettings.showHeatmap, isMapLoaded])

  // Subscribe to real-time device updates
  useEffect(() => {
    if (!isConnected) return

    const handleDeviceUpdate = (update: { deviceId: string; data: Partial<Device> }) => {
      // Trigger re-render of markers if location or status changed
      if (update.data.location || update.data.status) {
        // Force re-render by updating a state that causes useEffect to run
        setIsMapLoaded(prev => prev)
      }
    }

    subscribe('device:update', handleDeviceUpdate)
    subscribe('device:location', handleDeviceUpdate)

    return () => {
      unsubscribe('device:update')
      unsubscribe('device:location')
    }
  }, [isConnected, subscribe, unsubscribe])

  const getDeviceMarkerColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500 border-green-600'
      case 'offline': return 'bg-gray-400 border-gray-500'
      case 'warning': return 'bg-yellow-500 border-yellow-600'
      case 'error': return 'bg-red-500 border-red-600'
      default: return 'bg-gray-400 border-gray-500'
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

  const getDeviceIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      temperature_sensor: '🌡️',
      smart_light: '💡',
      motion_sensor: '👁️',
      smart_meter_electricity: '⚡',
      smart_meter_water: '💧',
      smart_thermostat: '🏠',
    }
    return iconMap[type] || '📱'
  }

  const fitToDevices = () => {
    if (!map.current || filteredDevices.length === 0) return

    const bounds = new mapboxgl.LngLatBounds()
    filteredDevices.forEach(device => {
      bounds.extend([device.location.longitude, device.location.latitude])
    })

    map.current.fitBounds(bounds, { padding: 50 })
  }

  const resetMapView = () => {
    if (!map.current) return
    map.current.flyTo({
      center: [46.6753, 24.7136], // Riyadh
      zoom: 10,
      duration: 1000
    })
  }

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      {interactive && (
        <Card className="ncq-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Device Map
                </CardTitle>
                <CardDescription>
                  Geographic distribution of {filteredDevices.length} devices
                </CardDescription>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardHeader>

          {showSettings && (
            <CardContent className="pt-0">
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                <div className="space-y-2">
                  <Label htmlFor="map-style">Map Style</Label>
                  <Select
                    value={mapSettings.style}
                    onValueChange={(value: any) => 
                      setMapSettings(prev => ({ ...prev, style: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="streets">Streets</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="outdoors">Outdoors</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cluster Radius</Label>
                  <Slider
                    value={[mapSettings.clusterRadius]}
                    onValueChange={([value]) => 
                      setMapSettings(prev => ({ ...prev, clusterRadius: value }))
                    }
                    max={200}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">
                    {mapSettings.clusterRadius}m
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-clusters"
                      checked={mapSettings.showClusters}
                      onCheckedChange={(checked) =>
                        setMapSettings(prev => ({ ...prev, showClusters: checked }))
                      }
                    />
                    <Label htmlFor="show-clusters">Clustering</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-heatmap"
                      checked={mapSettings.showHeatmap}
                      onCheckedChange={(checked) =>
                        setMapSettings(prev => ({ ...prev, showHeatmap: checked }))
                      }
                    />
                    <Label htmlFor="show-heatmap">Heatmap</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-offline"
                      checked={mapSettings.showOfflineDevices}
                      onCheckedChange={(checked) =>
                        setMapSettings(prev => ({ ...prev, showOfflineDevices: checked }))
                      }
                    />
                    <Label htmlFor="show-offline">Show Offline</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fitToDevices}
                    disabled={filteredDevices.length === 0}
                  >
                    <Maximize className="h-4 w-4 mr-1" />
                    Fit All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetMapView}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Map Container */}
      <Card className="ncq-card overflow-hidden">
        <div 
          ref={mapContainer} 
          style={{ height }} 
          className="w-full relative"
        />
        
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
      </Card>

      {/* Device Legend */}
      <Card className="ncq-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Device Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Online ({filteredDevices.filter(d => d.status === 'online').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Warning ({filteredDevices.filter(d => d.status === 'warning').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Error ({filteredDevices.filter(d => d.status === 'error').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>Offline ({filteredDevices.filter(d => d.status === 'offline').length})</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeviceMap