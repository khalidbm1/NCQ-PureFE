import { config } from './config';
import { httpClient } from './auth';
import { 
  Guest, 
  Booking, 
  Room, 
  Device, 
  ServiceRequest, 
  Payment, 
  Notification,
  CheckInData,
  CheckOutData,
  DeviceCommand,
  RoomService,
  ApiResponse,
  PaginatedResponse 
} from '@/types';
import { mockApiClient } from './mockApiClient';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  // Helper method to handle API responses
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  }

  // Authentication endpoints
  async getCurrentUser(): Promise<ApiResponse<Guest>> {
    const response = await httpClient.get(`${this.baseUrl}${config.endpoints.auth.profile}`);
    return this.handleResponse<Guest>(response);
  }

  // Guest endpoints
  async getGuestProfile(): Promise<ApiResponse<Guest>> {
    const response = await httpClient.get(`${this.baseUrl}${config.endpoints.guests.profile}`);
    return this.handleResponse<Guest>(response);
  }

  async updateGuestProfile(profileData: Partial<Guest>): Promise<ApiResponse<Guest>> {
    const response = await httpClient.put(`${this.baseUrl}${config.endpoints.guests.profile}`, profileData);
    return this.handleResponse<Guest>(response);
  }

  async updateGuestPreferences(preferences: Partial<Guest['preferences']>): Promise<ApiResponse<Guest['preferences']>> {
    const response = await httpClient.put(`${this.baseUrl}${config.endpoints.guests.preferences}`, preferences);
    return this.handleResponse<Guest['preferences']>(response);
  }

  // Booking endpoints
  async getCurrentBooking(): Promise<ApiResponse<Booking>> {
    const response = await httpClient.get(`${this.baseUrl}${config.endpoints.bookings.current}`);
    return this.handleResponse<Booking>(response);
  }

  async getGuestBookings(): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    const response = await httpClient.get(`${this.baseUrl}${config.endpoints.guests.bookings}`);
    return this.handleResponse<PaginatedResponse<Booking>>(response);
  }

  async checkIn(checkInData: CheckInData): Promise<ApiResponse<Booking>> {
    const response = await httpClient.post(`${this.baseUrl}${config.endpoints.bookings.checkin}`, checkInData);
    return this.handleResponse<Booking>(response);
  }

  async checkOut(checkOutData: CheckOutData): Promise<ApiResponse<Booking>> {
    const response = await httpClient.post(`${this.baseUrl}${config.endpoints.bookings.checkout}`, checkOutData);
    return this.handleResponse<Booking>(response);
  }

  // Room endpoints
  async getCurrentRoom(): Promise<ApiResponse<Room>> {
    const response = await httpClient.get(`${this.baseUrl}${config.endpoints.rooms.current}`);
    return this.handleResponse<Room>(response);
  }

  async getRoomDevices(roomId: string): Promise<ApiResponse<Device[]>> {
    const response = await httpClient.get(`${this.baseUrl}${config.endpoints.rooms.devices}?roomId=${roomId}`);
    return this.handleResponse<Device[]>(response);
  }

  async controlDevice(command: DeviceCommand): Promise<ApiResponse<Device>> {
    const response = await httpClient.post(`${this.baseUrl}${config.endpoints.rooms.control}`, command);
    return this.handleResponse<Device>(response);
  }

  // Service endpoints
  async getServiceRequests(): Promise<ApiResponse<ServiceRequest[]>> {
    const response = await httpClient.get(`${this.baseUrl}${config.endpoints.services.requests}`);
    return this.handleResponse<ServiceRequest[]>(response);
  }

  async createServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ServiceRequest>> {
    const response = await httpClient.post(`${this.baseUrl}${config.endpoints.services.requests}`, requestData);
    return this.handleResponse<ServiceRequest>(response);
  }

  async updateServiceRequest(requestId: string, updates: Partial<ServiceRequest>): Promise<ApiResponse<ServiceRequest>> {
    const response = await httpClient.put(`${this.baseUrl}${config.endpoints.services.requests}/${requestId}`, updates);
    return this.handleResponse<ServiceRequest>(response);
  }

  async cancelServiceRequest(requestId: string): Promise<ApiResponse<ServiceRequest>> {
    const response = await httpClient.delete(`${this.baseUrl}${config.endpoints.services.requests}/${requestId}`);
    return this.handleResponse<ServiceRequest>(response);
  }

  // Room service menu
  async getRoomServiceMenu(): Promise<ApiResponse<RoomService[]>> {
    const response = await httpClient.get(`${this.baseUrl}${config.endpoints.services.menu}`);
    return this.handleResponse<RoomService[]>(response);
  }

  async placeRoomServiceOrder(orderData: {
    items: Array<{
      serviceId: string;
      quantity: number;
      specialInstructions?: string;
    }>;
    deliveryTime?: string;
    specialRequests?: string;
  }): Promise<ApiResponse<ServiceRequest>> {
    const response = await httpClient.post(`${this.baseUrl}${config.endpoints.services.order}`, orderData);
    return this.handleResponse<ServiceRequest>(response);
  }

  // Payment endpoints
  async createPayment(paymentData: {
    amount: number;
    currency: string;
    method: string;
    serviceRequestId?: string;
    description?: string;
  }): Promise<ApiResponse<{ paymentUrl: string; paymentId: string }>> {
    const response = await httpClient.post(`${this.baseUrl}${config.endpoints.payments.create}`, paymentData);
    return this.handleResponse<{ paymentUrl: string; paymentId: string }>(response);
  }

  async confirmPayment(paymentId: string, paymentDetails: any): Promise<ApiResponse<Payment>> {
    const response = await httpClient.post(`${this.baseUrl}${config.endpoints.payments.confirm}`, {
      paymentId,
      ...paymentDetails,
    });
    return this.handleResponse<Payment>(response);
  }

  async getPaymentHistory(): Promise<ApiResponse<Payment[]>> {
    const response = await httpClient.get(`${this.baseUrl}${config.endpoints.payments.history}`);
    return this.handleResponse<Payment[]>(response);
  }

  // Notification endpoints
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    const response = await httpClient.get(`${this.baseUrl}${config.endpoints.notifications.list}`);
    return this.handleResponse<Notification[]>(response);
  }

  async markNotificationRead(notificationId: string): Promise<ApiResponse<Notification>> {
    const response = await httpClient.put(`${this.baseUrl}${config.endpoints.notifications.markRead}/${notificationId}`);
    return this.handleResponse<Notification>(response);
  }

  async markAllNotificationsRead(): Promise<ApiResponse<{ count: number }>> {
    const response = await httpClient.put(`${this.baseUrl}${config.endpoints.notifications.markRead}/all`);
    return this.handleResponse<{ count: number }>(response);
  }

  // Utility methods
  async uploadFile(file: File, type: 'profile' | 'document' | 'signature'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    return this.handleResponse<{ url: string }>(response);
  }

  async getWeatherInfo(): Promise<ApiResponse<{
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  }>> {
    const response = await httpClient.get(`${this.baseUrl}/api/weather`);
    return this.handleResponse(response);
  }

  // NCQ Payment Gateway integration
  async initiateNCQPayment(paymentData: {
    amount: number;
    currency: string;
    description: string;
    serviceRequestId?: string;
    metadata?: Record<string, any>;
  }): Promise<ApiResponse<{
    paymentId: string;
    redirectUrl: string;
    qrCode?: string;
  }>> {
    const response = await httpClient.post(`${this.baseUrl}/api/payments/ncq/initiate`, paymentData);
    return this.handleResponse(response);
  }

  async verifyNCQPayment(paymentId: string): Promise<ApiResponse<{
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
    amount: number;
    currency: string;
  }>> {
    const response = await httpClient.get(`${this.baseUrl}/api/payments/ncq/verify/${paymentId}`);
    return this.handleResponse(response);
  }

  // Analytics and reporting (for admin/staff views)
  async getGuestAnalytics(): Promise<ApiResponse<{
    totalStay: number;
    servicesUsed: number;
    satisfaction: number;
    loyaltyPoints: number;
    preferredServices: string[];
  }>> {
    const response = await httpClient.get(`${this.baseUrl}/api/analytics/guest`);
    return this.handleResponse(response);
  }

  // Feedback
  async submitFeedback(feedback: {
    rating: number;
    comments: string;
    category: string;
    bookingId?: string;
  }): Promise<ApiResponse<{ id: string }>> {
    const response = await httpClient.post(`${this.baseUrl}/api/feedback`, feedback);
    return this.handleResponse(response);
  }

  // Emergency and urgent requests
  async createEmergencyRequest(emergencyData: {
    type: 'medical' | 'security' | 'fire' | 'maintenance';
    description: string;
    location: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<ApiResponse<ServiceRequest>> {
    const response = await httpClient.post(`${this.baseUrl}/api/emergency`, emergencyData);
    return this.handleResponse(response);
  }
}

// Check if we're in demo mode
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
                  typeof window !== 'undefined' && window.location.search.includes('demo=true');

// Create singleton instance - use mock in demo mode
export const apiClient = isDemoMode ? mockApiClient : new ApiClient();

// Export utility functions
export const formatApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: any): boolean => {
  return error.code === 'NETWORK_ERROR' || error.message?.includes('fetch');
};

export const shouldRetry = (error: any): boolean => {
  const status = error.response?.status;
  return status >= 500 || status === 408 || isNetworkError(error);
};

// Request retry utility
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }
  
  throw lastError;
};