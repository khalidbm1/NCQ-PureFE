import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom'
import { cn } from '@ncq/design-system/utils'

export function ProgressBar() {
  const navigation = useNavigation()
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (navigation.state === 'loading') {
      setIsVisible(true)
      setProgress(0)

      // Simulate progress
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(timer)
            return 90
          }
          return prev + 10
        })
      }, 200)

      return () => clearInterval(timer)
    } else if (navigation.state === 'idle' && isVisible) {
      // Complete the progress
      setProgress(100)
      
      // Hide after animation completes
      const hideTimer = setTimeout(() => {
        setIsVisible(false)
        setProgress(0)
      }, 300)

      return () => clearTimeout(hideTimer)
    }
  }, [navigation.state, isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-1 bg-gray-200 dark:bg-gray-700">
      <div
        className={cn(
          "h-full bg-gradient-to-r from-ncq-primary-500 to-ncq-primary-600 transition-all duration-300 ease-out",
          progress === 100 && "transition-opacity opacity-0"
        )}
        style={{ width: `${progress}%` }}
      >
        {/* Pulse animation */}
        <div className="h-full w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

// Alternative progress bar for manual control
export function ManualProgressBar({ 
  value, 
  isLoading,
  className 
}: { 
  value?: number
  isLoading: boolean
  className?: string 
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      if (value !== undefined) {
        setProgress(value)
      } else {
        // Auto progress
        const timer = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) return 90
            return prev + 5
          })
        }, 500)

        return () => clearInterval(timer)
      }
    } else {
      setProgress(100)
      const resetTimer = setTimeout(() => setProgress(0), 500)
      return () => clearTimeout(resetTimer)
    }
  }, [isLoading, value])

  if (progress === 0) return null

  return (
    <div className={cn("h-1 bg-gray-200 dark:bg-gray-700", className)}>
      <div
        className="h-full bg-ncq-primary-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}