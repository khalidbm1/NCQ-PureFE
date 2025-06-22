import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { useAuthStore } from './stores/auth'
import { ThemeProvider } from './hooks/use-theme'
import { useTranslation } from 'react-i18next'
import './i18n/config'

// Pages
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Users from './pages/Users'
import Tenants from './pages/Tenants'
import Payments from './pages/Payments'
import Notifications from './pages/Notifications'
import Files from './pages/Files'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuthStore()
  
  if (!isAuthenticated || !token) {
    return <Navigate to="/auth/login" replace />
  }
  
  return <>{children}</>
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

function App() {
  const { token } = useAuthStore()
  const { i18n } = useTranslation()

  // Initialize RTL support
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  // Set up auth token on app load
  useEffect(() => {
    if (token) {
      // Token is already set in auth service via zustand persistence
    }
  }, [token])

  return (
    <ThemeProvider defaultTheme="system" storageKey="ncq-admin-theme">
      <Router>
        <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/auth/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/tenants" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Tenants />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payments" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Payments />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Notifications />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/files" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Files />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings/*" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
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