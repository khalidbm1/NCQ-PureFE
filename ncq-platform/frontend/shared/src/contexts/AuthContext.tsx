import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '../types/auth.types';
import { useAuth } from '../hooks/useAuth';
import { useTokenRefresh, useTokenExpiryWarning } from '../hooks/useTokenRefresh';
import TokenService from '../services/TokenService';
import toast from 'react-hot-toast';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
  checkRole: (role: string) => boolean;
  isTokenExpiring: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  redirectTo = '/login',
  requireAuth = false,
  requiredRoles = [],
  requiredPermissions = [],
}) => {
  const router = useRouter();
  const auth = useAuth();
  const [isTokenExpiring, setIsTokenExpiring] = useState(false);

  // Setup automatic token refresh
  const { refreshToken } = useTokenRefresh({
    onTokenRefreshed: () => {
      console.log('Token refreshed successfully');
      setIsTokenExpiring(false);
    },
    onRefreshFailed: (error) => {
      console.error('Token refresh failed:', error);
      // Auth hook will handle logout
    },
    refreshBuffer: 5, // Refresh 5 minutes before expiry
    enableAutoRefresh: true,
  });

  // Setup token expiry warning
  useTokenExpiryWarning({
    warningThreshold: 5,
    onExpiryWarning: (minutesRemaining) => {
      setIsTokenExpiring(true);
      
      // Show action toast
      toast(
        (t) => (
          <div className="flex items-center justify-between">
            <span>
              Your session expires in {minutesRemaining} minute{minutesRemaining > 1 ? 's' : ''}
            </span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                refreshToken();
              }}
              className="ml-4 px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Extend
            </button>
          </div>
        ),
        {
          duration: 30000,
          id: 'session-expiry-action',
        }
      );
    },
  });

  // Enhanced login with remember me
  const enhancedLogin = async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await auth.login({
        email,
        password,
        rememberMe,
        deviceFingerprint: await getDeviceFingerprint(),
      });

      if (response.requiresMfa) {
        // Redirect to MFA challenge
        router.push({
          pathname: '/auth/mfa',
          query: { challengeId: response.mfaChallenge?.challengeId },
        });
      } else {
        // Store token with remember me preference
        TokenService.setAccessToken(response.accessToken, rememberMe);
        TokenService.setRefreshToken(response.refreshToken);

        // Redirect to intended page or dashboard
        const returnUrl = router.query.returnUrl as string || '/dashboard';
        router.push(returnUrl);
      }
    } catch (error) {
      throw error;
    }
  };

  // Permission checking
  const checkPermission = (permission: string): boolean => {
    if (!auth.user) return false;
    return auth.user.permissions.includes(permission) || auth.user.roles.includes('SUPER_ADMIN');
  };

  // Role checking
  const checkRole = (role: string): boolean => {
    if (!auth.user) return false;
    return auth.user.roles.includes(role) || auth.user.roles.includes('SUPER_ADMIN');
  };

  // Check authentication requirements
  useEffect(() => {
    if (!auth.isLoading) {
      if (requireAuth && !auth.isAuthenticated) {
        router.push({
          pathname: redirectTo,
          query: { returnUrl: router.asPath },
        });
      } else if (auth.isAuthenticated) {
        // Check role requirements
        if (requiredRoles.length > 0) {
          const hasRequiredRole = requiredRoles.some(role => checkRole(role));
          if (!hasRequiredRole) {
            router.push('/unauthorized');
          }
        }

        // Check permission requirements
        if (requiredPermissions.length > 0) {
          const hasRequiredPermission = requiredPermissions.some(perm => checkPermission(perm));
          if (!hasRequiredPermission) {
            router.push('/unauthorized');
          }
        }
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, requireAuth, redirectTo, router, requiredRoles, requiredPermissions]);

  const value: AuthContextValue = {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    login: enhancedLogin,
    logout: auth.logout,
    refreshToken,
    checkPermission,
    checkRole,
    isTokenExpiring,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    redirectTo?: string;
    requiredRoles?: string[];
    requiredPermissions?: string[];
  } = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthProvider
        requireAuth
        redirectTo={options.redirectTo}
        requiredRoles={options.requiredRoles}
        requiredPermissions={options.requiredPermissions}
      >
        <Component {...props} />
      </AuthProvider>
    );
  };
}

// Permission-based component visibility
interface CanProps {
  permission?: string;
  role?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ permission, role, fallback = null, children }) => {
  const { checkPermission, checkRole } = useAuthContext();

  const hasAccess = 
    (permission && checkPermission(permission)) ||
    (role && checkRole(role)) ||
    (!permission && !role);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Async function to get device fingerprint (importing here to avoid circular dependency)
async function getDeviceFingerprint(): Promise<string> {
  const { getDeviceFingerprint } = await import('../services/deviceFingerprint');
  return getDeviceFingerprint();
}