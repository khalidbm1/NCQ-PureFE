import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Shield,
  Users,
  CheckCircle,
  X,
  AlertTriangle,
  Award,
  BarChart3,
  Zap,
  Globe,
  Star
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FintechComparisonPage = () => {
  const { t } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState(['subbox', 'remittance', 'sme_lending']);
  const [comparisonCriteria, setComparisonCriteria] = useState('all');

  const fintechProducts = [
    {
      id: 'subbox',
      name: 'SubBox.sa',
      category: 'Consumer Fintech',
      marketSize: 'SAR 4.2B',
      timeline: '12 months',
      investment: 'SAR 9.8M',
      roi: '460%',
      viability: 'High',
      complexity: 'Medium',
      competitionLevel: 'Low',
      regulatoryRisk: 'Low',
      marketReadiness: 'High',
      technicalComplexity: 'Medium',
      pros: [
        'First-mover advantage in Saudi',
        'Proven global business model',
        'Low regulatory barriers',
        'High consumer demand'
      ],
      cons: [
        'Subscription tracking complexity',
        'Banking integration challenges',
        'Consumer education needed'
      ],
      keyMetrics: {
        timeToMarket: '12 months',
        breakEven: '18 months',
        year3Revenue: 'SAR 45.2M',
        marketPenetration: '8%',
        customerAcquisitionCost: 'SAR 45',
        lifetimeValue: 'SAR 890'
      }
    },
    {
      id: 'remittance',
      name: 'Digital Remittance Platform',
      category: 'Cross-border Payments',
      marketSize: 'SAR 15.2B',
      timeline: '8-12 months',
      investment: 'SAR 12M',
      roi: '380%',
      viability: 'High',
      complexity: 'High',
      competitionLevel: 'Medium-High',
      regulatoryRisk: 'Medium',
      marketReadiness: 'High',
      technicalComplexity: 'High',
      pros: [
        'Large addressable market',
        'Strong demand from expats',
        'Blockchain technology advantage',
        'Regulatory support for innovation'
      ],
      cons: [
        'Complex regulatory requirements',
        'Strong incumbent competition',
        'High technical development cost',
        'International compliance needed'
      ],
      keyMetrics: {
        timeToMarket: '10 months',
        breakEven: '24 months',
        year3Revenue: 'SAR 78M',
        marketPenetration: '5%',
        customerAcquisitionCost: 'SAR 125',
        lifetimeValue: 'SAR 2,400'
      }
    },
    {
      id: 'sme_lending',
      name: 'SME Lending Platform',
      category: 'Business Finance',
      marketSize: 'SAR 8.7B',
      timeline: '10-14 months',
      investment: 'SAR 18M',
      roi: '425%',
      viability: 'Medium-High',
      complexity: 'High',
      competitionLevel: 'Medium',
      regulatoryRisk: 'High',
      marketReadiness: 'Medium',
      technicalComplexity: 'High',
      pros: [
        'Underserved market segment',
        'Government SME support',
        'AI-powered differentiation',
        'High-value transactions'
      ],
      cons: [
        'SAMA licensing required',
        'Complex credit risk management',
        'Long sales cycles',
        'High capital requirements'
      ],
      keyMetrics: {
        timeToMarket: '14 months',
        breakEven: '30 months',
        year3Revenue: 'SAR 95M',
        marketPenetration: '3%',
        customerAcquisitionCost: 'SAR 850',
        lifetimeValue: 'SAR 12,000'
      }
    },
    {
      id: 'robo_advisory',
      name: 'Robo-Advisory Platform',
      category: 'Wealth Management',
      marketSize: 'SAR 2.1T',
      timeline: '12-16 months',
      investment: 'SAR 25M',
      roi: '520%',
      viability: 'Medium-High',
      complexity: 'High',
      competitionLevel: 'Medium',
      regulatoryRisk: 'Medium-High',
      marketReadiness: 'Medium',
      technicalComplexity: 'High',
      pros: [
        'Massive total addressable market',
        'High-margin business model',
        'Growing millennial wealth',
        'Limited direct competition'
      ],
      cons: [
        'CMA licensing complexity',
        'High initial investment',
        'Long customer education cycle',
        'Trust building required'
      ],
      keyMetrics: {
        timeToMarket: '16 months',
        breakEven: '36 months',
        year3Revenue: 'SAR 125M',
        marketPenetration: '1%',
        customerAcquisitionCost: 'SAR 450',
        lifetimeValue: 'SAR 8,500'
      }
    },
    {
      id: 'islamic_neobank',
      name: 'Islamic Neobank',
      category: 'Digital Banking',
      marketSize: 'SAR 45B',
      timeline: '18-24 months',
      investment: 'SAR 50M',
      roi: '650%',
      viability: 'Medium',
      complexity: 'Very High',
      competitionLevel: 'High',
      regulatoryRisk: 'Very High',
      marketReadiness: 'Medium',
      technicalComplexity: 'Very High',
      pros: [
        'Huge market opportunity',
        'First Islamic neobank advantage',
        'Young target demographic',
        'Government digitization support'
      ],
      cons: [
        'Full banking license required',
        'Massive capital requirements',
        'Intense competition from banks',
        'Complex regulatory landscape'
      ],
      keyMetrics: {
        timeToMarket: '24 months',
        breakEven: '48 months',
        year3Revenue: 'SAR 180M',
        marketPenetration: '2%',
        customerAcquisitionCost: 'SAR 180',
        lifetimeValue: 'SAR 3,200'
      }
    },
    {
      id: 'bnpl_halal',
      name: 'Halal BNPL Platform',
      category: 'Consumer Credit',
      marketSize: 'SAR 8.5B',
      timeline: '6-8 months',
      investment: 'SAR 15M',
      roi: '420%',
      viability: 'High',
      complexity: 'Medium',
      competitionLevel: 'Medium',
      regulatoryRisk: 'Medium',
      marketReadiness: 'High',
      technicalComplexity: 'Medium',
      pros: [
        'First Sharia-compliant BNPL',
        'Fast time to market',
        'Strong e-commerce growth',
        'Young consumer adoption'
      ],
      cons: [
        'Sharia compliance complexity',
        'Merchant acquisition needed',
        'Credit risk management',
        'Competition from Tamara'
      ],
      keyMetrics: {
        timeToMarket: '8 months',
        breakEven: '20 months',
        year3Revenue: 'SAR 85M',
        marketPenetration: '6%',
        customerAcquisitionCost: 'SAR 35',
        lifetimeValue: 'SAR 450'
      }
    }
  ];

  const criteriaOptions = [
    { id: 'all', name: 'All Criteria', icon: Layers },
    { id: 'financial', name: 'Financial Metrics', icon: DollarSign },
    { id: 'market', name: 'Market Factors', icon: Target },
    { id: 'risk', name: 'Risk Assessment', icon: Shield },
    { id: 'timeline', name: 'Timeline & Complexity', icon: Clock }
  ];

  const getSelectedProducts = () => {
    return fintechProducts.filter(product => selectedProducts.includes(product.id));
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : prev.length < 4 ? [...prev, productId] : prev
    );
  };

  const getViabilityColor = (viability) => {
    switch (viability) {
      case 'High': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium-High': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'High': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Very High': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Medium-High': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'High': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'Very High': return 'text-red-700 bg-red-200 dark:bg-red-900/50 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
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
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <Layers className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fintech Opportunities Comparison
          </h1>
          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Side-by-Side</span>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Compare multiple fintech opportunities across key metrics including market size, 
          investment requirements, risk factors, and projected returns.
        </p>
      </motion.div>

      {/* Product Selection */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Select Products to Compare (Max 4)
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedProducts.length}/4 selected
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fintechProducts.map((product) => (
            <motion.button
              key={product.id}
              onClick={() => toggleProductSelection(product.id)}
              disabled={!selectedProducts.includes(product.id) && selectedProducts.length >= 4}
              whileHover={{ scale: selectedProducts.length < 4 || selectedProducts.includes(product.id) ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedProducts.includes(product.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : selectedProducts.length >= 4
                  ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                {selectedProducts.includes(product.id) && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div>Category: {product.category}</div>
                <div>Market: {product.marketSize}</div>
                <div>ROI: {product.roi}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Comparison Criteria Filter */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Comparison Focus
        </h2>
        <div className="flex flex-wrap gap-3">
          {criteriaOptions.map((criteria) => {
            const Icon = criteria.icon;
            return (
              <button
                key={criteria.id}
                onClick={() => setComparisonCriteria(criteria.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  comparisonCriteria === criteria.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {criteria.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedProducts.length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Detailed Comparison
          </h2>
          
          <div className="min-w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Criteria
                  </th>
                  {getSelectedProducts().map((product) => (
                    <th key={product.id} className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-[200px]">
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic Info */}
                {(comparisonCriteria === 'all' || comparisonCriteria === 'market') && (
                  <>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Category</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                          {product.category}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Market Size</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center font-semibold text-green-600 dark:text-green-400">
                          {product.marketSize}
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* Financial Metrics */}
                {(comparisonCriteria === 'all' || comparisonCriteria === 'financial') && (
                  <>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Investment Required</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center font-semibold text-blue-600 dark:text-blue-400">
                          {product.investment}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">5-Year ROI</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center font-semibold text-purple-600 dark:text-purple-400">
                          {product.roi}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Break Even</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                          {product.keyMetrics.breakEven}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Year 3 Revenue</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center font-semibold text-green-600 dark:text-green-400">
                          {product.keyMetrics.year3Revenue}
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* Timeline & Complexity */}
                {(comparisonCriteria === 'all' || comparisonCriteria === 'timeline') && (
                  <>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Time to Market</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                          {product.keyMetrics.timeToMarket}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Technical Complexity</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getComplexityColor(product.technicalComplexity)}`}>
                            {product.technicalComplexity}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* Risk Assessment */}
                {(comparisonCriteria === 'all' || comparisonCriteria === 'risk') && (
                  <>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Overall Viability</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getViabilityColor(product.viability)}`}>
                            {product.viability}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Regulatory Risk</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(product.regulatoryRisk)}`}>
                            {product.regulatoryRisk}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Competition Level</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(product.competitionLevel)}`}>
                            {product.competitionLevel}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* Market Factors */}
                {(comparisonCriteria === 'all' || comparisonCriteria === 'market') && (
                  <>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Market Readiness</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getViabilityColor(product.marketReadiness)}`}>
                            {product.marketReadiness}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Market Penetration (Y3)</td>
                      {getSelectedProducts().map((product) => (
                        <td key={product.id} className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                          {product.keyMetrics.marketPenetration}
                        </td>
                      ))}
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pros and Cons Comparison */}
      {selectedProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getSelectedProducts().map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Advantages
                  </h4>
                  <ul className="space-y-1">
                    {product.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Challenges
                  </h4>
                  <ul className="space-y-1">
                    {product.cons.map((con, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recommendation Summary */}
      {selectedProducts.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-8 h-8" />
            Investment Recommendation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-4">Quick Wins</h3>
              <p className="text-sm mb-3">Fastest time to market with lower risk:</p>
              <ul className="space-y-1 text-sm">
                <li>• SubBox.sa (12 months, low risk)</li>
                <li>• Halal BNPL (8 months, medium risk)</li>
                <li>• Digital Remittance (10 months)</li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-4">High Returns</h3>
              <p className="text-sm mb-3">Highest ROI potential:</p>
              <ul className="space-y-1 text-sm">
                <li>• Islamic Neobank (650% ROI)</li>
                <li>• Robo-Advisory (520% ROI)</li>
                <li>• SubBox.sa (460% ROI)</li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-4">Strategic Choice</h3>
              <p className="text-sm mb-3">Portfolio approach recommended:</p>
              <ul className="space-y-1 text-sm">
                <li>• Start with SubBox.sa</li>
                <li>• Build platform capabilities</li>
                <li>• Expand to higher-value products</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FintechComparisonPage;