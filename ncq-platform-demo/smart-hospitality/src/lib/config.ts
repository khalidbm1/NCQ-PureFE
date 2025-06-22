export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  ncqPaymentGatewayUrl: process.env.NEXT_PUBLIC_NCQ_PGW_URL || 'http://localhost:8080',
  
  // API endpoints
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      refresh: '/api/auth/refresh',
      logout: '/api/auth/logout',
      profile: '/api/auth/profile',
    },
    guests: {
      profile: '/api/guests/profile',
      preferences: '/api/guests/preferences',
      bookings: '/api/guests/bookings',
    },
    bookings: {
      list: '/api/bookings',
      checkin: '/api/bookings/checkin',
      checkout: '/api/bookings/checkout',
      current: '/api/bookings/current',
    },
    rooms: {
      current: '/api/rooms/current',
      devices: '/api/rooms/devices',
      control: '/api/rooms/control',
    },
    services: {
      requests: '/api/services/requests',
      menu: '/api/services/menu',
      order: '/api/services/order',
    },
    payments: {
      create: '/api/payments/create',
      confirm: '/api/payments/confirm',
      history: '/api/payments/history',
    },
    notifications: {
      list: '/api/notifications',
      markRead: '/api/notifications/read',
    },
  },

  // Socket.IO events
  socketEvents: {
    connect: 'connect',
    disconnect: 'disconnect',
    deviceUpdate: 'device:update',
    roomStatusUpdate: 'room:status:update',
    serviceRequestUpdate: 'service:request:update',
    notification: 'notification',
    joinRoom: 'room:join',
    leaveRoom: 'room:leave',
  },

  // Default preferences
  defaultPreferences: {
    language: 'en' as const,
    temperature: 22,
    lightingLevel: 70,
    roomServicePreferences: [],
    dietaryRestrictions: [],
    smokingPreference: false,
    bedType: 'double' as const,
    pillowType: 'medium' as const,
    newsChannels: [],
  },

  // Supported languages
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ],

  // Device control limits
  deviceLimits: {
    temperature: { min: 16, max: 30 },
    lighting: { min: 0, max: 100 },
  },

  // Payment methods
  paymentMethods: [
    { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
    { id: 'points', name: 'Loyalty Points', icon: 'star' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: 'building-bank' },
  ],

  // Service categories
  serviceCategories: [
    { id: 'food', name: 'Food', icon: 'utensils' },
    { id: 'beverage', name: 'Beverages', icon: 'coffee' },
    { id: 'amenity', name: 'Amenities', icon: 'gift' },
    { id: 'service', name: 'Services', icon: 'concierge-bell' },
  ],

  // Request types
  requestTypes: [
    { id: 'housekeeping', name: 'Housekeeping', icon: 'cleaning', color: 'blue' },
    { id: 'room-service', name: 'Room Service', icon: 'room-service', color: 'green' },
    { id: 'maintenance', name: 'Maintenance', icon: 'wrench', color: 'orange' },
    { id: 'concierge', name: 'Concierge', icon: 'concierge', color: 'purple' },
    { id: 'spa', name: 'Spa Services', icon: 'spa', color: 'pink' },
    { id: 'laundry', name: 'Laundry', icon: 'shirt', color: 'cyan' },
  ],

  // Notification types
  notificationTypes: {
    info: { color: 'blue', icon: 'info' },
    success: { color: 'green', icon: 'check' },
    warning: { color: 'yellow', icon: 'alert-triangle' },
    error: { color: 'red', icon: 'alert-circle' },
  },

  // Room amenities
  roomAmenities: [
    'Air Conditioning',
    'WiFi',
    'TV',
    'Minibar',
    'Safe',
    'Coffee Machine',
    'Balcony',
    'Ocean View',
    'City View',
    'Jacuzzi',
    'Smart Controls',
    'Voice Assistant',
  ],

  // Dietary restrictions
  dietaryOptions: [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Halal',
    'Kosher',
    'Dairy-Free',
    'Nut-Free',
    'Low-Sodium',
    'Diabetic-Friendly',
  ],

  // Time zones and formats
  timeZone: 'UTC',
  dateFormat: 'yyyy-MM-dd',
  timeFormat: 'HH:mm',
  dateTimeFormat: 'yyyy-MM-dd HH:mm',

  // Cache settings
  cache: {
    profile: 5 * 60 * 1000, // 5 minutes
    preferences: 10 * 60 * 1000, // 10 minutes
    roomData: 30 * 1000, // 30 seconds
    services: 15 * 60 * 1000, // 15 minutes
  },

  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  // File upload
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },

  // Feature flags
  features: {
    voiceControl: true,
    biometricAuth: true,
    arTranslation: true,
    iotIntegration: true,
    paymentGateway: true,
    loyaltyProgram: true,
    realTimeNotifications: true,
    offlineMode: false,
  },
};