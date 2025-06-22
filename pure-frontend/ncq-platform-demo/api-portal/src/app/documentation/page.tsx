'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon, 
  CodeBracketIcon, 
  ShieldCheckIcon,
  CubeIcon,
  CloudArrowUpIcon,
  CreditCardIcon,
  BeakerIcon,
  CpuChipIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';

const documentationSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpenIcon,
    description: 'Quick start guide, authentication, and basic concepts',
    articles: [
      { id: 'introduction', title: 'Introduction to NCQ APIs' },
      { id: 'authentication', title: 'Authentication & Authorization' },
      { id: 'rate-limiting', title: 'Rate Limiting & Quotas' },
      { id: 'error-handling', title: 'Error Handling' },
      { id: 'pagination', title: 'Pagination & Filtering' },
    ]
  },
  {
    id: 'auth-service',
    title: 'Authentication Service',
    icon: ShieldCheckIcon,
    description: 'JWT tokens, OAuth2, MFA, and session management',
    articles: [
      { id: 'jwt-auth', title: 'JWT Authentication' },
      { id: 'oauth2', title: 'OAuth2 Integration' },
      { id: 'mfa', title: 'Multi-Factor Authentication' },
      { id: 'sso', title: 'Single Sign-On (SSO)' },
      { id: 'api-keys', title: 'API Key Management' },
    ]
  },
  {
    id: 'iot-platform',
    title: 'IoT Platform',
    icon: CloudArrowUpIcon,
    description: 'Device management, telemetry, and MQTT integration',
    articles: [
      { id: 'device-management', title: 'Device Management' },
      { id: 'telemetry', title: 'Telemetry & Data Ingestion' },
      { id: 'mqtt', title: 'MQTT Protocol' },
      { id: 'device-commands', title: 'Device Commands & Control' },
      { id: 'edge-computing', title: 'Edge Computing' },
    ]
  },
  {
    id: 'blockchain',
    title: 'Blockchain Service',
    icon: CubeIcon,
    description: 'Smart contracts, transactions, and Hyperledger Fabric',
    articles: [
      { id: 'fabric-basics', title: 'Hyperledger Fabric Basics' },
      { id: 'smart-contracts', title: 'Smart Contract Development' },
      { id: 'transactions', title: 'Transaction Management' },
      { id: 'channels', title: 'Channels & Privacy' },
      { id: 'consensus', title: 'Consensus Mechanisms' },
    ]
  },
  {
    id: 'payment-gateway',
    title: 'Payment Gateway',
    icon: CreditCardIcon,
    description: 'Payment processing, webhooks, and PCI compliance',
    articles: [
      { id: 'payment-methods', title: 'Supported Payment Methods' },
      { id: 'mada-integration', title: 'mada Card Integration' },
      { id: 'webhooks', title: 'Webhooks & Events' },
      { id: 'pci-compliance', title: 'PCI DSS Compliance' },
      { id: 'fraud-prevention', title: 'Fraud Prevention' },
    ]
  },
  {
    id: 'ai-platform',
    title: 'AI/ML Platform',
    icon: CpuChipIcon,
    description: 'Large language models, inference APIs, and model management',
    articles: [
      { id: 'llm-basics', title: 'LLM API Basics' },
      { id: 'model-selection', title: 'Model Selection Guide' },
      { id: 'fine-tuning', title: 'Fine-tuning Models' },
      { id: 'embeddings', title: 'Text Embeddings' },
      { id: 'streaming', title: 'Streaming Responses' },
    ]
  }
];

export default function DocumentationPage() {
  const searchParams = useSearchParams();
  const [selectedSection, setSelectedSection] = useState(
    searchParams.get('section') || 'getting-started'
  );
  const [selectedArticle, setSelectedArticle] = useState(
    searchParams.get('article') || 'introduction'
  );

  const currentSection = documentationSections.find(s => s.id === selectedSection);
  const currentArticle = currentSection?.articles.find(a => a.id === selectedArticle);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Documentation
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Comprehensive guides and references for NCQ platform APIs
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="col-span-3">
            <nav className="sticky top-4 space-y-1">
              {documentationSections.map((section) => {
                const Icon = section.icon;
                const isActive = section.id === selectedSection;
                
                return (
                  <div key={section.id} className="mb-4">
                    <button
                      onClick={() => {
                        setSelectedSection(section.id);
                        setSelectedArticle(section.articles[0].id);
                      }}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-ncq-blue text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {section.title}
                    </button>
                    
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-8 mt-2 space-y-1"
                      >
                        {section.articles.map((article) => (
                          <button
                            key={article.id}
                            onClick={() => setSelectedArticle(article.id)}
                            className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                              article.id === selectedArticle
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            {article.title}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="col-span-9">
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              {currentSection && currentArticle && (
                <>
                  <header className="mb-8">
                    <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Link href="/documentation" className="hover:text-gray-700 dark:hover:text-gray-300">
                        Documentation
                      </Link>
                      <span className="mx-2">/</span>
                      <span className="hover:text-gray-700 dark:hover:text-gray-300">
                        {currentSection.title}
                      </span>
                      <span className="mx-2">/</span>
                      <span className="text-gray-900 dark:text-white">
                        {currentArticle.title}
                      </span>
                    </nav>
                    
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {currentArticle.title}
                    </h1>
                  </header>

                  {/* Article Content (Mock) */}
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <MockArticleContent 
                      sectionId={selectedSection} 
                      articleId={selectedArticle} 
                    />
                  </div>

                  {/* Navigation Footer */}
                  <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <div>
                        {/* Previous article link */}
                      </div>
                      <div>
                        {/* Next article link */}
                      </div>
                    </div>
                  </footer>
                </>
              )}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}

// Mock article content component
function MockArticleContent({ sectionId, articleId }: { sectionId: string; articleId: string }) {
  // This would be replaced with actual content from MDX files or CMS
  
  if (sectionId === 'getting-started' && articleId === 'introduction') {
    return (
      <>
        <p className="lead">
          Welcome to the NCQ API documentation. This guide will help you get started with integrating 
          NCQ services into your applications.
        </p>
        
        <h2>Overview</h2>
        <p>
          The NCQ platform provides a comprehensive suite of APIs for building modern applications 
          with advanced features including IoT connectivity, blockchain integration, AI/ML capabilities, 
          and secure payment processing.
        </p>
        
        <h2>Base URL</h2>
        <p>All API requests should be made to:</p>
        <pre><code>https://api.ncq.sa/v1</code></pre>
        
        <h2>Authentication</h2>
        <p>
          Most endpoints require authentication. You can authenticate using JWT tokens or API keys. 
          See the <Link href="/documentation?section=auth-service&article=jwt-auth">Authentication Guide</Link> for details.
        </p>
        
        <h2>Request Format</h2>
        <p>All requests should include the following headers:</p>
        <pre><code>{`Content-Type: application/json
Accept: application/json
Authorization: Bearer YOUR_TOKEN`}</code></pre>
        
        <h2>Response Format</h2>
        <p>All responses follow a consistent format:</p>
        <pre><code>{`{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-20T10:30:00Z",
    "request_id": "req_abc123"
  }
}`}</code></pre>
      </>
    );
  }
  
  // Default content for other articles
  return (
    <>
      <p>
        This is placeholder content for the {articleId} article in the {sectionId} section. 
        In a real implementation, this would load the actual documentation content.
      </p>
      
      <h2>Example Code</h2>
      <pre><code>{`// Example API request
const response = await fetch('https://api.ncq.sa/v1/endpoint', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    // Request data
  })
});

const data = await response.json();`}</code></pre>
    </>
  );
}