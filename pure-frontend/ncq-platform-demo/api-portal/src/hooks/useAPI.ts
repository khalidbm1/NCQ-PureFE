'use client';

import { useState, useCallback } from 'react';
import { APIEndpoint, APIResponse, APIError } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

interface UseAPIOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

interface APIRequestState {
  data: any;
  error: APIError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export function useAPIRequest(options: UseAPIOptions = {}) {
  const [state, setState] = useState<APIRequestState>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const { token } = useAuth();

  const makeRequest = useCallback(async (
    endpoint: APIEndpoint,
    requestData?: any,
    customOptions?: RequestInit
  ): Promise<APIResponse> => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isSuccess: false,
      isError: false,
    }));

    try {
      const baseURL = options.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.ncq.sa';
      const url = `${baseURL}${endpoint.path}`;

      // Replace path parameters
      let finalUrl = url;
      if (endpoint.parameters) {
        endpoint.parameters.forEach(param => {
          if (param.in === 'path' && requestData?.[param.name]) {
            finalUrl = finalUrl.replace(`{${param.name}}`, requestData[param.name]);
          }
        });
      }

      // Add query parameters
      const queryParams = new URLSearchParams();
      if (endpoint.parameters) {
        endpoint.parameters.forEach(param => {
          if (param.in === 'query' && requestData?.[param.name] !== undefined) {
            queryParams.append(param.name, requestData[param.name]);
          }
        });
      }
      if (queryParams.toString()) {
        finalUrl += `?${queryParams.toString()}`;
      }

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add authentication if available
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Add custom headers from request data
      if (endpoint.parameters) {
        endpoint.parameters.forEach(param => {
          if (param.in === 'header' && requestData?.[param.name]) {
            headers[param.name] = requestData[param.name];
          }
        });
      }

      // Prepare request body
      let body: string | undefined;
      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestData) {
        // Filter out path and query parameters from body
        const bodyData = { ...requestData };
        if (endpoint.parameters) {
          endpoint.parameters.forEach(param => {
            if (param.in === 'path' || param.in === 'query' || param.in === 'header') {
              delete bodyData[param.name];
            }
          });
        }
        body = JSON.stringify(bodyData);
      }

      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);

      const response = await fetch(finalUrl, {
        method: endpoint.method,
        headers,
        body,
        signal: controller.signal,
        ...customOptions,
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      let responseData: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      const apiResponse: APIResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        duration,
      };

      if (!response.ok) {
        const error: APIError = {
          code: responseData?.code || `HTTP_${response.status}`,
          message: responseData?.message || response.statusText,
          details: responseData?.details,
          timestamp: new Date().toISOString(),
          path: finalUrl,
        };

        setState({
          data: null,
          error,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });

        throw error;
      }

      setState({
        data: responseData,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });

      return apiResponse;
    } catch (error) {
      const apiError: APIError = {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
        path: endpoint.path,
      };

      setState({
        data: null,
        error: apiError,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });

      throw apiError;
    }
  }, [token, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return {
    ...state,
    makeRequest,
    reset,
  };
}

// Hook for making multiple concurrent requests
export function useBatchAPIRequest(options: UseAPIOptions = {}) {
  const [requests, setRequests] = useState<Map<string, APIRequestState>>(new Map());
  const { token } = useAuth();

  const makeRequests = useCallback(async (
    endpointRequests: Array<{ endpoint: APIEndpoint; data?: any; id: string }>
  ) => {
    // Initialize all requests as loading
    const newRequests = new Map(requests);
    endpointRequests.forEach(({ id }) => {
      newRequests.set(id, {
        data: null,
        error: null,
        isLoading: true,
        isSuccess: false,
        isError: false,
      });
    });
    setRequests(newRequests);

    // Execute all requests concurrently
    const promises = endpointRequests.map(async ({ endpoint, data, id }) => {
      try {
        const apiRequest = useAPIRequest(options);
        const response = await apiRequest.makeRequest(endpoint, data);
        
        setRequests(prev => new Map(prev.set(id, {
          data: response.data,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        })));

        return { id, response };
      } catch (error) {
        const apiError = error as APIError;
        
        setRequests(prev => new Map(prev.set(id, {
          data: null,
          error: apiError,
          isLoading: false,
          isSuccess: false,
          isError: true,
        })));

        return { id, error: apiError };
      }
    });

    return Promise.allSettled(promises);
  }, [options, token, requests]);

  const getRequestState = useCallback((id: string): APIRequestState => {
    return requests.get(id) || {
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    };
  }, [requests]);

  const reset = useCallback(() => {
    setRequests(new Map());
  }, []);

  return {
    makeRequests,
    getRequestState,
    reset,
    allRequests: requests,
  };
}