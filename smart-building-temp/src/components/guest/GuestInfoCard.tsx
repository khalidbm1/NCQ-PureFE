import { Guest, Booking } from '@/types';
import { motion } from 'framer-motion';

interface GuestInfoCardProps {
  guest?: Guest;
  booking?: Booking;
}

export function GuestInfoCard({ guest, booking }: GuestInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
    >
      <div className="flex items-center space-x-4">
        <img
          src={guest?.profilePicture || 'https://placehold.co/64x64'}
          alt="Guest avatar"
          className="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {guest ? `${guest.firstName} ${guest.lastName}` : 'Guest'}
          </h2>
          <p className="text-gray-500">
            {booking ? `Room ${booking.roomNumber}` : 'No active booking'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
