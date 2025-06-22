import api from './api'
import { UsageData, UsageMetrics, UsagePeriod } from '../types'

class UsageService {
  async getCurrentUsage(): Promise<UsageData> {
    return api.get<UsageData>('/billing/usage/current')
  }

  async getUsageHistory(period: UsagePeriod): Promise<UsageMetrics[]> {
    return api.post<UsageMetrics[]>('/billing/usage/history', period)
  }

  async getUsageByCategory(category: string, period: UsagePeriod): Promise<UsageMetrics[]> {
    return api.post<UsageMetrics[]>(`/billing/usage/category/${category}`, period)
  }

  async getUsageAlerts(): Promise<Array<{
    id: string
    metric: string
    threshold: number
    currentValue: number
    isActive: boolean
    createdAt: string
  }>> {
    return api.get('/billing/usage/alerts')
  }

  async updateUsageAlert(id: string, threshold: number): Promise<void> {
    return api.patch(`/billing/usage/alerts/${id}`, { threshold })
  }

  async createUsageAlert(metric: string, threshold: number): Promise<void> {
    return api.post('/billing/usage/alerts', { metric, threshold })
  }

  async deleteUsageAlert(id: string): Promise<void> {
    return api.delete(`/billing/usage/alerts/${id}`)
  }

  async exportUsageData(period: UsagePeriod): Promise<void> {
    const params = new URLSearchParams({
      start: period.start,
      end: period.end,
      granularity: period.granularity,
    })
    
    await api.download(
      `/billing/usage/export?${params.toString()}`,
      `usage-report-${period.start}-${period.end}.csv`
    )
  }

  async getUsageProjection(): Promise<{
    projectedUsage: Record<string, number>
    projectedCost: number
    confidence: number
    basedOnDays: number
  }> {
    return api.get('/billing/usage/projection')
  }
}

export default new UsageService()