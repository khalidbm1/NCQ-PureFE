import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '@/shared/contexts/ThemeContext'

// Layout Components
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthLayoutNCQ from '@/components/layout/AuthLayoutNCQ'

// Auth Pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'

// Dashboard Pages
import OverviewNCQ from '@/pages/dashboard/OverviewNCQ'
import Transactions from '@/pages/dashboard/Transactions'
import Analytics from '@/pages/dashboard/Analytics'
import Settlements from '@/pages/dashboard/Settlements'
import Subscriptions from '@/pages/dashboard/Subscriptions'
import PaymentMethods from '@/pages/dashboard/PaymentMethods'
import Security from '@/pages/dashboard/Security'
import Settings from '@/pages/dashboard/Settings'
import ApiKeys from '@/pages/dashboard/ApiKeys'
import Webhooks from '@/pages/dashboard/Webhooks'

// Merchant Management (Admin only)
import Merchants from '@/pages/admin/Merchants'
import SystemAnalytics from '@/pages/admin/SystemAnalytics'

// Error Pages
import NotFound from '@/pages/error/NotFound'
import Unauthorized from '@/pages/error/Unauthorized'

// Landing Page
import Landing from '@/pages/Landing'

// Types
import type { RootState } from '@/shared/store'

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

// Public Route (redirect if authenticated)
interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

const App: React.FC = () => {
  useEffect(() => {
    // Initialize app and check authentication on mount
    // This will be handled by the auth slice
  }, [])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Routes>
        {/* Public Routes */}
        <Route
          path="/auth/*"
          element={
            <PublicRoute>
              <AuthLayoutNCQ>
                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="*" element={<Navigate to="/auth/login" replace />} />
                </Routes>
              </AuthLayoutNCQ>
            </PublicRoute>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route index element={<OverviewNCQ />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settlements" element={<Settlements />} />
                  <Route path="subscriptions" element={<Subscriptions />} />
                  <Route path="payment-methods" element={<PaymentMethods />} />
                  <Route path="security" element={<Security />} />
                  <Route path="api-keys" element={<ApiKeys />} />
                  <Route path="webhooks" element={<Webhooks />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin>
              <DashboardLayout>
                <Routes>
                  <Route path="merchants" element={<Merchants />} />
                  <Route path="system-analytics" element={<SystemAnalytics />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Error Pages */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/404" element={<NotFound />} />

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Other Pages */}
        <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App