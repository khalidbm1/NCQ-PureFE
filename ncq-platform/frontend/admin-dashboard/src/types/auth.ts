export interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'user'
  tenantId?: string
  avatar?: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  permissions?: string[]
  preferences?: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }
  twoFactorEnabled?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  twoFactorToken?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn?: number
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role?: 'admin' | 'user'
  tenantId?: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface TwoFactorSetup {
  qrCode: string
  secret: string
  backupCodes: string[]
}

export interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  expiresAt?: string
  createdAt: string
  lastUsedAt?: string
  isActive: boolean
}

export interface Session {
  id: string
  userId: string
  deviceInfo: {
    browser: string
    os: string
    ip: string
    location?: string
  }
  createdAt: string
  lastActiveAt: string
  isActive: boolean
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  metadata?: Record<string, any>
  ip: string
  userAgent: string
  createdAt: string
}