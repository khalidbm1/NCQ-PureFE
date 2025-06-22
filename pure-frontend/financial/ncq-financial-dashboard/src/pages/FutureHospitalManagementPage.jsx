import React from 'react';
import { motion } from 'framer-motion';
import { 
  Hospital, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Rocket,
  Heart,
  FileText,
  Shield
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useTranslation } from 'react-i18next';

const FutureHospitalManagementPage = () => {
  const { t } = useTranslation();

  const features = [
    "Electronic Health Records (EHR)",
    "Patient Management System", 
    "Clinical Workflow Automation",
    "NPHIES Integration",
    "Telemedicine Platform",
    "Medical Records Management",
    "Clinical Decision Support",
    "Healthcare Analytics"
  ];

  const timeline = [
    { phase: "Phase 1", period: "Months 8-10", status: "planned", tasks: ["EHR System Core", "Patient Management", "Basic Workflows"] },
    { phase: "Phase 2", period: "Months 10-12", status: "planned", tasks: ["NPHIES Integration", "Telemedicine", "Clinical Tools"] },
    { phase: "Phase 3", period: "Months 12-14", status: "planned", tasks: ["Advanced Analytics", "AI Diagnostics", "Production Launch"] }
  ];

  const hospitalTypes = [
    { name: "Government Hospitals", count: "289", market: "Primary Target" },
    { name: "Private Hospitals", count: "162", market: "Secondary Target" },
    { name: "Specialty Clinics", count: "2,400+", market: "Growth Market" },
    { name: "Medical Centers", count: "5,000+", market: "Volume Market" }
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
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <Hospital className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            NCQ Hospital Management
          </h1>
          <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Coming Soon</span>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Comprehensive healthcare management system designed for Saudi hospitals with full NPHIES integration, 
          telemedicine capabilities, and AI-powered clinical decision support.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Launch Timeline"
          value="8-14 Months"
          icon={Calendar}
          trend={{ value: 0, isPositive: true }}
          color="blue"
        />
        <MetricCard
          title="Target Market"
          value="$8.2B Healthcare IT"
          icon={TrendingUp}
          trend={{ value: 0, isPositive: true }}
          color="green"
        />
        <MetricCard
          title="Target Hospitals"
          value="450+ Facilities"
          icon={Hospital}
          trend={{ value: 0, isPositive: true }}
          color="red"
        />
        <MetricCard
          title="Projected Revenue"
          value="SAR 92M (Y5)"
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
          color="emerald"
        />
      </div>

      {/* Saudi Healthcare Market */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Heart className="w-6 h-6 text-red-500" />
          Saudi Healthcare Market
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hospitalTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                {type.count}
              </div>
              <div className="font-semibold text-gray-900 dark:text-white mb-1">
                {type.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {type.market}
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
              <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* NPHIES Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-500" />
          NPHIES Integration & Compliance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">NPHIES Features</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Real-time Claims Processing
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Pre-authorization Management
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Insurance Eligibility Verification
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Automated Billing Integration
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Regulatory Compliance</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                MOH Standards Compliance
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                HIPAA-level Security
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Arabic Language Support
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Saudi Data Residency
              </li>
            </ul>
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
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
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
        className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg p-8 text-center text-white"
      >
        <Rocket className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Transform Healthcare Management</h2>
        <p className="text-lg opacity-90 mb-6">
          Partner with us to revolutionize healthcare delivery in Saudi Arabia with cutting-edge HIS technology.
        </p>
        <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Schedule Demo
        </button>
      </motion.div>
    </div>
  );
};

export default FutureHospitalManagementPage;