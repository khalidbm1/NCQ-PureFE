import React, { useEffect, useState } from 'react'
import { RefreshCw, X } from 'lucide-react'
import { Button } from '@ncq/design-system/components/Button'
import { cn } from '@ncq/design-system/utils'

export function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check for service worker updates
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        setRegistration(reg)

        // Check for updates periodically
        const checkForUpdates = () => {
          reg.update().catch(error => {
            console.error('Failed to check for updates:', error)
          })
        }

        // Check immediately
        checkForUpdates()

        // Check every 30 minutes
        const interval = setInterval(checkForUpdates, 30 * 60 * 1000)

        // Listen for update found
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
                setShowPrompt(true)
              }
            })
          }
        })

        return () => clearInterval(interval)
      })
    }

    // Listen for custom update event (for non-SW updates)
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true)
      setShowPrompt(true)
    }

    window.addEventListener('app-update-available', handleUpdateAvailable)

    return () => {
      window.removeEventListener('app-update-available', handleUpdateAvailable)
    }
  }, [])

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Tell SW to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })

      // Listen for controller change and reload
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    } else {
      // For non-SW updates, just reload
      window.location.reload()
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for 24 hours
    const dismissTime = Date.now()
    localStorage.setItem('update-prompt-dismissed', dismissTime.toString())
  }

  // Check if we should show the prompt
  useEffect(() => {
    if (updateAvailable) {
      const dismissedTime = localStorage.getItem('update-prompt-dismissed')
      if (dismissedTime) {
        const timeSinceDismissed = Date.now() - parseInt(dismissedTime)
        const twentyFourHours = 24 * 60 * 60 * 1000
        if (timeSinceDismissed < twentyFourHours) {
          setShowPrompt(false)
        }
      }
    }
  }, [updateAvailable])

  if (!showPrompt || !updateAvailable) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <RefreshCw className="h-5 w-5 text-ncq-primary-600 dark:text-ncq-primary-400" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Update available
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              A new version of NCQ Platform is available. Refresh to get the latest features and improvements.
            </p>
            
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh now
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
                className="text-xs"
              >
                Later
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Manual update check hook
export function useUpdateCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [checking, setChecking] = useState(false)

  const checkForUpdate = async () => {
    setChecking(true)
    
    try {
      // Check service worker
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready
        await reg.update()
      }

      // Check app version (example)
      const response = await fetch('/api/version')
      if (response.ok) {
        const { version } = await response.json()
        const currentVersion = process.env.REACT_APP_VERSION
        
        if (version !== currentVersion) {
          setUpdateAvailable(true)
          window.dispatchEvent(new Event('app-update-available'))
        }
      }
    } catch (error) {
      console.error('Failed to check for updates:', error)
    } finally {
      setChecking(false)
    }
  }

  return { updateAvailable, checking, checkForUpdate }
}