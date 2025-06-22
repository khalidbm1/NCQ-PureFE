import React, { useState } from 'react'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Navigation items
  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: '📊' },
    { name: 'Payment Gateway', id: 'payment', icon: '💳' },
    { name: 'Hospital Management', id: 'hospital', icon: '🏥' },
    { name: 'Smart Hospitality', id: 'hospitality', icon: '🏨' },
    { name: 'IoT Platform', id: 'iot', icon: '📡' },
    { name: 'AI Platform', id: 'ai', icon: '🤖' },
  ]

  // Layout with Sidebar
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <button onClick={() => setCurrentPage('landing')} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NCQ Platform</span>
          </button>
        </div>
        
        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                currentPage === item.id 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">DU</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Demo User</p>
              <p className="text-xs text-gray-500">admin@ncq.sa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {navigation.find(nav => nav.id === currentPage)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              🎪 Interactive Tour
            </button>
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <span className="text-lg">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )

  // Landing Page
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NCQ Platform</span>
          </div>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enter Demo →
          </button>
        </div>
      </nav>
      
      <div className="max-w-6xl mx-auto px-8 py-16 text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          🚀 NCQ Platform Demo
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          Interactive Stakeholder Demonstration - Explore All Modules
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {navigation.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm">Click to explore this module</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage('dashboard')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-lg font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          🎪 Start Full Demo Experience
        </button>
      </div>
    </div>
  )

  // Dashboard Page
  const Dashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: 'SAR 2.4M', change: '+12.5%', icon: '💰', color: 'green' },
          { title: 'Active Users', value: '52,841', change: '+8.2%', icon: '👥', color: 'blue' },
          { title: 'Transactions', value: '124,523', change: '+15.3%', icon: '💳', color: 'purple' },
          { title: 'System Health', value: '99.9%', change: '+0.1%', icon: '⚡', color: 'emerald' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{metric.icon}</span>
              <span className={`text-sm font-medium text-${metric.color}-600`}>{metric.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mt-4">{metric.value}</h3>
            <p className="text-gray-600">{metric.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Revenue Trend</h3>
          <div className="space-y-3">
            {['January', 'February', 'March', 'April', 'May', 'June'].map((month, index) => (
              <div key={month} className="flex items-center justify-between">
                <span className="text-gray-600">{month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${60 + index * 7}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">SAR {(120 + index * 15)}K</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🔥 Recent Activity</h3>
          <div className="space-y-4">
            {[
              { type: 'payment', message: 'Payment of SAR 1,250 processed for Hospital ABC', time: '2 min ago', icon: '💳' },
              { type: 'user', message: 'New merchant onboarded: Tech Solutions Ltd', time: '15 min ago', icon: '👥' },
              { type: 'iot', message: 'IoT device maintenance completed in Building A', time: '1 hour ago', icon: '📡' },
              { type: 'ai', message: 'AI model training completed with 95% accuracy', time: '2 hours ago', icon: '🤖' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Payment Gateway Page
  const PaymentGateway = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Today's Volume", value: 'SAR 2.8M', change: '+18.2%', icon: '💰' },
          { title: 'Transactions', value: '15,432', change: '+12.5%', icon: '💳' },
          { title: 'Success Rate', value: '99.2%', change: '99.2%', icon: '✅' },
          { title: 'Fraud Rate', value: '0.02%', change: '0.02%', icon: '🛡️' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{metric.icon}</span>
              <span className="text-sm font-medium text-green-600">{metric.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mt-4">{metric.value}</h3>
            <p className="text-gray-600">{metric.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { name: 'mada', icon: '🇸🇦', transactions: 4521, amount: 892340 },
          { name: 'Visa', icon: '💳', transactions: 3210, amount: 645200 },
          { name: 'Mastercard', icon: '💳', transactions: 2890, amount: 578900 },
          { name: 'Apple Pay', icon: '🍎', transactions: 1567, amount: 298700 },
          { name: 'stc pay', icon: '📱', transactions: 987, amount: 187300 }
        ].map((method, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-3xl mb-3">{method.icon}</div>
            <h4 className="font-bold text-gray-900 mb-2">{method.name}</h4>
            <p className="text-sm text-gray-600 mb-1">{method.transactions.toLocaleString()} txns</p>
            <p className="text-xs text-gray-500">SAR {(method.amount / 1000).toFixed(0)}K</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🔄 Recent Transactions</h3>
        <div className="space-y-3">
          {[
            { id: 'TXN-001', amount: 1250.00, method: 'mada', status: 'success', merchant: 'Hospital ABC', time: '2 min ago' },
            { id: 'TXN-002', amount: 3500.00, method: 'Visa', status: 'success', merchant: 'Grand Hotel', time: '5 min ago' },
            { id: 'TXN-003', amount: 750.00, method: 'Apple Pay', status: 'failed', merchant: 'Clinic XYZ', time: '8 min ago' },
            { id: 'TXN-004', amount: 2100.00, method: 'mada', status: 'processing', merchant: 'Hotel Plaza', time: '12 min ago' }
          ].map((txn, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  txn.status === 'success' ? 'bg-green-500' : 
                  txn.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{txn.merchant}</p>
                  <p className="text-sm text-gray-500">{txn.id} • {txn.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">SAR {txn.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{txn.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Hospital Management Page
  const HospitalManagement = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Patients', value: '1,234', icon: '👥', color: 'blue' },
          { title: 'Admitted', value: '156', icon: '🏥', color: 'green' },
          { title: 'Outpatients', value: '89', icon: '🚶', color: 'purple' },
          { title: 'Emergency', value: '12', icon: '🚨', color: 'red' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{metric.icon}</span>
              <span className={`text-xs px-2 py-1 bg-${metric.color}-100 text-${metric.color}-800 rounded-full`}>
                {metric.value}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mt-4">{metric.value}</h3>
            <p className="text-gray-600">{metric.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📅 Today's Appointments</h3>
          <div className="space-y-4">
            {[
              { patient: 'Ahmad Hassan', doctor: 'Dr. Sarah Ahmed', time: '09:00 AM', type: 'Consultation', status: 'confirmed' },
              { patient: 'Fatima Ali', doctor: 'Dr. Mohammed Khan', time: '10:30 AM', type: 'Follow-up', status: 'waiting' },
              { patient: 'Omar Khalid', doctor: 'Dr. Layla Ibrahim', time: '11:00 AM', type: 'Surgery', status: 'in-progress' },
              { patient: 'Noura Salem', doctor: 'Dr. Ahmed Yousef', time: '02:00 PM', type: 'Check-up', status: 'confirmed' }
            ].map((apt, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{apt.patient}</p>
                    <p className="text-sm text-gray-600">{apt.doctor} • {apt.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{apt.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      apt.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🏥 Bed Occupancy</h3>
          <div className="space-y-4">
            {[
              { department: 'ICU', total: 20, occupied: 18 },
              { department: 'General Ward', total: 100, occupied: 78 },
              { department: 'Pediatrics', total: 30, occupied: 24 },
              { department: 'Maternity', total: 25, occupied: 19 },
              { department: 'Emergency', total: 15, occupied: 12 }
            ].map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{dept.department}</span>
                  <span className="text-gray-600">{dept.occupied}/{dept.total} ({Math.round((dept.occupied / dept.total) * 100)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (dept.occupied / dept.total) > 0.9 ? 'bg-red-500' :
                      (dept.occupied / dept.total) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(dept.occupied / dept.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Smart Hospitality Page
  const SmartHospitality = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Occupancy Rate', value: '78%', detail: '195/250 rooms', icon: '🏨' },
          { title: 'Check-ins Today', value: '42', detail: '+38 check-outs', icon: '🔑' },
          { title: "Today's Revenue", value: 'SAR 285K', detail: '+22% vs yesterday', icon: '💰' },
          { title: 'Guest Rating', value: '4.7/5', detail: '98% satisfaction', icon: '⭐' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{metric.icon}</span>
              <span className="text-sm text-green-600 font-medium">Live</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mt-4">{metric.value}</h3>
            <p className="text-gray-600">{metric.title}</p>
            <p className="text-xs text-gray-500 mt-1">{metric.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { type: 'Standard', available: 12, total: 100, price: 450 },
          { type: 'Deluxe', available: 8, total: 80, price: 750 },
          { type: 'Suite', available: 5, total: 50, price: 1200 },
          { type: 'Presidential', available: 2, total: 20, price: 2500 }
        ].map((room, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="font-bold text-gray-900 mb-3">{room.type}</h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Available: <span className="font-medium text-gray-900">{room.available}/{room.total}</span></p>
              <p className="text-sm text-gray-600">Rate: <span className="font-medium text-gray-900">SAR {room.price}</span></p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-purple-500"
                  style={{ width: `${((room.total - room.available) / room.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">👥 Current Guests</h3>
          <div className="space-y-3">
            {[
              { name: 'Abdullah Al-Rashid', room: '501', type: 'Suite', nights: 3, vip: true },
              { name: 'Maria Garcia', room: '203', type: 'Deluxe', nights: 2, vip: false },
              { name: 'John Smith', room: '102', type: 'Standard', nights: 5, vip: false },
              { name: 'Fatima Hassan', room: '801', type: 'Presidential', nights: 7, vip: true }
            ].map((guest, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">{guest.name.split(' ').map(n => n[0]).join('')}</span>
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
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📡 IoT Device Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <span className="text-2xl">🌡️</span>
              <p className="text-lg font-bold text-gray-900 mt-2">22°C</p>
              <p className="text-sm text-gray-600">Avg Temperature</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <span className="text-2xl">📡</span>
              <p className="text-lg font-bold text-gray-900 mt-2">152</p>
              <p className="text-sm text-gray-600">Devices Online</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <span className="text-2xl">🔑</span>
              <p className="text-lg font-bold text-gray-900 mt-2">98%</p>
              <p className="text-sm text-gray-600">Smart Locks Active</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <span className="text-2xl">🔔</span>
              <p className="text-lg font-bold text-gray-900 mt-2">12</p>
              <p className="text-sm text-gray-600">Service Requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // IoT Platform Page
  const IoTPlatform = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { title: 'Total Devices', value: '1,250', icon: '📱', status: 'total' },
          { title: 'Online', value: '1,186', icon: '✅', status: 'online' },
          { title: 'Offline', value: '64', icon: '❌', status: 'offline' },
          { title: 'Alerts', value: '23', icon: '⚠️', status: 'alert' },
          { title: 'Data Points', value: '2.3M', icon: '📊', status: 'data' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{metric.icon}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric.status === 'online' ? 'bg-green-100 text-green-800' :
                metric.status === 'offline' ? 'bg-red-100 text-red-800' :
                metric.status === 'alert' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {metric.status}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{metric.value}</h3>
            <p className="text-gray-600 text-sm">{metric.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { type: 'Temperature Sensors', count: 450, icon: '🌡️', color: 'orange' },
          { type: 'Humidity Sensors', count: 380, icon: '💧', color: 'blue' },
          { type: 'Motion Detectors', count: 220, icon: '🚶', color: 'purple' },
          { type: 'Smart Meters', count: 200, icon: '⚡', color: 'green' }
        ].map((device, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-${device.color}-100`}>
                <span className="text-2xl">{device.icon}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{device.type}</p>
                <p className="text-sm text-gray-600">{device.count} devices</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">📊 Live Sensor Data</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { time: '14:30', temp: 23.2, humidity: 45, air: 95 },
              { time: '14:25', temp: 23.1, humidity: 46, air: 94 },
              { time: '14:20', temp: 23.0, humidity: 44, air: 96 },
              { time: '14:15', temp: 22.9, humidity: 45, air: 95 }
            ].map((reading, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">{reading.time}</span>
                <div className="flex space-x-4 text-sm">
                  <span className="text-orange-600">{reading.temp}°C</span>
                  <span className="text-blue-600">{reading.humidity}%</span>
                  <span className="text-green-600">{reading.air}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⚠️ Recent Alerts</h3>
          <div className="space-y-3">
            {[
              { device: 'Temperature Sensor A1', type: 'warning', message: 'Temperature exceeds threshold', time: '5 min ago' },
              { device: 'Motion Detector C2', type: 'critical', message: 'Low battery alert', time: '15 min ago' },
              { device: 'Smart Meter D1', type: 'error', message: 'Device offline', time: '1 hour ago' },
              { device: 'Humidity Sensor B3', type: 'info', message: 'Firmware update available', time: '2 hours ago' }
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'critical' ? 'bg-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-500' :
                  alert.type === 'error' ? 'bg-orange-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.device}</p>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // AI Platform Page
  const AIPlatform = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { title: 'API Requests', value: '45,678', change: '+18%', icon: '💬' },
          { title: 'Avg Response', value: '234ms', change: '234ms', icon: '⚡' },
          { title: 'Models', value: '12', change: '12', icon: '🤖' },
          { title: 'Accuracy', value: '94.5%', change: '94.5%', icon: '📈' },
          { title: 'Tokens', value: '12.3M', change: '12.3M', icon: '🧠' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{metric.icon}</span>
              <span className="text-sm text-indigo-600 font-medium">{metric.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{metric.value}</h3>
            <p className="text-gray-600 text-sm">{metric.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🤖 AI Playground</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Model</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option>NCQ-GPT-4 - LLM</option>
                <option>Sentiment-BERT - Classification</option>
                <option>NCQ-Vision - Computer Vision</option>
                <option>Arabic-NLP - NLP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Query</label>
              <textarea 
                placeholder="Ask me anything about your business data..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              🚀 Process Query
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temperature: 0.7</label>
              <input type="range" min="0" max="1" step="0.1" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens: 150</label>
              <input type="range" min="50" max="500" step="50" className="w-full" />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Model Parameters:</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-500">
                <li>• Temperature controls randomness</li>
                <li>• Higher values = more creative</li>
                <li>• Lower values = more focused</li>
                <li>• Max tokens limits response length</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Deployed Models</h3>
          <div className="space-y-3">
            {[
              { name: 'NCQ-GPT-4', type: 'LLM', requests: 12450, accuracy: 96.2, status: 'active' },
              { name: 'Sentiment-BERT', type: 'Classification', requests: 8920, accuracy: 94.8, status: 'active' },
              { name: 'NCQ-Vision', type: 'Computer Vision', requests: 6780, accuracy: 92.5, status: 'active' },
              { name: 'Arabic-NLP', type: 'NLP', requests: 5430, accuracy: 91.3, status: 'training' }
            ].map((model, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{model.name}</p>
                    <p className="text-sm text-gray-600">{model.type} • {model.requests.toLocaleString()} requests</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{model.accuracy}%</p>
                      <p className="text-xs text-gray-500">accuracy</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      model.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {model.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💬 Recent Conversations</h3>
          <div className="space-y-3">
            {[
              { user: 'Hospital Admin', query: 'Analyze patient satisfaction trends', response: 'Based on the data...', time: '2 min ago' },
              { user: 'Hotel Manager', query: 'Predict next month occupancy', response: 'The forecast shows...', time: '5 min ago' },
              { user: 'Finance Team', query: 'Generate revenue report', response: 'Here\'s the analysis...', time: '15 min ago' }
            ].map((conv, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{conv.user}</p>
                  <p className="text-xs text-gray-500">{conv.time}</p>
                </div>
                <p className="text-sm text-gray-700 mb-1">Q: {conv.query}</p>
                <p className="text-sm text-gray-600">A: {conv.response}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Render the appropriate page
  const renderPage = () => {
    if (currentPage === 'landing') return <LandingPage />
    
    const pageComponents = {
      dashboard: <Dashboard />,
      payment: <PaymentGateway />,
      hospital: <HospitalManagement />,
      hospitality: <SmartHospitality />,
      iot: <IoTPlatform />,
      ai: <AIPlatform />
    }

    const PageComponent = pageComponents[currentPage as keyof typeof pageComponents]
    
    return (
      <Layout>
        {PageComponent}
      </Layout>
    )
  }

  return renderPage()
}

export default App