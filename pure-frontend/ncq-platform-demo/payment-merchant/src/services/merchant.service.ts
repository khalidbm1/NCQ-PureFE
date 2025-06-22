import { api } from '@/lib/api'

export const merchantService = {
  async getDashboardMetrics(dateRange: string) {
    const { data } = await api.get('/merchant/dashboard/metrics', {
      params: { dateRange },
    })
    return data
  },

  async getAlerts() {
    const { data } = await api.get('/merchant/alerts')
    return data
  },

  async getAccountStatus() {
    const { data } = await api.get('/merchant/account/status')
    return data
  },

  async getPaymentOverview(dateRange: string, view: string) {
    const { data } = await api.get('/merchant/analytics/payment-overview', {
      params: { dateRange, view },
    })
    return data
  },

  async getRevenueAnalytics(dateRange: string, groupBy: string) {
    const { data } = await api.get('/merchant/analytics/revenue', {
      params: { dateRange, groupBy },
    })
    return data
  },

  async getRecentTransactions() {
    const { data } = await api.get('/merchant/transactions/recent')
    return data
  },

  async getPaymentMethodsPerformance() {
    const { data } = await api.get('/merchant/analytics/payment-methods')
    return data
  },

  async getSettlementInfo() {
    const { data } = await api.get('/merchant/settlements/info')
    return data
  },

  async exportReport(dateRange: string) {
    const response = await api.get('/merchant/reports/export', {
      params: { dateRange },
      responseType: 'blob',
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `merchant-report-${dateRange}-${Date.now()}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  async exportTransactions() {
    const response = await api.get('/merchant/transactions/export', {
      responseType: 'blob',
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `transactions-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  async downloadSettlementReport() {
    const response = await api.get('/merchant/settlements/report', {
      responseType: 'blob',
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `settlement-report-${Date.now()}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  // Transaction management
  async getTransaction(id: string) {
    const { data } = await api.get(`/merchant/transactions/${id}`)
    return data
  },

  async refundTransaction(id: string, amount?: number, reason?: string) {
    const { data } = await api.post(`/merchant/transactions/${id}/refund`, {
      amount,
      reason,
    })
    return data
  },

  async getTransactions(params: any) {
    const { data } = await api.get('/merchant/transactions', { params })
    return data
  },

  // Payment links
  async createPaymentLink(data: any) {
    const response = await api.post('/merchant/payment-links', data)
    return response.data
  },

  async getPaymentLinks(params: any) {
    const { data } = await api.get('/merchant/payment-links', { params })
    return data
  },

  async getPaymentLink(id: string) {
    const { data } = await api.get(`/merchant/payment-links/${id}`)
    return data
  },

  async deletePaymentLink(id: string) {
    await api.delete(`/merchant/payment-links/${id}`)
  },

  // API keys management
  async getApiKeys() {
    const { data } = await api.get('/merchant/api-keys')
    return data
  },

  async createApiKey(name: string, permissions: string[]) {
    const { data } = await api.post('/merchant/api-keys', { name, permissions })
    return data
  },

  async revokeApiKey(id: string) {
    await api.delete(`/merchant/api-keys/${id}`)
  },

  // Webhooks
  async getWebhooks() {
    const { data } = await api.get('/merchant/webhooks')
    return data
  },

  async createWebhook(data: any) {
    const response = await api.post('/merchant/webhooks', data)
    return response.data
  },

  async updateWebhook(id: string, data: any) {
    const response = await api.put(`/merchant/webhooks/${id}`, data)
    return response.data
  },

  async deleteWebhook(id: string) {
    await api.delete(`/merchant/webhooks/${id}`)
  },

  async testWebhook(id: string) {
    const { data } = await api.post(`/merchant/webhooks/${id}/test`)
    return data
  },

  // Settings
  async getProfile() {
    const { data } = await api.get('/merchant/profile')
    return data
  },

  async updateProfile(data: any) {
    const response = await api.put('/merchant/profile', data)
    return response.data
  },

  async getBankAccount() {
    const { data } = await api.get('/merchant/bank-account')
    return data
  },

  async updateBankAccount(data: any) {
    const response = await api.put('/merchant/bank-account', data)
    return response.data
  },

  async getNotificationSettings() {
    const { data } = await api.get('/merchant/settings/notifications')
    return data
  },

  async updateNotificationSettings(data: any) {
    const response = await api.put('/merchant/settings/notifications', data)
    return response.data
  },
}