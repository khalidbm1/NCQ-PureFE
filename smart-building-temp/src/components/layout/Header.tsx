import { useState, useEffect } from 'react'
import { Menu, Bell, User, Settings, LogOut, Wifi, WifiOff, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'

interface HeaderProps {
  onMenuClick: () => void
  currentView: string
}

interface NotificationData {
  id: number
  title: string
  time: string
  type: 'info' | 'success' | 'warning'
  unread: boolean
}

export function Header({ onMenuClick, currentView }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { t } = useLanguage()
  const isConnected = true

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'room-control':
        return 'Room Control';
      case 'services':
        return 'Services';
      case 'profile':
        return 'Profile';
      default:
        return 'Dashboard';
    }
  };

  const notifications: NotificationData[] = [
    { id: 1, title: t('notifications.newBooking'), time: '2 min ago', type: 'success', unread: true },
    { id: 2, title: t('notifications.checkIn'), time: '5 min ago', type: 'info', unread: true },
    { id: 3, title: t('notifications.maintenance'), time: '1 hour ago', type: 'warning', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  const handleLogout = () => {
    window.location.href = '/auth/login'
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Page title */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{getViewTitle()}</h1>
            <p className="text-sm text-gray-500">Welcome back, John Doe</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Connection status */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <span className="hidden sm:block text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile */}
          <button className="flex items-center space-x-3 rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-900">John Doe</span>
          </button>
        </div>
      </div>
    </header>
  )
}