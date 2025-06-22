import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Bell,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Activity,
  Key,
  FileSearch,
  ChevronLeft,
  X,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../stores/auth'
import { Badge } from '../ui/badge'
import { useTranslation } from 'react-i18next'

interface SidebarProps {
  open: boolean
  collapsed: boolean
  onOpenChange: (open: boolean) => void
  onCollapsedChange: (collapsed: boolean) => void
}

export function Sidebar({ open, collapsed, onOpenChange, onCollapsedChange }: SidebarProps) {
  const { t } = useTranslation()
  
  const navigation = [
    {
      name: t('sidebar.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('sidebar.users'),
      href: '/users',
      icon: Users,
      badge: 'Admin',
      requiredRole: 'admin',
    },
    {
      name: 'Tenants',
      href: '/tenants',
      icon: Building2,
      badge: 'Admin',
      requiredRole: 'admin',
    },
    {
      name: t('sidebar.billing'),
      href: '/payments',
      icon: CreditCard,
    },
    {
      name: t('common.notifications'),
      href: '/notifications',
      icon: Bell,
    },
    {
      name: 'Files',
      href: '/files',
      icon: FileText,
    },
    {
      name: t('sidebar.analytics'),
      href: '/analytics',
      icon: BarChart3,
    },
  ]

  const systemNavigation = [
    {
      name: 'System Health',
      href: '/system/health',
      icon: Activity,
      requiredRole: 'admin',
    },
    {
      name: t('settings.audit.title'),
      href: '/system/audit',
      icon: FileSearch,
      requiredRole: 'admin',
    },
  ]

  const settingsNavigation = [
    {
      name: t('common.settings'),
      href: '/settings',
      icon: Settings,
    },
    {
      name: t('settings.api.keys'),
      href: '/settings/api-keys',
      icon: Key,
    },
  ]
  const location = useLocation()
  const { user } = useAuthStore()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(href)
  }

  const hasRole = (requiredRole?: string) => {
    if (!requiredRole) return true
    return user?.role === requiredRole || user?.role === 'super_admin'
  }

  const NavItem = ({ item, onClick }: { item: any; onClick?: () => void }) => {
    if (!hasRole(item.requiredRole)) return null

    return (
      <NavLink
        to={item.href}
        onClick={onClick}
        className={cn(
          "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          isActive(item.href)
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
        )}
      >
        <item.icon
          className={cn(
            "flex-shrink-0 w-5 h-5 transition-colors duration-200",
            isActive(item.href)
              ? "text-primary-foreground"
              : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
          )}
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-3 flex items-center justify-between flex-1 overflow-hidden"
            >
              <span className="truncate">{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {item.badge}
                </Badge>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </NavLink>
    )
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 overflow-hidden"
                >
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    NCQ Admin
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>

          {/* System Section */}
          {systemNavigation.some(item => hasRole(item.requiredRole)) && (
            <div className="pt-6">
              {!collapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  System
                </h3>
              )}
              <div className="mt-2 space-y-1">
                {systemNavigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Settings Section */}
          <div className="pt-6">
            {!collapsed && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </h3>
            )}
            <div className="mt-2 space-y-1">
              {settingsNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </div>
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ChevronLeft
              className={cn(
                "w-5 h-5 transition-transform duration-200",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
              NCQ Admin
            </h1>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavItem 
                key={item.name} 
                item={item} 
                onClick={() => onOpenChange(false)}
              />
            ))}
          </div>

          {systemNavigation.some(item => hasRole(item.requiredRole)) && (
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                System
              </h3>
              <div className="mt-2 space-y-1">
                {systemNavigation.map((item) => (
                  <NavItem 
                    key={item.name} 
                    item={item} 
                    onClick={() => onOpenChange(false)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </h3>
            <div className="mt-2 space-y-1">
              {settingsNavigation.map((item) => (
                <NavItem 
                  key={item.name} 
                  item={item} 
                  onClick={() => onOpenChange(false)}
                />
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}