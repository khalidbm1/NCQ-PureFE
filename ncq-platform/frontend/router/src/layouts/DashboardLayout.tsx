import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Menu, X, Home, BarChart3, FileText, User, Settings, 
  CreditCard, Cpu, Building2, Box, Hotel, Brain,
  LogOut, Moon, Sun, Globe, ChevronDown, Search,
  Bell, HelpCircle
} from 'lucide-react'
import { cn } from '@ncq/design-system/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@ncq/design-system/components/Avatar'
import { Button } from '@ncq/design-system/components/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ncq/design-system/components/Dropdown'
import { routePaths } from '../router/AppRouter'

interface NavItem {
  path: string
  label: string
  labelAr: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  requiredRoles?: string[]
}

const navItems: NavItem[] = [
  { 
    path: routePaths.dashboard.root, 
    label: 'Dashboard', 
    labelAr: 'لوحة القيادة',
    icon: Home 
  },
  { 
    path: routePaths.dashboard.analytics, 
    label: 'Analytics', 
    labelAr: 'التحليلات',
    icon: BarChart3 
  },
  { 
    path: routePaths.dashboard.reports, 
    label: 'Reports', 
    labelAr: 'التقارير',
    icon: FileText 
  },
  { 
    path: routePaths.features.payment, 
    label: 'Payments', 
    labelAr: 'المدفوعات',
    icon: CreditCard,
    badge: 'New'
  },
  { 
    path: routePaths.features.iot, 
    label: 'IoT Devices', 
    labelAr: 'أجهزة IoT',
    icon: Cpu 
  },
  { 
    path: routePaths.features.hospital, 
    label: 'Hospital', 
    labelAr: 'المستشفى',
    icon: Building2 
  },
  { 
    path: routePaths.features.blockchain, 
    label: 'Blockchain', 
    labelAr: 'بلوكشين',
    icon: Box 
  },
  { 
    path: routePaths.features.hospitality, 
    label: 'Hospitality', 
    labelAr: 'الضيافة',
    icon: Hotel 
  },
  { 
    path: routePaths.features.ai, 
    label: 'AI Platform', 
    labelAr: 'منصة الذكاء الاصطناعي',
    icon: Brain 
  },
]

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate(routePaths.auth.login)
  }

  const filteredNavItems = navItems.filter(item => {
    if (item.requiredRoles && user) {
      return item.requiredRoles.some(role => user.roles?.includes(role))
    }
    return true
  })

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 flex w-72 flex-col bg-white dark:bg-gray-800 lg:relative lg:z-auto",
          "transform transition-transform duration-300 ease-in-out lg:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="NCQ" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              NCQ Platform
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || 
                             location.pathname.startsWith(item.path + '/')
              
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-ncq-primary-50 text-ncq-primary-600 dark:bg-ncq-primary-900/20 dark:text-ncq-primary-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      )
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1">
                      {language === 'ar' ? item.labelAr : item.label}
                    </span>
                    {item.badge && (
                      <span className="rounded-full bg-ncq-primary-100 px-2 py-0.5 text-xs font-medium text-ncq-primary-600 dark:bg-ncq-primary-900/40 dark:text-ncq-primary-400">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t p-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border bg-gray-50 pl-10 pr-4 py-2 text-sm focus:border-ncq-primary-500 focus:outline-none focus:ring-1 focus:ring-ncq-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Globe className="h-5 w-5" />
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            {/* Help */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(routePaths.dashboard.profile)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(routePaths.dashboard.settings)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <React.Suspense fallback={<div className="animate-pulse">Loading...</div>}>
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </div>
  )
}