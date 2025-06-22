import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, Users, Settings, FileText, Monitor,
  Shield, Database, Activity, AlertTriangle, LogOut,
  ChevronRight
} from 'lucide-react'
import { cn } from '@ncq/design-system/utils'
import { Button } from '@ncq/design-system/components/Button'
import { Alert, AlertDescription, AlertTitle } from '@ncq/design-system/components/Alert'
import { routePaths } from '../router/AppRouter'

interface AdminNavItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  requiredPermissions?: string[]
}

const adminNavItems: AdminNavItem[] = [
  { 
    path: routePaths.admin.root, 
    label: 'Overview', 
    icon: LayoutDashboard 
  },
  { 
    path: routePaths.admin.users, 
    label: 'User Management', 
    icon: Users,
    requiredPermissions: ['users.manage']
  },
  { 
    path: routePaths.admin.configuration, 
    label: 'System Configuration', 
    icon: Settings,
    requiredPermissions: ['system.configure']
  },
  { 
    path: routePaths.admin.auditLogs, 
    label: 'Audit Logs', 
    icon: FileText,
    requiredPermissions: ['audit.view']
  },
  { 
    path: routePaths.admin.monitoring, 
    label: 'Service Monitoring', 
    icon: Monitor,
    requiredPermissions: ['monitoring.view']
  },
]

export function AdminLayout() {
  const { user, hasPermission, logout } = useAuth()
  const navigate = useNavigate()

  const handleBackToDashboard = () => {
    navigate(routePaths.dashboard.root)
  }

  const handleLogout = async () => {
    await logout()
    navigate(routePaths.auth.login)
  }

  const filteredNavItems = adminNavItems.filter(item => {
    if (item.requiredPermissions) {
      return item.requiredPermissions.every(permission => hasPermission(permission))
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin header */}
      <header className="sticky top-0 z-30 bg-red-600 dark:bg-red-700 text-white shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">NCQ Admin Console</h1>
              <p className="text-sm text-red-100">System Administration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-red-100">
              Logged in as: <strong>{user?.name}</strong>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="text-white hover:bg-red-700 dark:hover:bg-red-800"
            >
              Back to Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-red-700 dark:hover:bg-red-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Admin navigation */}
        <nav className="bg-red-700 dark:bg-red-800">
          <div className="flex overflow-x-auto px-6">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === routePaths.admin.root}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                      isActive
                        ? "border-white text-white bg-red-800 dark:bg-red-900"
                        : "border-transparent text-red-100 hover:text-white hover:border-red-300"
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        </nav>
      </header>

      {/* Security warning */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <Alert className="bg-transparent border-none p-0">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-200">
              Administrative Access
            </AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              All actions in this area are logged and monitored. Ensure you have proper authorization before making changes.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate(routePaths.home)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Home
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <button
              onClick={() => navigate(routePaths.dashboard.root)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Dashboard
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium">
              Admin
            </span>
          </nav>
        </div>
      </div>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Session timer */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Activity className="h-4 w-4" />
            <span>Session expires in: <strong>28:45</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Database className="h-4 w-4" />
            <span>Database: <strong className="text-green-600 dark:text-green-400">Connected</strong></span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <React.Suspense 
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ncq-primary-600"></div>
              </div>
            }
          >
            <Outlet />
          </React.Suspense>
        </div>
      </main>

      {/* Admin footer */}
      <footer className="mt-12 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>NCQ Admin Console v1.0.0</span>
            <span>Last system update: 2 hours ago</span>
          </div>
        </div>
      </footer>
    </div>
  )
}