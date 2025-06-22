'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Play, Pause, X, Download, RefreshCw } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface FineTuningJob {
  job_id: string
  base_model_id: string
  status: string
  progress: number
  created_at: string
  completed_at?: string
  metrics?: {
    train_loss?: number
    train_runtime?: number
    total_steps?: number
  }
  error?: string
}

export default function FineTuningInterface() {
  const [jobs, setJobs] = useState<FineTuningJob[]>([])
  const [baseModels, setBaseModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [trainingData, setTrainingData] = useState('')
  const [jobName, setJobName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState('create')
  const { toast } = useToast()

  // Simulated config options (for fine-tuning)
  const [config, setConfig] = useState({
    epochs: 3,
    batch_size: 4,
    learning_rate: 5e-5,
    warmup_steps: 100
  })

  useEffect(() => {
    fetchJobs()
    fetchBaseModels()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/fine-tuning/jobs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    }
  }

  const fetchBaseModels = async () => {
    try {
      const response = await fetch('/api/models/available', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setBaseModels(data.models.filter((m: any) => m.status === 'ready').map((m: any) => m.model_id))
      }
    } catch (error) {
      console.error('Failed to fetch models:', error)
    }
  }

  const handleCreateJob = async () => {
    if (!selectedModel || !trainingData.trim()) {
      toast({
        title: 'Error',
        description: 'Please select a model and provide training data',
        variant: 'destructive'
      })
      return
    }

    setIsCreating(true)
    try {
      // Parse training data (for fine-tuning)
      const lines = trainingData.trim().split('\n')
      const trainingItems = lines.map(line => {
        try {
          return JSON.parse(line)
        } catch {
          // If not JSON, assume it's a simple text format (for fine-tuning)
          const [instruction, response] = line.split('|||')
          return { instruction: instruction?.trim(), response: response?.trim() }
        }
      }).filter(item => item.instruction && item.response)

      const response = await fetch('/api/fine-tuning/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          base_model_id: selectedModel,
          training_data: trainingItems,
          config: config
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Success',
          description: 'Fine-tuning job created successfully'
        })
        setTrainingData('')
        setJobName('')
        fetchJobs()
        setActiveTab('jobs')
      } else {
        throw new Error('Failed to create job')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create fine-tuning job',
        variant: 'destructive'
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleCancelJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/fine-tuning/jobs/${jobId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Job cancelled successfully'
        })
        fetchJobs()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel job',
        variant: 'destructive'
      })
    }
  }

  const handleExportModel = async (jobId: string) => {
    try {
      const response = await fetch(`/api/fine-tuning/jobs/${jobId}/export`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Success',
          description: `Model exported: ${data.path}`
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export model',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => { // getStatusBadge (for fine-tuning)    
    const statusConfig = { // statusConfig (for fine-tuning)
      pending: { variant: 'secondary' as const, label: 'Pending' },
      running: { variant: 'default' as const, label: 'Running' },
      completed: { variant: 'success' as const, label: 'Completed' },
      failed: { variant: 'destructive' as const, label: 'Failed' },
      cancelled: { variant: 'outline' as const, label: 'Cancelled' }
    } 

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  } // getStatusBadge (for fine-tuning)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Model Fine-Tuning</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create New Job</TabsTrigger>
            <TabsTrigger value="jobs">My Jobs ({jobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="base-model">Base Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="base-model">
                    <SelectValue placeholder="Select a base model" />
                  </SelectTrigger>
                  <SelectContent>
                    {baseModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="training-data">Training Data</Label>
                <Textarea
                  id="training-data"
                  placeholder="Enter training data in JSONL format or instruction|||response format..."
                  value={trainingData}
                  onChange={(e) => setTrainingData(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Format: {"{"}"instruction": "...", "response": "..."{"}"} or instruction|||response
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="epochs">Epochs</Label>
                  <Input
                    id="epochs"
                    type="number"
                    value={config.epochs}
                    onChange={(e) => setConfig({...config, epochs: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="batch-size">Batch Size</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    value={config.batch_size}
                    onChange={(e) => setConfig({...config, batch_size: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="learning-rate">Learning Rate</Label>
                  <Input
                    id="learning-rate"
                    type="number"
                    step="0.00001"
                    value={config.learning_rate}
                    onChange={(e) => setConfig({...config, learning_rate: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="warmup-steps">Warmup Steps</Label>
                  <Input
                    id="warmup-steps"
                    type="number"
                    value={config.warmup_steps}
                    onChange={(e) => setConfig({...config, warmup_steps: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <Button
                onClick={handleCreateJob}
                disabled={isCreating || !selectedModel || !trainingData.trim()}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creating Job...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Fine-Tuning
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            {jobs.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No fine-tuning jobs found. Create one to get started.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.job_id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{job.job_id}</h4>
                          {getStatusBadge(job.status)}
                        </div>
                        <div className="flex gap-2">
                          {job.status === 'running' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelJob(job.job_id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          {job.status === 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExportModel(job.job_id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground mb-2">
                        Base Model: {job.base_model_id}
                      </div>

                      {job.status === 'running' && (
                        <div className="space-y-2">
                          <Progress value={job.progress} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            Progress: {job.progress.toFixed(1)}%
                          </p>
                        </div>
                      )}

                      {job.metrics && (
                        <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Loss:</span>{' '}
                            {job.metrics.train_loss?.toFixed(4)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Runtime:</span>{' '}
                            {job.metrics.train_runtime?.toFixed(1)}s
                          </div>
                          <div>
                            <span className="text-muted-foreground">Steps:</span>{' '}
                            {job.metrics.total_steps}
                          </div>
                        </div>
                      )}

                      {job.error && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertDescription>{job.error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="mt-2 text-xs text-muted-foreground">
                        Created: {new Date(job.created_at).toLocaleString()}
                        {job.completed_at && (
                          <> • Completed: {new Date(job.completed_at).toLocaleString()}</>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 