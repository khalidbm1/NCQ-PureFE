// Mock API for demo purposes
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create a mock axios instance
const mockApi = {
  post: async (url: string, data?: any) => {
    // Mock login
    if (url === '/auth/login' && data?.email === 'admin@hospital.com' && data?.password === 'admin123') {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return {
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
    }
    
    // Default to real axios for other requests
    return axios.post(API_BASE_URL + url, data);
  },
  
  get: async (url: string, config?: any) => {
    const token = localStorage.getItem('token');
    
    // If we have a mock token, return mock data
    if (token?.startsWith('mock-jwt-token-')) {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
      
      // Mock responses for different endpoints
      if (url.includes('/patients')) {
        return { data: { data: [], total: 0, page: 1, per_page: 10 } };
      }
      if (url.includes('/doctors')) {
        return { data: { data: [], total: 0, page: 1, per_page: 10 } };
      }
      if (url.includes('/appointments')) {
        return { data: { data: [], total: 0, page: 1, per_page: 10 } };
      }
      if (url.includes('/prescriptions')) {
        return { data: { data: [], total: 0, page: 1, per_page: 10 } };
      }
      
      // Default empty response
      return { data: {} };
    }
    
    // Default to real axios
    return axios.get(API_BASE_URL + url, config);
  },
  
  put: async (url: string, data?: any) => {
    const token = localStorage.getItem('token');
    if (token?.startsWith('mock-jwt-token-')) {
      return { data: { ...data, id: Date.now() } };
    }
    return axios.put(API_BASE_URL + url, data);
  },
  
  delete: async (url: string) => {
    const token = localStorage.getItem('token');
    if (token?.startsWith('mock-jwt-token-')) {
      return { data: { success: true } };
    }
    return axios.delete(API_BASE_URL + url);
  },
  
  patch: async (url: string, data?: any) => {
    const token = localStorage.getItem('token');
    if (token?.startsWith('mock-jwt-token-')) {
      return { data: { ...data, id: Date.now() } };
    }
    return axios.patch(API_BASE_URL + url, data);
  },
  
  // Add interceptors property to match axios interface
  interceptors: {
    request: {
      use: () => {},
    },
    response: {
      use: () => {},
    },
  },
  
  // Add other axios properties
  create: () => mockApi,
  defaults: {},
};

export default mockApi;