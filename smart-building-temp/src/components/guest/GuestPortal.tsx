'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { apiClient } from '@/lib/api';
import { CheckInFlow } from '@/components/checkin/CheckInFlow';
import { PaymentIntegration } from '@/components/payment/PaymentIntegration';
import { RoomControls } from '@/components/room/RoomControls';
import { ServiceRequests } from '@/components/dashboard/ServiceRequests';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Home,
  CreditCard,
  Settings,
  MapPin,
  Clock,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Dumbbell,
  Waves,
  Calendar,
  Bell,
  User,
  LogOut,
  Smartphone,
  QrCode,
  Star,
  Heart,
  Share,
  Phone,
  MessageCircle,
  Camera,
  Gift,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  Plus,
  ShoppingCart
} from 'lucide-react';

interface GuestPortalProps {
  guestId?: string;
  reservationId?: string;
  mode?: 'checkin' | 'dashboard' | 'checkout';
}

type PortalView = 'overview' | 'room' | 'services' | 'amenities' | 'billing' | 'support' | 'checkout';

export function GuestPortal({ 
  guestId = 'guest-123', 
  reservationId = 'res-456',
  mode = 'dashboard'
}: GuestPortalProps) {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<PortalView>('overview');
  const [isCheckedIn, setIsCheckedIn] = useState(mode === 'dashboard');
  const [showPayment, setShowPayment] = useState(false);
  const [pendingCharges, setPendingCharges] = useState(0);

  // Guest data query
  const { data: guestData, isLoading } = useQuery({
    queryKey: ['guest-data', guestId],
    queryFn: () => apiClient.getGuestProfile(),
    enabled: isCheckedIn
  });

  const guest = guestData?.data || {
    name: 'John Doe',
    room: '1205',
    floor: '12th Floor',
    checkIn: '2024-01-23',
    checkOut: '2024-01-25',
    preferences: {
      temperature: 22,
      lighting: 'medium'
    }
  };

  // Handle check-in completion
  const handleCheckInComplete = (roomData: any) => {
    setIsCheckedIn(true);
    setCurrentView('overview');
  };

  // Handle payment completion
  const handlePaymentComplete = (paymentData: any) => {
    setShowPayment(false);
    setPendingCharges(0);
  };

  // Show check-in flow if not checked in
  if (!isCheckedIn && mode === 'checkin') {
    return (
      <CheckInFlow 
        reservationId={reservationId}
        onComplete={handleCheckInComplete}
      />
    );
  }

  // Show payment overlay if active
  if (showPayment && pendingCharges > 0) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="max-w-lg w-full">
          <PaymentIntegration
            amount={pendingCharges}
            description="Hotel Services & Amenities"
            onSuccess={handlePaymentComplete}
            onCancel={() => setShowPayment(false)}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your guest portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <GuestPortalHeader 
        guest={guest}
        currentView={currentView}
        onViewChange={setCurrentView}
        pendingCharges={pendingCharges}
        onPaymentClick={() => setShowPayment(true)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'overview' && (
            <GuestOverview 
              guest={guest}
              onViewChange={setCurrentView}
              onServiceRequest={() => setCurrentView('services')}
            />
          )}
          {currentView === 'room' && (
            <RoomControlPanel guest={guest} />
          )}
          {currentView === 'services' && (
            <ServicesPanel 
              guest={guest}
              onChargeAdded={(amount: number) => setPendingCharges((prev: number) => prev + amount)}
            />
          )}
          {currentView === 'amenities' && (
            <AmenitiesPanel guest={guest} />
          )}
          {currentView === 'billing' && (
            <BillingPanel 
              guest={guest}
              pendingCharges={pendingCharges}
              onPayment={() => setShowPayment(true)}
            />
          )}
          {currentView === 'support' && (
            <SupportPanel guest={guest} />
          )}
          {currentView === 'checkout' && (
            <CheckoutPanel guest={guest} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function GuestPortalHeader({ guest, currentView, onViewChange, pendingCharges, onPaymentClick }: any) {
  const navigation = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'room', name: 'My Room', icon: Settings },
    { id: 'services', name: 'Services', icon: Bell },
    { id: 'amenities', name: 'Amenities', icon: Star },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'support', name: 'Support', icon: MessageCircle }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Welcome */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome, {guest.name}
              </h1>
              <p className="text-sm text-gray-600">
                Room {guest.room} • {guest.floor}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.id === 'billing' && pendingCharges > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      ${pendingCharges}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {pendingCharges > 0 && (
              <Button 
                size="sm" 
                onClick={onPaymentClick}
                className="bg-green-600 hover:bg-green-700"
              >
                Pay ${pendingCharges}
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewChange('checkout')}
            >
              Check Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function GuestOverview({ guest, onViewChange, onServiceRequest }: any) {
  const quickActions = [
    {
      id: 'room-service',
      name: 'Room Service',
      description: 'Order food to your room',
      icon: Utensils,
      color: 'bg-orange-500',
      action: () => onServiceRequest()
    },
    {
      id: 'housekeeping',
      name: 'Housekeeping',
      description: 'Request cleaning service',
      icon: Star,
      color: 'bg-blue-500',
      action: () => onServiceRequest()
    },
    {
      id: 'concierge',
      name: 'Concierge',
      description: 'Get local recommendations',
      icon: MapPin,
      color: 'bg-purple-500',
      action: () => onViewChange('support')
    },
    {
      id: 'spa',
      name: 'Spa Booking',
      description: 'Book wellness treatments',
      icon: Heart,
      color: 'bg-pink-500',
      action: () => onViewChange('amenities')
    }
  ];

  const todaySchedule = [
    { time: '09:00', event: 'Breakfast at Ocean View Restaurant', type: 'dining' },
    { time: '11:00', event: 'Spa Appointment - Relaxation Massage', type: 'spa' },
    { time: '14:00', event: 'Pool Area - Family Time', type: 'leisure' },
    { time: '19:00', event: 'Dinner Reservation - Rooftop Grill', type: 'dining' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {guest.name}!
            </h2>
            <p className="text-blue-100 mb-4">
              Welcome to Paradise Resort. We hope you enjoy your stay with us.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Check-out: {guest.checkOut}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Room {guest.room}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <QrCode className="h-16 w-16 mx-auto mb-2 opacity-80" />
            <p className="text-xs text-blue-200">Your Digital Key</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            
            return (
              <button
                key={action.id}
                onClick={action.action}
                className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{action.name}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-12 text-sm font-medium text-gray-600">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.event}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {item.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add to Schedule
            </Button>
          </div>
        </div>

        {/* Room Status */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Status</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Temperature</span>
                <span className="font-medium">{guest.preferences?.temperature || 22}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lighting</span>
                <span className="font-medium capitalize">{guest.preferences?.lighting || 'Medium'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">WiFi</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Do Not Disturb</span>
                <span className="font-medium">Off</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => onViewChange('room')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Control Room
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Check-in completed</p>
                <p className="text-xs text-gray-600">Today at 3:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Digital key activated</p>
                <p className="text-xs text-gray-600">Today at 3:05 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Wifi className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Connected to Resort WiFi</p>
                <p className="text-xs text-gray-600">Today at 3:10 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RoomControlPanel({ guest }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Room Controls</h2>
          <p className="text-gray-600">Manage your room environment and devices</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Room {guest.room}
        </Badge>
      </div>

      <RoomControls roomId={guest.room} />
    </motion.div>
  );
}

function ServicesPanel({ guest, onChargeAdded }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel Services</h2>
        <p className="text-gray-600">Request services and track your orders</p>
      </div>

      <ServiceRequests />
    </motion.div>
  );
}

function AmenitiesPanel({ guest }: any) {
  const amenities = [
    {
      name: 'Spa & Wellness',
      description: 'Relaxation treatments and wellness services',
      icon: Heart,
      image: '/images/spa.jpg',
      available: true,
      bookingRequired: true
    },
    {
      name: 'Fitness Center',
      description: '24/7 fully equipped gym',
      icon: Dumbbell,
      image: '/images/gym.jpg',
      available: true,
      bookingRequired: false
    },
    {
      name: 'Swimming Pool',
      description: 'Infinity pool with ocean view',
      icon: Waves,
      image: '/images/pool.jpg',
      available: true,
      bookingRequired: false
    },
    {
      name: 'Business Center',
      description: 'Meeting rooms and office facilities',
      icon: Settings,
      image: '/images/business.jpg',
      available: true,
      bookingRequired: true
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel Amenities</h2>
        <p className="text-gray-600">Discover and book our premium facilities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {amenities.map((amenity) => {
          const Icon = amenity.icon;
          
          return (
            <div key={amenity.name} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Icon className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{amenity.name}</h3>
                  {amenity.available ? (
                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-red-700 bg-red-100">
                      Closed
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{amenity.description}</p>
                <div className="flex space-x-2">
                  <Button size="sm" disabled={!amenity.available}>
                    {amenity.bookingRequired ? 'Book Now' : 'View Details'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Info className="h-4 w-4 mr-1" />
                    Info
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function BillingPanel({ guest, pendingCharges, onPayment }: any) {
  const charges = [
    { date: '2024-01-23', description: 'Room Service - Breakfast', amount: 45.00, status: 'paid' },
    { date: '2024-01-23', description: 'Spa Treatment - Massage', amount: 120.00, status: 'paid' },
    { date: '2024-01-24', description: 'Mini Bar', amount: 25.00, status: 'pending' },
    { date: '2024-01-24', description: 'Laundry Service', amount: 15.00, status: 'pending' }
  ];

  const totalPaid = charges.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
  const totalPending = charges.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Charges</h2>
        <p className="text-gray-600">View your stay charges and payment history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Charges</p>
              <p className="text-2xl font-bold text-orange-600">${totalPending.toFixed(2)}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stay</p>
              <p className="text-2xl font-bold text-gray-900">${(totalPaid + totalPending).toFixed(2)}</p>
            </div>
            <CreditCard className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Charges List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Charge Details</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {charges.map((charge, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{charge.description}</p>
                  <p className="text-sm text-gray-600">{charge.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">${charge.amount.toFixed(2)}</span>
                  <Badge 
                    variant={charge.status === 'paid' ? 'secondary' : 'outline'}
                    className={charge.status === 'paid' ? 'text-green-700 bg-green-100' : 'text-orange-700 bg-orange-100'}
                  >
                    {charge.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Actions */}
      {totalPending > 0 && (
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-orange-900 mb-1">Outstanding Balance</h4>
              <p className="text-sm text-orange-700">
                You have ${totalPending.toFixed(2)} in pending charges
              </p>
            </div>
            <Button 
              onClick={onPayment}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Pay Now
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function SupportPanel({ guest }: any) {
  const supportOptions = [
    {
      name: 'Call Front Desk',
      description: 'Speak with our staff 24/7',
      icon: Phone,
      action: 'call'
    },
    {
      name: 'Live Chat',
      description: 'Chat with concierge online',
      icon: MessageCircle,
      action: 'chat'
    },
    {
      name: 'Emergency Services',
      description: 'Medical or security emergency',
      icon: AlertCircle,
      action: 'emergency'
    },
    {
      name: 'Technical Support',
      description: 'WiFi, TV, or room tech issues',
      icon: Settings,
      action: 'tech'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Support</h2>
        <p className="text-gray-600">Get help and assistance during your stay</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportOptions.map((option) => {
          const Icon = option.icon;
          
          return (
            <button
              key={option.name}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{option.name}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Contact Info */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">Quick Contact</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-700 font-medium">Front Desk</p>
            <p className="text-blue-600">Dial 0 from room phone</p>
          </div>
          <div>
            <p className="text-blue-700 font-medium">Concierge</p>
            <p className="text-blue-600">Dial 1 from room phone</p>
          </div>
          <div>
            <p className="text-blue-700 font-medium">Room Service</p>
            <p className="text-blue-600">Dial 2 from room phone</p>
          </div>
          <div>
            <p className="text-blue-700 font-medium">Emergency</p>
            <p className="text-blue-600">Dial 999</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CheckoutPanel({ guest }: any) {
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment' | 'complete'>('review');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Express Checkout</h2>
        <p className="text-gray-600">Review your stay and complete checkout</p>
      </div>

      {checkoutStep === 'review' && (
        <div className="space-y-6">
          {/* Stay Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Guest Name</p>
                <p className="font-medium">{guest.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Room</p>
                <p className="font-medium">{guest.room} - {guest.floor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="font-medium">{guest.checkIn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-out</p>
                <p className="font-medium">{guest.checkOut}</p>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Your Stay</h3>
            <div className="flex items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="text-2xl text-yellow-400 hover:text-yellow-500">
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Tell us about your experience..."
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <Button 
            onClick={() => setCheckoutStep('payment')}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            Continue to Final Bill
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {checkoutStep === 'payment' && (
        <div className="text-center space-y-6">
          <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Checkout Complete!
            </h3>
            <p className="text-gray-600">
              Thank you for staying with us. We hope you had a wonderful experience.
            </p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <p className="text-green-800 font-medium">
              Your final receipt has been sent to your email
            </p>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
            Download Receipt
          </Button>
        </div>
      )}
    </motion.div>
  );
}