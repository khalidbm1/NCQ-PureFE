'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { cn } from '@/utils/cn';
import {
  ClipboardDocumentIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const codeExamples = {
  curl: {
    name: 'cURL',
    code: `# Get your API key from the dashboard
curl -X POST "https://api.ncq.sa/auth/v1/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'

# Use the token for authenticated requests
curl -X GET "https://api.ncq.sa/payment/v1/payments" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
  },
  javascript: {
    name: 'JavaScript',
    code: `// Install the NCQ SDK
npm install @ncq/sdk

// Initialize the client
import { NCQClient } from '@ncq/sdk';

const client = new NCQClient({
  apiKey: 'your-api-key',
  environment: 'production' // or 'sandbox'
});

// Authenticate
const auth = await client.auth.login({
  email: 'your-email@example.com',
  password: 'your-password'
});

// Make API calls
const payments = await client.payments.list();
console.log(payments);`,
  },
  python: {
    name: 'Python',
    code: `# Install the NCQ SDK
pip install ncq-sdk

# Initialize the client
from ncq_sdk import NCQClient

client = NCQClient(
    api_key='your-api-key',
    environment='production'  # or 'sandbox'
)

# Authenticate
auth_response = client.auth.login(
    email='your-email@example.com',
    password='your-password'
)

# Make API calls
payments = client.payments.list()
print(payments)`,
  },
  php: {
    name: 'PHP',
    code: `<?php
// Install via Composer
// composer require ncq/sdk

require_once 'vendor/autoload.php';
use NCQ\\SDK\\NCQClient;

// Initialize the client
$client = new NCQClient([
    'api_key' => 'your-api-key',
    'environment' => 'production' // or 'sandbox'
]);

// Authenticate
$auth = $client->auth->login([
    'email' => 'your-email@example.com',
    'password' => 'your-password'
]);

// Make API calls
$payments = $client->payments->list();
var_dump($payments);
?>`,
  },
};

export function QuickStartGuide() {
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof codeExamples>('curl');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExamples[selectedLanguage].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const languageOptions = Object.entries(codeExamples).map(([key, value]) => ({
    value: key,
    label: value.name,
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Start Guide
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Get up and running with NCQ APIs in minutes
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Choose Your Language
            </h3>
            <div className="flex items-center gap-3">
              <Select
                options={languageOptions}
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as keyof typeof codeExamples)}
                className="w-32"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="relative bg-gray-900 dark:bg-gray-950">
          <pre className="overflow-x-auto p-6 text-sm text-gray-100">
            <code>
              {codeExamples[selectedLanguage].code}
            </code>
          </pre>
        </div>
        
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Need more detailed instructions?{' '}
              <a
                href="/docs/getting-started"
                className="font-medium text-ncq-blue hover:text-ncq-darkBlue dark:text-ncq-lightBlue"
              >
                View complete documentation
              </a>
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/docs">Full Docs</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/api-explorer">Try Live API</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 mx-auto mb-4 bg-ncq-blue rounded-lg flex items-center justify-center">
            <ClipboardDocumentIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            API Reference
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Complete reference for all endpoints, parameters, and responses
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="/docs">Browse Docs</a>
          </Button>
        </div>

        <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-lg flex items-center justify-center">
            <CheckIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Interactive Testing
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Test API endpoints directly from your browser
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="/api-explorer">Try APIs</a>
          </Button>
        </div>

        <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            SDKs & Libraries
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Pre-built libraries for popular programming languages
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="/sdks">Download SDKs</a>
          </Button>
        </div>
      </div>
    </div>
  );
}