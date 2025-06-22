'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MonacoEditor from '@monaco-editor/react';
import { Tab } from '@headlessui/react';
import { APIEndpoint } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface RequestBuilderProps {
  endpoint: APIEndpoint;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function RequestBuilder({ endpoint, onSubmit, isLoading }: RequestBuilderProps) {
  const { token } = useAuth();
  const [requestBody, setRequestBody] = useState('{}');
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [pathParams, setPathParams] = useState<Record<string, string>>({});

  useEffect(() => {
    // Set default headers
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    setHeaders(defaultHeaders);
    
    // Extract path parameters
    const pathParamMatches = endpoint.path.match(/{([^}]+)}/g);
    if (pathParamMatches) {
      const params: Record<string, string> = {};
      pathParamMatches.forEach(match => {
        const paramName = match.slice(1, -1);
        params[paramName] = '';
      });
      setPathParams(params);
    }
    
    // Set default request body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      setRequestBody(JSON.stringify(endpoint.requestBody?.example || {}, null, 2));
    }
  }, [endpoint, token]);

  const handleSubmit = () => {
    let finalPath = endpoint.path;
    
    // Replace path parameters
    Object.entries(pathParams).forEach(([key, value]) => {
      finalPath = finalPath.replace(`{${key}}`, value);
    });
    
    // Build query string
    const queryString = new URLSearchParams(queryParams).toString();
    if (queryString) {
      finalPath += `?${queryString}`;
    }
    
    const requestData = {
      method: endpoint.method,
      path: finalPath,
      headers,
      body: ['POST', 'PUT', 'PATCH'].includes(endpoint.method) ? JSON.parse(requestBody) : undefined,
    };
    
    onSubmit(requestData);
  };

  return (
    <div className="space-y-6">
      {/* URL Preview */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <span className={`endpoint-badge ${endpoint.method.toLowerCase()}`}>
            {endpoint.method}
          </span>
          <code className="flex-1 text-sm font-mono text-gray-700 dark:text-gray-300">
            {endpoint.path}
          </code>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
          {Object.keys(pathParams).length > 0 && (
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected 
                ? 'bg-white dark:bg-gray-800 text-ncq-blue shadow' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
              }`
            }>
              Path Parameters
            </Tab>
          )}
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white dark:bg-gray-800 text-ncq-blue shadow' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
            }`
          }>
            Query Parameters
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
          {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected 
                ? 'bg-white dark:bg-gray-800 text-ncq-blue shadow' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
              }`
            }>
              Body
            </Tab>
          )}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {/* Path Parameters Panel */}
          {Object.keys(pathParams).length > 0 && (
            <Tab.Panel className="space-y-4">
              {Object.entries(pathParams).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {key} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => setPathParams({ ...pathParams, [key]: e.target.value })}
                    placeholder={`Enter ${key}`}
                    required
                  />
                </div>
              ))}
            </Tab.Panel>
          )}

          {/* Query Parameters Panel */}
          <Tab.Panel className="space-y-4">
            {endpoint.parameters?.filter(p => p.in === 'query').map(param => (
              <div key={param.name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {param.name} {param.required && <span className="text-red-500">*</span>}
                </label>
                <Input
                  type="text"
                  value={queryParams[param.name] || ''}
                  onChange={(e) => setQueryParams({ ...queryParams, [param.name]: e.target.value })}
                  placeholder={param.description}
                  required={param.required}
                />
                {param.schema?.enum && (
                  <p className="mt-1 text-xs text-gray-500">
                    Options: {param.schema.enum.join(', ')}
                  </p>
                )}
              </div>
            ))}
            
            {/* Add custom query parameter */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                className="text-sm text-ncq-blue hover:text-ncq-lightBlue"
                onClick={() => {
                  const key = prompt('Parameter name:');
                  if (key) {
                    setQueryParams({ ...queryParams, [key]: '' });
                  }
                }}
              >
                + Add Custom Parameter
              </button>
            </div>
          </Tab.Panel>

          {/* Headers Panel */}
          <Tab.Panel className="space-y-4">
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="flex space-x-2">
                <Input
                  type="text"
                  value={key}
                  placeholder="Header name"
                  className="flex-1"
                  readOnly={key === 'Authorization' || key === 'Content-Type'}
                />
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => setHeaders({ ...headers, [key]: e.target.value })}
                  placeholder="Header value"
                  className="flex-1"
                />
                {key !== 'Authorization' && key !== 'Content-Type' && (
                  <button
                    type="button"
                    onClick={() => {
                      const newHeaders = { ...headers };
                      delete newHeaders[key];
                      setHeaders(newHeaders);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              className="text-sm text-ncq-blue hover:text-ncq-lightBlue"
              onClick={() => {
                const key = prompt('Header name:');
                if (key) {
                  setHeaders({ ...headers, [key]: '' });
                }
              }}
            >
              + Add Header
            </button>
          </Tab.Panel>

          {/* Body Panel */}
          {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
            <Tab.Panel>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <MonacoEditor
                  height="300px"
                  language="json"
                  theme="vs-dark"
                  value={requestBody}
                  onChange={(value) => setRequestBody(value || '{}')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />
              </div>
            </Tab.Panel>
          )}
        </Tab.Panels>
      </Tab.Group>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6"
        >
          {isLoading ? 'Sending...' : 'Send Request'}
        </Button>
      </div>
    </div>
  );
}