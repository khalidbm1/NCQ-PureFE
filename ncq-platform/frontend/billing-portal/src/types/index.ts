// User types
export interface User {
  id: string
  email: string
  name: string
  tenantId: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Subscription types
export interface Subscription {
  id: string
  tenantId: string
  planId: string
  plan: Plan
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  trialEnd?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: string
  name: string
  description: string
  features: PlanFeature[]
  pricing: PlanPricing[]
  limits: PlanLimits
  metadata?: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PlanFeature {
  name: string
  description?: string
  included: boolean
}

export interface PlanPricing {
  billingCycle: 'monthly' | 'yearly'
  amount: number
  currency: string
  discount?: number
}

export interface PlanLimits {
  maxUsers?: number
  maxProjects?: number
  maxApiCalls?: number
  maxStorage?: number
  [key: string]: number | undefined
}

export interface CreateSubscriptionData {
  planId: string
  billingCycle: 'monthly' | 'yearly'
  paymentMethodId?: string
}

export interface UpdateSubscriptionData {
  planId?: string
  billingCycle?: 'monthly' | 'yearly'
  cancelAtPeriodEnd?: boolean
}

// Invoice types
export interface Invoice {
  id: string
  invoiceNumber: string
  subscriptionId: string
  tenantId: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  amount: number
  currency: string
  dueDate: string
  paidAt?: string
  items: InvoiceItem[]
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitAmount: number
  amount: number
}

export interface InvoiceFilters {
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

// Payment types
export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account'
  card?: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }
  bankAccount?: {
    bankName: string
    last4: string
    accountType: string
  }
  isDefault: boolean
  createdAt: string
}

export interface CreatePaymentMethodData {
  type: 'card' | 'bank_account'
  token: string
  setAsDefault?: boolean
}

// Usage types
export interface UsageData {
  period: {
    start: string
    end: string
  }
  metrics: {
    apiCalls: UsageMetric
    storage: UsageMetric
    users: UsageMetric
    [key: string]: UsageMetric
  }
}

export interface UsageMetric {
  current: number
  limit: number
  unit: string
  percentage: number
}

export interface UsageMetrics {
  date: string
  metrics: Record<string, number>
}

export interface UsagePeriod {
  start: string
  end: string
  granularity: 'daily' | 'weekly' | 'monthly'
}

// Common types
export interface ApiResponse<T> {
  data: T
  total?: number
  page?: number
  limit?: number
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}