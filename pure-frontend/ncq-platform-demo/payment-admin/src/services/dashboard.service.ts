import { api } from '@/lib/api'

export const dashboardService = {
  async getMetrics(dateRange: string) {
    const { data } = await api.get('/dashboard/metrics', {
      params: { dateRange },
    })
    return data
  },

  async getAlerts() {
    const { data } = await api.get('/dashboard/alerts')
    return data
  },

  async getTransactionChartData(dateRange: string) {
    const { data } = await api.get('/dashboard/charts/transactions', {
      params: { dateRange },
    })
    return data
  },

  async getRevenueChartData(dateRange: string, view: string) {
    const { data } = await api.get('/dashboard/charts/revenue', {
      params: { dateRange, view },
    })
    return data
  },

  async getProcessorStatus() {
    const { data } = await api.get('/dashboard/processors/status')
    return data
  },

  async getRecentTransactions() {
    const { data } = await api.get('/dashboard/transactions/recent')
    return data
  },

  async getComplianceStatus() {
    const { data } = await api.get('/dashboard/compliance/status')
    return data
  },

  async getSystemHealth() {
    const { data } = await api.get('/dashboard/system/health')
    return data
  },

  async exportReport(dateRange: string) {
    const response = await api.get('/dashboard/export', {
      params: { dateRange },
      responseType: 'blob',
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `ncq-payment-report-${dateRange}-${Date.now()}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}