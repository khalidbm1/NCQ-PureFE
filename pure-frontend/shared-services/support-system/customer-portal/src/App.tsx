import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import TicketList from './pages/Tickets/TicketList';
import TicketDetail from './pages/Tickets/TicketDetail';
import TicketCreate from './pages/Tickets/TicketCreate';
import KnowledgeBase from './pages/KnowledgeBase/KnowledgeBase';
import ArticleDetail from './pages/KnowledgeBase/ArticleDetail';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Support from './pages/Support/Support';
import Satisfaction from './pages/Satisfaction/Satisfaction';

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
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  
                  {/* Public knowledge base */}
                  <Route path="/kb" element={<KnowledgeBase />} />
                  <Route path="/kb/:id" element={<ArticleDetail />} />
                  
                  {/* Satisfaction survey (public with ticket access) */}
                  <Route path="/satisfaction/:ticketId" element={<Satisfaction />} />
                  
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
                            
                            {/* Knowledge Base (authenticated view) */}
                            <Route path="/knowledge-base" element={<KnowledgeBase />} />
                            <Route path="/knowledge-base/:id" element={<ArticleDetail />} />
                            
                            {/* Support & Help */}
                            <Route path="/support" element={<Support />} />
                            
                            {/* Profile & Settings */}
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            
                            {/* 404 */}
                            <Route path="*" element={
                              <div className="p-8 text-center">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">
                                  The page you're looking for doesn't exist.
                                </p>
                                <button 
                                  onClick={() => window.history.back()}
                                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                  Go Back
                                </button>
                              </div>
                            } />
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
    </QueryClientProvider>
  );
}

export default App;