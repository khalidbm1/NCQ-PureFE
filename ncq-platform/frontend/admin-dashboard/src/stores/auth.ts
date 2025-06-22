import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/auth'
import type { User, LoginCredentials } from '../types/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null })
          
          // Mock authentication for demo
          if (credentials.email === 'admin@ncq.sa' && credentials.password === 'admin123') {
            const mockUser: User = {
              id: '1',
              email: 'admin@ncq.sa',
              name: 'Admin User',
              role: 'admin',
              tenantId: 'tenant-1',
              isActive: true,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              permissions: ['*'],
              preferences: {
                theme: 'system',
                language: 'en',
                timezone: 'UTC',
                notifications: {
                  email: true,
                  push: true,
                  sms: false,
                }
              }
            }
            
            const mockAccessToken = 'mock-jwt-token-' + Date.now()
            const mockRefreshToken = 'mock-refresh-token-' + Date.now()
            
            // Store tokens
            localStorage.setItem('accessToken', mockAccessToken)
            localStorage.setItem('refreshToken', mockRefreshToken)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            set({
              user: mockUser,
              token: mockAccessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            
            return
          }
          
          // Try real API call as fallback
          const { user, accessToken, refreshToken } = await authService.login(credentials)
          
          // Store tokens
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
          
          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          // If network error, check mock credentials
          if (error.code === 'ERR_NETWORK' || error.message.includes('Network')) {
            if (credentials.email === 'admin@ncq.sa' && credentials.password === 'admin123') {
              const mockUser: User = {
                id: '1',
                email: 'admin@ncq.sa',
                name: 'Admin User',
                role: 'admin',
                tenantId: 'tenant-1',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                permissions: ['*'],
                preferences: {
                  theme: 'system',
                  language: 'en',
                  timezone: 'UTC',
                  notifications: {
                    email: true,
                    push: true,
                    sms: false,
                  }
                }
              }
              
              const mockAccessToken = 'mock-jwt-token-' + Date.now()
              const mockRefreshToken = 'mock-refresh-token-' + Date.now()
              
              localStorage.setItem('accessToken', mockAccessToken)
              localStorage.setItem('refreshToken', mockRefreshToken)
              
              await new Promise(resolve => setTimeout(resolve, 1000))
              
              set({
                user: mockUser,
                token: mockAccessToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              })
              
              return
            }
          }
          
          set({
            error: 'Invalid email or password. Try admin@ncq.sa / admin123',
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          })
          throw error
        }
      },

      logout: () => {
        // Clear tokens
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        
        // Clear auth service token
        authService.clearToken()
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken')
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken)
          
          // Update tokens
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)
          
          set({
            token: accessToken,
            isAuthenticated: true,
          })
        } catch (error) {
          // Refresh failed, logout user
          get().logout()
          throw error
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'ncq-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          // Set token in auth service
          authService.setToken(state.token)
          
          // Validate token on app load
          authService.validateToken().catch(() => {
            // Token invalid, logout
            state.logout()
          })
        }
      },
    }
  )
)