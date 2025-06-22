import { motion } from 'framer-motion'
import { ArrowRight, Users, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '../components/Button'
import { useTranslation } from 'react-i18next'

export function QuickAccess() {
  const { t } = useTranslation()
  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('quickAccess.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('quickAccess.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* User Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full">
                {t('products.status.live')}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-3">{t('quickAccess.userPortal.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('quickAccess.userPortal.description')}
            </p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>{t('quickAccess.userPortal.feature1')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>{t('quickAccess.userPortal.feature2')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full group" 
                onClick={() => window.location.href = 'http://localhost:3002'}
              >
                {t('quickAccess.userPortal.button')}
                <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                {t('quickAccess.userPortal.demo')}
              </p>
            </div>
          </motion.div>

          {/* Admin Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full">
                {t('products.status.live')}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-3">{t('quickAccess.adminDashboard.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('quickAccess.adminDashboard.description')}
            </p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Zap className="w-4 h-4 text-purple-500" />
                <span>{t('quickAccess.adminDashboard.feature1')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Zap className="w-4 h-4 text-red-500" />
                <span>{t('quickAccess.adminDashboard.feature2')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full group" 
                onClick={() => window.location.href = 'http://localhost:3001'}
              >
                {t('quickAccess.adminDashboard.button')}
                <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                {t('quickAccess.adminDashboard.demo')}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {t('quickAccess.footer')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}