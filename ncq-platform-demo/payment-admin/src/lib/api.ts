import axios, { AxiosError, AxiosInstance } from 'axios'
import { store } from '@/store'
import { logout } from '@/store/slices/authSlice'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId()

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = store.getState().auth.refreshToken
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          const { token } = response.data
          store.dispatch({ type: 'auth/setToken', payload: token })

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout())
        window.location.href = '/login'
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error
      const errorMessage = error.response.data?.message || 'An error occurred'
      const errorCode = error.response.data?.code || 'UNKNOWN_ERROR'

      return Promise.reject({
        message: errorMessage,
        code: errorCode,
        status: error.response.status,
        data: error.response.data,
      })
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      })
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        code: 'CLIENT_ERROR',
      })
    }
  }
)

// Helper functions
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// API service methods
export const apiService = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      api.post('/auth/login', { email, password }),
    loginWithOTP: (email: string, password: string, otp: string) =>
      api.post('/auth/login', { email, password, otp }),
    logout: () => api.post('/auth/logout'),
    refreshToken: (refreshToken: string) =>
      api.post('/auth/refresh', { refreshToken }),
    forgotPassword: (email: string) =>
      api.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) =>
      api.post('/auth/reset-password', { token, password }),
    verify2FA: (code: string) => api.post('/auth/verify-2fa', { code }),
  },

  // User endpoints
  users: {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data: any) => api.put('/users/profile', data),
    changePassword: (oldPassword: string, newPassword: string) =>
      api.post('/users/change-password', { oldPassword, newPassword }),
    getAll: (params?: any) => api.get('/users', { params }),
    getById: (id: string) => api.get(`/users/${id}`),
    create: (data: any) => api.post('/users', data),
    update: (id: string, data: any) => api.put(`/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/${id}`),
  },

  // Transaction endpoints
  transactions: {
    getAll: (params?: any) => api.get('/transactions', { params }),
    getById: (id: string) => api.get(`/transactions/${id}`),
    refund: (id: string, amount?: number) =>
      api.post(`/transactions/${id}/refund`, { amount }),
    void: (id: string) => api.post(`/transactions/${id}/void`),
    getReceipt: (id: string) =>
      api.get(`/transactions/${id}/receipt`, { responseType: 'blob' }),
  },

  // Merchant endpoints
  merchants: {
    getAll: (params?: any) => api.get('/merchants', { params }),
    getById: (id: string) => api.get(`/merchants/${id}`),
    create: (data: any) => api.post('/merchants', data),
    update: (id: string, data: any) => api.put(`/merchants/${id}`, data),
    delete: (id: string) => api.delete(`/merchants/${id}`),
    suspend: (id: string) => api.post(`/merchants/${id}/suspend`),
    activate: (id: string) => api.post(`/merchants/${id}/activate`),
    getStats: (id: string) => api.get(`/merchants/${id}/stats`),
  },

  // Settings endpoints
  settings: {
    getGeneral: () => api.get('/settings/general'),
    updateGeneral: (data: any) => api.put('/settings/general', data),
    getPaymentProcessors: () => api.get('/settings/payment-processors'),
    updatePaymentProcessor: (id: string, data: any) =>
      api.put(`/settings/payment-processors/${id}`, data),
    getWebhooks: () => api.get('/settings/webhooks'),
    createWebhook: (data: any) => api.post('/settings/webhooks', data),
    updateWebhook: (id: string, data: any) =>
      api.put(`/settings/webhooks/${id}`, data),
    deleteWebhook: (id: string) => api.delete(`/settings/webhooks/${id}`),
    testWebhook: (id: string) => api.post(`/settings/webhooks/${id}/test`),
  },

  // Reports endpoints
  reports: {
    getTransactionReport: (params: any) =>
      api.get('/reports/transactions', { params }),
    getRevenueReport: (params: any) => api.get('/reports/revenue', { params }),
    getSettlementReport: (params: any) =>
      api.get('/reports/settlements', { params }),
    getComplianceReport: (params: any) =>
      api.get('/reports/compliance', { params }),
    exportReport: (type: string, params: any) =>
      api.get(`/reports/export/${type}`, {
        params,
        responseType: 'blob',
      }),
  },

  // Audit logs endpoints
  auditLogs: {
    getAll: (params?: any) => api.get('/audit-logs', { params }),
    getById: (id: string) => api.get(`/audit-logs/${id}`),
    export: (params: any) =>
      api.get('/audit-logs/export', { params, responseType: 'blob' }),
  },
}