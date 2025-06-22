export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  tenantId: string
  role: 'user' | 'admin'
  isActive: boolean
  emailVerified: boolean
  phoneVerified: boolean
  twoFactorEnabled: boolean
  subscription?: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise'
    status: 'active' | 'cancelled' | 'expired' | 'trial'
    expiresAt?: string
    features: string[]
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }
  profile: {
    firstName: string
    lastName: string
    phone?: string
    company?: string
    jobTitle?: string
    bio?: string
    website?: string
    location?: string
  }
  stats: {
    filesUploaded: number
    storageUsed: number
    apiCalls: number
    lastLoginAt: string
    createdAt: string
  }
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  twoFactorToken?: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  company?: string
  acceptTerms: boolean
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface ApiKey {
  id: string
  name: string
  keyPreview: string
  permissions: string[]
  expiresAt?: string
  createdAt: string
  lastUsedAt?: string
  isActive: boolean
  usageCount: number
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  actionLabel?: string
}

export interface FileUpload {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  isPublic: boolean
  expiresAt?: string
  uploadedAt: string
  downloads: number
  tags: string[]
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account'
  last4: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  createdAt: string
}

export interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description: string
  type: 'payment' | 'refund' | 'subscription'
  paymentMethodId?: string
  createdAt: string
  metadata?: Record<string, any>
}