import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import TicketList from './pages/Tickets/TicketList';
import TicketDetail from './pages/Tickets/TicketDetail';
import TicketCreate from './pages/Tickets/TicketCreate';
import CustomerList from './pages/Customers/CustomerList';
import CustomerDetail from './pages/Customers/CustomerDetail';
import KnowledgeBase from './pages/KnowledgeBase/KnowledgeBase';
import ArticleDetail from './pages/KnowledgeBase/ArticleDetail';
import CannedResponses from './pages/CannedResponses/CannedResponses';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';
import TeamManagement from './pages/Team/TeamManagement';
import Analytics from './pages/Analytics/Analytics';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected routes */}
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Routes>
                            {/* Dashboard */}
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            
                            {/* Tickets */}
                            <Route path="/tickets" element={<TicketList />} />
                            <Route path="/tickets/new" element={<TicketCreate />} />
                            <Route path="/tickets/:id" element={<TicketDetail />} />
                            
                            {/* Customers */}
                            <Route path="/customers" element={<CustomerList />} />
                            <Route path="/customers/:id" element={<CustomerDetail />} />
                            
                            {/* Knowledge Base */}
                            <Route path="/knowledge-base" element={<KnowledgeBase />} />
                            <Route path="/knowledge-base/:id" element={<ArticleDetail />} />
                            
                            {/* Canned Responses */}
                            <Route path="/canned-responses" element={<CannedResponses />} />
                            
                            {/* Reports & Analytics */}
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/analytics" element={<Analytics />} />
                            
                            {/* Team Management */}
                            <Route path="/team" element={<TeamManagement />} />
                            
                            {/* Settings & Profile */}
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/profile" element={<Profile />} />
                            
                            {/* 404 */}
                            <Route path="*" element={<div className="p-8 text-center">
                              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
                              <p className="text-gray-600 dark:text-gray-300">The page you're looking for doesn't exist.</p>
                            </div>} />
                          </Routes>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                
                {/* Global toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--toast-bg)',
                      color: 'var(--toast-color)',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#ffffff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
      
      {/* React Query Devtools */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;