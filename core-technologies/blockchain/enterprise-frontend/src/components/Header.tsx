import React from 'react'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import { useBlockchain } from '../contexts/BlockchainContext'

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { stats, isConnected } = useBlockchain()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            onClick={onMenuClick}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="ml-4 lg:ml-0">
            <h2 className="text-xl font-semibold text-gray-900">
              Enterprise Blockchain Dashboard
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Network Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Block Height */}
          {stats && (
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Block:</span> {stats.chainLength}
              </div>
              <div>
                <span className="font-medium">Pending:</span> {stats.pendingTransactions}
              </div>
            </div>
          )}

          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header