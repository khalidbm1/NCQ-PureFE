import { jwtDecode } from 'jwt-decode';
import CryptoJS from 'crypto-js';

interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
  exp: number;
  iat: number;
  jti: string;
}

interface StoredToken {
  value: string;
  fingerprint: string;
  issuedAt: number;
  expiresAt: number;
}

class TokenService {
  private static instance: TokenService;
  private readonly ACCESS_TOKEN_KEY = 'ncq_access_token';
  private readonly REFRESH_TOKEN_KEY = 'ncq_refresh_token';
  private readonly TOKEN_ENCRYPTION_KEY = process.env.NEXT_PUBLIC_TOKEN_ENCRYPTION_KEY || 'ncq-default-key';
  private memoryToken: string | null = null;
  private tokenRefreshCallbacks: Set<(token: string) => void> = new Set();
  private refreshPromise: Promise<string> | null = null;

  private constructor() {
    // Setup storage event listener for cross-tab synchronization
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange);
      
      // Listen for visibility changes to validate token
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      
      // Setup periodic token validation
      setInterval(() => this.validateStoredTokens(), 60000); // Every minute
    }
  }

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * Store access token securely
   */
  setAccessToken(token: string, rememberMe: boolean = false): void {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) throw new Error('Invalid token');

      // Store in memory for highest security
      this.memoryToken = token;

      // Store encrypted version if remember me is enabled
      if (rememberMe) {
        const encrypted = this.encryptToken(token);
        const storedToken: StoredToken = {
          value: encrypted,
          fingerprint: this.generateTokenFingerprint(token),
          issuedAt: decoded.iat * 1000,
          expiresAt: decoded.exp * 1000,
        };
        
        if (this.isSecureContext()) {
          // Use sessionStorage for temporary storage
          sessionStorage.setItem(this.ACCESS_TOKEN_KEY, JSON.stringify(storedToken));
        }
        
        // Also store in httpOnly cookie via API call
        this.storeTokenInCookie(token);
      }

      // Notify listeners
      this.tokenRefreshCallbacks.forEach(callback => callback(token));
    } catch (error) {
      console.error('Failed to store access token:', error);
      throw error;
    }
  }

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    // First check memory
    if (this.memoryToken && this.isTokenValid(this.memoryToken)) {
      return this.memoryToken;
    }

    // Then check session storage
    try {
      const storedData = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (storedData) {
        const storedToken: StoredToken = JSON.parse(storedData);
        
        // Validate fingerprint and expiry
        if (this.validateStoredToken(storedToken)) {
          const decrypted = this.decryptToken(storedToken.value);
          if (this.isTokenValid(decrypted)) {
            this.memoryToken = decrypted;
            return decrypted;
          }
        }
      }
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
    }

    // Finally check cookie via API
    return this.getTokenFromCookie();
  }

  /**
   * Store refresh token
   */
  setRefreshToken(token: string): void {
    try {
      const encrypted = this.encryptToken(token);
      const decoded = this.decodeToken(token);
      
      const storedToken: StoredToken = {
        value: encrypted,
        fingerprint: this.generateTokenFingerprint(token),
        issuedAt: decoded?.iat ? decoded.iat * 1000 : Date.now(),
        expiresAt: decoded?.exp ? decoded.exp * 1000 : Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      
      // Store in localStorage for persistence
      localStorage.setItem(this.REFRESH_TOKEN_KEY, JSON.stringify(storedToken));
      
      // Also store in httpOnly cookie
      this.storeRefreshTokenInCookie(token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    try {
      const storedData = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (storedData) {
        const storedToken: StoredToken = JSON.parse(storedData);
        
        if (this.validateStoredToken(storedToken)) {
          return this.decryptToken(storedToken.value);
        }
      }
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
    }
    
    return this.getRefreshTokenFromCookie();
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    this.memoryToken = null;
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    
    // Clear cookies via API
    this.clearTokenCookies();
    
    // Notify other tabs
    this.broadcastTokenChange('logout');
  }

  /**
   * Decode JWT token
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Check if token is valid
   */
  isTokenValid(token: string | null): boolean {
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) return false;
      
      // Check expiration with 30 second buffer
      const now = Date.now() / 1000;
      return decoded.exp > now + 30;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get time until token expires
   */
  getTokenExpiryTime(token: string): number {
    const decoded = this.decodeToken(token);
    if (!decoded) return 0;
    
    return Math.max(0, decoded.exp * 1000 - Date.now());
  }

  /**
   * Register callback for token updates
   */
  onTokenRefresh(callback: (token: string) => void): () => void {
    this.tokenRefreshCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.tokenRefreshCallbacks.delete(callback);
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    // Prevent concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const { accessToken, refreshToken: newRefreshToken } = data.data;

      // Update tokens
      this.setAccessToken(accessToken, true);
      if (newRefreshToken) {
        this.setRefreshToken(newRefreshToken);
      }

      // Broadcast to other tabs
      this.broadcastTokenChange('refresh');

      return accessToken;
    } catch (error) {
      // Clear tokens on refresh failure
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Encrypt token for storage
   */
  private encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, this.TOKEN_ENCRYPTION_KEY).toString();
  }

  /**
   * Decrypt token from storage
   */
  private decryptToken(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, this.TOKEN_ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Generate token fingerprint
   */
  private generateTokenFingerprint(token: string): string {
    const decoded = this.decodeToken(token);
    if (!decoded) return '';
    
    // Create fingerprint from token claims
    const fingerprint = `${decoded.sub}:${decoded.jti}:${decoded.iat}`;
    return CryptoJS.SHA256(fingerprint).toString();
  }

  /**
   * Validate stored token
   */
  private validateStoredToken(storedToken: StoredToken): boolean {
    // Check expiry
    if (storedToken.expiresAt < Date.now()) {
      return false;
    }
    
    // Validate fingerprint
    try {
      const decrypted = this.decryptToken(storedToken.value);
      const currentFingerprint = this.generateTokenFingerprint(decrypted);
      return currentFingerprint === storedToken.fingerprint;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if running in secure context
   */
  private isSecureContext(): boolean {
    return typeof window !== 'undefined' && 
           (window.location.protocol === 'https:' || 
            window.location.hostname === 'localhost');
  }

  /**
   * Handle storage changes for cross-tab sync
   */
  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key === 'ncq_token_broadcast') {
      const data = event.newValue ? JSON.parse(event.newValue) : null;
      
      if (data?.action === 'logout') {
        this.clearTokens();
        window.location.href = '/login';
      } else if (data?.action === 'refresh') {
        // Re-read tokens from storage
        this.memoryToken = null;
        const token = this.getAccessToken();
        if (token) {
          this.tokenRefreshCallbacks.forEach(callback => callback(token));
        }
      }
    }
  };

  /**
   * Handle visibility changes
   */
  private handleVisibilityChange = (): void => {
    if (!document.hidden) {
      // Validate token when tab becomes visible
      this.validateStoredTokens();
    }
  };

  /**
   * Validate stored tokens
   */
  private validateStoredTokens(): void {
    const accessToken = this.getAccessToken();
    
    if (accessToken && !this.isTokenValid(accessToken)) {
      // Token expired, try to refresh
      this.refreshAccessToken().catch(() => {
        this.clearTokens();
        window.location.href = '/login';
      });
    }
  }

  /**
   * Broadcast token changes to other tabs
   */
  private broadcastTokenChange(action: 'logout' | 'refresh'): void {
    try {
      localStorage.setItem('ncq_token_broadcast', JSON.stringify({
        action,
        timestamp: Date.now(),
      }));
      
      // Clean up
      setTimeout(() => {
        localStorage.removeItem('ncq_token_broadcast');
      }, 100);
    } catch (error) {
      console.error('Failed to broadcast token change:', error);
    }
  }

  /**
   * Store token in httpOnly cookie via API
   */
  private async storeTokenInCookie(token: string): Promise<void> {
    try {
      await fetch('/api/v1/auth/token/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to store token in cookie:', error);
    }
  }

  /**
   * Store refresh token in httpOnly cookie
   */
  private async storeRefreshTokenInCookie(token: string): Promise<void> {
    try {
      await fetch('/api/v1/auth/refresh-token/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: token }),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to store refresh token in cookie:', error);
    }
  }

  /**
   * Get token from httpOnly cookie
   */
  private async getTokenFromCookie(): Promise<string | null> {
    try {
      const response = await fetch('/api/v1/auth/token/retrieve', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data.accessToken;
      }
    } catch (error) {
      console.error('Failed to get token from cookie:', error);
    }
    
    return null;
  }

  /**
   * Get refresh token from httpOnly cookie
   */
  private async getRefreshTokenFromCookie(): Promise<string | null> {
    try {
      const response = await fetch('/api/v1/auth/refresh-token/retrieve', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data.refreshToken;
      }
    } catch (error) {
      console.error('Failed to get refresh token from cookie:', error);
    }
    
    return null;
  }

  /**
   * Clear token cookies
   */
  private async clearTokenCookies(): Promise<void> {
    try {
      await fetch('/api/v1/auth/token/clear', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to clear token cookies:', error);
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    this.tokenRefreshCallbacks.clear();
  }
}

export default TokenService.getInstance();