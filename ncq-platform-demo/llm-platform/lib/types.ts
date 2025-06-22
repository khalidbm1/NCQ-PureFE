// Tenant/Organization types
export interface Tenant {
  id: string
  name: string
  slug: string
  description?: string
  domain?: string
  logo?: string
  settings: TenantSettings
  subscription: TenantSubscription
  quotas: TenantQuotas
  members: TenantMember[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'suspended' | 'deleted'
}

export interface TenantSettings {
  allowedModels: string[]
  defaultModel: string
  apiRateLimit: number
  dataRetentionDays: number
  ssoEnabled: boolean
  ssoProvider?: string
  customBranding: {
    primaryColor?: string
    logoUrl?: string
    faviconUrl?: string
  }
  securitySettings: {
    requireMfa: boolean
    allowApiKeys: boolean
    ipWhitelist: string[]
    sessionTimeout: number
  }
  notificationSettings: {
    emailNotifications: boolean
    quotaWarnings: boolean
    usageReports: boolean
  }
}

export interface TenantSubscription {
  id: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEnd?: string
  autoRenew: boolean
  billingEmail: string
  paymentMethod?: PaymentMethod
}

export interface TenantQuotas {
  requests: {
    used: number
    limit: number
    resetDate: string
  }
  tokens: {
    used: number
    limit: number
    resetDate: string
  }
  storage: {
    used: number
    limit: number
  }
  members: {
    used: number
    limit: number
  }
  apiKeys: {
    used: number
    limit: number
  }
}

export interface TenantMember {
  id: string
  userId: string
  tenantId: string
  email: string
  name: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  permissions: string[]
  status: 'active' | 'pending' | 'suspended'
  invitedAt: string
  joinedAt?: string
  lastActiveAt?: string
}

export interface TenantInvitation {
  id: string
  tenantId: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  permissions: string[]
  invitedBy: string
  invitedAt: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
  token: string
}

export interface TenantUsageAnalytics {
  tenantId: string
  period: 'daily' | 'weekly' | 'monthly'
  data: {
    date: string
    requests: number
    tokens: number
    cost: number
    uniqueUsers: number
    topModels: {
      modelId: string
      modelName: string
      usage: number
    }[]
  }[]
  summary: {
    totalRequests: number
    totalTokens: number
    totalCost: number
    avgResponseTime: number
    errorRate: number
  }
}

// User types
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
  subscription?: Subscription
  tenants: UserTenant[]
  currentTenantId?: string
}

export interface UserTenant {
  tenantId: string
  tenantName: string
  tenantSlug: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  permissions: string[]
  status: 'active' | 'pending' | 'suspended'
  joinedAt: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

// API Key types
export interface ApiKey {
  id: string
  label: string
  key: string
  createdAt: string
  lastUsed: string | null
  status: 'active' | 'revoked'
}

// Model types
export interface Model {
  id: string
  name: string
  type: 'text' | 'image' | 'audio' | 'multimodal'
  description: string
  capabilities: string[]
  pricing: {
    input: number
    output: number
    unit: string
  }
  status: 'available' | 'busy' | 'offline'
  icon?: string
}

// Subscription types
export interface Subscription {
  id: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  usage: {
    requests: number
    tokens: number
    storage: number
  }
  limits: {
    requests: number
    tokens: number
    storage: number
  }
}

// Usage types
export interface UsageOverview {
  period: string
  totalRequests: number
  totalTokens: number
  totalCost: number
  byModel: {
    modelId: string
    modelName: string
    requests: number
    tokens: number
    cost: number
  }[]
  dailyUsage: {
    date: string
    requests: number
    tokens: number
    cost: number
  }[]
}

// Billing types
export interface Invoice {
  id: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  date: string
  pdfUrl: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_transfer'
  last4: string
  brand?: string
  isDefault: boolean
  expiryMonth?: number
  expiryYear?: number
}

// File types
export interface UploadedFile {
  id: string
  filename: string
  size: number
  mimeType: string
  uploadedAt: string
  url: string
}

// Inference types
export interface InferenceRequest {
  model: string
  prompt: string
  images?: string[]
  audio?: string
  documents?: string[]
  parameters?: {
    temperature?: number
    maxTokens?: number
    topP?: number
    frequencyPenalty?: number
    presencePenalty?: number
  }
}

export interface InferenceResponse {
  id: string
  model: string
  choices: {
    message: {
      content: string
      role: string
    }
    finishReason: string
  }[]
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  createdAt: string
}

// Error types
export interface ApiError {
  error: string
  message: string
  details?: any
  statusCode: number
}