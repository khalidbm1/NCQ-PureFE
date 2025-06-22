import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Rocket,
  Shield,
  Smartphone,
  BarChart3,
  Globe,
  Zap,
  CheckCircle,
  Clock,
  Award,
  CreditCard,
  Building2,
  Banknote
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useTranslation } from 'react-i18next';

const FintechExecutionPlansPage = () => {
  const { t } = useTranslation();
  const [selectedOpportunity, setSelectedOpportunity] = useState('remittance');

  const fintechOpportunities = [
    {
      id: 'remittance',
      title: 'Digital Remittance Platform',
      icon: Globe,
      market: 'SAR 15.2B',
      timeline: '8-12 months',
      investment: 'SAR 12M',
      roi: '380%',
      description: 'Blockchain-powered remittance platform for Saudi expat workers sending money globally.',
      keyFeatures: [
        'Instant cross-border transfers',
        'Competitive exchange rates',
        'SAMA & international compliance',
        'Mobile-first design',
        'Multi-currency support',
        'Family account linking'
      ],
      marketData: {
        size: 'SAR 15.2B annual outflows',
        growth: '+12% annually',
        competition: 'Western Union, Wise, Al Rajhi',
        opportunity: '3.2M expat workers'
      },
      implementation: [
        { phase: 'Regulatory Approval', duration: '2-3 months', cost: 'SAR 2M' },
        { phase: 'Core Platform Development', duration: '4-5 months', cost: 'SAR 6M' },
        { phase: 'Banking Partnerships', duration: '2-3 months', cost: 'SAR 1.5M' },
        { phase: 'Market Launch', duration: '1-2 months', cost: 'SAR 2.5M' }
      ]
    },
    {
      id: 'sme_lending',
      title: 'SME Lending Platform',
      icon: Building2,
      market: 'SAR 8.7B',
      timeline: '10-14 months',
      investment: 'SAR 18M',
      roi: '425%',
      description: 'AI-powered lending platform for Saudi small and medium enterprises with alternative credit scoring.',
      keyFeatures: [
        'Alternative credit scoring',
        'Quick approval process (24 hours)',
        'Flexible repayment terms',
        'Business analytics dashboard',
        'Integration with accounting software',
        'Sharia-compliant financing options'
      ],
      marketData: {
        size: 'SAR 8.7B credit gap for SMEs',
        growth: '+18% annually',
        competition: 'Traditional banks, Tamweelcom',
        opportunity: '1.2M SMEs underserved'
      },
      implementation: [
        { phase: 'SAMA Licensing', duration: '4-5 months', cost: 'SAR 3M' },
        { phase: 'AI Platform Development', duration: '6-7 months', cost: 'SAR 9M' },
        { phase: 'Banking Partnerships', duration: '3-4 months', cost: 'SAR 2M' },
        { phase: 'Pilot & Scale', duration: '2-3 months', cost: 'SAR 4M' }
      ]
    },
    {
      id: 'wealth_management',
      title: 'Robo-Advisory Platform',
      icon: TrendingUp,
      market: 'SAR 2.1T',
      timeline: '12-16 months',
      investment: 'SAR 25M',
      roi: '520%',
      description: 'Automated wealth management platform with Sharia-compliant investment options for Saudi millennials.',
      keyFeatures: [
        'Automated portfolio management',
        'Sharia-compliant investments',
        'Goal-based investing',
        'Tax optimization',
        'Educational content in Arabic',
        'Family wealth planning'
      ],
      marketData: {
        size: 'SAR 2.1T total wealth market',
        growth: '+22% annually',
        competition: 'Al Rajhi Capital, Jadwa',
        opportunity: '750K millennials underserved'
      },
      implementation: [
        { phase: 'CMA Licensing', duration: '5-6 months', cost: 'SAR 4M' },
        { phase: 'Platform Development', duration: '7-8 months', cost: 'SAR 12M' },
        { phase: 'Fund Partnerships', duration: '3-4 months', cost: 'SAR 3M' },
        { phase: 'Launch & Marketing', duration: '2-3 months', cost: 'SAR 6M' }
      ]
    },
    {
      id: 'islamic_neobank',
      title: 'Islamic Neobank',
      icon: Banknote,
      market: 'SAR 45B',
      timeline: '18-24 months',
      investment: 'SAR 50M',
      roi: '650%',
      description: 'Full-stack digital Islamic bank targeting young Saudi professionals with modern banking needs.',
      keyFeatures: [
        '100% Sharia-compliant banking',
        'No physical branches',
        'AI-powered financial planning',
        'Integrated investment products',
        'Instant account opening',
        'Premium concierge services'
      ],
      marketData: {
        size: 'SAR 45B digital banking market',
        growth: '+28% annually',
        competition: 'STC Pay, Alinma, CBD',
        opportunity: '2.5M digital natives'
      },
      implementation: [
        { phase: 'SAMA Banking License', duration: '8-10 months', cost: 'SAR 15M' },
        { phase: 'Core Banking System', duration: '10-12 months', cost: 'SAR 25M' },
        { phase: 'Product Development', duration: '6-8 months', cost: 'SAR 7M' },
        { phase: 'Launch & Scale', duration: '3-4 months', cost: 'SAR 3M' }
      ]
    }
  ];

  const selectedOpp = fintechOpportunities.find(opp => opp.id === selectedOpportunity);

  const overallMarketStats = [
    { title: 'Total Market Opportunity', value: 'SAR 71B+', growth: '+20% CAGR', color: 'green' },
    { title: 'Digital Adoption Rate', value: '87%', growth: '+15% YoY', color: 'blue' },
    { title: 'Underserved Population', value: '7.2M', growth: 'High potential', color: 'purple' },
    { title: 'Regulatory Support', value: 'Strong', growth: 'SAMA Sandbox', color: 'emerald' }
  ];

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
            <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fintech Execution Plans
          </h1>
          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Market Ready</span>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Comprehensive execution plans for untapped fintech opportunities in Saudi Arabia. 
          Each plan includes market analysis, regulatory requirements, and detailed implementation roadmaps.
        </p>
      </motion.div>

      {/* Overall Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallMarketStats.map((stat, index) => (
          <MetricCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={TrendingUp}
            trend={{ value: stat.growth, isPositive: true }}
            color={stat.color}
          />
        ))}
      </div>

      {/* Opportunity Selection */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Fintech Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {fintechOpportunities.map((opp) => {
            const Icon = opp.icon;
            return (
              <motion.button
                key={opp.id}
                onClick={() => setSelectedOpportunity(opp.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedOpportunity === opp.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${
                  selectedOpportunity === opp.id ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                  {opp.title}
                </h3>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <div>Market: {opp.market}</div>
                  <div>ROI: {opp.roi}</div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Opportunity Details */}
        {selectedOpp && (
          <motion.div
            key={selectedOpp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overview */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <selectedOpp.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedOpp.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedOpp.description}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="font-bold text-lg text-green-600 dark:text-green-400">
                    {selectedOpp.market}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Market Size</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {selectedOpp.timeline}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Timeline</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-purple-600 dark:text-purple-400">
                    {selectedOpp.investment}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Investment</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-orange-600 dark:text-orange-400">
                    {selectedOpp.roi}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">5-Year ROI</div>
                </div>
              </div>
            </div>

            {/* Key Features & Market Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Features */}
              <div className="bg-white dark:bg-dark-card rounded-lg p-6 border">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Key Features
                </h4>
                <div className="space-y-2">
                  {selectedOpp.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Data */}
              <div className="bg-white dark:bg-dark-card rounded-lg p-6 border">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Market Analysis
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Size: </span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedOpp.marketData.size}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Growth Rate: </span>
                    <span className="text-sm text-green-600 dark:text-green-400">{selectedOpp.marketData.growth}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Competition: </span>
                    <span className="text-sm text-gray-900 dark:text-white">{selectedOpp.marketData.competition}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Opportunity: </span>
                    <span className="text-sm text-blue-600 dark:text-blue-400">{selectedOpp.marketData.opportunity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Implementation Timeline */}
            <div className="bg-white dark:bg-dark-card rounded-lg p-6 border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                Implementation Roadmap
              </h4>
              <div className="space-y-4">
                {selectedOpp.implementation.map((phase, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white">{phase.phase}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duration: {phase.duration}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600 dark:text-green-400">{phase.cost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Vision 2030 Alignment */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <Award className="w-12 h-12" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Vision 2030 Alignment</h2>
            <p className="text-lg opacity-90">
              All fintech opportunities are strategically aligned with Saudi Arabia's Vision 2030 goals
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Economic Diversification</h3>
            <p className="text-sm opacity-90">
              Reduce oil dependency by building a thriving fintech ecosystem that contributes to GDP growth
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Digital Transformation</h3>
            <p className="text-sm opacity-90">
              Accelerate digitization of financial services and improve financial inclusion across all demographics
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Job Creation</h3>
            <p className="text-sm opacity-90">
              Create high-value jobs in technology and finance sectors while building local expertise
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-8 text-center"
      >
        <Rocket className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Execute?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Each execution plan includes detailed business models, regulatory compliance roadmaps, 
          and implementation timelines ready for immediate action.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Download All Plans
          </button>
          <button className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
            Schedule Strategy Session
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FintechExecutionPlansPage;