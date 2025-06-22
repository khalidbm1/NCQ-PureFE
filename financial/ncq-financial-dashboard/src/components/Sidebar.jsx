import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Brain, 
  Building2, 
  BarChart3, 
  Settings, 
  Sun, 
  Moon,
  Menu,
  X,
  DollarSign,
  Users,
  TrendingUp,
  Layers,
  FileText,
  ChevronDown,
  ChevronRight,
  Home,
  Briefcase,
  Languages,
  Cpu,
  Hospital,
  Zap,
  Rocket,
  Shield,
  Smartphone,
  Target,
  Globe
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFinancial } from '../contexts/FinancialContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ activePage, setActivePage, isMobileOpen, setIsMobileOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const { isDark, toggleTheme } = useTheme();
  const { financialData } = useFinancial();
  const { language, changeLanguage } = useLanguage();
  const { displayCurrency, toggleCurrency } = useCurrency();
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({
    products: true,
    fintechProducts: false,
    fintechAnalysis: false,
    analysis: true,
    projections: true,
    megaplan: true,
    masterplans: false,
    srs: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuStructure = [
    { id: 'intro', label: t('navigation.introduction'), icon: Home, type: 'single' },
    { id: 'overview', label: t('navigation.dashboard_overview'), icon: BarChart3, type: 'single' },
    {
      type: 'section',
      id: 'megaplan',
      label: t('navigation.mega_plan'),
      icon: Briefcase,
      items: [
        { id: 'mega-plan-overview', label: t('navigation.overview'), icon: FileText },
        { id: 'mega-plan-details', label: t('navigation.detailed_plan'), icon: FileText },
        { id: 'mega-plan-roadmap', label: t('navigation.roadmap'), icon: FileText },
      ]
    },
    {
      type: 'section',
      id: 'products',
      label: t('navigation.products'),
      icon: CreditCard,
      items: [
        { id: 'pgw', label: t('navigation.payment_gateway'), icon: CreditCard },
        { id: 'llm', label: t('navigation.llm_platform'), icon: Brain },
        { id: 'hospitality', label: t('navigation.smart_hospitality'), icon: Building2 },
        { id: 'comparison', label: t('navigation.compare_products'), icon: Layers },
      ]
    },
    {
      type: 'section',
      id: 'fintechProducts',
      label: t('navigation.fintech_future_products'),
      icon: DollarSign,
      items: [
        { id: 'subbox-platform', label: t('navigation.subbox_platform'), icon: CreditCard },
        { id: 'fintech-execution-plans', label: t('navigation.execution_plans'), icon: Target },
        { id: 'global-fintech-ideas', label: t('navigation.global_fintech_ideas'), icon: Globe },
      ]
    },
    {
      type: 'section',
      id: 'fintechAnalysis',
      label: t('navigation.fintech_analysis'),
      icon: BarChart3,
      items: [
        { id: 'fintech-market-analysis', label: t('navigation.market_analysis'), icon: TrendingUp },
        { id: 'fintech-projections', label: t('navigation.financial_projections'), icon: BarChart3 },
        { id: 'fintech-comparison', label: t('navigation.product_comparison'), icon: Layers },
      ]
    },
    {
      type: 'section',
      id: 'analysis',
      label: t('navigation.financial_analysis'),
      icon: DollarSign,
      items: [
        { id: 'all-products-analysis', label: t('navigation.all_products'), icon: FileText },
        { id: 'full-platform-analysis', label: t('navigation.full_platform'), icon: FileText },
        { id: 'single-client-analysis', label: t('navigation.single_client'), icon: FileText },
      ]
    },
    {
      type: 'section',
      id: 'projections',
      label: t('navigation.revenue_projections'),
      icon: TrendingUp,
      items: [
        { id: 'pgw-projections', label: t('navigation.pgw_projections'), icon: FileText },
        { id: 'llm-projections', label: t('navigation.llm_projections'), icon: FileText },
        { id: 'hospitality-projections', label: t('navigation.hospitality_projections'), icon: FileText },
      ]
    },
    {
      type: 'section',
      id: 'masterplans',
      label: t('navigation.master_plans'),
      icon: Briefcase,
      items: [
        { id: 'master-plan-overview-doc', label: t('navigation.master_plan_overview'), icon: Briefcase },
        { id: 'core-technologies', label: t('navigation.core_technologies'), icon: Cpu },
        { id: 'ncq-platform-plan', label: t('navigation.ncq_platform_plan'), icon: Layers },
        { id: 'ncq-llm-plan', label: t('navigation.ncq_llm_plan'), icon: Brain },
        { id: 'smart-hospitality-plan', label: t('navigation.smart_hospitality_plan'), icon: Building2 },
      ]
    },
    {
      type: 'section',
      id: 'srs',
      label: t('navigation.srs_documents'),
      icon: FileText,
      items: [
        { id: 'ncq-platform-srs', label: t('navigation.ncq_platform_srs'), icon: Layers },
        { id: 'payment-gateway-srs', label: t('navigation.payment_gateway_srs'), icon: CreditCard },
        { id: 'hospital-management-srs', label: t('navigation.hospital_management_srs'), icon: Hospital },
        { id: 'smart-hospitality-srs', label: t('navigation.smart_hospitality_srs'), icon: Building2 },
        { id: 'iot-platform-srs', label: t('navigation.iot_platform_srs'), icon: Zap },
        { id: 'blockchain-products-srs', label: t('navigation.blockchain_products_srs'), icon: FileText },
      ]
    },
    { id: 'settings', label: t('navigation.data_settings'), icon: Settings, type: 'single' },
    { id: 'link-test', label: t('navigation.test_all_links'), icon: Zap, type: 'single' },
  ];

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = activePage === item.id;

    return (
      <motion.button
        key={item.id}
        onClick={() => {
          setActivePage(item.id);
          setIsMobileOpen(false);
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
          isActive
            ? 'bg-primary-500 text-white shadow-lg'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <Icon size={18} />
        <span className="font-medium text-sm">{item.label}</span>
      </motion.button>
    );
  };

  const renderSection = (section) => {
    const Icon = section.icon;
    const isExpanded = expandedSections[section.id];
    const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

    return (
      <div key={section.id} className="mb-2">
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <div className="flex items-center gap-3">
            <Icon size={18} />
            <span className="font-medium text-sm">{section.label}</span>
          </div>
          <ChevronIcon size={16} />
        </button>
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="ml-4 mt-1 space-y-1">
            {section.items.map(renderMenuItem)}
          </div>
        </motion.div>
      </div>
    );
  };

  const sidebarVariants = {
    desktop: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    mobile: {
      x: isMobileOpen ? 0 : '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-dark-card shadow-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={!isMobile ? 'desktop' : 'mobile'}
        initial="mobile"
        className="fixed lg:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border z-40 overflow-y-auto"
      >
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuStructure.map((item) => {
              if (item.type === 'section') {
                return renderSection(item);
              }
              return renderMenuItem(item);
            })}
          </nav>

          {/* Theme & Language Toggle */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-border space-y-3">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="font-medium">
                {isDark ? t('common.dark_mode') : t('common.light_mode')}
              </span>
              <motion.div
                animate={{ rotate: isDark ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
              </motion.div>
            </motion.button>

            <motion.button
              onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="font-medium">
                {t('common.language')}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {language === 'en' ? 'العربية' : 'English'}
                </span>
                <Languages size={20} />
              </div>
            </motion.button>

            <motion.button
              onClick={toggleCurrency}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <span className="font-medium">
                {t('common.currency')}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {displayCurrency === 'SAR' ? 'USD' : 'SAR'}
                </span>
                <DollarSign size={20} />
              </div>
            </motion.button>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {t('dashboard.subtitle')}
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('dashboard.total_investment')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  SAR 15M
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('dashboard.five_year_revenue')}</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  SAR 142.5M
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('common.roi')}</span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  950%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;