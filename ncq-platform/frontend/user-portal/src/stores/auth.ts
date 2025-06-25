import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/auth'
import type { User, LoginCredentials, RegisterData } from '../types/user'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

import { env } from '../config/env'
import { createMockUser } from '../lib/mockData'

// Check if pure frontend mode
const isPureFrontend = env.PURE_FRONTEND

// Mock user for pure frontend mode
const mockUser = isPureFrontend ? createMockUser() : null

export const useAuthStore = create<AuthState>()( 
  persist(
    (set, get) => ({
      user: mockUser,
      token: isPureFrontend ? 'mock-token' : null,
      isAuthenticated: isPureFrontend,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null })
          
          // Mock authentication for demo
          if (credentials.email === 'user@ncq.sa' && credentials.password === 'user123') {
            const mockUser: User = {
              id: '1',
              email: 'user@ncq.sa',
              name: 'John Doe',
              tenantId: 'tenant-1',
              role: 'user',
              isActive: true,
              emailVerified: true,
              phoneVerified: false,
              twoFactorEnabled: false,
              subscription: {
                plan: 'premium',
                status: 'active',
                expiresAt: '2024-12-31T23:59:59Z',
                features: ['unlimited_storage', 'api_access', 'team_collaboration']
              },
              preferences: {
                theme: 'system',
                language: 'en',
                timezone: 'UTC',
                notifications: {
                  email: true,
                  push: true,
                  sms: false,
                }
              },
              profile: {
                firstName: 'John',
                lastName: 'Doe',
                phone: '+966501234567',
                company: 'NCQ Solutions',
                jobTitle: 'Software Engineer',
                bio: 'Building amazing things with NCQ Platform',
                website: 'https://ncq.sa',
                location: 'Riyadh, Saudi Arabia'
              },
              stats: {
                filesUploaded: 142,
                storageUsed: 512, // MB
                apiCalls: 8934,
                lastLoginAt: new Date().toISOString(),
                createdAt: '2024-01-01T00:00:00Z'
              },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: new Date().toISOString()
            }
            
            const mockAccessToken = 'mock-jwt-token-' + Date.now()
            const mockRefreshToken = 'mock-refresh-token-' + Date.now()
            
            // Store tokens
            localStorage.setItem('accessToken', mockAccessToken)
            localStorage.setItem('refreshToken', mockRefreshToken)
            localStorage.setItem('tenantId', mockUser.tenantId)
            
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
            if (credentials.email === 'user@ncq.sa' && credentials.password === 'user123') {
              const mockUser: User = {
                id: '1',
                email: 'user@ncq.sa',
                name: 'John Doe',
                tenantId: 'tenant-1',
                role: 'user',
                isActive: true,
                emailVerified: true,
                phoneVerified: false,
                twoFactorEnabled: false,
                subscription: {
                  plan: 'premium',
                  status: 'active',
                  expiresAt: '2024-12-31T23:59:59Z',
                  features: ['unlimited_storage', 'api_access', 'team_collaboration']
                },
                preferences: {
                  theme: 'system',
                  language: 'en',
                  timezone: 'UTC',
                  notifications: {
                    email: true,
                    push: true,
                    sms: false,
                  }
                },
                profile: {
                  firstName: 'John',
                  lastName: 'Doe',
                  phone: '+966501234567',
                  company: 'NCQ Solutions',
                  jobTitle: 'Software Engineer',
                  bio: 'Building amazing things with NCQ Platform',
                  website: 'https://ncq.sa',
                  location: 'Riyadh, Saudi Arabia'
                },
                stats: {
                  filesUploaded: 142,
                  storageUsed: 512, // MB
                  apiCalls: 8934,
                  lastLoginAt: new Date().toISOString(),
                  createdAt: '2024-01-01T00:00:00Z'
                },
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: new Date().toISOString()
              }
              
              const mockAccessToken = 'mock-jwt-token-' + Date.now()
              const mockRefreshToken = 'mock-refresh-token-' + Date.now()
              
              localStorage.setItem('accessToken', mockAccessToken)
              localStorage.setItem('refreshToken', mockRefreshToken)
              localStorage.setItem('tenantId', mockUser.tenantId)
              
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
            error: 'Invalid email or password. Try user@ncq.sa / user123',
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null })
          
          // Mock registration for demo
          const mockUser: User = {
            id: '2',
            email: data.email,
            name: `${data.firstName} ${data.lastName}`,
            tenantId: 'tenant-1',
            role: 'user',
            isActive: true,
            emailVerified: false,
            phoneVerified: false,
            twoFactorEnabled: false,
            subscription: {
              plan: 'free',
              status: 'trial',
              features: ['basic_storage', 'limited_api']
            },
            preferences: {
              theme: 'system',
              language: 'en',
              timezone: 'UTC',
              notifications: {
                email: true,
                push: true,
                sms: false,
              }
            },
            profile: {
              firstName: data.firstName,
              lastName: data.lastName,
              company: data.company || '',
              phone: '',
              jobTitle: '',
              bio: '',
              website: '',
              location: ''
            },
            stats: {
              filesUploaded: 0,
              storageUsed: 0,
              apiCalls: 0,
              lastLoginAt: new Date().toISOString(),
              createdAt: new Date().toISOString()
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          const mockAccessToken = 'mock-jwt-token-' + Date.now()
          const mockRefreshToken = 'mock-refresh-token-' + Date.now()
          
          // Store tokens
          localStorage.setItem('accessToken', mockAccessToken)
          localStorage.setItem('refreshToken', mockRefreshToken)
          localStorage.setItem('tenantId', mockUser.tenantId)
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          set({
            user: mockUser,
            token: mockAccessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Registration failed',
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
        localStorage.removeItem('tenantId')
        
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

      updateUser: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({
            user: { ...user, ...updates }
          })
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'ncq-user-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          // Set token in auth service
          authService.setToken(state.token)
          
          // Set tenant ID if available
          if (state.user?.tenantId) {
            localStorage.setItem('tenantId', state.user.tenantId)
          }
          
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