import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCopy, FiCheck, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const credentials = [
  {
    title: 'Admin User',
    username: 'admin@ncq.sa',
    password: 'Demo@2024',
    role: 'Super Admin',
  },
  {
    title: 'Hospital Manager',
    username: 'hospital.manager@demo.com',
    password: 'Hospital@123',
    role: 'Hospital Admin',
  },
  {
    title: 'Hotel Manager',
    username: 'hotel.manager@demo.com',
    password: 'Hotel@123',
    role: 'Hospitality Admin',
  },
  {
    title: 'Payment Merchant',
    username: 'merchant@demo.com',
    password: 'Merchant@123',
    role: 'Merchant',
  },
  {
    title: 'Test Card (mada)',
    username: '4400 0000 0000 0008',
    password: '12/25, CVV: 123',
    role: 'Test Payment',
  },
]

const StickyNote: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="tour-sticky-note fixed right-4 top-24 z-50 w-80"
        >
          <div className="bg-yellow-100 rounded-lg shadow-xl border-2 border-yellow-300 overflow-hidden">
            {/* Header */}
            <div className="bg-yellow-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <h3 className="font-bold text-gray-800">Demo Credentials</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
              <p className="text-sm text-gray-700 italic mb-4">
                Click any credential to copy. Use these for testing different user roles.
              </p>

              {credentials.map((cred, index) => (
                <div
                  key={index}
                  className="bg-white/80 rounded-md p-3 space-y-2 border border-yellow-300 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => copyToClipboard(`${cred.username}\n${cred.password}`, index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-800">{cred.title}</span>
                    <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full">
                      {cred.role}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-mono text-gray-800">{cred.username}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Password:</span>
                      <span className="font-mono text-gray-800">{cred.password}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    {copiedIndex === index ? (
                      <FiCheck className="text-green-600" size={16} />
                    ) : (
                      <FiCopy className="text-gray-400" size={16} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-yellow-200 px-4 py-2 text-center">
              <p className="text-xs text-gray-600">
                💡 Tip: Start with Admin User for full access
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reopen button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed right-4 top-24 z-50 bg-yellow-300 text-gray-800 p-3 rounded-full shadow-lg hover:bg-yellow-400 transition-colors"
          data-tooltip="Show Demo Credentials"
        >
          <FiCopy size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default StickyNote