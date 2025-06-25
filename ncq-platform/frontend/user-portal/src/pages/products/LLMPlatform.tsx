import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageSquare, 
  Zap, 
  Code,
  Database,
  BarChart3,
  Cpu
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function LLMPlatform() {
  const metrics = [
    {
      title: 'API Requests',
      value: '1.2M',
      change: '+23%',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Models Active',
      value: '8',
      change: '+2',
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avg Response Time',
      value: '120ms',
      change: '-15%',
      icon: Cpu,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Success Rate',
      value: '99.8%',
      change: '+0.2%',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LLM Platform</h1>
          <p className="text-muted-foreground">
            Large Language Model API and management platform
          </p>
        </div>
        <Button>
          <Brain className="mr-2 h-4 w-4" />
          Deploy Model
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-green-600 mt-1">{metric.change} vs last month</p>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Management</CardTitle>
            <CardDescription>Deploy and manage LLM models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <span>GPT-4 Turbo</span>
              </div>
              <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <span>Claude 3 Opus</span>
              </div>
              <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <span>Llama 2 70B</span>
              </div>
              <span className="px-2 py-1 text-xs rounded-md bg-yellow-100 text-yellow-800">Deploying</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Integration</CardTitle>
            <CardDescription>Connect and integrate with your applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Code className="h-5 w-5 text-muted-foreground" />
                <span>REST API</span>
              </div>
              <Button size="sm">Documentation</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span>WebSocket API</span>
              </div>
              <Button size="sm">Test</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <span>GraphQL API</span>
              </div>
              <Button size="sm">Explore</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}