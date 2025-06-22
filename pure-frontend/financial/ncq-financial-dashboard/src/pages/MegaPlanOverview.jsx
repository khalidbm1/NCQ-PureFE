import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Target, Calendar, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MegaPlanOverview = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-8 shadow-lg text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <Briefcase size={32} />
          <h1 className="text-3xl font-bold">{t('mega_plan.title')}</h1>
        </div>
        <p className="text-orange-100 text-lg">
          {t('mega_plan.subtitle')}
        </p>
      </motion.div>

      {/* Key Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600">
              <Target size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('mega_plan.market_leadership')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {t('mega_plan.number_one_mena')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600">
              <Calendar size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('common.timeline')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {t('mega_plan.five_years')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600">
              <Users size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('mega_plan.team_size')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {t('mega_plan.team_count')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">
              <Briefcase size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('navigation.products')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {t('mega_plan.products_count')}
          </p>
        </motion.div>
      </div>

      {/* Plan Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('mega_plan.strategic_phases')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('mega_plan.foundation_phase')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('mega_plan.foundation_desc')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('mega_plan.growth_phase')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('mega_plan.growth_desc')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('mega_plan.leadership_phase')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('mega_plan.leadership_desc')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Vision 2030 Alignment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('analysis.vision_2030_alignment')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">{t('analysis.economic_diversification')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('analysis.economic_diversification_desc')}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-blue-600 mb-2">{t('analysis.digital_transformation')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('analysis.digital_transformation_desc')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MegaPlanOverview;