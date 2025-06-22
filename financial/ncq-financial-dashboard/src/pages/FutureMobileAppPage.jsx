import React from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Rocket,
  Download,
  Globe,
  Wifi,
  Lock
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useTranslation } from 'react-i18next';

const FutureMobileAppPage = () => {
  const { t } = useTranslation();

  const features = [
    "Cross-platform Access (iOS/Android)",
    "Offline Capabilities", 
    "Biometric Authentication",
    "Push Notifications",
    "Mobile Workforce Tools",
    "Field Operations Support",
    "Real-time Synchronization",
    "Native Performance"
  ];

  const timeline = [
    { phase: "Phase 1", period: "Months 11-12", status: "planned", tasks: ["Core App Architecture", "Authentication", "Basic Features"] },
    { phase: "Phase 2", period: "Months 12-13", status: "planned", tasks: ["Offline Sync", "Advanced Features", "Platform Integration"] },
    { phase: "Phase 3", period: "Months 13-14", status: "planned", tasks: ["App Store Launch", "User Onboarding", "Support Systems"] }
  ];

  const platforms = [
    { name: "iOS App Store", icon: Smartphone, status: "Planned", users: "2M+ Saudi Users" },
    { name: "Google Play Store", icon: Smartphone, status: "Planned", users: "8M+ Saudi Users" },
    { name: "Web Progressive App", icon: Globe, status: "Planned", users: "Universal Access" },
    { name: "Enterprise Distribution", icon: Lock, status: "Planned", users: "B2B Clients" }
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
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <Smartphone className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            NCQ Mobile App
          </h1>
          <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Coming Soon</span>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Mobile platform providing access to all NCQ services on-the-go. 
          Built for Saudi mobile workforce with offline capabilities and native performance.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Launch Timeline"
          value="11-14 Months"
          icon={Calendar}
          trend={{ value: 0, isPositive: true }}
          color="blue"
        />
        <MetricCard
          title="Target Market"
          value="10M+ Mobile Users"
          icon={Users}
          trend={{ value: 0, isPositive: true }}
          color="green"
        />
        <MetricCard
          title="Expected Downloads"
          value="500K+ in Y1"
          icon={Download}
          trend={{ value: 0, isPositive: true }}
          color="purple"
        />
        <MetricCard
          title="Projected Revenue"
          value="SAR 25M (Y3)"
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
          color="emerald"
        />
      </div>

      {/* Platform Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-500" />
          Platform Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center"
            >
              <platform.icon className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <div className="font-semibold text-gray-900 dark:text-white mb-2">
                {platform.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {platform.users}
              </div>
              <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                  {platform.status}
                </span>
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
              <Smartphone className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mobile-First Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Wifi className="w-6 h-6 text-green-500" />
          Mobile-First Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wifi className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Offline-First</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Full functionality without internet connection. Sync when connected.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Security-First</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Biometric authentication and end-to-end encryption for all data.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance-First</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Native performance with React Native and optimized for Saudi networks.
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
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
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
        className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg p-8 text-center text-white"
      >
        <Rocket className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Take NCQ with You Everywhere</h2>
        <p className="text-lg opacity-90 mb-6">
          Be the first to experience the power of NCQ platform in your pocket.
        </p>
        <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Pre-register for Beta
        </button>
      </motion.div>
    </div>
  );
};

export default FutureMobileAppPage;