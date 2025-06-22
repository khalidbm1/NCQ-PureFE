'use client'

import { useState } from 'react'
import { 
  Play,
  Upload,
  Trash2,
  Settings2,
  Copy,
  Download,
  Image as ImageIcon,
  Mic,
  FileText,
  X,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/useTranslation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ModelOption {
  id: string
  name: string
  type: 'text' | 'image' | 'audio' | 'multimodal'
  icon: any
}

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  url?: string
}

export default function SandboxPage() {
  const { t, language } = useI18n()
  const isRTL = language === 'ar'
  
  const [selectedModel, setSelectedModel] = useState('llama2-70b')
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  
  const [parameters, setParameters] = useState({
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1.0,
    frequencyPenalty: 0,
    presencePenalty: 0
  })
  
  const models: ModelOption[] = [
    { id: 'llama2-70b', name: 'LLaMA 2 70B', type: 'text', icon: FileText },
    { id: 'falcon-180b', name: 'Falcon 180B', type: 'text', icon: FileText },
    { id: 'jais-30b', name: 'JAIS 30B', type: 'text', icon: FileText },
    { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL', type: 'image', icon: ImageIcon },
    { id: 'whisper-large', name: 'Whisper Large', type: 'audio', icon: Mic },
  ]
  
  const currentModel = models.find(m => m.id === selectedModel)
  
  const handleSubmit = async () => {
    if (!prompt.trim() && uploadedFiles.length === 0) return
    
    setIsLoading(true)
    setResponse('')
    
    // Simulate API call
    setTimeout(() => {
      if (currentModel?.type === 'image') {
        setResponse('[Generated image would appear here]')
      } else if (currentModel?.type === 'audio') {
        setResponse('Transcription: "' + prompt + '"\\n\\nThis is a simulated transcription result.')
      } else {
        setResponse(`This is a simulated response from ${currentModel?.name}.

Based on your prompt: "${prompt}"

The model would generate a detailed response here. In a real implementation, this would call the backend API and stream the response in real-time.

Key features:
- Natural language understanding
- Context awareness
- Multi-turn conversations
- Code generation capabilities
- Multilingual support

Feel free to experiment with different prompts and parameters!`)
      }
      setIsLoading(false)
    }, 2000)
  }
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size
    }))
    
    setUploadedFiles([...uploadedFiles, ...newFiles])
  }
  
  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id))
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB'
    else return Math.round(bytes / 1048576) + ' MB'
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.sandbox.title')}</h1>
        <p className="text-gray-600 mt-1">{t('dashboard.sandbox.subtitle')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Playground Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowModelMenu(!showModelMenu)}
                      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        {currentModel && <currentModel.icon className="h-4 w-4" />}
                        <span className="font-medium">{currentModel?.name}</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {showModelMenu && (
                      <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
                        {models.map(model => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model.id)
                              setShowModelMenu(false)
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                          >
                            <model.icon className="h-4 w-4" />
                            <span>{model.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Input Area */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('dashboard.sandbox.prompt')}
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('dashboard.sandbox.promptPlaceholder')}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
                
                {/* File Upload Area */}
                {currentModel?.type !== 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dashboard.sandbox.files')}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {uploadedFiles.length > 0 ? (
                        <div className="space-y-2">
                          {uploadedFiles.map(file => (
                            <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                              </div>
                              <button
                                onClick={() => removeFile(file.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <label className="block">
                            <input
                              type="file"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                              accept={currentModel?.type === 'image' ? 'image/*' : 'audio/*'}
                            />
                            <Button variant="outline" size="sm" className="w-full">
                              <Upload className="h-4 w-4 mr-2" />
                              {t('dashboard.sandbox.addMore')}
                            </Button>
                          </label>
                        </div>
                      ) : (
                        <label className="block cursor-pointer">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            accept={currentModel?.type === 'image' ? 'image/*' : 'audio/*'}
                          />
                          <div className="text-center py-8">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600">{t('dashboard.sandbox.uploadPrompt')}</p>
                            <p className="text-xs text-gray-500 mt-1">{t('dashboard.sandbox.uploadHint')}</p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || (!prompt.trim() && uploadedFiles.length === 0)}
                    loading={isLoading}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {t('dashboard.sandbox.generate')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPrompt('')
                      setResponse('')
                      setUploadedFiles([])
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('dashboard.sandbox.clear')}
                  </Button>
                </div>
              </div>
              
              {/* Response Area */}
              {(response || isLoading) && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t('dashboard.sandbox.response')}
                    </label>
                    {response && (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(response)
                            // Optionally add a toast notification here
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const blob = new Blob([response], { type: 'text/plain' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `response-${new Date().toISOString().slice(0, 10)}.txt`
                            document.body.appendChild(a)
                            a.click()
                            document.body.removeChild(a)
                            URL.revokeObjectURL(url)
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{response}</div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Settings Panel */}
        <div className="lg:col-span-1">
          {showSettings && (
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.sandbox.parameters.title')}</CardTitle>
                <CardDescription>{t('dashboard.sandbox.parameters.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dashboard.sandbox.parameters.temperature')} ({parameters.temperature})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={parameters.temperature}
                      onChange={(e) => setParameters({ ...parameters, temperature: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{t('dashboard.sandbox.parameters.precise')}</span>
                      <span>{t('dashboard.sandbox.parameters.creative')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dashboard.sandbox.parameters.maxTokens')}
                    </label>
                    <Input
                      type="number"
                      value={parameters.maxTokens}
                      onChange={(e) => setParameters({ ...parameters, maxTokens: parseInt(e.target.value) })}
                      min="1"
                      max="4096"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dashboard.sandbox.parameters.topP')} ({parameters.topP})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={parameters.topP}
                      onChange={(e) => setParameters({ ...parameters, topP: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dashboard.sandbox.parameters.frequencyPenalty')} ({parameters.frequencyPenalty})
                    </label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={parameters.frequencyPenalty}
                      onChange={(e) => setParameters({ ...parameters, frequencyPenalty: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dashboard.sandbox.parameters.presencePenalty')} ({parameters.presencePenalty})
                    </label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={parameters.presencePenalty}
                      onChange={(e) => setParameters({ ...parameters, presencePenalty: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setParameters({
                      temperature: 0.7,
                      maxTokens: 2048,
                      topP: 1.0,
                      frequencyPenalty: 0,
                      presencePenalty: 0
                    })}
                  >
                    {t('dashboard.sandbox.parameters.reset')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Examples */}
          <Card className={showSettings ? 'mt-6' : ''}>
            <CardHeader>
              <CardTitle>{t('dashboard.sandbox.examples.title')}</CardTitle>
              <CardDescription>{t('dashboard.sandbox.examples.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button
                  onClick={() => setPrompt('Write a Python function that calculates the factorial of a number')}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                >
                  {t('dashboard.sandbox.examples.code')}
                </button>
                <button
                  onClick={() => setPrompt('Explain quantum computing in simple terms')}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                >
                  {t('dashboard.sandbox.examples.explain')}
                </button>
                <button
                  onClick={() => setPrompt('Translate "Hello, how are you?" to Arabic')}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                >
                  {t('dashboard.sandbox.examples.translate')}
                </button>
                <button
                  onClick={() => setPrompt('Generate a creative story about a robot learning to paint')}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                >
                  {t('dashboard.sandbox.examples.creative')}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}