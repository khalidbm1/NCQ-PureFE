import React, { Suspense, lazy } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
  useRouteError,
  useNavigation,
  useLocation,
  defer,
  Await,
} from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { LanguageProvider } from '../contexts/LanguageContext'
import { MicroFrontendProvider } from '../contexts/MicroFrontendContext'
import { LoadingFallback } from '../components/LoadingFallback'
import { ErrorFallback } from '../components/ErrorFallback'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { RootLayout } from '../layouts/RootLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { AuthLayout } from '../layouts/AuthLayout'

// Lazy load route modules with retry logic
const lazyWithRetry = (
  componentImport: () => Promise<any>,
  retries = 3,
  interval = 1000
) => {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const tryImport = (retriesLeft: number) => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft === 0) {
              reject(error)
              return
            }
            setTimeout(() => {
              tryImport(retriesLeft - 1)
            }, interval)
          })
      }
      tryImport(retries)
    })
  })
}

// Lazy load pages
const HomePage = lazyWithRetry(() => import('../pages/Home'))
const LoginPage = lazyWithRetry(() => import('../pages/auth/Login'))
const RegisterPage = lazyWithRetry(() => import('../pages/auth/Register'))
const ForgotPasswordPage = lazyWithRetry(() => import('../pages/auth/ForgotPassword'))
const ResetPasswordPage = lazyWithRetry(() => import('../pages/auth/ResetPassword'))
const TwoFactorPage = lazyWithRetry(() => import('../pages/auth/TwoFactor'))

// Dashboard pages
const Dashboard = lazyWithRetry(() => import('../pages/dashboard/Dashboard'))
const Analytics = lazyWithRetry(() => import('../pages/dashboard/Analytics'))
const Reports = lazyWithRetry(() => import('../pages/dashboard/Reports'))
const Profile = lazyWithRetry(() => import('../pages/dashboard/Profile'))
const Settings = lazyWithRetry(() => import('../pages/dashboard/Settings'))

// Feature modules (lazy loaded)
const PaymentModule = lazyWithRetry(() => import('../features/payment'))
const IoTModule = lazyWithRetry(() => import('../features/iot'))
const HospitalModule = lazyWithRetry(() => import('../features/hospital'))
const BlockchainModule = lazyWithRetry(() => import('../features/blockchain'))
const HospitalityModule = lazyWithRetry(() => import('../features/hospitality'))
const AIModule = lazyWithRetry(() => import('../features/ai'))

// Admin pages
const AdminDashboard = lazyWithRetry(() => import('../pages/admin/AdminDashboard'))
const UserManagement = lazyWithRetry(() => import('../pages/admin/UserManagement'))
const SystemConfiguration = lazyWithRetry(() => import('../pages/admin/SystemConfiguration'))
const AuditLogs = lazyWithRetry(() => import('../pages/admin/AuditLogs'))
const ServiceMonitoring = lazyWithRetry(() => import('../pages/admin/ServiceMonitoring'))

// Error pages
const NotFound = lazyWithRetry(() => import('../pages/errors/NotFound'))
const Unauthorized = lazyWithRetry(() => import('../pages/errors/Unauthorized'))
const ServerError = lazyWithRetry(() => import('../pages/errors/ServerError'))

// Micro-frontend loaders
const loadMicroFrontend = (name: string, module: string) => {
  return lazyWithRetry(async () => {
    const container = await import(/* webpackIgnore: true */ `${process.env.REACT_APP_MFE_HOST}/${name}/remoteEntry.js`)
    const factory = await container.get(module)
    return factory()
  })
}

// Route error component
function RouteError() {
  const error = useRouteError() as any
  
  if (error?.status === 404) {
    return <NotFound />
  }
  
  if (error?.status === 403) {
    return <Unauthorized />
  }
  
  return <ServerError error={error} />
}

// Loading indicator component
function GlobalLoading() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'
  
  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-blue-600 animate-pulse" />
        </div>
      )}
    </>
  )
}

// Route configuration with lazy loading
const createAppRouter = (queryClient: QueryClient) => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
            <MicroFrontendProvider>
              <AuthProvider>
                <ThemeProvider>
                  <LanguageProvider>
                    <QueryClientProvider client={queryClient}>
                      <GlobalLoading />
                      <Outlet />
                      <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                  </LanguageProvider>
                </ThemeProvider>
              </AuthProvider>
            </MicroFrontendProvider>
          </ErrorBoundary>
        }
        errorElement={<RouteError />}
      >
        {/* Public routes */}
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          
          {/* Auth routes */}
          <Route path="auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="two-factor" element={<TwoFactorPage />} />
          </Route>
        </Route>

        {/* Protected dashboard routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings/*" element={<Settings />} />
          
          {/* Feature modules with lazy loading */}
          <Route
            path="payment/*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PaymentModule />
              </Suspense>
            }
          />
          
          <Route
            path="iot/*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <IoTModule />
              </Suspense>
            }
          />
          
          <Route
            path="hospital/*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <HospitalModule />
              </Suspense>
            }
          />
          
          <Route
            path="blockchain/*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <BlockchainModule />
              </Suspense>
            }
          />
          
          <Route
            path="hospitality/*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <HospitalityModule />
              </Suspense>
            }
          />
          
          <Route
            path="ai/*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <AIModule />
              </Suspense>
            }
          />
        </Route>

        {/* Admin routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requiredRoles={['admin', 'super-admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="configuration" element={<SystemConfiguration />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="monitoring" element={<ServiceMonitoring />} />
        </Route>

        {/* Micro-frontend routes */}
        {process.env.REACT_APP_ENABLE_MFE === 'true' && (
          <>
            <Route
              path="mfe/auth/*"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  {React.createElement(loadMicroFrontend('auth', './AuthApp'))}
                </Suspense>
              }
            />
            
            <Route
              path="mfe/payment/*"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  {React.createElement(loadMicroFrontend('payment', './PaymentApp'))}
                </Suspense>
              }
            />
            
            <Route
              path="mfe/analytics/*"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  {React.createElement(loadMicroFrontend('analytics', './AnalyticsApp'))}
                </Suspense>
              }
            />
          </>
        )}

        {/* Error routes */}
        <Route path="403" element={<Unauthorized />} />
        <Route path="500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    ),
    {
      future: {
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
      },
    }
  )
}

// Main router component
export function AppRouter() {
  // Initialize query client with optimized defaults
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 3,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
          },
          mutations: {
            retry: 2,
          },
        },
      }),
    []
  )

  const router = React.useMemo(() => createAppRouter(queryClient), [queryClient])

  return <RouterProvider router={router} />
}

// Exports for route configuration
export const routePaths = {
  home: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: (token: string) => `/auth/reset-password/${token}`,
    twoFactor: '/auth/two-factor',
  },
  dashboard: {
    root: '/dashboard',
    analytics: '/dashboard/analytics',
    reports: '/dashboard/reports',
    profile: '/dashboard/profile',
    settings: '/dashboard/settings',
  },
  features: {
    payment: '/dashboard/payment',
    iot: '/dashboard/iot',
    hospital: '/dashboard/hospital',
    blockchain: '/dashboard/blockchain',
    hospitality: '/dashboard/hospitality',
    ai: '/dashboard/ai',
  },
  admin: {
    root: '/admin',
    users: '/admin/users',
    configuration: '/admin/configuration',
    auditLogs: '/admin/audit-logs',
    monitoring: '/admin/monitoring',
  },
  errors: {
    notFound: '/404',
    unauthorized: '/403',
    serverError: '/500',
  },
}

// Route utilities
export const isPublicRoute = (pathname: string) => {
  const publicRoutes = [
    routePaths.home,
    routePaths.auth.login,
    routePaths.auth.register,
    routePaths.auth.forgotPassword,
    ...Object.values(routePaths.errors),
  ]
  
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route))
}

export const requiresAuth = (pathname: string) => {
  return pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
}

export const requiresAdmin = (pathname: string) => {
  return pathname.startsWith('/admin')
}