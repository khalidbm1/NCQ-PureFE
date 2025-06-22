import React from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'
import { ServerCrash, RefreshCw, Home, AlertTriangle } from 'lucide-react'
import { Button } from '@ncq/design-system/components/Button'
import { routePaths } from '../../router/AppRouter'

interface ServerErrorProps {
  error?: Error | any
}

export default function ServerError({ error: propError }: ServerErrorProps) {
  const navigate = useNavigate()
  const routeError = useRouteError() as any
  const error = propError || routeError

  const errorCode = error?.status || 500
  const errorMessage = error?.statusText || error?.message || 'Internal Server Error'

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Error illustration */}
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center animate-pulse">
            <ServerCrash className="w-16 h-16 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error message */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {errorCode === 500 ? 'Server Error' : `Error ${errorCode}`}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {errorCode === 500
            ? "We're experiencing technical difficulties. Our team has been notified and is working on a fix."
            : errorMessage}
        </p>

        {/* Error details */}
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-red-800 dark:text-red-200 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-semibold">Error Details</span>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Code:</strong> {errorCode}
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Message:</strong> {errorMessage}
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            Timestamp: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleRefresh}
            variant="default"
            className="inline-flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          
          <Button
            onClick={() => navigate(routePaths.home)}
            variant="outline"
            className="inline-flex items-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to homepage
          </Button>
        </div>

        {/* Status info */}
        <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>You can check our service status at:</p>
          <a
            href="https://status.ncq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ncq-primary-600 hover:text-ncq-primary-500 dark:text-ncq-primary-400 dark:hover:text-ncq-primary-300"
          >
            status.ncq.com
          </a>
        </div>

        {/* Support link */}
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          If the problem persists,{' '}
          <a
            href="/support"
            className="font-medium text-ncq-primary-600 hover:text-ncq-primary-500 dark:text-ncq-primary-400 dark:hover:text-ncq-primary-300"
          >
            contact our support team
          </a>
        </p>
      </div>
    </div>
  )
}