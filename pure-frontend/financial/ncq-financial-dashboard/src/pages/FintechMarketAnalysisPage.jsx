import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  Smartphone,
  Shield,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Zap,
  Building2,
  CreditCard,
  PieChart
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useTranslation } from 'react-i18next';

const FintechMarketAnalysisPage = () => {
  const { t } = useTranslation();
  const [activeSegment, setActiveSegment] = useState('overview');

  const marketOverview = {
    totalSize: 'SAR 45.8B',
    growth: '+28% CAGR',
    segments: [
      { name: 'Digital Payments', size: 'SAR 18.2B', share: '40%', growth: '+32%' },
      { name: 'Digital Banking', size: 'SAR 12.4B', share: '27%', growth: '+25%' },
      { name: 'Lending & Credit', size: 'SAR 8.7B', share: '19%', growth: '+22%' },
      { name: 'Wealth Management', size: 'SAR 4.1B', share: '9%', growth: '+35%' },
      { name: 'Insurance Tech', size: 'SAR 2.4B', share: '5%', growth: '+18%' }
    ]
  };

  const demographics = [
    { 
      segment: 'Digital Natives (18-30)', 
      size: '8.2M people', 
      adoption: '92%', 
      value: 'SAR 24B',
      characteristics: ['High smartphone usage', 'Comfortable with digital services', 'Early adopters', 'Social media influence']
    },
    { 
      segment: 'Emerging Users (31-45)', 
      size: '6.8M people', 
      adoption: '78%', 
      value: 'SAR 18B',
      characteristics: ['Family-focused', 'Security-conscious', 'Growing adoption', 'Bank relationship preference']
    },
    { 
      segment: 'Traditional Users (46+)', 
      size: '4.2M people', 
      adoption: '45%', 
      value: 'SAR 8B',
      characteristics: ['Branch preference', 'High-value transactions', 'Security priority', 'Gradual adoption']
    }
  ];

  const competitiveLandscape = [
    {
      category: 'Digital Payments',
      leaders: [
        { name: 'STC Pay', marketShare: '35%', strength: 'Telecom integration', weakness: 'Limited banking features' },
        { name: 'Apple Pay', marketShare: '28%', strength: 'User experience', weakness: 'iOS only' },
        { name: 'Mada Pay', marketShare: '22%', strength: 'Bank partnerships', weakness: 'Traditional approach' }
      ]
    },
    {
      category: 'Digital Banking',
      leaders: [
        { name: 'Al Rajhi Bank', marketShare: '32%', strength: 'Islamic banking leader', weakness: 'Legacy systems' },
        { name: 'Saudi British Bank', marketShare: '18%', strength: 'Digital innovation', weakness: 'Limited reach' },
        { name: 'Alinma Bank', marketShare: '15%', strength: 'Modern platform', weakness: 'Smaller customer base' }
      ]
    },
    {
      category: 'Emerging Fintech',
      leaders: [
        { name: 'Tamara', marketShare: '45%', strength: 'BNPL leader', weakness: 'Single product focus' },
        { name: 'PayTabs', marketShare: '25%', strength: 'Merchant solutions', weakness: 'B2B focused' },
        { name: 'HyperPay', marketShare: '20%', strength: 'Regional presence', weakness: 'Competition intensity' }
      ]
    }
  ];

  const regulatoryEnvironment = [
    {
      authority: 'SAMA (Saudi Arabian Monetary Authority)',
      role: 'Primary fintech regulator',
      initiatives: [
        'Regulatory Sandbox Program',
        'Open Banking Framework',
        'Digital Payment Strategy',
        'Fintech Guidelines 2023'
      ],
      supportLevel: 'High',
      timeline: 'Active implementation'
    },
    {
      authority: 'CMA (Capital Market Authority)',
      role: 'Investment & wealth management',
      initiatives: [
        'Robo-advisory regulations',
        'Crowdfunding framework',
        'Digital asset guidelines',
        'Fintech licensing fast-track'
      ],
      supportLevel: 'Medium-High',
      timeline: '6-12 months for new rules'
    }
  ];

  const marketDrivers = [
    {
      factor: 'Vision 2030',
      impact: 'High',
      description: 'Government push for economic diversification and digitization',
      timeline: 'Ongoing through 2030',
      opportunities: ['Public-private partnerships', 'Government contracts', 'Regulatory support']
    },
    {
      factor: 'Young Demographics',
      impact: 'High',
      description: '60% of population under 35, tech-savvy and mobile-first',
      timeline: 'Immediate',
      opportunities: ['Mobile-first products', 'Social features', 'Gamification']
    },
    {
      factor: 'High Smartphone Penetration',
      impact: 'Medium-High',
      description: '97% smartphone adoption rate, highest globally',
      timeline: 'Current advantage',
      opportunities: ['Mobile payments', 'App-based services', 'QR code adoption']
    },
    {
      factor: 'Banking Digitization',
      impact: 'Medium-High',
      description: 'Traditional banks investing heavily in digital transformation',
      timeline: '2-3 years',
      opportunities: ['Partnership models', 'White-label solutions', 'API integration']
    }
  ];

  const challenges = [
    {
      challenge: 'Regulatory Complexity',
      severity: 'High',
      description: 'Multiple regulatory bodies with evolving frameworks',
      mitigation: ['Early regulatory engagement', 'Compliance-first approach', 'Legal expertise investment'],
      timeline: '12-18 months to navigate'
    },
    {
      challenge: 'Cultural Adaptation',
      severity: 'Medium-High',
      description: 'Need for Sharia compliance and cultural sensitivity',
      mitigation: ['Islamic finance expertise', 'Local partnerships', 'Cultural advisory board'],
      timeline: '6-12 months to establish'
    },
    {
      challenge: 'Talent Shortage',
      severity: 'Medium',
      description: 'Limited local fintech expertise and experience',
      mitigation: ['International hiring', 'Training programs', 'University partnerships'],
      timeline: '18-24 months to build team'
    }
  ];

  const segmentTabs = [
    { id: 'overview', label: 'Market Overview', icon: BarChart3 },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'competition', label: 'Competition', icon: Target },
    { id: 'regulation', label: 'Regulation', icon: Shield },
    { id: 'drivers', label: 'Market Drivers', icon: TrendingUp },
    { id: 'challenges', label: 'Challenges', icon: AlertTriangle }
  ];

  const renderSegmentContent = () => {
    switch (activeSegment) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Market Size Breakdown */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Market Segments Breakdown
              </h3>
              <div className="space-y-4">
                {marketOverview.segments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{segment.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Market Share: {segment.share}</span>
                        <span className="text-sm text-green-600 dark:text-green-400">Growth: {segment.growth}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{segment.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                <h4 className="text-lg font-semibold mb-2">Total Addressable Market</h4>
                <div className="text-3xl font-bold mb-1">{marketOverview.totalSize}</div>
                <div className="text-sm opacity-90">Growing at {marketOverview.growth}</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
                <h4 className="text-lg font-semibold mb-2">Digital Adoption</h4>
                <div className="text-3xl font-bold mb-1">87%</div>
                <div className="text-sm opacity-90">Highest in MENA region</div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                <h4 className="text-lg font-semibold mb-2">Fintech Startups</h4>
                <div className="text-3xl font-bold mb-1">120+</div>
                <div className="text-sm opacity-90">Active in Saudi market</div>
              </div>
            </div>
          </div>
        );

      case 'demographics':
        return (
          <div className="space-y-6">
            {demographics.map((demo, index) => (
              <div key={index} className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{demo.segment}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{demo.size}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Market Value: {demo.value}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Adoption Rate</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all"
                          style={{ width: demo.adoption }}
                        ></div>
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-400">{demo.adoption}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Characteristics</h4>
                    <ul className="space-y-1">
                      {demo.characteristics.map((char, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'competition':
        return (
          <div className="space-y-6">
            {competitiveLandscape.map((category, index) => (
              <div key={index} className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{category.category}</h3>
                <div className="space-y-4">
                  {category.leaders.map((leader, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{leader.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-green-600 dark:text-green-400">Strength: </span>
                            <span className="text-gray-600 dark:text-gray-400">{leader.strength}</span>
                          </div>
                          <div>
                            <span className="text-red-600 dark:text-red-400">Weakness: </span>
                            <span className="text-gray-600 dark:text-gray-400">{leader.weakness}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{leader.marketShare}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Market Share</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'regulation':
        return (
          <div className="space-y-6">
            {regulatoryEnvironment.map((authority, index) => (
              <div key={index} className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{authority.authority}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      authority.supportLevel === 'High' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {authority.supportLevel} Support
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">{authority.role}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Initiatives</h4>
                    <ul className="space-y-2">
                      {authority.initiatives.map((initiative, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-500" />
                          {initiative}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Timeline</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{authority.timeline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'drivers':
        return (
          <div className="space-y-6">
            {marketDrivers.map((driver, index) => (
              <div key={index} className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{driver.factor}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    driver.impact === 'High' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  }`}>
                    {driver.impact} Impact
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">{driver.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Timeline</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{driver.timeline}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Opportunities</h4>
                    <ul className="space-y-1">
                      {driver.opportunities.map((opp, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'challenges':
        return (
          <div className="space-y-6">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{challenge.challenge}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    challenge.severity === 'High' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : challenge.severity === 'Medium-High'
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {challenge.severity} Risk
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">{challenge.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Mitigation Strategies</h4>
                    <ul className="space-y-1">
                      {challenge.mitigation.map((strategy, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Resolution Timeline</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.timeline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
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
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Saudi Fintech Market Analysis
          </h1>
          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">2024 Update</span>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Comprehensive analysis of Saudi Arabia's fintech landscape including market size, 
          competitive dynamics, regulatory environment, and growth opportunities.
        </p>
      </motion.div>

      {/* Key Market Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Market Size"
          value="SAR 45.8B"
          icon={DollarSign}
          trend={{ value: "+28% CAGR", isPositive: true }}
          color="green"
        />
        <MetricCard
          title="Digital Adoption"
          value="87%"
          icon={Smartphone}
          trend={{ value: "Highest in MENA", isPositive: true }}
          color="blue"
        />
        <MetricCard
          title="Active Fintechs"
          value="120+"
          icon={Building2}
          trend={{ value: "+45% in 2024", isPositive: true }}
          color="purple"
        />
        <MetricCard
          title="Investment Flow"
          value="SAR 2.8B"
          icon={TrendingUp}
          trend={{ value: "+65% YoY", isPositive: true }}
          color="emerald"
        />
      </div>

      {/* Analysis Sections */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {segmentTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSegment(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeSegment === tab.id
                    ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeSegment}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderSegmentContent()}
        </motion.div>
      </div>

      {/* Market Opportunity Summary */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Award className="w-8 h-8" />
          Investment Opportunity Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-4">Market Readiness</h3>
            <ul className="space-y-2 text-sm">
              <li>• Strong regulatory support</li>
              <li>• High digital adoption</li>
              <li>• Young, tech-savvy population</li>
              <li>• Government backing (Vision 2030)</li>
            </ul>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-4">Growth Potential</h3>
            <ul className="space-y-2 text-sm">
              <li>• 28% annual market growth</li>
              <li>• Underserved segments exist</li>
              <li>• Regional expansion opportunities</li>
              <li>• Strong consumer demand</li>
            </ul>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-4">Success Factors</h3>
            <ul className="space-y-2 text-sm">
              <li>• Sharia compliance essential</li>
              <li>• Local partnerships critical</li>
              <li>• Mobile-first approach</li>
              <li>• Regulatory early engagement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FintechMarketAnalysisPage;