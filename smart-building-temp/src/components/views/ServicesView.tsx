'use client';

import { motion } from 'framer-motion';

export function ServicesView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel Services</h1>
      <p className="text-gray-600">Service requests and hotel amenities will be displayed here.</p>
    </motion.div>
  );
}