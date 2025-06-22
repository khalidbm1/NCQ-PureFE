'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import MonacoEditor from '@monaco-editor/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { 
  ClipboardDocumentIcon, 
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { APIResponse } from '@/types/api';
import toast from 'react-hot-toast';

interface ResponseViewerProps {
  response: APIResponse | null;
  isLoading: boolean;
}

export function ResponseViewer({ response, isLoading }: ResponseViewerProps) {
  const [copied, setCopied] = useState(false);
  const [expandedHeaders, setExpandedHeaders] = useState(true);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  const statusColor = response.status >= 200 && response.status < 300 
    ? 'text-green-600' 
    : response.status >= 400 
    ? 'text-red-600' 
    : 'text-yellow-600';

  const handleCopy = () => {
    setCopied(true);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Status and Timing */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`text-lg font-semibold ${statusColor}`}>
            {response.status} {response.statusText}
          </span>
          <span className="text-sm text-gray-500">
            {response.duration}ms
          </span>
        </div>
        
        <CopyToClipboard 
          text={JSON.stringify(response.data, null, 2)}
          onCopy={handleCopy}
        >
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="h-4 w-4" />
                <span>Copy Response</span>
              </>
            )}
          </button>
        </CopyToClipboard>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white dark:bg-gray-800 text-ncq-blue shadow' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
            }`
          }>
            Body
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white dark:bg-gray-800 text-ncq-blue shadow' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
            }`
          }>
            Headers
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white dark:bg-gray-800 text-ncq-blue shadow' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
            }`
          }>
            Raw
          </Tab>
        </Tab.List>
        
        <Tab.Panels className="mt-4">
          {/* Body Panel */}
          <Tab.Panel>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <MonacoEditor
                height="400px"
                language="json"
                theme="vs-dark"
                value={JSON.stringify(response.data, null, 2)}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </Tab.Panel>

          {/* Headers Panel */}
          <Tab.Panel>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <button
                onClick={() => setExpandedHeaders(!expandedHeaders)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              >
                {expandedHeaders ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
                <span>Response Headers ({Object.keys(response.headers).length})</span>
              </button>
              
              {expandedHeaders && (
                <div className="space-y-2">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="font-mono text-sm text-gray-600 dark:text-gray-400 w-48">
                        {key}:
                      </span>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100 flex-1">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tab.Panel>

          {/* Raw Panel */}
          <Tab.Panel>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-100 font-mono">
                <code>
                  {`HTTP/1.1 ${response.status} ${response.statusText}\n`}
                  {Object.entries(response.headers).map(
                    ([key, value]) => `${key}: ${value}\n`
                  ).join('')}
                  {'\n'}
                  {JSON.stringify(response.data, null, 2)}
                </code>
              </pre>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}