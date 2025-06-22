'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  BeakerIcon, 
  CubeIcon, 
  ChartBarIcon,
  MagnifyingGlassIcon,
  CodeBracketIcon,
  CloudArrowUpIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { SearchBar } from '@/components/search/SearchBar';
import { ServiceCard } from '@/components/home/ServiceCard';
import { QuickStartGuide } from '@/components/home/QuickStartGuide';

const services = [
  {
    id: 'auth',
    name: 'Authentication Service',
    description: 'JWT authentication, OAuth2, and multi-factor authentication',
    icon: LockClosedIcon,
    color: 'bg-blue-500',
    endpoints: 42,
    version: 'v1',
    status: 'stable',
  },
  {
    id: 'identity',
    name: 'Identity Service',
    description: 'User and tenant management with role-based access control',
    icon: CubeIcon,
    color: 'bg-purple-500',
    endpoints: 38,
    version: 'v1',
    status: 'stable',
  },
  {
    id: 'iot',
    name: 'IoT Platform',
    description: 'Device management, telemetry, and real-time monitoring',
    icon: CloudArrowUpIcon,
    color: 'bg-green-500',
    endpoints: 56,
    version: 'v2',
    status: 'stable',
  },
  {
    id: 'blockchain',
    name: 'Blockchain Service',
    description: 'Smart contracts, transactions, and distributed ledger',
    icon: CubeIcon,
    color: 'bg-indigo-500',
    endpoints: 28,
    version: 'v1',
    status: 'beta',
  },
  {
    id: 'payment',
    name: 'Payment Gateway',
    description: 'Payment processing, webhooks, and merchant management',
    icon: ChartBarIcon,
    color: 'bg-yellow-500',
    endpoints: 64,
    version: 'v3',
    status: 'stable',
  },
  {
    id: 'ai',
    name: 'AI/ML Platform',
    description: 'Large language models, inference, and model management',
    icon: BeakerIcon,
    color: 'bg-red-500',
    endpoints: 34,
    version: 'v1',
    status: 'stable',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ncq-blue to-ncq-lightBlue opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              NCQ API Documentation Portal
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
              Explore our comprehensive API documentation, test endpoints interactively, 
              and integrate NCQ services into your applications with ease.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="/getting-started" className="group">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <DocumentTextIcon className="h-10 w-10 text-ncq-blue mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Getting Started
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Quick start guide and authentication setup
                </p>
              </div>
            </Link>

            <Link href="/api-explorer" className="group">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <BeakerIcon className="h-10 w-10 text-ncq-green mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  API Explorer
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Test API endpoints interactively
                </p>
              </div>
            </Link>

            <Link href="/sdks" className="group">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <CodeBracketIcon className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  SDKs & Libraries
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Download SDKs for your platform
                </p>
              </div>
            </Link>

            <Link href="/changelog" className="group">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <ChartBarIcon className="h-10 w-10 text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Changelog
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Latest updates and version history
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Available Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickStartGuide />
        </div>
      </section>
    </div>
  );
}