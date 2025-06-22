import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Shield, 
  Building2, 
  Cpu, 
  Hotel,
  Brain,
  ArrowRight,
  Check,
  Zap,
  Lock,
  Globe
} from 'lucide-react'
import { Button } from '../components/Button'
import { useTranslation } from 'react-i18next'

export function Products() {
  const { t } = useTranslation()

  const products = [
    {
      id: 'payment-gateway',
      name: t('products.paymentGateway.name'),
      description: t('products.paymentGateway.description'),
      icon: CreditCard,
      color: 'from-blue-500 to-cyan-500',
      status: 'live',
      features: t('products.paymentGateway.features', { returnObjects: true }) as string[],
      stats: {
        transactions: '10M+',
        uptime: '99.99%',
        currencies: '15+'
      }
    },
    {
      id: 'enterprise-blockchain',
      name: t('products.blockchain.name'),
      description: t('products.blockchain.description'),
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      status: 'coming-soon',
      features: t('products.blockchain.features', { returnObjects: true }) as string[],
      stats: {
        industries: '10+',
      transactions: '5M+',
      nodes: '100+'
    }
  },
    {
      id: 'hospital-management',
      name: t('products.hospitalManagement.name'),
      description: t('products.hospitalManagement.description'),
      icon: Building2,
      color: 'from-purple-500 to-pink-500',
      status: 'live',
      features: t('products.hospitalManagement.features', { returnObjects: true }) as string[],
      stats: {
      clinics: '200+',
      patients: '500K+',
      efficiency: '+40%'
    }
  },
    {
      id: 'iot-platform',
      name: t('products.iot.name'),
      description: t('products.iot.description'),
      icon: Cpu,
      color: 'from-orange-500 to-red-500',
      status: 'development',
      features: t('products.iot.features', { returnObjects: true }) as string[],
      stats: {
      devices: '100K+',
      dataPoints: '1B+',
      latency: '<100ms'
    }
  },
    {
      id: 'smart-hospitality',
      name: t('products.hospitality.name'),
      description: t('products.hospitality.description'),
      icon: Hotel,
      color: 'from-indigo-500 to-purple-500',
      status: 'coming-soon',
      features: t('products.hospitality.features', { returnObjects: true }) as string[],
      stats: {
        hotels: '75+',
        rooms: '10K+',
        satisfaction: '95%'
      }
    },
    {
      id: 'ncq-llm',
      name: t('products.llm.name'),
      description: t('products.llm.description'),
      icon: Brain,
      color: 'from-violet-500 to-purple-600',
      status: 'live',
      features: t('products.llm.features', { returnObjects: true }) as string[],
      stats: {
        models: '10+',
        requests: '5M+',
        accuracy: '98.5%'
      }
    }
  ]

  return (
    <section id="products" className="py-20 bg-gray-50 dark:bg-gray-900">
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
            Our Product Suite
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Comprehensive solutions designed to digitally transform every aspect of your business
          </p>
        </motion.div>

        {/* Products grid */}
        <div className="space-y-16">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
                {/* Product info */}
                <div className={index % 2 === 1 ? 'lg:pl-12' : 'lg:pr-12'}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${product.color}`}>
                      <product.icon className="w-6 h-6 text-white" />
                    </div>
                    {product.status === 'live' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 rtl:ml-2 rtl:mr-0 animate-pulse"></div>
                        {t('products.status.live')}
                      </span>
                    )}
                    {product.status === 'coming-soon' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {t('products.status.comingSoon')}
                      </span>
                    )}
                    {product.status === 'development' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        {t('products.status.development')}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4">{product.name}</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {product.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {Object.entries(product.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{t(`products.stats.${key}`)}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex flex-wrap gap-3">
                    {product.status === 'live' ? (
                      <>
                        {product.id === 'ncq-llm' ? (
                          <>
                            <Button 
                              className="group"
                              onClick={() => window.location.href = 'http://localhost:3003'}
                            >
                              {t('common.getStarted')}
                              <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => window.location.href = 'http://localhost:3003/docs'}
                            >
                              {t('common.viewAll')} API
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              className="group"
                              onClick={() => window.location.href = 'http://localhost:3002'}
                            >
                              {t('products.cta.accessUserPortal')}
                              <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => window.location.href = 'http://localhost:3001'}
                            >
                              {t('products.cta.adminDashboard')}
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <Button 
                          className="group"
                          onClick={() => window.location.href = '#contact'}
                        >
                          {t('products.cta.getEarlyAccess')}
                          <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                        </Button>
                        <Button 
                          variant="outline"
                          disabled
                        >
                          {product.status === 'coming-soon' ? t('products.status.comingSoon') : t('products.status.development')}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Product visual */}
                <div className={`mt-10 lg:mt-0 ${index % 2 === 1 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${product.color} shadow-2xl`}>
                    <div className="absolute inset-0 bg-white/10 dark:bg-black/10 rounded-2xl backdrop-blur-sm"></div>
                    <div className="relative grid grid-cols-2 gap-4">
                      {/* Mock UI elements */}
                      <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <div className="w-full h-2 bg-white/30 rounded mb-2"></div>
                        <div className="w-3/4 h-2 bg-white/30 rounded"></div>
                      </div>
                      <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <div className="w-full h-2 bg-white/30 rounded mb-2"></div>
                        <div className="w-1/2 h-2 bg-white/30 rounded"></div>
                      </div>
                      <div className="bg-white/20 backdrop-blur rounded-lg p-4 col-span-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-16 bg-white/30 rounded"></div>
                          <div className="h-16 bg-white/30 rounded"></div>
                          <div className="h-16 bg-white/30 rounded"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Feature badges */}
                    <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                      <Zap className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                      <Lock className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                      <Globe className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}