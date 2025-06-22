import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiCpu, FiMessageSquare, FiTrendingUp, FiDatabase,
  FiZap, FiBarChart, FiFileText, FiSend,
  FiSliders, FiCode, FiBrain, FiGlobe
} from 'react-icons/fi'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import toast from 'react-hot-toast'

// Mock data
const aiStats = {
  totalRequests: 45678,
  avgResponseTime: 234,
  modelsDeployed: 12,
  accuracy: 94.5,
  tokensProcessed: '12.3M',
}

const models = [
  { name: 'NCQ-GPT-4', type: 'LLM', requests: 12450, accuracy: 96.2, status: 'active' },
  { name: 'Sentiment-BERT', type: 'Classification', requests: 8920, accuracy: 94.8, status: 'active' },
  { name: 'NCQ-Vision', type: 'Computer Vision', requests: 6780, accuracy: 92.5, status: 'active' },
  { name: 'Arabic-NLP', type: 'NLP', requests: 5430, accuracy: 91.3, status: 'training' },
]

const usageData = [
  { time: '00:00', requests: 450, tokens: 125000 },
  { time: '04:00', requests: 320, tokens: 89000 },
  { time: '08:00', requests: 890, tokens: 245000 },
  { time: '12:00', requests: 1250, tokens: 380000 },
  { time: '16:00', requests: 1100, tokens: 320000 },
  { time: '20:00', requests: 780, tokens: 210000 },
]

const performanceMetrics = [
  { metric: 'Accuracy', A: 95, B: 88, fullMark: 100 },
  { metric: 'Speed', A: 92, B: 85, fullMark: 100 },
  { metric: 'Efficiency', A: 88, B: 90, fullMark: 100 },
  { metric: 'Scalability', A: 90, B: 82, fullMark: 100 },
  { metric: 'Cost', A: 85, B: 95, fullMark: 100 },
]

const conversations = [
  { id: 1, user: 'Hospital Admin', query: 'Analyze patient satisfaction trends', response: 'Based on the data...', time: '2 min ago' },
  { id: 2, user: 'Hotel Manager', query: 'Predict next month occupancy', response: 'The forecast shows...', time: '5 min ago' },
  { id: 3, user: 'Finance Team', query: 'Generate revenue report', response: 'Here\'s the analysis...', time: '15 min ago' },
]

const LLMPlatform: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('NCQ-GPT-4')
  const [userQuery, setUserQuery] = useState('')
  const [processing, setProcessing] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(150)

  const processQuery = () => {
    if (!userQuery.trim()) {
      toast.error('Please enter a query')
      return
    }

    setProcessing(true)
    toast.loading('Processing your query...', { id: 'ai-query' })

    setTimeout(() => {
      toast.success('Query processed successfully!', { id: 'ai-query' })
      setProcessing(false)
      setUserQuery('')
    }, 2000)
  }

  const trainModel = () => {
    toast.loading('Starting model training...', { duration: 3000 })
    setTimeout(() => {
      toast.success('Model training initiated. ETA: 2 hours')
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI/LLM Platform</h1>
            <p className="text-gray-600 mt-1">
              Advanced language models and AI analytics
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={trainModel}
              className="btn-primary px-4 py-2 flex items-center space-x-2"
              data-tooltip="Train a new AI model"
            >
              <FiBrain />
              <span>Train Model</span>
            </button>
            <button
              className="btn-outline px-4 py-2 flex items-center space-x-2"
              data-tooltip="Deploy model to production"
            >
              <FiZap />
              <span>Deploy</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiMessageSquare className="w-8 h-8 text-indigo-600" />
            <span className="text-sm text-indigo-600 font-medium">+18%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{aiStats.totalRequests.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">API Requests</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiZap className="w-8 h-8 text-yellow-600" />
            <span className="badge-warning">{aiStats.avgResponseTime}ms</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{aiStats.avgResponseTime}ms</h3>
          <p className="text-sm text-gray-600">Avg Response</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiCpu className="w-8 h-8 text-purple-600" />
            <span className="badge-primary">{aiStats.modelsDeployed}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{aiStats.modelsDeployed}</h3>
          <p className="text-sm text-gray-600">Models</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiTrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-sm text-green-600 font-medium">{aiStats.accuracy}%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{aiStats.accuracy}%</h3>
          <p className="text-sm text-gray-600">Accuracy</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiDatabase className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">{aiStats.tokensProcessed}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{aiStats.tokensProcessed}</h3>
          <p className="text-sm text-gray-600">Tokens</p>
        </motion.div>
      </div>

      {/* AI Playground */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Playground</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Model</label>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {models.map(model => (
                    <option key={model.name} value={model.name}>{model.name} - {model.type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Query</label>
                <textarea
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-32 resize-none"
                />
              </div>

              <button
                onClick={processQuery}
                disabled={processing}
                className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
              >
                <FiSend />
                <span>{processing ? 'Processing...' : 'Send Query'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Tokens: {maxTokens}
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Model Parameters:</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Temperature controls randomness</li>
                <li>• Higher values = more creative</li>
                <li>• Lower values = more focused</li>
                <li>• Max tokens limits response length</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceMetrics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="NCQ-GPT-4" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              <Radar name="Sentiment-BERT" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Usage Analytics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="requests" stroke="#6366f1" fillOpacity={1} fill="url(#colorRequests)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Models Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployed Models</h3>
          <div className="space-y-3">
            {models.map((model) => (
              <div
                key={model.name}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => toast.info(`Model ${model.name} details`)}
              >
                <div>
                  <p className="font-medium text-gray-900">{model.name}</p>
                  <p className="text-sm text-gray-600">{model.type} • {model.requests.toLocaleString()} requests</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{model.accuracy}%</p>
                    <p className="text-xs text-gray-500">accuracy</p>
                  </div>
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${model.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {model.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Conversations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h3>
          <div className="space-y-3">
            {conversations.map((conv) => (
              <div key={conv.id} className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{conv.user}</p>
                  <p className="text-xs text-gray-500">{conv.time}</p>
                </div>
                <p className="text-sm text-gray-700 mb-1">Q: {conv.query}</p>
                <p className="text-sm text-gray-600">A: {conv.response}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-sm p-6 text-white"
      >
        <h3 className="text-lg font-semibold mb-4">Platform Capabilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <FiMessageSquare className="w-5 h-5" />
            <span className="text-sm">Natural Language Processing</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCode className="w-5 h-5" />
            <span className="text-sm">Code Generation</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiGlobe className="w-5 h-5" />
            <span className="text-sm">Multi-language Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiBarChart className="w-5 h-5" />
            <span className="text-sm">Predictive Analytics</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LLMPlatform