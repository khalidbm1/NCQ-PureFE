'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { login as loginAction, logout as logoutAction, setUser } from '@/store/slices/authSlice'
import { apiService } from '@/lib/api'
import { useSnackbar } from 'notistack'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<any>
  loginWithOTP: (email: string, password: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const { user, token, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  )

  useEffect(() => {
    // Check if user is authenticated on mount
    if (token && !user) {
      loadUserProfile()
    }
  }, [token])

  const loadUserProfile = async () => {
    try {
      const response = await apiService.users.getProfile()
      dispatch(setUser(response.data))
    } catch (error) {
      console.error('Failed to load user profile:', error)
      dispatch(logoutAction())
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.auth.login(email, password)
      const { token, refreshToken, user, requireOTP } = response.data

      if (requireOTP) {
        return { requireOTP: true }
      }

      dispatch(loginAction({ token, refreshToken, user }))
      enqueueSnackbar('Login successful', { variant: 'success' })
      router.push('/')
      return response.data
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Login failed', { variant: 'error' })
      throw error
    }
  }

  const loginWithOTP = async (email: string, password: string, otp: string) => {
    try {
      const response = await apiService.auth.loginWithOTP(email, password, otp)
      const { token, refreshToken, user } = response.data

      dispatch(loginAction({ token, refreshToken, user }))
      enqueueSnackbar('Login successful', { variant: 'success' })
      router.push('/')
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Invalid OTP', { variant: 'error' })
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiService.auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch(logoutAction())
      router.push('/login')
      enqueueSnackbar('Logged out successfully', { variant: 'info' })
    }
  }

  const updateProfile = async (data: any) => {
    try {
      const response = await apiService.users.updateProfile(data)
      dispatch(setUser(response.data))
      enqueueSnackbar('Profile updated successfully', { variant: 'success' })
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to update profile', {
        variant: 'error',
      })
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithOTP,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}