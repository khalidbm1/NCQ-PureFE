'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Lightbulb,
  Download,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface CostSummary { // CostSummary (for cost analytics)
  total_cost: number
  total_tokens: number
  total_requests: number
  average_cost_per_request: number
  cost_trend: number // percentage change
  period: string
} // CostSummary (for cost analytics)

interface ModelCost { // ModelCost (for cost analytics)
  model_id: string
  total_cost: number
  total_tokens: number
  total_requests: number
  cost_per_token: number
  percentage_of_total: number
} // ModelCost (for cost analytics)

interface DailyCost { // DailyCost (for cost analytics)
  date: string
  cost: number
  tokens: number
  requests: number
} // DailyCost (for cost analytics)

interface CostOptimization { // CostOptimization (for cost analytics)
  recommendation: string
  potential_savings: number
  impact: 'high' | 'medium' | 'low'
  implementation: string
}  // CostOptimization (for cost analytics)

export default function CostAnalytics() { // CostAnalytics (for cost analytics)
  const [timeRange, setTimeRange] = useState('7d') // timeRange (for cost analytics)
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null) // costSummary (for cost analytics)
  const [modelCosts, setModelCosts] = useState<ModelCost[]>([]) // modelCosts (for cost analytics)
  const [dailyCosts, setDailyCosts] = useState<DailyCost[]>([]) // dailyCosts (for cost analytics)
  const [optimizations, setOptimizations] = useState<CostOptimization[]>([]) // optimizations (for cost analytics)
  const [budgetLimit, setBudgetLimit] = useState<number>(1000) // budgetLimit (for cost analytics)
  const [isLoading, setIsLoading] = useState(false) // isLoading (for cost analytics)

  useEffect(() => { // useEffect (for cost analytics)
    fetchCostData()
  }, [timeRange]) // useEffect (for cost analytics)

  const fetchCostData = async () => {
    setIsLoading(true) // setIsLoading (for cost analytics)
    try {
      // Fetch cost summary (for cost analytics)
      const summaryResponse = await fetch(`/api/analytics/cost/summary?range=${timeRange}`, { // summaryResponse (for cost analytics)
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (summaryResponse.ok) { // if (summaryResponse.ok) (for cost analytics)
        const data = await summaryResponse.json() // data (for cost analytics)
        setCostSummary(data) // setCostSummary (for cost analytics)
      }

      // Fetch model-specific costs (for cost analytics)
      const modelResponse = await fetch(`/api/analytics/cost/by-model?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (modelResponse.ok) { // if (modelResponse.ok) (for cost analytics)
        const data = await modelResponse.json() // data (for cost analytics)
        setModelCosts(data.models) // setModelCosts (for cost analytics)
      }

      // Fetch daily costs (for cost analytics)
      const dailyResponse = await fetch(`/api/analytics/cost/daily?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (dailyResponse.ok) { // if (dailyResponse.ok) (for cost analytics)
        const data = await response.json() // data (for cost analytics)
        setDailyCosts(data.daily_costs) // setDailyCosts (for cost analytics)
      }

      // Fetch optimization recommendations (for cost analytics)
      const optimizationResponse = await fetch('/api/analytics/cost/optimizations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (optimizationResponse.ok) { // if (optimizationResponse.ok) (for cost analytics)
        const data = await optimizationResponse.json() // data (for cost analytics)
        setOptimizations(data.recommendations) // setOptimizations (for cost analytics)
      }
    } catch (error) {
      console.error('Failed to fetch cost data:', error) // console.error (for cost analytics)
    } finally {
      setIsLoading(false) // setIsLoading (for cost analytics)
    }
  }

  const exportCostReport = async () => { // exportCostReport (for cost analytics)
    try { // try (for cost analytics)
      const response = await fetch(`/api/analytics/cost/export?range=${timeRange}`, { // response (for cost analytics)
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) { // if (response.ok) (for cost analytics)
        const blob = await response.blob() // blob (for cost analytics) 
        const url = window.URL.createObjectURL(blob) // url (for cost analytics)
        const a = document.createElement('a') // a (for cost analytics)
        a.href = url // a.href (for cost analytics)
        a.download = `cost-report-${timeRange}.csv` // a.download (for cost analytics)
        a.click() // a.click (for cost analytics)
      }
    } catch (error) {
      console.error('Failed to export report:', error) // console.error (for cost analytics)
    }
  }

  const formatCurrency = (amount: number) => { // formatCurrency (for cost analytics)
    return new Intl.NumberFormat('en-US', { // new Intl.NumberFormat (for cost analytics)
      style: 'currency', // style (for cost analytics)
      currency: 'USD', // currency (for cost analytics)
      minimumFractionDigits: 2, // minimumFractionDigits (for cost analytics)
      maximumFractionDigits: 2 // maximumFractionDigits (for cost analytics)
    }).format(amount) // .format (for cost analytics)
  } // formatCurrency (for cost analytics) 

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'] // COLORS (for cost analytics)

  const budgetUtilization = costSummary ? (costSummary.total_cost / budgetLimit) * 100 : 0 // budgetUtilization (for cost analytics)

  return ( // return (for cost analytics)
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cost Analytics</h2>
          <p className="text-muted-foreground">Monitor and optimize your AI usage costs</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCostReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {costSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(costSummary.total_cost)}</div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                {costSummary.cost_trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                )}
                <span className={costSummary.cost_trend > 0 ? 'text-red-500' : 'text-green-500'}>
                  {Math.abs(costSummary.cost_trend)}%
                </span>
                <span className="ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(costSummary.total_tokens / 1000000).toFixed(2)}M
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {costSummary.total_requests.toLocaleString()} requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg Cost/Request</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(costSummary.average_cost_per_request)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Per API call
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-2xl font-bold">{budgetUtilization.toFixed(1)}%</span>
                  <span className="text-muted-foreground">
                    of {formatCurrency(budgetLimit)}
                  </span>
                </div>
                <Progress value={budgetUtilization} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Cost Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Model Breakdown</TabsTrigger>
          <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Cost Trends Over Time</CardTitle>
              <CardDescription>Daily costs and cumulative spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyCosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#8884d8" 
                      fill="#8884d8"
                      name="Daily Cost"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost by Model</CardTitle>
                <CardDescription>Distribution of costs across different models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={modelCosts}
                        dataKey="total_cost"
                        nameKey="model_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.model_id}: ${entry.percentage_of_total.toFixed(1)}%`}
                      >
                        {modelCosts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Cost Comparison</CardTitle>
                <CardDescription>Cost per 1K tokens by model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modelCosts} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                      <YAxis dataKey="model_id" type="category" width={100} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="cost_per_token" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage Patterns</CardTitle>
              <CardDescription>Request volume and token usage over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyCosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="requests" 
                      stroke="#8884d8"
                      name="Requests"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="tokens" 
                      stroke="#82ca9d"
                      name="Tokens"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Optimization Recommendations</CardTitle>
                <CardDescription>
                  Actionable insights to reduce your AI costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {optimizations.length === 0 ? (
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      Your usage is already well-optimized! Keep up the good work.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {optimizations.map((opt, index) => (
                      <Alert key={index} variant={opt.impact === 'high' ? 'default' : 'secondary'}>
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="h-4 w-4" />
                              <span className="font-medium">{opt.recommendation}</span>
                              <Badge variant={
                                opt.impact === 'high' ? 'destructive' : 
                                opt.impact === 'medium' ? 'default' : 'secondary'
                              }>
                                {opt.impact} impact
                              </Badge>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              Save {formatCurrency(opt.potential_savings)}/month
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground ml-6">
                            {opt.implementation}
                          </p>
                        </div>
                      </Alert>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Saving Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Use smaller models when possible</p>
                      <p className="text-sm text-muted-foreground">
                        GPT-3.5 costs 10x less than GPT-4 for many tasks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <PieChartIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Implement caching for repeated queries</p>
                      <p className="text-sm text-muted-foreground">
                        Can reduce costs by up to 40% for common requests
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Use batch processing for non-urgent tasks</p>
                      <p className="text-sm text-muted-foreground">
                        Batch APIs often offer significant discounts
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 