import React, { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoadingFallback } from './LoadingFallback'
import { routePaths } from '../router/AppRouter'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  requiredPermissions?: string[]
  requireMFA?: boolean
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requireMFA = false,
  redirectTo = routePaths.auth.login,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, hasRole, hasPermission, isMFAVerified } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Check authentication status
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save the attempted location for redirect after login
      sessionStorage.setItem('redirectAfterLogin', location.pathname + location.search)
    }
  }, [isLoading, isAuthenticated, location])

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingFallback />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Check MFA requirement
  if (requireMFA && !isMFAVerified()) {
    return <Navigate to={routePaths.auth.twoFactor} state={{ from: location }} replace />
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role))
    if (!hasRequiredRole) {
      return <Navigate to={routePaths.errors.unauthorized} replace />
    }
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.every(permission => hasPermission(permission))
    if (!hasRequiredPermission) {
      return <Navigate to={routePaths.errors.unauthorized} replace />
    }
  }

  // All checks passed, render children
  return <>{children}</>
}

// HOC version for class components or special cases
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Hook for programmatic route protection
export function useProtectedRoute(options: Omit<ProtectedRouteProps, 'children'> = {}) {
  const { isAuthenticated, hasRole, hasPermission, isMFAVerified } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const checkAccess = React.useCallback(() => {
    const { requiredRoles = [], requiredPermissions = [], requireMFA = false } = options

    if (!isAuthenticated) {
      navigate(routePaths.auth.login, { state: { from: location } })
      return false
    }

    if (requireMFA && !isMFAVerified()) {
      navigate(routePaths.auth.twoFactor, { state: { from: location } })
      return false
    }

    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => hasRole(role))
      if (!hasRequiredRole) {
        navigate(routePaths.errors.unauthorized)
        return false
      }
    }

    if (requiredPermissions.length > 0) {
      const hasRequiredPermission = requiredPermissions.every(permission => hasPermission(permission))
      if (!hasRequiredPermission) {
        navigate(routePaths.errors.unauthorized)
        return false
      }
    }

    return true
  }, [isAuthenticated, hasRole, hasPermission, isMFAVerified, navigate, location, options])

  return { checkAccess }
}

// Route guard component for conditional rendering
interface RouteGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requiredRoles?: string[]
  requiredPermissions?: string[]
  requireMFA?: boolean
}

export function RouteGuard({
  children,
  fallback = null,
  requiredRoles = [],
  requiredPermissions = [],
  requireMFA = false,
}: RouteGuardProps) {
  const { isAuthenticated, hasRole, hasPermission, isMFAVerified } = useAuth()

  const hasAccess = React.useMemo(() => {
    if (!isAuthenticated) return false
    if (requireMFA && !isMFAVerified()) return false
    
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => hasRole(role))
      if (!hasRequiredRole) return false
    }

    if (requiredPermissions.length > 0) {
      const hasRequiredPermission = requiredPermissions.every(permission => hasPermission(permission))
      if (!hasRequiredPermission) return false
    }

    return true
  }, [isAuthenticated, hasRole, hasPermission, isMFAVerified, requiredRoles, requiredPermissions, requireMFA])

  return <>{hasAccess ? children : fallback}</>
}