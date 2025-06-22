'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useNotificationStore } from '@/lib/stores/notificationStore'
import { formatRelativeTime } from '@/lib/utils'

export function Header() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Search */}
          <div className="flex flex-1 items-center">
            <form className="flex w-full md:ml-0" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <div className="relative w-full max-w-md text-gray-400 focus-within:text-gray-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="search-field"
                  className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                  placeholder="Search rooms, guests, tasks..."
                  type="search"
                  name="search"
                />
              </div>
            </form>
          </div>

          {/* Right section */}
          <div className="ml-4 flex items-center space-x-4">
            {/* Notifications */}
            <Menu as="div" className="relative">
              <Menu.Button className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notification) => (
                          <Menu.Item key={notification.id}>
                            {({ active }) => (
                              <div
                                onClick={() => markAsRead(notification.id)}
                                className={cn(
                                  active ? 'bg-gray-100' : '',
                                  !notification.read ? 'bg-blue-50' : '',
                                  'px-4 py-3 cursor-pointer border-b border-gray-100'
                                )}
                              >
                                <div className="flex items-start">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                      {notification.subject || notification.type}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                      {notification.content}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {formatRelativeTime(notification.createdAt)}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="ml-2 flex-shrink-0">
                                      <div className="h-2 w-2 bg-primary-500 rounded-full" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Menu.Item>
                        ))
                      )}
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Current time */}
            <div className="text-sm text-gray-500">
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}