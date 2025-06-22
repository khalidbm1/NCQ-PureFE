import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '../config'
import { ApiError } from '../types'
import { platformAuthClient } from '../platform-auth'
import { authService } from '../auth'

class ApiClient {
  private client: AxiosInstance
  
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    })
    
    // Request interceptor to add platform auth headers
    this.client.interceptors.request.use(
      (config) => {
        // Get platform authentication headers
        const platformHeaders = authService.getAuthHeaders()
        
        // Merge platform headers with existing headers
        config.headers = {
          ...config.headers,
          ...platformHeaders,
        }

        // Add LLM service specific headers
        config.headers['X-Service-Name'] = 'ncq-llm'
        config.headers['X-API-Version'] = 'v1'
        
        // Add tenant context if available
        const tenantId = localStorage.getItem('currentTenantId')
        if (tenantId) {
          config.headers['X-Tenant-ID'] = tenantId
        }
        
        return config
      },
      (error) => Promise.reject(error)
    )
    
    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            // Try to refresh the platform session
            await authService.refreshSession()
            
            // Get updated platform headers
            const updatedHeaders = authService.getAuthHeaders()
            if (originalRequest.headers) {
              Object.assign(originalRequest.headers, updatedHeaders)
            }
            
            return this.client(originalRequest)
          } catch (refreshError) {
            // If refresh fails, redirect to platform login
            platformAuthClient.clearPlatformTokens()
            const platformAuthUrl = process.env.NEXT_PUBLIC_PLATFORM_AUTH_URL || 'http://localhost:3001'
            window.location.href = `${platformAuthUrl}/login?redirect=${encodeURIComponent(window.location.href)}&service=ncq-llm`
            return Promise.reject(refreshError)
          }
        }
        
        // Handle other platform-specific errors
        if (error.response?.status === 403) {
          // Insufficient permissions
          const errorMessage = error.response.data?.message || 'Insufficient permissions for this operation'
          return Promise.reject(this.formatError(error, errorMessage))
        }
        
        if (error.response?.status === 429) {
          // Rate limiting
          const errorMessage = 'Rate limit exceeded. Please try again later.'
          return Promise.reject(this.formatError(error, errorMessage))
        }
        
        return Promise.reject(this.formatError(error))
      }
    )
  }
  
  // Platform-aware token management (deprecated methods kept for compatibility)
  setTokens(tokens: any) {
    console.warn('setTokens is deprecated. Platform authentication handles tokens automatically.')
  }
  
  clearTokens() {
    console.warn('clearTokens is deprecated. Use platformAuthClient.clearPlatformTokens() instead.')
    platformAuthClient.clearPlatformTokens()
  }
  
  private formatError(error: AxiosError<ApiError>, customMessage?: string): ApiError {
    if (error.response?.data) {
      return {
        ...error.response.data,
        message: customMessage || error.response.data.message,
        statusCode: error.response.status,
      }
    }
    
    return {
      error: 'Network Error',
      message: customMessage || error.message || 'Something went wrong',
      statusCode: error.response?.status || 0,
    }
  }
  
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }
  
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }
  
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }
  
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }
  
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
  
  async upload<T>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
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
    return response.data
  }
}

export const apiClient = new ApiClient()