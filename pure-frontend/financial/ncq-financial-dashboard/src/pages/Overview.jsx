import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  CreditCard,
  Brain,
  Building2,
  ArrowUpRight
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { RevenueLineChart, RevenueBarChart, RevenuePieChart } from '../components/charts/RevenueChart';
import { useFinancial } from '../contexts/FinancialContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency, formatCompactNumber } from '../utils/formatters';
import { useTranslation } from 'react-i18next';

const Overview = () => {
  const { financialData } = useFinancial();
  const { platform, products } = financialData;
  const { displayCurrency } = useCurrency();
  const { t } = useTranslation();

  // Calculate total metrics
  const totalYear5Revenue = platform.yearlyTotals[4].revenue;
  const totalYear5Profit = platform.yearlyTotals[4].profit;
  const totalYear5Clients = Object.values(products).reduce(
    (sum, product) => sum + product.yearlyData[4].clients, 0
  );

  // Prepare chart data
  const revenueData = platform.yearlyTotals.map((data, index) => ({
    year: `Year ${index + 1}`,
    revenue: data.revenue,
    profit: data.profit,
    costs: data.costs
  }));

  const productRevenueData = Object.entries(products).map(([key, product]) => ({
    name: product.shortName,
    value: product.yearlyData[4].revenue,
    color: product.color
  }));

  const marketSizeData = Object.entries(products).map(([key, product]) => ({
    label: product.shortName,
    revenue: product.yearlyData[4].revenue,
    marketSize: product.marketSize
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('navigation.dashboard_overview')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('analysis.all_products_subtitle')}
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('metrics.year_5_revenue')}
          value={totalYear5Revenue}
          change={97}
          icon={DollarSign}
          format="currency"
          color="primary"
          delay={0.1}
        />
        <MetricCard
          title={t('dashboard.net_profit')}
          value={totalYear5Profit}
          change={26.5}
          icon={TrendingUp}
          format="currency"
          color="success"
          delay={0.2}
        />
        <MetricCard
          title={t('dashboard.total_clients')}
          value={totalYear5Clients}
          change={100}
          icon={Users}
          format="number"
          color="purple"
          delay={0.3}
        />
        <MetricCard
          title={t('common.roi')}
          value={platform.expectedROI * 100}
          change={0}
          icon={Target}
          format="percentage"
          color="warning"
          delay={0.4}
        />
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(products).map(([key, product], index) => {
          const Icon = key === 'pgw' ? CreditCard : key === 'llm' ? Brain : Building2;
          const yearData = product.yearlyData[4];
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${product.color}20`, color: product.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t(`products.${key === 'hospitality' ? 'smart_hospitality' : `ncq_${key}`}.name`)}
                  </h3>
                </div>
                <ArrowUpRight className="text-gray-400" size={20} />
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('metrics.year_5_revenue')}</p>
                  <p className="text-2xl font-bold" style={{ color: product.color }}>
                    {formatCurrency(yearData.revenue, displayCurrency)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('common.clients')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCompactNumber(yearData.clients)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('metrics.monthly_revenue')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCompactNumber(yearData.monthlyRevenue, displayCurrency)}
                    </p>
                  </div>
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
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analysis.revenue_progression')}
          </h3>
          <RevenueLineChart data={revenueData} />
        </motion.div>

        {/* Product Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analysis.revenue_progression')}
          </h3>
          <RevenuePieChart data={productRevenueData} />
        </motion.div>
      </div>

      {/* Financial Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 shadow-lg text-white"
      >
        <h3 className="text-xl font-semibold mb-4">{t('projections.financial_summary')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-primary-100">{t('dashboard.initial_investment')}</p>
            <p className="text-2xl font-bold">{formatCurrency(platform.totalInvestmentRequired, displayCurrency)}</p>
          </div>
          <div>
            <p className="text-primary-100">{t('common.revenue')}</p>
            <p className="text-2xl font-bold">{formatCompactNumber(totalYear5Revenue, displayCurrency)}</p>
          </div>
          <div>
            <p className="text-primary-100">{t('dashboard.net_profit')}</p>
            <p className="text-2xl font-bold">{formatCompactNumber(totalYear5Profit, displayCurrency)}</p>
          </div>
          <div>
            <p className="text-primary-100">{t('dashboard.break_even')}</p>
            <p className="text-2xl font-bold">{t('common.month')} {platform.breakEvenMonth}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;