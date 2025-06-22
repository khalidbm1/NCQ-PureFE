import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiBriefcase, FiUsers, FiCalendar, FiWifi,
  FiThermometer, FiKey, FiBell, FiStar,
  FiTrendingUp, FiDollarSign, FiMapPin, FiCoffee
} from 'react-icons/fi'
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import toast from 'react-hot-toast'

// Mock data
const hotelStats = {
  occupancy: 78,
  totalRooms: 250,
  occupied: 195,
  checkInsToday: 42,
  checkOutsToday: 38,
  revenue: 285000,
}

const roomTypes = [
  { type: 'Standard', available: 12, total: 100, price: 450 },
  { type: 'Deluxe', available: 8, total: 80, price: 750 },
  { type: 'Suite', available: 5, total: 50, price: 1200 },
  { type: 'Presidential', available: 2, total: 20, price: 2500 },
]

const currentGuests = [
  { id: 1, name: 'Abdullah Al-Rashid', room: '501', type: 'Suite', checkIn: '2024-01-10', nights: 3, vip: true },
  { id: 2, name: 'Maria Garcia', room: '203', type: 'Deluxe', checkIn: '2024-01-11', nights: 2, vip: false },
  { id: 3, name: 'John Smith', room: '102', type: 'Standard', checkIn: '2024-01-12', nights: 5, vip: false },
  { id: 4, name: 'Fatima Hassan', room: '801', type: 'Presidential', checkIn: '2024-01-09', nights: 7, vip: true },
]

const iotDevices = [
  { id: 1, room: '501', device: 'Climate Control', status: 'active', temp: 22, humidity: 45 },
  { id: 2, room: '501', device: 'Smart Lighting', status: 'active', brightness: 70 },
  { id: 3, room: '203', device: 'Door Lock', status: 'locked', lastAccess: '10:30 AM' },
  { id: 4, room: '801', device: 'Energy Monitor', status: 'active', usage: '3.2 kWh' },
]

const monthlyRevenue = [
  { month: 'Jul', revenue: 2100000 },
  { month: 'Aug', revenue: 2450000 },
  { month: 'Sep', revenue: 2300000 },
  { month: 'Oct', revenue: 2650000 },
  { month: 'Nov', revenue: 2800000 },
  { month: 'Dec', revenue: 3200000 },
]

const guestSatisfaction = [
  { category: 'Room Quality', score: 4.6 },
  { category: 'Service', score: 4.8 },
  { category: 'Amenities', score: 4.5 },
  { category: 'Food', score: 4.7 },
  { category: 'Location', score: 4.9 },
]

const SmartHospitality: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [showIoTControls, setShowIoTControls] = useState(false)

  const checkInGuest = () => {
    toast.success('Guest checked in successfully! Room 305 assigned.')
  }

  const controlIoTDevice = (device: string) => {
    toast.success(`${device} adjusted successfully!`)
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
            <h1 className="text-2xl font-bold text-gray-900">Smart Hospitality Platform</h1>
            <p className="text-gray-600 mt-1">
              IoT-powered hotel management system
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={checkInGuest}
              className="btn-primary px-4 py-2 flex items-center space-x-2"
              data-tooltip="Check in a new guest"
            >
              <FiKey />
              <span>Check In</span>
            </button>
            <button
              onClick={() => setShowIoTControls(!showIoTControls)}
              className="btn-outline px-4 py-2 flex items-center space-x-2"
              data-tooltip="Control IoT devices"
            >
              <FiWifi />
              <span>IoT Controls</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiBriefcase className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-purple-600 font-medium">{hotelStats.occupancy}%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{hotelStats.occupied}/{hotelStats.totalRooms}</h3>
          <p className="text-sm text-gray-600">Occupancy</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiUsers className="w-8 h-8 text-blue-600" />
            <span className="badge-success">+{hotelStats.checkInsToday}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{hotelStats.checkInsToday}</h3>
          <p className="text-sm text-gray-600">Check-ins Today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiDollarSign className="w-8 h-8 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+22%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">SAR {(hotelStats.revenue / 1000).toFixed(0)}K</h3>
          <p className="text-sm text-gray-600">Today's Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiStar className="w-8 h-8 text-yellow-600" />
            <span className="badge-warning">4.7/5</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">4.7</h3>
          <p className="text-sm text-gray-600">Guest Rating</p>
        </motion.div>
      </div>

      {/* Room Availability */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {roomTypes.map((room) => (
            <div
              key={room.type}
              onClick={() => {
                setSelectedRoom(room.type)
                toast.info(`${room.available} ${room.type} rooms available`)
              }}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${selectedRoom === room.type 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <h4 className="font-semibold text-gray-900">{room.type}</h4>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  Available: <span className="font-medium text-gray-900">{room.available}/{room.total}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Rate: <span className="font-medium text-gray-900">SAR {room.price}</span>
                </p>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-purple-500"
                  style={{ width: `${((room.total - room.available) / room.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Guests */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Guests</h3>
          <div className="space-y-3">
            {currentGuests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => toast.info(`Viewing ${guest.name}'s profile`)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiUsers className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>{guest.name}</span>
                      {guest.vip && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">VIP</span>}
                    </p>
                    <p className="text-sm text-gray-600">Room {guest.room} • {guest.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{guest.nights} nights</p>
                  <p className="text-xs text-gray-500">Check-in: {guest.checkIn}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* IoT Device Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">IoT Device Status</h3>
          {showIoTControls ? (
            <div className="space-y-3">
              {iotDevices.map((device) => (
                <div key={device.id} className="p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{device.device}</p>
                      <p className="text-sm text-gray-600">Room {device.room}</p>
                    </div>
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${device.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {device.status}
                    </span>
                  </div>
                  {device.temp && (
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1">
                        <FiThermometer className="w-4 h-4 text-orange-600" />
                        <span>{device.temp}°C</span>
                      </span>
                      <span>Humidity: {device.humidity}%</span>
                      <button
                        onClick={() => controlIoTDevice(device.device)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Adjust
                      </button>
                    </div>
                  )}
                  {device.brightness && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Brightness: {device.brightness}%</span>
                      <button
                        onClick={() => controlIoTDevice(device.device)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Control
                      </button>
                    </div>
                  )}
                  {device.lastAccess && (
                    <p className="text-sm text-gray-600">Last access: {device.lastAccess}</p>
                  )}
                  {device.usage && (
                    <p className="text-sm text-gray-600">Energy usage: {device.usage}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <FiThermometer className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">22°C</p>
                <p className="text-sm text-gray-600">Avg Temperature</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <FiWifi className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">152</p>
                <p className="text-sm text-gray-600">Devices Online</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <FiKey className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-600">Smart Locks Active</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <FiBell className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Service Requests</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorHotelRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `SAR ${(value / 1000000).toFixed(1)}M`} />
              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorHotelRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Guest Satisfaction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Satisfaction</h3>
          <div className="space-y-3">
            {guestSatisfaction.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{item.category}</span>
                  <div className="flex items-center space-x-1">
                    <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{item.score}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-yellow-500"
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Smart Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-sm p-6 text-white"
      >
        <h3 className="text-lg font-semibold mb-4">Smart Hospitality Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <FiWifi className="w-5 h-5" />
            <span className="text-sm">IoT Room Controls</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiKey className="w-5 h-5" />
            <span className="text-sm">Mobile Check-in</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCoffee className="w-5 h-5" />
            <span className="text-sm">AI Concierge</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiMapPin className="w-5 h-5" />
            <span className="text-sm">Location Services</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SmartHospitality