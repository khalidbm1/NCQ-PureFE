import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  CreditCardIcon,
  ChartBarIcon,
  BanknotesIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  KeyIcon,
  LinkIcon,
  BuildingOfficeIcon,
  CogIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useTranslation } from '@/shared/hooks/useTranslation'
import { useTheme } from '@/shared/contexts/ThemeContext'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  translationKey: string
}

const navigation: NavigationItem[] = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon, translationKey: 'navigation.overview' },
  { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCardIcon, translationKey: 'navigation.transactions' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, translationKey: 'navigation.analytics' },
  { name: 'Settlements', href: '/dashboard/settlements', icon: BanknotesIcon, translationKey: 'navigation.settlements' },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: ArrowPathIcon, translationKey: 'navigation.subscriptions' },
  { name: 'Payment Methods', href: '/dashboard/payment-methods', icon: CreditCardIcon, translationKey: 'navigation.paymentMethods' },
  { name: 'Security', href: '/dashboard/security', icon: ShieldCheckIcon, translationKey: 'navigation.security' },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: KeyIcon, translationKey: 'navigation.apiKeys' },
  { name: 'Webhooks', href: '/dashboard/webhooks', icon: LinkIcon, translationKey: 'navigation.webhooks' },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon, translationKey: 'navigation.settings' },
]

const adminNavigation: NavigationItem[] = [
  { name: 'Merchants', href: '/admin/merchants', icon: BuildingOfficeIcon, translationKey: 'navigation.merchants' },
  { name: 'System Analytics', href: '/admin/system-analytics', icon: ChartBarIcon, translationKey: 'navigation.systemAnalytics' },
]

interface NCQSidebarProps {
  isOpen: boolean
  onClose: () => void
  user?: any
  mobile?: boolean
}

const NCQSidebar: React.FC<NCQSidebarProps> = ({ isOpen, onClose, user, mobile = false }) => {
  const location = useLocation()
  const { t } = useTranslation()
  const { theme } = useTheme()

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(href)
  }

  const NavigationItem: React.FC<{ item: NavigationItem; isAdmin?: boolean }> = ({ item, isAdmin = false }) => {
    const isActive = isActiveRoute(item.href)

    return (
      <Link to={item.href}>
        <motion.div
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
            ${isActive
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }
            ${isAdmin ? 'border-l-4 border-orange-400 dark:border-orange-500' : ''}
          `}
        >
          {isActive && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-lg"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <item.icon 
            className={`relative z-10 mr-3 rtl:ml-3 rtl:mr-0 h-5 w-5 ${
              isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
          <span className="relative z-10">{t(item.translationKey)}</span>
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-0 rtl:left-0 rtl:right-auto w-1 h-6 bg-green-500 rounded-full"
            />
          )}
        </motion.div>
      </Link>
    )
  }

  const sidebarContent = (
    <>
      {/* Sidebar header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md"
          >
            <CreditCardIcon className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">NCQ</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Payment Gateway</p>
          </div>
        </div>
        
        {mobile && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavigationItem key={item.name} item={item} />
          ))}
        </div>

        {/* Admin section */}
        {user?.role === 'ADMIN' && (
          <div className="mt-8">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('navigation.administration')}
              </h3>
            </div>
            <div className="space-y-1">
              {adminNavigation.map((item) => (
                <NavigationItem key={item.name} item={item} isAdmin />
              ))}
            </div>
          </div>
        )}

        {/* Merchant info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 px-3 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t('dashboard.merchantId')}
          </div>
          <div className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate">
            {user?.merchantId || 'NCQ-XXXX-XXXX'}
          </div>
        </motion.div>
      </nav>
    </>
  )

  if (mobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative flex flex-col w-full max-w-xs bg-white dark:bg-gray-900 shadow-xl"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        {sidebarContent}
      </div>
    </div>
  )
}

export default NCQSidebar