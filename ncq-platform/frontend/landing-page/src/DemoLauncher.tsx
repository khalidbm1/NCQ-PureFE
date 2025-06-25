import { useEffect } from 'react'
import {
  Building2,
  BedDouble,
  Brain,
  CreditCard,
  Network,
  Link as LinkIcon
} from 'lucide-react'
import './i18n/config'

function DemoLauncher() {
  useEffect(() => {
    document.documentElement.lang = 'en'
    document.documentElement.dir = 'ltr'
  }, [])

  const products = [
    {
      name: 'Hospital Management',
      icon: Building2,
      color: 'red',
      bg: 'bg-red-100',
      text: 'text-red-600',
      url: 'http://localhost:5001',
      features: ['200+ Demo Patients', 'Real-time IoT Monitoring', 'Blockchain Medical Records']
    },
    {
      name: 'Smart Hospitality',
      icon: BedDouble,
      color: 'blue',
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      url: 'http://localhost:4000',
      features: ['5 Demo Properties', 'Room Automation', 'Energy Management']
    },
    {
      name: 'NCQ LLM Platform',
      icon: Brain,
      color: 'purple',
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      url: 'http://localhost:8000',
      features: ['GPT-4 & Claude', 'Privacy Preserving', 'API Integration']
    },
    {
      name: 'Payment Gateway',
      icon: CreditCard,
      color: 'green',
      bg: 'bg-green-100',
      text: 'text-green-600',
      url: 'http://localhost:8080',
      features: ['MADA & SADAD', 'Live Simulator', 'Fraud Detection']
    },
    {
      name: 'IoT Platform',
      icon: Network,
      color: 'orange',
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      url: 'http://localhost:3005',
      features: ['25+ Demo Devices', 'Live Telemetry', 'Automation Rules']
    },
    {
      name: 'Blockchain Integration',
      icon: LinkIcon,
      color: 'indigo',
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      url: 'http://localhost:8090',
      features: ['Medical Records', 'Smart Contracts', 'Audit Trail']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">NCQ</h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block animate-pulse" />
                Demo Mode Active
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Full Platform Demo</span>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">NCQ Complete Ecosystem</h1>
          <p className="text-xl text-gray-600 mb-8">Experience our full suite of enterprise solutions - No authentication required</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105"
              onClick={() => window.open(product.url, '_blank')}
            >
              <div className="p-6">
                <div className={`w-16 h-16 ${product.bg} rounded-lg flex items-center justify-center mb-4`}>
                  <product.icon className={`${product.text} text-2xl`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <ul className="space-y-1 text-sm text-gray-600 mb-4">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">Demo Ready</span>
                  <span className="text-blue-600 font-medium">Launch →</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default DemoLauncher
