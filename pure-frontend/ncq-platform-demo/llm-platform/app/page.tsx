'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Upload, Mic, FileText, Image, Play, Globe, ChevronDown, Moon, Sun, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomePage() {
  const { t, language, setLanguage } = useLanguage()
  const router = useRouter()
  const [selectedModel, setSelectedModel] = useState('gpt4')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setUploadedFiles(Array.from(files))
    }
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    document.documentElement.classList.toggle('dark')
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ] as const

  const models = [
    { id: 'gpt4', name: 'GPT-4', icon: '🤖', description: 'Most capable model' },
    { id: 'gpt35', name: 'GPT-3.5', icon: '⚡', description: 'Fast and efficient' },
    { id: 'claude', name: 'Claude', icon: '🧠', description: 'Anthropic\'s AI' },
    { id: 'llama', name: 'Llama 3', icon: '🦙', description: 'Open source' },
    { id: 'custom', name: 'Custom Model', icon: '✨', description: 'Your fine-tuned model' }
  ]

  const features = [
    {
      icon: Sparkles,
      title: 'Advanced AI Models',
      description: 'Access to state-of-the-art language models including GPT-4, Claude, and more'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized infrastructure for minimal latency and maximum throughput'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and compliance with industry standards'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* NCQ Header */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm fixed w-full z-10 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  NCQ LLM Platform
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/playground" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                {language === 'en' ? 'Playground' : 'بيئة التجربة'}
              </Link>
              <Link href="/docs" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                {language === 'en' ? 'Documentation' : 'الوثائق'}
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                {language === 'en' ? 'Pricing' : 'الأسعار'}
              </Link>
              
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Globe className="w-4 h-4" />
                  <span>{languages.find(l => l.code === language)?.flag}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showLangMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-20"
                  >
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as 'en' | 'ar')
                          setShowLangMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 dark:text-gray-100"
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              
              <button 
                onClick={() => router.push('/auth/login')}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
              </button>
              
              <button 
                onClick={() => router.push('/auth/signup')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {language === 'en' ? 'Get Started' : 'ابدأ الآن'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {language === 'en' ? 'Enterprise AI at Your Fingertips' : 'الذكاء الاصطناعي المؤسسي في متناول يدك'}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                {language === 'en' 
                  ? 'Access the most powerful AI models through a unified platform. Build, deploy, and scale with confidence.'
                  : 'الوصول إلى أقوى نماذج الذكاء الاصطناعي من خلال منصة موحدة. قم بالبناء والنشر والتوسع بثقة.'
                }
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 text-lg font-medium"
                >
                  {language === 'en' ? 'Start Building' : 'ابدأ البناء'}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push('/playground')}
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-lg font-medium"
                >
                  {language === 'en' ? 'Try Playground' : 'جرب بيئة التجربة'}
                </button>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {features.map((feature, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Interactive Demo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                {language === 'en' ? 'Try It Now' : 'جربه الآن'}
              </h3>

              <div className="space-y-4">
                {/* Model Selection */}
                <div className="relative">
                  <button
                    onClick={() => setShowModelMenu(!showModelMenu)}
                    className="w-full flex items-center justify-between px-4 py-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{models.find(m => m.id === selectedModel)?.icon}</span>
                      <div>
                        <div className="font-medium dark:text-gray-100">{models.find(m => m.id === selectedModel)?.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{models.find(m => m.id === selectedModel)?.description}</div>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </button>
                  {showModelMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute w-full mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-20"
                    >
                      {models.map(model => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model.id)
                            setShowModelMenu(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 border-b dark:border-gray-700 last:border-b-0 transition-colors"
                        >
                          <span className="text-2xl">{model.icon}</span>
                          <div>
                            <div className="font-medium dark:text-gray-100">{model.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{model.description}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Prompt Input */}
                <textarea 
                  className="w-full p-4 border dark:border-gray-700 rounded-lg resize-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                  placeholder={language === 'en' ? 'Enter your prompt here...' : 'أدخل استفسارك هنا...'}
                />

                {/* File Upload Area */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {uploadedFiles.length} file(s) selected:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
                        >
                          <FileText className="w-3 h-3" />
                          <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
                          <button
                            onClick={() => {
                              setUploadedFiles(files => files.filter((_, i) => i !== index))
                            }}
                            className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
                    />
                    <Upload className="w-4 h-4" />
                    {language === 'en' ? 'Add Files' : 'إضافة ملفات'}
                  </label>
                  <button className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 transition-colors">
                    <Play className="w-4 h-4" />
                    {language === 'en' ? 'Generate Response' : 'توليد الرد'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}