import { motion } from 'framer-motion'
import { 
  Code2, 
  Palette, 
  CloudCog, 
  Users2, 
  GraduationCap,
  Gauge,
  ShieldCheck,
  Lightbulb
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Services() {
  const { t } = useTranslation()

  const services = [
    {
      icon: Code2,
      title: t('services.customDev.title'),
      description: t('services.customDev.description'),
      items: t('services.customDev.items', { returnObjects: true }) as string[]
    },
    {
      icon: CloudCog,
      title: t('services.cloudMigration.title'),
      description: t('services.cloudMigration.description'),
      items: t('services.cloudMigration.items', { returnObjects: true }) as string[]
    },
    {
      icon: Users2,
      title: t('services.consulting.title'),
      description: t('services.consulting.description'),
      items: t('services.consulting.items', { returnObjects: true }) as string[]
    },
    {
      icon: Palette,
      title: t('services.uiux.title'),
      description: t('services.uiux.description'),
      items: t('services.uiux.items', { returnObjects: true }) as string[]
    },
    {
      icon: ShieldCheck,
      title: t('services.security.title'),
      description: t('services.security.description'),
      items: t('services.security.items', { returnObjects: true }) as string[]
    },
    {
      icon: GraduationCap,
      title: t('services.training.title'),
      description: t('services.training.description'),
      items: t('services.training.items', { returnObjects: true }) as string[]
    }
  ]
  return (
    <section id="solutions" className="py-20 bg-gray-50 dark:bg-gray-900">
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
            {t('services.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('services.subtitle')}
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Icon */}
                <div className="inline-flex p-3 bg-gradient-to-r from-primary/10 to-primary/20 text-primary rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>

                {/* Service items */}
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative element */}
              <div className="h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </motion.div>
          ))}
        </div>

        {/* Process section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-center mb-12">{t('services.process.title')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Lightbulb, title: t('services.process.discovery.title'), desc: t('services.process.discovery.desc') },
              { icon: Palette, title: t('services.process.design.title'), desc: t('services.process.design.desc') },
              { icon: Code2, title: t('services.process.development.title'), desc: t('services.process.development.desc') },
              { icon: Gauge, title: t('services.process.deployment.title'), desc: t('services.process.deployment.desc') }
            ].map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="relative">
                  <div className="inline-flex p-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full mb-4">
                    <step.icon className="w-8 h-8" />
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/40 to-primary/20"></div>
                  )}
                </div>
                <h4 className="font-semibold mb-1">{step.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}