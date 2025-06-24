import { useState } from 'react'
import { 
  Brain, MessageSquare, Zap, Shield,
  Cpu, Play,
  FileText, Copy, Check, Send, Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import { toast } from 'sonner'

// Mock data
const models = [
  {
    id: 'ncq-turbo',
    name: 'NCQ Turbo',
    description: 'Fast, efficient model for general tasks',
    contextWindow: '8K tokens',
    performance: 95,
    cost: '$0.002/1K tokens',
    badge: 'Popular'
  },
  {
    id: 'ncq-pro',
    name: 'NCQ Pro',
    description: 'Advanced model for complex reasoning',
    contextWindow: '32K tokens',
    performance: 98,
    cost: '$0.01/1K tokens',
    badge: 'Recommended'
  },
  {
    id: 'ncq-vision',
    name: 'NCQ Vision',
    description: 'Multimodal model with image understanding',
    contextWindow: '16K tokens',
    performance: 92,
    cost: '$0.005/1K tokens',
    badge: 'New'
  },
  {
    id: 'ncq-arabic',
    name: 'NCQ Arabic',
    description: 'Specialized for Arabic language',
    contextWindow: '16K tokens',
    performance: 96,
    cost: '$0.003/1K tokens',
    badge: 'Exclusive'
  }
]

const apiUsageStats = {
  totalRequests: 125847,
  tokensUsed: 45728391,
  avgLatency: 234,
  uptime: 99.98,
  activeEndpoints: 12,
  errorRate: 0.02
}

const recentPrompts = [
  { id: 1, prompt: 'Translate this medical report to Arabic', model: 'NCQ Arabic', tokens: 1250, time: '2 min ago' },
  { id: 2, prompt: 'Generate product description for e-commerce', model: 'NCQ Turbo', tokens: 450, time: '5 min ago' },
  { id: 3, prompt: 'Analyze customer sentiment from reviews', model: 'NCQ Pro', tokens: 3200, time: '12 min ago' },
  { id: 4, prompt: 'Extract data from invoice image', model: 'NCQ Vision', tokens: 890, time: '1 hour ago' },
  { id: 5, prompt: 'Code review for React component', model: 'NCQ Pro', tokens: 2100, time: '2 hours ago' }
]

const codeExamples = {
  python: `import ncq_ai

client = ncq_ai.Client(api_key="your-api-key")

response = client.chat.completions.create(
    model="ncq-turbo",
    messages=[
        {"role": "user", "content": "Hello, NCQ AI!"}
    ]
)

print(response.choices[0].message.content)`,
  javascript: `const NCQ_AI = require('ncq-ai');

const client = new NCQ_AI({
  apiKey: 'your-api-key'
});

async function chat() {
  const response = await client.chat.completions.create({
    model: 'ncq-turbo',
    messages: [{ role: 'user', content: 'Hello, NCQ AI!' }]
  });
  
  console.log(response.choices[0].message.content);
}`,
  curl: `curl https://api.ncq.sa/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "ncq-turbo",
    "messages": [{"role": "user", "content": "Hello, NCQ AI!"}]
  }'`
}

export default function LLMPlatform() {
  const [selectedModel, setSelectedModel] = useState('ncq-turbo')
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleTestModel = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setIsLoading(true)
    setResponse('')

    // Simulate API call
    setTimeout(() => {
      const mockResponses = [
        "Based on my analysis, here's a comprehensive solution to your query...",
        "I've processed your request. Here are the key insights...",
        "Thank you for your question. Let me provide you with a detailed response...",
        "After analyzing your input, I can suggest the following approach..."
      ]
      
      setResponse(mockResponses[Math.floor(Math.random() * mockResponses.length)])
      setIsLoading(false)
      toast.success('Response generated successfully!')
    }, 2000)
  }

  const copyCode = (language: string) => {
    navigator.clipboard.writeText(codeExamples[language as keyof typeof codeExamples])
    setCopiedCode(language)
    toast.success('Code copied to clipboard')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            NCQ LLM Platform
            <Badge variant="default" className="ml-2">Beta</Badge>
          </h1>
          <p className="text-muted-foreground">
            Advanced AI language models for your applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Documentation
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Get API Key
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiUsageStats.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(apiUsageStats.tokensUsed / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">45.7M tokens this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiUsageStats.avgLatency}ms</div>
            <p className="text-xs text-muted-foreground">-5% improvement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiUsageStats.uptime}%</div>
            <p className="text-xs text-muted-foreground">Enterprise-grade reliability</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="playground" className="space-y-4">
        <TabsList>
          <TabsTrigger value="playground">Playground</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="playground" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test NCQ AI Models</CardTitle>
              <CardDescription>
                Try our models with your own prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Model</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedModel === model.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-input hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium text-sm">{model.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {model.contextWindow}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Your Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt here..."
                  className="w-full min-h-[120px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button 
                onClick={handleTestModel} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Generate Response
                  </>
                )}
              </Button>

              {response && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Response</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(response)
                        toast.success('Response copied')
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm">{response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    {model.badge && (
                      <Badge variant={model.badge === 'New' ? 'default' : 'secondary'}>
                        {model.badge}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Context Window</span>
                      <span className="font-medium">{model.contextWindow}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Performance</span>
                      <span className="font-medium">{model.performance}%</span>
                    </div>
                    <Progress value={model.performance} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="font-medium">{model.cost}</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Brain className="w-4 h-4 mr-2" />
                    Use This Model
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>
                Integrate NCQ AI into your application in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="python" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                {Object.entries(codeExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang}>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm">{code}</code>
                      </pre>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyCode(lang)}
                      >
                        {copiedCode === lang ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent API Usage</CardTitle>
              <CardDescription>
                Your last API calls and token consumption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPrompts.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.prompt}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.model} • {item.tokens} tokens • {item.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}