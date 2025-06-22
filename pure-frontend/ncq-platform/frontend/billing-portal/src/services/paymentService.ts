import api from './api'
import { PaymentMethod, CreatePaymentMethodData } from '../types'
// Migration to NCQ Payment Gateway - no longer using Stripe directly

class PaymentService {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return api.get<PaymentMethod[]>('/billing/payment-methods')
  }

  async addPaymentMethod(data: CreatePaymentMethodData): Promise<PaymentMethod> {
    return api.post<PaymentMethod>('/billing/payment-methods', data)
  }

  async removePaymentMethod(id: string): Promise<void> {
    return api.delete(`/billing/payment-methods/${id}`)
  }

  async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
    return api.post<PaymentMethod>(`/billing/payment-methods/${id}/default`)
  }

  async createSetupIntent(): Promise<{ clientSecret: string }> {
    return api.post('/billing/payment-methods/setup-intent')
  }

  async createPaymentIntent(amount: number): Promise<{ clientSecret: string }> {
    return api.post('/billing/payment-intent', { amount })
  }

  async getPaymentWidget() {
    // NCQ Payment Widget will be loaded dynamically
    // This maintains backward compatibility
    return {
      // Mock Stripe-like interface for NCQ PGW
      elements: () => ({
        create: (type: string) => ({
          mount: (selector: string) => {},
          unmount: () => {},
          on: (event: string, handler: Function) => {}
        })
      })
    }
  }

  async processPayment(paymentMethodId: string, amount: number): Promise<{
    success: boolean
    transactionId?: string
    error?: string
  }> {
    try {
      const response = await api.post('/billing/process-payment', {
        paymentMethodId,
        amount,
      })
      return response
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Payment failed',
      }
    }
  }

  async getPaymentHistory(filters?: {
    startDate?: string
    endDate?: string
    status?: string
  }): Promise<Array<{
    id: string
    amount: number
    currency: string
    status: string
    paymentMethod: PaymentMethod
    createdAt: string
    description?: string
  }>> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
    }
    return api.get(`/billing/payments?${params.toString()}`)
  }
}

export default new PaymentService()