import api from './api'
import { User, LoginCredentials, AuthResponse } from '../types'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', credentials)
  }

  async logout(): Promise<void> {
    return api.post('/auth/logout')
  }

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me')
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return api.patch<User>('/auth/profile', data)
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    return api.post('/auth/change-password', data)
  }

  async forgotPassword(email: string): Promise<void> {
    return api.post('/auth/forgot-password', { email })
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return api.post('/auth/reset-password', { token, newPassword })
  }
}

export default new AuthService()