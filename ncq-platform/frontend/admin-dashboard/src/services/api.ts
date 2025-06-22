import axios, { AxiosInstance, AxiosError } from 'axios'
import { toast } from 'sonner'

// API Base URL
const baseURL = (import.meta as any).env?.VITE_API_URL || 'https://api.ncq.sa'

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() }
    }

    // Add tenant ID if available
    const tenantId = localStorage.getItem('tenantId')
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId
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
    const { response, config } = error

    // Handle token refresh
    if (response?.status === 401 && !config?.url?.includes('/auth/')) {
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await api.post('/auth/api/v1/auth/refresh', {
            refreshToken,
          })
          
          const { accessToken, refreshToken: newRefreshToken } = response.data
          
          // Update tokens
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)
          
          // Update authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          
          // Retry original request
          if (config) {
            config.headers = config.headers || {}
            config.headers['Authorization'] = `Bearer ${accessToken}`
            return api.request(config)
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle different error types
    if (response) {
      const { status, data } = response

      // Handle specific error codes
      switch (status) {
        case 400:
          toast.error((data as any)?.message || 'Bad request')
          break
        case 401:
          toast.error('Authentication required')
          break
        case 403:
          toast.error('Access denied')
          break
        case 404:
          toast.error('Resource not found')
          break
        case 409:
          toast.error((data as any)?.message || 'Conflict occurred')
          break
        case 422:
          // Validation errors
          if ((data as any)?.errors) {
            const errorMessages = Object.values((data as any).errors).flat()
            errorMessages.forEach((message: any) => toast.error(message))
          } else {
            toast.error((data as any)?.message || 'Validation failed')
          }
          break
        case 429:
          toast.error('Too many requests. Please try again later.')
          break
        case 500:
          toast.error('Server error occurred')
          break
        case 503:
          toast.error('Service temporarily unavailable')
          break
        default:
          toast.error((data as any)?.message || 'An error occurred')
      }
    } else if (error.code === 'NETWORK_ERROR') {
      toast.error('Network error. Please check your connection.')
    } else if (error.code === 'TIMEOUT') {
      toast.error('Request timeout. Please try again.')
    } else {
      toast.error('An unexpected error occurred')
    }

    return Promise.reject(error)
  }
)

// API service methods
export const apiService = {
  // Generic CRUD operations
  get: <T>(url: string, params?: any) => api.get<T>(url, { params }),
  post: <T>(url: string, data?: any) => api.post<T>(url, data),
  put: <T>(url: string, data?: any) => api.put<T>(url, data),
  patch: <T>(url: string, data?: any) => api.patch<T>(url, data),
  delete: <T>(url: string) => api.delete<T>(url),

  // File upload
  upload: (url: string, formData: FormData, onProgress?: (progress: number) => void) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
  },

  // Download file
  download: (url: string, filename?: string) => {
    return api.get(url, {
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename || 'download')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    })
  },
}

export default api