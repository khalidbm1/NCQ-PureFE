import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  Award,
  Zap,
  Globe,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useTranslation } from 'react-i18next';

const FintechProjectionsPage = () => {
  const { t } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState('base');
  const [selectedTimeframe, setSelectedTimeframe] = useState('5year');

  const scenarios = [
    {
      id: 'conservative',
      name: 'Conservative',
      description: 'Slower adoption, regulatory delays',
      probability: '25%',
      marketGrowth: '+18% CAGR',
      color: 'orange'
    },
    {
      id: 'base',
      name: 'Base Case',
      description: 'Expected market conditions',
      probability: '50%',
      marketGrowth: '+28% CAGR',
      color: 'blue'
    },
    {
      id: 'optimistic',
      name: 'Optimistic',
      description: 'Accelerated digitization',
      probability: '25%',
      marketGrowth: '+38% CAGR',
      color: 'green'
    }
  ];

  const getProjectionData = (scenario, timeframe) => {
    const baseMultipliers = {
      conservative: { 2025: 1.18, 2026: 1.39, 2027: 1.64, 2028: 1.93, 2029: 2.28 },
      base: { 2025: 1.28, 2026: 1.64, 2027: 2.10, 2028: 2.69, 2029: 3.44 },
      optimistic: { 2025: 1.38, 2026: 1.90, 2027: 2.62, 2028: 3.62, 2029: 4.99 }
    };

    const multiplier = baseMultipliers[scenario];
    const baseMarket = 45.8; // SAR 45.8B current market

    return {
      marketSize: {
        2025: baseMarket * multiplier[2025],
        2026: baseMarket * multiplier[2026],
        2027: baseMarket * multiplier[2027],
        2028: baseMarket * multiplier[2028],
        2029: baseMarket * multiplier[2029]
      },
      segments: {
        digitalPayments: {
          2025: 18.2 * multiplier[2025] * 1.1,
          2026: 18.2 * multiplier[2026] * 1.15,
          2027: 18.2 * multiplier[2027] * 1.2,
          2028: 18.2 * multiplier[2028] * 1.25,
          2029: 18.2 * multiplier[2029] * 1.3
        },
        digitalBanking: {
          2025: 12.4 * multiplier[2025] * 0.95,
          2026: 12.4 * multiplier[2026] * 1.0,
          2027: 12.4 * multiplier[2027] * 1.05,
          2028: 12.4 * multiplier[2028] * 1.1,
          2029: 12.4 * multiplier[2029] * 1.15
        },
        lending: {
          2025: 8.7 * multiplier[2025] * 0.9,
          2026: 8.7 * multiplier[2026] * 1.0,
          2027: 8.7 * multiplier[2027] * 1.15,
          2028: 8.7 * multiplier[2028] * 1.3,
          2029: 8.7 * multiplier[2029] * 1.45
        },
        wealthManagement: {
          2025: 4.1 * multiplier[2025] * 1.2,
          2026: 4.1 * multiplier[2026] * 1.4,
          2027: 4.1 * multiplier[2027] * 1.6,
          2028: 4.1 * multiplier[2028] * 1.8,
          2029: 4.1 * multiplier[2029] * 2.0
        },
        insurtech: {
          2025: 2.4 * multiplier[2025] * 1.0,
          2026: 2.4 * multiplier[2026] * 1.1,
          2027: 2.4 * multiplier[2027] * 1.25,
          2028: 2.4 * multiplier[2028] * 1.4,
          2029: 2.4 * multiplier[2029] * 1.6
        }
      }
    };
  };

  const currentProjection = getProjectionData(selectedScenario, selectedTimeframe);

  const keyDrivers = [
    {
      driver: 'Vision 2030 Implementation',
      impact: 'High',
      contribution: '+8-12% to growth',
      timeline: 'Continuous through 2030',
      risk: 'Low'
    },
    {
      driver: 'Regulatory Sandbox Expansion',
      impact: 'Medium-High',
      contribution: '+5-8% to growth',
      timeline: '2024-2026',
      risk: 'Medium'
    },
    {
      driver: 'Young Demographics',
      impact: 'High',
      contribution: '+10-15% to adoption',
      timeline: 'Immediate',
      risk: 'Low'
    },
    {
      driver: 'Bank Digital Transformation',
      impact: 'Medium',
      contribution: '+3-5% to market',
      timeline: '2024-2027',
      risk: 'Medium'
    }
  ];

  const investmentOpportunities = [
    {
      sector: 'Digital Payments',
      currentValue: 'SAR 18.2B',
      projectedValue: `SAR ${currentProjection.segments.digitalPayments[2029].toFixed(1)}B`,
      growth: `${(((currentProjection.segments.digitalPayments[2029] / 18.2) - 1) * 100).toFixed(0)}%`,
      opportunities: ['Mobile wallets', 'QR payments', 'Cross-border transfers', 'Merchant solutions']
    },
    {
      sector: 'Digital Banking',
      currentValue: 'SAR 12.4B',
      projectedValue: `SAR ${currentProjection.segments.digitalBanking[2029].toFixed(1)}B`,
      growth: `${(((currentProjection.segments.digitalBanking[2029] / 12.4) - 1) * 100).toFixed(0)}%`,
      opportunities: ['Neobanks', 'Banking APIs', 'Personal finance', 'Business banking']
    },
    {
      sector: 'Lending & Credit',
      currentValue: 'SAR 8.7B',
      projectedValue: `SAR ${currentProjection.segments.lending[2029].toFixed(1)}B`,
      growth: `${(((currentProjection.segments.lending[2029] / 8.7) - 1) * 100).toFixed(0)}%`,
      opportunities: ['SME lending', 'BNPL', 'Alternative credit', 'Micro-finance']
    },
    {
      sector: 'Wealth Management',
      currentValue: 'SAR 4.1B',
      projectedValue: `SAR ${currentProjection.segments.wealthManagement[2029].toFixed(1)}B`,
      growth: `${(((currentProjection.segments.wealthManagement[2029] / 4.1) - 1) * 100).toFixed(0)}%`,
      opportunities: ['Robo-advisors', 'Islamic investments', 'Goal-based saving', 'Family wealth']
    }
  ];

  const riskFactors = [
    {
      risk: 'Regulatory Changes',
      probability: 'Medium',
      impact: 'High',
      mitigation: 'Early engagement with regulators, compliance-first approach',
      timeframe: 'Ongoing'
    },
    {
      risk: 'Economic Slowdown',
      probability: 'Low-Medium',
      impact: 'Medium-High',
      mitigation: 'Diversified product portfolio, focus on essential services',
      timeframe: '2024-2025'
    },
    {
      risk: 'Competition from Banks',
      probability: 'High',
      impact: 'Medium',
      mitigation: 'Differentiated value proposition, niche market focus',
      timeframe: 'Continuous'
    },
    {
      risk: 'Talent Shortage',
      probability: 'Medium-High',
      impact: 'Medium',
      mitigation: 'International recruitment, training programs, partnerships',
      timeframe: '2024-2026'
    }
  ];

  const getGrowthIcon = (growth) => {
    const numGrowth = parseFloat(growth);
    if (numGrowth > 100) return ArrowUp;
    if (numGrowth > 50) return TrendingUp;
    return Minus;
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
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fintech Market Projections
          </h1>
          <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">2024-2029</span>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Data-driven financial projections for Saudi Arabia's fintech market with scenario analysis, 
          segment breakdowns, and investment opportunity identification.
        </p>
      </motion.div>

      {/* Current Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="2024 Market Size"
          value="SAR 45.8B"
          icon={DollarSign}
          trend={{ value: "Base year", isPositive: true }}
          color="blue"
        />
        <MetricCard
          title="5-Year Projection"
          value={`SAR ${currentProjection.marketSize[2029].toFixed(1)}B`}
          icon={TrendingUp}
          trend={{ value: `${((currentProjection.marketSize[2029] / 45.8 - 1) * 100).toFixed(0)}% growth`, isPositive: true }}
          color="green"
        />
        <MetricCard
          title="CAGR 2024-2029"
          value={scenarios.find(s => s.id === selectedScenario)?.marketGrowth || '+28%'}
          icon={BarChart3}
          trend={{ value: "Compound annual", isPositive: true }}
          color="purple"
        />
        <MetricCard
          title="Market Maturity"
          value="Emerging"
          icon={Target}
          trend={{ value: "High potential", isPositive: true }}
          color="emerald"
        />
      </div>

      {/* Scenario Selection */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Projection Scenarios
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {scenarios.map((scenario) => (
            <motion.button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedScenario === scenario.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{scenario.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{scenario.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Probability: {scenario.probability}</span>
                <span className={`text-sm font-medium ${
                  scenario.color === 'green' ? 'text-green-600' :
                  scenario.color === 'blue' ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {scenario.marketGrowth}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Year-by-Year Projections */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">
            Market Size Progression ({scenarios.find(s => s.id === selectedScenario)?.name} Scenario)
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(currentProjection.marketSize).map(([year, value]) => (
              <div key={year} className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  SAR {value.toFixed(1)}B
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{year}</div>
                {year !== '2025' && (
                  <div className="text-xs text-green-600 dark:text-green-400">
                    +{(((value / Object.values(currentProjection.marketSize)[Object.keys(currentProjection.marketSize).indexOf(year) - 1]) - 1) * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segment Breakdown */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Investment Opportunities by Segment (2029 Projections)
        </h2>
        
        <div className="space-y-4">
          {investmentOpportunities.map((opportunity, index) => {
            const GrowthIcon = getGrowthIcon(opportunity.growth);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{opportunity.sector}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Current: {opportunity.currentValue}</span>
                    <span>→</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Projected: {opportunity.projectedValue}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {opportunity.opportunities.map((opp, i) => (
                      <span key={i} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                        {opp}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className="flex items-center gap-2 text-2xl font-bold text-green-600 dark:text-green-400">
                    <GrowthIcon className="w-6 h-6" />
                    {opportunity.growth}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">5-Year Growth</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Key Growth Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Growth Drivers
          </h3>
          <div className="space-y-4">
            {keyDrivers.map((driver, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{driver.driver}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    driver.impact === 'High' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    driver.impact === 'Medium-High' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {driver.impact}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Contribution: {driver.contribution}</div>
                  <div>Timeline: {driver.timeline}</div>
                  <div>Risk Level: <span className={driver.risk === 'Low' ? 'text-green-600' : 'text-yellow-600'}>{driver.risk}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-red-500" />
            Risk Factors
          </h3>
          <div className="space-y-4">
            {riskFactors.map((risk, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{risk.risk}</h4>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      risk.probability.includes('High') ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                      risk.probability.includes('Medium') ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                      'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    }`}>
                      {risk.probability}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Impact: {risk.impact}</div>
                  <div>Timeframe: {risk.timeframe}</div>
                  <div className="text-xs mt-2 text-gray-500">Mitigation: {risk.mitigation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Award className="w-8 h-8" />
          Investment Thesis Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-4">Market Opportunity</h3>
            <ul className="space-y-2 text-sm">
              <li>• SAR 45.8B → {currentProjection.marketSize[2029].toFixed(1)}B market</li>
              <li>• {scenarios.find(s => s.id === selectedScenario)?.marketGrowth} compound growth</li>
              <li>• Multiple high-growth segments</li>
              <li>• Strong regulatory support</li>
            </ul>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-4">Key Success Factors</h3>
            <ul className="space-y-2 text-sm">
              <li>• Sharia compliance mandatory</li>
              <li>• Mobile-first approach essential</li>
              <li>• Local partnerships critical</li>
              <li>• Early market entry advantage</li>
            </ul>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-4">Investment Recommendation</h3>
            <ul className="space-y-2 text-sm">
              <li>• Focus on digital payments first</li>
              <li>• Build platform for expansion</li>
              <li>• Target young demographics</li>
              <li>• Plan 18-24 month timeline</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FintechProjectionsPage;