'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  KeyIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  CubeIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/lib/stores/authStore'
import { UserRole } from '@/lib/types'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: 'all',
  },
  {
    name: 'Rooms',
    href: '/rooms',
    icon: KeyIcon,
    roles: 'all',
  },
  {
    name: 'Guests',
    href: '/guests',
    icon: UserGroupIcon,
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.FRONT_DESK],
  },
  {
    name: 'Housekeeping',
    href: '/housekeeping',
    icon: ClipboardDocumentListIcon,
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.HOUSEKEEPING, UserRole.SUPERVISOR],
  },
  {
    name: 'Maintenance',
    href: '/maintenance',
    icon: WrenchScrewdriverIcon,
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.MAINTENANCE, UserRole.SUPERVISOR],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: CubeIcon,
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.HOUSEKEEPING, UserRole.SUPERVISOR],
  },
  {
    name: 'IoT Devices',
    href: '/devices',
    icon: CpuChipIcon,
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.MAINTENANCE],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout, hasRole } = useAuthStore()

  const filteredNavigation = navigation.filter((item) => {
    if (item.roles === 'all') return true
    return hasRole(item.roles as UserRole[])
  })

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center bg-gray-800">
        <h1 className="text-xl font-bold text-white">Smart Hospitality</h1>
      </div>

      {/* User info */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-800 p-4">
        <button
          onClick={logout}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
          Logout
        </button>
      </div>
    </div>
  )
}