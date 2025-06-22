import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import TokenService from './TokenService';
import { getDeviceFingerprint } from './deviceFingerprint';

interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

class AuthInterceptor {
  private static instance: AuthInterceptor;
  private isRefreshing = false;
  private refreshQueue: RetryQueueItem[] = [];
  private axiosInstance: AxiosInstance;
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY = 1000;
  private requestIdCounter = 0;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      },
    });

    this.setupInterceptors();
  }

  static getInstance(): AuthInterceptor {
    if (!AuthInterceptor.instance) {
      AuthInterceptor.instance = new AuthInterceptor();
    }
    return AuthInterceptor.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Add request ID for tracking
        const requestId = `req-${Date.now()}-${++this.requestIdCounter}`;
        config.headers['X-Request-ID'] = requestId;

        // Add device fingerprint
        try {
          const fingerprint = await getDeviceFingerprint();
          config.headers['X-Device-Fingerprint'] = fingerprint;
        } catch (error) {
          console.warn('Failed to get device fingerprint:', error);
        }

        // Add auth token
        const token = TokenService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add language header
        const language = localStorage.getItem('ncq_language') || 'en';
        config.headers['Accept-Language'] = language;

        // Add timezone
        config.headers['X-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[${requestId}] ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          const requestId = response.config.headers?.['X-Request-ID'];
          console.log(`[${requestId}] Response:`, response.data);
        }

        // Handle token refresh in response headers
        const newToken = response.headers['x-new-token'];
        if (newToken) {
          TokenService.setAccessToken(newToken, true);
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: number };
        
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          const requestId = originalRequest?.headers?.['X-Request-ID'];
          console.error(`[${requestId}] Error:`, error.response?.data || error.message);
        }

        // Handle network errors
        if (!error.response) {
          return this.handleNetworkError(error, originalRequest);
        }

        // Handle 401 Unauthorized
        if (error.response.status === 401 && originalRequest && !originalRequest.url?.includes('/auth/refresh')) {
          return this.handle401Error(originalRequest);
        }

        // Handle 403 Forbidden
        if (error.response.status === 403) {
          return this.handle403Error(error);
        }

        // Handle 429 Rate Limit
        if (error.response.status === 429) {
          return this.handle429Error(error, originalRequest);
        }

        // Handle 5xx Server Errors
        if (error.response.status >= 500) {
          return this.handle5xxError(error, originalRequest);
        }

        // Transform error response
        const transformedError = this.transformErrorResponse(error);
        return Promise.reject(transformedError);
      }
    );
  }

  private async handle401Error(originalRequest: InternalAxiosRequestConfig & { _retry?: number }): Promise<any> {
    // Prevent infinite loop
    if (originalRequest._retry && originalRequest._retry >= this.MAX_RETRY_ATTEMPTS) {
      TokenService.clearTokens();
      window.location.href = '/login?session=expired';
      return Promise.reject(new Error('Session expired'));
    }

    originalRequest._retry = (originalRequest._retry || 0) + 1;

    if (!this.isRefreshing) {
      this.isRefreshing = true;

      try {
        const newToken = await TokenService.refreshAccessToken();
        this.isRefreshing = false;

        // Process queued requests
        this.refreshQueue.forEach(({ resolve, config }) => {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${newToken}`;
          resolve(this.axiosInstance(config));
        });
        this.refreshQueue = [];

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return this.axiosInstance(originalRequest);
      } catch (error) {
        this.isRefreshing = false;
        this.refreshQueue.forEach(({ reject }) => reject(error));
        this.refreshQueue = [];
        
        TokenService.clearTokens();
        window.location.href = '/login?session=expired';
        return Promise.reject(error);
      }
    }

    // Queue the request
    return new Promise((resolve, reject) => {
      this.refreshQueue.push({ resolve, reject, config: originalRequest });
    });
  }

  private handle403Error(error: AxiosError): Promise<never> {
    const errorData: any = error.response?.data;
    
    // Check if it's a permission error
    if (errorData?.error?.code === 'INSUFFICIENT_PERMISSIONS') {
      // Redirect to unauthorized page
      window.location.href = '/unauthorized';
    }
    
    return Promise.reject(this.transformErrorResponse(error));
  }

  private async handle429Error(
    error: AxiosError, 
    originalRequest: InternalAxiosRequestConfig & { _retry?: number }
  ): Promise<any> {
    const retryAfter = error.response?.headers['retry-after'];
    const delay = retryAfter ? parseInt(retryAfter) * 1000 : this.RETRY_DELAY;
    
    if (!originalRequest._retry || originalRequest._retry < this.MAX_RETRY_ATTEMPTS) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.axiosInstance(originalRequest);
    }
    
    return Promise.reject(this.transformErrorResponse(error));
  }

  private async handle5xxError(
    error: AxiosError,
    originalRequest: InternalAxiosRequestConfig & { _retry?: number }
  ): Promise<any> {
    if (!originalRequest._retry || originalRequest._retry < this.MAX_RETRY_ATTEMPTS) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      
      // Exponential backoff
      const delay = this.RETRY_DELAY * Math.pow(2, originalRequest._retry - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.axiosInstance(originalRequest);
    }
    
    return Promise.reject(this.transformErrorResponse(error));
  }

  private async handleNetworkError(
    error: AxiosError,
    originalRequest: InternalAxiosRequestConfig & { _retry?: number }
  ): Promise<any> {
    // Check if online
    if (!navigator.onLine) {
      return Promise.reject({
        code: 'NETWORK_OFFLINE',
        message: 'No internet connection',
        messageAr: 'لا يوجد اتصال بالإنترنت',
      });
    }

    // Retry with exponential backoff
    if (!originalRequest._retry || originalRequest._retry < this.MAX_RETRY_ATTEMPTS) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      
      const delay = this.RETRY_DELAY * Math.pow(2, originalRequest._retry - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.axiosInstance(originalRequest);
    }

    return Promise.reject({
      code: 'NETWORK_ERROR',
      message: 'Network request failed',
      messageAr: 'فشل طلب الشبكة',
    });
  }

  private transformErrorResponse(error: AxiosError): any {
    const response = error.response;
    const data: any = response?.data;

    // NCQ standard error format
    if (data?.error) {
      return {
        code: data.error.code || 'UNKNOWN_ERROR',
        message: data.error.description || error.message,
        messageAr: data.error.descriptionAr || 'حدث خطأ غير متوقع',
        field: data.error.field,
        details: data.error.details,
        timestamp: data.timestamp || new Date().toISOString(),
        requestId: response?.headers?.['x-request-id'],
      };
    }

    // Fallback error format
    return {
      code: `HTTP_${response?.status || 0}`,
      message: data?.message || error.message,
      messageAr: data?.messageAr || 'حدث خطأ غير متوقع',
      timestamp: new Date().toISOString(),
      requestId: response?.headers?.['x-request-id'],
    };
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Set custom headers
   */
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  /**
   * Remove custom header
   */
  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  /**
   * Set base URL
   */
  setBaseURL(url: string): void {
    this.axiosInstance.defaults.baseURL = url;
  }
}

// Export configured axios instance
export const api = AuthInterceptor.getInstance().getAxiosInstance();

// Export the interceptor class for advanced usage
export default AuthInterceptor;