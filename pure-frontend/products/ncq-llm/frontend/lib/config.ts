// Platform Configuration
export const PLATFORM_AUTH_URL = process.env.NEXT_PUBLIC_PLATFORM_AUTH_URL || 'http://localhost:3001'
export const PLATFORM_API_GATEWAY = process.env.NEXT_PUBLIC_PLATFORM_API_GATEWAY || 'http://localhost:8080'

// LLM Service Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_LLM_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Platform API Endpoints (through API Gateway)
export const PLATFORM_ENDPOINTS = {
  // Platform Auth
  auth: {
    login: '/api/v1/auth/login',
    signup: '/api/v1/auth/signup',
    logout: '/api/v1/auth/logout',
    refresh: '/api/v1/auth/refresh',
    me: '/api/v1/auth/me',
    sso: {
      google: '/api/v1/auth/sso/google',
      github: '/api/v1/auth/sso/github',
      callback: '/api/v1/auth/sso/callback',
    },
  },
  
  // Platform User Management
  platform: {
    profile: '/api/v1/platform/user/profile',
    tenants: '/api/v1/platform/tenants',
    permissions: '/api/v1/platform/permissions',
  },
}

// LLM Service API Endpoints
export const API_ENDPOINTS = {
  // LLM User Management
  user: {
    profile: '/api/v1/user/profile',
    initialize: '/api/v1/user/initialize',
    update: '/api/v1/user/update',
    subscription: '/api/v1/user/subscription',
  },
  
  // API Keys
  apiKeys: {
    list: '/api/v1/api-keys',
    create: '/api/v1/api-keys',
    revoke: (id: string) => `/api/v1/api-keys/${id}/revoke`,
    delete: (id: string) => `/api/v1/api-keys/${id}`,
  },
  
  // Models
  models: {
    list: '/api/v1/models',
    inference: '/api/v1/inference',
    status: (modelId: string) => `/api/v1/models/${modelId}/status`,
    download: (modelId: string) => `/api/v1/models/${modelId}/download`,
  },
  
  // Inference
  inference: {
    chat: '/api/v1/inference/chat',
    completion: '/api/v1/inference/completion',
    embedding: '/api/v1/inference/embedding',
    stream: '/api/v1/inference/stream',
  },
  
  // Usage and Analytics
  usage: {
    overview: '/api/v1/usage/overview',
    detailed: '/api/v1/usage/detailed',
    export: '/api/v1/usage/export',
    realtime: '/api/v1/usage/realtime',
  },
  
  // Billing (integrated with platform)
  billing: {
    subscription: '/api/v1/billing/subscription',
    invoices: '/api/v1/billing/invoices',
    paymentMethods: '/api/v1/billing/payment-methods',
    upgrade: '/api/v1/billing/upgrade',
    usage: '/api/v1/billing/usage',
  },
  
  // Files and Documents
  files: {
    upload: '/api/v1/files/upload',
    list: '/api/v1/files',
    get: (id: string) => `/api/v1/files/${id}`,
    delete: (id: string) => `/api/v1/files/${id}`,
    process: (id: string) => `/api/v1/files/${id}/process`,
  },
  
  // Knowledge Base
  knowledge: {
    documents: '/api/v1/knowledge/documents',
    search: '/api/v1/knowledge/search',
    upload: '/api/v1/knowledge/upload',
    vectorize: '/api/v1/knowledge/vectorize',
  },
  
  // Fine-tuning
  training: {
    jobs: '/api/v1/training/jobs',
    create: '/api/v1/training/create',
    status: (jobId: string) => `/api/v1/training/${jobId}/status`,
    logs: (jobId: string) => `/api/v1/training/${jobId}/logs`,
  },
}

// Service Configuration
export const SERVICE_CONFIG = {
  name: 'ncq-llm',
  version: 'v1',
  permissions: {
    read: 'llm:read',
    write: 'llm:write',
    admin: 'llm:admin',
    billing: 'llm:billing',
    training: 'llm:training',
  },
}

// Storage Keys (deprecated - keeping for backward compatibility)
export const AUTH_TOKEN_KEY = 'ncq_auth_token'
export const REFRESH_TOKEN_KEY = 'ncq_refresh_token'

// Platform Storage Keys
export const PLATFORM_STORAGE_KEYS = {
  accessToken: 'ncq_platform_access_token',
  refreshToken: 'ncq_platform_refresh_token',
  user: 'ncq_platform_user',
  tokenExpires: 'ncq_platform_token_expires',
}

// WebSocket Configuration
export const WS_CONFIG = {
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
}

// NCQ Payment Gateway Configuration
export const NCQ_PAYMENT_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_PAYMENT_API_KEY || '',
  environment: (process.env.NEXT_PUBLIC_PAYMENT_ENV as 'sandbox' | 'production') || 'sandbox',
  merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID || '',
  apiUrl: process.env.NEXT_PUBLIC_NCQ_PGW_API_URL || 'https://sandbox-api.ncq-pgw.com/api/v1',
  wsUrl: process.env.NEXT_PUBLIC_NCQ_PGW_WS_URL || 'wss://sandbox-api.ncq-pgw.com/ws',
}

// Currency and Localization Configuration
export const LOCALIZATION_CONFIG = {
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'SAR',
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en',
  supportedLocales: (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || 'en,ar').split(','),
}

// Payment Feature Flags
export const PAYMENT_FEATURES = {
  enableArabic: process.env.NEXT_PUBLIC_ENABLE_ARABIC === 'true',
  enableRTL: process.env.NEXT_PUBLIC_ENABLE_RTL === 'true',
  enableMADA: process.env.NEXT_PUBLIC_ENABLE_MADA === 'true',
  enableSTCPay: process.env.NEXT_PUBLIC_ENABLE_STC_PAY === 'true',
  enableSADAD: process.env.NEXT_PUBLIC_ENABLE_SADAD === 'true',
  enableApplePay: process.env.NEXT_PUBLIC_ENABLE_APPLE_PAY === 'true',
}

// Feature Flags
export const FEATURES = {
  enableSSO: process.env.NEXT_PUBLIC_ENABLE_SSO === 'true',
  enableWebSocket: process.env.NEXT_PUBLIC_ENABLE_WS === 'true',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableBilling: process.env.NEXT_PUBLIC_ENABLE_BILLING === 'true',
  enableTraining: process.env.NEXT_PUBLIC_ENABLE_TRAINING === 'true',
}