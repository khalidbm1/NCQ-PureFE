import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TokenService from '../services/TokenService';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface UseTokenRefreshOptions {
  onTokenRefreshed?: (token: string) => void;
  onRefreshFailed?: (error: Error) => void;
  refreshBuffer?: number; // Minutes before expiry to refresh
  enableAutoRefresh?: boolean;
}

export const useTokenRefresh = ({
  onTokenRefreshed,
  onRefreshFailed,
  refreshBuffer = 5,
  enableAutoRefresh = true,
}: UseTokenRefreshOptions = {}) => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const lastRefreshTimeRef = useRef<number>(0);

  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    if (!enableAutoRefresh) return;

    const token = TokenService.getAccessToken();
    if (!token) return;

    const expiryTime = TokenService.getTokenExpiryTime(token);
    if (expiryTime <= 0) return;

    // Calculate when to refresh (refreshBuffer minutes before expiry)
    const refreshTime = expiryTime - refreshBuffer * 60 * 1000;
    
    if (refreshTime > 0) {
      console.log(`Scheduling token refresh in ${Math.round(refreshTime / 1000)}s`);
      
      refreshTimeoutRef.current = setTimeout(async () => {
        try {
          await performTokenRefresh();
        } catch (error) {
          console.error('Auto-refresh failed:', error);
        }
      }, refreshTime);
    } else {
      // Token expires soon, refresh immediately
      performTokenRefresh();
    }
  }, [enableAutoRefresh, refreshBuffer]);

  const performTokenRefresh = useCallback(async () => {
    // Prevent concurrent refreshes
    if (isRefreshingRef.current) {
      console.log('Token refresh already in progress');
      return;
    }

    // Prevent too frequent refreshes
    const now = Date.now();
    if (now - lastRefreshTimeRef.current < 10000) { // 10 seconds
      console.log('Token was recently refreshed, skipping');
      return;
    }

    isRefreshingRef.current = true;
    lastRefreshTimeRef.current = now;

    try {
      console.log('Refreshing access token...');
      const newToken = await TokenService.refreshAccessToken();
      
      // Invalidate auth-dependent queries
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          // Invalidate queries that depend on authentication
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && (
            queryKey[0] === 'user' ||
            queryKey[0] === 'sessions' ||
            queryKey[0] === 'permissions'
          );
        }
      });

      console.log('Token refreshed successfully');
      onTokenRefreshed?.(newToken);
      
      // Schedule next refresh
      scheduleTokenRefresh();
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      if (error instanceof Error) {
        onRefreshFailed?.(error);
        
        // Only show toast and logout for non-recoverable errors
        if (error.message.includes('No refresh token') || 
            error.message.includes('Token refresh failed')) {
          toast.error('Session expired. Please login again.');
          await logout();
        }
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [queryClient, onTokenRefreshed, onRefreshFailed, scheduleTokenRefresh, logout]);

  const refreshToken = useCallback(async () => {
    return performTokenRefresh();
  }, [performTokenRefresh]);

  useEffect(() => {
    // Setup token refresh callback
    const unsubscribe = TokenService.onTokenRefresh((token) => {
      console.log('Token updated, rescheduling refresh');
      scheduleTokenRefresh();
    });

    // Initial schedule
    scheduleTokenRefresh();

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Check token validity when tab becomes visible
        const token = TokenService.getAccessToken();
        if (token && !TokenService.isTokenValid(token)) {
          performTokenRefresh();
        } else {
          // Reschedule refresh in case the tab was hidden for a long time
          scheduleTokenRefresh();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle online/offline
    const handleOnline = () => {
      const token = TokenService.getAccessToken();
      if (token && !TokenService.isTokenValid(token)) {
        performTokenRefresh();
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [scheduleTokenRefresh, performTokenRefresh]);

  return {
    refreshToken,
    isRefreshing: isRefreshingRef.current,
  };
};

/**
 * Hook to monitor token expiry and show warnings
 */
export const useTokenExpiryWarning = ({
  warningThreshold = 5, // Minutes before expiry to show warning
  onExpiryWarning,
}: {
  warningThreshold?: number;
  onExpiryWarning?: (minutesRemaining: number) => void;
} = {}) => {
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownWarningRef = useRef(false);

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = TokenService.getAccessToken();
      if (!token) return;

      const expiryTime = TokenService.getTokenExpiryTime(token);
      const minutesRemaining = Math.floor(expiryTime / 60000);

      if (minutesRemaining > 0 && minutesRemaining <= warningThreshold) {
        if (!hasShownWarningRef.current) {
          hasShownWarningRef.current = true;
          
          toast.error(
            `Your session will expire in ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}`,
            {
              duration: 10000,
              id: 'token-expiry-warning',
            }
          );
          
          onExpiryWarning?.(minutesRemaining);
        }
      } else if (minutesRemaining > warningThreshold) {
        hasShownWarningRef.current = false;
      }
    };

    // Check every 30 seconds
    checkIntervalRef.current = setInterval(checkTokenExpiry, 30000);
    checkTokenExpiry(); // Initial check

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [warningThreshold, onExpiryWarning]);
};