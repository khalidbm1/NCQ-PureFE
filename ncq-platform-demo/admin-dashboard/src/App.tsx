import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { ThemeProvider } from './hooks/use-theme'
import { useTranslation } from 'react-i18next'
import './i18n/config'

// Pages
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Tenants from './pages/Tenants'
import Payments from './pages/Payments'
import Notifications from './pages/Notifications'
import Files from './pages/Files'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

function App() {
  const { i18n } = useTranslation()

  // Initialize RTL support
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <ThemeProvider defaultTheme="system" storageKey="ncq-admin-theme">
      <Router>
        <div className="App">
        <Routes>
          {/* All routes are now public */}
          <Route 
            path="/dashboard" 
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } 
          />
          
          <Route 
            path="/users" 
            element={
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            } 
          />
          
          <Route 
            path="/tenants" 
            element={
              <DashboardLayout>
                <Tenants />
              </DashboardLayout>
            } 
          />
          
          <Route 
            path="/payments" 
            element={
              <DashboardLayout>
                <Payments />
              </DashboardLayout>
            } 
          />
          
          <Route 
            path="/notifications" 
            element={
              <DashboardLayout>
                <Notifications />
              </DashboardLayout>
            } 
          />
          
          <Route 
            path="/files" 
            element={
              <DashboardLayout>
                <Files />
              </DashboardLayout>
            } 
          />
          
          <Route 
            path="/analytics" 
            element={
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
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
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App