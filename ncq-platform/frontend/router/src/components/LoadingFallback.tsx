import React from 'react'
import { cn } from '@ncq/design-system/utils'

interface LoadingFallbackProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export function LoadingFallback({ 
  className, 
  size = 'md', 
  text,
  fullScreen = false 
}: LoadingFallbackProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  }

  const content = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-gray-300 border-t-ncq-primary-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        {content}
      </div>
    )
  }

  return content
}

// Page loading skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Card loading skeleton
export function CardLoadingSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>
    </div>
  )
}

// Table loading skeleton
export function TableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      {/* Table header */}
      <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b dark:border-gray-700">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 py-4 border-b dark:border-gray-700">
          {[1, 2, 3, 4].map(j => (
            <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Form loading skeleton
export function FormLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Form fields */}
      {[1, 2, 3].map(i => (
        <div key={i}>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}

      {/* Form actions */}
      <div className="flex gap-3 pt-4">
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  )
}