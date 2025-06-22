import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Rocket,
  Shield,
  Smartphone,
  BarChart3,
  Zap,
  CheckCircle,
  Star,
  Award,
  ArrowRight,
  MapPin,
  Target
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useTranslation } from 'react-i18next';

const GlobalFintechIdeasPage = () => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState('all');

  const globalFintechTrends = [
    {
      id: 'bnpl_saudi',
      title: 'Buy Now, Pay Later (Sharia-Compliant)',
      region: 'global',
      originCountry: 'Sweden (Klarna), Australia (Afterpay)',
      saudiAdaptation: 'Halal BNPL with zero-interest structure',
      marketSize: 'SAR 8.5B',
      timeline: '6-8 months',
      viability: 'High',
      description: 'Sharia-compliant BNPL platform using profit-sharing model instead of interest-based installments.',
      keyAdaptations: [
        'Murabaha-based pricing structure',
        'Zero interest, transparent fees',
        'Integration with Saudi e-commerce',
        'Mada card compatibility',
        'Credit scoring via SIMAH',
        'Family account linking'
      ],
      successFactors: [
        'Strong partnerships with retailers',
        'Seamless checkout integration',
        'Responsible lending practices',
        'Clear Sharia compliance certification'
      ],
      challenges: [
        'Regulatory approval for new model',
        'Consumer education on Halal financing',
        'Competition from banks'
      ],
      investment: 'SAR 15M',
      roi: '420%'
    },
    {
      id: 'carbon_credits',
      title: 'Carbon Credit Trading Platform',
      region: 'global',
      originCountry: 'Europe (various), Singapore',
      saudiAdaptation: 'NEOM and Green Saudi integration',
      marketSize: 'SAR 12B',
      timeline: '10-12 months',
      viability: 'High',
      description: 'Digital marketplace for carbon credits aligned with Saudi Green Initiative and NEOM sustainability goals.',
      keyAdaptations: [
        'Integration with Saudi Green Initiative',
        'NEOM project carbon tracking',
        'Corporate ESG compliance tools',
        'Blockchain verification system',
        'Arabic language support',
        'Local environmental standards'
      ],
      successFactors: [
        'Government partnership',
        'International certification',
        'Corporate adoption',
        'Technology reliability'
      ],
      challenges: [
        'Market development needed',
        'Complex regulatory landscape',
        'Technical infrastructure requirements'
      ],
      investment: 'SAR 22M',
      roi: '380%'
    },
    {
      id: 'micro_investing',
      title: 'Micro-Investing App',
      region: 'global',
      originCountry: 'US (Acorns), UK (Monzo)',
      saudiAdaptation: 'Halal investment options with spare change',
      marketSize: 'SAR 6.2B',
      timeline: '8-10 months',
      viability: 'Medium-High',
      description: 'Round-up spare change investing in Sharia-compliant funds and ETFs for Saudi millennials.',
      keyAdaptations: [
        'Sharia-compliant investment options',
        'Integration with local banks',
        'Educational content in Arabic',
        'Family investment goals',
        'Zakat calculation integration',
        'Cultural savings patterns'
      ],
      successFactors: [
        'Partnership with fund managers',
        'User-friendly interface',
        'Educational content quality',
        'Regulatory compliance'
      ],
      challenges: [
        'CMA approval required',
        'Low investment culture',
        'Bank integration complexity'
      ],
      investment: 'SAR 8M',
      roi: '290%'
    },
    {
      id: 'insurance_tech',
      title: 'Parametric Insurance Platform',
      region: 'global',
      originCountry: 'Kenya (ACRE), India (Arbol)',
      saudiAdaptation: 'Takaful-based weather and travel insurance',
      marketSize: 'SAR 4.8B',
      timeline: '12-14 months',
      viability: 'Medium',
      description: 'Automated Takaful insurance using satellite data and IoT for instant payouts on weather events.',
      keyAdaptations: [
        'Takaful compliance structure',
        'Desert climate specialization',
        'Hajj and Umrah travel insurance',
        'Agricultural protection for farmers',
        'Livestock insurance for Bedouins',
        'Real estate flood protection'
      ],
      successFactors: [
        'Accurate data sources',
        'Fast claim processing',
        'Affordable premiums',
        'Clear Takaful structure'
      ],
      challenges: [
        'Complex actuarial modeling',
        'Data availability',
        'Consumer understanding'
      ],
      investment: 'SAR 18M',
      roi: '340%'
    },
    {
      id: 'embedded_finance',
      title: 'Embedded Finance APIs',
      region: 'global',
      originCountry: 'US (Stripe), Brazil (PagSeguro)',
      saudiAdaptation: 'Saudi business-focused financial APIs',
      marketSize: 'SAR 15.8B',
      timeline: '14-16 months',
      viability: 'High',
      description: 'White-label financial services APIs for Saudi businesses to embed payments, lending, and insurance.',
      keyAdaptations: [
        'SAMA regulatory compliance',
        'Arabic developer documentation',
        'Local payment method support',
        'Sharia-compliant products',
        'SME-focused solutions',
        'Government integration ready'
      ],
      successFactors: [
        'Developer ecosystem',
        'Strong API performance',
        'Comprehensive compliance',
        'Partner network'
      ],
      challenges: [
        'Complex regulatory requirements',
        'Long sales cycles',
        'Technical expertise needed'
      ],
      investment: 'SAR 28M',
      roi: '510%'
    },
    {
      id: 'supply_chain_finance',
      title: 'Supply Chain Finance Platform',
      region: 'global',
      originCountry: 'China (Ant Financial), Singapore (various)',
      saudiAdaptation: 'Trade finance for Saudi importers/exporters',
      marketSize: 'SAR 25B',
      timeline: '16-18 months',
      viability: 'High',
      description: 'Digital platform connecting Saudi SMEs with trade finance using blockchain and AI risk assessment.',
      keyAdaptations: [
        'Integration with Saudi Customs',
        'Commodity trade specialization',
        'Multi-bank partnership model',
        'Islamic finance structures',
        'Regional trade corridor focus',
        'SME accessibility features'
      ],
      successFactors: [
        'Bank partnerships',
        'Government support',
        'Trade volume growth',
        'Technology adoption'
      ],
      challenges: [
        'Complex stakeholder coordination',
        'High technical requirements',
        'Long development timeline'
      ],
      investment: 'SAR 35M',
      roi: '480%'
    }
  ];

  const regions = [
    { id: 'all', name: 'All Ideas', count: globalFintechTrends.length },
    { id: 'consumer', name: 'Consumer Finance', count: 3 },
    { id: 'business', name: 'Business Finance', count: 2 },
    { id: 'sustainability', name: 'Green Finance', count: 1 }
  ];

  const getFilteredTrends = () => {
    if (selectedRegion === 'all') return globalFintechTrends;
    if (selectedRegion === 'consumer') return globalFintechTrends.filter(t => 
      ['bnpl_saudi', 'micro_investing', 'insurance_tech'].includes(t.id)
    );
    if (selectedRegion === 'business') return globalFintechTrends.filter(t => 
      ['embedded_finance', 'supply_chain_finance'].includes(t.id)
    );
    if (selectedRegion === 'sustainability') return globalFintechTrends.filter(t => 
      ['carbon_credits'].includes(t.id)
    );
    return globalFintechTrends;
  };

  const overallStats = [
    { title: 'Total Market Opportunity', value: 'SAR 72B+', growth: 'Across all ideas', color: 'green' },
    { title: 'Average Implementation', value: '11 months', growth: 'Time to market', color: 'blue' },
    { title: 'Average ROI', value: '405%', growth: '5-year projection', color: 'purple' },
    { title: 'Success Rate', value: '78%', growth: 'Global benchmark', color: 'emerald' }
  ];

  const getViabilityColor = (viability) => {
    switch (viability) {
      case 'High': return 'text-green-600 dark:text-green-400';
      case 'Medium-High': return 'text-yellow-600 dark:text-yellow-400';
      case 'Medium': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
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
            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Global Fintech Ideas for Saudi Market
          </h1>
          <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Market Validated</span>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Proven fintech concepts from around the world, culturally adapted and compliance-ready 
          for the Saudi Arabian market with detailed localization strategies.
        </p>
      </motion.div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallStats.map((stat, index) => (
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

      {/* Category Filter */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Filter by Category
        </h2>
        <div className="flex flex-wrap gap-3">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedRegion === region.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {region.name}
              <span className="ml-2 text-sm opacity-75">({region.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Global Fintech Ideas */}
      <div className="space-y-6">
        {getFilteredTrends().map((idea, index) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {idea.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Origin: {idea.originCountry}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span className={getViabilityColor(idea.viability)}>
                        {idea.viability} Viability
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {idea.marketSize}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Market Size</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {idea.description}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-bold text-blue-600 dark:text-blue-400">{idea.timeline}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Timeline</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-bold text-purple-600 dark:text-purple-400">{idea.investment}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Investment</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-bold text-orange-600 dark:text-orange-400">{idea.roi}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">5-Year ROI</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-bold text-green-600 dark:text-green-400">{idea.saudiAdaptation}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Saudi Focus</div>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Key Adaptations */}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Saudi Adaptations
                </h4>
                <ul className="space-y-2">
                  {idea.keyAdaptations.map((adaptation, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                      {adaptation}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Success Factors */}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Success Factors
                </h4>
                <ul className="space-y-2">
                  {idea.successFactors.map((factor, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges */}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  Key Challenges
                </h4>
                <ul className="space-y-2">
                  {idea.challenges.map((challenge, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Adaptation Framework */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Award className="w-8 h-8" />
          Cultural Adaptation Framework
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Religious Compliance</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Sharia-compliant structures</li>
              <li>• Halal certification process</li>
              <li>• Religious advisory board</li>
              <li>• Islamic finance principles</li>
            </ul>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Cultural Preferences</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Arabic-first interface</li>
              <li>• Family-centric features</li>
              <li>• Local payment methods</li>
              <li>• Cultural savings patterns</li>
            </ul>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Regulatory Alignment</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• SAMA compliance</li>
              <li>• Local data residency</li>
              <li>• KYC/AML procedures</li>
              <li>• Consumer protection</li>
            </ul>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Market Integration</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Local partnerships</li>
              <li>• Government alignment</li>
              <li>• Existing infrastructure</li>
              <li>• Competitive positioning</li>
            </ul>
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
          Bring Global Success to Saudi Arabia
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Each idea comes with detailed adaptation strategies, regulatory compliance roadmaps, 
          and local market entry plans based on global success patterns.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Download Adaptation Guide
          </button>
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Request Market Analysis
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GlobalFintechIdeasPage;