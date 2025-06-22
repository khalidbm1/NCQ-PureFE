import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Rocket,
  Link
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useTranslation } from 'react-i18next';

const FutureBlockchainSuitePage = () => {
  const { t } = useTranslation();

  const features = [
    "Supply Chain Traceability",
    "Self-Sovereign Identity (SSI)", 
    "Smart Contract Platform",
    "Asset Tokenization",
    "Islamic Finance Instruments",
    "Halal Supply Chain Verification",
    "Real Estate Tokenization",
    "Sukuk Digital Issuance"
  ];

  const timeline = [
    { phase: "Phase 1", period: "Months 3-6", status: "planned", tasks: ["Blockchain Infrastructure", "Identity Management", "Smart Contracts"] },
    { phase: "Phase 2", period: "Months 6-9", status: "planned", tasks: ["Supply Chain Module", "Asset Tokenization", "Islamic Finance Tools"] },
    { phase: "Phase 3", period: "Months 9-12", status: "planned", tasks: ["Enterprise Integration", "Compliance Tools", "Production Launch"] }
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
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            NCQ Blockchain Suite
          </h1>
          <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Coming Soon</span>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Enterprise blockchain solutions for supply chain, digital identity, and asset tokenization. 
          Built for Islamic finance and Saudi Vision 2030 compliance.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Launch Timeline"
          value="9-12 Months"
          icon={Calendar}
          trend={{ value: 0, isPositive: true }}
          color="blue"
        />
        <MetricCard
          title="Target Market"
          value="$67B Blockchain"
          icon={TrendingUp}
          trend={{ value: 0, isPositive: true }}
          color="green"
        />
        <MetricCard
          title="Expected Clients"
          value="200+ Enterprise"
          icon={Users}
          trend={{ value: 0, isPositive: true }}
          color="purple"
        />
        <MetricCard
          title="Projected Revenue"
          value="SAR 78M (Y5)"
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
          color="emerald"
        />
      </div>

      {/* Feature Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          Key Features
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
              <Link className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Development Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
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

      {/* Islamic Finance Compliance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-500" />
          Islamic Finance Compliance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Sharia-Compliant Features</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Sukuk Digital Issuance Platform
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Halal Supply Chain Verification
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Islamic Asset Tokenization
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Regulatory Compliance</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                SAMA Regulatory Framework
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Vision 2030 Alignment
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                GDPR & Data Protection
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg p-8 text-center text-white"
      >
        <Rocket className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Transform Your Business with Blockchain</h2>
        <p className="text-lg opacity-90 mb-6">
          Be part of the blockchain revolution with Sharia-compliant enterprise solutions.
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Request Early Access
        </button>
      </motion.div>
    </div>
  );
};

export default FutureBlockchainSuitePage;