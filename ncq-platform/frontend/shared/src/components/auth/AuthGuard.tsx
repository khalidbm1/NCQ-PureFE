import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../contexts/AuthContext';
import { Spinner } from '@ncq/design-system';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  redirectTo = '/login',
  fallback,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, checkRole, checkPermission } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push({
        pathname: redirectTo,
        query: { returnUrl: router.asPath },
      });
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Check authorization
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check roles
      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => checkRole(role));
        if (!hasRequiredRole) {
          router.push('/unauthorized');
          return;
        }
      }

      // Check permissions
      if (requiredPermissions.length > 0) {
        const hasRequiredPermission = requiredPermissions.some(perm => checkPermission(perm));
        if (!hasRequiredPermission) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [isAuthenticated, user, requiredRoles, requiredPermissions, checkRole, checkPermission, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  // Check authorization
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => checkRole(role));
    if (!hasRequiredRole) {
      return fallback ? <>{fallback}</> : null;
    }
  }

  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some(perm => checkPermission(perm));
    if (!hasRequiredPermission) {
      return fallback ? <>{fallback}</> : null;
    }
  }

  return <>{children}</>;
};