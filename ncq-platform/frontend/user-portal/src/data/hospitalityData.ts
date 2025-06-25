export interface Business {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'event_venue' | 'activity';
  description: string;
  images: string[];
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  rating: number;
  reviewCount: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  amenities: string[];
  capacity?: number;
  cuisineType?: string[];
  eventTypes?: string[];
  activityTypes?: string[];
  availability: {
    date: string;
    slots: { time: string; available: boolean }[];
  }[];
  aiScore: number; // AI recommendation score
  trending: boolean;
  sustainabilityRating?: number;
}

export interface Booking {
  id: string;
  userId: string;
  businessId: string;
  businessName: string;
  businessType: string;
  date: string;
  time?: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: string;
  specialRequests?: string;
  userRating?: number;
  userReview?: string;
}

export interface UserBehavior {
  userId: string;
  searches: {
    query: string;
    filters: Record<string, any>;
    timestamp: string;
  }[];
  viewedBusinesses: {
    businessId: string;
    timestamp: string;
    duration: number;
  }[];
  bookingHistory: string[];
  preferences: {
    priceRange: string[];
    cuisineTypes: string[];
    activityTypes: string[];
    preferredLocations: string[];
  };
  aiInsights: {
    likelyToBook: string[];
    recommendedBusinesses: string[];
    spendingPattern: 'budget' | 'moderate' | 'luxury';
    travelFrequency: 'occasional' | 'regular' | 'frequent';
  };
}

export interface BusinessMetrics {
  businessId: string;
  period: string;
  bookings: number;
  revenue: number;
  occupancyRate: number;
  averageRating: number;
  conversionRate: number;
  repeatCustomers: number;
  popularTimeSlots: { time: string; bookings: number }[];
  customerDemographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    spendingPatterns: Record<string, number>;
  };
  aiPredictions: {
    nextMonthBookings: number;
    recommendedPricing: number;
    demandForecast: 'low' | 'moderate' | 'high';
    suggestedPromotions: string[];
  };
}

// Mock data
export const mockBusinesses: Business[] = [
  // Hotels
  {
    id: 'hotel-1',
    name: 'Grand Plaza Hotel',
    type: 'hotel',
    description: 'Luxury 5-star hotel in the heart of downtown with stunning city views',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
    location: {
      address: '123 Main Street',
      city: 'New York',
      country: 'USA',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    rating: 4.8,
    reviewCount: 2847,
    priceRange: '$$$$',
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge', 'Business Center'],
    capacity: 500,
    availability: generateAvailability(),
    aiScore: 0.92,
    trending: true,
    sustainabilityRating: 4.5
  },
  {
    id: 'hotel-2',
    name: 'Boutique Inn & Suites',
    type: 'hotel',
    description: 'Charming boutique hotel with personalized service and unique design',
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
    location: {
      address: '456 Park Avenue',
      city: 'San Francisco',
      country: 'USA',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    rating: 4.6,
    reviewCount: 892,
    priceRange: '$$$',
    amenities: ['WiFi', 'Breakfast', 'Pet-friendly', 'Parking', 'Laundry'],
    capacity: 50,
    availability: generateAvailability(),
    aiScore: 0.85,
    trending: false,
    sustainabilityRating: 4.0
  },
  // Restaurants
  {
    id: 'rest-1',
    name: 'The Gourmet Kitchen',
    type: 'restaurant',
    description: 'Award-winning fine dining restaurant specializing in fusion cuisine',
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'],
    location: {
      address: '789 Culinary Lane',
      city: 'Los Angeles',
      country: 'USA',
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    rating: 4.9,
    reviewCount: 1523,
    priceRange: '$$$$',
    amenities: ['Private Dining', 'Wine Cellar', 'Valet Parking', 'Outdoor Seating'],
    cuisineType: ['Fusion', 'Contemporary', 'International'],
    capacity: 120,
    availability: generateAvailability(),
    aiScore: 0.94,
    trending: true
  },
  {
    id: 'rest-2',
    name: 'Mama\'s Italian Bistro',
    type: 'restaurant',
    description: 'Family-owned authentic Italian restaurant with homemade pasta',
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5'],
    location: {
      address: '321 Italia Street',
      city: 'Chicago',
      country: 'USA',
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },
    rating: 4.7,
    reviewCount: 2156,
    priceRange: '$$',
    amenities: ['WiFi', 'Family-friendly', 'Takeout', 'Delivery'],
    cuisineType: ['Italian', 'Pizza', 'Pasta'],
    capacity: 80,
    availability: generateAvailability(),
    aiScore: 0.88,
    trending: false
  },
  // Event Venues
  {
    id: 'venue-1',
    name: 'Crystal Ballroom',
    type: 'event_venue',
    description: 'Elegant event space perfect for weddings, galas, and corporate events',
    images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3'],
    location: {
      address: '555 Event Plaza',
      city: 'Miami',
      country: 'USA',
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    rating: 4.8,
    reviewCount: 567,
    priceRange: '$$$',
    amenities: ['Catering', 'AV Equipment', 'Parking', 'Dance Floor', 'Stage'],
    eventTypes: ['Wedding', 'Corporate', 'Gala', 'Conference', 'Party'],
    capacity: 500,
    availability: generateAvailability(),
    aiScore: 0.90,
    trending: true
  },
  {
    id: 'venue-2',
    name: 'Garden Pavilion',
    type: 'event_venue',
    description: 'Beautiful outdoor venue surrounded by nature, ideal for intimate gatherings',
    images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3'],
    location: {
      address: '123 Garden Way',
      city: 'Seattle',
      country: 'USA',
      coordinates: { lat: 47.6062, lng: -122.3321 }
    },
    rating: 4.6,
    reviewCount: 234,
    priceRange: '$$',
    amenities: ['Garden', 'Pavilion', 'Catering Options', 'Photo Spots'],
    eventTypes: ['Wedding', 'Birthday', 'Anniversary', 'Small Gathering'],
    capacity: 150,
    availability: generateAvailability(),
    aiScore: 0.83,
    trending: false
  },
  // Activities
  {
    id: 'activity-1',
    name: 'Adventure Tours Co.',
    type: 'activity',
    description: 'Guided adventure tours including hiking, kayaking, and rock climbing',
    images: ['https://images.unsplash.com/photo-1533692328991-08159ff19fca'],
    location: {
      address: '789 Adventure Road',
      city: 'Denver',
      country: 'USA',
      coordinates: { lat: 39.7392, lng: -104.9903 }
    },
    rating: 4.9,
    reviewCount: 1892,
    priceRange: '$$',
    amenities: ['Equipment Provided', 'Professional Guides', 'Insurance', 'Transportation'],
    activityTypes: ['Hiking', 'Kayaking', 'Rock Climbing', 'Mountain Biking'],
    availability: generateAvailability(),
    aiScore: 0.91,
    trending: true,
    sustainabilityRating: 5.0
  },
  {
    id: 'activity-2',
    name: 'City Cultural Tours',
    type: 'activity',
    description: 'Immersive cultural experiences including museum tours and local workshops',
    images: ['https://images.unsplash.com/photo-1569163139394-de4798aa62ac'],
    location: {
      address: '456 Culture Street',
      city: 'Boston',
      country: 'USA',
      coordinates: { lat: 42.3601, lng: -71.0589 }
    },
    rating: 4.7,
    reviewCount: 743,
    priceRange: '$',
    amenities: ['Expert Guides', 'Small Groups', 'Audio Guides', 'Skip-the-line'],
    activityTypes: ['Museum Tours', 'Walking Tours', 'Art Workshops', 'Food Tours'],
    availability: generateAvailability(),
    aiScore: 0.86,
    trending: false
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-1',
    businessId: 'hotel-1',
    businessName: 'Grand Plaza Hotel',
    businessType: 'hotel',
    date: '2024-02-15',
    guests: 2,
    status: 'confirmed',
    totalAmount: 850,
    createdAt: '2024-01-20T10:30:00Z',
    specialRequests: 'High floor room with city view'
  },
  {
    id: 'booking-2',
    userId: 'user-2',
    businessId: 'rest-1',
    businessName: 'The Gourmet Kitchen',
    businessType: 'restaurant',
    date: '2024-02-10',
    time: '19:00',
    guests: 4,
    status: 'completed',
    totalAmount: 320,
    createdAt: '2024-01-25T14:15:00Z',
    userRating: 5,
    userReview: 'Exceptional dining experience!'
  },
  {
    id: 'booking-3',
    userId: 'user-3',
    businessId: 'activity-1',
    businessName: 'Adventure Tours Co.',
    businessType: 'activity',
    date: '2024-02-20',
    time: '09:00',
    guests: 6,
    status: 'pending',
    totalAmount: 480,
    createdAt: '2024-02-01T09:00:00Z',
    specialRequests: 'Beginner-friendly hiking route'
  }
];

export const mockUserBehaviors: UserBehavior[] = [
  {
    userId: 'user-1',
    searches: [
      { query: 'luxury hotels downtown', filters: { priceRange: ['$$$$'] }, timestamp: '2024-01-19T09:00:00Z' },
      { query: 'spa hotels', filters: { amenities: ['Spa'] }, timestamp: '2024-01-19T09:15:00Z' }
    ],
    viewedBusinesses: [
      { businessId: 'hotel-1', timestamp: '2024-01-19T09:20:00Z', duration: 180 },
      { businessId: 'hotel-2', timestamp: '2024-01-19T09:25:00Z', duration: 120 }
    ],
    bookingHistory: ['booking-1'],
    preferences: {
      priceRange: ['$$$', '$$$$'],
      cuisineTypes: ['Fine Dining', 'International'],
      activityTypes: ['Relaxation', 'Sightseeing'],
      preferredLocations: ['Downtown', 'City Center']
    },
    aiInsights: {
      likelyToBook: ['hotel-1', 'rest-1'],
      recommendedBusinesses: ['hotel-1', 'rest-1', 'activity-2'],
      spendingPattern: 'luxury',
      travelFrequency: 'regular'
    }
  }
];

function generateAvailability() {
  const availability = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const slots = [];
    for (let hour = 9; hour < 21; hour++) {
      slots.push({
        time: `${hour}:00`,
        available: Math.random() > 0.3
      });
    }
    
    availability.push({
      date: date.toISOString().split('T')[0],
      slots
    });
  }
  
  return availability;
}

export function generateBusinessMetrics(businessId: string): BusinessMetrics {
  return {
    businessId,
    period: 'Last 30 days',
    bookings: Math.floor(Math.random() * 200) + 50,
    revenue: Math.floor(Math.random() * 50000) + 10000,
    occupancyRate: Math.random() * 0.4 + 0.5,
    averageRating: Math.random() * 0.5 + 4.3,
    conversionRate: Math.random() * 0.2 + 0.1,
    repeatCustomers: Math.floor(Math.random() * 50) + 10,
    popularTimeSlots: [
      { time: '12:00', bookings: Math.floor(Math.random() * 20) + 10 },
      { time: '19:00', bookings: Math.floor(Math.random() * 30) + 20 },
      { time: '20:00', bookings: Math.floor(Math.random() * 25) + 15 }
    ],
    customerDemographics: {
      ageGroups: {
        '18-25': Math.floor(Math.random() * 20) + 10,
        '26-35': Math.floor(Math.random() * 30) + 20,
        '36-45': Math.floor(Math.random() * 25) + 15,
        '46+': Math.floor(Math.random() * 25) + 15
      },
      locations: {
        'Local': Math.floor(Math.random() * 30) + 20,
        'Domestic': Math.floor(Math.random() * 40) + 30,
        'International': Math.floor(Math.random() * 30) + 20
      },
      spendingPatterns: {
        'Budget': Math.floor(Math.random() * 20) + 10,
        'Moderate': Math.floor(Math.random() * 40) + 30,
        'Luxury': Math.floor(Math.random() * 40) + 30
      }
    },
    aiPredictions: {
      nextMonthBookings: Math.floor(Math.random() * 250) + 100,
      recommendedPricing: Math.floor(Math.random() * 200) + 100,
      demandForecast: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'moderate' | 'high',
      suggestedPromotions: [
        'Weekend special: 20% off',
        'Early bird discount for advance bookings',
        'Loyalty program for repeat customers',
        'Partnership with local attractions'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    }
  };
}