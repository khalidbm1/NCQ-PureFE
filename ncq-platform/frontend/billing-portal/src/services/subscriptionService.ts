import api from './api'
import { Subscription, Plan, CreateSubscriptionData, UpdateSubscriptionData, ApiResponse } from '../types'

class SubscriptionService {
  async getCurrentSubscription(): Promise<Subscription> {
    return api.get<Subscription>('/billing/subscription')
  }

  async getPlans(): Promise<Plan[]> {
    const response = await api.get<ApiResponse<Plan[]>>('/billing/plans')
    return response.data
  }

  async createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
    return api.post<Subscription>('/billing/subscription', data)
  }

  async updateSubscription(id: string, data: UpdateSubscriptionData): Promise<Subscription> {
    return api.patch<Subscription>(`/billing/subscription/${id}`, data)
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    return api.post<Subscription>(`/billing/subscription/${id}/cancel`)
  }

  async reactivateSubscription(id: string): Promise<Subscription> {
    return api.post<Subscription>(`/billing/subscription/${id}/reactivate`)
  }

  async previewProration(planId: string, billingCycle: string): Promise<{
    amount: number
    prorationDate: string
    items: Array<{ description: string; amount: number }>
  }> {
    return api.post('/billing/subscription/preview-proration', { planId, billingCycle })
  }

  async getSubscriptionHistory(): Promise<Subscription[]> {
    const response = await api.get<ApiResponse<Subscription[]>>('/billing/subscription/history')
    return response.data
  }
}

export default new SubscriptionService()