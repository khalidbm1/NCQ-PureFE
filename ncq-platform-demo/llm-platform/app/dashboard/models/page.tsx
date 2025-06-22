'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Brain,
  Image,
  Mic,
  FileText,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/useTranslation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Model {
  id: string
  name: string
  type: 'text' | 'image' | 'audio' | 'multimodal'
  description: string
  version: string
  status: 'available' | 'busy' | 'maintenance'
  performance: {
    speed: number // 1-5
    quality: number // 1-5
    cost: number // 1-5
  }
  pricing: {
    input: number
    output: number
    unit: string
  }
  capabilities: string[]
  icon: any
}

export default function ModelsPage() {
  const router = useRouter()
  const { t, language } = useI18n()
  const isRTL = language === 'ar'
  const [selectedType, setSelectedType] = useState<string>('all')
  
  const models: Model[] = [
    {
      id: 'llama2-70b',
      name: 'LLaMA 2 70B',
      type: 'text',
      description: 'Meta\'s powerful open-source language model for text generation and analysis',
      version: '2.0',
      status: 'available',
      performance: { speed: 4, quality: 5, cost: 4 },
      pricing: { input: 0.001, output: 0.002, unit: '1K tokens' },
      capabilities: ['Text generation', 'Code generation', 'Analysis', 'Translation'],
      icon: Brain
    },
    {
      id: 'falcon-180b',
      name: 'Falcon 180B',
      type: 'text',
      description: 'TII\'s large language model optimized for Arabic and multilingual tasks',
      version: '1.0',
      status: 'available',
      performance: { speed: 3, quality: 5, cost: 5 },
      pricing: { input: 0.002, output: 0.004, unit: '1K tokens' },
      capabilities: ['Arabic support', 'Text generation', 'Translation', 'Summarization'],
      icon: Brain
    },
    {
      id: 'bloom-176b',
      name: 'BLOOM 176B',
      type: 'text',
      description: 'Multilingual model supporting 46+ languages including Arabic',
      version: '1.0',
      status: 'busy',
      performance: { speed: 3, quality: 4, cost: 5 },
      pricing: { input: 0.002, output: 0.004, unit: '1K tokens' },
      capabilities: ['Multilingual', 'Text generation', 'Translation'],
      icon: Brain
    },
    {
      id: 'stable-diffusion-xl',
      name: 'Stable Diffusion XL',
      type: 'image',
      description: 'Advanced image generation model for creating high-quality visuals',
      version: '1.0',
      status: 'available',
      performance: { speed: 3, quality: 5, cost: 3 },
      pricing: { input: 0.02, output: 0.02, unit: 'image' },
      capabilities: ['Image generation', 'Style transfer', 'Inpainting', 'Upscaling'],
      icon: Image
    },
    {
      id: 'whisper-large',
      name: 'Whisper Large',
      type: 'audio',
      description: 'OpenAI\'s speech recognition model supporting multiple languages',
      version: '3.0',
      status: 'available',
      performance: { speed: 4, quality: 5, cost: 3 },
      pricing: { input: 0.006, output: 0, unit: 'minute' },
      capabilities: ['Speech-to-text', 'Multi-language', 'Noise reduction'],
      icon: Mic
    },
    {
      id: 'jais-30b',
      name: 'JAIS 30B',
      type: 'text',
      description: 'Arabic-English bilingual model developed in the UAE',
      version: '1.0',
      status: 'available',
      performance: { speed: 4, quality: 4, cost: 3 },
      pricing: { input: 0.0008, output: 0.0016, unit: '1K tokens' },
      capabilities: ['Arabic optimization', 'Bilingual', 'Cultural awareness'],
      icon: Brain
    },
    {
      id: 'seamless-m4t',
      name: 'SeamlessM4T',
      type: 'multimodal',
      description: 'Meta\'s multimodal translation model for speech and text',
      version: '1.0',
      status: 'maintenance',
      performance: { speed: 3, quality: 4, cost: 4 },
      pricing: { input: 0.01, output: 0.01, unit: 'request' },
      capabilities: ['Speech translation', 'Text translation', '100+ languages'],
      icon: FileText
    }
  ]
  
  const modelTypes = [
    { value: 'all', label: t('dashboard.models.types.all'), icon: Brain },
    { value: 'text', label: t('dashboard.models.types.text'), icon: FileText },
    { value: 'image', label: t('dashboard.models.types.image'), icon: Image },
    { value: 'audio', label: t('dashboard.models.types.audio'), icon: Mic },
    { value: 'multimodal', label: t('dashboard.models.types.multimodal'), icon: Zap }
  ]
  
  const filteredModels = selectedType === 'all' 
    ? models 
    : models.filter(m => m.type === selectedType)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const renderPerformanceBar = (value: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-2 w-3 rounded-sm ${
              i <= value ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.models.title')}</h1>
        <p className="text-gray-600 mt-1">{t('dashboard.models.subtitle')}</p>
      </div>
      
      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {modelTypes.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                selectedType === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              <Icon className="h-4 w-4" />
              {type.label}
            </button>
          )
        })}
      </div>
      
      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModels.map((model) => {
          const Icon = model.icon
          return (
            <Card key={model.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">v{model.version}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                          {t(`dashboard.models.status.${model.status}`)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    disabled={model.status !== 'available'}
                    onClick={() => router.push('/dashboard/sandbox')}
                  >
                    {t('dashboard.models.tryNow')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{model.description}</p>
                
                {/* Performance Metrics */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      {t('dashboard.models.performance.speed')}
                    </span>
                    {renderPerformanceBar(model.performance.speed)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      {t('dashboard.models.performance.quality')}
                    </span>
                    {renderPerformanceBar(model.performance.quality)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {t('dashboard.models.performance.cost')}
                    </span>
                    {renderPerformanceBar(model.performance.cost)}
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium mb-1">{t('dashboard.models.pricing')}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      <span className="font-medium">${model.pricing.input}</span>
                      <span className="text-gray-500"> / {model.pricing.unit} {t('dashboard.models.input')}</span>
                    </span>
                    {model.pricing.output > 0 && (
                      <span>
                        <span className="font-medium">${model.pricing.output}</span>
                        <span className="text-gray-500"> / {model.pricing.unit} {t('dashboard.models.output')}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Capabilities */}
                <div>
                  <p className="text-sm font-medium mb-2">{t('dashboard.models.capabilities')}</p>
                  <div className="flex flex-wrap gap-2">
                    {model.capabilities.map((capability, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">{t('dashboard.models.info.title')}</p>
            <p className="text-sm text-blue-700 mt-1">{t('dashboard.models.info.description')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}