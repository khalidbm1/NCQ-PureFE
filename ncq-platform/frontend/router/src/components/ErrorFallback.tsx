import React from 'react'
import { AlertCircle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@ncq/design-system/components/Button'
import { Alert, AlertDescription, AlertTitle } from '@ncq/design-system/components/Alert'
import { cn } from '@ncq/design-system/utils'
import { routePaths } from '../router/AppRouter'

interface ErrorFallbackProps {
  error: Error | null
  resetErrorBoundary?: () => void
  className?: string
  minimal?: boolean
}

export function ErrorFallback({ 
  error, 
  resetErrorBoundary,
  className,
  minimal = false
}: ErrorFallbackProps) {
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = React.useState(false)

  const isDevelopment = process.env.NODE_ENV === 'development'

  const handleGoHome = () => {
    navigate(routePaths.home)
    resetErrorBoundary?.()
  }

  if (minimal) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="flex items-center gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={resetErrorBoundary}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={cn(
      "flex min-h-[400px] flex-col items-center justify-center p-8",
      className
    )}>
      <div className="max-w-md w-full text-center">
        {/* Error icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>

        {/* Error message */}
        <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">
          Oops! Something went wrong
        </h2>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
        </p>

        {/* Error details (development only) */}
        {isDevelopment && error && (
          <div className="mt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show details
                </>
              )}
            </button>

            {showDetails && (
              <div className="mt-4 text-left">
                <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-auto">
                  <p className="text-sm font-mono text-red-600 dark:text-red-400">
                    {error.name}: {error.message}
                  </p>
                  {error.stack && (
                    <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={resetErrorBoundary}
            variant="default"
            className="inline-flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="inline-flex items-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to homepage
          </Button>
        </div>

        {/* Support link */}
        <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          Need help?{' '}
          <a
            href="/support"
            className="font-medium text-ncq-primary-600 hover:text-ncq-primary-500 dark:text-ncq-primary-400 dark:hover:text-ncq-primary-300"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  )
}

// Async error boundary wrapper
export function AsyncErrorBoundary({ 
  children,
  fallback
}: { 
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
}) {
  const FallbackComponent = fallback || ErrorFallback

  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        {children}
      </ErrorBoundary>
    </React.Suspense>
  )
}

// Error boundary class component
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode
    FallbackComponent: React.ComponentType<ErrorFallbackProps>
    onReset?: () => void
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      const { FallbackComponent } = this.props
      return (
        <FallbackComponent
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      )
    }

    return this.props.children
  }
}

// Import LoadingFallback for Suspense
import { LoadingFallback } from './LoadingFallback'