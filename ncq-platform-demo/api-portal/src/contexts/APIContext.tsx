'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { APIService, APIEndpoint, APIResponse } from '@/types/api';

interface APIContextType {
  services: APIService[];
  selectedService: APIService | null;
  selectedEndpoint: APIEndpoint | null;
  isLoading: boolean;
  error: string | null;
  setSelectedService: (service: APIService | null) => void;
  setSelectedEndpoint: (endpoint: APIEndpoint | null) => void;
  makeRequest: (endpoint: APIEndpoint, requestData: any) => Promise<APIResponse>;
  refreshServices: () => Promise<void>;
}

const APIContext = createContext<APIContextType | undefined>(undefined);

// Mock API services data
const mockServices: APIService[] = [
  {
    id: 'auth',
    name: 'Authentication Service',
    description: 'JWT authentication, OAuth2, and multi-factor authentication',
    version: 'v1',
    baseUrl: 'https://api.ncq.sa/auth/v1',
    status: 'stable',
    endpoints: [
      {
        id: 'auth-login',
        path: '/login',
        method: 'POST',
        summary: 'User login',
        description: 'Authenticate user with email and password',
        operationId: 'loginUser',
        tags: ['authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  rememberMe: { type: 'boolean', default: false }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    refreshToken: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Invalid credentials'
          }
        }
      },
      {
        id: 'auth-refresh',
        path: '/refresh',
        method: 'POST',
        summary: 'Refresh token',
        description: 'Refresh access token using refresh token',
        operationId: 'refreshToken',
        tags: ['authentication'],
        responses: {
          '200': {
            description: 'Token refreshed successfully'
          }
        }
      }
    ]
  },
  {
    id: 'payment',
    name: 'Payment Gateway',
    description: 'Comprehensive payment processing with multi-currency support',
    version: 'v1',
    baseUrl: 'https://api.ncq.sa/payment/v1',
    status: 'stable',
    endpoints: [
      {
        id: 'payment-create',
        path: '/payments',
        method: 'POST',
        summary: 'Create payment',
        description: 'Create a new payment transaction',
        operationId: 'createPayment',
        tags: ['payments'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'number', minimum: 0.01 },
                  currency: { type: 'string', enum: ['SAR', 'USD', 'EUR'] },
                  customerId: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['amount', 'currency', 'customerId']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Payment created successfully'
          }
        }
      },
      {
        id: 'payment-get',
        path: '/payments/{id}',
        method: 'GET',
        summary: 'Get payment',
        description: 'Retrieve payment details by ID',
        operationId: 'getPayment',
        tags: ['payments'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Payment ID'
          }
        ],
        responses: {
          '200': {
            description: 'Payment details retrieved successfully'
          }
        }
      }
    ]
  },
  {
    id: 'iot',
    name: 'IoT Platform',
    description: 'Device management and real-time data streaming',
    version: 'v1',
    baseUrl: 'https://api.ncq.sa/iot/v1',
    status: 'stable',
    endpoints: [
      {
        id: 'iot-devices',
        path: '/devices',
        method: 'GET',
        summary: 'List devices',
        description: 'Get list of all IoT devices',
        operationId: 'listDevices',
        tags: ['devices'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            description: 'Number of devices to return'
          },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['online', 'offline', 'maintenance'] },
            description: 'Filter by device status'
          }
        ],
        responses: {
          '200': {
            description: 'List of devices retrieved successfully'
          }
        }
      }
    ]
  },
  {
    id: 'hospital',
    name: 'Hospital Management',
    description: 'Patient management, appointments, and medical records',
    version: 'v1',
    baseUrl: 'https://api.ncq.sa/hospital/v1',
    status: 'stable',
    endpoints: [
      {
        id: 'hospital-patients',
        path: '/patients',
        method: 'GET',
        summary: 'List patients',
        description: 'Get list of all patients',
        operationId: 'listPatients',
        tags: ['patients'],
        responses: {
          '200': {
            description: 'List of patients retrieved successfully'
          }
        }
      }
    ]
  },
  {
    id: 'blockchain',
    name: 'Blockchain Network',
    description: 'Smart contracts and blockchain transactions',
    version: 'v1',
    baseUrl: 'https://api.ncq.sa/blockchain/v1',
    status: 'beta',
    endpoints: [
      {
        id: 'blockchain-contracts',
        path: '/contracts',
        method: 'GET',
        summary: 'List smart contracts',
        description: 'Get list of deployed smart contracts',
        operationId: 'listContracts',
        tags: ['contracts'],
        responses: {
          '200': {
            description: 'List of contracts retrieved successfully'
          }
        }
      }
    ]
  },
  {
    id: 'hospitality',
    name: 'Smart Hospitality',
    description: 'Hotel management and guest services automation',
    version: 'v1',
    baseUrl: 'https://api.ncq.sa/hospitality/v1',
    status: 'stable',
    endpoints: [
      {
        id: 'hospitality-bookings',
        path: '/bookings',
        method: 'GET',
        summary: 'List bookings',
        description: 'Get list of hotel bookings',
        operationId: 'listBookings',
        tags: ['bookings'],
        responses: {
          '200': {
            description: 'List of bookings retrieved successfully'
          }
        }
      }
    ]
  }
];

export function APIProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<APIService[]>([]);
  const [selectedService, setSelectedService] = useState<APIService | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, this would fetch from your API
      setServices(mockServices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  const makeRequest = async (endpoint: APIEndpoint, requestData: any): Promise<APIResponse> => {
    const startTime = Date.now();
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const duration = Date.now() - startTime;
    
    // Generate mock response based on endpoint
    const mockResponse = generateMockResponse(endpoint, requestData);
    
    return {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': `req_${Math.random().toString(36).substr(2, 9)}`,
        'X-Response-Time': `${duration}ms`
      },
      data: mockResponse,
      duration
    };
  };

  const generateMockResponse = (endpoint: APIEndpoint, requestData: any) => {
    switch (endpoint.id) {
      case 'auth-login':
        return {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'rt_' + Math.random().toString(36).substr(2, 20),
          user: {
            id: 'user_123',
            email: requestData.email || 'user@example.com',
            name: 'John Doe',
            role: 'user'
          }
        };
      case 'payment-create':
        return {
          id: 'pay_' + Math.random().toString(36).substr(2, 10),
          amount: requestData.amount,
          currency: requestData.currency,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
      case 'iot-devices':
        return {
          devices: Array.from({ length: 10 }, (_, i) => ({
            id: `device_${i + 1}`,
            name: `IoT Device ${i + 1}`,
            status: ['online', 'offline', 'maintenance'][Math.floor(Math.random() * 3)],
            type: ['sensor', 'actuator', 'gateway'][Math.floor(Math.random() * 3)],
            lastSeen: new Date(Date.now() - Math.random() * 86400000).toISOString()
          })),
          pagination: {
            total: 25,
            page: 1,
            limit: 10,
            hasMore: true
          }
        };
      default:
        return {
          message: 'Mock response for ' + endpoint.summary,
          timestamp: new Date().toISOString(),
          data: {}
        };
    }
  };

  useEffect(() => {
    refreshServices();
  }, []);

  return (
    <APIContext.Provider
      value={{
        services,
        selectedService,
        selectedEndpoint,
        isLoading,
        error,
        setSelectedService,
        setSelectedEndpoint,
        makeRequest,
        refreshServices,
      }}
    >
      {children}
    </APIContext.Provider>
  );
}

export function useAPI() {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error('useAPI must be used within an APIProvider');
  }
  return context;
}