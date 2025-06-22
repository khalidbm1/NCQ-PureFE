import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Button } from '../components/Button'
import { useTranslation } from 'react-i18next'

export function Pricing() {
  const { t } = useTranslation()

  const plans = [
    {
      name: t('pricing.starter.name'),
      description: t('pricing.starter.description'),
      price: '2,999',
      currency: t('pricing.currency'),
      period: t('pricing.perMonth'),
      popular: false,
      features: (t('pricing.starter.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => ({
        name: feature,
        included: index < 5
      }))
    },
    {
      name: t('pricing.professional.name'),
      description: t('pricing.professional.description'),
      price: '9,999',
      currency: t('pricing.currency'),
      period: t('pricing.perMonth'),
      popular: true,
      badge: t('pricing.professional.badge'),
      features: (t('pricing.professional.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => ({
        name: feature,
        included: index < 7
      }))
    },
    {
      name: t('pricing.enterprise.name'),
      description: t('pricing.enterprise.description'),
      price: t('pricing.enterprise.price'),
      currency: '',
      period: '',
      popular: false,
      features: (t('pricing.enterprise.features', { returnObjects: true }) as string[]).map((feature: string) => ({
        name: feature,
        included: true
      }))
    }
  ]
  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-800">
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose the plan that fits your needs. All plans include our core features.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl ${
                plan.popular 
                  ? 'bg-gradient-to-b from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10' 
                  : 'bg-gray-50 dark:bg-gray-900'
              } p-8 ${plan.popular ? 'ring-2 ring-primary shadow-xl' : 'shadow-lg'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 rtl:left-auto rtl:right-1/2 rtl:translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                
                <div className="flex items-baseline justify-center">
                  {plan.price !== t('pricing.enterprise.price') ? (
                    <>
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2 rtl:mr-2 rtl:ml-0">{plan.currency}{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold">{plan.price}</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature: any) => (
                  <li key={feature.name} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button 
                className="w-full" 
                variant={plan.popular ? 'default' : 'outline'}
                size="lg"
              >
                {plan.name === t('pricing.starter.name') ? t('pricing.starter.cta') :
                 plan.name === t('pricing.professional.name') ? t('pricing.professional.cta') :
                 t('pricing.enterprise.cta')}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All prices are in Saudi Riyals (SAR) and exclude VAT. 
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            No credit card required for 14-day free trial • Cancel anytime • No setup fees
          </p>
        </motion.div>
      </div>
    </section>
  )
}