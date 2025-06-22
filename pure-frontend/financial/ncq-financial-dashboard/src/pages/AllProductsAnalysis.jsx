import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Users,
  BarChart3,
  PieChart,
  Target,
  Zap
} from 'lucide-react';
import { RevenueLineChart, RevenueBarChart, RevenuePieChart } from '../components/charts/RevenueChart';
import AnimatedNumber from '../components/AnimatedNumber';
import { formatCurrency, formatCompactNumber, formatPercentage } from '../utils/formatters';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../contexts/CurrencyContext';

const AllProductsAnalysis = () => {
  const { t } = useTranslation();
  const { displayCurrency } = useCurrency();
  const showUSD = displayCurrency === 'USD';

  // Data from the MD file
  const clientGrowthData = [
    { year: 'Year 1', pgw: 10, llm: 87, hospitality: 15, total: 112 },
    { year: 'Year 2', pgw: 50, llm: 708, hospitality: 65, total: 823 },
    { year: 'Year 3', pgw: 200, llm: 2665, hospitality: 250, total: 3115 },
    { year: 'Year 4', pgw: 500, llm: 5000, hospitality: 500, total: 6000 },
    { year: 'Year 5', pgw: 1000, llm: 10000, hospitality: 1000, total: 12000 }
  ];

  const revenueProgressionData = [
    { year: 'Year 1', revenue: 11450000, costs: 10890000, profit: 560000 },
    { year: 'Year 2', revenue: 102800000, costs: 97700000, profit: 5100000 },
    { year: 'Year 3', revenue: 399500000, costs: 379700000, profit: 19800000 },
    { year: 'Year 4', revenue: 959800000, costs: 863800000, profit: 96000000 },
    { year: 'Year 5', revenue: 1818000000, costs: 1336500000, profit: 481500000 }
  ];

  const productMetrics = {
    pgw: { 
      revenue: 648000000, 
      profit: 162000000, 
      margin: 0.25, 
      roi: 129, 
      color: '#3b82f6',
      marketingBudget: 129600000,
      cac: 73636
    },
    llm: { 
      revenue: 540000000, 
      profit: 162000000, 
      margin: 0.30, 
      roi: 95, 
      color: '#8b5cf6',
      marketingBudget: 108000000,
      cac: 5854
    },
    hospitality: { 
      revenue: 630000000, 
      profit: 157500000, 
      margin: 0.25, 
      roi: 111, 
      color: '#10b981',
      marketingBudget: 126000000,
      cac: 68852
    }
  };

  const marketingData = Object.entries(productMetrics).map(([key, data]) => ({
    name: key === 'pgw' ? 'NCQ PGW' : key === 'llm' ? 'NCQ LLM' : 'Smart Hospitality',
    value: data.marketingBudget,
    color: data.color
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 shadow-lg text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <FileText size={32} />
          <h1 className="text-3xl font-bold">{t('analysis.all_products_title')}</h1>
        </div>
        <p className="text-primary-100 text-lg">
          {t('analysis.all_products_subtitle')}
        </p>
        <div className="flex gap-6 mt-6">
          <div>
            <p className="text-primary-200">{t('analysis.analysis_period')}</p>
            <p className="text-xl font-semibold">2025-2030 (5 {t('time_periods.year_1')}s)</p>
          </div>
          <div>
            <p className="text-primary-200">{t('analysis.exchange_rate')}</p>
            <p className="text-xl font-semibold">1 USD = 3.75 SAR</p>
          </div>
          <div className="ml-auto text-sm text-white/80">
            {t('common.currency')}: {displayCurrency}
          </div>
        </div>
      </motion.div>

      {/* Executive Summary */}
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
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('dashboard.initial_investment')}</h3>
          <p className="text-2xl font-bold mt-1">
            <AnimatedNumber value={15000000} format="currency" />
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
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">{t('metrics.year_5_revenue')}</h3>
          <p className="text-2xl font-bold mt-1">
            <AnimatedNumber value={142500000} format="currency" />
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
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">ROI (5 Years)</h3>
          <p className="text-2xl font-bold mt-1">
            <AnimatedNumber value={112} format="percentage" suffix="00%" />
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
          <h3 className="text-gray-600 dark:text-gray-400 text-sm">Total Clients (5-Year)</h3>
          <p className="text-2xl font-bold mt-1">
            <AnimatedNumber value={22050} format="number" />
          </p>
        </motion.div>
      </div>

      {/* Product Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(productMetrics).map(([key, metrics], index) => {
          const productName = key === 'pgw' ? 'NCQ Payment Gateway' : 
                            key === 'llm' ? 'NCQ LLM Platform' : 
                            'Smart Hospitality';
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg border-t-4"
              style={{ borderTopColor: metrics.color }}
            >
              <h3 className="font-semibold text-lg mb-4" style={{ color: metrics.color }}>
                {productName}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Annual Revenue</span>
                  <span className="font-bold">
                    {formatCurrency(metrics.revenue, showUSD ? 'USD' : 'SAR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Net Profit</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(metrics.profit, showUSD ? 'USD' : 'SAR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Profit Margin</span>
                  <span className="font-bold">
                    {formatPercentage(metrics.margin)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ROI</span>
                  <span className="font-bold text-primary-600">
                    {metrics.roi}00%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">CAC</span>
                  <span className="font-bold">
                    {formatCurrency(metrics.cac, showUSD ? 'USD' : 'SAR')}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Combined Revenue Growth
          </h3>
          <RevenueLineChart data={revenueProgressionData} />
        </motion.div>

        {/* Marketing Investment Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Marketing Investment by Product
          </h3>
          <RevenuePieChart data={marketingData} />
        </motion.div>
      </div>

      {/* Client Growth Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Client Growth Projections
        </h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4">Product</th>
              {[1, 2, 3, 4, 5].map(year => (
                <th key={year} className="text-right py-3 px-4">Year {year}</th>
              ))}
              <th className="text-right py-3 px-4 font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 px-4 font-medium">NCQ PGW</td>
              <td className="text-right py-3 px-4">10</td>
              <td className="text-right py-3 px-4">50</td>
              <td className="text-right py-3 px-4">200</td>
              <td className="text-right py-3 px-4">500</td>
              <td className="text-right py-3 px-4">1,000+</td>
              <td className="text-right py-3 px-4 font-bold">1,760</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 px-4 font-medium">NCQ LLM</td>
              <td className="text-right py-3 px-4">87</td>
              <td className="text-right py-3 px-4">708</td>
              <td className="text-right py-3 px-4">2,665</td>
              <td className="text-right py-3 px-4">5,000+</td>
              <td className="text-right py-3 px-4">10,000+</td>
              <td className="text-right py-3 px-4 font-bold">18,460</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 px-4 font-medium">Smart Hospitality</td>
              <td className="text-right py-3 px-4">15</td>
              <td className="text-right py-3 px-4">65</td>
              <td className="text-right py-3 px-4">250</td>
              <td className="text-right py-3 px-4">500</td>
              <td className="text-right py-3 px-4">1,000+</td>
              <td className="text-right py-3 px-4 font-bold">1,830</td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <td className="py-3 px-4 font-bold">Total Platform</td>
              <td className="text-right py-3 px-4 font-bold">112</td>
              <td className="text-right py-3 px-4 font-bold">823</td>
              <td className="text-right py-3 px-4 font-bold">3,115</td>
              <td className="text-right py-3 px-4 font-bold">6,000</td>
              <td className="text-right py-3 px-4 font-bold">12,000+</td>
              <td className="text-right py-3 px-4 font-bold text-primary-600">22,050</td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="text-yellow-500" size={24} />
          Strategic Financial Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-primary-600 mb-2">🏆 Exceptional ROI</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              11,200% combined ROI over 5 years demonstrates exceptional value creation
            </p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">⚡ Quick Payback</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average 14.3 months to recover investment across all products
            </p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-purple-600 mb-2">📈 Accelerating Margins</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Profit margins grow from 5% to 26.5% by Year 5
            </p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-4">
            <h4 className="font-semibold text-blue-600 mb-2">🌍 Market Leadership</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Capturing significant market share in each segment
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AllProductsAnalysis;