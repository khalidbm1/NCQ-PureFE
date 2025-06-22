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

export function QuickStart() {
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
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Start
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
      
      <div className="relative">
        <pre className="overflow-x-auto p-6 text-sm">
          <code className={cn(
            'text-gray-800 dark:text-gray-200',
            selectedLanguage === 'javascript' && 'language-javascript',
            selectedLanguage === 'python' && 'language-python',
            selectedLanguage === 'php' && 'language-php',
            selectedLanguage === 'curl' && 'language-bash'
          )}>
            {codeExamples[selectedLanguage].code}
          </code>
        </pre>
      </div>
      
      <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help getting started? Check out our{' '}
            <a
              href="/docs/getting-started"
              className="font-medium text-ncq-blue hover:text-ncq-darkBlue dark:text-ncq-lightBlue"
            >
              complete guide
            </a>
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/docs">Documentation</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/api-explorer">Try API</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}