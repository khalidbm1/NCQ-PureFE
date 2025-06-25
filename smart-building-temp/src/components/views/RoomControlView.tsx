'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { RoomControls } from '@/components/room/RoomControls';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export function RoomControlView() {
  const { data: roomData, isLoading } = useQuery({
    queryKey: ['current-room'],
    queryFn: () => apiClient.getCurrentRoom(),
  });

  if (isLoading) return <LoadingScreen />;

  const room = roomData?.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Room Control</h1>
      {room ? (
        <RoomControls roomId={room.id} />
      ) : (
        <p className="text-gray-600">No room assigned.</p>
      )}
    </motion.div>
  );
}
