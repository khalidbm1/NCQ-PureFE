import React from 'react'
import { useTranslation } from 'react-i18next'

interface DemoApp {
  name: string
  description: string
  icon: string
  port: number
  path: string
  color: string
  features: string[]
}

const demoApps: DemoApp[] = [
  {
    name: 'Admin Dashboard',
    description: 'Enterprise administration portal with full platform oversight',
    icon: '👨‍💼',
    port: 3001,
    path: '/',
    color: 'from-blue-600 to-blue-800',
    features: ['User Management', 'System Analytics', 'Platform Monitoring', 'Enterprise Settings']
  },
  {
    name: 'User Portal',
    description: 'Customer self-service portal with account management',
    icon: '👤',
    port: 3002,
    path: '/',
    color: 'from-green-600 to-green-800',
    features: ['Profile Management', 'Billing & Payments', 'Service Requests', 'Usage Analytics']
  },
  {
    name: 'Hospital Management',
    description: 'Complete HMS with patient records, appointments, and billing',
    icon: '🏥',
    port: 3003,
    path: '/',
    color: 'from-red-600 to-red-800',
    features: ['Patient Records', 'Appointment Scheduling', 'Medical Billing', 'Staff Management']
  },
  {
    name: 'Payment Gateway',
    description: 'Multi-channel payment processing with mada, Visa, and digital wallets',
    icon: '💳',
    port: 3004,
    path: '/',
    color: 'from-purple-600 to-purple-800',
    features: ['Payment Processing', 'Merchant Management', 'Transaction Analytics', 'Fraud Detection']
  },
  {
    name: 'Smart Hospitality',
    description: 'Modern hotel management with IoT integration',
    icon: '🏨',
    port: 3005,
    path: '/',
    color: 'from-yellow-600 to-yellow-800',
    features: ['Guest Management', 'Room Controls', 'Housekeeping', 'IoT Integration']
  },
  {
    name: 'IoT Platform',
    description: 'Real-time device monitoring and management',
    icon: '📡',
    port: 3006,
    path: '/',
    color: 'from-indigo-600 to-indigo-800',
    features: ['Device Management', 'Real-time Monitoring', 'Alert System', 'Analytics Dashboard']
  },
  {
    name: 'AI/LLM Platform',
    description: 'Advanced language model capabilities and analytics',
    icon: '🤖',
    port: 3007,
    path: '/',
    color: 'from-pink-600 to-pink-800',
    features: ['Model Management', 'Chat Interface', 'API Integration', 'Usage Analytics']
  },
  {
    name: 'API Portal',
    description: 'Developer documentation and testing interface',
    icon: '📚',
    port: 3008,
    path: '/',
    color: 'from-gray-600 to-gray-800',
    features: ['API Documentation', 'Interactive Testing', 'Code Examples', 'SDK Downloads']
  }
]

export const DemoLauncher: React.FC = () => {
  const { t } = useTranslation()

  const openDemo = (app: DemoApp) => {
    const url = `http://localhost:${app.port}${app.path}?demo=true`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const startAllDemos = () => {
    demoApps.forEach(app => {
      setTimeout(() => openDemo(app), 500)
    })
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🎪 {t('Interactive Demo Launcher')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('Experience the complete NCQ Platform ecosystem. Each application runs independently with full demo data and no authentication required.')}
          </p>
          
          {/* Demo Credentials Sticky Note */}
          <div className="max-w-md mx-auto bg-yellow-200 border-2 border-yellow-300 rounded-lg p-4 shadow-lg mb-8">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-yellow-800">🔐 Demo Credentials</h4>
              <button 
                onClick={() => navigator.clipboard.writeText('admin@ncq.sa\nNCQDemo2024!\nncq_demo_key_123')}
                className="text-yellow-600 hover:text-yellow-800 text-sm"
              >
                📋 Copy All
              </button>
            </div>
            <div className="text-sm text-yellow-800 space-y-1">
              <p><strong>Username:</strong> admin@ncq.sa</p>
              <p><strong>Password:</strong> NCQDemo2024!</p>
              <p><strong>API Key:</strong> ncq_demo_key_123</p>
            </div>
          </div>

          {/* Quick Start Button */}
          <button
            onClick={startAllDemos}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            🚀 Launch All Demos
          </button>
        </div>

        {/* Demo Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {demoApps.map((app, index) => (
            <div key={index} className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              {/* Header */}
              <div className={`bg-gradient-to-r ${app.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{app.icon}</span>
                  <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                    :{app.port}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{t(app.name)}</h3>
                <p className="text-sm opacity-90">{t(app.description)}</p>
              </div>

              {/* Features */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                <ul className="space-y-2 mb-6">
                  {app.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {t(feature)}
                    </li>
                  ))}
                </ul>

                {/* Launch Button */}
                <button
                  onClick={() => openDemo(app)}
                  className={`w-full bg-gradient-to-r ${app.color} text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-all`}
                >
                  🎯 Launch Demo
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Demo Instructions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">🎪 Interactive Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Click any "Launch Demo" button to open that application</li>
                <li>• Use "Launch All Demos" to open every application at once</li>
                <li>• No authentication required - bypass all login screens</li>
                <li>• All applications have realistic mock data pre-loaded</li>
                <li>• Interactive tours guide you through key features</li>
                <li>• Copy demo credentials with one click</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">💡 Presentation Tips</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Start with Admin Dashboard for platform overview</li>
                <li>• Use Hospital Management to show healthcare features</li>
                <li>• Demonstrate payments with Payment Gateway</li>
                <li>• Show IoT integration with Smart Hospitality</li>
                <li>• Highlight AI capabilities with LLM Platform</li>
                <li>• Reference API Portal for technical discussions</li>
              </ul>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">🎯 Demo Status</h4>
                <p className="text-gray-600 mt-1">All systems operational and ready for demonstration</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DemoLauncher