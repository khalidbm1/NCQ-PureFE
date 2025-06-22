import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Flag, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MegaPlanRoadmap = () => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(2025);

  const roadmapData = {
    2025: {
      quarter1: [
        t('roadmap.series_a_funding'),
        t('roadmap.core_team_hiring'),
        t('roadmap.pgw_beta_launch'),
        t('roadmap.riyadh_headquarters')
      ],
      quarter2: [
        t('roadmap.llm_mvp_launch'),
        t('roadmap.hospitality_development'),
        t('roadmap.first_enterprise_clients'),
        t('roadmap.security_framework')
      ],
      quarter3: [
        'Launch Smart Hospitality beta',
        'Expand to 25 total clients',
        'Begin mobile app development',
        'Establish UAE office'
      ],
      quarter4: [
        'Full product suite launch',
        'Reach 100 total clients',
        'Prepare Series B funding',
        'Begin regulatory approvals for GCC'
      ]
    },
    2026: {
      quarter1: [
        'Series B funding (SAR 300M)',
        'Launch in UAE market',
        'Reach 250 clients',
        'Team expansion to 400 employees'
      ],
      quarter2: [
        'Qatar market entry',
        'Launch enterprise features',
        'Reach 500 clients',
        'Begin acquisition talks'
      ],
      quarter3: [
        'Kuwait market expansion',
        'Platform 2.0 launch',
        'Reach 750 clients',
        'Strategic partnerships'
      ],
      quarter4: [
        'Year-end: 1,000+ clients',
        'Prepare Series C',
        'Innovation lab setup',
        'Begin IPO preparations'
      ]
    },
    2027: {
      quarter1: [
        'Series C funding (SAR 500M)',
        'Egypt market entry',
        'Reach 2,000 clients',
        'AI research center'
      ],
      quarter2: [
        'Jordan market expansion',
        'Platform 3.0 development',
        'Reach 3,500 clients',
        'Global partnerships'
      ],
      quarter3: [
        'Morocco market entry',
        'Advanced AI features',
        'Reach 5,000 clients',
        'Acquisition completed'
      ],
      quarter4: [
        'Year-end: 7,500+ clients',
        'Pre-IPO preparations',
        'Global expansion planning',
        'Innovation showcase'
      ]
    },
    2028: {
      quarter1: [
        'Growth funding (SAR 750M)',
        'European market research',
        'Reach 10,000 clients',
        'Advanced R&D center'
      ],
      quarter2: [
        'Platform 4.0 beta',
        'Asian market analysis',
        'Reach 12,500 clients',
        'Patent portfolio expansion'
      ],
      quarter3: [
        'Global platform ready',
        'Regulatory approvals',
        'Reach 15,000 clients',
        'IPO roadshow begins'
      ],
      quarter4: [
        'Year-end: 20,000+ clients',
        'Pre-IPO valuation',
        'Market leadership achieved',
        'Global expansion ready'
      ]
    },
    2029: {
      quarter1: [
        'Pre-IPO funding (SAR 1B)',
        'US market entry',
        'Reach 25,000 clients',
        'Global headquarters setup'
      ],
      quarter2: [
        'European expansion',
        'Platform 5.0 launch',
        'Reach 30,000 clients',
        'IPO preparations final'
      ],
      quarter3: [
        'Asian pilot programs',
        'Advanced enterprise features',
        'Reach 35,000 clients',
        'Regulatory compliance global'
      ],
      quarter4: [
        'Year-end: 40,000+ clients',
        'IPO readiness achieved',
        'Global platform leader',
        'Innovation awards'
      ]
    },
    2030: {
      quarter1: [
        'IPO launch (SAR 5B+)',
        'Public company status',
        'Reach 50,000 clients',
        'Global market presence'
      ],
      quarter2: [
        'Post-IPO growth',
        'Strategic acquisitions',
        'Reach 60,000 clients',
        'Innovation leadership'
      ],
      quarter3: [
        'Market consolidation',
        'Next-gen platform',
        'Reach 75,000 clients',
        'Sustainable growth'
      ],
      quarter4: [
        'Year-end: 100,000+ clients',
        'Vision 2030 achieved',
        'Market dominance',
        'Future roadmap 2031-2035'
      ]
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-8 shadow-lg text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <Calendar size={32} />
          <h1 className="text-3xl font-bold">{t('navigation.roadmap')}</h1>
        </div>
        <p className="text-purple-100 text-lg">
          {t('mega_plan.subtitle')} (2025-2030)
        </p>
      </motion.div>

      {/* Year Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('roadmap.select_year')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedYear === year
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Quarterly Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        key={selectedYear}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {selectedYear} {t('navigation.roadmap')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(roadmapData[selectedYear]).map(([quarter, milestones], index) => {
            const quarterNum = quarter.replace('quarter', 'Q');
            const isPast = selectedYear < 2025 || (selectedYear === 2025 && index < 3);
            
            return (
              <motion.div
                key={quarter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`border-2 rounded-lg p-4 ${
                  isPast 
                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  {isPast ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <Flag size={20} className="text-primary-600" />
                  )}
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {quarterNum} {selectedYear}
                  </h4>
                </div>
                
                <ul className="space-y-2">
                  {milestones.map((milestone, milestoneIndex) => (
                    <li 
                      key={milestoneIndex} 
                      className={`text-sm flex items-start gap-2 ${
                        isPast ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        isPast ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      {milestone}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Timeline Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('roadmap.major_milestones_overview')}
        </h3>
        
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
          
          <div className="space-y-8">
            {[
              { year: '2025', title: 'Foundation & Launch', description: 'Platform development, Series A, initial clients' },
              { year: '2026', title: 'Regional Expansion', description: 'GCC market entry, Series B, 1,000+ clients' },
              { year: '2027', title: 'Market Leadership', description: 'MENA expansion, Series C, 7,500+ clients' },
              { year: '2028', title: 'Global Preparation', description: 'Growth funding, global readiness, 20,000+ clients' },
              { year: '2029', title: 'International Growth', description: 'Global expansion, Pre-IPO, 40,000+ clients' },
              { year: '2030', title: 'Market Dominance', description: 'IPO, global leader, 100,000+ clients' }
            ].map((milestone, index) => (
              <div key={index} className="relative flex items-start">
                <div className="absolute left-8 w-4 h-4 bg-primary-600 rounded-full -translate-x-1/2 border-4 border-white dark:border-dark-card"></div>
                <div className="ml-16">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl font-bold text-primary-600">{milestone.year}</span>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{milestone.title}</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Success Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('roadmap.kpi_by_2030')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Clients', value: '100,000+', icon: '👥' },
            { label: 'Annual Revenue', value: 'SAR 2.67B', icon: '💰' },
            { label: 'Market Cap', value: 'SAR 30B+', icon: '📈' },
            { label: 'Employees', value: '3,500+', icon: '🚀' }
          ].map((kpi, index) => (
            <div key={index} className="bg-white dark:bg-dark-card rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">{kpi.icon}</div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{kpi.label}</h4>
              <p className="text-xl font-bold text-primary-600">{kpi.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MegaPlanRoadmap;