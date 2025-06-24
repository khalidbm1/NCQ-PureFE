import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from './components/layout/Layout'
import { useAuthStore } from './stores/auth'
import { CredentialsPanel } from './components/CredentialsPanel'
import { UserJourney } from './components/UserJourney'

// Main Pages
import Dashboard from './pages/Dashboard'
import Files from './pages/Files'
import Upload from './pages/Upload'
import Analytics from './pages/Analytics'

// Product Pages
import HospitalManagement from './pages/products/HospitalManagement'
import LLMPlatform from './pages/products/LLMPlatform'
import SmartBuildings from './pages/products/SmartBuildings'
import IoTPlatform from './pages/products/IoTPlatform'
import PaymentGateway from './pages/products/PaymentGateway'
import HospitalityHub from './pages/products/HospitalityHub'

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
  const { login } = useAuthStore()

  // Initialize dark mode and auto-login
  useEffect(() => {
    // Set theme
    const theme = localStorage.getItem('theme')
    const isDark = theme === 'dark' || 
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Auto-login with mock credentials
    login({ email: 'user@ncq.sa', password: 'user123' })
  }, [login])

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
            path="/smart-buildings" 
            element={
              <Layout>
                <SmartBuildings />
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
            path="/hospitality" 
            element={
              <Layout>
                <HospitalityHub />
              </Layout>
            } 
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
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

        {/* Credentials Panel */}
        <CredentialsPanel />

        {/* User Journey Guide */}
        <UserJourney />
      </div>
    </Router>
  )
}

export default App