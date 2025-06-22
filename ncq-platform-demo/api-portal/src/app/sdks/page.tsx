'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  CodeBracketIcon, 
  DocumentArrowDownIcon,
  CommandLineIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';

const sdkLanguages = [
  {
    id: 'typescript',
    name: 'TypeScript/JavaScript',
    icon: '/icons/typescript.svg',
    packageManager: 'npm',
    installCommand: 'npm install @ncq/sdk',
    version: '2.1.0',
    features: [
      'Full TypeScript support',
      'Promise-based API',
      'Auto-retry with exponential backoff',
      'Request/Response interceptors',
      'WebSocket support'
    ],
    quickStart: `import { NCQClient } from '@ncq/sdk';

const client = new NCQClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Example: Authenticate user
const { user, token } = await client.auth.login({
  email: 'user@example.com',
  password: 'secure-password'
});

// Example: IoT device management
const devices = await client.iot.listDevices({
  status: 'active',
  limit: 10
});`
  },
  {
    id: 'python',
    name: 'Python',
    icon: '/icons/python.svg',
    packageManager: 'pip',
    installCommand: 'pip install ncq-sdk',
    version: '2.1.0',
    features: [
      'Async/await support',
      'Type hints',
      'Automatic pagination',
      'Built-in retry logic',
      'Comprehensive logging'
    ],
    quickStart: `from ncq import NCQClient

client = NCQClient(
    api_key='your-api-key',
    environment='production'
)

# Example: Authenticate user
user, token = client.auth.login(
    email='user@example.com',
    password='secure-password'
)

# Example: IoT device management
devices = client.iot.list_devices(
    status='active',
    limit=10
)`
  },
  {
    id: 'java',
    name: 'Java',
    icon: '/icons/java.svg',
    packageManager: 'Maven',
    installCommand: `<dependency>
  <groupId>sa.ncq</groupId>
  <artifactId>ncq-sdk</artifactId>
  <version>2.1.0</version>
</dependency>`,
    version: '2.1.0',
    features: [
      'Java 8+ compatible',
      'Reactive streams support',
      'Builder pattern APIs',
      'Comprehensive JavaDocs',
      'Spring Boot integration'
    ],
    quickStart: `import sa.ncq.sdk.NCQClient;
import sa.ncq.sdk.auth.LoginRequest;

NCQClient client = NCQClient.builder()
    .apiKey("your-api-key")
    .environment("production")
    .build();

// Example: Authenticate user
var authResponse = client.auth().login(
    LoginRequest.builder()
        .email("user@example.com")
        .password("secure-password")
        .build()
);

// Example: IoT device management
var devices = client.iot().listDevices()
    .status("active")
    .limit(10)
    .execute();`
  },
  {
    id: 'go',
    name: 'Go',
    icon: '/icons/go.svg',
    packageManager: 'go get',
    installCommand: 'go get github.com/ncq-sa/ncq-go-sdk',
    version: '2.1.0',
    features: [
      'Idiomatic Go code',
      'Context support',
      'Concurrent-safe',
      'Minimal dependencies',
      'Comprehensive error handling'
    ],
    quickStart: `package main

import (
    "context"
    "github.com/ncq-sa/ncq-go-sdk"
)

func main() {
    client := ncq.NewClient(
        ncq.WithAPIKey("your-api-key"),
        ncq.WithEnvironment("production"),
    )

    // Example: Authenticate user
    authResp, err := client.Auth.Login(context.Background(), &ncq.LoginRequest{
        Email:    "user@example.com",
        Password: "secure-password",
    })

    // Example: IoT device management
    devices, err := client.IoT.ListDevices(context.Background(), &ncq.ListDevicesParams{
        Status: "active",
        Limit:  10,
    })
}`
  },
  {
    id: 'csharp',
    name: 'C# / .NET',
    icon: '/icons/csharp.svg',
    packageManager: 'NuGet',
    installCommand: 'dotnet add package NCQ.SDK',
    version: '2.1.0',
    features: [
      '.NET Standard 2.0+',
      'Async/await pattern',
      'Strong typing',
      'Dependency injection ready',
      'Built-in resilience'
    ],
    quickStart: `using NCQ.SDK;

var client = new NCQClient(new NCQClientOptions
{
    ApiKey = "your-api-key",
    Environment = "production"
});

// Example: Authenticate user
var authResponse = await client.Auth.LoginAsync(new LoginRequest
{
    Email = "user@example.com",
    Password = "secure-password"
});

// Example: IoT device management
var devices = await client.IoT.ListDevicesAsync(new ListDevicesRequest
{
    Status = "active",
    Limit = 10
});`
  },
  {
    id: 'php',
    name: 'PHP',
    icon: '/icons/php.svg',
    packageManager: 'Composer',
    installCommand: 'composer require ncq/sdk',
    version: '2.1.0',
    features: [
      'PHP 7.4+ support',
      'PSR-7/PSR-18 compatible',
      'Laravel integration',
      'Comprehensive PHPDocs',
      'Easy error handling'
    ],
    quickStart: `<?php
use NCQ\\SDK\\NCQClient;

$client = new NCQClient([
    'apiKey' => 'your-api-key',
    'environment' => 'production'
]);

// Example: Authenticate user
$authResponse = $client->auth->login([
    'email' => 'user@example.com',
    'password' => 'secure-password'
]);

// Example: IoT device management
$devices = $client->iot->listDevices([
    'status' => 'active',
    'limit' => 10
]);`
  }
];

export default function SDKsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(sdkLanguages[0]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            NCQ SDKs & Libraries
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Official SDKs for seamless integration with NCQ APIs. Available in multiple languages 
            with comprehensive documentation and examples.
          </p>
        </div>

        {/* Language Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {sdkLanguages.map((lang) => (
            <motion.button
              key={lang.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedLanguage(lang)}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedLanguage.id === lang.id
                  ? 'border-ncq-blue bg-ncq-blue/5 dark:bg-ncq-blue/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 mb-3 flex items-center justify-center">
                  <CodeBracketIcon className="h-12 w-12 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {lang.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  v{lang.version}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selected SDK Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedLanguage.name} SDK
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Version {selectedLanguage.version}
                </p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-ncq-blue text-white rounded-lg hover:bg-ncq-lightBlue transition-colors">
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Download</span>
              </button>
            </div>

            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-700 p-1 mb-6">
                <Tab className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected 
                    ? 'bg-white dark:bg-gray-800 text-ncq-blue shadow' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
                  }`
                }>
                  Installation
                </Tab>
                <Tab className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected 
                    ? 'bg-white dark:bg-gray-800 text-ncq-blue shadow' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
                  }`
                }>
                  Quick Start
                </Tab>
                <Tab className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected 
                    ? 'bg-white dark:bg-gray-800 text-ncq-blue shadow' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
                  }`
                }>
                  Features
                </Tab>
                <Tab className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                  ${selected 
                    ? 'bg-white dark:bg-gray-800 text-ncq-blue shadow' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
                  }`
                }>
                  Documentation
                </Tab>
              </Tab.List>
              
              <Tab.Panels>
                {/* Installation Panel */}
                <Tab.Panel>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Install via {selectedLanguage.packageManager}
                    </h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className="text-sm text-gray-100 font-mono overflow-x-auto">
                        <code>{selectedLanguage.installCommand}</code>
                      </pre>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Requirements
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                        <li>API key from NCQ dashboard</li>
                        <li>Network access to api.ncq.sa</li>
                        <li>TLS 1.2 or higher</li>
                      </ul>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Quick Start Panel */}
                <Tab.Panel>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Quick Start Example
                    </h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-100 font-mono">
                        <code>{selectedLanguage.quickStart}</code>
                      </pre>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Features Panel */}
                <Tab.Panel>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      SDK Features
                    </h3>
                    <ul className="space-y-3">
                      {selectedLanguage.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tab.Panel>

                {/* Documentation Panel */}
                <Tab.Panel>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Resources
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <a
                          href={`/docs/sdk/${selectedLanguage.id}`}
                          className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <DocumentArrowDownIcon className="h-6 w-6 text-ncq-blue mr-3" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              API Reference
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Complete SDK documentation
                            </p>
                          </div>
                        </a>
                        
                        <a
                          href={`https://github.com/ncq-sa/ncq-${selectedLanguage.id}-sdk`}
                          className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <CodeBracketIcon className="h-6 w-6 text-ncq-blue mr-3" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              GitHub Repository
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Source code and examples
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <CommandLineIcon className="h-8 w-8 text-ncq-blue mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              CLI Tool
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Command-line interface for testing and automation
            </p>
            <a href="/tools/cli" className="text-ncq-blue hover:text-ncq-lightBlue font-medium">
              Download CLI →
            </a>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <CodeBracketIcon className="h-8 w-8 text-ncq-blue mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Code Examples
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Sample applications and integration patterns
            </p>
            <a href="/examples" className="text-ncq-blue hover:text-ncq-lightBlue font-medium">
              View Examples →
            </a>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <DocumentArrowDownIcon className="h-8 w-8 text-ncq-blue mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              OpenAPI Specs
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Download OpenAPI specifications for code generation
            </p>
            <a href="/specs" className="text-ncq-blue hover:text-ncq-lightBlue font-medium">
              Get Specs →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}