import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiWifi, FiCpu, FiActivity, FiBattery,
  FiThermometer, FiDroplet, FiWind, FiAlertTriangle,
  FiCheckCircle, FiXCircle, FiRefreshCw, FiSettings
} from 'react-icons/fi'
import { 
  LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import toast from 'react-hot-toast'

// Mock data
const deviceStats = {
  total: 1250,
  online: 1186,
  offline: 64,
  alerts: 23,
  dataPoints: '2.3M',
}

const deviceTypes = [
  { type: 'Temperature Sensors', count: 450, icon: FiThermometer, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { type: 'Humidity Sensors', count: 380, icon: FiDroplet, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { type: 'Motion Detectors', count: 220, icon: FiActivity, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { type: 'Smart Meters', count: 200, icon: FiCpu, color: 'text-green-600', bgColor: 'bg-green-100' },
]

const devices = [
  { id: 'DEV-001', name: 'Temperature Sensor A1', location: 'Building A - Floor 1', status: 'online', battery: 85, lastUpdate: '2 min ago' },
  { id: 'DEV-002', name: 'Humidity Sensor B3', location: 'Building B - Floor 3', status: 'online', battery: 92, lastUpdate: '1 min ago' },
  { id: 'DEV-003', name: 'Motion Detector C2', location: 'Building C - Floor 2', status: 'alert', battery: 45, lastUpdate: '5 min ago' },
  { id: 'DEV-004', name: 'Smart Meter D1', location: 'Building D - Floor 1', status: 'offline', battery: 12, lastUpdate: '1 hour ago' },
  { id: 'DEV-005', name: 'Air Quality Monitor E4', location: 'Building E - Floor 4', status: 'online', battery: 78, lastUpdate: '30 sec ago' },
]

const sensorData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  temperature: 22 + Math.random() * 4,
  humidity: 40 + Math.random() * 20,
  airQuality: 80 + Math.random() * 15,
}))

const deviceLocations = Array.from({ length: 50 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  status: Math.random() > 0.1 ? 'online' : 'offline',
}))

const alerts = [
  { id: 1, device: 'Temperature Sensor A1', type: 'warning', message: 'Temperature exceeds threshold', time: '5 min ago' },
  { id: 2, device: 'Motion Detector C2', type: 'critical', message: 'Low battery alert', time: '15 min ago' },
  { id: 3, device: 'Smart Meter D1', type: 'error', message: 'Device offline', time: '1 hour ago' },
  { id: 4, device: 'Humidity Sensor B3', type: 'info', message: 'Firmware update available', time: '2 hours ago' },
]

const IoTPlatform: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [liveData, setLiveData] = useState(sensorData)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setLiveData(prev => {
        const newData = [...prev.slice(1)]
        const lastHour = parseInt(prev[prev.length - 1].time)
        newData.push({
          time: `${(lastHour + 1) % 24}:00`,
          temperature: 22 + Math.random() * 4,
          humidity: 40 + Math.random() * 20,
          airQuality: 80 + Math.random() * 15,
        })
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const provisionDevice = () => {
    toast.success('New device provisioned successfully! Device ID: DEV-006')
  }

  const updateFirmware = () => {
    toast.loading('Updating firmware...', { duration: 2000 })
    setTimeout(() => {
      toast.success('Firmware updated for 5 devices')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IoT Platform</h1>
            <p className="text-gray-600 mt-1">
              Real-time device monitoring and management
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={provisionDevice}
              className="btn-primary px-4 py-2 flex items-center space-x-2"
              data-tooltip="Add a new IoT device"
            >
              <FiWifi />
              <span>Provision Device</span>
            </button>
            <button
              onClick={updateFirmware}
              className="btn-outline px-4 py-2 flex items-center space-x-2"
              data-tooltip="Update device firmware"
            >
              <FiRefreshCw />
              <span>Update Firmware</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiCpu className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">{deviceStats.total}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{deviceStats.total}</h3>
          <p className="text-sm text-gray-600">Total Devices</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiCheckCircle className="w-8 h-8 text-green-600" />
            <span className="badge-success">{Math.round((deviceStats.online / deviceStats.total) * 100)}%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{deviceStats.online}</h3>
          <p className="text-sm text-gray-600">Online</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiXCircle className="w-8 h-8 text-red-600" />
            <span className="badge-danger">{deviceStats.offline}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{deviceStats.offline}</h3>
          <p className="text-sm text-gray-600">Offline</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiAlertTriangle className="w-8 h-8 text-yellow-600" />
            <span className="badge-warning">{deviceStats.alerts}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{deviceStats.alerts}</h3>
          <p className="text-sm text-gray-600">Alerts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiActivity className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-purple-600 font-medium">Live</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{deviceStats.dataPoints}</h3>
          <p className="text-sm text-gray-600">Data Points</p>
        </motion.div>
      </div>

      {/* Device Types */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {deviceTypes.map((type) => (
            <div
              key={type.type}
              className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => toast.info(`${type.count} ${type.type} active`)}
            >
              <div className={`p-3 rounded-lg ${type.bgColor}`}>
                <type.icon className={`w-6 h-6 ${type.color}`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">{type.type}</p>
                <p className="text-sm text-gray-600">{type.count} devices</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Sensor Data */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Sensor Data</h3>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-sm px-3 py-1 rounded-full flex items-center space-x-1 ${
                autoRefresh ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <FiRefreshCw className={`w-3 h-3 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Live' : 'Paused'}</span>
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={liveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#f59e0b" name="Temperature (°C)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity (%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="airQuality" stroke="#10b981" name="Air Quality" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Device Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="X" unit="m" />
              <YAxis dataKey="y" name="Y" unit="m" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Devices" data={deviceLocations}>
                {deviceLocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.status === 'online' ? '#10b981' : '#ef4444'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Device List */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Management</h3>
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                onClick={() => {
                  setSelectedDevice(device.id)
                  toast.info(`Managing ${device.name}`)
                }}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all
                  ${selectedDevice === device.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{device.name}</p>
                    <p className="text-sm text-gray-600">{device.location}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <FiBattery className={`w-4 h-4 ${
                        device.battery > 50 ? 'text-green-600' : 
                        device.battery > 20 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                      <span className="text-sm font-medium">{device.battery}%</span>
                    </div>
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${device.status === 'online' ? 'bg-green-100 text-green-800' : ''}
                      ${device.status === 'offline' ? 'bg-red-100 text-red-800' : ''}
                      ${device.status === 'alert' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {device.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Last update: {device.lastUpdate}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${alert.type === 'critical' ? 'bg-red-100' : ''}
                  ${alert.type === 'warning' ? 'bg-yellow-100' : ''}
                  ${alert.type === 'error' ? 'bg-orange-100' : ''}
                  ${alert.type === 'info' ? 'bg-blue-100' : ''}
                `}>
                  <FiAlertTriangle className={`w-4 h-4
                    ${alert.type === 'critical' ? 'text-red-600' : ''}
                    ${alert.type === 'warning' ? 'text-yellow-600' : ''}
                    ${alert.type === 'error' ? 'text-orange-600' : ''}
                    ${alert.type === 'info' ? 'text-blue-600' : ''}
                  `} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.device}</p>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* IoT Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-sm p-6 text-white"
      >
        <h3 className="text-lg font-semibold mb-4">Platform Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <FiWifi className="w-5 h-5" />
            <span className="text-sm">Real-time Monitoring</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiSettings className="w-5 h-5" />
            <span className="text-sm">Remote Configuration</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiRefreshCw className="w-5 h-5" />
            <span className="text-sm">OTA Updates</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiActivity className="w-5 h-5" />
            <span className="text-sm">Analytics & ML</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default IoTPlatform