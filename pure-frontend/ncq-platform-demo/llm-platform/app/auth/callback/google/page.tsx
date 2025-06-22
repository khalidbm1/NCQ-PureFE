'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import { Loader2 } from 'lucide-react'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { handleSSOCallback, isLoading, error } = useAuthStore()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')

      if (error) {
        setStatus('error')
        console.error('Google OAuth error:', error)
        return
      }

      if (!code || !state) {
        setStatus('error')
        console.error('Missing code or state parameter')
        return
      }

      try {
        await handleSSOCallback(code, state)
        setStatus('success')
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } catch (err) {
        setStatus('error')
        console.error('SSO callback error:', err)
        
        // Redirect to login page after error
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    }

    handleCallback()
  }, [searchParams, handleSSOCallback, router])

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return 'Processing Google authentication...'
      case 'success':
        return 'Authentication successful! Redirecting to dashboard...'
      case 'error':
        return error || 'Authentication failed. Redirecting to login...'
      default:
        return 'Processing...'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600 dark:text-blue-400'
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            {status === 'processing' || isLoading ? (
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
            ) : status === 'success' ? (
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Google Authentication
          </h1>
          
          <p className={`text-sm ${getStatusColor()}`}>
            {getStatusMessage()}
          </p>
        </div>

        {status === 'error' && (
          <div className="space-y-4">
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}