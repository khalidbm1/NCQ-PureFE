import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FinancialAnalysisPage = ({ setActivePage }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <DollarSign size={32} className="text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('navigation.financial_analysis')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          {t('analysis.financial_analysis_desc')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setActivePage('all-products-analysis')}
        >
          <FileText size={48} className="text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('analysis.all_products_title')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('analysis.all_products_subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setActivePage('full-platform-analysis')}
        >
          <BarChart3 size={48} className="text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('analysis.full_platform_title')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('analysis.full_platform_subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setActivePage('single-client-analysis')}
        >
          <TrendingUp size={48} className="text-green-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('analysis.single_client_title')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('analysis.single_client_subtitle')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialAnalysisPage;