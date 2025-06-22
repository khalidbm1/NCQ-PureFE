'use client';

import { useState } from 'react';
import { LanguageProvider } from '@/hooks/useLanguage';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardView } from '@/components/views/DashboardView';
import { RoomControlView } from '@/components/views/RoomControlView';
import { ServicesView } from '@/components/views/ServicesView';
import { ProfileView } from '@/components/views/ProfileView';

export default function HomePage() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'room-control':
        return <RoomControlView />;
      case 'services':
        return <ServicesView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Sidebar */}
        <Sidebar 
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        {/* Main Content */}
        <div className="lg:pl-72">
          {/* Header */}
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            currentView={currentView}
          />
          
          {/* Page Content */}
          <main className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              {renderView()}
            </div>
          </main>
        </div>
        
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </LanguageProvider>
  );
}