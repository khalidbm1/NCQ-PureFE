import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Link } from 'lucide-react';

const LinkTestPage = ({ setActivePage }) => {
  const allPages = [
    { category: 'Main Pages', pages: [
      { id: 'intro', label: 'Introduction', status: 'core' },
      { id: 'overview', label: 'Dashboard Overview', status: 'core' }
    ]},
    { category: 'Mega Plan', pages: [
      { id: 'mega-plan-overview', label: 'Mega Plan Overview', status: 'core' },
      { id: 'mega-plan-details', label: 'Mega Plan Details', status: 'core' },
      { id: 'mega-plan-roadmap', label: 'Mega Plan Roadmap', status: 'core' }
    ]},
    { category: 'Current Products', pages: [
      { id: 'pgw', label: 'Payment Gateway', status: 'core' },
      { id: 'llm', label: 'LLM Platform', status: 'core' },
      { id: 'hospitality', label: 'Smart Hospitality', status: 'core' },
      { id: 'comparison', label: 'Compare Products', status: 'core' }
    ]},
    { category: '💰 Fintech Future Products', pages: [
      { id: 'subbox-platform', label: 'SubBox.sa Platform', status: 'new' },
      { id: 'fintech-execution-plans', label: 'Fintech Execution Plans', status: 'new' },
      { id: 'global-fintech-ideas', label: 'Global Fintech Ideas', status: 'new' }
    ]},
    { category: '📊 Fintech Analysis', pages: [
      { id: 'fintech-market-analysis', label: 'Market Analysis', status: 'new' },
      { id: 'fintech-projections', label: 'Financial Projections', status: 'new' },
      { id: 'fintech-comparison', label: 'Product Comparison', status: 'new' }
    ]},
    { category: 'Financial Analysis', pages: [
      { id: 'all-products-analysis', label: 'All Products', status: 'core' },
      { id: 'full-platform-analysis', label: 'Full Platform', status: 'core' },
      { id: 'single-client-analysis', label: 'Single Client', status: 'core' }
    ]},
    { category: 'Revenue Projections', pages: [
      { id: 'pgw-projections', label: 'PGW Projections', status: 'core' },
      { id: 'llm-projections', label: 'LLM Projections', status: 'core' },
      { id: 'hospitality-projections', label: 'Hospitality Projections', status: 'core' }
    ]},
    { category: 'Master Plans', pages: [
      { id: 'master-plan-overview-doc', label: 'Master Plan Overview', status: 'doc' },
      { id: 'core-technologies', label: 'Core Technologies', status: 'doc' },
      { id: 'ncq-platform-plan', label: 'NCQ Platform Plan', status: 'doc' },
      { id: 'ncq-llm-plan', label: 'NCQ LLM Plan', status: 'doc' },
      { id: 'smart-hospitality-plan', label: 'Smart Hospitality Plan', status: 'doc' }
    ]},
    { category: 'SRS Documents', pages: [
      { id: 'ncq-platform-srs', label: 'NCQ Platform SRS', status: 'doc' },
      { id: 'payment-gateway-srs', label: 'Payment Gateway SRS', status: 'doc' },
      { id: 'hospital-management-srs', label: 'Hospital Management SRS', status: 'doc' },
      { id: 'smart-hospitality-srs', label: 'Smart Hospitality SRS', status: 'doc' },
      { id: 'iot-platform-srs', label: 'IoT Platform SRS', status: 'doc' },
      { id: 'blockchain-products-srs', label: 'Blockchain Products SRS', status: 'doc' }
    ]},
    { category: 'Settings', pages: [
      { id: 'settings', label: 'Data Settings', status: 'core' }
    ]}
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'core': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'doc': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'new': return 'NEW';
      case 'core': return 'Core';
      case 'doc': return 'Doc';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Link className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Pages Link Test
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Click any link below to test navigation. This page helps identify any blank or broken pages.
        </p>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {allPages.reduce((sum, cat) => sum + cat.pages.length, 0)}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Pages</div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {allPages.reduce((sum, cat) => sum + cat.pages.filter(p => p.status === 'new').length, 0)}
          </div>
          <div className="text-gray-600 dark:text-gray-400">New Fintech Pages</div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {allPages.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Categories</div>
        </div>
      </div>

      {/* All Links by Category */}
      <div className="space-y-6">
        {allPages.map((category, catIndex) => (
          <motion.div
            key={catIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * catIndex }}
            className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.pages.map((page, pageIndex) => (
                <motion.button
                  key={page.id}
                  onClick={() => setActivePage(page.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {page.label}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(page.status)}`}>
                    {getStatusLabel(page.status)}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Testing Instructions */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl shadow-lg p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Testing Instructions</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Click each link to test if the page loads correctly</li>
              <li>• <span className="text-green-600 font-medium">NEW</span> tags indicate newly created fintech pages</li>
              <li>• <span className="text-blue-600 font-medium">Core</span> pages are original dashboard pages</li>
              <li>• <span className="text-purple-600 font-medium">Doc</span> pages load markdown content</li>
              <li>• Report any blank pages or errors you encounter</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkTestPage;