'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  Calendar, 
  Download, 
  TrendingUp, 
  Clock,
  Zap,
  Database
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/useTranslation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatNumber, formatBytes } from '@/lib/utils'

export default function UsagePage() {
  const { t, language } = useI18n()
  const isRTL = language === 'ar'
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  
  // Mock data - would come from API
  const usageData = {
    summary: {
      requests: 45234,
      tokens: 2456789,
      storage: 1024 * 1024 * 850, // 850MB
      cost: 127.43
    },
    limits: {
      requests: 100000,
      tokens: 10000000,
      storage: 1024 * 1024 * 1024 * 5, // 5GB
    },
    dailyUsage: [
      { date: '2025-05-25', requests: 1543, tokens: 87654, cost: 4.32 },
      { date: '2025-05-26', requests: 1876, tokens: 98765, cost: 5.21 },
      { date: '2025-05-27', requests: 2103, tokens: 123456, cost: 6.78 },
      { date: '2025-05-28', requests: 1654, tokens: 76543, cost: 3.98 },
      { date: '2025-05-29', requests: 1987, tokens: 109876, cost: 5.67 },
      { date: '2025-05-30', requests: 2234, tokens: 134567, cost: 7.12 },
      { date: '2025-05-31', requests: 1456, tokens: 65432, cost: 3.21 },
    ],
    byModel: [
      { name: 'LLaMA 2', requests: 15234, tokens: 876543, cost: 43.21 },
      { name: 'Falcon', requests: 12456, tokens: 654321, cost: 32.10 },
      { name: 'BLOOM', requests: 8765, tokens: 432109, cost: 21.54 },
      { name: 'Whisper', requests: 5432, tokens: 234567, cost: 15.43 },
      { name: 'Stable Diffusion', requests: 3347, tokens: 265432, cost: 15.15 },
    ]
  }
  
  const periods = [
    { value: 'day', label: t('dashboard.usage.periods.day') },
    { value: 'week', label: t('dashboard.usage.periods.week') },
    { value: 'month', label: t('dashboard.usage.periods.month') },
    { value: 'year', label: t('dashboard.usage.periods.year') },
  ]
  
  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.usage.title')}</h1>
          <p className="text-gray-600 mt-1">{t('dashboard.usage.subtitle')}</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex bg-white rounded-lg shadow-sm border p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                  selectedPeriod === period.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t('dashboard.usage.export')}
          </Button>
        </div>
      </div>
      
      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('dashboard.usage.metrics.requests')}
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(usageData.summary.requests)}</div>
            <p className="text-xs text-gray-500 mt-1">
              {formatNumber(usageData.limits.requests - usageData.summary.requests)} {t('dashboard.usage.remaining')}
            </p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(usageData.summary.requests / usageData.limits.requests) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('dashboard.usage.metrics.tokens')}
              </CardTitle>
              <Zap className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(usageData.summary.tokens)}</div>
            <p className="text-xs text-gray-500 mt-1">
              {formatNumber(usageData.limits.tokens - usageData.summary.tokens)} {t('dashboard.usage.remaining')}
            </p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(usageData.summary.tokens / usageData.limits.tokens) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('dashboard.usage.metrics.storage')}
              </CardTitle>
              <Database className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(usageData.summary.storage)}</div>
            <p className="text-xs text-gray-500 mt-1">
              {formatBytes(usageData.limits.storage - usageData.summary.storage)} {t('dashboard.usage.remaining')}
            </p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(usageData.summary.storage / usageData.limits.storage) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('dashboard.usage.metrics.cost')}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${usageData.summary.cost.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">
              {t('dashboard.usage.thisMonth')}
            </p>
            <div className="mt-3 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">12.5%</span>
              <span className="text-gray-500 ml-1">{t('dashboard.usage.vsLastMonth')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Usage by Model */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('dashboard.usage.byModel.title')}</CardTitle>
          <CardDescription>{t('dashboard.usage.byModel.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageData.byModel.map((model, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{model.name}</span>
                    <span className="text-sm text-gray-500">
                      {formatNumber(model.requests)} requests • ${model.cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(model.tokens / usageData.summary.tokens) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Daily Usage Chart (Simplified) */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.usage.dailyUsage.title')}</CardTitle>
          <CardDescription>{t('dashboard.usage.dailyUsage.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usageData.dailyUsage.map((day, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{day.date}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-600">{formatNumber(day.requests)} requests</span>
                  <span className="text-gray-600">{formatNumber(day.tokens)} tokens</span>
                  <span className="font-medium">${day.cost.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}