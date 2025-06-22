import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Rocket,
  Shield,
  Smartphone,
  BarChart3,
  Target,
  Globe,
  Zap,
  AlertTriangle,
  Award
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { useTranslation } from 'react-i18next';

const SubBoxPlatformPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const keyFeatures = [
    t('subbox.features.unified_dashboard'),
    t('subbox.features.automated_tracking'), 
    t('subbox.features.smart_recommendations'),
    t('subbox.features.sama_payment'),
    t('subbox.features.arabic_support'),
    t('subbox.features.mobile_first'),
    t('subbox.features.spending_analytics'),
    t('subbox.features.family_sharing')
  ];

  const timeline = [
    { 
      phase: t('subbox.phase_1'), 
      period: t('subbox.months_1_4'), 
      status: t('subbox.planned'), 
      budget: "SAR 2.5M",
      tasks: [t('subbox.tasks.core_platform'), t('subbox.tasks.sama_setup'), t('subbox.tasks.basic_tracking'), t('subbox.tasks.mvp_launch')] 
    },
    { 
      phase: t('subbox.phase_2'), 
      period: t('subbox.months_5_8'), 
      status: t('subbox.planned'), 
      budget: "SAR 3.2M",
      tasks: [t('subbox.tasks.beta_launch'), t('subbox.tasks.partnerships'), t('subbox.tasks.advanced_analytics'), t('subbox.tasks.customer_acquisition')] 
    },
    { 
      phase: t('subbox.phase_3'), 
      period: t('subbox.months_9_12'), 
      status: t('subbox.planned'), 
      budget: "SAR 4.1M",
      tasks: [t('subbox.tasks.b2b_features'), t('subbox.tasks.regional_expansion'), t('subbox.tasks.ai_recommendations'), t('subbox.tasks.ipo_preparation')] 
    }
  ];

  const marketData = [
    { metric: t('subbox.saudi_subscription_market'), value: "SAR 4.2B", growth: `+35% ${t('subbox.yoy')}`, color: "green" },
    { metric: t('subbox.avg_subscriptions_person'), value: "12", growth: `+28% ${t('subbox.yoy')}`, color: "blue" },
    { metric: t('subbox.subscription_waste'), value: "SAR 890/year", growth: `-15% ${t('subbox.potential_savings')}`, color: "red" },
    { metric: t('subbox.market_penetration_goal'), value: "8%", growth: t('subbox.year_3_target'), color: "purple" }
  ];

  const revenueStreams = [
    { name: t('subbox.freemium_model'), description: t('subbox.freemium_desc'), revenue: "SAR 0", users: "70%" },
    { name: t('subbox.premium_individual'), description: t('subbox.premium_desc'), revenue: "SAR 29/month", users: "25%" },
    { name: t('subbox.family_plan'), description: t('subbox.family_desc'), revenue: "SAR 79/month", users: "15%" },
    { name: t('subbox.b2b_enterprise'), description: t('subbox.enterprise_desc'), revenue: "SAR 299/month", users: "5%" }
  ];

  const competitiveAdvantages = [
    { 
      title: t('subbox.saudi_first_design'), 
      description: t('subbox.saudi_first_desc'),
      icon: Globe 
    },
    { 
      title: t('subbox.sama_compliance'), 
      description: t('subbox.sama_compliance_desc'),
      icon: Shield 
    },
    { 
      title: t('subbox.advanced_ai_analytics'), 
      description: t('subbox.advanced_ai_desc'),
      icon: BarChart3 
    },
    { 
      title: t('subbox.family_centric'), 
      description: t('subbox.family_centric_desc'),
      icon: Users 
    }
  ];

  const tabs = [
    { id: 'overview', label: t('subbox.tabs.overview'), icon: Target },
    { id: 'market', label: t('subbox.tabs.market'), icon: TrendingUp },
    { id: 'features', label: t('subbox.tabs.features'), icon: CheckCircle },
    { id: 'financials', label: t('subbox.tabs.financials'), icon: DollarSign },
    { id: 'timeline', label: t('subbox.tabs.timeline'), icon: Calendar }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Competitive Advantages */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-500" />
                {t('subbox.competitive_advantages')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {competitiveAdvantages.map((advantage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <advantage.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {advantage.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {advantage.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Problem & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {t('subbox.the_problem')}
                </h3>
                <ul className="space-y-2 text-red-700 dark:text-red-400">
                  <li>• {t('subbox.problem_points.p1')}</li>
                  <li>• {t('subbox.problem_points.p2')}</li>
                  <li>• {t('subbox.problem_points.p3')}</li>
                  <li>• {t('subbox.problem_points.p4')}</li>
                  <li>• {t('subbox.problem_points.p5')}</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {t('subbox.our_solution')}
                </h3>
                <ul className="space-y-2 text-green-700 dark:text-green-400">
                  <li>• {t('subbox.solution_points.s1')}</li>
                  <li>• {t('subbox.solution_points.s2')}</li>
                  <li>• {t('subbox.solution_points.s3')}</li>
                  <li>• {t('subbox.solution_points.s4')}</li>
                  <li>• {t('subbox.solution_points.s5')}</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'market':
        return (
          <div className="space-y-6">
            {/* Market Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.map((data, index) => (
                <MetricCard
                  key={index}
                  title={data.metric}
                  value={data.value}
                  icon={TrendingUp}
                  trend={{ value: data.growth, isPositive: !data.growth.includes('-') }}
                  color={data.color}
                />
              ))}
            </div>

            {/* Market Analysis */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('subbox.saudi_subscription_economy')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('subbox.market_size')}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {t('subbox.market_size_desc')}
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• {t('subbox.entertainment')}: 45% (Netflix, Shahid, etc.)</li>
                    <li>• {t('subbox.software')}: 30% (Microsoft, Adobe, etc.)</li>
                    <li>• {t('subbox.ecommerce')}: 15% (Amazon Prime, etc.)</li>
                    <li>• {t('subbox.other')}: 10% (Fitness, News, etc.)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('subbox.target_demographics')}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {t('subbox.target_demographics_desc')}
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• 2.1M {t('subbox.potential_users')}</li>
                    <li>• {t('subbox.average_income')}: SAR 15,000+/month</li>
                    <li>• {t('subbox.urban_areas')}</li>
                    <li>• {t('subbox.smartphone_adoption')}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('subbox.competition')}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {t('subbox.competition_desc')}
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• {t('subbox.truebill')}</li>
                    <li>• {t('subbox.honey')}</li>
                    <li>• {t('subbox.bank_apps')}</li>
                    <li>• {t('subbox.no_arabic_solution')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            {/* Core Features */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-500" />
                {t('subbox.core_features')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Technical Architecture */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('subbox.technical_architecture')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('subbox.mobile_first_title')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('subbox.mobile_first_desc')}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('subbox.security_first_title')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('subbox.security_first_desc')}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('subbox.ai_powered_title')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('subbox.ai_powered_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'financials':
        return (
          <div className="space-y-6">
            {/* Revenue Streams */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('subbox.revenue_model')}
              </h3>
              <div className="space-y-4">
                {revenueStreams.map((stream, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{stream.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stream.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 dark:text-green-400">{stream.revenue}</div>
                      <div className="text-sm text-gray-500">{stream.users} {t('subbox.of_users')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Projections */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('subbox.5_year_projections')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((year) => (
                  <div key={year} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">{t('subbox.year')} {year}</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">{t('subbox.users')}</div>
                        <div className="font-semibold">{(25000 * Math.pow(2.5, year - 1)).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">{t('subbox.revenue')}</div>
                        <div className="font-semibold text-green-600">SAR {(2.1 * Math.pow(3.2, year - 1)).toFixed(1)}M</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">{t('subbox.profit')}</div>
                        <div className="font-semibold text-blue-600">SAR {(0.5 * Math.pow(4.1, year - 1)).toFixed(1)}M</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-6">
            {/* Implementation Timeline */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-500" />
                {t('subbox.implementation_roadmap')}
              </h3>
              <div className="space-y-6">
                {timeline.map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="relative"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {phase.phase}
                          </h4>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {phase.period}
                            </span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {phase.budget}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          {phase.tasks.map((task, taskIndex) => (
                            <div
                              key={taskIndex}
                              className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2"
                            >
                              {task}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Investment Requirements */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('subbox.investment_requirements')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-bold text-2xl text-blue-600 dark:text-blue-400 mb-2">SAR 9.8M</h4>
                  <p className="text-gray-600 dark:text-gray-400">{t('subbox.total_investment')}</p>
                  <p className="text-sm text-gray-500 mt-2">{t('subbox.12_month_runway')}</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-bold text-2xl text-green-600 dark:text-green-400 mb-2">SAR 45.2M</h4>
                  <p className="text-gray-600 dark:text-gray-400">{t('subbox.year_3_revenue')}</p>
                  <p className="text-sm text-gray-500 mt-2">{t('subbox.break_even_18')}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-bold text-2xl text-purple-600 dark:text-purple-400 mb-2">460%</h4>
                  <p className="text-gray-600 dark:text-gray-400">{t('subbox.5_year_roi')}</p>
                  <p className="text-sm text-gray-500 mt-2">{t('subbox.conservative_estimate')}</p>
                </div>
              </div>
            </div>
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
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('subbox.title')}
          </h1>
          <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">{t('subbox.ready_to_launch')}</span>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('subbox.subtitle')}
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('subbox.launch_timeline')}
          value="12 Months"
          icon={Calendar}
          trend={{ value: t('subbox.fast_track_ready'), isPositive: true }}
          color="blue"
        />
        <MetricCard
          title={t('subbox.target_market')}
          value="SAR 4.2B"
          icon={TrendingUp}
          trend={{ value: `+35% ${t('subbox.growth')}`, isPositive: true }}
          color="green"
        />
        <MetricCard
          title={t('subbox.year_3_users')}
          value="390K+"
          icon={Users}
          trend={{ value: `8% ${t('subbox.market_penetration')}`, isPositive: true }}
          color="purple"
        />
        <MetricCard
          title={t('subbox.year_5_revenue')}
          value="SAR 145M"
          icon={DollarSign}
          trend={{ value: "460% ROI", isPositive: true }}
          color="emerald"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab.id
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
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg p-8 text-center text-white"
      >
        <Rocket className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">{t('subbox.ready_to_launch_title')}</h2>
        <p className="text-lg opacity-90 mb-6">
          {t('subbox.ready_to_launch_desc')}
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            {t('subbox.download_business_plan')}
          </button>
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            {t('subbox.request_investment_meeting')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SubBoxPlatformPage;