'use client';

import { motion } from 'framer-motion';
import { useLanguage, useDateFormat } from '@/hooks/useLanguage';
import { getTimeOfDay, getGreeting } from '@/lib/utils';
import { Guest, Booking } from '@/types';
import { Calendar, MapPin, Users } from 'lucide-react';

interface WelcomeHeaderProps {
  guest?: Guest;
  booking: Booking;
}

export function WelcomeHeader({ guest, booking }: WelcomeHeaderProps) {
  const { t } = useLanguage();
  const { formatDate } = useDateFormat();

  const guestName = guest ? `${guest.firstName} ${guest.lastName}` : 'Guest';
  const greeting = getGreeting(guest?.firstName);
  const timeOfDay = getTimeOfDay();

  const getGreetingIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return '🌅';
      case 'afternoon':
        return '☀️';
      case 'evening':
        return '🌆';
      default:
        return '👋';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-xl p-6 text-white"
      style={{
        background: 'linear-gradient(to right, #16a34a, #15803d)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-3">{getGreetingIcon()}</span>
            <h1 className="text-2xl md:text-3xl font-bold">
              {greeting}
            </h1>
          </div>
          
          <p className="mb-4" style={{color: '#dcfce7'}}>
            {t('dashboard.welcome_back', { name: guestName })}
          </p>

          {/* Booking Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" style={{color: '#bbf7d0'}} />
              <div>
                <p className="text-sm" style={{color: '#bbf7d0'}}>Room</p>
                <p className="font-semibold">{booking.room?.number || booking.roomId}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" style={{color: '#bbf7d0'}} />
              <div>
                <p className="text-sm" style={{color: '#bbf7d0'}}>Check-out</p>
                <p className="font-semibold">{formatDate(booking.checkOutDate)}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" style={{color: '#bbf7d0'}} />
              <div>
                <p className="text-sm" style={{color: '#bbf7d0'}}>Guests</p>
                <p className="font-semibold">{booking.numberOfGuests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Avatar/Info */}
        <div className="hidden md:block">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            {guest?.profileImage ? (
              <img
                src={guest.profileImage}
                alt={guestName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {guestName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            )}
          </div>
          
          {guest?.membershipTier && (
            <div className="mt-2 text-center">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                {guest.membershipTier.charAt(0).toUpperCase() + guest.membershipTier.slice(1)} Member
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Loyalty Points */}
      {guest?.loyaltyPoints && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-200">Loyalty Points</p>
              <p className="text-lg font-bold">{guest.loyaltyPoints.toLocaleString()}</p>
            </div>
            <div className="text-2xl">⭐</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}