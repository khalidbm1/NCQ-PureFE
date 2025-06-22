import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Cpu, Activity, Settings as SettingsIcon, BarChart, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import NCQHeader from '@/components/NCQHeader'
import { useLanguage } from '@/contexts/LanguageContext'

const navigation = [
  { name: 'dashboard', href: '/dashboard', icon: Home },
  { name: 'devices', href: '/devices', icon: Cpu },
  { name: 'telemetry', href: '/telemetry', icon: Activity },
  { name: 'automation', href: '/automation', icon: Zap },
  { name: 'analytics', href: '/analytics', icon: BarChart },
  { name: 'settings', href: '/settings', icon: SettingsIcon },
]

export default function MainLayout() {
  const location = useLocation()
  const { t } = useLanguage()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* NCQ Header */}
      <NCQHeader 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        isMenuOpen={isSidebarOpen}
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 lg:transform-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "pt-16"
        )}>
          <div className="flex h-full flex-col">
            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      'sidebar-link group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'active bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5 transition-colors',
                        isActive
                          ? 'text-primary'
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      )}
                    />
                    {t(item.name)}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                NCQ IoT Platform v1.0.0
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 lg:pl-64">
          <main className="min-h-screen p-4 lg:p-6">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}