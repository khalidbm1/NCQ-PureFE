'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Code2, 
  Book, 
  Zap, 
  Key, 
  Shield,
  Globe,
  Copy,
  Check,
  ChevronRight,
  FileText,
  Terminal,
  Braces
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/useTranslation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface CodeExample {
  title: string
  language: string
  code: string
}

export default function DocsPage() {
  const { t, language } = useI18n()
  const isRTL = language === 'ar'
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('getting-started')
  
  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }
  
  const sections = [
    { id: 'getting-started', title: t('docs.sections.gettingStarted'), icon: Zap },
    { id: 'authentication', title: t('docs.sections.authentication'), icon: Key },
    { id: 'endpoints', title: t('docs.sections.endpoints'), icon: Globe },
    { id: 'models', title: t('docs.sections.models'), icon: Braces },
    { id: 'errors', title: t('docs.sections.errors'), icon: Shield },
    { id: 'examples', title: t('docs.sections.examples'), icon: Code2 },
  ]
  
  const codeExamples: Record<string, CodeExample[]> = {
    authentication: [
      {
        title: 'API Key Authentication',
        language: 'bash',
        code: `curl -X POST https://api.ncq-llm.com/v1/inference \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2-70b",
    "prompt": "Hello, world!",
    "temperature": 0.7
  }'`
      },
      {
        title: 'Python Example',
        language: 'python',
        code: `import requests

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "llama2-70b",
    "prompt": "Hello, world!",
    "temperature": 0.7
}

response = requests.post(
    "https://api.ncq-llm.com/v1/inference",
    headers=headers,
    json=data
)

print(response.json())`
      }
    ],
    inference: [
      {
        title: 'Text Generation',
        language: 'javascript',
        code: `const response = await fetch('https://api.ncq-llm.com/v1/inference', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama2-70b',
    prompt: 'Write a short story about a robot',
    max_tokens: 200,
    temperature: 0.8
  })
});

const data = await response.json();
console.log(data.choices[0].text);`
      },
      {
        title: 'Image Generation',
        language: 'python',
        code: `import requests

response = requests.post(
    "https://api.ncq-llm.com/v1/inference",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "model": "stable-diffusion-xl",
        "prompt": "A futuristic city at sunset",
        "size": "1024x1024",
        "quality": "hd"
    }
)

image_url = response.json()["data"][0]["url"]
print(f"Generated image: {image_url}")`
      }
    ]
  }
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <nav className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NCQ LLM
              </h1>
              <span className="text-gray-500">/</span>
              <span className="text-lg font-medium">{t('docs.title')}</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline">{t('nav.dashboard')}</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>{t('nav.getStarted')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen sticky top-16">
          <nav className="p-4">
            <ul className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {section.title}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Getting Started */}
            {activeSection === 'getting-started' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">{t('docs.gettingStarted.title')}</h1>
                <p className="text-gray-600 mb-8">{t('docs.gettingStarted.description')}</p>
                
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>{t('docs.gettingStarted.quickStart')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                          1
                        </span>
                        <div>
                          <p className="font-medium">{t('docs.gettingStarted.step1.title')}</p>
                          <p className="text-sm text-gray-600 mt-1">{t('docs.gettingStarted.step1.description')}</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                          2
                        </span>
                        <div>
                          <p className="font-medium">{t('docs.gettingStarted.step2.title')}</p>
                          <p className="text-sm text-gray-600 mt-1">{t('docs.gettingStarted.step2.description')}</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                          3
                        </span>
                        <div>
                          <p className="font-medium">{t('docs.gettingStarted.step3.title')}</p>
                          <p className="text-sm text-gray-600 mt-1">{t('docs.gettingStarted.step3.description')}</p>
                        </div>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{t('docs.gettingStarted.baseUrl')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      https://api.ncq-llm.com/v1
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Authentication */}
            {activeSection === 'authentication' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">{t('docs.authentication.title')}</h1>
                <p className="text-gray-600 mb-8">{t('docs.authentication.description')}</p>
                
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>{t('docs.authentication.apiKeys')}</CardTitle>
                    <CardDescription>{t('docs.authentication.apiKeysDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {codeExamples.authentication.map((example, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">{example.title}</h4>
                            <button
                              onClick={() => handleCopy(example.code, `auth-${index}`)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedId === `auth-${index}` ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Endpoints */}
            {activeSection === 'endpoints' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">{t('docs.endpoints.title')}</h1>
                <p className="text-gray-600 mb-8">{t('docs.endpoints.description')}</p>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          POST
                        </span>
                        <code className="text-sm font-mono">/inference</code>
                      </div>
                      <CardDescription>{t('docs.endpoints.inference.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-medium mb-2">{t('docs.endpoints.parameters')}</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <span className="font-mono">model</span>
                          <span className="text-gray-600">string</span>
                          <span className="text-gray-600">{t('docs.endpoints.inference.modelDesc')}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <span className="font-mono">prompt</span>
                          <span className="text-gray-600">string</span>
                          <span className="text-gray-600">{t('docs.endpoints.inference.promptDesc')}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <span className="font-mono">temperature</span>
                          <span className="text-gray-600">number</span>
                          <span className="text-gray-600">{t('docs.endpoints.inference.temperatureDesc')}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <span className="font-mono">max_tokens</span>
                          <span className="text-gray-600">number</span>
                          <span className="text-gray-600">{t('docs.endpoints.inference.maxTokensDesc')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          GET
                        </span>
                        <code className="text-sm font-mono">/models</code>
                      </div>
                      <CardDescription>{t('docs.endpoints.models.description')}</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          POST
                        </span>
                        <code className="text-sm font-mono">/files/upload</code>
                      </div>
                      <CardDescription>{t('docs.endpoints.files.description')}</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Models */}
            {activeSection === 'models' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">{t('docs.models.title')}</h1>
                <p className="text-gray-600 mb-8">{t('docs.models.description')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">LLaMA 2 70B</CardTitle>
                      <CardDescription>llama2-70b</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.type')}</span>
                          <span>Text Generation</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.maxTokens')}</span>
                          <span>4,096</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.languages')}</span>
                          <span>Multiple</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Falcon 180B</CardTitle>
                      <CardDescription>falcon-180b</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.type')}</span>
                          <span>Text Generation</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.maxTokens')}</span>
                          <span>2,048</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.languages')}</span>
                          <span>Arabic, English</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Stable Diffusion XL</CardTitle>
                      <CardDescription>stable-diffusion-xl</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.type')}</span>
                          <span>Image Generation</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.resolution')}</span>
                          <span>Up to 1024x1024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.styles')}</span>
                          <span>Multiple</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Whisper Large</CardTitle>
                      <CardDescription>whisper-large</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.type')}</span>
                          <span>Speech to Text</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.languages')}</span>
                          <span>99+ Languages</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('docs.models.accuracy')}</span>
                          <span>High</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Errors */}
            {activeSection === 'errors' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">{t('docs.errors.title')}</h1>
                <p className="text-gray-600 mb-8">{t('docs.errors.description')}</p>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{t('docs.errors.codes')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm font-mono">
                            400
                          </span>
                          <span className="font-medium">Bad Request</span>
                        </div>
                        <p className="text-sm text-gray-600">{t('docs.errors.400')}</p>
                      </div>
                      <div className="border-b pb-3">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm font-mono">
                            401
                          </span>
                          <span className="font-medium">Unauthorized</span>
                        </div>
                        <p className="text-sm text-gray-600">{t('docs.errors.401')}</p>
                      </div>
                      <div className="border-b pb-3">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-sm font-mono">
                            429
                          </span>
                          <span className="font-medium">Too Many Requests</span>
                        </div>
                        <p className="text-sm text-gray-600">{t('docs.errors.429')}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm font-mono">
                            500
                          </span>
                          <span className="font-medium">Internal Server Error</span>
                        </div>
                        <p className="text-sm text-gray-600">{t('docs.errors.500')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Examples */}
            {activeSection === 'examples' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">{t('docs.examples.title')}</h1>
                <p className="text-gray-600 mb-8">{t('docs.examples.description')}</p>
                
                <div className="space-y-8">
                  {codeExamples.inference.map((example, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{example.title}</CardTitle>
                          <button
                            onClick={() => handleCopy(example.code, `example-${index}`)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {copiedId === `example-${index}` ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{example.code}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    {t('docs.examples.moreExamples')}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    {t('docs.examples.moreExamplesDesc')}
                  </p>
                  <Button variant="outline" size="sm">
                    <Book className="h-4 w-4 mr-2" />
                    {t('docs.examples.viewGithub')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}