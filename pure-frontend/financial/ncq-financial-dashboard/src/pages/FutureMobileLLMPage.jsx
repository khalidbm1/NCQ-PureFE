import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Rocket,
  Mic,
  MessageSquare,
  Cpu,
  Zap
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useTranslation } from 'react-i18next';

const FutureMobileLLMPage = () => {
  const { t } = useTranslation();

  const features = [
    "Edge AI Processing",
    "Voice Interaction in Arabic", 
    "Offline Model Inference",
    "Mobile-Optimized Models",
    "Real-time Translation",
    "Context-Aware Assistance",
    "Privacy-First Design",
    "Native Performance"
  ];

  const timeline = [
    { phase: "Phase 1", period: "Months 12-13", status: "planned", tasks: ["Model Optimization", "Mobile Integration", "Basic Voice"] },
    { phase: "Phase 2", period: "Months 13-14", status: "planned", tasks: ["Advanced Features", "Offline Inference", "Performance Tuning"] },
    { phase: "Phase 3", period: "Months 14-15", status: "planned", tasks: ["Beta Testing", "Public Launch", "Enterprise Features"] }
  ];

  const capabilities = [
    { 
      name: "Arabic Voice Assistant", 
      icon: Mic, 
      description: "Natural voice interaction in Saudi dialect",
      accuracy: "95%+" 
    },
    { 
      name: "Offline AI Processing", 
      icon: Cpu, 
      description: "Local inference without internet dependency",
      speed: "< 100ms" 
    },
    { 
      name: "Smart Translation", 
      icon: MessageSquare, 
      description: "Real-time Arabic-English translation",
      languages: "20+" 
    },
    { 
      name: "Edge Computing", 
      icon: Zap, 
      description: "On-device processing for privacy",
      privacy: "100%" 
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            NCQ Mobile LLM
          </h1>
          <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Coming Soon</span>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Mobile-optimized AI assistant with offline inference capabilities. 
          Native Arabic support with edge computing for ultimate privacy and performance.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Launch Timeline"
          value="12-15 Months"
          icon={Calendar}
          trend={{ value: 0, isPositive: true }}
          color="blue"
        />
        <MetricCard
          title="Model Accuracy"
          value="95%+ Arabic"
          icon={Brain}
          trend={{ value: 0, isPositive: true }}
          color="green"
        />
        <MetricCard
          title="Response Time"
          value="< 100ms"
          icon={Zap}
          trend={{ value: 0, isPositive: true }}
          color="yellow"
        />
        <MetricCard
          title="Projected Revenue"
          value="SAR 35M (Y3)"
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
          color="emerald"
        />
      </div>

      {/* AI Capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Brain className="w-6 h-6 text-indigo-500" />
          AI Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <capability.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {capability.name}
                    </h3>
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {capability.accuracy || capability.speed || capability.languages || capability.privacy}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {capability.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <Brain className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Technical Architecture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Cpu className="w-6 h-6 text-blue-500" />
          Technical Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cpu className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Edge Processing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              On-device inference using optimized neural networks for instant responses.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Model Optimization</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quantized models optimized for mobile hardware with minimal battery impact.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Arabic Excellence</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Purpose-built for Arabic language with dialect recognition and cultural context.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Development Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-500" />
          Development Timeline
        </h2>
        <div className="space-y-6">
          {timeline.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {phase.phase}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {phase.period}
                    </span>
                    <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                      <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                        Planned
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {phase.tasks.map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2"
                      >
                        {task}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {index < timeline.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg p-8 text-center text-white"
      >
        <Rocket className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Experience the Future of Mobile AI</h2>
        <p className="text-lg opacity-90 mb-6">
          Be among the first to try the most advanced Arabic AI assistant built for mobile.
        </p>
        <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Join AI Beta Program
        </button>
      </motion.div>
    </div>
  );
};

export default FutureMobileLLMPage;