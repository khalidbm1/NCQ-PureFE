import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from './components/layout/Layout'

// Main Pages
import Dashboard from './pages/Dashboard'
import PlatformLanding from './pages/PlatformLanding'

// Product Pages
import HospitalManagement from './pages/products/HospitalManagement'
import LLMPlatform from './pages/products/LLMPlatform'
import IoTPlatform from './pages/products/IoTPlatform'
import PaymentGateway from './pages/products/PaymentGateway'
import SmartBuildings from './pages/SmartBuildings'
import Building3D from './pages/Building3D'
import HospitalityHub from './pages/products/HospitalityHub'
import TravelerPortal from './pages/products/TravelerPortal'
import BusinessDashboard from './pages/products/BusinessDashboard'

// Placeholder pages for routing
const Files = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">My Files</h1>
    <p className="text-muted-foreground">File management interface - Coming soon</p>
  </div>
)

const Upload = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Upload Files</h1>
    <p className="text-muted-foreground">File upload interface - Coming soon</p>
  </div>
)

const Analytics = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Analytics</h1>
    <p className="text-muted-foreground">Analytics dashboard - Coming soon</p>
  </div>
)

const Billing = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Billing & Plans</h1>
    <p className="text-muted-foreground">Billing management - Coming soon</p>
  </div>
)

const ApiKeys = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">API Keys</h1>
    <p className="text-muted-foreground">API key management - Coming soon</p>
  </div>
)

const Team = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Team</h1>
    <p className="text-muted-foreground">Team management - Coming soon</p>
  </div>
)

const Settings = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Settings</h1>
    <p className="text-muted-foreground">Account settings - Coming soon</p>
  </div>
)

const Help = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Help & Support</h1>
    <p className="text-muted-foreground">Help documentation - Coming soon</p>
  </div>
)

function App() {
  // Initialize dark mode
  useEffect(() => {
    const theme = localStorage.getItem('theme')
    const isDark = theme === 'dark' || 
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* All routes are now public */}
          <Route 
            path="/dashboard" 
            element={
              <Layout>
                <Dashboard />
              </Layout>
            } 
          />
          
          <Route 
            path="/files" 
            element={
              <Layout>
                <Files />
              </Layout>
            } 
          />
          
          <Route 
            path="/upload" 
            element={
              <Layout>
                <Upload />
              </Layout>
            } 
          />
          
          <Route 
            path="/analytics" 
            element={
              <Layout>
                <Analytics />
              </Layout>
            } 
          />
          
          <Route 
            path="/billing" 
            element={
              <Layout>
                <Billing />
              </Layout>
            } 
          />
          
          <Route 
            path="/api-keys" 
            element={
              <Layout>
                <ApiKeys />
              </Layout>
            } 
          />
          
          <Route 
            path="/team" 
            element={
              <Layout>
                <Team />
              </Layout>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <Layout>
                <Settings />
              </Layout>
            } 
          />
          
          <Route 
            path="/help" 
            element={
              <Layout>
                <Help />
              </Layout>
            } 
          />

          {/* Product Routes */}
          <Route 
            path="/hospital" 
            element={
              <Layout>
                <HospitalManagement />
              </Layout>
            } 
          />

          <Route 
            path="/llm" 
            element={
              <Layout>
                <LLMPlatform />
              </Layout>
            } 
          />

          <Route 
            path="/iot" 
            element={
              <Layout>
                <IoTPlatform />
              </Layout>
            } 
          />

          <Route 
            path="/payment-gateway" 
            element={
              <Layout>
                <PaymentGateway />
              </Layout>
            } 
          />

          <Route 
            path="/smart-buildings" 
            element={
              <Layout>
                <SmartBuildings />
              </Layout>
            } 
          />

          <Route 
            path="/building-3d" 
            element={
              <Building3D />
            } 
          />

          <Route 
            path="/hospitality-hub" 
            element={
              <Layout>
                <HospitalityHub />
              </Layout>
            } 
          />

          <Route 
            path="/traveler-portal" 
            element={
              <Layout>
                <TravelerPortal />
              </Layout>
            } 
          />

          <Route 
            path="/business-dashboard" 
            element={
              <Layout>
                <BusinessDashboard />
              </Layout>
            } 
          />

          {/* Platform Landing */}
          <Route 
            path="/platform" 
            element={
              <Layout>
                <PlatformLanding />
              </Layout>
            } 
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/platform" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          expand={false}
          richColors
          closeButton
        />
      </div>
    </Router>
  )
}

export default App