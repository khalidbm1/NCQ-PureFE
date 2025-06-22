export interface Guest {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  preferences: GuestPreferences;
  profileImage?: string;
  profilePicture?: string;
  loyaltyPoints: number;
  membershipTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyaltyTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  createdAt?: string;
  updatedAt?: string;
}

export interface GuestPreferences {
  language: 'en' | 'ar';
  temperature: number;
  lightingLevel: number;
  wakeUpTime?: string;
  roomServicePreferences: string[];
  dietaryRestrictions: string[];
  smokingPreference: boolean;
  bedType: 'single' | 'double' | 'king' | 'queen';
  pillowType: 'soft' | 'medium' | 'firm';
  newsChannels: string[];
}

export interface Booking {
  id: string;
  guestId: string;
  propertyId?: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  currency: string;
  specialRequests?: string;
  numberOfGuests: number;
  room?: Room;
  property?: Property;
  bookingSource?: string;
  confirmationCode?: string;
  createdAt?: string;
  updatedAt?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  guestName?: string;
  roomNumber?: string;
  roomType?: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  floor: number;
  capacity?: number;
  building?: string;
  amenities: string[];
  currentTemp?: number;
  targetTemp?: number;
  lightingLevel?: number;
  curtainsOpen?: boolean;
  doorLocked?: boolean;
  devices?: Device[];
  status: 'available' | 'occupied' | 'maintenance' | 'housekeeping';
  maxOccupancy?: number;
  size?: number;
  bedConfiguration?: string;
  view?: string;
  images?: string[];
  lastCleaned?: string;
  nextScheduledCleaning?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'light' | 'lighting' | 'thermostat' | 'curtain' | 'curtains' | 'tv' | 'ac' | 'air_conditioner' | 'speaker' | 'safe' | 'minibar' | string;
  status: 'online' | 'offline' | 'error';
  value?: any;
  unit?: string;
  controllable?: boolean;
  roomId: string;
  lastUpdated: string;
  currentState?: any;
  capabilities?: string[];
}

export interface ServiceRequest {
  id: string;
  guestId: string;
  bookingId?: string;
  roomId?: string;
  type: 'housekeeping' | 'room-service' | 'maintenance' | 'concierge' | 'spa' | 'laundry';
  description: string;
  priority: 'low' | 'normal' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  requestedTime?: string;
  estimatedCompletion?: string;
  estimatedCompletionTime?: string;
  cost?: number;
  assignedStaff?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  policies: string[];
}

export interface Payment {
  id: string;
  bookingId?: string;
  guestId?: string;
  serviceRequestId?: string;
  amount: number;
  currency: string;
  method: 'card' | 'cash' | 'points' | 'bank_transfer' | string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  description?: string;
  createdAt: string;
  processedAt?: string;
}

export interface Notification {
  id: string;
  guestId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface CheckInData {
  bookingId: string;
  idDocument?: File;
  signature?: string;
  additionalGuests?: string[];
  specialRequests?: string;
  estimatedArrival?: string;
}

export interface CheckOutData {
  bookingId: string;
  feedback?: {
    rating: number;
    comments: string;
  };
  additionalCharges?: {
    description: string;
    amount: number;
  }[];
  keyCardReturned: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data?: T[];
  items?: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  totalPages?: number;
}

export interface SocketEvent {
  type: 'device_update' | 'service_request_update' | 'notification' | 'room_status_update';
  data: any;
  roomId?: string;
  guestId?: string;
}

export interface DeviceCommand {
  deviceId: string;
  action: any;
  value?: any;
  roomId: string;
}

export interface RoomService {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  category: 'food' | 'beverage' | 'amenity' | 'service' | string;
  available: boolean;
  preparationTime: number; // in minutes
  image?: string;
  dietary?: string[];
  dietaryInfo?: string[];
}

export interface CartItem {
  service: RoomService;
  quantity: number;
  specialInstructions?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'guest' | 'staff' | 'admin';
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  preferences?: Partial<GuestPreferences>;
}