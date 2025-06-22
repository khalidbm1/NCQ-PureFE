import { platformAuthClient, PlatformUser, PlatformAuthTokens } from './platform-auth'

// Platform Auth Integration for NCQ LLM
export interface AuthUser extends PlatformUser {
  subscription?: {
    id: string
    plan: string
    status: string
    currentPeriodStart: string
    currentPeriodEnd: string
    usage: {
      requests: number
      tokens: number
      storage: number
    }
    limits: {
      requests: number
      tokens: number
      storage: number
    }
  }
}

export interface LoginCredentials {
  email: string
  password: string
  tenantId?: string
}

export interface SignupCredentials {
  email: string
  password: string
  name: string
  tenantId?: string
}

class NCQLLMAuthService {
  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const { user, tokens } = await platformAuthClient.login(credentials)
      
      // Get LLM-specific user data and subscription info
      const llmUser = await this.enrichUserWithLLMData(user)
      
      return llmUser
    } catch (error: any) {
      console.error('Platform login failed:', error)
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthUser> {
    try {
      const { user, tokens } = await platformAuthClient.signup(credentials)
      
      // Initialize LLM-specific user data
      const llmUser = await this.initializeLLMUser(user)
      
      return llmUser
    } catch (error: any) {
      console.error('Platform signup failed:', error)
      throw new Error(error.response?.data?.message || 'Signup failed')
    }
  }

  async loginWithGoogle(): Promise<string> {
    return await platformAuthClient.loginWithSSO({
      provider: 'google',
      redirectUrl: `${window.location.origin}/auth/callback/google`
    })
  }

  async loginWithGitHub(): Promise<string> {
    return await platformAuthClient.loginWithSSO({
      provider: 'github',
      redirectUrl: `${window.location.origin}/auth/callback/github`
    })
  }

  async handleSSOCallback(code: string, state: string): Promise<AuthUser> {
    try {
      const { user, tokens } = await platformAuthClient.handleSSOCallback(code, state)
      
      // Get or create LLM-specific user data
      const llmUser = await this.getOrCreateLLMUser(user)
      
      return llmUser
    } catch (error: any) {
      console.error('SSO callback failed:', error)
      throw new Error(error.response?.data?.message || 'SSO authentication failed')
    }
  }

  async logout(): Promise<void> {
    await platformAuthClient.logout()
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const platformUser = await platformAuthClient.getCurrentUser()
      if (!platformUser) return null
      
      return await this.enrichUserWithLLMData(platformUser)
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  }

  async refreshSession(): Promise<AuthUser | null> {
    try {
      await platformAuthClient.refreshPlatformToken()
      return await this.getCurrentUser()
    } catch (error) {
      console.error('Session refresh failed:', error)
      return null
    }
  }

  // Permission and Role Checks
  hasLLMPermission(permission: string): boolean {
    return platformAuthClient.hasPermission(`llm:${permission}`)
  }

  canAccessModels(): boolean {
    return this.hasLLMPermission('read') || this.hasLLMPermission('write')
  }

  canManageModels(): boolean {
    return this.hasLLMPermission('admin')
  }

  canCreateAPIKeys(): boolean {
    return this.hasLLMPermission('write') || this.hasLLMPermission('admin')
  }

  canAccessBilling(): boolean {
    return this.hasLLMPermission('billing') || platformAuthClient.hasRole('admin')
  }

  // LLM-Specific User Data Management
  private async enrichUserWithLLMData(platformUser: PlatformUser): Promise<AuthUser> {
    try {
      // Get LLM service token for backend communication
      const serviceToken = await platformAuthClient.getLLMServiceToken()
      
      // Fetch LLM-specific user data using platform headers
      const headers = platformAuthClient.getAPIGatewayHeaders()
      const response = await fetch(`${process.env.NEXT_PUBLIC_LLM_BACKEND_URL}/api/v1/user/profile`, {
        headers: {
          ...headers,
          'X-Service-Token': serviceToken
        }
      })

      if (response.ok) {
        const llmData = await response.json()
        return {
          ...platformUser,
          subscription: llmData.subscription
        }
      } else {
        // If LLM data doesn't exist, initialize it
        return await this.initializeLLMUser(platformUser)
      }
    } catch (error) {
      console.warn('Failed to fetch LLM user data, using platform data only:', error)
      return {
        ...platformUser,
        subscription: this.getDefaultSubscription()
      }
    }
  }

  private async initializeLLMUser(platformUser: PlatformUser): Promise<AuthUser> {
    try {
      const serviceToken = await platformAuthClient.getLLMServiceToken()
      const headers = platformAuthClient.getAPIGatewayHeaders()
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_LLM_BACKEND_URL}/api/v1/user/initialize`, {
        method: 'POST',
        headers: {
          ...headers,
          'X-Service-Token': serviceToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platformUserId: platformUser.id,
          email: platformUser.email,
          name: platformUser.name,
          tenantId: platformUser.tenantId
        })
      })

      if (response.ok) {
        const llmData = await response.json()
        return {
          ...platformUser,
          subscription: llmData.subscription
        }
      }
    } catch (error) {
      console.warn('Failed to initialize LLM user data:', error)
    }

    // Fallback to default
    return {
      ...platformUser,
      subscription: this.getDefaultSubscription()
    }
  }

  private async getOrCreateLLMUser(platformUser: PlatformUser): Promise<AuthUser> {
    const existingUser = await this.enrichUserWithLLMData(platformUser)
    if (existingUser.subscription) {
      return existingUser
    }
    return await this.initializeLLMUser(platformUser)
  }

  private getDefaultSubscription() {
    return {
      id: 'default',
      plan: 'free',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      usage: {
        requests: 0,
        tokens: 0,
        storage: 0
      },
      limits: {
        requests: 1000,
        tokens: 10000,
        storage: 1024 * 1024 * 100 // 100MB
      }
    }
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return platformAuthClient.getPlatformToken() !== null && !platformAuthClient.isTokenExpired()
  }

  getAuthHeaders(): Record<string, string> {
    return platformAuthClient.getAPIGatewayHeaders()
  }

  async validateSession(): Promise<boolean> {
    return await platformAuthClient.validateSession()
  }
}

// Export singleton instance
export const authService = new NCQLLMAuthService()

// Utility functions for easy access
export const isAuthenticated = (): boolean => {
  return authService.isAuthenticated()
}

export const getCurrentUser = (): PlatformUser | null => {
  return platformAuthClient.getCurrentUser()
}

export const hasLLMPermission = (permission: string): boolean => {
  return authService.hasLLMPermission(permission)
}

export const logout = async (): Promise<void> => {
  await authService.logout()
} 