'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Bell
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface ModelHealth {
  model_id: string
  health_score: number
  status: string
  components: {
    latency?: number
    errors?: number
    availability?: number
  }
  active_alerts: number
  last_updated: string
}

interface PerformanceMetric {
  timestamp: string
  avg_latency: number
  error_rate: number
  requests_per_minute: number
  tokens_per_second: number
}

interface Alert {
  alert_id: string
  model_id: string
  severity: string
  message: string
  created_at: string
  acknowledged: boolean
  status: string
}

export default function PerformanceMonitoring() {
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [models, setModels] = useState<string[]>([])
  const [healthData, setHealthData] = useState<Record<string, ModelHealth>>({})
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [timeRange, setTimeRange] = useState('1h')

  useEffect(() => {
    fetchModels()
    fetchAlerts()
  }, [])

  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0])
    }
  }, [models])

  useEffect(() => {
    if (selectedModel) {
      fetchHealthData(selectedModel)
      fetchMetrics(selectedModel)
    }
  }, [selectedModel, timeRange])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      if (selectedModel) {
        fetchHealthData(selectedModel)
        fetchMetrics(selectedModel)
      }
      fetchAlerts()
    }, 30000) // Refresh every 30 seconds (for performance monitoring)

    return () => clearInterval(interval)
  }, [autoRefresh, selectedModel])

  const fetchModels = async () => { // fetchModels (for performance monitoring)
    try {
      const response = await fetch('/api/models/list', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setModels(data.models.map((m: any) => m.model_id))
      }
    } catch (error) {
      console.error('Failed to fetch models:', error)
    }
  } // fetchModels (for performance monitoring)

  const fetchHealthData = async (modelId: string) => { // fetchHealthData (for performance monitoring)
    try {
      const response = await fetch(`/api/monitoring/health/${modelId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setHealthData(prev => ({ ...prev, [modelId]: data }))
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error)
    }
  } // fetchHealthData (for performance monitoring)

  const fetchMetrics = async (modelId: string) => { // fetchMetrics (for performance monitoring)
    setIsLoading(true)
    try {
      const response = await fetch(`/api/monitoring/metrics/${modelId}?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics)
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setIsLoading(false)
    }
  } // fetchMetrics (for performance monitoring)

  const fetchAlerts = async () => { // fetchAlerts (for performance monitoring)
    try {
      const response = await fetch('/api/monitoring/alerts?status=active', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts)
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  } // fetchAlerts (for performance monitoring)

  const acknowledgeAlert = async (alertId: string) => { // acknowledgeAlert (for performance monitoring)
    try {
      const response = await fetch(`/api/monitoring/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        fetchAlerts()
      }
    } catch (error) {
      console.error('Failed to acknowledge alert:', error)
    }
  } // acknowledgeAlert (for performance monitoring)

  const getHealthIcon = (status: string) => { // getHealthIcon (for performance monitoring)
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  } // getHealthIcon (for performance monitoring)

  const getSeverityBadge = (severity: string) => { // getSeverityBadge (for performance monitoring)
    const variants: Record<string, any> = {
      'info': 'secondary',
      'warning': 'outline',
      'error': 'destructive',
      'critical': 'destructive'
    }
    return <Badge variant={variants[severity] || 'secondary'}>{severity}</Badge>
  } // getSeverityBadge (for performance monitoring)

  const currentHealth = selectedModel ? healthData[selectedModel] : null // currentHealth (for performance monitoring)

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
        </div>
      </div>

      {/* Health Overview (for performance monitoring) */}
      {currentHealth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Model Health</span>
              {getHealthIcon(currentHealth.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{currentHealth.health_score}%</span>
                <Badge variant={currentHealth.status === 'healthy' ? 'default' : 'destructive'}>
                  {currentHealth.status}
                </Badge>
              </div>

              <Progress value={currentHealth.health_score} className="h-3" />

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Latency</p>
                  <p className="text-xl font-semibold">
                    {currentHealth.components.latency || 0}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                  <p className="text-xl font-semibold">
                    {currentHealth.components.errors || 0}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <p className="text-xl font-semibold">
                    {currentHealth.components.availability || 0}%
                  </p>
                </div>
              </div>

              {currentHealth.active_alerts > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Active Alerts</AlertTitle>
                  <AlertDescription>
                    {currentHealth.active_alerts} active alert{currentHealth.active_alerts > 1 ? 's' : ''} for this model
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Tabs (for performance monitoring) */}
      <Tabs defaultValue="latency" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="latency">Latency</TabsTrigger>
          <TabsTrigger value="throughput">Throughput</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="latency">
          <Card>
            <CardHeader>
              <CardTitle>Response Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="avg_latency" 
                        stroke="#8884d8" 
                        name="Average Latency (ms)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="throughput">
          <Card>
            <CardHeader>
              <CardTitle>Request Throughput</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="requests_per_minute" 
                      stroke="#82ca9d" 
                      fill="#82ca9d"
                      name="Requests/min"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tokens_per_second" 
                      stroke="#ffc658" 
                      fill="#ffc658"
                      name="Tokens/sec"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Error Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                    />
                    <Legend />
                    <Bar 
                      dataKey="error_rate" 
                      fill="#ff6b6b"
                      name="Error Rate (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No active alerts. All systems operational.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <Alert key={alert.alert_id} variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Bell className="h-4 w-4" />
                            {getSeverityBadge(alert.severity)}
                            <span className="text-sm text-muted-foreground">
                              {alert.model_id}
                            </span>
                          </div>
                          <AlertDescription>{alert.message}</AlertDescription>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(alert.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.alert_id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 