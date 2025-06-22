import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiArrowRight, FiCreditCard, FiActivity, FiWifi, 
  FiBriefcase, FiCpu, FiShield, FiZap, FiGlobe,
  FiUsers, FiTrendingUp, FiAward
} from 'react-icons/fi'
import ReactConfetti from 'react-confetti'

const features = [
  {
    icon: FiCreditCard,
    title: 'Payment Gateway',
    description: 'Secure multi-channel payment processing with mada, Visa, and digital wallets',
    link: '/payment-gateway',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FiActivity,
    title: 'Hospital Management',
    description: 'Complete HMS with patient records, appointments, and billing integration',
    link: '/hospital',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: FiBriefcase,
    title: 'Smart Hospitality',
    description: 'Modern hotel management with IoT integration and guest experience',
    link: '/hospitality',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FiWifi,
    title: 'IoT Platform',
    description: 'Real-time device monitoring and management for smart buildings',
    link: '/iot',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: FiCpu,
    title: 'AI Platform',
    description: 'Advanced LLM capabilities with custom model training and analytics',
    link: '/ai',
    color: 'from-indigo-500 to-purple-500',
  },
]

const stats = [
  { label: 'Active Users', value: '50K+', icon: FiUsers },
  { label: 'Transactions/Day', value: '100K+', icon: FiTrendingUp },
  { label: 'Uptime SLA', value: '99.9%', icon: FiAward },
  { label: 'Countries', value: '15+', icon: FiGlobe },
]

const LandingPage: React.FC = () => {
  const [showConfetti, setShowConfetti] = React.useState(false)

  React.useEffect(() => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={200} />}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-primary-800/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="gradient-text">NCQ Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the future of integrated business solutions with our comprehensive platform demo
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/dashboard"
                className="btn-primary px-8 py-3 text-lg flex items-center justify-center space-x-2 group"
              >
                <span>Explore Dashboard</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('ncq-demo-tour-seen')
                  window.location.href = '/dashboard'
                }}
                className="btn-outline px-8 py-3 text-lg"
              >
                Start Interactive Tour
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-float" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary-300 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Capabilities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our integrated solutions designed to transform your business operations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link to={feature.link} className="block">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                    <div className="p-6">
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <div className="flex items-center text-primary-600 font-medium">
                        <span>Explore</span>
                        <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <FiZap className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of businesses leveraging NCQ Platform for growth
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Get Started Now</span>
              <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage