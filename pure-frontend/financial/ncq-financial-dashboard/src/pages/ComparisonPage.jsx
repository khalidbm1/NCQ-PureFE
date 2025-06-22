import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, BarChart3, TrendingUp } from 'lucide-react';
import { RevenueBarChart, RevenueLineChart } from '../components/charts/RevenueChart';
import { useFinancial } from '../contexts/FinancialContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import { useTranslation } from 'react-i18next';

const ComparisonPage = () => {
  const { financialData } = useFinancial();
  const { products } = financialData;
  const { displayCurrency } = useCurrency();
  const { t } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState(['pgw', 'llm', 'hospitality']);
  
  const showUSD = displayCurrency === 'USD';

  // Prepare comparison data
  const comparisonData = selectedProducts.map(productKey => {
    const product = products[productKey];
    return {
      key: productKey,
      name: product.shortName,
      color: product.color,
      yearlyData: product.yearlyData,
      year5Revenue: product.yearlyData[4].revenue,
      year5Clients: product.yearlyData[4].clients,
      marketSize: product.marketSize,
      growthRate: product.growthRate
    };
  });

  const revenueComparisonData = [1, 2, 3, 4, 5].map(year => {
    const data = { year: `Year ${year}` };
    selectedProducts.forEach(productKey => {
      data[products[productKey].shortName] = products[productKey].yearlyData[year - 1].revenue;
    });
    return data;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600">
            <Layers size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('navigation.compare_products')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t('analysis.revenue_progression')} NCQ {t('navigation.products')}
            </p>
          </div>
          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {t('common.currency')}: {displayCurrency}
          </div>
        </div>
      </motion.div>

      {/* Product Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('navigation.compare_products')}
        </h3>
        <div className="flex gap-4">
          {Object.entries(products).map(([key, product]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedProducts.includes(key)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProducts([...selectedProducts, key]);
                  } else {
                    setSelectedProducts(selectedProducts.filter(k => k !== key));
                  }
                }}
                className="w-4 h-4 rounded"
                style={{ accentColor: product.color }}
              />
              <span className="font-medium" style={{ color: product.color }}>
                {t(`products.${key === 'hospitality' ? 'smart_hospitality' : `ncq_${key}`}.name`)}
              </span>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {comparisonData.map((product, index) => (
          <motion.div
            key={product.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg border-t-4"
            style={{ borderTopColor: product.color }}
          >
            <h3 className="font-semibold text-lg mb-4" style={{ color: product.color }}>
              {products[product.key].name}
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('metrics.year_5_revenue')}</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(product.year5Revenue, displayCurrency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.total_clients')}</p>
                <p className="text-xl font-bold">{formatNumber(product.year5Clients)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('metrics.market_size')}</p>
                <p className="text-xl font-bold">
                  {formatCurrency(product.marketSize, displayCurrency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('metrics.growth_rate')}</p>
                <p className="text-xl font-bold text-green-600">
                  {formatPercentage(product.growthRate)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Revenue Growth Comparison
        </h3>
        <div style={{ height: 400 }}>
          <RevenueLineChart 
            data={revenueComparisonData}
            height={400}
          />
        </div>
      </motion.div>

      {/* Metrics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Detailed Metrics Comparison
        </h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4">Metric</th>
              {comparisonData.map(product => (
                <th key={product.key} className="text-center py-3 px-4" style={{ color: product.color }}>
                  {product.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(year => (
              <tr key={year} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-medium">Year {year} Revenue</td>
                {comparisonData.map(product => (
                  <td key={product.key} className="text-center py-3 px-4">
                    {formatCurrency(product.yearlyData[year - 1].revenue, showUSD ? 'USD' : 'SAR')}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-gray-50 dark:bg-gray-800">
              <td className="py-3 px-4 font-bold">5-Year Total</td>
              {comparisonData.map(product => {
                const total = product.yearlyData.reduce((sum, data) => sum + data.revenue, 0);
                return (
                  <td key={product.key} className="text-center py-3 px-4 font-bold">
                    {formatCurrency(total, showUSD ? 'USD' : 'SAR')}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default ComparisonPage;