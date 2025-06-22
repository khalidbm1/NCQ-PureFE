import React from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Toaster } from 'react-hot-toast'
import { ProgressBar } from '../components/ProgressBar'
import { NetworkStatus } from '../components/NetworkStatus'
import { UpdatePrompt } from '../components/UpdatePrompt'

export function RootLayout() {
  const { theme } = useTheme()
  const { direction } = useLanguage()

  React.useEffect(() => {
    // Apply theme class to document
    document.documentElement.className = theme
    document.documentElement.dir = direction
  }, [theme, direction])

  return (
    <div className="min-h-screen bg-background">
      {/* Global progress bar */}
      <ProgressBar />
      
      {/* Network status indicator */}
      <NetworkStatus />
      
      {/* App update prompt */}
      <UpdatePrompt />
      
      {/* Route content */}
      <Outlet />
      
      {/* Scroll restoration */}
      <ScrollRestoration />
      
      {/* Global toast notifications */}
      <Toaster
        position={direction === 'rtl' ? 'top-left' : 'top-right'}
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : 'white',
            color: theme === 'dark' ? 'white' : '#1f2937',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  )
}

// Layout wrapper for better error boundaries
export function RootLayoutWrapper() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <RootLayout />
    </React.Suspense>
  )
}