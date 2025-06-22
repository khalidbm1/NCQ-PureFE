import { api } from './api'
import type { LoginCredentials, RegisterData, User, AuthResponse } from '../types/user'

class AuthService {
  setToken(token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  clearToken() {
    delete api.defaults.headers.common['Authorization']
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/api/v1/auth/login', credentials)
    
    const { user, accessToken, refreshToken } = response.data
    
    // Set token for future requests
    this.setToken(accessToken)
    
    return { user, accessToken, refreshToken, expiresIn: response.data.expiresIn }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/api/v1/auth/register', data)
    
    const { user, accessToken, refreshToken } = response.data
    
    // Set token for future requests
    this.setToken(accessToken)
    
    return { user, accessToken, refreshToken, expiresIn: response.data.expiresIn }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/api/v1/auth/logout')
    } catch (error) {
      // Even if logout fails, clear local tokens
      console.warn('Logout request failed:', error)
    } finally {
      this.clearToken()
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post('/auth/api/v1/auth/refresh', {
      refreshToken,
    })
    
    const { accessToken, refreshToken: newRefreshToken } = response.data
    
    // Update token for future requests
    this.setToken(accessToken)
    
    return { accessToken, refreshToken: newRefreshToken }
  }

  async validateToken(): Promise<User> {
    const response = await api.get('/auth/api/v1/auth/me')
    return response.data.user
  }

  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/api/v1/auth/forgot-password', { email })
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/api/v1/auth/reset-password', {
      token,
      password,
    })
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/api/v1/auth/change-password', {
      currentPassword,
      newPassword,
    })
  }

  async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/api/v1/auth/verify-email', { token })
  }

  async resendEmailVerification(): Promise<void> {
    await api.post('/auth/api/v1/auth/resend-verification')
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await api.patch('/auth/api/v1/users/profile', updates)
    return response.data.user
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await api.post('/auth/api/v1/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  }

  async enableTwoFactor(): Promise<{ qrCode: string; secret: string }> {
    const response = await api.post('/auth/api/v1/auth/2fa/enable')
    return response.data
  }

  async verifyTwoFactor(token: string, secret?: string): Promise<{ backupCodes: string[] }> {
    const response = await api.post('/auth/api/v1/auth/2fa/verify', {
      token,
      secret,
    })
    return response.data
  }

  async disableTwoFactor(token: string): Promise<void> {
    await api.post('/auth/api/v1/auth/2fa/disable', { token })
  }

  async deleteAccount(password: string): Promise<void> {
    await api.post('/auth/api/v1/users/delete-account', { password })
  }
}

export const authService = new AuthService()