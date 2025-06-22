import { useState, useEffect, useCallback, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  User, 
  LoginCredentials, 
  AuthResponse, 
  MFAVerification,
  SessionInfo,
  BiometricCredential 
} from '../types/auth.types';
import { getDeviceFingerprint, validateDeviceFingerprint } from '../services/deviceFingerprint';
import toast from 'react-hot-toast';

const AUTH_TOKEN_KEY = 'ncq_auth_token';
const REFRESH_TOKEN_KEY = 'ncq_refresh_token';
const USER_KEY = 'ncq_user';
const BIOMETRIC_ENABLED_KEY = 'ncq_biometric_enabled';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  loginWithBiometric: (deviceFingerprint: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  verifyMfa: (verification: MFAVerification) => Promise<AuthResponse>;
  resendMfa: (challengeId: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  sessions: SessionInfo[];
  terminateSession: (sessionId: string) => Promise<void>;
  biometricCredentials: BiometricCredential[];
  enableBiometric: () => Promise<void>;
  disableBiometric: (credentialId: string) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);
        
        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          
          // Validate token hasn't expired
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          if (tokenPayload.exp * 1000 > Date.now()) {
            setUser(parsedUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Setup auto-refresh
            setupTokenRefresh(tokenPayload.exp * 1000);
          } else {
            // Token expired, try to refresh
            await refreshTokenHandler();
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Setup axios interceptors
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
          originalRequest._retry = true;
          
          try {
            await refreshTokenHandler();
            return axios(originalRequest);
          } catch (refreshError) {
            clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const setupTokenRefresh = (expiresAt: number) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Refresh 5 minutes before expiry
    const refreshTime = expiresAt - Date.now() - 5 * 60 * 1000;
    
    if (refreshTime > 0) {
      refreshTimeoutRef.current = setTimeout(() => {
        refreshTokenHandler();
      }, refreshTime);
    }
  };

  const refreshTokenHandler = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token');

      const response = await axios.post<{ data: AuthResponse }>('/api/v1/auth/refresh', {
        refreshToken,
        deviceFingerprint: await getDeviceFingerprint(),
      });

      const { user, accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.data;
      
      localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      setupTokenRefresh(Date.now() + expiresIn * 1000);
    } catch (error) {
      clearAuth();
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
  };

  // Login mutation
  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await axios.post<{ data: AuthResponse }>(
        '/api/v1/auth/login',
        credentials
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      if (!data.requiresMfa) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        setupTokenRefresh(Date.now() + data.expiresIn * 1000);
      }
    },
  });

  // Biometric login mutation
  const biometricLoginMutation = useMutation<AuthResponse, Error, string>({
    mutationFn: async (deviceFingerprint) => {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new TextEncoder().encode(deviceFingerprint),
          timeout: 60000,
          userVerification: 'required',
          rpId: window.location.hostname,
        } as any,
      });

      if (!credential) throw new Error('Biometric authentication cancelled');

      const response = await axios.post<{ data: AuthResponse }>(
        '/api/v1/auth/biometric',
        {
          credentialId: credential.id,
          authenticatorData: credential.response,
          deviceFingerprint,
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      if (!data.requiresMfa) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        setupTokenRefresh(Date.now() + data.expiresIn * 1000);
      }
    },
  });

  // MFA verification mutation
  const mfaVerificationMutation = useMutation<AuthResponse, Error, MFAVerification>({
    mutationFn: async (verification) => {
      const response = await axios.post<{ data: AuthResponse }>(
        '/api/v1/auth/mfa/verify',
        verification
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      setupTokenRefresh(Date.now() + data.expiresIn * 1000);
    },
  });

  // Sessions query
  const { data: sessions = [] } = useQuery<SessionInfo[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      const response = await axios.get<{ data: SessionInfo[] }>('/api/v1/auth/sessions');
      return response.data.data;
    },
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Biometric credentials query
  const { data: biometricCredentials = [] } = useQuery<BiometricCredential[]>({
    queryKey: ['biometric-credentials'],
    queryFn: async () => {
      const response = await axios.get<{ data: BiometricCredential[] }>('/api/v1/auth/biometric');
      return response.data.data;
    },
    enabled: !!user,
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return loginMutation.mutateAsync(credentials);
  }, [loginMutation]);

  const loginWithBiometric = useCallback(async (deviceFingerprint: string): Promise<AuthResponse> => {
    return biometricLoginMutation.mutateAsync(deviceFingerprint);
  }, [biometricLoginMutation]);

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/v1/auth/logout');
    } catch (error) {
      // Continue with local logout even if server logout fails
    }
    clearAuth();
    queryClient.clear();
    window.location.href = '/login';
  }, [queryClient]);

  const verifyMfa = useCallback(async (verification: MFAVerification): Promise<AuthResponse> => {
    return mfaVerificationMutation.mutateAsync(verification);
  }, [mfaVerificationMutation]);

  const resendMfa = useCallback(async (challengeId: string) => {
    await axios.post(`/api/v1/auth/mfa/resend`, { challengeId });
  }, []);

  const refreshToken = useCallback(async () => {
    await refreshTokenHandler();
  }, []);

  const terminateSession = useCallback(async (sessionId: string) => {
    await axios.delete(`/api/v1/auth/sessions/${sessionId}`);
    queryClient.invalidateQueries({ queryKey: ['sessions'] });
    
    // If terminating current session, logout
    const currentSessionId = sessionStorage.getItem('session_id');
    if (sessionId === currentSessionId) {
      await logout();
    }
  }, [queryClient, logout]);

  const enableBiometric = useCallback(async () => {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: new TextEncoder().encode(await getDeviceFingerprint()),
        rp: {
          name: 'NCQ Platform',
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(user!.id),
          name: user!.email,
          displayName: `${user!.firstName} ${user!.lastName}`,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },
          { alg: -257, type: 'public-key' },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      } as any,
    });

    if (credential) {
      await axios.post('/api/v1/auth/biometric', {
        credentialId: credential.id,
        publicKey: credential.response,
      });
      
      localStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
      queryClient.invalidateQueries({ queryKey: ['biometric-credentials'] });
      toast.success('Biometric authentication enabled');
    }
  }, [user, queryClient]);

  const disableBiometric = useCallback(async (credentialId: string) => {
    await axios.delete(`/api/v1/auth/biometric/${credentialId}`);
    queryClient.invalidateQueries({ queryKey: ['biometric-credentials'] });
    
    if (biometricCredentials.length === 1) {
      localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
    }
    
    toast.success('Biometric credential removed');
  }, [biometricCredentials, queryClient]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithBiometric,
    logout,
    verifyMfa,
    resendMfa,
    refreshToken,
    sessions,
    terminateSession,
    biometricCredentials,
    enableBiometric,
    disableBiometric,
  };
};