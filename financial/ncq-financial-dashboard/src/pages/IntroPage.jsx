import React from 'react';
import { motion } from 'framer-motion';
import { Home, Rocket, BarChart3, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const IntroPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 shadow-lg text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <Home size={32} />
          <h1 className="text-3xl font-bold">{t('dashboard.welcome')}</h1>
        </div>
        <p className="text-primary-100 text-lg">
          {t('dashboard.description')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
        >
          <Rocket className="text-primary-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('intro.getting_started')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('intro.getting_started_desc')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
        >
          <BarChart3 className="text-green-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('intro.real_time_analytics')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('intro.real_time_desc')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
        >
          <DollarSign className="text-purple-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('intro.financial_insights')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('intro.financial_insights_desc')}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('intro.key_highlights')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-primary-600 mb-2">📊 {t('intro.multi_client_growth')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('intro.multi_client_desc')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-green-600 mb-2">💰 {t('intro.total_revenue_highlight')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('intro.total_revenue_desc')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-600 mb-2">🚀 {t('intro.roi_highlight')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('intro.roi_desc')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">⚡ {t('intro.payback_highlight')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('intro.payback_desc')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IntroPage;