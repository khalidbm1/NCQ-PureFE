import { API_ENDPOINTS } from '../config'
import { AuthTokens, User } from '../types'
import { apiClient } from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
}

export const authApi = {
  async login(data: LoginRequest): Promise<AuthTokens> {
    const tokens = await apiClient.post<AuthTokens>(API_ENDPOINTS.auth.login, data)
    apiClient.setTokens(tokens)
    return tokens
  },
  
  async signup(data: SignupRequest): Promise<AuthTokens> {
    const tokens = await apiClient.post<AuthTokens>(API_ENDPOINTS.auth.signup, data)
    apiClient.setTokens(tokens)
    return tokens
  },
  
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout)
    } finally {
      apiClient.clearTokens()
    }
  },
  
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.auth.me)
  },
  
  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.put<User>(API_ENDPOINTS.user.profile, data)
  },
  
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.user.changePassword, {
      current_password: currentPassword,
      new_password: newPassword,
    })
  },
}