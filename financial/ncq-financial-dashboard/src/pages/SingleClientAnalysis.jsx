import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  DollarSign, 
  Package, 
  TrendingUp,
  CreditCard,
  Brain,
  Building2,
  AlertCircle
} from 'lucide-react';
import { RevenueLineChart, RevenueBarChart, RevenuePieChart } from '../components/charts/RevenueChart';
import AnimatedNumber from '../components/AnimatedNumber';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../contexts/CurrencyContext';

const SingleClientAnalysis = () => {
  const { t } = useTranslation();
  const { displayCurrency } = useCurrency();
  const showUSD = displayCurrency === 'USD';

  // Data from the MD file
  const clientData = {
    pgw: {
      monthlyLicense: 37500,
      annualRevenue: 450000,
      fiveYearRevenue: 2250000,
      setupFee: 18750,
      transactionFee: 0.025,
      marketingCost: 67500,
      netRevenue: 382500
    },
    llm: {
      monthlyLicense: 18750,
      annualRevenue: 225000,
      fiveYearRevenue: 1125000,
      tokens: "20M",
      support: "Priority",
      marketingCost: 45000,
      netRevenue: 180000
    },
    hospitality: {
      monthlyLicense: 37500,
      annualRevenue: 450000,
      fiveYearRevenue: 2250000,
      rooms: "Unlimited",
      features: "All",
      marketingCost: 90000,
      netRevenue: 360000
    }
  };

  const totalMetrics = {
    monthlyRevenue: 93750,
    annualRevenue: 1125000,
    fiveYearRevenue: 5625000,
    totalMarketingCost: 1377387,
    netRevenue: 6274761,
    netProfit: 1685272,
    profitMargin: 0.22,
    clv: 6274761,
    arpu: 1254952,
    cac: 206213,
    ltvCacRatio: 30.4
  };

  const yearlyProgression = [
    { year: 'Year 1', pgw: 450000, llm: 225000, hospitality: 450000, total: 1125000, profit: 247500 },
    { year: 'Year 2', pgw: 472500, llm: 236250, hospitality: 472500, total: 1181250, profit: 259875 },
    { year: 'Year 3', pgw: 496125, llm: 248063, hospitality: 496125, total: 1240313, profit: 272869 },
    { year: 'Year 4', pgw: 520931, llm: 260466, hospitality: 520931, total: 1302328, profit: 286512 },
    { year: 'Year 5', pgw: 574326, llm: 287163, hospitality: 574326, total: 1435817, profit: 315879 }
  ];

  const pricingTiers = {
    pgw: [
      { tier: 'Enterprise', monthly: 37500, setup: 18750, transaction: 0.025 },
      { tier: 'Professional', monthly: 11246, setup: 5623, transaction: 0.029 },
      { tier: 'Starter', monthly: 1121, setup: 0, transaction: 0.029 }
    ],
    llm: [
      { tier: 'Government', monthly: 375000, tokens: 'Unlimited', support: '24/7' },
      { tier: 'Enterprise', monthly: 18746, tokens: '20M', support: 'Priority' },
      { tier: 'Professional', monthly: 3746, tokens: '2M', support: 'Business' },
      { tier: 'Starter', monthly: 371, tokens: '100K', support: 'Email' }
    ],
    hospitality: [
      { tier: 'Enterprise', monthly: 37496, rooms: 'Unlimited', features: 'All' },
      { tier: 'Professional', monthly: 11246, rooms: 200, features: 'Advanced' },
      { tier: 'Starter', monthly: 3746, rooms: 50, features: 'Basic' }
    ]
  };

  const revenueDistribution = [
    { name: 'NCQ PGW', value: clientData.pgw.fiveYearRevenue, color: '#3b82f6' },
    { name: 'NCQ LLM', value: clientData.llm.fiveYearRevenue, color: '#8b5cf6' },
    { name: 'Smart Hospitality', value: clientData.hospitality.fiveYearRevenue, color: '#10b981' }
  ];

  const marketingDistribution = [
    { name: 'NCQ PGW', value: 459129, color: '#3b82f6' },
    { name: 'NCQ LLM', value: 306086, color: '#8b5cf6' },
    { name: 'Smart Hospitality', value: 612172, color: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 shadow-lg text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <User size={32} />
          <h1 className="text-3xl font-bold">{t('analysis.single_client_analysis')} - {t('analysis.three_product_bundle')}</h1>
        </div>
        <p className="text-indigo-100 text-lg mb-4">
          {t('analysis.single_client_subtitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <p className="text-indigo-200">{t('common.client_type')}</p>
            <p className="text-2xl font-semibold">{t('common.enterprise')}</p>
          </div>
          <div>
            <p className="text-indigo-200">{t('analysis.products_licensed')}</p>
            <p className="text-2xl font-semibold">{t('analysis.three_products')}</p>
          </div>
          <div className="text-indigo-200">
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
            <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600">
              <DollarSign size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">Monthly Revenue</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={totalMetrics.monthlyRevenue} format="currency" />
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {showUSD && formatCurrency(totalMetrics.monthlyRevenue, 'USD')}
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
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">5-Year Revenue</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            <AnimatedNumber value={totalMetrics.fiveYearRevenue} format="currency" />
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {showUSD && formatCurrency(totalMetrics.fiveYearRevenue, 'USD')}
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
              <Package size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">LTV:CAC Ratio</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {totalMetrics.ltvCacRatio}:1
          </p>
          <p className="text-xs text-green-600 mt-1">Excellent</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">
              <AlertCircle size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">Client Concentration</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">100%</p>
          <p className="text-xs text-red-600 mt-1">High Risk</p>
        </motion.div>
      </div>

      {/* Product Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { key: 'pgw', name: 'NCQ Payment Gateway', icon: CreditCard, color: '#3b82f6', data: clientData.pgw },
          { key: 'llm', name: 'NCQ LLM Platform', icon: Brain, color: '#8b5cf6', data: clientData.llm },
          { key: 'hospitality', name: 'Smart Hospitality', icon: Building2, color: '#10b981', data: clientData.hospitality }
        ].map((product, index) => {
          const Icon = product.icon;
          return (
            <motion.div
              key={product.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg border-t-4"
              style={{ borderTopColor: product.color }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${product.color}20`, color: product.color }}>
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Monthly License</span>
                  <span className="font-bold">
                    {formatCurrency(product.data.monthlyLicense, showUSD ? 'USD' : 'SAR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Annual Revenue</span>
                  <span className="font-bold">
                    {formatCurrency(product.data.annualRevenue, showUSD ? 'USD' : 'SAR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">5-Year Total</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(product.data.fiveYearRevenue, showUSD ? 'USD' : 'SAR')}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Marketing Cost</span>
                    <span className="text-sm">
                      {formatCurrency(product.data.marketingCost, showUSD ? 'USD' : 'SAR')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Growth Projection
          </h3>
          <RevenueLineChart data={yearlyProgression} height={300} />
        </motion.div>

        {/* Revenue Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            5-Year Revenue Distribution
          </h3>
          <RevenuePieChart data={revenueDistribution} height={300} />
        </motion.div>
      </div>

      {/* Financial Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          5-Year Financial Summary
        </h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4">Metric</th>
              <th className="text-right py-3 px-4">Amount (SAR)</th>
              {showUSD && <th className="text-right py-3 px-4">Amount (USD)</th>}
              <th className="text-right py-3 px-4">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 px-4">Total Revenue</td>
              <td className="text-right py-3 px-4 font-bold">{formatCurrency(7652148, 'SAR')}</td>
              {showUSD && <td className="text-right py-3 px-4">{formatCurrency(7652148, 'USD')}</td>}
              <td className="text-right py-3 px-4">100%</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 px-4">Marketing Costs</td>
              <td className="text-right py-3 px-4 text-red-600">{formatCurrency(totalMetrics.totalMarketingCost, 'SAR')}</td>
              {showUSD && <td className="text-right py-3 px-4 text-red-600">{formatCurrency(totalMetrics.totalMarketingCost, 'USD')}</td>}
              <td className="text-right py-3 px-4">18%</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 px-4">Net Revenue</td>
              <td className="text-right py-3 px-4 font-bold">{formatCurrency(totalMetrics.netRevenue, 'SAR')}</td>
              {showUSD && <td className="text-right py-3 px-4">{formatCurrency(totalMetrics.netRevenue, 'USD')}</td>}
              <td className="text-right py-3 px-4">82%</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 px-4">Operational Costs</td>
              <td className="text-right py-3 px-4 text-red-600">{formatCurrency(4589489, 'SAR')}</td>
              {showUSD && <td className="text-right py-3 px-4 text-red-600">{formatCurrency(4589489, 'USD')}</td>}
              <td className="text-right py-3 px-4">60%</td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <td className="py-3 px-4 font-bold">Net Profit</td>
              <td className="text-right py-3 px-4 font-bold text-green-600">{formatCurrency(totalMetrics.netProfit, 'SAR')}</td>
              {showUSD && <td className="text-right py-3 px-4 font-bold text-green-600">{formatCurrency(totalMetrics.netProfit, 'USD')}</td>}
              <td className="text-right py-3 px-4 font-bold">22%</td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* Risk Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800"
      >
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-4 flex items-center gap-2">
          <AlertCircle size={24} />
          Risk Analysis & Mitigation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-red-800 dark:text-red-400 mb-2">Risks</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• 100% revenue concentration in single client</li>
              <li>• Loss of client = 100% revenue loss</li>
              <li>• High dependency creates negotiation leverage for client</li>
              <li>• Limited growth potential without diversification</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Mitigation Strategies</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Acquire 2-3 additional enterprise clients by Year 2</li>
              <li>• 3-year minimum contracts with penalties</li>
              <li>• Continuous feature development to increase switching costs</li>
              <li>• Dedicated customer success team</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Strategic Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Strategic Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-primary-600 mb-2">Bundling Advantage</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              22% higher profit margin when selling all 3 products together
            </p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">Cross-Selling Value</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              30% increase in customer lifetime value with bundle
            </p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-purple-600 mb-2">Retention Rate</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              95% retention for clients with 3+ licenses
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SingleClientAnalysis;