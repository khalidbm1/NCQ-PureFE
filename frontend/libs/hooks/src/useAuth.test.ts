import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock axios
jest.mock('axios');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should login successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@ncq.sa',
      firstName: 'Test',
      lastName: 'User',
    };

    const axios = require('axios');
    axios.post = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          user: mockUser,
          token: 'mock-token',
        },
      },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.login({
        email: 'test@ncq.sa',
        password: 'Test123!@#',
      });
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(localStorage.getItem('auth-token')).toBe('mock-token');
    });
  });

  it('should handle login error', async () => {
    const axios = require('axios');
    axios.post = jest.fn().mockRejectedValue({
      response: {
        data: {
          success: false,
          error: {
            description: 'Invalid credentials',
          },
        },
      },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.login({
          email: 'test@ncq.sa',
          password: 'wrong',
        });
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should logout successfully', async () => {
    // Set initial auth state
    const mockUser = { id: '1', email: 'test@ncq.sa' };
    localStorage.setItem('auth-token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth-token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should register successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'new@ncq.sa',
      firstName: 'New',
      lastName: 'User',
    };

    const axios = require('axios');
    axios.post = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          user: mockUser,
          token: 'mock-token',
        },
      },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.register({
        email: 'new@ncq.sa',
        password: 'Test123!@#',
        firstName: 'New',
        lastName: 'User',
        phoneNumber: '0501234567',
      });
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('should restore session from localStorage', () => {
    const mockUser = { id: '1', email: 'test@ncq.sa' };
    localStorage.setItem('auth-token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
});