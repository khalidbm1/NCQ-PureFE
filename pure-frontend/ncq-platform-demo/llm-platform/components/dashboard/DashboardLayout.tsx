'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Key,
  BarChart3,
  CreditCard,
  BookOpen,
  FlaskConical,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  Building2,
  Globe,
  Users,
  Shield
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/useTranslation'
import { useAuthStore } from '@/lib/store/auth'
import Currency from '@/components/ui/Currency'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { TenantSwitcher } from '@/components/tenant/TenantSwitcher'
import { useTenant } from '@/lib/context/tenant-context'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigationKeys = [
  { key: 'overview', href: '/dashboard', icon: LayoutDashboard },
  { key: 'apiKeys', href: '/dashboard/api-keys', icon: Key },
  { key: 'usage', href: '/dashboard/usage', icon: BarChart3 },
  { key: 'billing', href: '/dashboard/billing', icon: CreditCard },
  { key: 'models', href: '/dashboard/models', icon: BookOpen },
  { key: 'sandbox', href: '/dashboard/sandbox', icon: FlaskConical },
  { key: 'settings', href: '/dashboard/settings', icon: Settings },
]

const organizationNavigationKeys = [
  { key: 'organization', href: '/dashboard/organization', icon: Building2 },
  { key: 'orgMembers', href: '/dashboard/organization/members', icon: Users },
  { key: 'orgAnalytics', href: '/dashboard/organization/analytics', icon: BarChart3 },
  { key: 'orgBilling', href: '/dashboard/organization/billing', icon: CreditCard },
  { key: 'orgSettings', href: '/dashboard/organization/settings', icon: Settings },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const { t, language, setLanguage } = useI18n()
  const { logout, user } = useAuthStore()
  const { currentTenant, currentMember } = useTenant()
  const isRTL = language === 'ar'
  
  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  const navigation = navigationKeys.map(item => ({
    ...item,
    name: t(`dashboard.sidebar.${item.key}`)
  }))

  const organizationNavigation = organizationNavigationKeys.map(item => ({
    ...item,
    name: t(`dashboard.sidebar.${item.key}`)
  }))

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('brand.name')}
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* Tenant Switcher */}
          <div className="p-4 border-b dark:border-gray-700">
            <TenantSwitcher />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {/* Personal Dashboard */}
            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {t('dashboard.sidebar.personal')}
              </h3>
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Organization Dashboard */}
            {currentTenant && (
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {t('dashboard.sidebar.organization')}
                </h3>
                <ul className="space-y-1">
                  {organizationNavigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </nav>

          {/* Plan info */}
          <div className="border-t dark:border-gray-700 p-4">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              {currentTenant ? (
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {currentTenant.subscription.plan} Plan
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(currentTenant.quotas.tokens.limit / 1000).toLocaleString()}K tokens/month
                      </p>
                    </div>
                    <Link 
                      href="/dashboard/organization/billing"
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t('dashboard.subscription.upgrade')}
                    </Link>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600" 
                        style={{ 
                          width: `${Math.min((currentTenant.quotas.tokens.used / currentTenant.quotas.tokens.limit) * 100, 100)}%` 
                        }} 
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {(currentTenant.quotas.tokens.used / 1000).toLocaleString()}K {t('dashboard.subscription.tokensUsed')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t('dashboard.subscription.noOrganization')}
                  </p>
                  <Link 
                    href="/dashboard/organization/new"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t('dashboard.subscription.createOrganization')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={isRTL ? 'lg:pr-64' : 'lg:pl-64'}>
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6 text-gray-400" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Language Selector */}
              <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Globe className="h-4 w-4" />
                <span>{t(`languages.${language}`)}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {langMenuOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-32 rounded-lg bg-white dark:bg-gray-800 py-1 shadow-lg border dark:border-gray-700`}>
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setLangMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 text-left"
                  >
                    {t('languages.en')}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ar')
                      setLangMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 text-left"
                  >
                    {t('languages.ar')}
                  </button>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || ''}</p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 py-1 shadow-lg border dark:border-gray-700`}>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <User className="h-4 w-4" />
                    {t('dashboard.sidebar.profileSettings')}
                  </Link>
                  <Link
                    href="/dashboard/team"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <Building2 className="h-4 w-4" />
                    {t('dashboard.sidebar.teamManagement')}
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.signOut')}
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}