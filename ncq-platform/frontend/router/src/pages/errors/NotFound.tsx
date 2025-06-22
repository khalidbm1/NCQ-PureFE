import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@ncq/design-system/components/Button'
import { routePaths } from '../../router/AppRouter'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
          <div className="relative -mt-16">
            <div className="mx-auto w-32 h-32 bg-ncq-primary-100 dark:bg-ncq-primary-900/20 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-ncq-primary-600 dark:text-ncq-primary-400" />
            </div>
          </div>
        </div>

        {/* Error message */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Page not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been removed, 
          renamed, or doesn't exist.
        </p>

        {/* Quick links */}
        <div className="mb-8 text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Here are some helpful links instead:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <a 
              href={routePaths.dashboard.root}
              className="text-ncq-primary-600 hover:text-ncq-primary-500 dark:text-ncq-primary-400 dark:hover:text-ncq-primary-300"
            >
              Dashboard
            </a>
            <span>•</span>
            <a 
              href="/support"
              className="text-ncq-primary-600 hover:text-ncq-primary-500 dark:text-ncq-primary-400 dark:hover:text-ncq-primary-300"
            >
              Support
            </a>
            <span>•</span>
            <a 
              href="/docs"
              className="text-ncq-primary-600 hover:text-ncq-primary-500 dark:text-ncq-primary-400 dark:hover:text-ncq-primary-300"
            >
              Documentation
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
          
          <Button
            onClick={() => navigate(routePaths.home)}
            variant="default"
            className="inline-flex items-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  )
}