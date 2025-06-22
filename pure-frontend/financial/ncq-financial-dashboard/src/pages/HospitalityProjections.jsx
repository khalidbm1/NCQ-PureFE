import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../contexts/CurrencyContext';
import { Building2, Users, TrendingUp, DollarSign } from 'lucide-react';
import AnimatedNumber from '../components/AnimatedNumber';
import { formatCurrency } from '../utils/formatters';

const HospitalityProjections = () => {
  const { t } = useTranslation();
  const { displayCurrency } = useCurrency();
  
  const hospitalityData = {
    year1: { revenue: 300000, clients: 15, avgRevenue: 20000 },
    year2: { revenue: 1800000, clients: 65, avgRevenue: 27692 },
    year3: { revenue: 8100000, clients: 250, avgRevenue: 32400 },
    year4: { revenue: 18400000, clients: 500, avgRevenue: 36800 },
    year5: { revenue: 36800000, clients: 1000, avgRevenue: 36800 }
  };
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 shadow-lg text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <Building2 size={32} />
          <h1 className="text-3xl font-bold">
            {t('products.smart_hospitality.name')} - {t('projections.revenue_projections')}
          </h1>
        </div>
        <p className="text-green-100 text-lg">
          {t('products.smart_hospitality.description')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('financial.year_5_revenue')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={hospitalityData.year5.revenue} format="currency" />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600">
              <Users size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('analysis.total_clients_year_5')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={hospitalityData.year5.clients} format="number" />
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
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('analysis.avg_revenue_per_client')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={hospitalityData.year5.avgRevenue} format="currency" />
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('projections.target_market_overview')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">{t('products.smart_hospitality.hotels')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('products.smart_hospitality.hotels_desc')}
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-blue-600 mb-2">{t('products.smart_hospitality.buildings')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('products.smart_hospitality.buildings_desc')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HospitalityProjections;