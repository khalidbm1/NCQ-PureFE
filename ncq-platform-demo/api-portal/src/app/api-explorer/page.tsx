'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ServiceSelector } from '@/components/api-explorer/ServiceSelector';
import { EndpointList } from '@/components/api-explorer/EndpointList';
import { RequestBuilder } from '@/components/api-explorer/RequestBuilder';
import { ResponseViewer } from '@/components/api-explorer/ResponseViewer';
import { EndpointDetails } from '@/components/api-explorer/EndpointDetails';
import { useAPIServices } from '@/hooks/useAPIServices';
import { APIEndpoint, APIResponse } from '@/types/api';

export default function APIExplorerPage() {
  const searchParams = useSearchParams();
  const { services, loading: servicesLoading } = useAPIServices();
  
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const service = searchParams.get('service');
    const endpoint = searchParams.get('endpoint');
    
    if (service) {
      setSelectedService(service);
    }
  }, [searchParams]);

  const handleEndpointSelect = (endpoint: APIEndpoint) => {
    setSelectedEndpoint(endpoint);
    setApiResponse(null);
  };

  const handleRequest = async (requestData: any) => {
    setIsLoading(true);
    try {
      // Simulate API request
      const response = await makeAPIRequest(selectedEndpoint!, requestData);
      setApiResponse(response);
    } catch (error) {
      setApiResponse({
        status: 500,
        statusText: 'Internal Server Error',
        data: { error: error.message },
        headers: {},
        duration: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Explorer
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Test and explore NCQ API endpoints interactively
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Service & Endpoint Selection */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <ServiceSelector
                services={services}
                selectedService={selectedService}
                onServiceChange={setSelectedService}
                loading={servicesLoading}
              />
              
              {selectedService && (
                <div className="mt-6">
                  <EndpointList
                    serviceId={selectedService}
                    selectedEndpoint={selectedEndpoint}
                    onEndpointSelect={handleEndpointSelect}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Request Builder & Response */}
          <div className="col-span-9">
            {selectedEndpoint ? (
              <div className="space-y-6">
                {/* Endpoint Details */}
                <EndpointDetails endpoint={selectedEndpoint} />

                {/* Request Builder */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Request
                  </h2>
                  <RequestBuilder
                    endpoint={selectedEndpoint}
                    onSubmit={handleRequest}
                    isLoading={isLoading}
                  />
                </div>

                {/* Response Viewer */}
                {(apiResponse || isLoading) && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Response
                    </h2>
                    <ResponseViewer
                      response={apiResponse}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  Select an endpoint to begin
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Choose a service and endpoint from the left sidebar to start testing
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock API request function
async function makeAPIRequest(endpoint: APIEndpoint, requestData: any): Promise<APIResponse> {
  const startTime = Date.now();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  const duration = Date.now() - startTime;
  
  // Mock response based on endpoint
  return {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': `req_${Math.random().toString(36).substr(2, 9)}`,
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': '99',
    },
    data: generateMockResponse(endpoint),
    duration,
  };
}

function generateMockResponse(endpoint: APIEndpoint): any {
  // Generate mock data based on endpoint
  switch (endpoint.method) {
    case 'GET':
      if (endpoint.path.includes('{id}')) {
        return {
          id: '123',
          name: 'Sample Resource',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return {
        data: [
          { id: '1', name: 'Resource 1' },
          { id: '2', name: 'Resource 2' },
        ],
        total: 2,
        page: 1,
        per_page: 10,
      };
    
    case 'POST':
      return {
        id: '456',
        message: 'Resource created successfully',
        created_at: new Date().toISOString(),
      };
    
    case 'PUT':
    case 'PATCH':
      return {
        id: '123',
        message: 'Resource updated successfully',
        updated_at: new Date().toISOString(),
      };
    
    case 'DELETE':
      return {
        message: 'Resource deleted successfully',
      };
    
    default:
      return { message: 'Success' };
  }
}