import TokenService from './TokenService';
import CryptoJS from 'crypto-js';

// Mock dependencies
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

jest.mock('crypto-js', () => ({
  AES: {
    encrypt: jest.fn(() => ({ toString: () => 'encrypted' })),
    decrypt: jest.fn(() => ({ toString: () => 'decrypted' })),
  },
  SHA256: jest.fn(() => ({ toString: () => 'fingerprint' })),
  enc: { Utf8: {} },
}));

// Mock fetch
global.fetch = jest.fn();

describe('TokenService', () => {
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QG5jcS5zYSIsInJvbGVzIjpbIlVTRVIiXSwicGVybWlzc2lvbnMiOltdLCJleHAiOjk5OTk5OTk5OTksImlhdCI6MTYxNjIzOTAyMiwianRpIjoiYWJjMTIzIn0.test';
  
  const mockDecodedToken = {
    sub: '1234567890',
    email: 'test@ncq.sa',
    roles: ['USER'],
    permissions: [],
    exp: 9999999999,
    iat: 1616239022,
    jti: 'abc123',
  };

  const { jwtDecode } = require('jwt-decode');

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset singleton instance
    (TokenService as any).instance = null;
    (TokenService as any).memoryToken = null;
    
    // Mock jwtDecode
    jwtDecode.mockReturnValue(mockDecodedToken);
  });

  afterEach(() => {
    // Clean up event listeners
    (TokenService as any).getInstance().destroy();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = (TokenService as any).getInstance();
      const instance2 = (TokenService as any).getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('setAccessToken', () => {
    it('should store token in memory', () => {
      TokenService.setAccessToken(mockToken, false);
      expect(TokenService.getAccessToken()).toBe(mockToken);
    });

    it('should store encrypted token in sessionStorage when rememberMe is true', () => {
      TokenService.setAccessToken(mockToken, true);
      
      const storedData = sessionStorage.getItem('ncq_access_token');
      expect(storedData).toBeTruthy();
      
      const parsed = JSON.parse(storedData!);
      expect(parsed.value).toBe('encrypted');
      expect(parsed.fingerprint).toBe('fingerprint');
      expect(parsed.expiresAt).toBe(mockDecodedToken.exp * 1000);
    });

    it('should notify token refresh callbacks', () => {
      const callback = jest.fn();
      TokenService.onTokenRefresh(callback);
      
      TokenService.setAccessToken(mockToken, false);
      expect(callback).toHaveBeenCalledWith(mockToken);
    });

    it('should throw error for invalid token', () => {
      jwtDecode.mockReturnValue(null);
      expect(() => TokenService.setAccessToken('invalid', false)).toThrow('Invalid token');
    });
  });

  describe('getAccessToken', () => {
    it('should return token from memory if valid', () => {
      TokenService.setAccessToken(mockToken, false);
      expect(TokenService.getAccessToken()).toBe(mockToken);
    });

    it('should return null if no token stored', () => {
      expect(TokenService.getAccessToken()).toBeNull();
    });

    it('should retrieve and decrypt token from sessionStorage', () => {
      const storedToken = {
        value: 'encrypted',
        fingerprint: 'fingerprint',
        issuedAt: Date.now() - 1000,
        expiresAt: Date.now() + 3600000,
      };
      
      sessionStorage.setItem('ncq_access_token', JSON.stringify(storedToken));
      
      // Mock decrypt to return the mock token
      (CryptoJS.AES.decrypt as jest.Mock).mockReturnValue({
        toString: () => mockToken,
      });
      
      const token = TokenService.getAccessToken();
      expect(token).toBe(mockToken);
    });

    it('should return null for expired token in storage', () => {
      const storedToken = {
        value: 'encrypted',
        fingerprint: 'fingerprint',
        issuedAt: Date.now() - 7200000,
        expiresAt: Date.now() - 3600000, // Expired
      };
      
      sessionStorage.setItem('ncq_access_token', JSON.stringify(storedToken));
      expect(TokenService.getAccessToken()).toBeNull();
    });
  });

  describe('setRefreshToken', () => {
    it('should store encrypted refresh token in localStorage', () => {
      TokenService.setRefreshToken(mockToken);
      
      const storedData = localStorage.getItem('ncq_refresh_token');
      expect(storedData).toBeTruthy();
      
      const parsed = JSON.parse(storedData!);
      expect(parsed.value).toBe('encrypted');
      expect(parsed.fingerprint).toBe('fingerprint');
    });

    it('should call storeRefreshTokenInCookie', () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      
      TokenService.setRefreshToken(mockToken);
      
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/auth/refresh-token/store',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: mockToken }),
          credentials: 'include',
        })
      );
    });
  });

  describe('clearTokens', () => {
    it('should clear all tokens from storage', () => {
      TokenService.setAccessToken(mockToken, true);
      TokenService.setRefreshToken(mockToken);
      
      TokenService.clearTokens();
      
      expect(TokenService.getAccessToken()).toBeNull();
      expect(sessionStorage.getItem('ncq_access_token')).toBeNull();
      expect(localStorage.getItem('ncq_refresh_token')).toBeNull();
    });

    it('should broadcast logout to other tabs', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      
      TokenService.clearTokens();
      
      expect(setItemSpy).toHaveBeenCalledWith(
        'ncq_token_broadcast',
        expect.stringContaining('"action":"logout"')
      );
    });
  });

  describe('isTokenValid', () => {
    it('should return true for valid token', () => {
      expect(TokenService.isTokenValid(mockToken)).toBe(true);
    });

    it('should return false for null token', () => {
      expect(TokenService.isTokenValid(null)).toBe(false);
    });

    it('should return false for expired token', () => {
      jwtDecode.mockReturnValue({
        ...mockDecodedToken,
        exp: Math.floor(Date.now() / 1000) - 60, // Expired
      });
      
      expect(TokenService.isTokenValid(mockToken)).toBe(false);
    });

    it('should consider 30 second buffer for expiration', () => {
      jwtDecode.mockReturnValue({
        ...mockDecodedToken,
        exp: Math.floor(Date.now() / 1000) + 20, // Expires in 20 seconds
      });
      
      expect(TokenService.isTokenValid(mockToken)).toBe(false);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh token successfully', async () => {
      // Set refresh token
      TokenService.setRefreshToken(mockToken);
      
      // Mock decrypt to return the refresh token
      (CryptoJS.AES.decrypt as jest.Mock).mockReturnValue({
        toString: () => mockToken,
      });
      
      // Mock refresh API response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          },
        }),
      });
      
      const newToken = await TokenService.refreshAccessToken();
      
      expect(newToken).toBe('new-access-token');
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/auth/refresh',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ refreshToken: mockToken }),
        })
      );
    });

    it('should prevent concurrent refresh requests', async () => {
      TokenService.setRefreshToken(mockToken);
      
      (CryptoJS.AES.decrypt as jest.Mock).mockReturnValue({
        toString: () => mockToken,
      });
      
      let resolveRefresh: (value: any) => void;
      const refreshPromise = new Promise(resolve => {
        resolveRefresh = resolve;
      });
      
      (global.fetch as jest.Mock).mockReturnValue(refreshPromise);
      
      // Start two refresh requests
      const refresh1 = TokenService.refreshAccessToken();
      const refresh2 = TokenService.refreshAccessToken();
      
      // Resolve the refresh
      resolveRefresh!({
        ok: true,
        json: async () => ({
          data: {
            accessToken: 'new-token',
            refreshToken: 'new-refresh',
          },
        }),
      });
      
      const [token1, token2] = await Promise.all([refresh1, refresh2]);
      
      // Both should return the same token
      expect(token1).toBe('new-token');
      expect(token2).toBe('new-token');
      
      // Fetch should only be called once
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should clear tokens on refresh failure', async () => {
      TokenService.setRefreshToken(mockToken);
      
      (CryptoJS.AES.decrypt as jest.Mock).mockReturnValue({
        toString: () => mockToken,
      });
      
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      await expect(TokenService.refreshAccessToken()).rejects.toThrow();
      expect(TokenService.getAccessToken()).toBeNull();
    });
  });

  describe('cross-tab synchronization', () => {
    it('should handle logout broadcast from other tabs', () => {
      // Set token
      TokenService.setAccessToken(mockToken, true);
      
      // Mock location.href
      delete (window as any).location;
      (window as any).location = { href: '' };
      
      // Simulate storage event
      const event = new StorageEvent('storage', {
        key: 'ncq_token_broadcast',
        newValue: JSON.stringify({ action: 'logout', timestamp: Date.now() }),
      });
      
      window.dispatchEvent(event);
      
      expect(TokenService.getAccessToken()).toBeNull();
      expect(window.location.href).toBe('/login');
    });

    it('should handle refresh broadcast from other tabs', () => {
      const callback = jest.fn();
      TokenService.onTokenRefresh(callback);
      
      // Set token in storage
      const storedToken = {
        value: 'encrypted',
        fingerprint: 'fingerprint',
        issuedAt: Date.now() - 1000,
        expiresAt: Date.now() + 3600000,
      };
      sessionStorage.setItem('ncq_access_token', JSON.stringify(storedToken));
      
      (CryptoJS.AES.decrypt as jest.Mock).mockReturnValue({
        toString: () => mockToken,
      });
      
      // Simulate storage event
      const event = new StorageEvent('storage', {
        key: 'ncq_token_broadcast',
        newValue: JSON.stringify({ action: 'refresh', timestamp: Date.now() }),
      });
      
      window.dispatchEvent(event);
      
      expect(callback).toHaveBeenCalledWith(mockToken);
    });
  });

  describe('onTokenRefresh', () => {
    it('should register and unregister callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      const unsubscribe1 = TokenService.onTokenRefresh(callback1);
      TokenService.onTokenRefresh(callback2);
      
      TokenService.setAccessToken(mockToken, false);
      
      expect(callback1).toHaveBeenCalledWith(mockToken);
      expect(callback2).toHaveBeenCalledWith(mockToken);
      
      // Unsubscribe first callback
      unsubscribe1();
      
      TokenService.setAccessToken('new-token', false);
      
      expect(callback1).toHaveBeenCalledTimes(1); // Not called again
      expect(callback2).toHaveBeenCalledTimes(2); // Called again
    });
  });

  describe('getTokenExpiryTime', () => {
    it('should return time until token expires', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      jwtDecode.mockReturnValue({
        ...mockDecodedToken,
        exp: futureExp,
      });
      
      const expiryTime = TokenService.getTokenExpiryTime(mockToken);
      expect(expiryTime).toBeGreaterThan(3590000); // Close to 1 hour
      expect(expiryTime).toBeLessThan(3610000);
    });

    it('should return 0 for expired token', () => {
      jwtDecode.mockReturnValue({
        ...mockDecodedToken,
        exp: Math.floor(Date.now() / 1000) - 60, // Expired
      });
      
      expect(TokenService.getTokenExpiryTime(mockToken)).toBe(0);
    });
  });
});