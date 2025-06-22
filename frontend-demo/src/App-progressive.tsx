import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

// Simple Landing Page
const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">NCQ Platform</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Experience the future of integrated business solutions with our comprehensive platform demo
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/dashboard"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg rounded-lg font-semibold transition-colors"
          >
            Explore Dashboard →
          </Link>
          <button
            onClick={() => toast.success('Interactive tour starting soon!')}
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 text-lg rounded-lg font-semibold transition-colors"
          >
            Start Interactive Tour
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {[
            { icon: '💳', title: 'Payment Gateway', desc: 'Secure multi-channel payment processing' },
            { icon: '🏥', title: 'Hospital Management', desc: 'Complete HMS with patient records' },
            { icon: '🏨', title: 'Smart Hospitality', desc: 'Modern hotel management with IoT' },
            { icon: '📡', title: 'IoT Platform', desc: 'Real-time device monitoring' },
            { icon: '🤖', title: 'AI Platform', desc: 'Advanced LLM capabilities' },
            { icon: '📊', title: 'Analytics', desc: 'Business intelligence dashboard' }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// Simple Dashboard
const Dashboard = () => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">NCQ Platform</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => toast.success('Feature coming soon!')}
              className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Interactive Tour
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-600 mt-1">Real-time insights across all NCQ Platform services</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Revenue', value: 'SAR 2.4M', change: '+12.5%', icon: '💰' },
          { title: 'Active Users', value: '52,841', change: '+8.2%', icon: '👥' },
          { title: 'Transactions', value: '124,523', change: '+15.3%', icon: '💳' },
          { title: 'System Health', value: '99.9%', change: '+0.1%', icon: '⚡' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{metric.icon}</span>
              <span className="text-sm font-medium text-green-600">{metric.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{metric.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Payment Gateway', icon: '💳', color: 'blue', desc: 'Process payments securely' },
          { name: 'Hospital Management', icon: '🏥', color: 'green', desc: 'Manage patient care' },
          { name: 'Smart Hospitality', icon: '🏨', color: 'purple', desc: 'Hotel operations' },
          { name: 'IoT Platform', icon: '📡', color: 'orange', desc: 'Device monitoring' },
          { name: 'AI Platform', icon: '🤖', color: 'indigo', desc: 'AI-powered insights' },
          { name: 'Analytics', icon: '📊', color: 'pink', desc: 'Business intelligence' }
        ].map((module, index) => (
          <button
            key={index}
            onClick={() => toast.success(`${module.name} demo coming soon!`)}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{module.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {module.name}
                </h3>
                <p className="text-sm text-gray-500">{module.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">System Status</h3>
            <p className="text-primary-100 mt-1">All services operational</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live</span>
          </div>
        </div>
      </div>
    </main>
  </div>
)

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App