import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Upload,
  CreditCard,
  Key,
  Settings,
  HelpCircle,
  BarChart3,
  Users,
  X,
  Building2,
  Brain,
  Hotel,
  Wifi,
  CreditCard as PaymentIcon,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../stores/auth'

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Files',
    href: '/files',
    icon: FileText,
  },
  {
    name: 'Upload',
    href: '/upload',
    icon: Upload,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
]

const accountNavigation = [
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCard,
  },
  {
    name: 'API Keys',
    href: '/api-keys',
    icon: Key,
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users,
  },
]

const productNavigation = [
  {
    name: 'Hospital Management',
    href: '/hospital',
    icon: Building2,
  },
  {
    name: 'LLM Platform',
    href: '/llm',
    icon: Brain,
  },
  {
    name: 'Smart Buildings',
    href: '/smart-buildings',
    icon: Building2,
  },
  {
    name: 'IoT Platform',
    href: '/iot',
    icon: Wifi,
  },
  {
    name: 'Payment Gateway',
    href: '/payment-gateway',
    icon: PaymentIcon,
  },
  {
    name: 'Hospitality Hub',
    href: '/hospitality',
    icon: Hotel,
  },
]

const settingsNavigation = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    name: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
  },
]

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuthStore()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(href)
  }

  const NavItem = ({ item, onClick }: { item: any; onClick?: () => void }) => {
    return (
      <NavLink
        to={item.href}
        onClick={onClick}
        className={cn(
          "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          isActive(item.href)
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <item.icon
          className={cn(
            "flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200",
            isActive(item.href)
              ? "text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        <span>{item.name}</span>
      </NavLink>
    )
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-background lg:border-r lg:z-30">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </h3>
            <div className="space-y-1 mt-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Products
            </h3>
            <div className="space-y-1 mt-2">
              {productNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Account Section */}
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account
            </h3>
            <div className="space-y-1 mt-2">
              {accountNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Support
            </h3>
            <div className="space-y-1 mt-2">
              {settingsNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </div>
        </nav>

        {/* Storage Usage */}
        <div className="p-4 border-t">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Storage Used</span>
              <span className="text-xs text-muted-foreground">
                {user?.stats?.storageUsed || 0} MB / 1 GB
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(((user?.stats?.storageUsed || 0) / 1024) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {user?.subscription?.plan === 'free' ? 'Upgrade for more storage' : 'Plenty of space remaining'}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => onOpenChange(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r lg:hidden"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <span className="text-xl font-bold">NCQ Platform</span>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                <div className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Main
                  </h3>
                  <div className="space-y-1 mt-2">
                    {navigation.map((item) => (
                      <NavItem 
                        key={item.name} 
                        item={item} 
                        onClick={() => onOpenChange(false)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Products
                  </h3>
                  <div className="space-y-1 mt-2">
                    {productNavigation.map((item) => (
                      <NavItem 
                        key={item.name} 
                        item={item} 
                        onClick={() => onOpenChange(false)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Account
                  </h3>
                  <div className="space-y-1 mt-2">
                    {accountNavigation.map((item) => (
                      <NavItem 
                        key={item.name} 
                        item={item} 
                        onClick={() => onOpenChange(false)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Support
                  </h3>
                  <div className="space-y-1 mt-2">
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

              {/* Mobile Storage Usage */}
              <div className="p-4 border-t">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.stats?.storageUsed || 0} MB / 1 GB
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(((user?.stats?.storageUsed || 0) / 1024) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}