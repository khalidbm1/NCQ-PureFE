import axios from 'axios';
import { store } from '../store';
import { refreshToken } from '../store/slices/authSlice';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // For demo: intercept login requests
    if (config.url?.includes('/auth/login') && config.method === 'post') {
      const data = JSON.parse(config.data || '{}');
      if (data.email === 'admin@hospital.com' && data.password === 'admin123') {
        // Cancel the real request and return mock data
        const mockResponse = {
          data: {
            access_token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 'admin-1',
              email: data.email,
              first_name: 'Admin',
              last_name: 'User',
              role: 'hospital_admin',
              tenant_id: 'default',
              full_name: 'Admin User',
              is_active: true
            },
            tenant: {
              subdomain: data.subdomain || 'default',
              name: 'Default Hospital'
            }
          }
        };
        
        // Return a rejected promise with our mock data
        return Promise.reject({
          config,
          response: mockResponse,
          isAxiosError: false,
          isMockLogin: true
        });
      }
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add tenant subdomain header if available
    const subdomain = localStorage.getItem('subdomain') || 'default';
    config.headers['X-Tenant-ID'] = subdomain;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // For demo purposes, bypass 401 errors if we have a mock token
    const token = localStorage.getItem('token');
    if (error.response?.status === 401 && token && token.startsWith('mock-jwt-token-')) {
      // Return mock data based on the endpoint
      const url = originalRequest.url;
      
      // Mock responses for common endpoints
      if (url.includes('/patients')) {
        return { data: { data: [], total: 0, page: 1, per_page: 10 } };
      }
      if (url.includes('/doctors')) {
        return { data: { data: [], total: 0, page: 1, per_page: 10 } };
      }
      if (url.includes('/appointments')) {
        return { data: { data: [], total: 0, page: 1, per_page: 10 } };
      }
      
      // Return empty success for other endpoints
      return { data: {} };
    }
    
    if (error.response?.status === 401 && !originalRequest._retry && !token?.startsWith('mock-jwt-token-')) {
      originalRequest._retry = true;
      
      try {
        await store.dispatch(refreshToken());
        const newToken = store.getState().auth.token;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;