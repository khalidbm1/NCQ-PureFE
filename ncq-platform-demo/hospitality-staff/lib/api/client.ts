import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@/lib/stores/authStore'
import toast from 'react-hot-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to perform this action')
        } else if (error.response?.status === 500) {
          toast.error('Server error. Please try again later.')
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  auth = {
    login: (email: string, password: string) =>
      this.client.post('/auth/login', { email, password }),
    logout: () => this.client.post('/auth/logout'),
    me: () => this.client.get('/auth/me'),
    refreshToken: () => this.client.post('/auth/refresh'),
  }

  // Dashboard endpoints
  dashboard = {
    getMetrics: () => this.client.get('/dashboard/metrics'),
    getRecentActivity: () => this.client.get('/dashboard/activity'),
    getAlerts: () => this.client.get('/dashboard/alerts'),
  }

  // Room endpoints
  rooms = {
    getAll: (params?: any) => this.client.get('/rooms', { params }),
    getById: (id: string) => this.client.get(`/rooms/${id}`),
    create: (data: any) => this.client.post('/rooms', data),
    update: (id: string, data: any) => this.client.put(`/rooms/${id}`, data),
    updateStatus: (id: string, status: string) =>
      this.client.patch(`/rooms/${id}/status`, { status }),
    delete: (id: string) => this.client.delete(`/rooms/${id}`),
  }

  // Guest endpoints
  guests = {
    getAll: (params?: any) => this.client.get('/guests', { params }),
    getById: (id: string) => this.client.get(`/guests/${id}`),
    create: (data: any) => this.client.post('/guests', data),
    update: (id: string, data: any) => this.client.put(`/guests/${id}`, data),
    getHistory: (id: string) => this.client.get(`/guests/${id}/history`),
    getPreferences: (id: string) => this.client.get(`/guests/${id}/preferences`),
  }

  // Reservation endpoints
  reservations = {
    getAll: (params?: any) => this.client.get('/reservations', { params }),
    getById: (id: string) => this.client.get(`/reservations/${id}`),
    create: (data: any) => this.client.post('/reservations', data),
    update: (id: string, data: any) => this.client.put(`/reservations/${id}`, data),
    checkIn: (id: string) => this.client.post(`/reservations/${id}/check-in`),
    checkOut: (id: string) => this.client.post(`/reservations/${id}/check-out`),
    cancel: (id: string, reason: string) =>
      this.client.post(`/reservations/${id}/cancel`, { reason }),
  }

  // Housekeeping endpoints
  housekeeping = {
    getTasks: (params?: any) => this.client.get('/housekeeping/tasks', { params }),
    getTaskById: (id: string) => this.client.get(`/housekeeping/tasks/${id}`),
    createTask: (data: any) => this.client.post('/housekeeping/tasks', data),
    updateTask: (id: string, data: any) =>
      this.client.put(`/housekeeping/tasks/${id}`, data),
    assignTask: (id: string, userId: string) =>
      this.client.post(`/housekeeping/tasks/${id}/assign`, { userId }),
    completeTask: (id: string, notes?: string) =>
      this.client.post(`/housekeeping/tasks/${id}/complete`, { notes }),
    getSchedule: (date?: string) =>
      this.client.get('/housekeeping/schedule', { params: { date } }),
  }

  // Maintenance endpoints
  maintenance = {
    getRequests: (params?: any) => this.client.get('/maintenance/requests', { params }),
    getRequestById: (id: string) => this.client.get(`/maintenance/requests/${id}`),
    createRequest: (data: any) => this.client.post('/maintenance/requests', data),
    updateRequest: (id: string, data: any) =>
      this.client.put(`/maintenance/requests/${id}`, data),
    assignRequest: (id: string, technicianId: string) =>
      this.client.post(`/maintenance/requests/${id}/assign`, { technicianId }),
    completeRequest: (id: string, data: any) =>
      this.client.post(`/maintenance/requests/${id}/complete`, data),
    getWorkOrders: () => this.client.get('/maintenance/work-orders'),
  }

  // Inventory endpoints
  inventory = {
    getItems: (params?: any) => this.client.get('/inventory/items', { params }),
    getItemById: (id: string) => this.client.get(`/inventory/items/${id}`),
    createItem: (data: any) => this.client.post('/inventory/items', data),
    updateItem: (id: string, data: any) =>
      this.client.put(`/inventory/items/${id}`, data),
    adjustQuantity: (id: string, quantity: number, reason: string) =>
      this.client.post(`/inventory/items/${id}/adjust`, { quantity, reason }),
    getLowStock: () => this.client.get('/inventory/low-stock'),
    getUsageReport: (startDate: string, endDate: string) =>
      this.client.get('/inventory/usage', { params: { startDate, endDate } }),
  }

  // IoT endpoints
  iot = {
    getDevices: (params?: any) => this.client.get('/iot/devices', { params }),
    getDeviceById: (id: string) => this.client.get(`/iot/devices/${id}`),
    getDeviceData: (id: string, timeframe?: string) =>
      this.client.get(`/iot/devices/${id}/data`, { params: { timeframe } }),
    updateDevice: (id: string, data: any) =>
      this.client.put(`/iot/devices/${id}`, data),
    sendCommand: (id: string, command: any) =>
      this.client.post(`/iot/devices/${id}/command`, command),
    getAlerts: () => this.client.get('/iot/alerts'),
    acknowledgeAlert: (id: string) => this.client.post(`/iot/alerts/${id}/acknowledge`),
  }

  // Analytics endpoints
  analytics = {
    getOccupancy: (startDate: string, endDate: string) =>
      this.client.get('/analytics/occupancy', { params: { startDate, endDate } }),
    getRevenue: (startDate: string, endDate: string) =>
      this.client.get('/analytics/revenue', { params: { startDate, endDate } }),
    getPerformance: (type: string, period: string) =>
      this.client.get('/analytics/performance', { params: { type, period } }),
    getGuestSatisfaction: () => this.client.get('/analytics/satisfaction'),
    generateReport: (type: string, params: any) =>
      this.client.post('/analytics/reports', { type, ...params }),
  }

  // User endpoints
  users = {
    getAll: (params?: any) => this.client.get('/users', { params }),
    getById: (id: string) => this.client.get(`/users/${id}`),
    create: (data: any) => this.client.post('/users', data),
    update: (id: string, data: any) => this.client.put(`/users/${id}`, data),
    updateStatus: (id: string, isActive: boolean) =>
      this.client.patch(`/users/${id}/status`, { isActive }),
    getPermissions: (id: string) => this.client.get(`/users/${id}/permissions`),
    updatePermissions: (id: string, permissions: string[]) =>
      this.client.put(`/users/${id}/permissions`, { permissions }),
  }
}

export const apiClient = new ApiClient()