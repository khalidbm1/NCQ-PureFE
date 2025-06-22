import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { routePaths } from '../router/AppRouter'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  roles: string[]
  permissions: string[]
  organization?: {
    id: string
    name: string
    type: string
  }
  preferences?: {
    language: 'en' | 'ar'
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  refreshTokens: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  isMFAVerified: () => boolean
  verifyMFA: (code: string) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  name: string
  organization?: string
}

interface TokenPayload {
  sub: string
  email: string
  name: string
  roles: string[]
  permissions: string[]
  exp: number
  iat: number
  mfa?: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'ncq_access_token'
const REFRESH_TOKEN_KEY = 'ncq_refresh_token'
const USER_KEY = 'ncq_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    accessToken: null,
    refreshToken: null,
  })

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY)
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
        const savedUser = localStorage.getItem(USER_KEY)

        if (token && savedUser) {
          const decoded = jwtDecode<TokenPayload>(token)
          
          // Check if token is expired
          if (decoded.exp * 1000 > Date.now()) {
            setState({
              user: JSON.parse(savedUser),
              isAuthenticated: true,
              isLoading: false,
              accessToken: token,
              refreshToken,
            })
          } else if (refreshToken) {
            // Try to refresh the token
            await refreshTokens()
          } else {
            // Clear expired auth
            clearAuth()
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        clearAuth()
      }
    }

    initAuth()
  }, [])

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      refreshToken: null,
    })
    queryClient.clear()
  }

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))

      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()
      const { accessToken, refreshToken, user } = data

      // Save to localStorage
      localStorage.setItem(TOKEN_KEY, accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      localStorage.setItem(USER_KEY, JSON.stringify(user))

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        accessToken,
        refreshToken,
      })

      // Redirect to dashboard or saved location
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || routePaths.dashboard.root
      sessionStorage.removeItem('redirectAfterLogin')
      navigate(redirectTo)
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [navigate])

  const logout = useCallback(async () => {
    try {
      // TODO: Call logout API to invalidate tokens
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
      navigate(routePaths.auth.login)
    }
  }, [state.accessToken, navigate])

  const register = useCallback(async (data: RegisterData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))

      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      // Auto-login after successful registration
      await login(data.email, data.password)
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [login])

  const refreshTokens = useCallback(async () => {
    try {
      const refreshToken = state.refreshToken || localStorage.getItem(REFRESH_TOKEN_KEY)
      
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      const { accessToken, refreshToken: newRefreshToken, user } = data

      // Update tokens and user
      localStorage.setItem(TOKEN_KEY, accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)
      localStorage.setItem(USER_KEY, JSON.stringify(user))

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        accessToken,
        refreshToken: newRefreshToken,
      })
    } catch (error) {
      console.error('Token refresh error:', error)
      clearAuth()
      navigate(routePaths.auth.login)
      throw error
    }
  }, [state.refreshToken, navigate])

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev
      
      const updatedUser = { ...prev.user, ...updates }
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
      
      return {
        ...prev,
        user: updatedUser,
      }
    })
  }, [])

  const hasRole = useCallback((role: string) => {
    return state.user?.roles?.includes(role) || false
  }, [state.user])

  const hasPermission = useCallback((permission: string) => {
    return state.user?.permissions?.includes(permission) || false
  }, [state.user])

  const isMFAVerified = useCallback(() => {
    if (!state.accessToken) return false
    
    try {
      const decoded = jwtDecode<TokenPayload>(state.accessToken)
      return decoded.mfa === true
    } catch {
      return false
    }
  }, [state.accessToken])

  const verifyMFA = useCallback(async (code: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error('Invalid MFA code')
      }

      const data = await response.json()
      const { accessToken } = data

      // Update with MFA-verified token
      localStorage.setItem(TOKEN_KEY, accessToken)
      setState(prev => ({ ...prev, accessToken }))

      // Redirect to original destination
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || routePaths.dashboard.root
      sessionStorage.removeItem('redirectAfterLogin')
      navigate(redirectTo)
    } catch (error) {
      throw error
    }
  }, [state.accessToken, navigate])

  // Set up axios interceptor for token refresh
  useEffect(() => {
    if (!state.accessToken) return

    const interceptor = (config: any) => {
      config.headers.Authorization = `Bearer ${state.accessToken}`
      return config
    }

    // TODO: Add axios interceptor
    // axios.interceptors.request.use(interceptor)

    return () => {
      // TODO: Remove axios interceptor
      // axios.interceptors.request.eject(interceptor)
    }
  }, [state.accessToken])

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    refreshTokens,
    updateUser,
    hasRole,
    hasPermission,
    isMFAVerified,
    verifyMFA,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}