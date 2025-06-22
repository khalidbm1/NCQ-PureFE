'use client'

import React, { useState, useEffect } from 'react'
import { useTenant } from '../../../../lib/context/tenant-context'
import { analyticsApi } from '../../../../lib/api/tenants'
import { TenantUsageAnalytics } from '../../../../lib/types'
import { Card } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Filter,
  Calendar,
  DollarSign,
  Zap,
  Users,
  Clock,
  AlertTriangle,
  Activity
} from 'lucide-react'

export default function OrganizationAnalyticsPage() {
  const { currentTenant } = useTenant()
  const [analytics, setAnalytics] = useState<TenantUsageAnalytics | null>(null)
  const [modelUsage, setModelUsage] = useState<any[]>([])
  const [costBreakdown, setCostBreakdown] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (currentTenant) {
      loadAnalytics()
    }
  }, [currentTenant, period, dateRange])

  const loadAnalytics = async () => {
    if (!currentTenant) return

    try {
      setIsLoading(true)
      const [analyticsData, modelData, costData] = await Promise.all([
        analyticsApi.getTenantAnalytics(currentTenant.id, period, dateRange.start, dateRange.end),
        analyticsApi.getModelUsage(currentTenant.id, period),
        analyticsApi.getCostBreakdown(currentTenant.id, period)
      ])
      setAnalytics(analyticsData)
      setModelUsage(modelData)
      setCostBreakdown(costData)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async (format: 'csv' | 'json' | 'pdf') => {
    if (!currentTenant) return

    try {
      const blob = await analyticsApi.exportUsageData(
        currentTenant.id,
        format,
        dateRange.start,
        dateRange.end
      )
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `analytics-${currentTenant.slug}-${dateRange.start}-${dateRange.end}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4" />
    if (trend < 0) return <TrendingDown className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">Unable to load analytics data for this organization.</p>
        </Card>
      </div>
    )
  }

  // Calculate previous period data for trends
  const currentPeriodData = analytics.data.slice(-7)
  const previousPeriodData = analytics.data.slice(-14, -7)
  
  const currentRequests = currentPeriodData.reduce((sum, day) => sum + day.requests, 0)
  const previousRequests = previousPeriodData.reduce((sum, day) => sum + day.requests, 0)
  const requestsTrend = calculateTrend(currentRequests, previousRequests)

  const currentCost = currentPeriodData.reduce((sum, day) => sum + day.cost, 0)
  const previousCost = previousPeriodData.reduce((sum, day) => sum + day.cost, 0)
  const costTrend = calculateTrend(currentCost, previousCost)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Usage</h1>
            <p className="text-gray-600">Monitor your organization's API usage and performance.</p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <Button
              variant="outline"
              onClick={() => handleExportData('csv')}
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics.summary.totalRequests)}
              </p>
              <div className={`flex items-center mt-1 ${getTrendColor(requestsTrend)}`}>
                {getTrendIcon(requestsTrend)}
                <span className="text-sm ml-1">
                  {requestsTrend > 0 ? '+' : ''}{requestsTrend.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tokens</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics.summary.totalTokens)}
              </p>
              <div className="flex items-center mt-1 text-gray-600">
                <Activity className="h-4 w-4" />
                <span className="text-sm ml-1">
                  {formatNumber(analytics.summary.totalTokens / analytics.summary.totalRequests || 0)} avg/req
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.summary.totalCost)}
              </p>
              <div className={`flex items-center mt-1 ${getTrendColor(costTrend)}`}>
                {getTrendIcon(costTrend)}
                <span className="text-sm ml-1">
                  {costTrend > 0 ? '+' : ''}{costTrend.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.summary.avgResponseTime.toFixed(0)}ms
              </p>
              <div className="flex items-center mt-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm ml-1">
                  {analytics.summary.errorRate.toFixed(1)}% error rate
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Usage Trend Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Usage Trend</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.data.slice(-14).map((day, index) => {
              const maxRequests = Math.max(...analytics.data.map(d => d.requests))
              const width = maxRequests > 0 ? (day.requests / maxRequests) * 100 : 0
              
              return (
                <div key={day.date} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 w-32">
                    <span className="text-sm text-gray-600 w-16">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 w-32 justify-end">
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(day.requests)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatCurrency(day.cost)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Model Usage */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Models</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {modelUsage.slice(0, 8).map((model, index) => {
              const maxUsage = Math.max(...modelUsage.map(m => m.requests))
              const width = maxUsage > 0 ? (model.requests / maxUsage) * 100 : 0
              
              return (
                <div key={model.modelId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 w-40">
                    <span className="text-sm font-medium text-gray-900 w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-gray-600 truncate">
                      {model.modelName}
                    </span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 w-24 justify-end">
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(model.requests)}
                    </span>
                    <div className={`flex items-center ${getTrendColor(model.trend)}`}>
                      {getTrendIcon(model.trend)}
                      <span className="text-xs ml-1">
                        {model.trend > 0 ? '+' : ''}{model.trend.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Cost Breakdown */}
      {costBreakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost by Model */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cost by Model</h3>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {costBreakdown.byModel.slice(0, 6).map((model: any, index: number) => (
                <div key={model.modelId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">
                      {model.modelName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {model.percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(model.cost)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Cost by User */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cost by User</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {costBreakdown.byUser.slice(0, 6).map((user: any, index: number) => (
                <div key={user.userId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {user.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {user.userName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {user.percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(user.cost)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Export Options */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => handleExportData('csv')}
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export as CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExportData('json')}
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export as JSON
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExportData('pdf')}
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </Card>
    </div>
  )
}