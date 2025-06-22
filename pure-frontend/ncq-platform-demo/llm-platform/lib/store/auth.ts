import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, AuthUser, LoginCredentials, SignupCredentials } from '../auth'
import { platformAuthClient } from '../platform-auth'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string, tenantId?: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithGitHub: () => Promise<void>
  handleSSOCallback: (code: string, state: string) => Promise<void>
  signup: (email: string, password: string, name: string, tenantId?: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  refreshSession: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string, tenantId?: string) => {
        set({ isLoading: true, error: null })
        try {
          const credentials: LoginCredentials = {
            email,
            password,
            tenantId
          }
          
          const user = await authService.login(credentials)
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({ 
            error: error.message || 'Login failed', 
            isLoading: false,
            isAuthenticated: false
          })
          throw error
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null })
        try {
          const loginUrl = await authService.loginWithGoogle()
          window.location.href = loginUrl
        } catch (error: any) {
          set({ 
            error: error.message || 'Google login failed', 
            isLoading: false 
          })
          throw error
        }
      },

      loginWithGitHub: async () => {
        set({ isLoading: true, error: null })
        try {
          const loginUrl = await authService.loginWithGitHub()
          window.location.href = loginUrl
        } catch (error: any) {
          set({ 
            error: error.message || 'GitHub login failed', 
            isLoading: false 
          })
          throw error
        }
      },

      handleSSOCallback: async (code: string, state: string) => {
        set({ isLoading: true, error: null })
        try {
          const user = await authService.handleSSOCallback(code, state)
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({ 
            error: error.message || 'SSO authentication failed', 
            isLoading: false,
            isAuthenticated: false
          })
          throw error
        }
      },
      
      signup: async (email: string, password: string, name: string, tenantId?: string) => {
        set({ isLoading: true, error: null })
        try {
          const credentials: SignupCredentials = {
            email,
            password,
            name,
            tenantId
          }
          
          const user = await authService.signup(credentials)
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({ 
            error: error.message || 'Signup failed', 
            isLoading: false,
            isAuthenticated: false
          })
          throw error
        }
      },
      
      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          })
        } catch (error: any) {
          console.warn('Logout error:', error)
          // Always clear local state even if logout API fails
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          })
        }
      },
      
      checkAuth: async () => {
        set({ isLoading: true })
        try {
          // Check if we have a valid platform token
          if (!authService.isAuthenticated()) {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            })
            return
          }

          const user = await authService.getCurrentUser()
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false })
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            })
          }
        } catch (error) {
          console.warn('Auth check failed:', error)
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
        }
      },

      refreshSession: async () => {
        set({ isLoading: true })
        try {
          const user = await authService.refreshSession()
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false })
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            })
          }
        } catch (error) {
          console.warn('Session refresh failed:', error)
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'ncq-llm-auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        // Don't persist sensitive user data in local storage
        // User data will be fetched on auth check
      }),
    }
  )
)