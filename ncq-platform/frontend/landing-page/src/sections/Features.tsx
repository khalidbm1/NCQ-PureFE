import { motion } from 'framer-motion'
import { 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  BarChart3, 
  Lock,
  Cloud,
  Smartphone,
  HeadphonesIcon,
  Layers,
  RefreshCw,
  Award,
  ArrowRight
} from 'lucide-react'
import { Button } from '../components/Button'

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and security measures to protect your sensitive data.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with <100ms response times and global CDN.',
  },
  {
    icon: Globe,
    title: 'Saudi Compliant',
    description: 'Fully compliant with SAMA, MOH, and local regulatory requirements.',
  },
  {
    icon: Users,
    title: 'Multi-Tenant Architecture',
    description: 'Isolated environments for each client with shared infrastructure benefits.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time insights and predictive analytics to drive business decisions.',
  },
  {
    icon: Lock,
    title: 'Data Privacy',
    description: 'Your data stays in Saudi Arabia with full ownership and control.',
  },
  {
    icon: Cloud,
    title: 'Cloud Native',
    description: 'Built on modern cloud infrastructure for unlimited scalability.',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Native mobile apps and responsive design for all devices.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Local support team available round the clock in Arabic and English.',
  },
  {
    icon: Layers,
    title: 'API First',
    description: 'RESTful APIs and webhooks for seamless integrations.',
  },
  {
    icon: RefreshCw,
    title: 'Auto Updates',
    description: 'Regular updates and new features without any downtime.',
  },
  {
    icon: Award,
    title: 'ISO Certified',
    description: 'ISO 27001 and SOC 2 certified for maximum trust and reliability.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Why Choose NCQ Platform?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Built with enterprise needs in mind, designed for the Saudi market
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative"
            >
              <div className="relative p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:shadow-lg transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/5 group-hover:to-primary/5 rounded-xl transition-all duration-300"></div>
                
                <div className="relative">
                  <div className="inline-flex p-3 bg-primary/10 text-primary rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Ready to transform your business with cutting-edge technology?
          </p>
          <Button size="lg" className="group">
            Schedule a Demo
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}