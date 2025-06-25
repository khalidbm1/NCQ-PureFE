import { 
  Guest, 
  Booking, 
  Room, 
  Device, 
  ServiceRequest, 
  Payment, 
  Notification,
  RoomService,
  ApiResponse,
  PaginatedResponse 
} from '@/types';

// Mock Guest Data
export const mockGuest: Guest = {
  id: 'guest-001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1-555-0123',
  dateOfBirth: '1985-03-15',
  nationality: 'USA',
  passportNumber: 'US123456789',
  loyaltyPoints: 2500,
  loyaltyTier: 'Gold',
  preferences: {
    language: 'en',
    temperature: 22,
    lightingLevel: 70,
    roomServicePreferences: ['Breakfast in bed', 'Extra towels'],
    dietaryRestrictions: ['Vegetarian'],
    smokingPreference: false,
    bedType: 'king',
    pillowType: 'soft',
    newsChannels: ['CNN', 'BBC'],
  },
  profilePicture: 'https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

// Mock Booking Data
export const mockBooking: Booking = {
  id: 'booking-001',
  guestId: 'guest-001',
  roomId: 'room-301',
  checkInDate: '2025-01-14',
  checkOutDate: '2025-01-18',
  status: 'checked-in',
  totalAmount: 1200,
  currency: 'USD',
  numberOfGuests: 2,
  specialRequests: 'Late check-out requested',
  bookingSource: 'Direct',
  confirmationCode: 'NCQ-2025-0114',
  createdAt: '2025-01-10T00:00:00Z',
  updatedAt: '2025-01-14T14:00:00Z',
  checkedInAt: '2025-01-14T14:00:00Z',
  guestName: 'John Doe',
  roomNumber: '301',
  roomType: 'Deluxe Suite',
};

// Mock Room Data
export const mockRoom: Room = {
  id: 'room-301',
  number: '301',
  type: 'Deluxe Suite',
  floor: 3,
  building: 'Main Tower',
  status: 'occupied',
  amenities: [
    'Air Conditioning',
    'WiFi',
    'Smart TV',
    'Minibar',
    'Safe',
    'Coffee Machine',
    'Balcony',
    'Ocean View',
    'Smart Controls',
    'Voice Assistant',
  ],
  devices: [
    {
      id: 'dev-001',
      name: 'AC Unit',
      type: 'air_conditioner',
      roomId: 'room-301',
      status: 'online',
      currentState: {
        power: true,
        temperature: 22,
        mode: 'cool',
        fanSpeed: 'medium',
      },
      capabilities: ['temperature', 'mode', 'fan_speed'],
      lastUpdated: '2025-01-14T18:00:00Z',
    },
    {
      id: 'dev-002',
      name: 'Main Lights',
      type: 'lighting',
      roomId: 'room-301',
      status: 'online',
      currentState: {
        power: true,
        brightness: 70,
        color: 'warm',
      },
      capabilities: ['brightness', 'color'],
      lastUpdated: '2025-01-14T18:00:00Z',
    },
    {
      id: 'dev-003',
      name: 'Smart TV',
      type: 'tv',
      roomId: 'room-301',
      status: 'online',
      currentState: {
        power: false,
        volume: 15,
        channel: 'CNN',
      },
      capabilities: ['power', 'volume', 'channel'],
      lastUpdated: '2025-01-14T18:00:00Z',
    },
    {
      id: 'dev-004',
      name: 'Curtains',
      type: 'curtains',
      roomId: 'room-301',
      status: 'online',
      currentState: {
        position: 50,
      },
      capabilities: ['position'],
      lastUpdated: '2025-01-14T18:00:00Z',
    },
  ],
  maxOccupancy: 4,
  size: 65,
  bedConfiguration: '1 King Bed',
  view: 'Ocean',
  images: [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
  ],
  lastCleaned: '2025-01-14T10:00:00Z',
  nextScheduledCleaning: '2025-01-15T10:00:00Z',
};

// Mock Service Requests
export const mockServiceRequests: ServiceRequest[] = [
  {
    id: 'req-001',
    guestId: 'guest-001',
    roomId: 'room-301',
    type: 'room-service',
    status: 'completed',
    priority: 'normal',
    description: 'Breakfast order - Continental breakfast with orange juice',
    createdAt: '2025-01-14T08:00:00Z',
    updatedAt: '2025-01-14T08:45:00Z',
    completedAt: '2025-01-14T08:45:00Z',
    assignedTo: 'Staff Member 1',
    notes: 'Delivered on time',
  },
  {
    id: 'req-002',
    guestId: 'guest-001',
    roomId: 'room-301',
    type: 'housekeeping',
    status: 'in-progress',
    priority: 'normal',
    description: 'Please clean the room and replace towels',
    createdAt: '2025-01-14T14:30:00Z',
    updatedAt: '2025-01-14T15:00:00Z',
    assignedTo: 'Housekeeping Team A',
    estimatedCompletionTime: '2025-01-14T16:00:00Z',
  },
  {
    id: 'req-003',
    guestId: 'guest-001',
    roomId: 'room-301',
    type: 'concierge',
    status: 'pending',
    priority: 'low',
    description: 'Restaurant reservation for 2 at 7 PM tonight',
    createdAt: '2025-01-14T17:00:00Z',
    updatedAt: '2025-01-14T17:00:00Z',
  },
];

// Mock Room Service Menu
export const mockRoomServiceMenu: RoomService[] = [
  {
    id: 'menu-001',
    category: 'Breakfast',
    name: 'Continental Breakfast',
    description: 'Fresh croissants, bread, butter, jam, orange juice, and coffee',
    price: 25,
    currency: 'USD',
    available: true,
    preparationTime: 30,
    dietaryInfo: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
  },
  {
    id: 'menu-002',
    category: 'Breakfast',
    name: 'American Breakfast',
    description: 'Eggs, bacon, toast, hash browns, and coffee',
    price: 30,
    currency: 'USD',
    available: true,
    preparationTime: 35,
    dietaryInfo: [],
    image: 'https://images.unsplash.com/photo-1533920379810-6bedac961555?w=400',
  },
  {
    id: 'menu-003',
    category: 'Lunch',
    name: 'Club Sandwich',
    description: 'Triple-decker sandwich with chicken, bacon, lettuce, and tomato',
    price: 22,
    currency: 'USD',
    available: true,
    preparationTime: 25,
    dietaryInfo: [],
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
  },
  {
    id: 'menu-004',
    category: 'Dinner',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with vegetables and lemon butter sauce',
    price: 45,
    currency: 'USD',
    available: true,
    preparationTime: 40,
    dietaryInfo: ['Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    guestId: 'guest-001',
    type: 'info',
    title: 'Welcome to NCQ Hotel',
    message: 'We hope you enjoy your stay. If you need anything, please don\'t hesitate to ask.',
    read: true,
    createdAt: '2025-01-14T14:00:00Z',
  },
  {
    id: 'notif-002',
    guestId: 'guest-001',
    type: 'success',
    title: 'Room Service Delivered',
    message: 'Your breakfast has been delivered. Enjoy your meal!',
    read: true,
    createdAt: '2025-01-14T08:45:00Z',
  },
  {
    id: 'notif-003',
    guestId: 'guest-001',
    type: 'info',
    title: 'Housekeeping In Progress',
    message: 'Our housekeeping team is currently cleaning your room.',
    read: false,
    createdAt: '2025-01-14T15:00:00Z',
  },
];

// Mock Payment History
export const mockPayments: Payment[] = [
  {
    id: 'pay-001',
    bookingId: 'booking-001',
    guestId: 'guest-001',
    amount: 1200,
    currency: 'USD',
    status: 'completed',
    method: 'card',
    description: 'Room booking - Deluxe Suite (4 nights)',
    transactionId: 'TXN-2025-001',
    createdAt: '2025-01-10T00:00:00Z',
    processedAt: '2025-01-10T00:05:00Z',
  },
  {
    id: 'pay-002',
    bookingId: 'booking-001',
    guestId: 'guest-001',
    amount: 25,
    currency: 'USD',
    status: 'completed',
    method: 'card',
    description: 'Room Service - Continental Breakfast',
    transactionId: 'TXN-2025-002',
    serviceRequestId: 'req-001',
    createdAt: '2025-01-14T08:50:00Z',
    processedAt: '2025-01-14T08:51:00Z',
  },
];

// Mock Weather Data
export const mockWeatherData = {
  temperature: 25,
  condition: 'Sunny',
  humidity: 65,
  windSpeed: 12,
  icon: 'sunny',
};

// Mock Analytics Data
export const mockGuestAnalytics = {
  totalStay: 15,
  servicesUsed: 42,
  satisfaction: 4.8,
  loyaltyPoints: 2500,
  preferredServices: ['Room Service', 'Spa', 'Concierge'],
};

// Helper function to create API response
export function createMockResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    message: 'Success',
  };
}

// Helper function to create paginated response
export function createMockPaginatedResponse<T>(
  items: T[],
  page: number = 1,
  limit: number = 20
): PaginatedResponse<T> {
  return {
    items,
    total: items.length,
    page,
    limit,
    totalPages: Math.ceil(items.length / limit),
  };
}