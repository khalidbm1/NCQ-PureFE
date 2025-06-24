import { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Plane, Text, Line, useAnimations, Float } from '@react-three/drei'
import * as THREE from 'three'
import { 
  Building2, Zap, Thermometer, Lightbulb, DoorOpen, 
  Users, Car, ShieldCheck, AlertTriangle, Activity,
  TrendingUp, Battery, Gauge, TreePine
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import { toast } from 'sonner'

// Building stats
const buildingStats = {
  totalFloors: 7,
  parkingLevels: 2,
  activeDevices: 342,
  energyConsumption: 245.7,
  occupancy: 1234,
  parkingOccupied: 156,
  parkingTotal: 200,
  temperature: 22.5,
  alerts: 3
}

// Sensor data
const sensors = {
  motion: [
    { id: 'M1', floor: 0, position: [2, 0.5, 0], detected: true },
    { id: 'M2', floor: 1, position: [-2, 1.5, 1], detected: false },
    { id: 'M3', floor: 2, position: [0, 2.5, -1], detected: true },
  ],
  lighting: [
    { id: 'L1', floor: 0, position: [1, 0.8, 1], on: true },
    { id: 'L2', floor: 1, position: [-1, 1.8, -1], on: false },
    { id: 'L3', floor: 2, position: [2, 2.8, 2], on: true },
  ],
  parking: [
    { id: 'P1', level: -1, position: [-2, -1, 0], occupied: true },
    { id: 'P2', level: -1, position: [-1, -1, 0], occupied: false },
    { id: 'P3', level: -1, position: [0, -1, 0], occupied: true },
    { id: 'P4', level: -2, position: [1, -2, 0], occupied: false },
    { id: 'P5', level: -2, position: [2, -2, 0], occupied: true },
  ]
}

// 3D Components
function Floor({ position, size = [6, 0.1, 6] }: { position: [number, number, number], size?: [number, number, number] }) {
  return (
    <Box position={position} args={size}>
      <meshStandardMaterial color="#e0e0e0" opacity={0.7} transparent />
    </Box>
  )
}

function MotionSensor({ position, detected }: { position: [number, number, number], detected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current && detected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2
    }
  })

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.1, 16, 16]}>
        <meshStandardMaterial color={detected ? "#ff0000" : "#00ff00"} emissive={detected ? "#ff0000" : "#00ff00"} emissiveIntensity={0.5} />
      </Sphere>
      {detected && (
        <Sphere args={[0.3, 16, 16]}>
          <meshStandardMaterial color="#ff0000" opacity={0.3} transparent />
        </Sphere>
      )}
    </group>
  )
}

function Light({ position, on }: { position: [number, number, number], on: boolean }) {
  return (
    <group position={position}>
      <Box args={[0.3, 0.05, 0.3]}>
        <meshStandardMaterial color="#333333" />
      </Box>
      <pointLight position={[0, -0.1, 0]} intensity={on ? 1 : 0} color="#ffffaa" />
      <Sphere position={[0, -0.1, 0]} args={[0.1, 16, 16]}>
        <meshStandardMaterial 
          color={on ? "#ffffaa" : "#666666"} 
          emissive={on ? "#ffffaa" : "#000000"} 
          emissiveIntensity={on ? 1 : 0}
        />
      </Sphere>
    </group>
  )
}

function ParkingSpot({ position, occupied }: { position: [number, number, number], occupied: boolean }) {
  return (
    <group position={position}>
      <Box args={[0.8, 0.02, 1.2]}>
        <meshStandardMaterial color={occupied ? "#ff4444" : "#44ff44"} />
      </Box>
      {occupied && (
        <Box position={[0, 0.3, 0]} args={[0.6, 0.4, 0.8]}>
          <meshStandardMaterial color="#4444ff" />
        </Box>
      )}
    </group>
  )
}

function Gate({ position, open }: { position: [number, number, number], open: boolean }) {
  const gateRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (gateRef.current) {
      gateRef.current.rotation.y = open ? Math.PI / 2 : 0
    }
  })

  return (
    <group position={position}>
      <Box position={[0, 0.5, 0]} args={[0.05, 1, 2]}>
        <meshStandardMaterial color="#666666" />
      </Box>
      <Box ref={gateRef} position={[0, 0.5, 0]} args={[1.5, 0.8, 0.05]}>
        <meshStandardMaterial color="#ff6600" />
      </Box>
    </group>
  )
}

function Person({ position, path }: { position: [number, number, number], path?: [number, number, number][] }) {
  const meshRef = useRef<THREE.Group>(null)
  const [currentPos, setCurrentPos] = useState(0)
  
  useFrame((state) => {
    if (meshRef.current && path && path.length > 1) {
      const time = state.clock.elapsedTime * 0.5
      const index = Math.floor(time) % path.length
      const nextIndex = (index + 1) % path.length
      const t = time % 1
      
      const x = path[index][0] + (path[nextIndex][0] - path[index][0]) * t
      const y = path[index][1] + (path[nextIndex][1] - path[index][1]) * t
      const z = path[index][2] + (path[nextIndex][2] - path[index][2]) * t
      
      meshRef.current.position.set(x, y, z)
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <Sphere position={[0, 0.5, 0]} args={[0.1, 16, 16]}>
        <meshStandardMaterial color="#ffaa00" />
      </Sphere>
      <Box position={[0, 0.25, 0]} args={[0.15, 0.3, 0.1]}>
        <meshStandardMaterial color="#0066ff" />
      </Box>
    </group>
  )
}

function Building3D() {
  const [gateOpen, setGateOpen] = useState(false)

  // Simulate gate opening
  setTimeout(() => setGateOpen(true), 3000)
  setTimeout(() => setGateOpen(false), 8000)

  return (
    <Canvas camera={{ position: [10, 8, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      {/* Building Structure */}
      {/* Parking Levels */}
      <Floor position={[0, -2, 0]} size={[8, 0.1, 8]} />
      <Floor position={[0, -1, 0]} size={[8, 0.1, 8]} />
      
      {/* Main Floors */}
      {[0, 1, 2, 3, 4].map((floor) => (
        <Floor key={floor} position={[0, floor, 0]} />
      ))}
      
      {/* Parking Spots */}
      {sensors.parking.map((spot) => (
        <ParkingSpot key={spot.id} position={spot.position} occupied={spot.occupied} />
      ))}
      
      {/* Gate */}
      <Gate position={[4, -1, 0]} open={gateOpen} />
      
      {/* Motion Sensors */}
      {sensors.motion.map((sensor) => (
        <MotionSensor key={sensor.id} position={sensor.position} detected={sensor.detected} />
      ))}
      
      {/* Lights */}
      {sensors.lighting.map((light) => (
        <Light key={light.id} position={light.position} on={light.on} />
      ))}
      
      {/* Animated People */}
      <Person position={[0, 0, 0]} path={[[0, 0, 0], [2, 0, 0], [2, 0, 2], [0, 0, 2]]} />
      <Person position={[1, 1, 1]} path={[[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]]} />
      <Person position={[-2, -1, 0]} path={[[-2, -1, 0], [2, -1, 0]]} />
      
      {/* Building Frame */}
      <Box position={[0, 1.5, -3]} args={[6, 5, 0.1]}>
        <meshStandardMaterial color="#666666" opacity={0.3} transparent />
      </Box>
      <Box position={[0, 1.5, 3]} args={[6, 5, 0.1]}>
        <meshStandardMaterial color="#666666" opacity={0.3} transparent />
      </Box>
      <Box position={[-3, 1.5, 0]} args={[0.1, 5, 6]}>
        <meshStandardMaterial color="#666666" opacity={0.3} transparent />
      </Box>
      <Box position={[3, 1.5, 0]} args={[0.1, 5, 6]}>
        <meshStandardMaterial color="#666666" opacity={0.3} transparent />
      </Box>
    </Canvas>
  )
}

// Stat Card Component
interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: any
  trend?: number
  color?: string
}

const StatCard = ({ title, value, description, icon: Icon, trend, color = "text-muted-foreground" }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {trend && (
        <div className="flex items-center mt-1">
          <TrendingUp className={`h-3 w-3 mr-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        </div>
      )}
    </CardContent>
  </Card>
)

export default function SmartBuildings() {
  const [selectedView, setSelectedView] = useState('overview')
  const [simulationActive, setSimulationActive] = useState(true)

  // Simulate sensor triggers
  const triggerMotionSensor = () => {
    toast.info('Motion detected in Zone A - Floor 2', {
      description: 'Lights automatically turned on',
      icon: <Users className="h-4 w-4" />
    })
  }

  const triggerParkingAlert = () => {
    toast.success('Parking spot B2-15 now available', {
      description: 'Gate 1 opening for incoming vehicle',
      icon: <Car className="h-4 w-4" />
    })
  }

  const triggerEnergyAlert = () => {
    toast.warning('High energy consumption detected', {
      description: 'HVAC system optimizing for efficiency',
      icon: <Zap className="h-4 w-4" />
    })
  }

  // Auto-trigger notifications
  if (simulationActive) {
    setTimeout(triggerMotionSensor, 2000)
    setTimeout(triggerParkingAlert, 5000)
    setTimeout(triggerEnergyAlert, 8000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Smart Buildings</h1>
          <p className="text-muted-foreground">
            IoT-powered building automation and management
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setSimulationActive(!simulationActive)}
          >
            {simulationActive ? 'Pause' : 'Resume'} Simulation
          </Button>
          <Button onClick={() => toast.success('Emergency protocol activated')}>
            <ShieldCheck className="w-4 h-4 mr-2" />
            Emergency Mode
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Energy Usage"
          value={`${buildingStats.energyConsumption} kW`}
          description="Real-time consumption"
          icon={Zap}
          trend={-12.5}
          color="text-yellow-500"
        />
        <StatCard
          title="Building Occupancy"
          value={buildingStats.occupancy}
          description="People in building"
          icon={Users}
          trend={8.2}
          color="text-blue-500"
        />
        <StatCard
          title="Parking Available"
          value={`${buildingStats.parkingTotal - buildingStats.parkingOccupied}/${buildingStats.parkingTotal}`}
          description={`${Math.round((buildingStats.parkingOccupied / buildingStats.parkingTotal) * 100)}% occupied`}
          icon={Car}
          color="text-green-500"
        />
        <StatCard
          title="Active Alerts"
          value={buildingStats.alerts}
          description="Requiring attention"
          icon={AlertTriangle}
          color="text-red-500"
        />
      </div>

      {/* Main Content */}
      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="parking">Parking</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="climate">Climate</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* 3D Building Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Building IoT Simulation</CardTitle>
              <CardDescription>
                Real-time 3D visualization of sensors and automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full rounded-lg overflow-hidden bg-gray-100">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                      <p>Loading 3D visualization...</p>
                    </div>
                  </div>
                }>
                  <Building3D />
                </Suspense>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                  <span className="text-sm">Occupied/Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                  <span className="text-sm">Motion Detected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  <span className="text-sm">Vehicle</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  All building systems at a glance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4" />
                      <span className="text-sm">Lighting System</span>
                    </div>
                    <Badge variant="default">Automated</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4" />
                      <span className="text-sm">HVAC Control</span>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DoorOpen className="h-4 w-4" />
                      <span className="text-sm">Access Control</span>
                    </div>
                    <Badge variant="default">Secured</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4" />
                      <span className="text-sm">Parking Gates</span>
                    </div>
                    <Badge variant="secondary">2 Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest sensor triggers and automations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Motion detected - Floor 3</p>
                      <p className="text-xs text-muted-foreground">Lights activated automatically</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Car className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Vehicle entered parking</p>
                      <p className="text-xs text-muted-foreground">Gate 1 - License plate recognized</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Thermometer className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Temperature adjusted</p>
                      <p className="text-xs text-muted-foreground">Zone B - Set to 22°C</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Energy optimization</p>
                      <p className="text-xs text-muted-foreground">Floor 4 - Reduced consumption by 15%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Energy Management</CardTitle>
              <CardDescription>
                Real-time power consumption and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Total Consumption</p>
                    <p className="text-2xl font-bold">{buildingStats.energyConsumption} kW</p>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Solar Generation</p>
                    <p className="text-2xl font-bold">45.2 kW</p>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Grid Usage</p>
                    <p className="text-2xl font-bold">200.5 kW</p>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Consumption by System</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">HVAC System</span>
                      <span className="text-sm font-medium">98.5 kW (40%)</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lighting</span>
                      <span className="text-sm font-medium">49.1 kW (20%)</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Elevators</span>
                      <span className="text-sm font-medium">36.9 kW (15%)</span>
                    </div>
                    <Progress value={15} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Other Systems</span>
                      <span className="text-sm font-medium">61.4 kW (25%)</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Smart Parking Management</CardTitle>
              <CardDescription>
                Real-time parking availability and gate control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Level B1</p>
                      <p className="text-sm text-muted-foreground">General Parking</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">32/50</p>
                      <Badge variant="secondary">64% Full</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Level B2</p>
                      <p className="text-sm text-muted-foreground">Reserved Parking</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">124/150</p>
                      <Badge variant="destructive">83% Full</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Gate Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm">Gate 1 - Main Entrance</span>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm">Gate 2 - Service Entry</span>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-sm">Gate 3 - Emergency Exit</span>
                      </div>
                      <Badge variant="secondary">Standby</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Recent Vehicle Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span>Vehicle ABC-1234 entered via Gate 1</span>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span>Vehicle XYZ-5678 exited via Gate 2</span>
                    <span className="text-xs text-muted-foreground">5 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span>Unauthorized vehicle blocked at Gate 1</span>
                    <span className="text-xs text-muted-foreground">12 min ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Access Control</CardTitle>
              <CardDescription>
                Monitor building access and security systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">All Secure</p>
                  <p className="text-sm text-muted-foreground">No threats detected</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-sm text-muted-foreground">People in building</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <DoorOpen className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-sm text-muted-foreground">Access points active</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Recent Access Events</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="default">Authorized</Badge>
                      <span className="text-sm">Employee #1234 - Main entrance</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Just now</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="destructive">Denied</Badge>
                      <span className="text-sm">Unknown card - Server room</span>
                    </div>
                    <span className="text-xs text-muted-foreground">3 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="default">Authorized</Badge>
                      <span className="text-sm">Visitor #V-789 - Reception</span>
                    </div>
                    <span className="text-xs text-muted-foreground">8 min ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="climate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Climate Control</CardTitle>
              <CardDescription>
                HVAC and environmental management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Thermometer className="h-4 w-4" />
                    <span className="text-sm font-medium">Temperature</span>
                  </div>
                  <p className="text-2xl font-bold">{buildingStats.temperature}°C</p>
                  <Badge variant="default">Optimal</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Droplets className="h-4 w-4" />
                    <span className="text-sm font-medium">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold">45%</p>
                  <Badge variant="default">Comfortable</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Wind className="h-4 w-4" />
                    <span className="text-sm font-medium">Air Quality</span>
                  </div>
                  <p className="text-2xl font-bold">Good</p>
                  <Badge variant="default">AQI: 42</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <TreePine className="h-4 w-4" />
                    <span className="text-sm font-medium">CO2 Level</span>
                  </div>
                  <p className="text-2xl font-bold">420 ppm</p>
                  <Badge variant="default">Normal</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Zone Control</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {['Zone A - Offices', 'Zone B - Conference', 'Zone C - Lobby', 'Zone D - Cafeteria'].map((zone) => (
                    <div key={zone} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{zone}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">22°C</span>
                        <Badge variant="outline" className="text-xs">Auto</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}