// Main exports
export { AppRouter, routePaths, isPublicRoute, requiresAuth, requiresAdmin } from './router/AppRouter'

// Layout exports
export { RootLayout, RootLayoutWrapper } from './layouts/RootLayout'
export { DashboardLayout } from './layouts/DashboardLayout'
export { AdminLayout } from './layouts/AdminLayout'
export { AuthLayout } from './layouts/AuthLayout'

// Context exports
export { AuthProvider, useAuth } from './contexts/AuthContext'
export { ThemeProvider, useTheme } from './contexts/ThemeContext'
export { LanguageProvider, useLanguage, useTranslation } from './contexts/LanguageContext'
export { MicroFrontendProvider, useMicroFrontend, withMicroFrontend } from './contexts/MicroFrontendContext'

// Component exports
export { ProtectedRoute, withProtectedRoute, useProtectedRoute, RouteGuard } from './components/ProtectedRoute'
export { LoadingFallback, PageLoadingSkeleton, CardLoadingSkeleton, TableLoadingSkeleton, FormLoadingSkeleton } from './components/LoadingFallback'
export { ErrorFallback, AsyncErrorBoundary } from './components/ErrorFallback'
export { ProgressBar, ManualProgressBar } from './components/ProgressBar'
export { NetworkStatus, useOnlineStatus } from './components/NetworkStatus'
export { UpdatePrompt, useUpdateCheck } from './components/UpdatePrompt'

// Type exports
export type { User, AuthState } from './contexts/AuthContext'
export type { Theme, ResolvedTheme } from './contexts/ThemeContext'
export type { Language, Direction } from './contexts/LanguageContext'
export type { MicroFrontendApp } from './contexts/MicroFrontendContext'