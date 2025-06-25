/**
 * Smart Building IoT Service
 * Handles all IoT device communication and management
 */

import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { 
  IoTDevice, 
  DeviceStatus, 
  SmartSpace, 
  AccessLog,
  ParkingSpace,
  CheckInOut,
  SmartBathroom,
  AutomationRule,
  BuildingAnalytics,
  Location,
  AreaType,
  MaintenanceRecord
} from '@/types/iot';

export class IoTService {
  private socket: Socket | null = null;
  private apiUrl: string;
  private token: string | null = null;
  private deviceCache: Map<string, IoTDevice> = new Map();
  private subscriptions: Map<string, (data: any) => void> = new Map();

  constructor(apiUrl: string = process.env.NEXT_PUBLIC_IOT_API_URL || 'http://localhost:8007') {
    this.apiUrl = apiUrl;
  }

  // Initialize WebSocket connection
  async connect(token: string): Promise<void> {
    this.token = token;
    
    this.socket = io(this.apiUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('Connected to IoT service');
      this.onConnect();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from IoT service');
    });

    this.socket.on('device:update', (data) => {
      this.handleDeviceUpdate(data);
    });

    this.socket.on('room:update', (data) => {
      this.handleRoomUpdate(data);
    });

    this.socket.on('alert', (data) => {
      this.handleAlert(data);
    });

    return new Promise((resolve) => {
      this.socket!.on('connect', resolve);
    });
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Device Management
  async getDevices(filters?: {
    location?: Location;
    type?: string;
    status?: DeviceStatus;
  }): Promise<IoTDevice[]> {
    const response = await this.api.get('/devices', { params: filters });
    return response.data;
  }

  async getDevice(deviceId: string): Promise<IoTDevice> {
    const cached = this.deviceCache.get(deviceId);
    if (cached) return cached;

    const response = await this.api.get(`/devices/${deviceId}`);
    this.deviceCache.set(deviceId, response.data);
    return response.data;
  }

  async updateDevice(deviceId: string, updates: Partial<IoTDevice>): Promise<IoTDevice> {
    const response = await this.api.patch(`/devices/${deviceId}`, updates);
    this.deviceCache.set(deviceId, response.data);
    return response.data;
  }

  async controlDevice(deviceId: string, command: any): Promise<void> {
    await this.api.post(`/devices/${deviceId}/control`, command);
  }

  // Room Management
  async getRooms(floor?: number): Promise<SmartSpace[]> {
    const response = await this.api.get('/rooms', { params: { floor } });
    return response.data;
  }

  async getRoom(roomId: string): Promise<SmartSpace> {
    const response = await this.api.get(`/rooms/${roomId}`);
    return response.data;
  }

  async updateRoomEnvironment(roomId: string, settings: {
    temperature?: number;
    humidity?: number;
    lighting?: number;
  }): Promise<void> {
    await this.api.post(`/rooms/${roomId}/environment`, settings);
  }

  async bookRoom(roomId: string, booking: {
    startTime: Date;
    endTime: Date;
    userId: string;
    purpose?: string;
  }): Promise<string> {
    const response = await this.api.post(`/rooms/${roomId}/book`, booking);
    return response.data.bookingId;
  }

  // Access Control
  async getAccessLogs(filters?: {
    userId?: string;
    location?: Location;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<AccessLog[]> {
    const response = await this.api.get('/access/logs', { params: filters });
    return response.data;
  }

  async grantAccess(userId: string, permissions: {
    areas: string[];
    level: string;
    validUntil: Date;
  }): Promise<void> {
    await this.api.post('/access/grant', { userId, ...permissions });
  }

  async revokeAccess(userId: string, areas?: string[]): Promise<void> {
    await this.api.post('/access/revoke', { userId, areas });
  }

  async openDoor(doorId: string, override?: boolean): Promise<void> {
    await this.api.post(`/access/doors/${doorId}/open`, { override });
  }

  // Parking Management
  async getParkingSpaces(level?: string): Promise<ParkingSpace[]> {
    const response = await this.api.get('/parking/spaces', { params: { level } });
    return response.data;
  }

  async reserveParking(spaceId: string, reservation: {
    userId: string;
    vehicleInfo: any;
    startTime: Date;
    endTime: Date;
  }): Promise<string> {
    const response = await this.api.post(`/parking/spaces/${spaceId}/reserve`, reservation);
    return response.data.reservationId;
  }

  async findAvailableParking(criteria?: {
    type?: string;
    nearestTo?: Location;
  }): Promise<ParkingSpace[]> {
    const response = await this.api.get('/parking/available', { params: criteria });
    return response.data;
  }

  // Check-in/Check-out
  async checkIn(data: {
    userId: string;
    method: string;
    location: Location;
    details?: any;
  }): Promise<CheckInOut> {
    const response = await this.api.post('/checkin', data);
    return response.data;
  }

  async checkOut(checkInId: string): Promise<CheckInOut> {
    const response = await this.api.post(`/checkout/${checkInId}`);
    return response.data;
  }

  async getCheckInStatus(userId: string): Promise<CheckInOut | null> {
    const response = await this.api.get(`/checkin/status/${userId}`);
    return response.data;
  }

  // Bathroom Management
  async getBathrooms(floor?: number): Promise<SmartBathroom[]> {
    const response = await this.api.get('/bathrooms', { params: { floor } });
    return response.data;
  }

  async reportBathroomIssue(bathroomId: string, issue: {
    type: string;
    description: string;
    urgent: boolean;
  }): Promise<void> {
    await this.api.post(`/bathrooms/${bathroomId}/report`, issue);
  }

  async requestCleaning(bathroomId: string, priority: string): Promise<void> {
    await this.api.post(`/bathrooms/${bathroomId}/clean`, { priority });
  }

  // Automation
  async getAutomationRules(): Promise<AutomationRule[]> {
    const response = await this.api.get('/automation/rules');
    return response.data;
  }

  async createAutomationRule(rule: Omit<AutomationRule, 'id'>): Promise<AutomationRule> {
    const response = await this.api.post('/automation/rules', rule);
    return response.data;
  }

  async updateAutomationRule(ruleId: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    const response = await this.api.patch(`/automation/rules/${ruleId}`, updates);
    return response.data;
  }

  async deleteAutomationRule(ruleId: string): Promise<void> {
    await this.api.delete(`/automation/rules/${ruleId}`);
  }

  async testAutomationRule(ruleId: string): Promise<{ success: boolean; logs: string[] }> {
    const response = await this.api.post(`/automation/rules/${ruleId}/test`);
    return response.data;
  }

  // Analytics
  async getBuildingAnalytics(timeRange?: {
    start: Date;
    end: Date;
  }): Promise<BuildingAnalytics> {
    const response = await this.api.get('/analytics/building', { params: timeRange });
    return response.data;
  }

  async getOccupancyHeatmap(floor?: number): Promise<any> {
    const response = await this.api.get('/analytics/occupancy/heatmap', { params: { floor } });
    return response.data;
  }

  async getEnergyConsumption(timeRange?: {
    start: Date;
    end: Date;
    groupBy?: 'hour' | 'day' | 'week' | 'month';
  }): Promise<any> {
    const response = await this.api.get('/analytics/energy', { params: timeRange });
    return response.data;
  }

  // Maintenance
  async reportMaintenance(report: {
    location: Location;
    type: string;
    description: string;
    priority: string;
    deviceId?: string;
  }): Promise<MaintenanceRecord> {
    const response = await this.api.post('/maintenance/report', report);
    return response.data;
  }

  async getMaintenanceRecords(filters?: {
    status?: string;
    priority?: string;
    location?: Location;
  }): Promise<MaintenanceRecord[]> {
    const response = await this.api.get('/maintenance/records', { params: filters });
    return response.data;
  }

  // Real-time subscriptions
  subscribe(event: string, callback: (data: any) => void): void {
    if (!this.socket) throw new Error('Not connected to IoT service');
    
    this.subscriptions.set(event, callback);
    this.socket.on(event, callback);
  }

  unsubscribe(event: string): void {
    if (!this.socket) return;
    
    const callback = this.subscriptions.get(event);
    if (callback) {
      this.socket.off(event, callback);
      this.subscriptions.delete(event);
    }
  }

  // Subscribe to specific areas
  subscribeToArea(areaType: AreaType, areaId: string): void {
    if (!this.socket) throw new Error('Not connected to IoT service');
    
    this.socket.emit('subscribe:area', { areaType, areaId });
  }

  unsubscribeFromArea(areaType: AreaType, areaId: string): void {
    if (!this.socket) return;
    
    this.socket.emit('unsubscribe:area', { areaType, areaId });
  }

  // Emergency functions
  async triggerEmergency(location: Location, type: 'fire' | 'medical' | 'security'): Promise<void> {
    await this.api.post('/emergency/trigger', { location, type });
  }

  async evacuateBuilding(): Promise<void> {
    await this.api.post('/emergency/evacuate');
  }

  async lockdownArea(area: Location): Promise<void> {
    await this.api.post('/emergency/lockdown', { area });
  }

  // Helper methods
  private get api() {
    return axios.create({
      baseURL: `${this.apiUrl}/api/v1`,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  private onConnect(): void {
    // Re-subscribe to events after reconnection
    this.subscriptions.forEach((callback, event) => {
      this.socket!.on(event, callback);
    });
  }

  private handleDeviceUpdate(data: any): void {
    const device = data as IoTDevice;
    this.deviceCache.set(device.id, device);
  }

  private handleRoomUpdate(data: any): void {
    // Handle room updates
    console.log('Room update:', data);
  }

  private handleAlert(data: any): void {
    // Handle alerts
    console.log('Alert:', data);
  }
}

// Singleton instance
let iotService: IoTService | null = null;

export function getIoTService(): IoTService {
  if (!iotService) {
    iotService = new IoTService();
  }
  return iotService;
}

// Export utility functions
export async function findNearestAvailable(
  type: 'bathroom' | 'parking' | 'room',
  currentLocation: Location
): Promise<any> {
  const service = getIoTService();
  
  switch (type) {
    case 'bathroom':
      const bathrooms = await service.getBathrooms(currentLocation.floor);
      return bathrooms
        .filter(b => b.status === 'available')
        .sort((a, b) => calculateDistance(currentLocation, a.location) - calculateDistance(currentLocation, b.location))[0];
    
    case 'parking':
      return (await service.findAvailableParking({ nearestTo: currentLocation }))[0];
    
    case 'room':
      const rooms = await service.getRooms(currentLocation.floor);
      return rooms
        .filter(r => r.status === 'available')
        .sort((a, b) => calculateDistance(currentLocation, { 
          building: currentLocation.building, 
          floor: a.floor, 
          area: AreaType.ROOM, 
          zone: a.spaceNumber 
        }) - calculateDistance(currentLocation, {
          building: currentLocation.building,
          floor: b.floor,
          area: AreaType.ROOM,
          zone: b.spaceNumber
        }))[0];
  }
}

function calculateDistance(loc1: Location, loc2: Location): number {
  if (!loc1.coordinates || !loc2.coordinates) return Infinity;
  
  const dx = loc1.coordinates.x - loc2.coordinates.x;
  const dy = loc1.coordinates.y - loc2.coordinates.y;
  const dz = (loc1.coordinates.z || 0) - (loc2.coordinates.z || 0);
  
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}