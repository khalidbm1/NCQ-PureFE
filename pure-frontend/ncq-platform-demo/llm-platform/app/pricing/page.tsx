'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Check, 
  Zap, 
  Shield, 
  Users, 
  HeadphonesIcon,
  ArrowRight,
  Calculator
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/useTranslation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Currency from '@/components/ui/Currency'
import { formatSARAmount } from '@/lib/ncq-payment'

interface PricingPlan {
  name: string
  price: number | string
  description: string
  features: string[]
  highlighted: boolean
  cta: string
}

export default function PricingPage() {
  const { t, language } = useI18n()
  const router = useRouter()
  const isRTL = language === 'ar'
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  
  const plans: PricingPlan[] = [
    {
      name: t('pricing.plans.free.name'),
      price: 0,
      description: t('pricing.plans.free.description'),
      features: [
        t('pricing.features.requests', { count: '1,000' }),
        t('pricing.features.tokens', { count: '10,000' }),
        t('pricing.features.storage', { size: '100MB' }),
        t('pricing.features.communitySupport'),
        t('pricing.features.basicModels')
      ],
      highlighted: false,
      cta: t('pricing.getStarted')
    },
    {
      name: t('pricing.plans.starter.name'),
      price: billingPeriod === 'monthly' ? 74.99 : 719.90, // SAR pricing
      description: t('pricing.plans.starter.description'),
      features: [
        t('pricing.features.requests', { count: '10,000' }),
        t('pricing.features.tokens', { count: '100,000' }),
        t('pricing.features.storage', { size: '1GB' }),
        t('pricing.features.emailSupport'),
        t('pricing.features.allModels'),
        t('pricing.features.apiDashboard')
      ],
      highlighted: false,
      cta: t('pricing.startTrial')
    },
    {
      name: t('pricing.plans.pro.name'),
      price: billingPeriod === 'monthly' ? 187.49 : 1799.70, // SAR pricing
      description: t('pricing.plans.pro.description'),
      features: [
        t('pricing.features.requests', { count: '1,000,000' }),
        t('pricing.features.tokens', { count: '10,000,000' }),
        t('pricing.features.storage', { size: '10GB' }),
        t('pricing.features.prioritySupport'),
        t('pricing.features.customModels'),
        t('pricing.features.teamCollaboration'),
        t('pricing.features.advancedAnalytics'),
        t('pricing.features.sla99')
      ],
      highlighted: true,
      cta: t('pricing.startTrial')
    },
    {
      name: t('pricing.plans.enterprise.name'),
      price: t('pricing.custom'),
      description: t('pricing.plans.enterprise.description'),
      features: [
        t('pricing.features.unlimitedRequests'),
        t('pricing.features.unlimitedTokens'),
        t('pricing.features.unlimitedStorage'),
        t('pricing.features.dedicatedSupport'),
        t('pricing.features.customSLA'),
        t('pricing.features.onPremise'),
        t('pricing.features.customIntegrations'),
        t('pricing.features.dedicatedInfra')
      ],
      highlighted: false,
      cta: t('pricing.contactSales')
    }
  ]
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NCQ LLM
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
                {t('nav.signIn')}
              </Link>
              <Link href="/auth/signup">
                <Button>{t('nav.getStarted')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('pricing.hero.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {t('pricing.hero.subtitle')}
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={billingPeriod === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}>
              {t('pricing.monthly')}
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={billingPeriod === 'annual' ? 'text-gray-900 font-medium' : 'text-gray-500'}>
              {t('pricing.annual')}
            </span>
            {billingPeriod === 'annual' && (
              <span className="text-green-600 text-sm font-medium">{t('pricing.save20')}</span>
            )}
          </div>
          
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={plan.highlighted ? 'border-blue-600 border-2 shadow-lg' : ''}>
                {plan.highlighted && (
                  <div className="bg-blue-600 text-white text-sm font-medium py-1 text-center">
                    {t('pricing.mostPopular')}
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    {typeof plan.price === 'number' ? (
                      <>
                        <span className="text-3xl font-bold">
                          {formatSARAmount(plan.price)}
                        </span>
                        <span className="text-gray-500">/{billingPeriod === 'monthly' ? t('pricing.month') : t('pricing.year')}</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">{plan.price}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => {
                      if (plan.name === t('pricing.plans.enterprise.name')) {
                        // For enterprise, scroll to contact section or open contact modal
                        window.location.href = 'mailto:sales@ncq-llm.com?subject=Enterprise Plan Inquiry'
                      } else {
                        // For other plans, go to signup
                        router.push('/auth/signup')
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('pricing.whyChoose.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">{t('pricing.whyChoose.performance.title')}</h3>
              <p className="text-sm text-gray-600">{t('pricing.whyChoose.performance.description')}</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">{t('pricing.whyChoose.security.title')}</h3>
              <p className="text-sm text-gray-600">{t('pricing.whyChoose.security.description')}</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">{t('pricing.whyChoose.scalability.title')}</h3>
              <p className="text-sm text-gray-600">{t('pricing.whyChoose.scalability.description')}</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">{t('pricing.whyChoose.support.title')}</h3>
              <p className="text-sm text-gray-600">{t('pricing.whyChoose.support.description')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Calculator CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">{t('pricing.calculator.title')}</h2>
          <p className="text-gray-600 mb-6">{t('pricing.calculator.description')}</p>
          <Button size="lg" onClick={() => router.push('/dashboard/billing')}>
            {t('pricing.calculator.button')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('pricing.faq.title')}</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-2">{t('pricing.faq.q1')}</h3>
              <p className="text-gray-600">{t('pricing.faq.a1')}</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-2">{t('pricing.faq.q2')}</h3>
              <p className="text-gray-600">{t('pricing.faq.a2')}</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-2">{t('pricing.faq.q3')}</h3>
              <p className="text-gray-600">{t('pricing.faq.a3')}</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-2">{t('pricing.faq.q4')}</h3>
              <p className="text-gray-600">{t('pricing.faq.a4')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}