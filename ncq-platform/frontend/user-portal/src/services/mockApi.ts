import { api } from './api'
import { env } from '../config/env'
import { createMockUser } from '../lib/mockData'

// Mock responses for pure frontend mode
const mockResponses: Record<string, any> = {
  '/auth/api/v1/auth/me': {
    user: createMockUser()
  },
  '/auth/api/v1/users/profile': createMockUser(),
  '/files/api/v1/files': {
    files: [],
    total: 0,
    page: 1,
    perPage: 20,
  },
  '/notifications/api/v1/notifications': {
    notifications: [],
    total: 0,
    unreadCount: 0,
  },
  '/auth/api/v1/api-keys': {
    apiKeys: [],
  },
  '/payments/api/v1/payment-methods': {
    paymentMethods: [],
  },
  '/payments/api/v1/transactions': {
    transactions: [],
    total: 0,
  },
}

// Setup mock interceptor for pure frontend mode
export function setupMockApi() {
  if (!env.PURE_FRONTEND) return

  // Override the request interceptor to return mock data
  api.interceptors.request.use(
    (config) => {
      // Find matching mock response
      const mockPath = Object.keys(mockResponses).find(path => 
        config.url?.includes(path)
      )

      if (mockPath) {
        // Return mock response
        return Promise.reject({
          config,
          response: {
            status: 200,
            data: mockResponses[mockPath],
            headers: {},
            statusText: 'OK',
            config,
          },
          isAxiosError: true,
          mockResponse: true,
        })
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  // Handle mock responses in response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.mockResponse) {
        return Promise.resolve(error.response)
      }
      
      // For unmocked endpoints in pure frontend mode, return empty success
      if (env.PURE_FRONTEND && error.code === 'ERR_NETWORK') {
        return Promise.resolve({
          status: 200,
          data: {},
          headers: {},
          statusText: 'OK',
          config: error.config,
        })
      }

      return Promise.reject(error)
    }
  )
}