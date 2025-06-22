import { apiClient } from './client'
import { 
  Tenant, 
  TenantMember, 
  TenantInvitation, 
  TenantUsageAnalytics,
  TenantSettings,
  TenantSubscription,
  TenantQuotas 
} from '../types'

export interface CreateTenantRequest {
  name: string
  slug: string
  description?: string
  plan?: 'free' | 'starter' | 'pro' | 'enterprise'
}

export interface UpdateTenantRequest {
  name?: string
  description?: string
  settings?: Partial<TenantSettings>
}

export interface InviteMemberRequest {
  email: string
  role: 'admin' | 'member' | 'viewer'
  permissions?: string[]
  message?: string
}

export interface UpdateMemberRequest {
  role?: 'admin' | 'member' | 'viewer'
  permissions?: string[]
  status?: 'active' | 'suspended'
}

// Tenant Management
export const tenantsApi = {
  // Get all tenants for current user
  getUserTenants: (): Promise<Tenant[]> => {
    return apiClient.get('/tenants/user-tenants')
  },

  // Get tenant details
  getTenant: (tenantId: string): Promise<Tenant> => {
    return apiClient.get(`/tenants/${tenantId}`)
  },

  // Create new tenant
  createTenant: (data: CreateTenantRequest): Promise<Tenant> => {
    return apiClient.post('/tenants', data)
  },

  // Update tenant
  updateTenant: (tenantId: string, data: UpdateTenantRequest): Promise<Tenant> => {
    return apiClient.patch(`/tenants/${tenantId}`, data)
  },

  // Delete tenant
  deleteTenant: (tenantId: string): Promise<void> => {
    return apiClient.delete(`/tenants/${tenantId}`)
  },

  // Get tenant settings
  getTenantSettings: (tenantId: string): Promise<TenantSettings> => {
    return apiClient.get(`/tenants/${tenantId}/settings`)
  },

  // Update tenant settings
  updateTenantSettings: (tenantId: string, settings: Partial<TenantSettings>): Promise<TenantSettings> => {
    return apiClient.patch(`/tenants/${tenantId}/settings`, settings)
  },

  // Get tenant quotas
  getTenantQuotas: (tenantId: string): Promise<TenantQuotas> => {
    return apiClient.get(`/tenants/${tenantId}/quotas`)
  },

  // Update tenant quotas (admin only)
  updateTenantQuotas: (tenantId: string, quotas: Partial<TenantQuotas>): Promise<TenantQuotas> => {
    return apiClient.patch(`/tenants/${tenantId}/quotas`, quotas)
  },
}

// Member Management
export const membersApi = {
  // Get tenant members
  getTenantMembers: (tenantId: string): Promise<TenantMember[]> => {
    return apiClient.get(`/tenants/${tenantId}/members`)
  },

  // Get current user's membership
  getCurrentMembership: (tenantId: string): Promise<TenantMember> => {
    return apiClient.get(`/tenants/${tenantId}/members/me`)
  },

  // Get member details
  getMember: (tenantId: string, memberId: string): Promise<TenantMember> => {
    return apiClient.get(`/tenants/${tenantId}/members/${memberId}`)
  },

  // Invite member
  inviteMember: (tenantId: string, data: InviteMemberRequest): Promise<TenantInvitation> => {
    return apiClient.post(`/tenants/${tenantId}/members/invite`, data)
  },

  // Update member
  updateMember: (tenantId: string, memberId: string, data: UpdateMemberRequest): Promise<TenantMember> => {
    return apiClient.patch(`/tenants/${tenantId}/members/${memberId}`, data)
  },

  // Remove member
  removeMember: (tenantId: string, memberId: string): Promise<void> => {
    return apiClient.delete(`/tenants/${tenantId}/members/${memberId}`)
  },

  // Leave tenant
  leaveTenant: (tenantId: string): Promise<void> => {
    return apiClient.post(`/tenants/${tenantId}/members/leave`)
  },
}

// Invitation Management
export const invitationsApi = {
  // Get pending invitations for tenant
  getTenantInvitations: (tenantId: string): Promise<TenantInvitation[]> => {
    return apiClient.get(`/tenants/${tenantId}/invitations`)
  },

  // Resend invitation
  resendInvitation: (tenantId: string, invitationId: string): Promise<TenantInvitation> => {
    return apiClient.post(`/tenants/${tenantId}/invitations/${invitationId}/resend`)
  },

  // Revoke invitation
  revokeInvitation: (tenantId: string, invitationId: string): Promise<void> => {
    return apiClient.delete(`/tenants/${tenantId}/invitations/${invitationId}`)
  },

  // Accept invitation (by invited user)
  acceptInvitation: (token: string): Promise<{ tenant: Tenant; member: TenantMember }> => {
    return apiClient.post('/invitations/accept', { token })
  },

  // Reject invitation (by invited user)
  rejectInvitation: (token: string): Promise<void> => {
    return apiClient.post('/invitations/reject', { token })
  },

  // Get invitation details by token
  getInvitationByToken: (token: string): Promise<TenantInvitation> => {
    return apiClient.get(`/invitations/${token}`)
  },
}

// Usage Analytics
export const analyticsApi = {
  // Get tenant usage analytics
  getTenantAnalytics: (
    tenantId: string, 
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    startDate?: string,
    endDate?: string
  ): Promise<TenantUsageAnalytics> => {
    const params = new URLSearchParams({ period })
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    return apiClient.get(`/tenants/${tenantId}/analytics?${params.toString()}`)
  },

  // Get model usage breakdown
  getModelUsage: (
    tenantId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<{
    modelId: string
    modelName: string
    requests: number
    tokens: number
    cost: number
    trend: number
  }[]> => {
    return apiClient.get(`/tenants/${tenantId}/analytics/models?period=${period}`)
  },

  // Get cost breakdown
  getCostBreakdown: (
    tenantId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<{
    total: number
    byModel: {
      modelId: string
      modelName: string
      cost: number
      percentage: number
    }[]
    byUser: {
      userId: string
      userName: string
      cost: number
      percentage: number
    }[]
  }> => {
    return apiClient.get(`/tenants/${tenantId}/analytics/costs?period=${period}`)
  },

  // Export usage data
  exportUsageData: (
    tenantId: string,
    format: 'csv' | 'json' | 'pdf',
    startDate: string,
    endDate: string
  ): Promise<Blob> => {
    return apiClient.get(
      `/tenants/${tenantId}/analytics/export?format=${format}&startDate=${startDate}&endDate=${endDate}`,
      { responseType: 'blob' }
    )
  },
}

// Billing Management
export const billingApi = {
  // Get tenant subscription
  getTenantSubscription: (tenantId: string): Promise<TenantSubscription> => {
    return apiClient.get(`/tenants/${tenantId}/subscription`)
  },

  // Update subscription plan
  updateSubscriptionPlan: (tenantId: string, plan: string): Promise<TenantSubscription> => {
    return apiClient.post(`/tenants/${tenantId}/subscription/change-plan`, { plan })
  },

  // Cancel subscription
  cancelSubscription: (tenantId: string, cancelAtPeriodEnd: boolean = true): Promise<TenantSubscription> => {
    return apiClient.post(`/tenants/${tenantId}/subscription/cancel`, { cancelAtPeriodEnd })
  },

  // Reactivate subscription
  reactivateSubscription: (tenantId: string): Promise<TenantSubscription> => {
    return apiClient.post(`/tenants/${tenantId}/subscription/reactivate`)
  },

  // Get billing history
  getBillingHistory: (tenantId: string): Promise<{
    invoices: {
      id: string
      amount: number
      currency: string
      status: string
      date: string
      pdfUrl: string
    }[]
    upcomingInvoice?: {
      amount: number
      currency: string
      date: string
    }
  }> => {
    return apiClient.get(`/tenants/${tenantId}/billing/history`)
  },

  // Download invoice
  downloadInvoice: (tenantId: string, invoiceId: string): Promise<Blob> => {
    return apiClient.get(
      `/tenants/${tenantId}/billing/invoices/${invoiceId}/download`,
      { responseType: 'blob' }
    )
  },

  // Update billing information
  updateBillingInfo: (tenantId: string, data: {
    billingEmail?: string
    companyName?: string
    taxId?: string
    address?: {
      line1: string
      line2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }): Promise<void> => {
    return apiClient.patch(`/tenants/${tenantId}/billing/info`, data)
  },
}