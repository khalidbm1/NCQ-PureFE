import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Brain,
  MessageSquare,
  Zap,
  Code,
  Database,
  BarChart3,
  Cpu,
  HardDrive,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Key,
  Lock,
  Shield,
  Cloud,
  Server,
  Terminal,
  Play,
  Pause,
  Square,
  RefreshCw,
  Download,
  Upload,
  Copy,
  Share2,
  Settings,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Plus,
  Minus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GitBranch,
  GitCommit,
  GitMerge,
  Layers,
  Package,
  Sparkles,
  Star,
  Gauge,
  Timer,
  Wallet,
  CreditCard,
  Receipt,
  FileCode,
  FileJson,
  Braces,
  Brackets,
  Variable,
  Function,
  Hash,
  Type,
  Binary,
  Bot,
  Mic,
  Volume2,
  Headphones,
  Image,
  Video,
  Music,
  File,
  Folder,
  Archive,
  Save,
  Send,
  Mail,
  Bell,
  BellOff,
  User,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Globe,
  Map,
  Navigation,
  Compass,
  Target,
  Crosshair,
  Move,
  Maximize2,
  Minimize2,
  Expand,
  Shrink,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for models
const mockModels = [
  { 
    id: 'MODEL001', 
    name: 'GPT-4 Turbo', 
    provider: 'OpenAI', 
    version: '1.0.0', 
    status: 'active', 
    requests: 456789, 
    avgLatency: 120, 
    costPerToken: 0.03,
    parameters: '175B',
    type: 'text',
    capabilities: ['Chat', 'Completion', 'Code', 'Analysis'],
    performance: { accuracy: 94.5, speed: 92, reliability: 99.8 }
  },
  { 
    id: 'MODEL002', 
    name: 'Claude 3 Opus', 
    provider: 'Anthropic', 
    version: '3.0.0', 
    status: 'active', 
    requests: 234567, 
    avgLatency: 150, 
    costPerToken: 0.025,
    parameters: '200B',
    type: 'text',
    capabilities: ['Chat', 'Analysis', 'Research', 'Code'],
    performance: { accuracy: 95.2, speed: 88, reliability: 99.9 }
  },
  { 
    id: 'MODEL003', 
    name: 'Llama 2 70B', 
    provider: 'Meta', 
    version: '2.0.0', 
    status: 'deploying', 
    requests: 0, 
    avgLatency: 0, 
    costPerToken: 0.01,
    parameters: '70B',
    type: 'text',
    capabilities: ['Chat', 'Completion'],
    performance: { accuracy: 91.3, speed: 85, reliability: 98.5 }
  },
  { 
    id: 'MODEL004', 
    name: 'DALL-E 3', 
    provider: 'OpenAI', 
    version: '3.0.0', 
    status: 'active', 
    requests: 123456, 
    avgLatency: 3500, 
    costPerToken: 0.04,
    parameters: '12B',
    type: 'image',
    capabilities: ['Image Generation', 'Image Editing'],
    performance: { accuracy: 93.8, speed: 75, reliability: 99.2 }
  },
  { 
    id: 'MODEL005', 
    name: 'Whisper Large', 
    provider: 'OpenAI', 
    version: '1.0.0', 
    status: 'maintenance', 
    requests: 67890, 
    avgLatency: 800, 
    costPerToken: 0.02,
    parameters: '1.5B',
    type: 'audio',
    capabilities: ['Speech-to-Text', 'Translation'],
    performance: { accuracy: 92.1, speed: 90, reliability: 98.9 }
  }
];

// Mock API endpoints
const mockEndpoints = [
  { name: '/v1/chat/completions', method: 'POST', latency: '~150ms', requests: '1.2M/day' },
  { name: '/v1/embeddings', method: 'POST', latency: '~50ms', requests: '800K/day' },
  { name: '/v1/images/generations', method: 'POST', latency: '~3s', requests: '150K/day' },
  { name: '/v1/audio/transcriptions', method: 'POST', latency: '~800ms', requests: '200K/day' },
  { name: '/v1/fine-tuning/jobs', method: 'POST', latency: '~200ms', requests: '5K/day' }
];

export default function LLMPlatformEnhanced() {
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [apiPlaygroundCode, setApiPlaygroundCode] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [activeTab, setActiveTab] = useState('models');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);

  // Usage metrics data
  const usageData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'API Requests',
        data: [145000, 162000, 178000, 195000, 189000, 156000, 142000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Tokens Processed',
        data: [2100000, 2450000, 2890000, 3200000, 3100000, 2500000, 2200000],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  // Cost breakdown data
  const costData = {
    labels: ['GPT-4 Turbo', 'Claude 3', 'DALL-E 3', 'Whisper', 'Llama 2'],
    datasets: [{
      data: [4567, 2345, 1234, 678, 456],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 146, 60, 0.8)'
      ]
    }]
  };

  // Performance metrics data
  const performanceData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
      {
        label: 'Latency (ms)',
        data: [120, 125, 145, 180, 165, 135, 125],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: 'Success Rate (%)',
        data: [99.8, 99.7, 99.5, 99.2, 99.4, 99.7, 99.8],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400';
      case 'deploying': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-5 w-5" />;
      case 'image': return <Image className="h-5 w-5" />;
      case 'audio': return <Headphones className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const runApiPlayground = () => {
    // Simulate API response
    setApiResponse(JSON.stringify({
      id: "chatcmpl-123",
      object: "chat.completion",
      created: Date.now(),
      model: "gpt-4-turbo",
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: "Hello! I'm an AI assistant. How can I help you today?"
        },
        finish_reason: "stop"
      }],
      usage: {
        prompt_tokens: 12,
        completion_tokens: 15,
        total_tokens: 27
      }
    }, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              LLM Platform
            </h1>
            <p className="text-muted-foreground mt-2">
              Deploy and manage large language models at scale
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Key className="mr-2 h-4 w-4" />
              API Keys
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Deploy Model
            </Button>
          </div>
        </motion.div>

        {/* Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Requests</p>
                  <p className="text-3xl font-bold">1.2M</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +23% this week
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Models</p>
                  <p className="text-3xl font-bold">8</p>
                  <Progress value={80} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">80% capacity</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="text-3xl font-bold">120ms</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400">
                      <TrendingDown className="mr-1 h-3 w-3" />
                      -15% faster
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <Timer className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Cost</p>
                  <p className="text-3xl font-bold">$8,745</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <DollarSign className="mr-1 h-3 w-3" />
                      Within budget
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="playground">API Playground</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="fine-tuning">Fine-tuning</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {/* Models Tab */}
            <TabsContent value="models" className="space-y-4">
              <Card className="glass border-0">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search models..." className="pl-10" />
                      </div>
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="text">Text Models</SelectItem>
                        <SelectItem value="image">Image Models</SelectItem>
                        <SelectItem value="audio">Audio Models</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      More Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Models Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockModels.map((model, index) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                          onClick={() => setSelectedModel(model)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                              {getModelIcon(model.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{model.name}</h3>
                                <Badge className={getStatusColor(model.status)}>
                                  {model.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{model.provider} • {model.parameters}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {model.capabilities.map((cap) => (
                                  <Badge key={cap} variant="secondary" className="text-xs">
                                    {cap}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                        {/* Model Metrics */}
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                          <div>
                            <p className="text-xs text-muted-foreground">Requests</p>
                            <p className="font-semibold">{(model.requests / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Latency</p>
                            <p className="font-semibold">{model.avgLatency}ms</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">$/1K tokens</p>
                            <p className="font-semibold">${model.costPerToken}</p>
                          </div>
                        </div>
                        {/* Performance Bars */}
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-20">Accuracy</span>
                            <Progress value={model.performance.accuracy} className="flex-1 h-2" />
                            <span className="text-xs font-medium">{model.performance.accuracy}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-20">Speed</span>
                            <Progress value={model.performance.speed} className="flex-1 h-2" />
                            <span className="text-xs font-medium">{model.performance.speed}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* API Playground Tab */}
            <TabsContent value="playground" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Request Builder */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Request Builder</CardTitle>
                    <CardDescription>Test API endpoints with custom parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Select defaultValue="gpt-4-turbo">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                          <SelectItem value="claude-3">Claude 3 Opus</SelectItem>
                          <SelectItem value="llama-2">Llama 2 70B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>System Message</Label>
                      <Textarea 
                        placeholder="You are a helpful assistant..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>User Message</Label>
                      <Textarea 
                        placeholder="Hello, can you help me with..."
                        className="min-h-[150px]"
                        value={apiPlaygroundCode}
                        onChange={(e) => setApiPlaygroundCode(e.target.value)}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Temperature</Label>
                          <span className="text-sm text-muted-foreground">{temperature[0]}</span>
                        </div>
                        <Slider 
                          value={temperature} 
                          onValueChange={setTemperature}
                          min={0}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Max Tokens</Label>
                          <span className="text-sm text-muted-foreground">{maxTokens[0]}</span>
                        </div>
                        <Slider 
                          value={maxTokens} 
                          onValueChange={setMaxTokens}
                          min={1}
                          max={4096}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <Button onClick={runApiPlayground} className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Run Request
                    </Button>
                  </CardContent>
                </Card>

                {/* Response Viewer */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Response</CardTitle>
                    <CardDescription>API response will appear here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="p-4 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto min-h-[400px] text-sm">
                        {apiResponse || 'No response yet. Run a request to see the output.'}
                      </pre>
                      {apiResponse && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => navigator.clipboard.writeText(apiResponse)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* API Endpoints Reference */}
              <Card className="glass border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                  <CardDescription>Available endpoints and their performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockEndpoints.map((endpoint) => (
                      <div key={endpoint.name} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{endpoint.method}</Badge>
                          <code className="text-sm font-mono">{endpoint.name}</code>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {endpoint.latency}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {endpoint.requests}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Usage Trends */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Usage Trends</CardTitle>
                    <CardDescription>API requests and token usage over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Line
                      data={usageData}
                      options={{
                        responsive: true,
                        interaction: {
                          mode: 'index' as const,
                          intersect: false,
                        },
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                          },
                        },
                        scales: {
                          y: {
                            type: 'linear' as const,
                            display: true,
                            position: 'left' as const,
                          },
                          y1: {
                            type: 'linear' as const,
                            display: true,
                            position: 'right' as const,
                            grid: {
                              drawOnChartArea: false,
                            },
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Cost Breakdown */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                    <CardDescription>Spending by model this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Doughnut
                      data={costData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'right' as const,
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card className="glass border-0 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>System performance throughout the day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Line
                      data={performanceData}
                      options={{
                        responsive: true,
                        interaction: {
                          mode: 'index' as const,
                          intersect: false,
                        },
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                          },
                        },
                        scales: {
                          y: {
                            type: 'linear' as const,
                            display: true,
                            position: 'left' as const,
                          },
                          y1: {
                            type: 'linear' as const,
                            display: true,
                            position: 'right' as const,
                            grid: {
                              drawOnChartArea: false,
                            },
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Fine-tuning Tab */}
            <TabsContent value="fine-tuning" className="space-y-4">
              <Card className="glass border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Fine-tuning Jobs</CardTitle>
                      <CardDescription>Train custom models on your data</CardDescription>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Job
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Fine-tuning Job Example */}
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Customer Support Model v2</h3>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400">
                              Training
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Based on GPT-4 Turbo • 50,000 examples</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>67%</span>
                            </div>
                            <Progress value={67} />
                            <p className="text-xs text-muted-foreground">Estimated time remaining: 2h 15m</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Pause className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Completed Job */}
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Legal Document Analyzer</h3>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400">
                              Completed
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Based on Claude 3 • 25,000 examples</p>
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="flex items-center gap-1">
                              <Gauge className="h-4 w-4 text-muted-foreground" />
                              Accuracy: 96.8%
                            </span>
                            <span className="flex items-center gap-1">
                              <Timer className="h-4 w-4 text-muted-foreground" />
                              Training time: 8h 42m
                            </span>
                          </div>
                        </div>
                        <Button size="sm">Deploy</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Training Data Upload */}
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Upload Training Data</CardTitle>
                  <CardDescription>Prepare your dataset for fine-tuning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Drop your training files here</h3>
                    <p className="text-sm text-muted-foreground mb-4">Supported formats: JSONL, CSV, TXT</p>
                    <Button variant="outline">Browse Files</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Current Usage */}
                <Card className="glass border-0 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Current Month Usage</CardTitle>
                    <CardDescription>Real-time billing information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <div>
                          <p className="font-semibold">Total Spent</p>
                          <p className="text-3xl font-bold">$8,745.32</p>
                          <p className="text-sm text-muted-foreground">of $10,000 budget</p>
                        </div>
                        <div className="h-24 w-24">
                          <Doughnut
                            data={{
                              datasets: [{
                                data: [8745, 1255],
                                backgroundColor: ['rgb(59, 130, 246)', 'rgb(229, 231, 235)'],
                                borderWidth: 0
                              }]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: false },
                                tooltip: { enabled: false }
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span>GPT-4 Turbo</span>
                          </div>
                          <span className="font-semibold">$4,567</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            <span>Claude 3 Opus</span>
                          </div>
                          <span className="font-semibold">$2,345</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-pink-500" />
                            <span>DALL-E 3</span>
                          </div>
                          <span className="font-semibold">$1,234</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span>Other Models</span>
                          </div>
                          <span className="font-semibold">$599</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Settings */}
                <Card className="glass border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Billing Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="budget-alerts">Budget Alerts</Label>
                          <p className="text-sm text-muted-foreground">Alert at 80% usage</p>
                        </div>
                        <Switch id="budget-alerts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-recharge">Auto Recharge</Label>
                          <p className="text-sm text-muted-foreground">Top up when low</p>
                        </div>
                        <Switch id="auto-recharge" />
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <Button className="w-full" variant="outline">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Update Payment Method
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Receipt className="mr-2 h-4 w-4" />
                        Download Invoices
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Model Details Modal */}
      <AnimatePresence>
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedModel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Model Details</h2>
                  <Button size="icon" variant="ghost" onClick={() => setSelectedModel(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Model Info */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                      {getModelIcon(selectedModel.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{selectedModel.name}</h3>
                      <p className="text-muted-foreground">{selectedModel.provider} • Version {selectedModel.version}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(selectedModel.status)}>
                          {selectedModel.status}
                        </Badge>
                        <Badge variant="outline">{selectedModel.parameters} parameters</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Model Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Requests</span>
                          <span className="font-semibold">{selectedModel.requests.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Avg Latency</span>
                          <span className="font-semibold">{selectedModel.avgLatency}ms</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Model Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Terminal className="mr-2 h-4 w-4" />
                      Open in Playground
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}