import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/contexts/LanguageContext'
import { api } from '@/lib/api'
import {
  Plus,
  Settings,
  Wifi,
  WifiOff,
  MapPin,
  QrCode,
  Download,
  Upload,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Trash2,
  Edit,
  Save,
  X,
  Smartphone,
  Router,
  Activity,
  ThermometerSun,
  Lightbulb,
  Droplet,
  Zap,
  Home,
  Cpu,
  Key,
  Globe,
  Shield,
  Database
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Device provisioning schema
const deviceProvisioningSchema = z.object({
  deviceName: z.string().min(1, 'Device name is required').max(50, 'Name too long'),
  deviceType: z.string().min(1, 'Device type is required'),
  description: z.string().max(200, 'Description too long').optional(),
  location: z.object({
    building: z.string().optional(),
    floor: z.string().optional(),
    room: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    address: z.string().optional()
  }),
  connectivity: z.object({
    connectionType: z.enum(['wifi', 'cellular', 'ethernet', 'lora', 'zigbee']),
    networkConfig: z.object({
      ssid: z.string().optional(),
      password: z.string().optional(),
      staticIp: z.string().optional(),
      subnet: z.string().optional(),
      gateway: z.string().optional(),
      dns: z.string().optional()
    }).optional()
  }),
  configuration: z.object({
    reportingInterval: z.number().min(1).max(3600),
    enableTelemetry: z.boolean(),
    enableAlerts: z.boolean(),
    powerMode: z.enum(['normal', 'eco', 'performance']),
    firmware: z.string().optional()
  }),
  security: z.object({
    enableEncryption: z.boolean(),
    certificates: z.array(z.string()).optional(),
    apiKey: z.string().optional()
  })
})

type DeviceProvisioningForm = z.infer<typeof deviceProvisioningSchema>

interface ProvisioningStep {
  id: string
  title: string
  description: string
  completed: boolean
  active: boolean
}

interface DeviceTemplate {
  id: string
  name: string
  type: string
  description: string
  icon: React.ComponentType<any>
  defaultConfig: Partial<DeviceProvisioningForm>
  capabilities: string[]
}

interface ProvisionedDevice {
  id: string
  name: string
  type: string
  status: 'provisioning' | 'active' | 'failed' | 'pending_activation'
  provisionedAt: string
  activatedAt?: string
  credentials: {
    deviceId: string
    apiKey: string
    certificates?: string[]
  }
  configuration: any
}

const DeviceProvisioning: React.FC = () => {
  const { t } = useLanguage()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [currentStep, setCurrentStep] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<DeviceTemplate | null>(null)
  const [generatedCredentials, setGeneratedCredentials] = useState<any>(null)
  const [showQRCode, setShowQRCode] = useState(false)

  const steps: ProvisioningStep[] = [
    {
      id: 'template',
      title: 'Select Device Type',
      description: 'Choose the type of device you want to provision',
      completed: !!selectedTemplate,
      active: currentStep === 0
    },
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Configure device name and location',
      completed: false,
      active: currentStep === 1
    },
    {
      id: 'connectivity',
      title: 'Connectivity',
      description: 'Setup network and connection settings',
      completed: false,
      active: currentStep === 2
    },
    {
      id: 'configuration',
      title: 'Configuration',
      description: 'Configure device behavior and settings',
      completed: false,
      active: currentStep === 3
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Setup encryption and authentication',
      completed: false,
      active: currentStep === 4
    },
    {
      id: 'review',
      title: 'Review & Deploy',
      description: 'Review settings and provision device',
      completed: false,
      active: currentStep === 5
    }
  ]

  const deviceTemplates: DeviceTemplate[] = [
    {
      id: 'temperature_sensor',
      name: 'Temperature Sensor',
      type: 'temperature_sensor',
      description: 'Monitor temperature and humidity',
      icon: ThermometerSun,
      capabilities: ['temperature', 'humidity', 'battery'],
      defaultConfig: {
        deviceType: 'temperature_sensor',
        connectivity: {
          connectionType: 'wifi',
          networkConfig: {}
        },
        configuration: {
          reportingInterval: 300,
          enableTelemetry: true,
          enableAlerts: true,
          powerMode: 'eco'
        },
        security: {
          enableEncryption: true
        }
      }
    },
    {
      id: 'smart_light',
      name: 'Smart Light',
      type: 'smart_light',
      description: 'Control lighting with scheduling',
      icon: Lightbulb,
      capabilities: ['brightness', 'color', 'scheduling', 'motion'],
      defaultConfig: {
        deviceType: 'smart_light',
        connectivity: {
          connectionType: 'wifi',
          networkConfig: {}
        },
        configuration: {
          reportingInterval: 60,
          enableTelemetry: true,
          enableAlerts: false,
          powerMode: 'normal'
        },
        security: {
          enableEncryption: true
        }
      }
    },
    {
      id: 'motion_sensor',
      name: 'Motion Sensor',
      type: 'motion_sensor',
      description: 'Detect motion and occupancy',
      icon: Activity,
      capabilities: ['motion', 'occupancy', 'battery'],
      defaultConfig: {
        deviceType: 'motion_sensor',
        connectivity: {
          connectionType: 'zigbee',
          networkConfig: {}
        },
        configuration: {
          reportingInterval: 30,
          enableTelemetry: true,
          enableAlerts: true,
          powerMode: 'eco'
        },
        security: {
          enableEncryption: true
        }
      }
    },
    {
      id: 'smart_meter_electricity',
      name: 'Electricity Meter',
      type: 'smart_meter_electricity',
      description: 'Monitor power consumption',
      icon: Zap,
      capabilities: ['power', 'voltage', 'current', 'frequency'],
      defaultConfig: {
        deviceType: 'smart_meter_electricity',
        connectivity: {
          connectionType: 'ethernet',
          networkConfig: {}
        },
        configuration: {
          reportingInterval: 60,
          enableTelemetry: true,
          enableAlerts: true,
          powerMode: 'performance'
        },
        security: {
          enableEncryption: true
        }
      }
    },
    {
      id: 'smart_meter_water',
      name: 'Water Meter',
      type: 'smart_meter_water',
      description: 'Monitor water usage and flow',
      icon: Droplet,
      capabilities: ['flow', 'pressure', 'temperature', 'leak_detection'],
      defaultConfig: {
        deviceType: 'smart_meter_water',
        connectivity: {
          connectionType: 'lora',
          networkConfig: {}
        },
        configuration: {
          reportingInterval: 300,
          enableTelemetry: true,
          enableAlerts: true,
          powerMode: 'eco'
        },
        security: {
          enableEncryption: true
        }
      }
    },
    {
      id: 'smart_thermostat',
      name: 'Smart Thermostat',
      type: 'smart_thermostat',
      description: 'Control HVAC systems',
      icon: Home,
      capabilities: ['temperature', 'humidity', 'hvac_control', 'scheduling'],
      defaultConfig: {
        deviceType: 'smart_thermostat',
        connectivity: {
          connectionType: 'wifi',
          networkConfig: {}
        },
        configuration: {
          reportingInterval: 120,
          enableTelemetry: true,
          enableAlerts: true,
          powerMode: 'normal'
        },
        security: {
          enableEncryption: true
        }
      }
    }
  ]

  const form = useForm<DeviceProvisioningForm>({
    resolver: zodResolver(deviceProvisioningSchema),
    defaultValues: {
      deviceName: '',
      deviceType: '',
      description: '',
      location: {},
      connectivity: {
        connectionType: 'wifi',
        networkConfig: {}
      },
      configuration: {
        reportingInterval: 300,
        enableTelemetry: true,
        enableAlerts: true,
        powerMode: 'normal'
      },
      security: {
        enableEncryption: true
      }
    }
  })

  // Fetch provisioned devices
  const { data: provisionedDevices = [], refetch } = useQuery<ProvisionedDevice[]>({
    queryKey: ['provisioned-devices'],
    queryFn: async () => {
      const response = await api.get('/api/v1/devices/provisioned')
      return response.data
    }
  })

  // Provision device mutation
  const provisionMutation = useMutation({
    mutationFn: async (data: DeviceProvisioningForm) => {
      const response = await api.post('/api/v1/devices/provision', data)
      return response.data
    },
    onSuccess: (data) => {
      setGeneratedCredentials(data.credentials)
      queryClient.invalidateQueries({ queryKey: ['provisioned-devices'] })
      toast({
        title: 'Device Provisioned Successfully',
        description: 'Device credentials have been generated'
      })
      setCurrentStep(6) // Go to success step
    },
    onError: (error: any) => {
      toast({
        title: 'Provisioning Failed',
        description: error.response?.data?.message || 'Failed to provision device',
        variant: 'destructive'
      })
    }
  })

  // Delete device mutation
  const deleteMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      await api.delete(`/api/v1/devices/${deviceId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provisioned-devices'] })
      toast({
        title: 'Device Deleted',
        description: 'Device has been removed from the system'
      })
    }
  })

  const handleTemplateSelect = (template: DeviceTemplate) => {
    setSelectedTemplate(template)
    form.reset({
      ...form.getValues(),
      ...template.defaultConfig
    })
    setCurrentStep(1)
  }

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = (data: DeviceProvisioningForm) => {
    provisionMutation.mutate(data)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied to clipboard',
      description: 'Text has been copied to your clipboard'
    })
  }

  const generateQRCode = (credentials: any) => {
    const config = {
      deviceId: credentials.deviceId,
      apiKey: credentials.apiKey,
      endpoint: process.env.NEXT_PUBLIC_API_URL || 'https://api.ncq.com'
    }
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="8">
          ${JSON.stringify(config, null, 2).split('\n').slice(0, 15).join('\n')}
        </text>
      </svg>
    `)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Device Provisioning
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Add and configure new IoT devices
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Device
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Provision New Device</DialogTitle>
              <DialogDescription>
                Follow the steps to configure and provision a new IoT device
              </DialogDescription>
            </DialogHeader>

            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                      ${step.active ? 'bg-primary text-primary-foreground' : 
                        step.completed ? 'bg-green-500 text-white' : 
                        'bg-gray-200 text-gray-600'}
                    `}>
                      {step.completed ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`
                        w-12 h-1 mx-2
                        ${step.completed ? 'bg-green-500' : 'bg-gray-200'}
                      `} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <h3 className="font-semibold">{steps[currentStep]?.title}</h3>
                <p className="text-sm text-muted-foreground">{steps[currentStep]?.description}</p>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 0: Template Selection */}
              {currentStep === 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {deviceTemplates.map((template) => {
                    const Icon = template.icon
                    return (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <Icon className="h-8 w-8 text-primary" />
                            <div>
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {template.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-xs font-medium">Capabilities:</div>
                            <div className="flex flex-wrap gap-1">
                              {template.capabilities.map((capability) => (
                                <Badge key={capability} variant="outline" className="text-xs">
                                  {capability}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="deviceName">Device Name *</Label>
                    <Input
                      id="deviceName"
                      {...form.register('deviceName')}
                      placeholder="e.g., Office Temperature Sensor"
                    />
                    {form.formState.errors.deviceName && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.deviceName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deviceType">Device Type</Label>
                    <Input
                      id="deviceType"
                      {...form.register('deviceType')}
                      value={selectedTemplate?.type || ''}
                      disabled
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...form.register('description')}
                      placeholder="Optional description of the device"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="building">Building</Label>
                    <Input
                      id="building"
                      {...form.register('location.building')}
                      placeholder="e.g., Main Office"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Input
                      id="floor"
                      {...form.register('location.floor')}
                      placeholder="e.g., 2nd Floor"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      {...form.register('location.room')}
                      placeholder="e.g., Conference Room A"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...form.register('location.address')}
                      placeholder="e.g., 123 King Fahd Rd, Riyadh"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Connectivity */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="connectionType">Connection Type</Label>
                    <Select
                      value={form.watch('connectivity.connectionType')}
                      onValueChange={(value: any) => 
                        form.setValue('connectivity.connectionType', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wifi">Wi-Fi</SelectItem>
                        <SelectItem value="ethernet">Ethernet</SelectItem>
                        <SelectItem value="cellular">Cellular</SelectItem>
                        <SelectItem value="lora">LoRa</SelectItem>
                        <SelectItem value="zigbee">Zigbee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {form.watch('connectivity.connectionType') === 'wifi' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="ssid">Wi-Fi SSID</Label>
                        <Input
                          id="ssid"
                          {...form.register('connectivity.networkConfig.ssid')}
                          placeholder="Network name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Wi-Fi Password</Label>
                        <Input
                          id="password"
                          type="password"
                          {...form.register('connectivity.networkConfig.password')}
                          placeholder="Network password"
                        />
                      </div>
                    </div>
                  )}

                  {form.watch('connectivity.connectionType') === 'ethernet' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="staticIp">Static IP (optional)</Label>
                        <Input
                          id="staticIp"
                          {...form.register('connectivity.networkConfig.staticIp')}
                          placeholder="192.168.1.100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subnet">Subnet Mask</Label>
                        <Input
                          id="subnet"
                          {...form.register('connectivity.networkConfig.subnet')}
                          placeholder="255.255.255.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gateway">Gateway</Label>
                        <Input
                          id="gateway"
                          {...form.register('connectivity.networkConfig.gateway')}
                          placeholder="192.168.1.1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dns">DNS Server</Label>
                        <Input
                          id="dns"
                          {...form.register('connectivity.networkConfig.dns')}
                          placeholder="8.8.8.8"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Configuration */}
              {currentStep === 3 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reportingInterval">Reporting Interval (seconds)</Label>
                    <Input
                      id="reportingInterval"
                      type="number"
                      {...form.register('configuration.reportingInterval', { valueAsNumber: true })}
                      min={1}
                      max={3600}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="powerMode">Power Mode</Label>
                    <Select
                      value={form.watch('configuration.powerMode')}
                      onValueChange={(value: any) => 
                        form.setValue('configuration.powerMode', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eco">Eco Mode</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableTelemetry"
                        checked={form.watch('configuration.enableTelemetry')}
                        onCheckedChange={(checked) =>
                          form.setValue('configuration.enableTelemetry', checked)
                        }
                      />
                      <Label htmlFor="enableTelemetry">Enable Telemetry</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableAlerts"
                        checked={form.watch('configuration.enableAlerts')}
                        onCheckedChange={(checked) =>
                          form.setValue('configuration.enableAlerts', checked)
                        }
                      />
                      <Label htmlFor="enableAlerts">Enable Alerts</Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Security */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableEncryption"
                      checked={form.watch('security.enableEncryption')}
                      onCheckedChange={(checked) =>
                        form.setValue('security.enableEncryption', checked)
                      }
                    />
                    <Label htmlFor="enableEncryption">Enable End-to-End Encryption</Label>
                  </div>

                  {form.watch('security.enableEncryption') && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                            Security Configuration
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            Encryption keys and certificates will be automatically generated for this device. 
                            Make sure to securely store the generated credentials.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Review Configuration</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Device Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span className="font-medium">{form.watch('deviceName')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium">{form.watch('deviceType')}</span>
                        </div>
                        {form.watch('location.building') && (
                          <div className="flex justify-between">
                            <span>Location:</span>
                            <span className="font-medium">
                              {[
                                form.watch('location.building'),
                                form.watch('location.floor'),
                                form.watch('location.room')
                              ].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Connection:</span>
                          <span className="font-medium capitalize">
                            {form.watch('connectivity.connectionType')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reporting:</span>
                          <span className="font-medium">
                            {form.watch('configuration.reportingInterval')}s
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Power Mode:</span>
                          <span className="font-medium capitalize">
                            {form.watch('configuration.powerMode')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Encryption:</span>
                          <span className="font-medium">
                            {form.watch('security.enableEncryption') ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Success Step */}
              {currentStep === 6 && generatedCredentials && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Device Provisioned Successfully!</h3>
                    <p className="text-muted-foreground">
                      Your device has been provisioned and is ready for activation.
                    </p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Device Credentials
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label>Device ID</Label>
                        <div className="flex items-center gap-2">
                          <Input value={generatedCredentials.deviceId} readOnly />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generatedCredentials.deviceId)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>API Key</Label>
                        <div className="flex items-center gap-2">
                          <Input value={generatedCredentials.apiKey} readOnly type="password" />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generatedCredentials.apiKey)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowQRCode(true)}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          Show QR Code
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const config = JSON.stringify(generatedCredentials, null, 2)
                            const blob = new Blob([config], { type: 'application/json' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `device-config-${generatedCredentials.deviceId}.json`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Config
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 6 && (
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  
                  {currentStep === 5 ? (
                    <Button 
                      type="submit" 
                      disabled={provisionMutation.isPending}
                    >
                      {provisionMutation.isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Provision Device
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      disabled={currentStep === 0 && !selectedTemplate}
                    >
                      Next
                    </Button>
                  )}
                </div>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Provisioned Devices List */}
      <Card className="ncq-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Provisioned Devices</CardTitle>
              <CardDescription>
                {provisionedDevices.length} devices have been provisioned
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {provisionedDevices.length === 0 ? (
            <div className="text-center py-8">
              <Cpu className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No devices provisioned</h3>
              <p className="text-muted-foreground">
                Start by provisioning your first IoT device.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {provisionedDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Cpu className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{device.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {device.type.replace(/_/g, ' ')} • Provisioned {new Date(device.provisionedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        device.status === 'active' ? 'default' :
                        device.status === 'failed' ? 'destructive' :
                        'secondary'
                      }
                    >
                      {device.status.replace('_', ' ')}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(device.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      {showQRCode && generatedCredentials && (
        <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Device Configuration QR Code</DialogTitle>
              <DialogDescription>
                Scan this QR code with your device to automatically configure it
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center p-4">
              <img
                src={generateQRCode(generatedCredentials)}
                alt="Device Configuration QR Code"
                className="w-48 h-48 border rounded"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default DeviceProvisioning