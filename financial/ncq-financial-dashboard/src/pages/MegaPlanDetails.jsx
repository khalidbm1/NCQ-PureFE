import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Layers, Cog, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MegaPlanDetails = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 shadow-lg text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <FileText size={32} />
          <h1 className="text-3xl font-bold">{t('navigation.detailed_plan')}</h1>
        </div>
        <p className="text-indigo-100 text-lg">
          {t('mega_plan.subtitle')}
        </p>
      </motion.div>

      {/* Implementation Framework */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('mega_plan.implementation_framework')}
        </h3>
        <div className="space-y-6">
          {[
            {
              phase: t('mega_plan.phase_1_foundation'),
              duration: '2025-2026',
              color: 'blue',
              objectives: [
                t('mega_plan.establish_teams'),
                t('mega_plan.launch_mvp'),
                t('mega_plan.secure_series_a'),
                t('mega_plan.build_infrastructure')
              ]
            },
            {
              phase: t('mega_plan.phase_2_growth'),
              duration: '2027-2028',
              color: 'green',
              objectives: [
                t('mega_plan.scale_products'),
                t('mega_plan.expand_gcc'),
                t('mega_plan.achieve_series_b'),
                t('mega_plan.build_partnerships')
              ]
            },
            {
              phase: t('mega_plan.phase_3_leadership'),
              duration: '2029-2030',
              color: 'purple',
              objectives: [
                t('mega_plan.dominate_markets'),
                t('mega_plan.prepare_ipo'),
                t('mega_plan.global_expansion'),
                t('mega_plan.innovation_leadership')
              ]
            }
          ].map((phase, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className={`w-3 h-3 rounded-full bg-${phase.color}-500`}
                ></div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{phase.phase}</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">({phase.duration})</span>
              </div>
              <ul className="space-y-1">
                {phase.objectives.map((objective, objIndex) => (
                  <li key={objIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Technology Architecture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('mega_plan.technology_architecture')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-primary-600">{t('mega_plan.core_technologies')}</h4>
            <div className="space-y-2">
              {[
                'Cloud-native microservices',
                'AI/ML infrastructure',
                'Blockchain integration',
                'IoT platform',
                'Real-time analytics'
              ].map((tech, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Cog size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t(`mega_plan.tech_${index + 1}`)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-green-600">{t('mega_plan.platform_services')}</h4>
            <div className="space-y-2">
              {[
                'Authentication & authorization',
                'Notification service',
                'File storage & CDN',
                'Analytics platform',
                'API gateway'
              ].map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Layers size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t(`mega_plan.service_${index + 1}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Market Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('mega_plan.market_entry_strategy')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              market: 'Saudi Arabia',
              timeline: '2025-2026',
              focus: 'Domestic market penetration',
              targets: ['Government entities', 'Large enterprises', 'Healthcare sector']
            },
            {
              market: 'GCC Region',
              timeline: '2027-2028',
              focus: 'Regional expansion',
              targets: ['UAE enterprises', 'Qatar government', 'Kuwait SMEs']
            },
            {
              market: 'MENA',
              timeline: '2029-2030',
              focus: 'Market leadership',
              targets: ['Egypt market', 'Jordan tech sector', 'Morocco innovation']
            }
          ].map((strategy, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={20} className="text-primary-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">{strategy.market}</h4>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">{strategy.timeline}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{strategy.focus}</p>
                <ul className="space-y-1">
                  {strategy.targets.map((target, targetIndex) => (
                    <li key={targetIndex} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                      {target}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Success Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('mega_plan.key_success_metrics')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { metric: 'Revenue Growth', target: '100% YoY', icon: '📈' },
            { metric: 'Market Share', target: '15-30%', icon: '🎯' },
            { metric: 'Client Retention', target: '95%+', icon: '🤝' },
            { metric: 'Employee Growth', target: '3,500+', icon: '👥' }
          ].map((kpi, index) => (
            <div key={index} className="bg-white dark:bg-dark-card rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{kpi.icon}</div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{kpi.metric}</h4>
              <p className="text-lg font-bold text-primary-600">{kpi.target}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MegaPlanDetails;