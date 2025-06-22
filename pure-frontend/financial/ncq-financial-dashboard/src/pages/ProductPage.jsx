import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Brain, 
  Building2, 
  DollarSign,
  Users,
  TrendingUp,
  Edit3,
  Save,
  X
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { RevenueLineChart, RevenueAreaChart, RevenueBarChart } from '../components/charts/RevenueChart';
import { useFinancial } from '../contexts/FinancialContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import { useTranslation } from 'react-i18next';

const ProductPage = ({ productKey }) => {
  const { financialData, updatePricing, recalculateProjections } = useFinancial();
  const { displayCurrency } = useCurrency();
  const { t } = useTranslation();
  const product = financialData.products[productKey];
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});

  if (!product) return null;

  const Icon = productKey === 'pgw' ? CreditCard : productKey === 'llm' ? Brain : Building2;
  const yearData = product.yearlyData[4]; // Year 5 data

  const revenueData = product.yearlyData.map((data, index) => ({
    year: `Year ${index + 1}`,
    revenue: data.revenue,
    clients: data.clients * 1000 // Scale for visibility
  }));

  const handleEdit = () => {
    setIsEditing(true);
    setEditValues({
      enterprise: product.pricing.enterprise.monthly,
      professional: product.pricing.professional?.monthly || 0,
      starter: product.pricing.starter?.monthly || 0
    });
  };

  const handleSave = () => {
    Object.entries(editValues).forEach(([tier, value]) => {
      if (product.pricing[tier]) {
        updatePricing(productKey, tier, 'monthly', Number(value));
      }
    });
    recalculateProjections(productKey);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: `${product.color}20`, color: product.color }}
            >
              <Icon size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t(`products.${productKey === 'hospitality' ? 'smart_hospitality' : `ncq_${productKey}`}.name`)}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t(`products.${productKey === 'hospitality' ? 'smart_hospitality' : `ncq_${productKey}`}.description`)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('common.currency')}: {displayCurrency}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('metrics.market_size')}</p>
            <p className="text-xl font-bold" style={{ color: product.color }}>
              {formatCurrency(product.marketSize, displayCurrency)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('metrics.growth_rate')}</p>
            <p className="text-xl font-bold text-green-600">
              {formatPercentage(product.growthRate)} {t('common.annual')}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.market_share')}</p>
            <p className="text-xl font-bold text-primary-600">
              {formatPercentage((yearData.revenue / product.marketSize) * 10)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('metrics.year_5_revenue')}
          value={yearData.revenue}
          change={85}
          icon={DollarSign}
          format="currency"
          color="primary"
          delay={0.1}
        />
        <MetricCard
          title={t('metrics.monthly_revenue')}
          value={yearData.monthlyRevenue}
          change={0}
          icon={TrendingUp}
          format="currency"
          color="success"
          delay={0.2}
        />
        <MetricCard
          title={t('dashboard.total_clients')}
          value={yearData.clients}
          change={100}
          icon={Users}
          format="number"
          color="purple"
          delay={0.3}
        />
        <MetricCard
          title={t('analysis.avg_revenue_per_client')}
          value={yearData.revenue / yearData.clients}
          change={0}
          icon={DollarSign}
          format="currency"
          color="warning"
          delay={0.4}
        />
      </div>

      {/* Pricing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('common.pricing_plans')}
          </h3>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Edit3 size={16} />
              {t('common.edit_pricing')}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Save size={16} />
                {t('common.save')}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X size={16} />
                {t('common.cancel')}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(product.pricing).map(([tier, pricing]) => (
            <div 
              key={tier} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h4 className="text-lg font-semibold capitalize mb-4">{tier}</h4>
              {isEditing ? (
                <input
                  type="number"
                  value={editValues[tier] || pricing.monthly}
                  onChange={(e) => setEditValues({ ...editValues, [tier]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-2xl font-bold" style={{ color: product.color }}>
                  {formatCurrency(pricing.monthly, displayCurrency, true)}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/{t('common.month')}</span>
                </p>
              )}
              <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {pricing.tokens && <p>Tokens: {pricing.tokens}</p>}
                {pricing.rooms && <p>Rooms: {pricing.rooms}</p>}
                {pricing.support && <p>Support: {pricing.support}</p>}
                {pricing.transaction && <p>Transaction: {formatPercentage(pricing.transaction)}</p>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('charts.revenue_growth')}
          </h3>
          <RevenueAreaChart data={revenueData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('charts.client_growth')}
          </h3>
          <RevenueLineChart data={revenueData} />
        </motion.div>
      </div>

      {/* Cost Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('analysis.cost_structure')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(product.costs).map(([category, percentage]) => (
            <div key={category} className="text-center">
              <div 
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: `${product.color}20`, color: product.color }}
              >
                <span className="font-bold">{formatPercentage(percentage)}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductPage;