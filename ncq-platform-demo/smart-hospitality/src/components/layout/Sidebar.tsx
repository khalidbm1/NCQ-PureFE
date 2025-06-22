'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Home, 
  Settings, 
  ConciergeBell, 
  User, 
  X,
  Hotel,
  LogOut,
  Globe
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  const { t, language, setLanguage } = useLanguage();

  const navigation = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: Home,
      description: 'Overview & quick actions'
    },
    { 
      id: 'room-control', 
      name: 'Room Control', 
      icon: Settings,
      description: 'Smart room features'
    },
    { 
      id: 'services', 
      name: 'Services', 
      icon: ConciergeBell,
      description: 'Hotel services & requests'
    },
    { 
      id: 'profile', 
      name: 'Profile', 
      icon: User,
      description: 'Guest preferences'
    }
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
          >
            <Hotel className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Smart Hospitality</h1>
            <p className="text-xs text-gray-500">Guest Portal</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-6">
        {navigation.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                onClose();
              }}
              className={`group relative flex w-full items-center rounded-xl p-4 text-left transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon 
                className={`h-6 w-6 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                }`} 
              />
              <div className="ml-4">
                <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {item.name}
                </div>
                <div className={`text-sm ${
                  isActive ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="absolute right-4">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Language Selector */}
      <div className="border-t border-gray-200 p-6">
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Globe className="h-4 w-4" />
            <span>Language</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setLanguage('en')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              language === 'en'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              language === 'ar'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            العربية
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <div className="border-t border-gray-200 p-6">
        <button
          onClick={() => window.location.href = '/auth/login'}
          className="flex w-full items-center rounded-lg p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col overflow-y-auto bg-white shadow-2xl">
                  <SidebarContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}