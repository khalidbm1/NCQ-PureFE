'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Home, 
  Settings, 
  ConciergeBell, 
  User, 
  Bell, 
  Menu, 
  X,
  Wifi,
  WifiOff,
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isConnected: boolean;
}

export function Navigation({ currentView, onViewChange, isConnected }: NavigationProps) {
  const { t, language, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'room-control', label: t('nav.room_control'), icon: Settings },
    { id: 'services', label: t('nav.services'), icon: ConciergeBell },
    { id: 'profile', label: t('nav.profile'), icon: User },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold" style={{color: '#16a34a'}}>
                  Smart Hospitality
                </h1>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === item.id
                        ? 'text-green-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center">
                {isConnected ? (
                  <Wifi className="h-5 w-5" style={{color: '#16a34a'}} />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
              </div>

              {/* Language Selector */}
              <div className="flex space-x-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={language === 'en' ? {backgroundColor: '#16a34a'} : {}}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'ar'
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={language === 'ar' ? {backgroundColor: '#16a34a'} : {}}
                >
                  AR
                </button>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Sign Out */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                leftIcon={<LogOut className="h-4 w-4" />}
              >
                {t('nav.logout')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md shadow-sm border-b px-4 py-3 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-lg font-bold" style={{color: '#16a34a'}}>
            Smart Hospitality
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="space-y-2 mb-6">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onViewChange(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-colors ${
                          currentView === item.id
                            ? 'text-green-600 bg-primary-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* Additional Options */}
                <div className="border-t pt-6 space-y-4">
                  {/* Language Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.language')}
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setLanguage('en')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          language === 'en'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setLanguage('ar')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          language === 'ar'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        العربية
                      </button>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Connection Status
                    </span>
                    <div className="flex items-center">
                      {isConnected ? (
                        <>
                          <Wifi className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-green-600">Connected</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm text-red-600">Disconnected</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sign Out */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSignOut}
                    leftIcon={<LogOut className="h-4 w-4" />}
                  >
                    {t('nav.logout')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 transition-colors ${
                    currentView === item.id
                      ? 'text-green-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}