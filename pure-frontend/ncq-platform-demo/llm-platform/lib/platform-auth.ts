import axios, { AxiosInstance } from 'axios'

// Platform Auth Service Configuration
const PLATFORM_AUTH_URL = process.env.NEXT_PUBLIC_PLATFORM_AUTH_URL || 'http://localhost:3001'
const PLATFORM_API_GATEWAY = process.env.NEXT_PUBLIC_PLATFORM_API_GATEWAY || 'http://localhost:8080'

export interface PlatformUser {
  id: string
  email: string
  name: string
  role: string
  tenantId: string
  permissions: string[]
  metadata?: Record<string, any>
}

export interface PlatformAuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  scope?: string
}

export interface PlatformLoginRequest {
  email: string
  password: string
  tenantId?: string
}

export interface PlatformSignupRequest {
  email: string
  password: string
  name: string
  tenantId?: string
}

export interface SSOLoginRequest {
  provider: 'google' | 'github' | 'microsoft'
  redirectUrl?: string
}

class PlatformAuthClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: PLATFORM_AUTH_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Name': 'ncq-llm',
        'X-API-Version': 'v1'
      },
      timeout: 10000
    })

    // Add request interceptor for platform headers
    this.client.interceptors.request.use(
      (config) => {
        const platformToken = this.getPlatformToken()
        if (platformToken) {
          config.headers.Authorization = `Bearer ${platformToken}`
        }
        
        // Add tenant context if available
        const tenantId = this.getCurrentTenantId()
        if (tenantId) {
          config.headers['X-Tenant-ID'] = tenantId
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            await this.refreshPlatformToken()
            const newToken = this.getPlatformToken()
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            return this.client(originalRequest)
          } catch (refreshError) {
            this.clearPlatformTokens()
            // Redirect to platform login
            window.location.href = `${PLATFORM_AUTH_URL}/login?redirect=${encodeURIComponent(window.location.href)}&service=ncq-llm`
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Platform Authentication Methods
  async login(credentials: PlatformLoginRequest): Promise<{ user: PlatformUser; tokens: PlatformAuthTokens }> {
    const response = await this.client.post('/api/v1/auth/login', {
      ...credentials,
      service: 'ncq-llm',
      scope: 'llm:read llm:write llm:admin'
    })

    const { user, tokens } = response.data
    this.storePlatformTokens(tokens)
    this.setCurrentUser(user)
    
    return { user, tokens }
  }

  async signup(credentials: PlatformSignupRequest): Promise<{ user: PlatformUser; tokens: PlatformAuthTokens }> {
    const response = await this.client.post('/api/v1/auth/signup', {
      ...credentials,
      service: 'ncq-llm',
      scope: 'llm:read llm:write'
    })

    const { user, tokens } = response.data
    this.storePlatformTokens(tokens)
    this.setCurrentUser(user)

    return { user, tokens }
  }

  async loginWithSSO(request: SSOLoginRequest): Promise<string> {
    // Returns SSO login URL
    const response = await this.client.post('/api/v1/auth/sso/initiate', {
      ...request,
      service: 'ncq-llm',
      scope: 'llm:read llm:write'
    })

    return response.data.loginUrl
  }

  async handleSSOCallback(code: string, state: string): Promise<{ user: PlatformUser; tokens: PlatformAuthTokens }> {
    const response = await this.client.post('/api/v1/auth/sso/callback', {
      code,
      state,
      service: 'ncq-llm'
    })

    const { user, tokens } = response.data
    this.storePlatformTokens(tokens)
    this.setCurrentUser(user)

    return { user, tokens }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/api/v1/auth/logout')
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      this.clearPlatformTokens()
      this.clearCurrentUser()
    }
  }

  async getCurrentUser(): Promise<PlatformUser> {
    const response = await this.client.get('/api/v1/auth/me')
    const user = response.data
    this.setCurrentUser(user)
    return user
  }

  async refreshPlatformToken(): Promise<PlatformAuthTokens> {
    const refreshToken = this.getPlatformRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await this.client.post('/api/v1/auth/refresh', {
      refreshToken,
      service: 'ncq-llm'
    })

    const tokens = response.data
    this.storePlatformTokens(tokens)
    return tokens
  }

  async validateSession(): Promise<boolean> {
    try {
      await this.getCurrentUser()
      return true
    } catch (error) {
      return false
    }
  }

  // Token Management
  getPlatformToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ncq_platform_access_token')
    }
    return null
  }

  getPlatformRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ncq_platform_refresh_token')
    }
    return null
  }

  storePlatformTokens(tokens: PlatformAuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ncq_platform_access_token', tokens.accessToken)
      localStorage.setItem('ncq_platform_refresh_token', tokens.refreshToken)
      localStorage.setItem('ncq_platform_token_expires', (Date.now() + tokens.expiresIn * 1000).toString())
    }
  }

  clearPlatformTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ncq_platform_access_token')
      localStorage.removeItem('ncq_platform_refresh_token')
      localStorage.removeItem('ncq_platform_token_expires')
    }
  }

  isTokenExpired(): boolean {
    if (typeof window !== 'undefined') {
      const expiresAt = localStorage.getItem('ncq_platform_token_expires')
      if (expiresAt) {
        return Date.now() >= parseInt(expiresAt)
      }
    }
    return true
  }

  // User Management
  getCurrentUser(): PlatformUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('ncq_platform_user')
      if (userStr) {
        try {
          return JSON.parse(userStr)
        } catch (error) {
          console.warn('Failed to parse stored user:', error)
        }
      }
    }
    return null
  }

  setCurrentUser(user: PlatformUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ncq_platform_user', JSON.stringify(user))
    }
  }

  clearCurrentUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ncq_platform_user')
    }
  }

  getCurrentTenantId(): string | null {
    const user = this.getCurrentUser()
    return user?.tenantId || null
  }

  // Permission Management
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser()
    return user?.permissions?.includes(permission) || false
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  }

  // API Gateway Integration
  getAPIGatewayHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'X-Service-Name': 'ncq-llm',
      'X-API-Version': 'v1'
    }

    const token = this.getPlatformToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const tenantId = this.getCurrentTenantId()
    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId
    }

    const user = this.getCurrentUser()
    if (user) {
      headers['X-User-ID'] = user.id
      headers['X-User-Role'] = user.role
    }

    return headers
  }

  // Service-to-Service Communication
  async getLLMServiceToken(): Promise<string> {
    const response = await this.client.post('/api/v1/auth/service-token', {
      service: 'ncq-llm',
      targetService: 'llm-backend',
      scope: 'llm:read llm:write llm:inference'
    })

    return response.data.serviceToken
  }
}

export const platformAuthClient = new PlatformAuthClient()

// Utility functions for easy access
export const isAuthenticated = (): boolean => {
  const token = platformAuthClient.getPlatformToken()
  return !!token && !platformAuthClient.isTokenExpired()
}

export const getCurrentUser = (): PlatformUser | null => {
  return platformAuthClient.getCurrentUser()
}

export const hasPermission = (permission: string): boolean => {
  return platformAuthClient.hasPermission(permission)
}

export const hasRole = (role: string): boolean => {
  return platformAuthClient.hasRole(role)
}

export const logout = async (): Promise<void> => {
  await platformAuthClient.logout()
}