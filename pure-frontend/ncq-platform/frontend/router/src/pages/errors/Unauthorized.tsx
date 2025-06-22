import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldOff, LogIn, Home } from 'lucide-react'
import { Button } from '@ncq/design-system/components/Button'
import { useAuth } from '../../contexts/AuthContext'
import { routePaths } from '../../router/AppRouter'

export default function Unauthorized() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 403 illustration */}
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <ShieldOff className="w-16 h-16 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error message */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {isAuthenticated
            ? "You don't have permission to access this page. Please contact your administrator if you believe this is an error."
            : "You need to be logged in to access this page."}
        </p>

        {/* Additional info */}
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Error Code:</strong> 403 Forbidden
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            This page requires special permissions.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!isAuthenticated ? (
            <Button
              onClick={() => navigate(routePaths.auth.login)}
              variant="default"
              className="inline-flex items-center"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          ) : (
            <Button
              onClick={() => navigate(routePaths.dashboard.root)}
              variant="default"
              className="inline-flex items-center"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          )}
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="inline-flex items-center"
          >
            Go back
          </Button>
        </div>

        {/* Support link */}
        <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          If you believe you should have access,{' '}
          <a
            href="/support"
            className="font-medium text-ncq-primary-600 hover:text-ncq-primary-500 dark:text-ncq-primary-400 dark:hover:text-ncq-primary-300"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  )
}