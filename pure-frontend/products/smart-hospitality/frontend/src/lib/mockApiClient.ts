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

import {
  mockGuest,
  mockBooking,
  mockRoom,
  mockServiceRequests,
  mockRoomServiceMenu,
  mockNotifications,
  mockPayments,
  mockWeatherData,
  mockGuestAnalytics,
  createMockResponse,
  createMockPaginatedResponse,
} from './mockData';

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiClient {
  // Authentication endpoints
  async getCurrentUser(): Promise<ApiResponse<Guest>> {
    await delay(300);
    return createMockResponse(mockGuest);
  }

  // Guest endpoints
  async getGuestProfile(): Promise<ApiResponse<Guest>> {
    await delay(300);
    return createMockResponse(mockGuest);
  }

  async updateGuestProfile(profileData: Partial<Guest>): Promise<ApiResponse<Guest>> {
    await delay(500);
    const updatedGuest = { ...mockGuest, ...profileData };
    return createMockResponse(updatedGuest);
  }

  async updateGuestPreferences(preferences: Partial<Guest['preferences']>): Promise<ApiResponse<Guest['preferences']>> {
    await delay(400);
    const updatedPreferences = { ...mockGuest.preferences, ...preferences };
    return createMockResponse(updatedPreferences);
  }

  // Booking endpoints
  async getCurrentBooking(): Promise<ApiResponse<Booking>> {
    await delay(300);
    return createMockResponse(mockBooking);
  }

  async getGuestBookings(): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    await delay(400);
    const bookings = [mockBooking]; // Could add more mock bookings
    return createMockResponse(createMockPaginatedResponse(bookings));
  }

  async checkIn(checkInData: CheckInData): Promise<ApiResponse<Booking>> {
    await delay(1000);
    const checkedInBooking = { 
      ...mockBooking, 
      status: 'checked-in' as const,
      checkedInAt: new Date().toISOString(),
    };
    return createMockResponse(checkedInBooking);
  }

  async checkOut(checkOutData: CheckOutData): Promise<ApiResponse<Booking>> {
    await delay(1000);
    const checkedOutBooking = { 
      ...mockBooking, 
      status: 'checked-out' as const,
      checkedOutAt: new Date().toISOString(),
    };
    return createMockResponse(checkedOutBooking);
  }

  // Room endpoints
  async getCurrentRoom(): Promise<ApiResponse<Room>> {
    await delay(300);
    return createMockResponse(mockRoom);
  }

  async getRoomDevices(roomId: string): Promise<ApiResponse<Device[]>> {
    await delay(400);
    return createMockResponse(mockRoom.devices || []);
  }

  async controlDevice(command: DeviceCommand): Promise<ApiResponse<Device>> {
    await delay(600);
    const device = mockRoom.devices?.find(d => d.id === command.deviceId);
    if (!device) {
      throw new Error('Device not found');
    }
    
    const updatedDevice = {
      ...device,
      currentState: {
        ...device.currentState,
        ...command.action,
      },
      lastUpdated: new Date().toISOString(),
    };
    
    return createMockResponse(updatedDevice);
  }

  // Service endpoints
  async getServiceRequests(): Promise<ApiResponse<ServiceRequest[]>> {
    await delay(400);
    return createMockResponse(mockServiceRequests);
  }

  async createServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ServiceRequest>> {
    await delay(800);
    const newRequest: ServiceRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return createMockResponse(newRequest);
  }

  async updateServiceRequest(requestId: string, updates: Partial<ServiceRequest>): Promise<ApiResponse<ServiceRequest>> {
    await delay(600);
    const request = mockServiceRequests.find(r => r.id === requestId);
    if (!request) {
      throw new Error('Service request not found');
    }
    
    const updatedRequest = {
      ...request,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return createMockResponse(updatedRequest);
  }

  async cancelServiceRequest(requestId: string): Promise<ApiResponse<ServiceRequest>> {
    await delay(600);
    const request = mockServiceRequests.find(r => r.id === requestId);
    if (!request) {
      throw new Error('Service request not found');
    }
    
    const cancelledRequest = {
      ...request,
      status: 'cancelled' as const,
      updatedAt: new Date().toISOString(),
    };
    
    return createMockResponse(cancelledRequest);
  }

  // Room service menu
  async getRoomServiceMenu(): Promise<ApiResponse<RoomService[]>> {
    await delay(500);
    return createMockResponse(mockRoomServiceMenu);
  }

  async placeRoomServiceOrder(orderData: any): Promise<ApiResponse<ServiceRequest>> {
    await delay(1000);
    const newOrder: ServiceRequest = {
      id: `req-${Date.now()}`,
      guestId: mockGuest.id,
      roomId: mockRoom.id,
      type: 'room-service',
      status: 'pending',
      priority: 'normal',
      description: `Room service order`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return createMockResponse(newOrder);
  }

  // Payment endpoints
  async createPayment(paymentData: any): Promise<ApiResponse<{ paymentUrl: string; paymentId: string }>> {
    await delay(800);
    return createMockResponse({
      paymentUrl: `https://payment.ncq.com/pay/${Date.now()}`,
      paymentId: `pay-${Date.now()}`,
    });
  }

  async confirmPayment(paymentId: string, paymentDetails: any): Promise<ApiResponse<Payment>> {
    await delay(1000);
    const newPayment: Payment = {
      id: paymentId,
      bookingId: mockBooking.id,
      guestId: mockGuest.id,
      amount: paymentDetails.amount || 100,
      currency: paymentDetails.currency || 'USD',
      status: 'completed',
      method: paymentDetails.method || 'card',
      description: paymentDetails.description || 'Payment',
      transactionId: `TXN-${Date.now()}`,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };
    return createMockResponse(newPayment);
  }

  async getPaymentHistory(): Promise<ApiResponse<Payment[]>> {
    await delay(400);
    return createMockResponse(mockPayments);
  }

  // Notification endpoints
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    await delay(300);
    return createMockResponse(mockNotifications);
  }

  async markNotificationRead(notificationId: string): Promise<ApiResponse<Notification>> {
    await delay(300);
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    const readNotification = {
      ...notification,
      read: true,
    };
    
    return createMockResponse(readNotification);
  }

  async markAllNotificationsRead(): Promise<ApiResponse<{ count: number }>> {
    await delay(400);
    const unreadCount = mockNotifications.filter(n => !n.read).length;
    return createMockResponse({ count: unreadCount });
  }

  // Utility methods
  async uploadFile(file: File, type: 'profile' | 'document' | 'signature'): Promise<ApiResponse<{ url: string }>> {
    await delay(1500);
    return createMockResponse({
      url: `https://storage.ncq.com/uploads/${type}/${file.name}`,
    });
  }

  async getWeatherInfo(): Promise<ApiResponse<any>> {
    await delay(400);
    return createMockResponse(mockWeatherData);
  }

  // NCQ Payment Gateway integration
  async initiateNCQPayment(paymentData: any): Promise<ApiResponse<any>> {
    await delay(800);
    return createMockResponse({
      paymentId: `ncq-pay-${Date.now()}`,
      redirectUrl: `https://payment.ncq.com/checkout/${Date.now()}`,
      qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
    });
  }

  async verifyNCQPayment(paymentId: string): Promise<ApiResponse<any>> {
    await delay(600);
    return createMockResponse({
      status: 'completed',
      transactionId: `TXN-NCQ-${Date.now()}`,
      amount: 100,
      currency: 'USD',
    });
  }

  // Analytics and reporting
  async getGuestAnalytics(): Promise<ApiResponse<any>> {
    await delay(500);
    return createMockResponse(mockGuestAnalytics);
  }

  // Feedback
  async submitFeedback(feedback: any): Promise<ApiResponse<{ id: string }>> {
    await delay(700);
    return createMockResponse({
      id: `feedback-${Date.now()}`,
    });
  }

  // Emergency and urgent requests
  async createEmergencyRequest(emergencyData: any): Promise<ApiResponse<ServiceRequest>> {
    await delay(300);
    const emergencyRequest: ServiceRequest = {
      id: `emergency-${Date.now()}`,
      guestId: mockGuest.id,
      roomId: mockRoom.id,
      type: 'maintenance',
      status: 'in-progress',
      priority: 'urgent',
      description: emergencyData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return createMockResponse(emergencyRequest);
  }
}

// Create singleton instance
export const mockApiClient = new MockApiClient();

// Export the same utility functions for consistency
export { formatApiError, isNetworkError, shouldRetry, withRetry } from './api';