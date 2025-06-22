import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
const API_TIMEOUT = 30000 // 30 seconds

// Types
export interface ApiError {
  message: string
  code: string
  details?: any
  timestamp: string
}

export interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  empty: boolean
}

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('ncq_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
    
    // Add request ID for tracking
    config.headers = {
      ...config.headers,
      'X-Request-ID': generateRequestId(),
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      })
    }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
    }
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('ncq_refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })
          
          const newToken = response.data.token
          localStorage.setItem('ncq_token', newToken)
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('ncq_token')
        localStorage.removeItem('ncq_refresh_token')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }
    
    // Handle specific error statuses
    switch (error.response?.status) {
      case 400:
        toast.error('Invalid request. Please check your input.')
        break
      case 403:
        toast.error('Access denied. You do not have permission to perform this action.')
        break
      case 404:
        toast.error('Resource not found.')
        break
      case 429:
        toast.error('Too many requests. Please try again later.')
        break
      case 500:
        toast.error('Server error. Please try again later.')
        break
      case 503:
        toast.error('Service unavailable. Please try again later.')
        break
      default:
        if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
          toast.error('Network error. Please check your connection.')
        } else if (error.code === 'ECONNABORTED') {
          toast.error('Request timeout. Please try again.')
        }
    }
    
    return Promise.reject(error)
  }
)

// Helper functions
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// API wrapper with typed responses
export class ApiClient {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(url, config)
    return response.data
  }
  
  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<T>(url, data, config)
    return response.data
  }
  
  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<T>(url, data, config)
    return response.data
  }
  
  static async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.patch<T>(url, data, config)
    return response.data
  }
  
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config)
    return response.data
  }
}

// Payment Gateway specific API helpers
export const paymentApi = {
  // Process payment
  processPayment: (data: any) => 
    ApiClient.post('/payments/process', data),
  
  // Get transaction
  getTransaction: (id: string) => 
    ApiClient.get(`/payments/transactions/${id}`),
  
  // Get transactions with pagination
  getTransactions: (params: any) => 
    ApiClient.get<PaginatedResponse<any>>('/payments/transactions', { params }),
  
  // Refund transaction
  refundTransaction: (id: string, data: any) => 
    ApiClient.post(`/payments/transactions/${id}/refund`, data),
  
  // Get payment methods
  getPaymentMethods: () => 
    ApiClient.get('/payments/methods'),
}

export const merchantApi = {
  // Get merchant profile
  getProfile: () => 
    ApiClient.get('/merchants/profile'),
  
  // Update merchant profile
  updateProfile: (data: any) => 
    ApiClient.put('/merchants/profile', data),
  
  // Get API keys
  getApiKeys: () => 
    ApiClient.get('/merchants/api-keys'),
  
  // Generate new API key
  generateApiKey: (data: any) => 
    ApiClient.post('/merchants/api-keys', data),
  
  // Revoke API key
  revokeApiKey: (keyId: string) => 
    ApiClient.delete(`/merchants/api-keys/${keyId}`),
}

export const analyticsApi = {
  // Get dashboard metrics
  getDashboardMetrics: (params: any) => 
    ApiClient.get('/analytics/dashboard', { params }),
  
  // Get transaction trends
  getTransactionTrends: (params: any) => 
    ApiClient.get('/analytics/trends', { params }),
  
  // Get revenue analytics
  getRevenueAnalytics: (params: any) => 
    ApiClient.get('/analytics/revenue', { params }),
  
  // Get real-time metrics
  getRealTimeMetrics: () => 
    ApiClient.get('/analytics/realtime'),
}

export const subscriptionApi = {
  // Get subscriptions
  getSubscriptions: (params: any) => 
    ApiClient.get<PaginatedResponse<any>>('/subscriptions', { params }),
  
  // Create subscription
  createSubscription: (data: any) => 
    ApiClient.post('/subscriptions', data),
  
  // Update subscription
  updateSubscription: (id: string, data: any) => 
    ApiClient.put(`/subscriptions/${id}`, data),
  
  // Cancel subscription
  cancelSubscription: (id: string, data: any) => 
    ApiClient.post(`/subscriptions/${id}/cancel`, data),
  
  // Get subscription analytics
  getSubscriptionAnalytics: (params: any) => 
    ApiClient.get('/subscriptions/analytics', { params }),
}

export const settlementApi = {
  // Get settlements
  getSettlements: (params: any) => 
    ApiClient.get<PaginatedResponse<any>>('/settlements', { params }),
  
  // Get settlement details
  getSettlement: (id: string) => 
    ApiClient.get(`/settlements/${id}`),
  
  // Request settlement
  requestSettlement: (data: any) => 
    ApiClient.post('/settlements/request', data),
  
  // Get settlement analytics
  getSettlementAnalytics: (params: any) => 
    ApiClient.get('/settlements/analytics', { params }),
}

export const webhookApi = {
  // Get webhooks
  getWebhooks: () => 
    ApiClient.get('/webhooks'),
  
  // Create webhook
  createWebhook: (data: any) => 
    ApiClient.post('/webhooks', data),
  
  // Update webhook
  updateWebhook: (id: string, data: any) => 
    ApiClient.put(`/webhooks/${id}`, data),
  
  // Delete webhook
  deleteWebhook: (id: string) => 
    ApiClient.delete(`/webhooks/${id}`),
  
  // Test webhook
  testWebhook: (id: string) => 
    ApiClient.post(`/webhooks/${id}/test`),
  
  // Get webhook logs
  getWebhookLogs: (id: string, params: any) => 
    ApiClient.get(`/webhooks/${id}/logs`, { params }),
}

export default apiClient