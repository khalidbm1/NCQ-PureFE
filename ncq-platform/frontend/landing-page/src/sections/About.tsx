import { motion } from 'framer-motion'
import { Target, Lightbulb, Shield, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function About() {
  const { t } = useTranslation()

  const stats = [
    { value: t('about.stats.clients.value'), label: t('about.stats.clients.label') },
    { value: t('about.stats.transactions.value'), label: t('about.stats.transactions.label') },
    { value: t('about.stats.uptime.value'), label: t('about.stats.uptime.label') },
    { value: t('about.stats.team.value'), label: t('about.stats.team.label') },
    { value: t('about.stats.saudi.value'), label: t('about.stats.saudi.label') }
  ]

  const values = [
    { icon: Lightbulb, title: t('about.values.innovation.title'), description: t('about.values.innovation.desc') },
    { icon: Shield, title: t('about.values.trust.title'), description: t('about.values.trust.desc') },
    { icon: Target, title: t('about.values.excellence.title'), description: t('about.values.excellence.desc') },
    { icon: TrendingUp, title: t('about.values.growth.title'), description: t('about.values.growth.desc') }
  ]

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('about.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('about.subtitle')}
          </p>
        </motion.div>

        {/* Made by Saudi Hands Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-green-600/20 dark:from-green-400/20 dark:to-green-500/30 backdrop-blur-sm border border-green-200 dark:border-green-600/30 rounded-full px-6 py-3">
            <span className="text-2xl">🇸🇦</span>
            <span className="text-lg font-semibold text-green-700 dark:text-green-300">
              {t('about.stats.madeBy.label')}
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 sm:p-12 mb-20"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">{t('about.vision.title')}</h3>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {t('about.vision.description')}
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12">{t('about.values.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex p-4 bg-gradient-to-r from-primary/10 to-primary/20 text-primary rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{value.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}