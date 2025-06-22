import React, { useState } from 'react'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          🚀 NCQ Platform Demo
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          Interactive Stakeholder Demonstration
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Gateway</h3>
            <p className="text-gray-600">Secure multi-channel payment processing with mada, Visa, and digital wallets</p>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hospital Management</h3>
            <p className="text-gray-600">Complete HMS with patient records, appointments, and billing</p>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-4xl mb-4">🏨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Hospitality</h3>
            <p className="text-gray-600">Modern hotel management with IoT integration</p>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-4xl mb-4">📡</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">IoT Platform</h3>
            <p className="text-gray-600">Real-time device monitoring and management</p>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI Platform</h3>
            <p className="text-gray-600">Advanced LLM capabilities and analytics</p>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Analytics</h3>
            <p className="text-gray-600">Business intelligence and insights</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            🎪 Explore Dashboard
          </button>
          <button
            onClick={() => alert('🎉 Interactive tour starting!\n\n✅ All modules working\n✅ Ready for stakeholder demo\n✅ Professional presentation')}
            className="bg-white text-gray-800 px-8 py-4 rounded-lg font-bold text-lg border-2 border-gray-300 hover:bg-gray-50 transition-all"
          >
            🎯 Start Interactive Tour
          </button>
        </div>
      </div>
    </div>
  )

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NCQ Platform</span>
            </div>
            <button
              onClick={() => setCurrentPage('landing')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Platform Dashboard</h1>
          <p className="text-xl text-gray-600">Real-time insights across all NCQ services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl">💰</span>
              <span className="text-sm font-medium text-green-600">+12.5%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mt-4">SAR 2.4M</h3>
            <p className="text-gray-600">Total Revenue</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl">👥</span>
              <span className="text-sm font-medium text-green-600">+8.2%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mt-4">52,841</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl">💳</span>
              <span className="text-sm font-medium text-green-600">+15.3%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mt-4">124,523</h3>
            <p className="text-gray-600">Transactions</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl">⚡</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mt-4">99.9%</h3>
            <p className="text-gray-600">System Health</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Payment Gateway', icon: '💳', color: 'blue', status: 'Active', transactions: '1,234' },
            { name: 'Hospital Management', icon: '🏥', color: 'green', status: 'Active', transactions: '856' },
            { name: 'Smart Hospitality', icon: '🏨', color: 'purple', status: 'Active', transactions: '542' },
            { name: 'IoT Platform', icon: '📡', color: 'orange', status: 'Active', transactions: '2,341' },
            { name: 'AI Platform', icon: '🤖', color: 'indigo', status: 'Active', transactions: '678' },
            { name: 'Analytics Hub', icon: '📊', color: 'pink', status: 'Active', transactions: '423' }
          ].map((module, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{module.icon}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{module.status}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{module.name}</h3>
              <p className="text-sm text-gray-600">Today: {module.transactions} operations</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">🎯 System Status: Fully Operational</h3>
              <p className="text-blue-100 mt-1">All NCQ Platform services running smoothly</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )

  return (
    <div>
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'dashboard' && <Dashboard />}
    </div>
  )
}

export default App