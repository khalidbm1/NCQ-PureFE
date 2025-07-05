import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Building3DView from '../components/Building3DView';
import Building3DViewEnhanced from '../components/Building3DViewEnhanced';
import { 
  Building2, 
  Thermometer, 
  Wifi, 
  Battery, 
  Wind,
  Droplets,
  AlertCircle,
  Settings,
  Lightbulb,
  MapPin,
  Users,
  Play,
  Pause,
  Shield,
  Zap,
  Camera,
  Volume2,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Car,
  CreditCard,
  QrCode,
  Navigation,
  UserCheck,
  Store,
  Clock,
  Star,
  Smartphone,
  Key,
  Eye,
  Waves,
  Tv,
  PersonStanding,
  Glasses
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function SmartBuildings() {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'sensors' | 'analytics' | 'automation' | 'retail' | 'parking' | 'security' | 'vr'>('overview');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);


  // Handle VR activation
  const handleVRToggle = () => {
    console.log('SmartBuildings: handleVRToggle called! Current isVRActive:', isVRActive);
    alert('SmartBuildings: VR toggle called! Current state: ' + isVRActive + ', will change to: ' + !isVRActive);
    setIsVRActive(!isVRActive);
    console.log('SmartBuildings: setIsVRActive called with:', !isVRActive);
  };

  const metrics = [
    { title: 'Active Buildings', value: '24', change: '+3', icon: Building2, color: 'text-blue-400', bgColor: 'bg-blue-950/50 border border-blue-800/50' },
    { title: 'Energy Savings', value: '32%', change: '+5%', icon: Battery, color: 'text-green-400', bgColor: 'bg-green-950/50 border border-green-800/50' },
    { title: 'Connected Devices', value: '1,847', change: '+127', icon: Wifi, color: 'text-purple-400', bgColor: 'bg-purple-950/50 border border-purple-800/50' },
    { title: 'Active Alerts', value: '7', change: '-2', icon: AlertCircle, color: 'text-orange-400', bgColor: 'bg-orange-950/50 border border-orange-800/50' }
  ];

  const buildings = [
    { id: 'tech-tower-a', name: 'Tech Tower A', location: 'Downtown District', floors: 45, occupancy: 87, status: 'optimal' },
    { id: 'innovation-center', name: 'Innovation Center', location: 'Business Park', floors: 12, occupancy: 92, status: 'warning' },
    { id: 'corporate-plaza', name: 'Corporate Plaza', location: 'Financial District', floors: 32, occupancy: 76, status: 'optimal' },
    { id: 'smart-residence', name: 'Smart Residence Complex', location: 'Residential Area', floors: 25, occupancy: 94, status: 'maintenance' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400 bg-green-950/50 border border-green-800/50';
      case 'warning': return 'text-yellow-400 bg-yellow-950/50 border border-yellow-800/50';
      case 'maintenance': return 'text-orange-400 bg-orange-950/50 border border-orange-800/50';
      default: return 'text-gray-400 bg-gray-950/50 border border-gray-800/50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Smart Buildings Platform
            </h1>
            <p className="text-gray-400 mt-2">
              Monitor and manage all connected buildings with real-time insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={isSimulating ? "destructive" : "default"}
              onClick={() => setIsSimulating(!isSimulating)}
              className={isSimulating 
                ? "bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400" 
                : "bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-400"
              }
            >
              {isSimulating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
            </Button>
            <Button 
              variant="outline"
              className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-gray-300"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Add Building
            </Button>
          </div>
        </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{metric.title}</CardTitle>
                <div className={`${metric.bgColor} p-2 rounded-lg`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-gray-500">{metric.change} from last month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'sensors', 'analytics', 'automation', 'retail', 'parking', 'security', 'vr'].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                selectedView === view
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              {view}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on selected view */}
      <AnimatePresence mode="wait">
        {selectedView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-100">Building Portfolio</CardTitle>
                <CardDescription className="text-gray-500">Monitor and manage all connected buildings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                  {buildings.map((building) => (
                    <motion.div
                      key={building.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-900 hover:border-gray-700 transition-all backdrop-blur-sm"
                      onClick={() => setSelectedBuilding(selectedBuilding === building.id ? null : building.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-100">{building.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {building.location}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(building.status)}`}>
                          {building.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500">Floors</p>
                          <p className="font-medium text-gray-300">{building.floors}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Occupancy</p>
                          <p className="font-medium text-gray-300">{building.occupancy}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <p className="font-medium capitalize text-gray-300">{building.status}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedView === 'sensors' && (
          <motion.div
            key="sensors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Live Sensor Overview */}
            <div className="grid gap-6 lg:grid-cols-4">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-100">Environmental Sensors</CardTitle>
                  <CardDescription className="text-gray-500">Climate and air quality monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        name: 'Temperature', 
                        value: 22.5, 
                        unit: '°C', 
                        icon: Thermometer, 
                        color: 'text-red-500',
                        status: 'optimal',
                        trend: 'stable',
                        range: '20-24°C',
                        building: 'All Buildings',
                        lastUpdate: '2 min ago'
                      },
                      { 
                        name: 'Humidity', 
                        value: 45, 
                        unit: '%', 
                        icon: Droplets, 
                        color: 'text-blue-500',
                        status: 'optimal',
                        trend: 'decreasing',
                        range: '40-60%',
                        building: 'All Buildings',
                        lastUpdate: '1 min ago'
                      },
                      { 
                        name: 'Air Quality', 
                        value: 85, 
                        unit: 'AQI', 
                        icon: Wind, 
                        color: 'text-green-500',
                        status: 'good',
                        trend: 'improving',
                        range: '0-100',
                        building: 'Tech Tower A',
                        lastUpdate: '30 sec ago'
                      },
                      { 
                        name: 'CO₂ Level', 
                        value: 420, 
                        unit: 'ppm', 
                        icon: Wind, 
                        color: 'text-emerald-500',
                        status: 'normal',
                        trend: 'stable',
                        range: '< 1000ppm',
                        building: 'Innovation Center',
                        lastUpdate: '45 sec ago'
                      }
                    ].map((sensor, index) => (
                      <motion.div
                        key={sensor.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-gray-900/70 border border-gray-800 rounded-lg space-y-2 hover:bg-gray-900 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <sensor.icon className={`w-4 h-4 ${sensor.color}`} />
                            <span className="font-medium text-sm text-gray-200">{sensor.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {sensor.trend === 'increasing' && <TrendingUp className="w-3 h-3 text-red-500" />}
                            {sensor.trend === 'decreasing' && <TrendingDown className="w-3 h-3 text-blue-500" />}
                            {sensor.trend === 'stable' && <Minus className="w-3 h-3 text-gray-500" />}
                            {sensor.trend === 'improving' && <TrendingUp className="w-3 h-3 text-green-500" />}
                          </div>
                        </div>
                        <div className="text-xl font-bold text-gray-100">
                          {sensor.value} <span className="text-xs text-gray-500">{sensor.unit}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Range: {sensor.range} • {sensor.building}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`px-2 py-1 rounded ${
                            sensor.status === 'optimal' ? 'bg-green-950/50 text-green-400 border border-green-800/50' :
                            sensor.status === 'good' ? 'bg-blue-950/50 text-blue-400 border border-blue-800/50' :
                            sensor.status === 'normal' ? 'bg-gray-800/50 text-gray-400 border border-gray-700/50' :
                            'bg-yellow-950/50 text-yellow-400 border border-yellow-800/50'
                          }`}>
                            {sensor.status}
                          </span>
                          <span className="text-gray-600">{sensor.lastUpdate}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-100">Energy & Power</CardTitle>
                  <CardDescription className="text-gray-500">Electrical consumption monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        name: 'Total Power', 
                        value: 1247, 
                        unit: 'kW', 
                        icon: Zap, 
                        color: 'text-yellow-600',
                        status: 'normal',
                        trend: 'stable',
                        peak: '1,450 kW',
                        efficiency: '94%',
                        lastUpdate: '10 sec ago'
                      },
                      { 
                        name: 'HVAC Load', 
                        value: 687, 
                        unit: 'kW', 
                        icon: Wind, 
                        color: 'text-blue-600',
                        status: 'optimal',
                        trend: 'decreasing',
                        peak: '890 kW',
                        efficiency: '92%',
                        lastUpdate: '15 sec ago'
                      },
                      { 
                        name: 'Lighting Load', 
                        value: 234, 
                        unit: 'kW', 
                        icon: Lightbulb, 
                        color: 'text-amber-500',
                        status: 'optimal',
                        trend: 'stable',
                        peak: '340 kW',
                        efficiency: '97%',
                        lastUpdate: '20 sec ago'
                      },
                      { 
                        name: 'Equipment Load', 
                        value: 326, 
                        unit: 'kW', 
                        icon: Settings, 
                        color: 'text-gray-600',
                        status: 'normal',
                        trend: 'increasing',
                        peak: '420 kW',
                        efficiency: '89%',
                        lastUpdate: '5 sec ago'
                      }
                    ].map((sensor, index) => (
                      <motion.div
                        key={sensor.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index + 4) * 0.1 }}
                        className="p-3 bg-gray-900/70 border border-gray-800 rounded-lg space-y-2 hover:bg-gray-900 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <sensor.icon className={`w-4 h-4 ${sensor.color}`} />
                            <span className="font-medium text-sm text-gray-200">{sensor.name}</span>
                          </div>
                          <span className="text-xs bg-gray-800/50 text-gray-400 px-2 py-1 rounded border border-gray-700/50">
                            {sensor.efficiency}
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-100">
                          {sensor.value.toLocaleString()} <span className="text-xs text-gray-500">{sensor.unit}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(sensor.value / parseInt(sensor.peak)) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className={`h-full rounded-full ${sensor.color.replace('text-', 'bg-')}`}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          Peak today: {sensor.peak}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-100">Occupancy & Security</CardTitle>
                  <CardDescription className="text-gray-500">People and safety monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        name: 'Total Occupancy', 
                        value: 1842, 
                        unit: 'people', 
                        icon: Users, 
                        color: 'text-purple-600',
                        status: 'normal',
                        capacity: '2,200',
                        percentage: 84,
                        trend: 'increasing',
                        lastUpdate: '1 min ago'
                      },
                      { 
                        name: 'Motion Sensors', 
                        value: 234, 
                        unit: 'active', 
                        icon: Activity, 
                        color: 'text-green-600',
                        status: 'optimal',
                        capacity: '240',
                        percentage: 98,
                        trend: 'stable',
                        lastUpdate: '30 sec ago'
                      },
                      { 
                        name: 'Access Control', 
                        value: 156, 
                        unit: 'points', 
                        icon: Shield, 
                        color: 'text-blue-700',
                        status: 'secure',
                        capacity: '160',
                        percentage: 98,
                        trend: 'stable',
                        lastUpdate: '2 min ago'
                      },
                      { 
                        name: 'Emergency Exits', 
                        value: 48, 
                        unit: 'clear', 
                        icon: AlertCircle, 
                        color: 'text-green-700',
                        status: 'all clear',
                        capacity: '48',
                        percentage: 100,
                        trend: 'stable',
                        lastUpdate: '45 sec ago'
                      }
                    ].map((sensor, index) => (
                      <motion.div
                        key={sensor.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index + 8) * 0.1 }}
                        className="p-3 bg-gray-900/70 border border-gray-800 rounded-lg space-y-2 hover:bg-gray-900 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <sensor.icon className={`w-4 h-4 ${sensor.color}`} />
                            <span className="font-medium text-sm text-gray-200">{sensor.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            sensor.status === 'optimal' || sensor.status === 'secure' || sensor.status === 'all clear' 
                              ? 'bg-green-950/50 text-green-400 border border-green-800/50' 
                              : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                          }`}>
                            {sensor.status}
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-100">
                          {sensor.value.toLocaleString()} <span className="text-xs text-gray-500">{sensor.unit}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${sensor.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className={`h-full rounded-full ${sensor.color.replace('text-', 'bg-')}`}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          Capacity: {sensor.capacity} • {sensor.percentage}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-100">Building Systems</CardTitle>
                  <CardDescription className="text-gray-500">Infrastructure and equipment status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        name: 'Fire Safety', 
                        value: 'Normal', 
                        status: 'all systems operational',
                        icon: Shield, 
                        color: 'text-green-600',
                        devices: '142 detectors',
                        lastTest: '7 days ago',
                        nextTest: 'in 23 days'
                      },
                      { 
                        name: 'Elevators', 
                        value: '12/12', 
                        status: 'operational',
                        icon: Activity, 
                        color: 'text-blue-600',
                        devices: '12 elevators',
                        lastTest: '2 days ago',
                        nextTest: 'in 5 days'
                      },
                      { 
                        name: 'Water Systems', 
                        value: 'Normal', 
                        status: 'pressure optimal',
                        icon: Droplets, 
                        color: 'text-cyan-600',
                        devices: '28 sensors',
                        lastTest: '1 day ago',
                        nextTest: 'in 6 days'
                      },
                      { 
                        name: 'Network', 
                        value: '99.8%', 
                        status: 'uptime excellent',
                        icon: Wifi, 
                        color: 'text-purple-600',
                        devices: '1,247 devices',
                        lastTest: '1 hour ago',
                        nextTest: 'continuous'
                      },
                      { 
                        name: 'Audio System', 
                        value: 'Active', 
                        status: 'all zones online',
                        icon: Volume2, 
                        color: 'text-orange-600',
                        devices: '89 speakers',
                        lastTest: '3 days ago',
                        nextTest: 'in 4 days'
                      },
                      { 
                        name: 'Surveillance', 
                        value: '156/156', 
                        status: 'recording active',
                        icon: Camera, 
                        color: 'text-gray-700',
                        devices: '156 cameras',
                        lastTest: '1 day ago',
                        nextTest: 'in 6 days'
                      }
                    ].map((system, index) => (
                      <motion.div
                        key={system.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index + 12) * 0.1 }}
                        className="p-3 bg-gray-900/70 border border-gray-800 rounded-lg space-y-2 hover:bg-gray-900 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <system.icon className={`w-4 h-4 ${system.color}`} />
                            <span className="font-medium text-sm">{system.name}</span>
                          </div>
                          <span className="text-xs bg-green-950/50 text-green-400 px-2 py-1 rounded border border-green-800/50">
                            online
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-100">{system.value}</div>
                        <div className="text-xs text-gray-500">{system.status}</div>
                        <div className="text-xs text-gray-500 border-t border-gray-800 pt-2">
                          <div className="flex justify-between">
                            <span>{system.devices}</span>
                            <span>Last: {system.lastTest}</span>
                          </div>
                          <div className="text-right mt-1">Next: {system.nextTest}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sensor Network Summary */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-100">Sensor Network Summary</CardTitle>
                <CardDescription className="text-gray-500">Real-time overview of all 1,847 connected sensors across 24 buildings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
                  {[
                    { category: 'Environmental', count: 456, active: 452, icon: Thermometer, color: 'text-green-600' },
                    { category: 'Energy', count: 234, active: 234, icon: Zap, color: 'text-yellow-600' },
                    { category: 'Security', count: 312, active: 309, icon: Shield, color: 'text-blue-600' },
                    { category: 'Motion', count: 289, active: 287, icon: Activity, color: 'text-purple-600' },
                    { category: 'Network', count: 445, active: 442, icon: Wifi, color: 'text-cyan-600' },
                    { category: 'Safety', count: 111, active: 111, icon: AlertCircle, color: 'text-red-600' }
                  ].map((category, index) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-4 bg-gray-900/70 border border-gray-800 rounded-lg hover:bg-gray-900 transition-all"
                    >
                      <category.icon className={`w-8 h-8 mx-auto mb-2 ${category.color}`} />
                      <div className="font-semibold text-sm text-gray-200">{category.category}</div>
                      <div className="text-2xl font-bold mt-1 text-gray-100">{category.active}</div>
                      <div className="text-xs text-gray-500">of {category.count} sensors</div>
                      <div className="mt-2 w-full bg-gray-800 rounded-full h-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(category.active / category.count) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full rounded-full ${category.color.replace('text-', 'bg-')}`}
                        />
                      </div>
                      <div className="text-xs mt-1 font-medium text-gray-400">
                        {((category.active / category.count) * 100).toFixed(1)}% online
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedView === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Performance Metrics */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-100">Energy Efficiency Trends</CardTitle>
                  <CardDescription className="text-gray-500">Monthly energy consumption and savings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { month: 'Jan', consumption: 2840, savings: 15, efficiency: 85 },
                      { month: 'Feb', consumption: 2650, savings: 22, efficiency: 88 },
                      { month: 'Mar', consumption: 2400, savings: 28, efficiency: 92 },
                      { month: 'Apr', consumption: 2200, savings: 35, efficiency: 94 },
                      { month: 'May', consumption: 2100, savings: 38, efficiency: 96 },
                      { month: 'Jun', consumption: 2050, savings: 42, efficiency: 97 }
                    ].map((data, index) => (
                      <div key={data.month} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-300">{data.month} 2024</span>
                          <div className="flex gap-4">
                            <span className="text-blue-400">{data.consumption} kWh</span>
                            <span className="text-green-400">+{data.savings}% savings</span>
                          </div>
                        </div>
                        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${data.efficiency}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          Efficiency: {data.efficiency}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-100">Building Performance</CardTitle>
                  <CardDescription className="text-gray-500">Real-time performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { 
                        label: 'Overall Score', 
                        value: 94, 
                        color: 'bg-green-500',
                        trend: '+2.3%',
                        icon: '🏆'
                      },
                      { 
                        label: 'Energy Rating', 
                        value: 88, 
                        color: 'bg-blue-500',
                        trend: '+5.1%',
                        icon: '⚡'
                      },
                      { 
                        label: 'Comfort Index', 
                        value: 91, 
                        color: 'bg-purple-500',
                        trend: '+1.8%',
                        icon: '🌡️'
                      },
                      { 
                        label: 'Safety Score', 
                        value: 97, 
                        color: 'bg-orange-500',
                        trend: '+0.5%',
                        icon: '🛡️'
                      }
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-900/70 border border-gray-800 rounded-lg text-center hover:bg-gray-900 transition-all"
                      >
                        <div className="text-2xl mb-2">{metric.icon}</div>
                        <div className="text-2xl font-bold mb-1 text-gray-100">{metric.value}%</div>
                        <div className="text-sm text-gray-500 mb-2">{metric.label}</div>
                        <div className="text-xs text-green-400 font-medium">{metric.trend}</div>
                        <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1.5, delay: index * 0.2 }}
                            className={`h-full ${metric.color} rounded-full`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Analytics */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-100">Peak Usage Hours</CardTitle>
                  <CardDescription className="text-gray-500">Energy consumption patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { time: '6:00 AM', usage: 65, label: 'Morning Peak' },
                      { time: '12:00 PM', usage: 85, label: 'Lunch Peak' },
                      { time: '6:00 PM', usage: 92, label: 'Evening Peak' },
                      { time: '11:00 PM', usage: 35, label: 'Night Low' }
                    ].map((hour, index) => (
                      <div key={hour.time} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm text-gray-200">{hour.time}</div>
                          <div className="text-xs text-gray-500">{hour.label}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-800 rounded-full">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${hour.usage}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              className="h-full bg-blue-500 rounded-full"
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-gray-300">{hour.usage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-100">Cost Analysis</CardTitle>
                  <CardDescription className="text-gray-500">Monthly savings breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">$12,450</div>
                      <div className="text-sm text-gray-500">Total Monthly Savings</div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { category: 'HVAC Optimization', amount: 5200, percentage: 42 },
                        { category: 'Smart Lighting', amount: 3100, percentage: 25 },
                        { category: 'Energy Management', amount: 2450, percentage: 20 },
                        { category: 'Automation', amount: 1700, percentage: 13 }
                      ].map((item, index) => (
                        <div key={item.category} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{item.category}</span>
                            <span className="font-medium text-gray-200">${item.amount.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-full bg-green-500 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-100">Environmental Impact</CardTitle>
                  <CardDescription className="text-gray-500">Sustainability metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        metric: 'CO₂ Reduced', 
                        value: '2.4 tons', 
                        change: '-15%',
                        icon: '🌱',
                        color: 'text-green-600'
                      },
                      { 
                        metric: 'Water Saved', 
                        value: '1,250 L', 
                        change: '-8%',
                        icon: '💧',
                        color: 'text-blue-600'
                      },
                      { 
                        metric: 'Energy Rating', 
                        value: 'A+', 
                        change: '+1 grade',
                        icon: '⭐',
                        color: 'text-yellow-600'
                      },
                      { 
                        metric: 'Green Score', 
                        value: '95/100', 
                        change: '+5 pts',
                        icon: '🏆',
                        color: 'text-purple-600'
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={item.metric}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-900/70 border border-gray-800 rounded-lg hover:bg-gray-900 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <div className="font-medium text-sm text-gray-200">{item.metric}</div>
                            <div className={`text-xs ${item.color}`}>{item.change} this month</div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-100">{item.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Predictive Analytics */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-100">Predictive Insights</CardTitle>
                <CardDescription className="text-gray-500">AI-powered forecasts and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-gray-200">Upcoming Trends</h4>
                    {[
                      { 
                        period: 'Next Week', 
                        prediction: '12% increase in energy demand',
                        confidence: 94,
                        action: 'Pre-cool buildings during off-peak hours'
                      },
                      { 
                        period: 'Next Month', 
                        prediction: '8% reduction in occupancy',
                        confidence: 87,
                        action: 'Optimize HVAC zones for lower usage'
                      },
                      { 
                        period: 'Next Quarter', 
                        prediction: '15% improvement in efficiency',
                        confidence: 91,
                        action: 'Implement advanced automation rules'
                      }
                    ].map((insight, index) => (
                      <motion.div
                        key={insight.period}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="p-3 bg-gray-900/70 border border-gray-800 rounded-lg space-y-2 hover:bg-gray-900 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm text-gray-200">{insight.period}</span>
                          <span className="text-xs bg-blue-950/50 text-blue-400 px-2 py-1 rounded border border-blue-800/50">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{insight.prediction}</p>
                        <p className="text-xs text-green-400">💡 {insight.action}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-gray-200">Optimization Opportunities</h4>
                    {[
                      { 
                        area: 'Lighting System', 
                        potential: '$890/month',
                        effort: 'Low',
                        priority: 'High'
                      },
                      { 
                        area: 'HVAC Scheduling', 
                        potential: '$1,240/month',
                        effort: 'Medium',
                        priority: 'High'
                      },
                      { 
                        area: 'Equipment Maintenance', 
                        potential: '$450/month',
                        effort: 'High',
                        priority: 'Medium'
                      }
                    ].map((opportunity, index) => (
                      <motion.div
                        key={opportunity.area}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                        className="p-3 bg-gray-900/70 border border-gray-800 rounded-lg hover:bg-gray-900 transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm text-gray-200">{opportunity.area}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            opportunity.priority === 'High' 
                              ? 'bg-red-950/50 text-red-400 border border-red-800/50' 
                              : 'bg-yellow-950/50 text-yellow-400 border border-yellow-800/50'
                          }`}>
                            {opportunity.priority}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Potential: </span>
                            <span className="font-medium text-green-400">{opportunity.potential}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Effort: </span>
                            <span className="font-medium text-gray-300">{opportunity.effort}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedView === 'automation' && (
          <motion.div
            key="automation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-100">Automation Rules</CardTitle>
                <CardDescription className="text-gray-500">Configure and manage building automation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, name: 'Smart Lighting Control', active: true, trigger: 'Occupancy Detection', action: 'Adjust lighting levels' },
                    { id: 2, name: 'HVAC Optimization', active: true, trigger: 'Temperature variance', action: 'Auto-adjust climate' },
                    { id: 3, name: 'Security Protocol', active: true, trigger: 'After hours access', action: 'Alert security team' },
                    { id: 4, name: 'Energy Saving Mode', active: false, trigger: 'Low occupancy', action: 'Reduce power consumption' }
                  ].map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-900/70 border border-gray-800 rounded-lg hover:bg-gray-900 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${rule.active ? 'bg-green-500' : 'bg-gray-600'}`} />
                        <div>
                          <p className="font-medium text-gray-200">{rule.name}</p>
                          <p className="text-sm text-gray-500">
                            When: {rule.trigger} → Then: {rule.action}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="bg-gray-800/50 hover:bg-gray-800 border-gray-700 text-gray-400">
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant={rule.active ? "destructive" : "default"} className={rule.active 
                          ? "bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400" 
                          : "bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-400"}>
                          {rule.active ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedView === 'retail' && (
          <motion.div
            key="retail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Retail Space Management */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-100">Store Management</CardTitle>
                  <CardDescription className="text-gray-500">Individual store monitoring and control</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Electronics Zone', occupancy: 78, revenue: 12400, alerts: 0, status: 'optimal' },
                      { name: 'Fashion District', occupancy: 92, revenue: 18600, alerts: 1, status: 'busy' },
                      { name: 'Home & Garden', occupancy: 45, revenue: 6800, alerts: 0, status: 'normal' },
                      { name: 'Sports & Outdoor', occupancy: 67, revenue: 9200, alerts: 2, status: 'maintenance' }
                    ].map((store, index) => (
                      <motion.div
                        key={store.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-900/70 border border-gray-800 rounded-lg hover:bg-gray-900 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-blue-400" />
                            <span className="font-medium text-gray-200">{store.name}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            store.status === 'optimal' ? 'bg-green-950/50 text-green-400 border border-green-800/50' :
                            store.status === 'busy' ? 'bg-yellow-950/50 text-yellow-400 border border-yellow-800/50' :
                            store.status === 'normal' ? 'bg-blue-950/50 text-blue-400 border border-blue-800/50' :
                            'bg-red-950/50 text-red-400 border border-red-800/50'
                          }`}>
                            {store.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Occupancy</p>
                            <p className="font-bold text-gray-200">{store.occupancy}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Revenue</p>
                            <p className="font-bold text-gray-200">${store.revenue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Alerts</p>
                            <p className="font-bold text-gray-200">{store.alerts}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-100">Common Areas</CardTitle>
                  <CardDescription className="text-gray-500">Food courts, corridors, atriums</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Central Food Court', occupancy: 156, capacity: 180, temp: 22, noise: 68 },
                      { name: 'Main Corridor', occupancy: 89, capacity: 200, temp: 23, noise: 45 },
                      { name: 'Grand Atrium', occupancy: 234, capacity: 300, temp: 21, noise: 52 },
                      { name: 'Entertainment Zone', occupancy: 78, capacity: 120, temp: 24, noise: 72 }
                    ].map((area, index) => (
                      <motion.div
                        key={area.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-900/70 border border-gray-800 rounded-lg hover:bg-gray-900 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span className="font-medium text-gray-200">{area.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {area.occupancy}/{area.capacity} people
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Occupancy</p>
                            <div className="w-full bg-gray-800 rounded-full h-2 mt-1">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(area.occupancy / area.capacity) * 100}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className="h-full bg-purple-500 rounded-full"
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500">Temperature</p>
                            <p className="font-bold text-gray-200">{area.temp}°C</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Noise Level</p>
                            <p className="font-bold text-gray-200">{area.noise} dB</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Service Areas</CardTitle>
                <CardDescription>Restrooms, customer service, security offices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    { name: 'Restrooms Level 1', occupancy: 8, capacity: 12, status: 'available', maintenance: 'good' },
                    { name: 'Restrooms Level 2', occupancy: 6, capacity: 12, status: 'available', maintenance: 'good' },
                    { name: 'Customer Service', occupancy: 3, capacity: 5, status: 'busy', maintenance: 'good' },
                    { name: 'Security Office', occupancy: 2, capacity: 4, status: 'normal', maintenance: 'scheduled' }
                  ].map((area, index) => (
                    <motion.div
                      key={area.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg text-center"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <UserCheck className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-sm mb-2">{area.name}</h4>
                      <div className="text-2xl font-bold mb-1">{area.occupancy}/{area.capacity}</div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        area.status === 'available' ? 'bg-green-100 text-green-700' :
                        area.status === 'busy' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {area.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Experience Features */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Experience</CardTitle>
                  <CardDescription>Mobile check-in, wayfinding, queue management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { feature: 'Mobile Check-in', active: 847, total: 1200, icon: Smartphone },
                      { feature: 'Wayfinding Requests', active: 156, total: 200, icon: Navigation },
                      { feature: 'Queue Management', active: 23, total: 50, icon: Clock },
                      { feature: 'Loyalty Integration', active: 456, total: 600, icon: Star }
                    ].map((feature, index) => (
                      <div key={feature.feature} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <feature.icon className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">{feature.feature}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(feature.active / feature.total) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-full bg-blue-500 rounded-full"
                            />
                          </div>
                          <span className="text-sm font-medium w-16">{feature.active}/{feature.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operational Analytics</CardTitle>
                  <CardDescription>Foot traffic, store performance, energy optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">8,456</div>
                      <div className="text-sm text-muted-foreground">Total Visitors Today</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="font-bold text-green-600">Peak Hour</div>
                        <div>2:00 - 3:00 PM</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="font-bold text-blue-600">Avg. Dwell Time</div>
                        <div>42 minutes</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="font-bold text-purple-600">Conversion Rate</div>
                        <div>68%</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="font-bold text-orange-600">Energy Saved</div>
                        <div>15%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {selectedView === 'parking' && (
          <motion.div
            key="parking"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Multi-level Parking */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Multi-level Parking</CardTitle>
                  <CardDescription>Complex parking structures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { level: 'Ground Floor', total: 150, occupied: 142, reserved: 8, ev: 12 },
                      { level: 'Level 1', total: 180, occupied: 156, reserved: 15, ev: 18 },
                      { level: 'Level 2', total: 180, occupied: 134, reserved: 12, ev: 18 },
                      { level: 'Level 3', total: 170, occupied: 89, reserved: 6, ev: 15 }
                    ].map((level, index) => (
                      <motion.div
                        key={level.level}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-900/70 border border-gray-800 rounded-lg hover:bg-gray-900 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{level.level}</span>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {level.total - level.occupied} available
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground">Occupied</p>
                            <p className="font-bold">{level.occupied}/{level.total}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Reserved</p>
                            <p className="font-bold">{level.reserved}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">EV Spots</p>
                            <p className="font-bold">{level.ev}</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(level.occupied / level.total) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`h-full rounded-full ${
                              (level.occupied / level.total) > 0.9 ? 'bg-red-500' :
                              (level.occupied / level.total) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>EV Charging Stations</CardTitle>
                  <CardDescription>Electric vehicle charging management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">23/63</div>
                      <div className="text-sm text-muted-foreground">Active Charging Sessions</div>
                    </div>
                    {[
                      { type: 'Fast Charging (50kW)', total: 12, active: 8, queue: 2 },
                      { type: 'Rapid Charging (150kW)', total: 6, active: 5, queue: 3 },
                      { type: 'Ultra-Fast (350kW)', total: 4, active: 3, queue: 1 },
                      { type: 'Standard AC (7kW)', total: 41, active: 7, queue: 0 }
                    ].map((station) => (
                      <div key={station.type} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{station.type}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {station.active} charging
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Total: </span>
                            <span className="font-medium">{station.total}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Active: </span>
                            <span className="font-medium">{station.active}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Queue: </span>
                            <span className="font-medium">{station.queue}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Smart Features</CardTitle>
                  <CardDescription>License plate recognition, dynamic pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <QrCode className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-sm">License Plate Recognition</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">97.8%</div>
                      <div className="text-xs text-muted-foreground">Accuracy Rate</div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-sm">Dynamic Pricing</span>
                      </div>
                      <div className="text-sm">Current Rate</div>
                      <div className="text-xl font-bold text-green-600">$4.50/hr</div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-sm">VIP Reservations</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">34</div>
                      <div className="text-xs text-muted-foreground">Active Reservations</div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recent Activity</h4>
                      {[
                        { action: 'Vehicle Entry', time: '2 min ago', plate: 'ABC-1234' },
                        { action: 'Payment Complete', time: '5 min ago', plate: 'XYZ-9876' },
                        { action: 'EV Charging Started', time: '8 min ago', plate: 'EV-5678' }
                      ].map((activity, index) => (
                        <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">{activity.action}</span>
                            <span className="text-muted-foreground">{activity.time}</span>
                          </div>
                          <div className="text-muted-foreground">{activity.plate}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {selectedView === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Access Control & Security */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Multi-zone Access Control</CardTitle>
                  <CardDescription>Different permissions for stores vs. common areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { zone: 'Public Areas', accessLevel: 'Open', activeUsers: 2847, alerts: 0 },
                      { zone: 'Store Areas', accessLevel: 'Employee Only', activeUsers: 456, alerts: 2 },
                      { zone: 'Service Corridors', accessLevel: 'Staff Only', activeUsers: 23, alerts: 0 },
                      { zone: 'Security Zones', accessLevel: 'Restricted', activeUsers: 8, alerts: 1 }
                    ].map((zone, index) => (
                      <motion.div
                        key={zone.zone}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-900/70 border border-gray-800 rounded-lg hover:bg-gray-900 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{zone.zone}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            zone.alerts > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {zone.alerts > 0 ? `${zone.alerts} alerts` : 'Normal'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Access Level</p>
                            <p className="font-bold">{zone.accessLevel}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Active Users</p>
                            <p className="font-bold">{zone.activeUsers.toLocaleString()}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visitor Management</CardTitle>
                  <CardDescription>Customer flow tracking and emergency systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <PersonStanding className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-bold text-blue-600">8,456</div>
                        <div className="text-xs text-muted-foreground">Current Visitors</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <Eye className="w-6 h-6 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl font-bold text-green-600">247</div>
                        <div className="text-xs text-muted-foreground">Active Cameras</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Flow Tracking</h4>
                      {[
                        { entrance: 'Main Entrance', inflow: 156, outflow: 134, net: 22 },
                        { entrance: 'North Entrance', inflow: 89, outflow: 92, net: -3 },
                        { entrance: 'Parking Entrance', inflow: 67, outflow: 58, net: 9 },
                        { entrance: 'Service Entrance', inflow: 12, outflow: 15, net: -3 }
                      ].map((entrance) => (
                        <div key={entrance.entrance} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{entrance.entrance}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              entrance.net > 0 ? 'bg-green-100 text-green-700' : 
                              entrance.net < 0 ? 'bg-blue-100 text-blue-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {entrance.net > 0 ? '+' : ''}{entrance.net}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">In: </span>
                              <span className="font-medium text-green-600">{entrance.inflow}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Out: </span>
                              <span className="font-medium text-blue-600">{entrance.outflow}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mall-Specific IoT Devices */}
            <Card>
              <CardHeader>
                <CardTitle>Mall-Specific IoT Devices</CardTitle>
                <CardDescription>People counters, digital signage, audio zones, water features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  {[
                    { device: 'People Counters', count: 45, active: 43, icon: Users, color: 'text-blue-600' },
                    { device: 'Digital Signage', count: 28, active: 26, icon: Tv, color: 'text-purple-600' },
                    { device: 'Audio Controllers', count: 15, active: 15, icon: Volume2, color: 'text-green-600' },
                    { device: 'Water Features', count: 8, active: 7, icon: Waves, color: 'text-cyan-600' },
                    { device: 'Escalator/Elevator', count: 12, active: 11, icon: Activity, color: 'text-orange-600' }
                  ].map((device, index) => (
                    <motion.div
                      key={device.device}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-4 bg-gray-900/70 border border-gray-800 rounded-lg hover:bg-gray-900 transition-all"
                    >
                      <device.icon className={`w-8 h-8 mx-auto mb-2 ${device.color}`} />
                      <div className="font-semibold text-sm mb-1">{device.device}</div>
                      <div className="text-2xl font-bold">{device.active}</div>
                      <div className="text-xs text-muted-foreground">of {device.count} devices</div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(device.active / device.count) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full rounded-full ${device.color.replace('text-', 'bg-')}`}
                        />
                      </div>
                      <div className="text-xs mt-1 font-medium">
                        {((device.active / device.count) * 100).toFixed(1)}% online
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedView === 'vr' && (
          <motion.div
            key="vr"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-100">
                  <Glasses className="w-5 h-5 text-purple-400" />
                  Virtual Reality Experience
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Immersive 3D visualization of the smart building with retail spaces, parking, and IoT sensors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Debug Information */}
                <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                  <h4 className="font-medium text-yellow-300 mb-2">Debug Info:</h4>
                  <div className="text-sm text-yellow-200 space-y-1">
                    <div>isVRActive: {isVRActive ? '✅ TRUE' : '❌ FALSE'}</div>
                    <div>handleVRToggle function: {typeof handleVRToggle === 'function' ? '✅ Defined' : '❌ Undefined'}</div>
                    <div>selectedView: {selectedView}</div>
                  </div>
                </div>
                
                <Building3DViewEnhanced 
                  isActive={isVRActive} 
                  onToggle={handleVRToggle}
                />
              </CardContent>
            </Card>
            
            {/* VR Features Overview */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-100">
                    <Store className="w-5 h-5 text-blue-400" />
                    Retail Spaces in VR
                  </CardTitle>
                  <CardDescription className="text-gray-500">Experience our retail zones virtually</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Electronics Zone', color: '#3B82F6', occupancy: 78 },
                      { name: 'Fashion District', color: '#EF4444', occupancy: 92 },
                      { name: 'Home & Garden', color: '#10B981', occupancy: 45 },
                      { name: 'Sports & Outdoor', color: '#F59E0B', occupancy: 67 }
                    ].map((zone) => (
                      <div key={zone.name} className="flex items-center justify-between p-2 bg-gray-900/70 border border-gray-800 rounded hover:bg-gray-900 transition-all">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: zone.color }}
                          />
                          <span className="text-sm font-medium text-gray-200">{zone.name}</span>
                        </div>
                        <span className="text-xs bg-gray-800/50 px-2 py-1 rounded border border-gray-700/50 text-gray-400">
                          {zone.occupancy}% occupied
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-100">
                    <Car className="w-5 h-5 text-green-400" />
                    Parking in VR
                  </CardTitle>
                  <CardDescription className="text-gray-500">Multi-level parking visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { level: 'Ground Floor', occupied: 142, total: 150 },
                      { level: 'Level 1', occupied: 156, total: 180 },
                      { level: 'Level 2', occupied: 134, total: 180 },
                      { level: 'Level 3', occupied: 89, total: 170 }
                    ].map((level) => (
                      <div key={level.level} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{level.level}</span>
                          <span className="text-gray-400">{level.occupied}/{level.total}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full ${
                              (level.occupied / level.total) > 0.9 ? 'bg-red-500' :
                              (level.occupied / level.total) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(level.occupied / level.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-100">
                    <Activity className="w-5 h-5 text-purple-400" />
                    IoT Sensors in VR
                  </CardTitle>
                  <CardDescription className="text-gray-500">Real-time sensor data visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'Temperature', value: '22.5°C', status: 'optimal' },
                      { type: 'Occupancy', value: '156 people', status: 'normal' },
                      { type: 'Air Quality', value: '85 AQI', status: 'good' },
                      { type: 'Energy', value: '1247 kW', status: 'normal' }
                    ].map((sensor) => (
                      <div key={sensor.type} className="flex items-center justify-between p-2 bg-gray-900/70 border border-gray-800 rounded hover:bg-gray-900 transition-all">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            sensor.status === 'optimal' ? 'bg-green-500' :
                            sensor.status === 'good' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          } animate-pulse`} />
                          <span className="text-sm font-medium text-gray-200">{sensor.type}</span>
                        </div>
                        <span className="text-xs font-mono text-gray-400">{sensor.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* VR Technology Info */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-100">VR Technology Stack</CardTitle>
                <CardDescription className="text-gray-500">Built with A-Frame for immersive web experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-200">VR Features</h4>
                    <ul className="text-sm text-gray-400 space-y-2">
                      <li className="flex items-center gap-2">
                        <Glasses className="w-4 h-4 text-purple-500" />
                        WebXR compatible for VR headsets
                      </li>
                      <li className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-500" />
                        Real-time data visualization in 3D
                      </li>
                      <li className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        Interactive IoT sensor networks
                      </li>
                      <li className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-orange-500" />
                        Immersive retail space exploration
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-200">Supported Devices</h4>
                    <ul className="text-sm text-gray-400 space-y-2">
                      <li>• Desktop browsers (Chrome, Firefox, Safari)</li>
                      <li>• Mobile devices with WebXR support</li>
                      <li>• VR headsets (Oculus, HTC Vive, etc.)</li>
                      <li>• AR-capable devices</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}