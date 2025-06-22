import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Droplet,
  Lightbulb,
  MoreHorizontal,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  Settings,
  Thermometer,
  Trash2,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'

interface Device {
  id: string
  deviceId: string
  name: string
  type: string
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ERROR'
  location?: any
  lastSeen?: string
  metadata?: any
  createdAt: string
}

interface CreateDeviceForm {
  name: string
  type: string
  location?: {
    room?: string
    floor?: number
    lat?: number
    lng?: number
  }
  metadata?: any
}

const deviceTypes = [
  { value: 'temperature_sensor', label: 'Temperature Sensor', icon: Thermometer },
  { value: 'humidity_sensor', label: 'Temperature & Humidity Sensor', icon: Thermometer },
  { value: 'smart_light', label: 'Smart Light', icon: Lightbulb },
  { value: 'motion_sensor', label: 'Motion Sensor', icon: Activity },
  { value: 'smart_meter_electricity', label: 'Electricity Meter', icon: Zap },
  { value: 'smart_meter_water', label: 'Water Meter', icon: Droplet },
  { value: 'smart_meter_gas', label: 'Gas Meter', icon: Cpu },
]

export default function Devices() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [formData, setFormData] = useState<CreateDeviceForm>({
    name: '',
    type: 'temperature_sensor',
  })

  // Fetch devices
  const { data: devices, isLoading } = useQuery<Device[]>({
    queryKey: ['devices', search, typeFilter, statusFilter],
    queryFn: () =>
      api
        .get('/api/v1/devices', {
          params: {
            search,
            type: typeFilter !== 'all' ? typeFilter : undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
          },
        })
        .then((res) => res.data),
  })

  // Create device mutation
  const createDevice = useMutation({
    mutationFn: (data: CreateDeviceForm) => api.post('/api/v1/devices', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      setShowAddDialog(false)
      setFormData({ name: '', type: 'temperature_sensor' })
      toast({
        title: 'Device created',
        description: 'The device has been created successfully.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create device',
        variant: 'destructive',
      })
    },
  })

  // Delete device mutation
  const deleteDevice = useMutation({
    mutationFn: (deviceId: string) => api.delete(`/api/v1/devices/${deviceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      toast({
        title: 'Device deleted',
        description: 'The device has been deleted successfully.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete device',
        variant: 'destructive',
      })
    },
  })

  // Update device status mutation
  const updateDeviceStatus = useMutation({
    mutationFn: ({ deviceId, status }: { deviceId: string; status: string }) =>
      api.patch(`/api/v1/devices/${deviceId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      toast({
        title: 'Status updated',
        description: 'Device status has been updated successfully.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
        variant: 'destructive',
      })
    },
  })

  const getDeviceIcon = (type: string) => {
    const deviceType = deviceTypes.find((dt) => dt.value === type)
    return deviceType?.icon || Cpu
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Wifi className="h-4 w-4 text-green-500" />
      case 'INACTIVE':
        return <WifiOff className="h-4 w-4 text-gray-500" />
      case 'MAINTENANCE':
        return <Settings className="h-4 w-4 text-yellow-500" />
      case 'ERROR':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default'
      case 'INACTIVE':
        return 'secondary'
      case 'MAINTENANCE':
        return 'outline'
      case 'ERROR':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('devices')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and monitor your IoT devices
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground ncq-button">
              <Plus className="mr-2 h-4 w-4" />
              {t('addDevice')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
              <DialogDescription>
                Create a new IoT device to start monitoring
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Device Name</Label>
                <Input
                  id="name"
                  placeholder="Living Room Temperature"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Device Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="room">Room (Optional)</Label>
                <Input
                  id="room"
                  placeholder="Living Room"
                  value={formData.location?.room || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, room: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="floor">Floor (Optional)</Label>
                <Input
                  id="floor"
                  type="number"
                  placeholder="1"
                  value={formData.location?.floor || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        floor: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => createDevice.mutate(formData)}
                disabled={!formData.name || createDevice.isPending}
              >
                {createDevice.isPending ? 'Creating...' : 'Create Device'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('search') + ' devices...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 focus:ring-primary focus:border-primary"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Device Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {deviceTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="ERROR">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Devices Table */}
      <Card className="ncq-card">
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <CardDescription>
            {devices?.length || 0} devices found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : devices && devices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('deviceName')}</TableHead>
                  <TableHead>{t('deviceType')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>{t('lastSeen')}</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => {
                  const Icon = getDeviceIcon(device.type)
                  return (
                    <TableRow
                      key={device.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/devices/${device.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{device.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {device.deviceId}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {device.type.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(device.status)}
                          <Badge 
                            variant={getStatusBadgeVariant(device.status)}
                            className={device.status === 'ACTIVE' ? 'bg-primary hover:bg-primary/90' : ''}
                          >
                            {device.status === 'ACTIVE' ? t('online') : device.status === 'INACTIVE' ? t('offline') : device.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {device.location ? (
                          <div className="text-sm">
                            {device.location.room && (
                              <div>{device.location.room}</div>
                            )}
                            {device.location.floor && (
                              <div className="text-muted-foreground">
                                Floor {device.location.floor}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {device.lastSeen ? (
                          <div className="text-sm">
                            <div>{format(new Date(device.lastSeen), 'PP')}</div>
                            <div className="text-muted-foreground">
                              {format(new Date(device.lastSeen), 'p')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(new Date(device.createdAt), 'PP')}</div>
                          <div className="text-muted-foreground">
                            {format(new Date(device.createdAt), 'p')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {device.status === 'ACTIVE' ? (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateDeviceStatus.mutate({
                                    deviceId: device.id,
                                    status: 'INACTIVE',
                                  })
                                }}
                              >
                                <PowerOff className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateDeviceStatus.mutate({
                                    deviceId: device.id,
                                    status: 'ACTIVE',
                                  })
                                }}
                              >
                                <Power className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                updateDeviceStatus.mutate({
                                  deviceId: device.id,
                                  status: 'MAINTENANCE',
                                })
                              }}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Set Maintenance
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (
                                  confirm(
                                    'Are you sure you want to delete this device?'
                                  )
                                ) {
                                  deleteDevice.mutate(device.id)
                                }
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Cpu className="h-12 w-12 text-primary/50 mb-4" />
              <p className="text-lg font-medium">No devices found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by adding your first device
              </p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground ncq-button"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('addDevice')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}