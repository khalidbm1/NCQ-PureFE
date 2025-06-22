'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Shield
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Tenants',
    href: '/dashboard/tenants',
    icon: Users
  },
  {
    title: 'Licenses',
    href: '/dashboard/licenses',
    icon: Package
  },
  {
    title: 'Usage Analytics',
    href: '/dashboard/usage',
    icon: BarChart3
  },
  {
    title: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard
  },
  {
    title: 'System Health',
    href: '/dashboard/health',
    icon: Activity
  },
  {
    title: 'Security',
    href: '/dashboard/security',
    icon: Shield
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  }
]

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "bg-gray-900 text-white transition-all duration-300",
      open ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {open && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg mr-3"></div>
            <span className="text-xl font-bold">NCQ Admin</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  )}
                >
                  <item.icon size={20} />
                  {open && <span className="ml-3">{item.title}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {open && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="text-sm text-gray-400">
            <p>NCQ Platform v1.0.0</p>
            <p className="mt-1">© 2024 NCQ Inc.</p>
          </div>
        </div>
      )}
    </div>
  )
}