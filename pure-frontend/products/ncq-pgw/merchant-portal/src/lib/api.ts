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
    const merchantId = state.auth.user?.merchantId

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (merchantId) {
      config.headers['X-Merchant-ID'] = merchantId
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId()

    // Add test mode header if applicable
    if (state.auth.user?.testMode) {
      config.headers['X-Test-Mode'] = 'true'
    }

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
    login: (email: string, password: string, merchantId: string) =>
      api.post('/merchant/auth/login', { email, password, merchantId }),
    logout: () => api.post('/merchant/auth/logout'),
    refreshToken: (refreshToken: string) =>
      api.post('/merchant/auth/refresh', { refreshToken }),
    forgotPassword: (email: string) =>
      api.post('/merchant/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) =>
      api.post('/merchant/auth/reset-password', { token, password }),
    verify2FA: (code: string) => api.post('/merchant/auth/verify-2fa', { code }),
  },

  // Merchant profile
  merchant: {
    getProfile: () => api.get('/merchant/profile'),
    updateProfile: (data: any) => api.put('/merchant/profile', data),
    changePassword: (oldPassword: string, newPassword: string) =>
      api.post('/merchant/change-password', { oldPassword, newPassword }),
    uploadLogo: (file: File) => {
      const formData = new FormData()
      formData.append('logo', file)
      return api.post('/merchant/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
  },

  // Transactions
  transactions: {
    getAll: (params?: any) => api.get('/merchant/transactions', { params }),
    getById: (id: string) => api.get(`/merchant/transactions/${id}`),
    refund: (id: string, amount?: number, reason?: string) =>
      api.post(`/merchant/transactions/${id}/refund`, { amount, reason }),
    getReceipt: (id: string) =>
      api.get(`/merchant/transactions/${id}/receipt`, { responseType: 'blob' }),
  },

  // Payment links
  paymentLinks: {
    getAll: (params?: any) => api.get('/merchant/payment-links', { params }),
    getById: (id: string) => api.get(`/merchant/payment-links/${id}`),
    create: (data: any) => api.post('/merchant/payment-links', data),
    update: (id: string, data: any) => api.put(`/merchant/payment-links/${id}`, data),
    delete: (id: string) => api.delete(`/merchant/payment-links/${id}`),
    getQRCode: (id: string) =>
      api.get(`/merchant/payment-links/${id}/qr-code`, { responseType: 'blob' }),
  },

  // API keys
  apiKeys: {
    getAll: () => api.get('/merchant/api-keys'),
    create: (name: string, permissions: string[]) =>
      api.post('/merchant/api-keys', { name, permissions }),
    revoke: (id: string) => api.delete(`/merchant/api-keys/${id}`),
  },

  // Webhooks
  webhooks: {
    getAll: () => api.get('/merchant/webhooks'),
    getById: (id: string) => api.get(`/merchant/webhooks/${id}`),
    create: (data: any) => api.post('/merchant/webhooks', data),
    update: (id: string, data: any) => api.put(`/merchant/webhooks/${id}`, data),
    delete: (id: string) => api.delete(`/merchant/webhooks/${id}`),
    test: (id: string) => api.post(`/merchant/webhooks/${id}/test`),
    getLogs: (id: string) => api.get(`/merchant/webhooks/${id}/logs`),
  },

  // Settlements
  settlements: {
    getAll: (params?: any) => api.get('/merchant/settlements', { params }),
    getById: (id: string) => api.get(`/merchant/settlements/${id}`),
    getReport: (params: any) =>
      api.get('/merchant/settlements/report', {
        params,
        responseType: 'blob',
      }),
  },

  // Analytics
  analytics: {
    getDashboard: (params: any) => api.get('/merchant/analytics/dashboard', { params }),
    getRevenue: (params: any) => api.get('/merchant/analytics/revenue', { params }),
    getTransactions: (params: any) =>
      api.get('/merchant/analytics/transactions', { params }),
    getPaymentMethods: (params: any) =>
      api.get('/merchant/analytics/payment-methods', { params }),
    getCustomers: (params: any) => api.get('/merchant/analytics/customers', { params }),
    exportReport: (type: string, params: any) =>
      api.get(`/merchant/analytics/export/${type}`, {
        params,
        responseType: 'blob',
      }),
  },

  // Settings
  settings: {
    getNotifications: () => api.get('/merchant/settings/notifications'),
    updateNotifications: (data: any) => api.put('/merchant/settings/notifications', data),
    getBankAccount: () => api.get('/merchant/settings/bank-account'),
    updateBankAccount: (data: any) => api.put('/merchant/settings/bank-account', data),
    getSecurity: () => api.get('/merchant/settings/security'),
    updateSecurity: (data: any) => api.put('/merchant/settings/security', data),
    enable2FA: (method: string) => api.post('/merchant/settings/2fa/enable', { method }),
    disable2FA: () => api.post('/merchant/settings/2fa/disable'),
  },
}