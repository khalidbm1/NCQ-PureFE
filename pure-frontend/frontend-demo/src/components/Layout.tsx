import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiHome, FiCreditCard, FiActivity, FiWifi, FiBriefcase, 
  FiCpu, FiMenu, FiX, FiBell, FiHelpCircle, FiPlay,
  FiSettings, FiLogOut, FiUser
} from 'react-icons/fi'
import { useDemoStore } from '../stores/demoStore'
import toast from 'react-hot-toast'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome, className: 'tour-dashboard' },
  { name: 'Payment Gateway', href: '/payment-gateway', icon: FiCreditCard, className: 'tour-payment' },
  { name: 'Hospital Management', href: '/hospital', icon: FiActivity },
  { name: 'Smart Hospitality', href: '/hospitality', icon: FiBriefcase },
  { name: 'IoT Platform', href: '/iot', icon: FiWifi },
  { name: 'AI Platform', href: '/ai', icon: FiCpu },
]

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { addVisitedPage, showTooltips } = useDemoStore()

  useEffect(() => {
    addVisitedPage(location.pathname)
  }, [location.pathname, addVisitedPage])

  const mockNotifications = [
    { id: 1, title: 'New Payment Received', message: 'SAR 1,250 from Hospital XYZ', time: '2 min ago', type: 'success' },
    { id: 2, title: 'IoT Alert', message: 'Temperature sensor offline in Room 302', time: '5 min ago', type: 'warning' },
    { id: 3, title: 'AI Model Update', message: 'Sentiment analysis model improved by 12%', time: '1 hour ago', type: 'info' },
    { id: 4, title: 'New Booking', message: 'Suite 501 booked for 3 nights', time: '2 hours ago', type: 'success' },
  ]

  const handleStartTour = () => {
    navigate('/dashboard')
    setTimeout(() => {
      window.location.reload()
      localStorage.removeItem('ncq-demo-tour-seen')
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        <motion.nav
          initial={false}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          className="fixed top-0 left-0 bottom-0 flex flex-col w-64 bg-white border-r border-gray-200"
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                N
              </div>
              <span className="font-bold text-xl gradient-text">NCQ Platform</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      ${item.className || ''}
                      group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`
                      mr-3 flex-shrink-0 h-5 w-5
                      ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                    `} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </motion.nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <nav className="flex-1 flex flex-col bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                N
              </div>
              <span className="font-bold text-xl gradient-text">NCQ Platform</span>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="tour-navigation px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      ${item.className || ''}
                      group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    data-tooltip={showTooltips ? `Navigate to ${item.name}` : undefined}
                  >
                    <item.icon className={`
                      mr-3 flex-shrink-0 h-5 w-5
                      ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                    `} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          
          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Demo User</p>
                <p className="text-xs text-gray-500">admin@ncq.sa</p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="px-4 text-gray-500 focus:outline-none lg:hidden"
              >
                <FiMenu className="h-6 w-6" />
              </button>

              <div className="flex-1 flex items-center justify-end space-x-4">
                {/* Tour Button */}
                <button
                  onClick={handleStartTour}
                  className="btn-secondary px-4 py-2 flex items-center space-x-2"
                  data-tooltip="Restart the interactive tour"
                >
                  <FiPlay className="w-4 h-4" />
                  <span>Tour</span>
                </button>

                {/* Help Button */}
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
                  data-tooltip="Get help"
                  onClick={() => toast.success('Help documentation coming soon!')}
                >
                  <FiHelpCircle className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <div className="relative tour-notifications">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-400 hover:text-gray-500 transition-colors relative"
                    data-tooltip="View notifications"
                  >
                    <FiBell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>

                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {mockNotifications.map((notif) => (
                          <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                            <div className="flex items-start space-x-3">
                              <div className={`
                                w-2 h-2 rounded-full mt-1.5 flex-shrink-0
                                ${notif.type === 'success' ? 'bg-green-500' : ''}
                                ${notif.type === 'warning' ? 'bg-yellow-500' : ''}
                                ${notif.type === 'info' ? 'bg-blue-500' : ''}
                              `} />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Settings */}
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
                  data-tooltip="Settings"
                  onClick={() => toast.success('Settings page coming soon!')}
                >
                  <FiSettings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 tour-welcome">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout