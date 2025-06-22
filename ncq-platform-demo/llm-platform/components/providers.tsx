'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { useState, useEffect } from 'react'
import { Toaster as HotToaster } from 'react-hot-toast'
import { useAuthStore } from '@/lib/store/auth'
import { TenantProvider } from '@/lib/context/tenant-context'
import { ToastProvider } from '@/components/ui/use-toast'

// Platform Auth Context Provider
function PlatformAuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isLoading, isAuthenticated, user } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      // Only check auth if we have platform tokens
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('ncq_platform_access_token')
        if (token) {
          await checkAuth()
        }
      }
      setIsInitialized(true)
    }

    initializeAuth()
  }, [checkAuth])

  // Show loading screen while initializing auth
  if (!isInitialized || (isLoading && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Initializing NCQ LLM...</p>
        </div>
      </div>
    )
  }

  return (
    <TenantProvider user={user}>
      {children}
    </TenantProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              // Don't retry on auth errors
              if (error?.response?.status === 401) {
                return false
              }
              return failureCount < 3
            },
          },
          mutations: {
            retry: (failureCount, error: any) => {
              // Don't retry on auth errors
              if (error?.response?.status === 401) {
                return false
              }
              return failureCount < 2
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider>
          <PlatformAuthProvider>
            {children}
            <HotToaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
                loading: {
                  duration: Infinity,
                },
              }}
            />
          </PlatformAuthProvider>
        </ToastProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  )
} 