import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from './components/layout/Layout'
import { useAuthStore } from './stores/auth'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Main Pages
import Dashboard from './pages/Dashboard'

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

  // Set up auth token on app load
  useEffect(() => {
    if (token) {
      // Token is already set in auth service via zustand persistence
    }
  }, [token])

  return (
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
          
          <Route 
            path="/auth/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/files" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Files />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Upload />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/billing" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Billing />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/api-keys" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ApiKeys />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/team" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Team />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/help" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Help />
                </Layout>
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
  )
}

export default App