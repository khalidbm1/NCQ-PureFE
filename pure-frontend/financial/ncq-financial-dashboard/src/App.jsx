import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { FinancialProvider } from './contexts/FinancialContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import ProductPage from './pages/ProductPage';
import ComparisonPage from './pages/ComparisonPage';
import FinancialAnalysisPage from './pages/FinancialAnalysisPage';
import ProjectionsPage from './pages/ProjectionsPage';
import SettingsPage from './pages/SettingsPage';
import AllProductsAnalysis from './pages/AllProductsAnalysis';
import FullPlatformAnalysis from './pages/FullPlatformAnalysis';
import SingleClientAnalysis from './pages/SingleClientAnalysis';
import LLMProjections from './pages/LLMProjections';
import PGWProjections from './pages/PGWProjections';
import HospitalityProjections from './pages/HospitalityProjections';
import IntroPage from './pages/IntroPage';
import MegaPlanOverview from './pages/MegaPlanOverview';
import MegaPlanDetails from './pages/MegaPlanDetails';
import MegaPlanRoadmap from './pages/MegaPlanRoadmap';
// Master Plan Documents
import MasterPlanOverviewPage from './pages/MasterPlanOverviewPage';
import CoreTechnologiesPage from './pages/CoreTechnologiesPage';
import NCQPlatformPlanPage from './pages/NCQPlatformPlanPage';
import NCQLLMPlanPage from './pages/NCQLLMPlanPage';
import SmartHospitalityPlanPage from './pages/SmartHospitalityPlanPage';
// SRS Documents
import NCQPlatformSRSPage from './pages/NCQPlatformSRSPage';
import PaymentGatewaySRSPage from './pages/PaymentGatewaySRSPage';
import HospitalManagementSRSPage from './pages/HospitalManagementSRSPage';
import SmartHospitalitySRSPage from './pages/SmartHospitalitySRSPage';
import IoTPlatformSRSPage from './pages/IoTPlatformSRSPage';
import BlockchainProductsSRSPage from './pages/BlockchainProductsSRSPage';
// Fintech Future Products
import SubBoxPlatformPage from './pages/SubBoxPlatformPage';
import FintechExecutionPlansPage from './pages/FintechExecutionPlansPage';
import GlobalFintechIdeasPage from './pages/GlobalFintechIdeasPage';
import FintechMarketAnalysisPage from './pages/FintechMarketAnalysisPage';
import FintechProjectionsPage from './pages/FintechProjectionsPage';
import FintechComparisonPage from './pages/FintechComparisonPage';
import LinkTestPage from './pages/LinkTestPage';

function App() {
  const [activePage, setActivePage] = useState('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'intro':
        return <IntroPage />;
      case 'overview':
        return <Overview />;
      case 'mega-plan-overview':
        return <MegaPlanOverview />;
      case 'mega-plan-details':
        return <MegaPlanDetails />;
      case 'mega-plan-roadmap':
        return <MegaPlanRoadmap />;
      case 'pgw':
        return <ProductPage productKey="pgw" />;
      case 'llm':
        return <ProductPage productKey="llm" />;
      case 'hospitality':
        return <ProductPage productKey="hospitality" />;
      case 'comparison':
        return <ComparisonPage />;
      case 'financial-analysis':
        return <FinancialAnalysisPage setActivePage={setActivePage} />;
      case 'projections':
        return <ProjectionsPage setActivePage={setActivePage} />;
      case 'settings':
        return <SettingsPage />;
      case 'all-products-analysis':
        return <AllProductsAnalysis />;
      case 'full-platform-analysis':
        return <FullPlatformAnalysis />;
      case 'single-client-analysis':
        return <SingleClientAnalysis />;
      case 'llm-projections':
        return <LLMProjections />;
      case 'pgw-projections':
        return <PGWProjections />;
      case 'hospitality-projections':
        return <HospitalityProjections />;
      // Master Plan Documents
      case 'master-plan-overview-doc':
        return <MasterPlanOverviewPage />;
      case 'core-technologies':
        return <CoreTechnologiesPage />;
      case 'ncq-platform-plan':
        return <NCQPlatformPlanPage />;
      case 'ncq-llm-plan':
        return <NCQLLMPlanPage />;
      case 'smart-hospitality-plan':
        return <SmartHospitalityPlanPage />;
      // SRS Documents
      case 'ncq-platform-srs':
        return <NCQPlatformSRSPage />;
      case 'payment-gateway-srs':
        return <PaymentGatewaySRSPage />;
      case 'hospital-management-srs':
        return <HospitalManagementSRSPage />;
      case 'smart-hospitality-srs':
        return <SmartHospitalitySRSPage />;
      case 'iot-platform-srs':
        return <IoTPlatformSRSPage />;
      case 'blockchain-products-srs':
        return <BlockchainProductsSRSPage />;
      // Fintech Future Products
      case 'subbox-platform':
        return <SubBoxPlatformPage />;
      case 'fintech-execution-plans':
        return <FintechExecutionPlansPage />;
      case 'global-fintech-ideas':
        return <GlobalFintechIdeasPage />;
      case 'fintech-market-analysis':
        return <FintechMarketAnalysisPage />;
      case 'fintech-projections':
        return <FintechProjectionsPage />;
      case 'fintech-comparison':
        return <FintechComparisonPage />;
      case 'link-test':
        return <LinkTestPage setActivePage={setActivePage} />;
      default:
        return <IntroPage />;
    }
  };

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <ThemeProvider>
          <FinancialProvider>
            <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg">
              <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
              />
              <main className="flex-1 p-6 lg:p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                  {renderPage()}
                </div>
              </main>
            </div>
          </FinancialProvider>
        </ThemeProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;