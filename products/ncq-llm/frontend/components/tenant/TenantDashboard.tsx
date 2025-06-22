'use client'

import React, { useEffect, useState } from 'react'
import { useTenant } from '../../lib/context/tenant-context'
import { analyticsApi } from '../../lib/api/tenants'
import { TenantUsageAnalytics } from '../../lib/types'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { 
  BarChart3, 
  Users, 
  Zap, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react'

interface TenantDashboardProps {
  className?: string
}

export function TenantDashboard({ className = '' }: TenantDashboardProps) {
  const { currentTenant, currentMember } = useTenant()
  const [analytics, setAnalytics] = useState<TenantUsageAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  useEffect(() => {
    if (currentTenant) {
      loadAnalytics()
    }
  }, [currentTenant, period])

  const loadAnalytics = async () => {
    if (!currentTenant) return

    try {
      setIsLoading(true)
      const data = await analyticsApi.getTenantAnalytics(currentTenant.id, period)
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getQuotaUsagePercentage = (used: number, limit: number) => {
    return limit > 0 ? (used / limit) * 100 : 0
  }

  const getQuotaStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'bg-red-500', status: 'critical' }
    if (percentage >= 75) return { color: 'bg-yellow-500', status: 'warning' }
    return { color: 'bg-green-500', status: 'good' }
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

  if (!currentTenant) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Organization Selected</h3>
        <p className="text-gray-600">Please select an organization to view the dashboard.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentTenant.name} Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {currentMember?.role} • {currentTenant.subscription.plan} plan
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="daily">Last 30 Days</option>
            <option value="weekly">Last 12 Weeks</option>
            <option value="monthly">Last 12 Months</option>
          </select>
          <Button
            onClick={loadAnalytics}
            disabled={isLoading}
            size="sm"
          >
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Subscription Status */}
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-lg ${
                currentTenant.subscription.status === 'active' ? 'bg-green-100' :
                currentTenant.subscription.status === 'trialing' ? 'bg-blue-100' :
                'bg-red-100'
              }`}>
                <CheckCircle className={`h-6 w-6 ${
                  currentTenant.subscription.status === 'active' ? 'text-green-600' :
                  currentTenant.subscription.status === 'trialing' ? 'text-blue-600' :
                  'text-red-600'
                }`} />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Subscription</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {currentTenant.subscription.status}
              </p>
              <p className="text-sm text-gray-600 capitalize">
                {currentTenant.subscription.plan} Plan
              </p>
            </div>
          </div>
        </Card>

        {/* Total Requests */}
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Requests</p>
              <p className="text-lg font-semibold text-gray-900">
                {analytics ? formatNumber(analytics.summary.totalRequests) : '-'}
              </p>
              {analytics && (
                <p className="text-sm text-gray-600">
                  {formatNumber(analytics.summary.totalTokens)} tokens
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Total Cost */}
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Cost</p>
              <p className="text-lg font-semibold text-gray-900">
                {analytics ? formatCurrency(analytics.summary.totalCost) : '-'}
              </p>
              {analytics && (
                <p className="text-sm text-gray-600">
                  Avg: {formatCurrency(analytics.summary.avgResponseTime)}ms
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Team Members */}
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Team Members</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentTenant.quotas.members.used} / {currentTenant.quotas.members.limit}
              </p>
              <p className="text-sm text-gray-600">
                {currentTenant.members.filter(m => m.status === 'active').length} active
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quota Usage */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quota Usage</h3>
        <div className="space-y-4">
          {/* Requests Quota */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">API Requests</span>
              <span className="text-sm text-gray-600">
                {formatNumber(currentTenant.quotas.requests.used)} / {formatNumber(currentTenant.quotas.requests.limit)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getQuotaStatus(getQuotaUsagePercentage(
                  currentTenant.quotas.requests.used,
                  currentTenant.quotas.requests.limit
                )).color}`}
                style={{
                  width: `${Math.min(getQuotaUsagePercentage(
                    currentTenant.quotas.requests.used,
                    currentTenant.quotas.requests.limit
                  ), 100)}%`
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Resets on {new Date(currentTenant.quotas.requests.resetDate).toLocaleDateString()}
            </p>
          </div>

          {/* Tokens Quota */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Tokens</span>
              <span className="text-sm text-gray-600">
                {formatNumber(currentTenant.quotas.tokens.used)} / {formatNumber(currentTenant.quotas.tokens.limit)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getQuotaStatus(getQuotaUsagePercentage(
                  currentTenant.quotas.tokens.used,
                  currentTenant.quotas.tokens.limit
                )).color}`}
                style={{
                  width: `${Math.min(getQuotaUsagePercentage(
                    currentTenant.quotas.tokens.used,
                    currentTenant.quotas.tokens.limit
                  ), 100)}%`
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Resets on {new Date(currentTenant.quotas.tokens.resetDate).toLocaleDateString()}
            </p>
          </div>

          {/* Storage Quota */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Storage</span>
              <span className="text-sm text-gray-600">
                {(currentTenant.quotas.storage.used / (1024 * 1024 * 1024)).toFixed(2)} GB / {(currentTenant.quotas.storage.limit / (1024 * 1024 * 1024)).toFixed(0)} GB
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getQuotaStatus(getQuotaUsagePercentage(
                  currentTenant.quotas.storage.used,
                  currentTenant.quotas.storage.limit
                )).color}`}
                style={{
                  width: `${Math.min(getQuotaUsagePercentage(
                    currentTenant.quotas.storage.used,
                    currentTenant.quotas.storage.limit
                  ), 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Charts */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Usage Trend</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.data.slice(-7).map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">
                      {formatNumber(day.requests)} requests
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatCurrency(day.cost)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Models */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Models</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.data[analytics.data.length - 1]?.topModels.slice(0, 5).map((model, index) => (
                <div key={model.modelId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-gray-600">
                      {model.modelName}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatNumber(model.usage)}
                    </p>
                    <p className="text-xs text-gray-500">requests</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/dashboard/organization/members'}
            className="justify-start"
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Team
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/dashboard/organization/analytics'}
            className="justify-start"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/dashboard/organization/billing'}
            className="justify-start"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Billing & Usage
          </Button>
        </div>
      </Card>
    </div>
  )
}