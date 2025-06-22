import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

// Lazy load all pages for better performance
const IntroPage = lazy(() => import('../pages/IntroPage'));
const Overview = lazy(() => import('../pages/Overview'));
const ProductPage = lazy(() => import('../pages/ProductPage'));
const ComparisonPage = lazy(() => import('../pages/ComparisonPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

// Mega Plan Pages
const MegaPlanOverview = lazy(() => import('../pages/MegaPlanOverview'));
const MegaPlanDetails = lazy(() => import('../pages/MegaPlanDetails'));
const MegaPlanRoadmap = lazy(() => import('../pages/MegaPlanRoadmap'));

// Analysis Pages
const AllProductsAnalysis = lazy(() => import('../pages/AllProductsAnalysis'));
const FullPlatformAnalysis = lazy(() => import('../pages/FullPlatformAnalysis'));
const SingleClientAnalysis = lazy(() => import('../pages/SingleClientAnalysis'));

// Projections Pages
const LLMProjections = lazy(() => import('../pages/LLMProjections'));
const PGWProjections = lazy(() => import('../pages/PGWProjections'));
const HospitalityProjections = lazy(() => import('../pages/HospitalityProjections'));

// Master Plan Documents
const MasterPlanOverviewPage = lazy(() => import('../pages/MasterPlanOverviewPage'));
const CoreTechnologiesPage = lazy(() => import('../pages/CoreTechnologiesPage'));
const NCQPlatformPlanPage = lazy(() => import('../pages/NCQPlatformPlanPage'));
const NCQLLMPlanPage = lazy(() => import('../pages/NCQLLMPlanPage'));
const SmartHospitalityPlanPage = lazy(() => import('../pages/SmartHospitalityPlanPage'));

// SRS Documents
const NCQPlatformSRSPage = lazy(() => import('../pages/NCQPlatformSRSPage'));
const PaymentGatewaySRSPage = lazy(() => import('../pages/PaymentGatewaySRSPage'));
const HospitalManagementSRSPage = lazy(() => import('../pages/HospitalManagementSRSPage'));
const SmartHospitalitySRSPage = lazy(() => import('../pages/SmartHospitalitySRSPage'));
const IoTPlatformSRSPage = lazy(() => import('../pages/IoTPlatformSRSPage'));
const BlockchainProductsSRSPage = lazy(() => import('../pages/BlockchainProductsSRSPage'));

// Future Products
const FutureIoTPlatformPage = lazy(() => import('../pages/FutureIoTPlatformPage'));
const FutureBlockchainSuitePage = lazy(() => import('../pages/FutureBlockchainSuitePage'));
const FutureHospitalManagementPage = lazy(() => import('../pages/FutureHospitalManagementPage'));
const FutureMobileAppPage = lazy(() => import('../pages/FutureMobileAppPage'));
const FutureMobileLLMPage = lazy(() => import('../pages/FutureMobileLLMPage'));

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/intro" replace />} />
        
        {/* Main Pages */}
        <Route path="/intro" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <IntroPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/overview" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Overview />
            </Suspense>
          </ErrorBoundary>
        } />

        {/* Mega Plan Routes */}
        <Route path="/mega-plan/overview" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <MegaPlanOverview />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/mega-plan/details" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <MegaPlanDetails />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/mega-plan/roadmap" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <MegaPlanRoadmap />
            </Suspense>
          </ErrorBoundary>
        } />

        {/* Product Routes */}
        <Route path="/products/pgw" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <ProductPage productKey="pgw" />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/products/llm" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <ProductPage productKey="llm" />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/products/hospitality" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <ProductPage productKey="hospitality" />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/products/comparison" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <ComparisonPage />
            </Suspense>
          </ErrorBoundary>
        } />

        {/* Future Products Routes */}
        <Route path="/future-products/iot-platform" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <FutureIoTPlatformPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/future-products/blockchain-suite" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <FutureBlockchainSuitePage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/future-products/hospital-management" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <FutureHospitalManagementPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/future-products/mobile-app" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <FutureMobileAppPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/future-products/mobile-llm" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <FutureMobileLLMPage />
            </Suspense>
          </ErrorBoundary>
        } />

        {/* Analysis Routes */}
        <Route path="/analysis/all-products" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <AllProductsAnalysis />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/analysis/full-platform" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <FullPlatformAnalysis />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/analysis/single-client" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SingleClientAnalysis />
            </Suspense>
          </ErrorBoundary>
        } />

        {/* Projections Routes */}
        <Route path="/projections/pgw" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <PGWProjections />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/projections/llm" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <LLMProjections />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/projections/hospitality" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <HospitalityProjections />
            </Suspense>
          </ErrorBoundary>
        } />

        {/* Master Plans Routes */}
        <Route path="/master-plans/overview" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <MasterPlanOverviewPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/master-plans/core-technologies" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <CoreTechnologiesPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/master-plans/ncq-platform" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <NCQPlatformPlanPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/master-plans/ncq-llm" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <NCQLLMPlanPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/master-plans/smart-hospitality" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SmartHospitalityPlanPage />
            </Suspense>
          </ErrorBoundary>
        } />

        {/* SRS Routes */}
        <Route path="/srs/ncq-platform" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <NCQPlatformSRSPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/srs/payment-gateway" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <PaymentGatewaySRSPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/srs/hospital-management" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <HospitalManagementSRSPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/srs/smart-hospitality" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SmartHospitalitySRSPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/srs/iot-platform" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <IoTPlatformSRSPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        <Route path="/srs/blockchain-products" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <BlockchainProductsSRSPage />
            </Suspense>
          </ErrorBoundary>
        } />

        {/* Settings */}
        <Route path="/settings" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SettingsPage />
            </Suspense>
          </ErrorBoundary>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/intro" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;