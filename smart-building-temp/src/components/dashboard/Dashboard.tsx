'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useSocket } from '@/hooks/useSocket';
import { apiClient } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WelcomeHeader } from './WelcomeHeader';
import { RoomCard } from './RoomCard';
import { QuickActions } from './QuickActions';
import { WeatherWidget } from './WeatherWidget';
import { ServiceRequests } from './ServiceRequests';
import { NotificationCenter } from './NotificationCenter';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export function Dashboard() {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState('dashboard');

  // Fetch current booking and room data
  const { data: currentBooking, isLoading: bookingLoading } = useQuery({
    queryKey: ['current-booking'],
    queryFn: () => apiClient.getCurrentBooking(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: currentRoom, isLoading: roomLoading } = useQuery({
    queryKey: ['current-room'],
    queryFn: () => apiClient.getCurrentRoom(),
    enabled: !!currentBooking?.data,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const { data: guestProfile } = useQuery({
    queryKey: ['guest-profile'],
    queryFn: () => apiClient.getGuestProfile(),
  });

  // Socket connection for real-time updates
  const { isConnected } = useSocket({
    roomId: currentRoom?.data?.id,
    onDeviceUpdate: (data) => {
      // Handle device updates in real-time
      console.log('Device update received:', data);
    },
    onNotification: (data) => {
      // Handle new notifications
      console.log('New notification:', data);
    },
  });

  if (bookingLoading || roomLoading) {
    return <LoadingScreen />;
  }

  if (!currentBooking?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Active Booking
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have an active booking. Please check in or contact reception.
          </p>
        </div>
      </div>
    );
  }

  const booking = currentBooking.data;
  const room = currentRoom?.data;
  const guest = guestProfile?.data;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Welcome Header */}
        <WelcomeHeader guest={guest} booking={booking} />

        {/* Top Row - Room and Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RoomCard room={room} booking={booking} />
          </div>
          <div>
            <WeatherWidget />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Service Requests */}
        <ServiceRequests />
      </motion.div>

      {/* Notification Center */}
      <NotificationCenter />
    </DashboardLayout>
  );
}