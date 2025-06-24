import { create } from 'zustand';
import { mockBusinesses, mockBookings, mockUserBehaviors, type Booking, type Business } from '@/data/hospitalityData';

interface SimulationState {
  // Simulation data
  businesses: Business[];
  bookings: Booking[];
  userBehaviors: typeof mockUserBehaviors;
  
  // Live simulation state
  isSimulating: boolean;
  liveMetrics: {
    activeUsers: number;
    recentSearches: string[];
    popularDestinations: string[];
    conversionRate: number;
    aiRecommendations: number;
  };
  
  // Simulation controls
  startSimulation: () => void;
  stopSimulation: () => void;
  
  // Business actions
  addBusiness: (business: Business) => void;
  updateBusinessMetrics: (businessId: string) => void;
  
  // Booking actions
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  
  // AI actions
  generateAIRecommendation: (userId: string) => Business[];
  updateUserBehavior: (userId: string, action: any) => void;
}

let simulationInterval: NodeJS.Timeout | null = null;

export const useHospitalitySimulation = create<SimulationState>((set, get) => ({
  businesses: mockBusinesses,
  bookings: mockBookings,
  userBehaviors: mockUserBehaviors,
  
  isSimulating: false,
  liveMetrics: {
    activeUsers: 243,
    recentSearches: [
      'romantic dinner downtown',
      'family hotel with pool',
      'adventure tours near me',
      'wedding venue garden',
      'business conference room'
    ],
    popularDestinations: ['New York', 'San Francisco', 'Miami', 'Chicago', 'Denver'],
    conversionRate: 0.34,
    aiRecommendations: 156
  },
  
  startSimulation: () => {
    set({ isSimulating: true });
    
    // Simulate live activity
    simulationInterval = setInterval(() => {
      const state = get();
      
      // Random user activity
      const activeUsers = state.liveMetrics.activeUsers + Math.floor(Math.random() * 10) - 5;
      
      // Random new search
      const searchQueries = [
        'luxury spa hotel',
        'italian restaurant date night',
        'outdoor activities family',
        'corporate event space',
        'budget hotel downtown',
        'fine dining experience',
        'adventure tour booking',
        'wedding venue beach'
      ];
      const newSearch = searchQueries[Math.floor(Math.random() * searchQueries.length)];
      const recentSearches = [newSearch, ...state.liveMetrics.recentSearches.slice(0, 4)];
      
      // Update conversion rate
      const conversionRate = Math.min(0.5, Math.max(0.2, state.liveMetrics.conversionRate + (Math.random() - 0.5) * 0.02));
      
      // Generate AI recommendations
      const aiRecommendations = state.liveMetrics.aiRecommendations + Math.floor(Math.random() * 5);
      
      set({
        liveMetrics: {
          ...state.liveMetrics,
          activeUsers: Math.max(100, activeUsers),
          recentSearches,
          conversionRate,
          aiRecommendations
        }
      });
      
      // Randomly create a booking
      if (Math.random() > 0.7) {
        const randomBusiness = state.businesses[Math.floor(Math.random() * state.businesses.length)];
        const booking: Omit<Booking, 'id' | 'createdAt'> = {
          userId: `user-${Math.floor(Math.random() * 100)}`,
          businessId: randomBusiness.id,
          businessName: randomBusiness.name,
          businessType: randomBusiness.type,
          date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: randomBusiness.type === 'restaurant' ? '19:00' : undefined,
          guests: Math.floor(Math.random() * 4) + 1,
          status: 'pending',
          totalAmount: Math.floor(Math.random() * 500) + 100
        };
        get().createBooking(booking);
      }
      
      // Randomly update booking status
      if (Math.random() > 0.8 && state.bookings.length > 0) {
        const randomBooking = state.bookings[Math.floor(Math.random() * state.bookings.length)];
        if (randomBooking.status === 'pending') {
          get().updateBookingStatus(randomBooking.id, 'confirmed');
        }
      }
    }, 2000);
  },
  
  stopSimulation: () => {
    set({ isSimulating: false });
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
    }
  },
  
  addBusiness: (business) => {
    set((state) => ({
      businesses: [...state.businesses, business]
    }));
  },
  
  updateBusinessMetrics: (businessId) => {
    set((state) => ({
      businesses: state.businesses.map(b => 
        b.id === businessId 
          ? { ...b, reviewCount: b.reviewCount + 1, rating: Math.min(5, b.rating + 0.01) }
          : b
      )
    }));
  },
  
  createBooking: (bookingData) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    set((state) => ({
      bookings: [newBooking, ...state.bookings]
    }));
  },
  
  updateBookingStatus: (bookingId, status) => {
    set((state) => ({
      bookings: state.bookings.map(b => 
        b.id === bookingId ? { ...b, status } : b
      )
    }));
  },
  
  generateAIRecommendation: (userId) => {
    const state = get();
    const userBehavior = state.userBehaviors.find(u => u.userId === userId);
    
    if (!userBehavior) {
      // Return top-rated businesses for new users
      return state.businesses
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, 3);
    }
    
    // Simple recommendation based on preferences
    return state.businesses
      .filter(b => {
        if (userBehavior.preferences.priceRange.includes(b.priceRange)) return true;
        if (b.type === 'restaurant' && userBehavior.preferences.cuisineTypes.some(c => b.cuisineType?.includes(c))) return true;
        if (b.type === 'activity' && userBehavior.preferences.activityTypes.some(a => b.activityTypes?.includes(a))) return true;
        return false;
      })
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 3);
  },
  
  updateUserBehavior: (userId, action) => {
    set((state) => ({
      userBehaviors: state.userBehaviors.map(u => 
        u.userId === userId 
          ? { 
              ...u, 
              searches: [...u.searches, action.search].slice(-10),
              viewedBusinesses: [...u.viewedBusinesses, action.viewed].slice(-20)
            }
          : u
      )
    }));
  }
}));

// Auto-stop simulation when component unmounts
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const { stopSimulation } = useHospitalitySimulation.getState();
    stopSimulation();
  });
}