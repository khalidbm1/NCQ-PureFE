import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CreditCard, Brain, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProjectionsPage = ({ setActivePage }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <TrendingUp size={32} className="text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('projections.revenue_projections')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          {t('projections.market_analysis')} NCQ {t('navigation.products')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setActivePage('pgw-projections')}
        >
          <CreditCard size={48} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {t('navigation.pgw_projections')}
          </h3>
          <p className="text-blue-100">
            {t('products.ncq_pgw.description')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg text-white hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setActivePage('llm-projections')}
        >
          <Brain size={48} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {t('navigation.llm_projections')}
          </h3>
          <p className="text-purple-100">
            {t('products.ncq_llm.description')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white hover:shadow-xl transition-all cursor-pointer"
          onClick={() => setActivePage('hospitality-projections')}
        >
          <Building2 size={48} className="mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {t('navigation.hospitality_projections')}
          </h3>
          <p className="text-green-100">
            {t('products.smart_hospitality.description')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectionsPage;