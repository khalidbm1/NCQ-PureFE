'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Download, 
  Check, 
  AlertCircle,
  Plus,
  Calendar,
  Receipt,
  Smartphone,
  Building2,
  Banknote
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/useTranslation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { NCQPaymentClient, SAUDI_PAYMENT_METHODS, formatSARAmount } from '@/lib/ncq-payment'

export default function BillingPage() {
  const { t, language } = useI18n()
  const isRTL = language === 'ar'
  const [showAddCard, setShowAddCard] = useState(false)
  
  // Mock data - would come from API
  const subscription = {
    plan: 'Pro',
    status: 'active',
    price: 187.49,
    currency: 'SAR',
    nextBillingDate: '2025-07-01',
    features: [
      '1,000,000 API requests/month',
      '10,000,000 tokens/month',
      '10GB storage',
      'Priority support',
      'Custom models',
      'Team collaboration'
    ]
  }
  
  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true
    },
    {
      id: '2',
      type: 'mada',
      brand: 'MADA',
      last4: '9876',
      expiryMonth: 8,
      expiryYear: 2027,
      isDefault: false
    },
    {
      id: '3',
      type: 'stc_pay',
      brand: 'STC Pay',
      phone: '+966501234567',
      isDefault: false
    }
  ]
  
  const invoices = [
    { id: '1', amount: 187.49, currency: 'SAR', date: '2025-06-01', status: 'paid', downloadUrl: '#' },
    { id: '2', amount: 187.49, currency: 'SAR', date: '2025-05-01', status: 'paid', downloadUrl: '#' },
    { id: '3', amount: 187.49, currency: 'SAR', date: '2025-04-01', status: 'paid', downloadUrl: '#' },
    { id: '4', amount: 187.49, currency: 'SAR', date: '2025-03-01', status: 'paid', downloadUrl: '#' },
  ]
  
  const plans = [
    {
      name: 'Free',
      price: 0,
      currency: 'SAR',
      features: [
        '1,000 API requests/month',
        '10,000 tokens/month',
        '100MB storage',
        'Community support'
      ]
    },
    {
      name: 'Starter',
      price: 74.99,
      currency: 'SAR',
      features: [
        '10,000 API requests/month',
        '100,000 tokens/month',
        '1GB storage',
        'Email support'
      ]
    },
    {
      name: 'Pro',
      price: 187.49,
      currency: 'SAR',
      current: true,
      features: [
        '1,000,000 API requests/month',
        '10,000,000 tokens/month',
        '10GB storage',
        'Priority support',
        'Custom models',
        'Team collaboration'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      currency: 'SAR',
      features: [
        'Unlimited API requests',
        'Unlimited tokens',
        'Unlimited storage',
        'Dedicated support',
        'Custom models',
        'SLA guarantee',
        'On-premise deployment'
      ]
    }
  ]
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.billing.title')}</h1>
        <p className="text-gray-600 mt-1">{t('dashboard.billing.subtitle')}</p>
      </div>
      
      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.billing.currentPlan.title')}</CardTitle>
              <CardDescription>{t('dashboard.billing.currentPlan.subtitle')}</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatCurrency(subscription.price, subscription.currency)}</p>
              <p className="text-sm text-gray-500">/{t('dashboard.billing.perMonth')}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm font-medium">{t('dashboard.billing.plan')}</span>
              <span className="text-sm">{subscription.plan}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm font-medium">{t('dashboard.billing.status')}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {t('dashboard.billing.active')}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm font-medium">{t('dashboard.billing.nextBilling')}</span>
              <span className="text-sm">{formatDate(subscription.nextBillingDate)}</span>
            </div>
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-3">{t('dashboard.billing.features')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {subscription.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Methods */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.billing.paymentMethods.title')}</CardTitle>
              <CardDescription>{t('dashboard.billing.paymentMethods.subtitle')}</CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowAddCard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('dashboard.billing.paymentMethods.add')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center">
                    {method.type === 'stc_pay' ? (
                      <Smartphone className="h-6 w-6 text-purple-600" />
                    ) : method.type === 'mada' ? (
                      <CreditCard className="h-6 w-6 text-green-600" />
                    ) : (
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {method.type === 'stc_pay' ? (
                        `${method.brand} ${method.phone}`
                      ) : (
                        `${method.brand} •••• ${method.last4}`
                      )}
                    </p>
                    {method.type !== 'stc_pay' && (
                      <p className="text-sm text-gray-500">
                        {t('dashboard.billing.expires')} {method.expiryMonth}/{method.expiryYear}
                      </p>
                    )}
                    {method.type === 'stc_pay' && (
                      <p className="text-sm text-gray-500">
                        Digital Wallet
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {method.isDefault && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {t('dashboard.billing.default')}
                    </span>
                  )}
                  <Button variant="ghost" size="sm">
                    {t('dashboard.billing.remove')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Invoices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('dashboard.billing.invoices.title')}</CardTitle>
          <CardDescription>{t('dashboard.billing.invoices.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t('dashboard.billing.invoices.date')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t('dashboard.billing.invoices.amount')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t('dashboard.billing.invoices.status')}
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                    {t('dashboard.billing.invoices.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="py-3 px-4 text-sm">{formatDate(invoice.date)}</td>
                    <td className="py-3 px-4 text-sm">{formatSARAmount(invoice.amount)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t('dashboard.billing.paid')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        {t('dashboard.billing.download')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-6">{t('dashboard.billing.plans.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.current ? 'border-blue-600 border-2' : ''}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4">
                  {typeof plan.price === 'number' ? (
                    <>
                      <span className="text-3xl font-bold">{formatSARAmount(plan.price)}</span>
                      <span className="text-gray-500">/{t('dashboard.billing.month')}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">{plan.price}</span>
                  )}
                </div>
                {plan.current && (
                  <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {t('dashboard.billing.currentPlan')}
                  </span>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-6" 
                  variant={plan.current ? 'outline' : 'default'}
                  disabled={plan.current}
                >
                  {plan.current ? t('dashboard.billing.currentPlan') : t('dashboard.billing.upgrade')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}