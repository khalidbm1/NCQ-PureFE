import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  DollarSign, 
  Users, 
  TrendingUp,
  Target,
  Globe,
  Briefcase,
  PieChart
} from 'lucide-react';
import { RevenueLineChart, RevenueBarChart, RevenuePieChart } from '../components/charts/RevenueChart';
import AnimatedNumber from '../components/AnimatedNumber';
import { formatCurrency, formatCompactNumber, formatPercentage } from '../utils/formatters';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../contexts/CurrencyContext';

const FullPlatformAnalysis = () => {
  const { t } = useTranslation();
  const { displayCurrency } = useCurrency();

  // Data adjusted for 15M SAR budget
  const platformOverview = {
    totalInvestment: 15000000, // SAR 15M
    seriesA: 15000000,
    seriesB: 25000000,
    seriesC: 40000000,
    growth: 60000000,
    preIPO: 80000000,
    ipo: 120000000,
    year5Revenue: 142500000,
    year5Profit: 90500000,
    year5Margin: 0.635,
    marketCap2030: 450000000
  };

  const clientGrowthData = [
    { year: 'Year 1', healthcare: 25, hospitality: 15, ai: 87, pgw: 10, mobile: 10000 },
    { year: 'Year 2', healthcare: 75, hospitality: 65, ai: 708, pgw: 50, mobile: 50000 },
    { year: 'Year 3', healthcare: 150, hospitality: 250, ai: 2665, pgw: 200, mobile: 150000 },
    { year: 'Year 4', healthcare: 250, hospitality: 500, ai: 5000, pgw: 500, mobile: 250000 },
    { year: 'Year 5', healthcare: 450, hospitality: 1000, ai: 10000, pgw: 1000, mobile: 450000 }
  ];

  const revenueByProduct = [
    { year: 'Year 1', hospital: 2000000, hospitality: 300000, llm: 150000, pgw: 180000, mobile: 40000, platform: 130000 },
    { year: 'Year 2', hospital: 6000000, hospitality: 1800000, llm: 2100000, pgw: 1700000, mobile: 200000, platform: 400000 },
    { year: 'Year 3', hospital: 12000000, hospitality: 8100000, llm: 7400000, pgw: 6300000, mobile: 600000, platform: 800000 },
    { year: 'Year 4', hospital: 20000000, hospitality: 18400000, llm: 16000000, pgw: 18000000, mobile: 1000000, platform: 1400000 },
    { year: 'Year 5', hospital: 36000000, hospitality: 36800000, llm: 32000000, pgw: 36000000, mobile: 1800000, platform: 2500000 }
  ];

  const marketShareData = [
    { name: 'Healthcare Tech', value: 180000000, ncqShare: 0.20, color: '#3b82f6' },
    { name: 'Smart Hospitality', value: 144000000, ncqShare: 0.26, color: '#10b981' },
    { name: 'AI Platform', value: 135000000, ncqShare: 0.24, color: '#8b5cf6' },
    { name: 'Payment Gateway', value: 180000000, ncqShare: 0.20, color: '#f59e0b' },
    { name: 'Mobile Platform', value: 24000000, ncqShare: 0.075, color: '#ef4444' }
  ];

  const profitabilityData = [
    { year: 'Year 1', revenue: 2800000, costs: 3500000, profit: -700000, margin: -0.25 },
    { year: 'Year 2', revenue: 12200000, costs: 8500000, profit: 3700000, margin: 0.30 },
    { year: 'Year 3', revenue: 35200000, costs: 18000000, profit: 17200000, margin: 0.49 },
    { year: 'Year 4', revenue: 74800000, costs: 32000000, profit: 42800000, margin: 0.57 },
    { year: 'Year 5', revenue: 142500000, costs: 52000000, profit: 90500000, margin: 0.635 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-8 shadow-lg text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <Building size={32} />
          <h1 className="text-3xl font-bold">{t('analysis.full_platform_title')}</h1>
        </div>
        <p className="text-primary-100 text-lg mb-4">
          {t('analysis.full_platform_subtitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <p className="text-primary-200">{t('analysis.analysis_period')}</p>
            <p className="text-2xl font-semibold">2025-2030</p>
          </div>
          <div>
            <p className="text-primary-200">{t('mega_plan.total_products')}</p>
            <p className="text-2xl font-semibold">3 {t('navigation.products')}</p>
          </div>
          <div className="text-primary-200">
            {t('common.currency')}: {displayCurrency}
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600">
              <DollarSign size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('financial.initial_investment')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={platformOverview.totalInvestment} format="currency" />
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
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('financial.year_5_revenue')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={platformOverview.year5Revenue} format="currency" />
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
              <Target size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('financial.market_cap_2030')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={platformOverview.marketCap2030} format="currency" />
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
              <Users size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('analysis.total_properties')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={12450} format="number" suffix="+" />
          </p>
        </motion.div>
      </div>

      {/* Product Portfolio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('analysis.full_product_portfolio')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-blue-600 mb-2">{t('products.ncq_hms.name')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('products.ncq_hms.short_description')}</p>
            <p className="text-sm">{t('products.ncq_hms.target_market')}</p>
            <p className="font-bold mt-2">{formatCurrency(36000000, displayCurrency)}</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">{t('products.smart_hospitality.name')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('products.smart_hospitality.short_description')}</p>
            <p className="text-sm">{t('products.smart_hospitality.target_market')}</p>
            <p className="font-bold mt-2">{formatCurrency(36800000, displayCurrency)}</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-purple-600 mb-2">{t('products.ncq_llm.name')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('products.ncq_llm.short_description')}</p>
            <p className="text-sm">{t('products.ncq_llm.target_market')}</p>
            <p className="font-bold mt-2">{formatCurrency(32000000, displayCurrency)}</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-600 mb-2">{t('products.ncq_pgw.name')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('products.ncq_pgw.short_description')}</p>
            <p className="text-sm">{t('products.ncq_pgw.target_market')}</p>
            <p className="font-bold mt-2">{formatCurrency(36000000, displayCurrency)}</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-red-600 mb-2">{t('products.mobile_app.name')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('products.mobile_app.short_description')}</p>
            <p className="text-sm">{t('products.mobile_app.target_market')}</p>
            <p className="font-bold mt-2">{formatCurrency(1800000, displayCurrency)}</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-600 mb-2">{t('analysis.platform_services')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('analysis.shared_services')}</p>
            <p className="text-sm">{t('analysis.platform_features')}</p>
            <p className="font-bold mt-2">{formatCurrency(2500000, displayCurrency)}</p>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('charts.platform_revenue_profit_growth')}
          </h3>
          <RevenueLineChart data={profitabilityData} height={300} />
        </motion.div>

        {/* Market Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('charts.market_share_by_sector_2030')}
          </h3>
          <RevenuePieChart data={marketShareData} height={300} />
        </motion.div>
      </div>

      {/* Funding Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('financial.funding_strategy_timeline')}
        </h3>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
          <div className="space-y-6">
            {[
              { year: '2025', round: 'Series A', amount: 15000000, valuation: 50000000, use: t('financial.series_a_use') },
              { year: '2026', round: 'Series B', amount: 25000000, valuation: 100000000, use: t('financial.series_b_use') },
              { year: '2027', round: 'Series C', amount: 40000000, valuation: 200000000, use: t('financial.series_c_use') },
              { year: '2028', round: 'Growth', amount: 60000000, valuation: 300000000, use: t('financial.growth_use') },
              { year: '2029', round: 'Pre-IPO', amount: 80000000, valuation: 400000000, use: t('financial.pre_ipo_use') },
              { year: '2030', round: 'IPO', amount: 120000000, valuation: 450000000, use: t('financial.ipo_use') }
            ].map((item, index) => (
              <div key={index} className="relative flex items-start">
                <div className="absolute left-8 w-4 h-4 bg-primary-600 rounded-full -translate-x-1/2"></div>
                <div className="ml-16">
                  <div className="flex items-center gap-4 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">{item.year}</span>
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-sm">
                      {item.round}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(item.amount, displayCurrency)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('financial.valuation')}: {formatCurrency(item.valuation, displayCurrency)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Strategic Outlook */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Globe className="text-primary-600" size={24} />
          {t('analysis.strategic_outlook_vision_2030')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-blue-600 mb-2">{t('analysis.digital_transformation')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('analysis.digital_transformation_desc')}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">{t('analysis.economic_diversification')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('analysis.economic_diversification_desc')}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-purple-600 mb-2">{t('analysis.job_creation')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('analysis.job_creation_desc')}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-orange-600 mb-2">{t('analysis.innovation_hub')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('analysis.innovation_hub_desc')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FullPlatformAnalysis;