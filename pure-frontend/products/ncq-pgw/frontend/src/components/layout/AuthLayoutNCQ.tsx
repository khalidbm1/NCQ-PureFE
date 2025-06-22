import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCardIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { useTranslation } from '@/shared/hooks/useTranslation'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayoutNCQ: React.FC<AuthLayoutProps> = ({ children }) => {
  const location = useLocation()
  const { theme } = useTheme()
  const { t } = useTranslation()
  
  // Determine page type based on route
  const isLogin = location.pathname.includes('login')
  const isRegister = location.pathname.includes('register')
  const isForgotPassword = location.pathname.includes('forgot-password')
  
  // Page titles
  const pageTitle = isLogin ? t('auth.login') : isRegister ? t('auth.createAccount') : 'Reset Password'
  const pageSubtitle = isLogin 
    ? 'Welcome back! Please sign in to your account.' 
    : isRegister 
    ? 'Start accepting payments in minutes.'
    : 'We\'ll send you a link to reset your password.'

  const features = [
    'PCI-DSS Level 1 Certified',
    '99.9% Uptime Guarantee',
    'Real-time Analytics Dashboard',
    '24/7 Support',
  ]

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          <div>
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <CreditCardIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">NCQ Gateway</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Solutions</p>
              </div>
            </Link>
            
            {/* Page title */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {pageTitle}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {pageSubtitle}
            </p>
          </div>

          <div className="mt-8">
            {children}
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Background */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-700 dark:via-green-800 dark:to-green-900">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
        </div>
        
        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center p-12"
        >
          <div className="max-w-lg text-white">
            <h3 className="text-4xl font-bold mb-6">
              Accept payments from anywhere
            </h3>
            <ul className="space-y-4 text-lg">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center"
                >
                  <CheckIcon className="h-6 w-6 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-8 pt-8 border-t border-green-400/30"
            >
              <div className="flex items-center space-x-6 rtl:space-x-reverse">
                <div>
                  <p className="text-3xl font-bold">1M+</p>
                  <p className="text-sm text-green-200">Transactions</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">99.9%</p>
                  <p className="text-sm text-green-200">Uptime</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">24/7</p>
                  <p className="text-sm text-green-200">Support</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-32 h-32 bg-white/5 rounded-full backdrop-blur-sm"
        />
      </div>
    </div>
  )
}

export default AuthLayoutNCQ