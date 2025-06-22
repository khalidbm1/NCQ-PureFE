'use client';

import { motion } from 'framer-motion';

export function ProfileView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Guest Profile</h1>
      <p className="text-gray-600">Guest preferences and profile settings will be displayed here.</p>
    </motion.div>
  );
}