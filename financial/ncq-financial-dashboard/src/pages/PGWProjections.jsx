import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../contexts/CurrencyContext';
import { 
  CreditCard, 
  Users, 
  TrendingUp, 
  DollarSign,
  Target,
  Globe,
  Building2,
  Zap,
  Shield,
  BarChart3,
  PieChart,
  Calendar,
  AlertCircle
} from 'lucide-react';
import AnimatedNumber from '../components/AnimatedNumber';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import { RevenueLineChart, RevenueBarChart, RevenuePieChart } from '../components/charts/RevenueChart';

const PGWProjections = () => {
  const { t } = useTranslation();
  const { displayCurrency } = useCurrency();
  const [selectedYear, setSelectedYear] = useState(1);
  
  // Enhanced data from the MD file
  const pgwData = {
    market: {
      totalVolume: 450000000000, // SAR 450B
      onlineGrowth: 0.70,
      digitalWalletAdoption: 0.60,
      ecommerceGrowth: 0.35,
      b2bPayments: 150000000000 // SAR 150B
    },
    pricing: {
      standard: { rate: 0.029, fixed: 1.13 },
      enterprise: { rate: 0.025, fixed: 0.94 },
      b2b: { rate: 0.015, fixed: 0 },
      government: { rate: 0.012, fixed: 0 }
    },
    projections: [
      { 
        year: 1, 
        clients: 10, 
        monthlyVolume: 18750000,
        revenue: 2973525,
        merchants: 10,
        avgRevenue: 297353,
        growth: 0
      },
      { 
        year: 2, 
        clients: 50, 
        monthlyVolume: 93750000,
        revenue: 31722750,
        merchants: 50,
        avgRevenue: 634455,
        growth: 9.66
      },
      { 
        year: 3, 
        clients: 200, 
        monthlyVolume: 375000000,
        revenue: 116091000,
        merchants: 200,
        avgRevenue: 580455,
        growth: 2.66
      },
      { 
        year: 4, 
        clients: 500, 
        monthlyVolume: 1125000000,
        revenue: 329850000,
        merchants: 500,
        avgRevenue: 659700,
        growth: 1.84
      },
      { 
        year: 5, 
        clients: 1000, 
        monthlyVolume: 2250000000,
        revenue: 648000000,
        merchants: 1000,
        avgRevenue: 648000,
        growth: 0.97
      }
    ],
    monthlyGrowth: [
      { month: 1, clients: 1, revenue: 50621 },
      { month: 2, clients: 1, revenue: 50621 },
      { month: 3, clients: 1, revenue: 50621 },
      { month: 4, clients: 3, revenue: 159364 },
      { month: 5, clients: 3, revenue: 159364 },
      { month: 6, clients: 3, revenue: 159364 },
      { month: 7, clients: 5, revenue: 268106 },
      { month: 8, clients: 7, revenue: 375549 },
      { month: 9, clients: 8, revenue: 429270 },
      { month: 10, clients: 9, revenue: 482991 },
      { month: 11, clients: 10, revenue: 536213 },
      { month: 12, clients: 10, revenue: 536213 }
    ]
  };

  const currentData = pgwData.projections[selectedYear - 1];

  const marketDistribution = [
    { name: t('pgw.ecommerce'), value: 35, color: '#3b82f6' },
    { name: t('pgw.b2b_payments'), value: 33, color: '#8b5cf6' },
    { name: t('pgw.digital_wallets'), value: 20, color: '#10b981' },
    { name: t('pgw.government_services'), value: 12, color: '#f59e0b' }
  ];

  const costStructure = [
    { name: t('pgw.payment_network_fees'), value: 35, color: '#ef4444' },
    { name: t('pgw.infrastructure'), value: 15, color: '#f59e0b' },
    { name: t('pgw.sales_marketing'), value: 20, color: '#3b82f6' },
    { name: t('pgw.operations'), value: 15, color: '#8b5cf6' },
    { name: t('pgw.rd'), value: 10, color: '#10b981' },
    { name: t('pgw.profit_margin'), value: 5, color: '#06b6d4' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 shadow-lg text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <CreditCard size={32} />
          <h1 className="text-3xl font-bold">
            {t('products.ncq_pgw.name')} - {t('projections.revenue_projections')}
          </h1>
        </div>
        <p className="text-blue-100 text-lg mb-4">
          {t('products.ncq_pgw.description')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <p className="text-blue-200">{t('pgw.market')}</p>
            <p className="text-2xl font-semibold">{t('pgw.saudi_gcc')}</p>
          </div>
          <div>
            <p className="text-blue-200">{t('pgw.time_frame')}</p>
            <p className="text-2xl font-semibold">{t('pgw.five_years')}</p>
          </div>
          <div>
            <p className="text-blue-200">{t('common.currency')}</p>
            <p className="text-2xl font-semibold">{displayCurrency}</p>
          </div>
        </div>
      </motion.div>

      {/* Market Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('pgw.saudi_digital_payments_market')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('pgw.total_transaction_volume')}</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(pgwData.market.totalVolume, displayCurrency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('pgw.online_transactions_growth')}</span>
              <span className="font-bold text-green-600">
                {formatPercentage(pgwData.market.onlineGrowth)} {t('common.yoy')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('pgw.digital_wallet_adoption')}</span>
              <span className="font-bold text-blue-600">
                {formatPercentage(pgwData.market.digitalWalletAdoption)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('pgw.ecommerce_growth')}</span>
              <span className="font-bold text-purple-600">
                {formatPercentage(pgwData.market.ecommerceGrowth)} {t('common.annually')}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('pgw.market_distribution')}
          </h3>
          <RevenuePieChart data={marketDistribution} height={250} />
        </motion.div>
      </div>

      {/* Year Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('pgw.select_projection_year')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedYear === year
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {t('common.year')} {year}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics for Selected Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600">
              <DollarSign size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('pgw.annual_revenue')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={currentData.revenue} format="currency" />
          </p>
          {selectedYear > 1 && (
            <p className="text-sm text-green-600 mt-1">
              +{formatPercentage(currentData.growth)}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600">
              <Users size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('pgw.active_merchants')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={currentData.merchants} format="number" />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('pgw.monthly_volume')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={currentData.monthlyVolume} format="currency" />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">
              <Target size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('pgw.avg_revenue_per_merchant')}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={currentData.avgRevenue} format="currency" />
          </p>
        </motion.div>
      </div>

      {/* Pricing Model */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('pgw.pricing_model')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-blue-600 mb-2">🛍️ {t('pgw.standard_rate')}</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPercentage(pgwData.pricing.standard.rate)} + {formatCurrency(pgwData.pricing.standard.fixed, displayCurrency)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('pgw.per_transaction')}</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">🏢 {t('pgw.enterprise_rate')}</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPercentage(pgwData.pricing.enterprise.rate)} + {formatCurrency(pgwData.pricing.enterprise.fixed, displayCurrency)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('pgw.per_transaction')}</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-purple-600 mb-2">💼 {t('pgw.b2b_rate')}</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPercentage(pgwData.pricing.b2b.rate)} {t('pgw.flat')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('pgw.no_fixed_fee')}</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-600 mb-2">🏛️ {t('pgw.government_rate')}</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPercentage(pgwData.pricing.government.rate)} {t('pgw.flat')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('pgw.no_fixed_fee')}</p>
          </div>
        </div>
      </motion.div>

      {/* Year 1 Monthly Growth */}
      {selectedYear === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('pgw.year_1_monthly_growth')}
          </h3>
          <RevenueLineChart 
            data={pgwData.monthlyGrowth.map(m => ({
              year: `${t('common.month')} ${m.month}`,
              revenue: m.revenue,
              clients: m.clients * 10000 // Scale for visibility
            }))} 
            height={300} 
          />
        </motion.div>
      )}

      {/* Cost Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('pgw.cost_structure')}
          </h3>
          <RevenuePieChart data={costStructure} height={300} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('pgw.key_success_factors')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="text-blue-600 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{t('pgw.superior_technology')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('pgw.superior_technology_desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="text-green-600 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{t('pgw.local_expertise')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('pgw.local_expertise_desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="text-purple-600 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{t('pgw.growth_strategy')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('pgw.growth_strategy_desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="text-yellow-600 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{t('pgw.strategic_partnerships')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('pgw.strategic_partnerships_desc')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 5-Year Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('pgw.five_year_summary')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-900 dark:text-white">{t('common.year')}</th>
                <th className="text-right py-3 px-4 text-gray-900 dark:text-white">{t('pgw.clients')}</th>
                <th className="text-right py-3 px-4 text-gray-900 dark:text-white">{t('pgw.monthly_volume')}</th>
                <th className="text-right py-3 px-4 text-gray-900 dark:text-white">{t('pgw.annual_revenue')}</th>
                <th className="text-right py-3 px-4 text-gray-900 dark:text-white">{t('common.growth')}</th>
              </tr>
            </thead>
            <tbody>
              {pgwData.projections.map((year, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{year.year}</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">{formatNumber(year.clients)}</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">{formatCurrency(year.monthlyVolume, displayCurrency)}</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">{formatCurrency(year.revenue, displayCurrency)}</td>
                  <td className="text-right py-3 px-4">
                    {year.growth > 0 ? (
                      <span className="text-green-600">+{formatPercentage(year.growth)}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Conclusion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('pgw.conclusion')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('pgw.conclusion_text')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-dark-card rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-600 mb-1">1</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('pgw.starting_client')}</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-600 mb-1">{formatCurrency(648000000, displayCurrency)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('pgw.year_5_revenue')}</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-600 mb-1">2-3%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('pgw.market_share')}</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600 mb-1">#1</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('pgw.market_position')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PGWProjections;