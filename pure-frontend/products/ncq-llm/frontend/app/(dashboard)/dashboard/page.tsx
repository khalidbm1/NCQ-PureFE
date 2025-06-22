'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/Button'
import { ChatInterface } from '@/components/dashboard/chat-interface'
import { ApiPlayground } from '@/components/dashboard/api-playground'
import { UsageAnalytics } from '@/components/dashboard/usage-analytics'
import { KnowledgeBase } from '@/components/dashboard/knowledge-base'
import { DatabaseConnections } from '@/components/dashboard/database-connections'
import { QuickStart } from '@/components/dashboard/quick-start'
import { RecentInferences } from '@/components/dashboard/recent-inferences'
import {
  MessageSquare,
  Code,
  Database,
  BookOpen,
  BarChart3,
  Sparkles,
  FileText,
  Activity,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('chat')

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.getDashboardStats,
  })

  const { data: tenant } = useQuery({
    queryKey: ['current-tenant'],
    queryFn: api.getCurrentTenant,
  })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Documentation
          </Button>
          <Button size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_requests?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.requests_growth || 0}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.tokens_used?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.tokens_remaining?.toLocaleString() || 0} remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.kb_documents || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.kb_vectors?.toLocaleString() || 0} vectors indexed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.cache_hit_rate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              ${stats?.cost_saved?.toFixed(2) || 0} saved this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            API Playground
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="databases" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Databases
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <ChatInterface />
            </div>
            <div className="col-span-3">
              <RecentInferences />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <ApiPlayground />
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <KnowledgeBase tenantId={tenant?.id} />
        </TabsContent>

        <TabsContent value="databases" className="space-y-4">
          <DatabaseConnections tenantId={tenant?.id} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <UsageAnalytics />
        </TabsContent>
      </Tabs>

      {/* Quick Start Guide for New Users */}
      {stats?.total_requests === 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Welcome to NCQ LLM Platform!</CardTitle>
            <CardDescription>
              Get started with these quick actions to make the most of your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuickStart />
          </CardContent>
        </Card>
      )}
    </div>
  )
} 