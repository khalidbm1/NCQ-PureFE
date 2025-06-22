'use client'

import React, { useState, useEffect } from 'react'
import { useTenant } from '../../../../lib/context/tenant-context'
import { billingApi } from '../../../../lib/api/tenants'
import { TenantSubscription } from '../../../../lib/types'
import { Card } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { 
  CreditCard, 
  Download, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  RefreshCw
} from 'lucide-react'

interface BillingHistory {
  invoices: {
    id: string
    amount: number
    currency: string
    status: string
    date: string
    pdfUrl: string
  }[]
  upcomingInvoice?: {
    amount: number
    currency: string
    date: string
  }
}

export default function OrganizationBillingPage() {
  const { currentTenant, currentMember, canManageBilling } = useTenant()
  const [subscription, setSubscription] = useState<TenantSubscription | null>(null)
  const [billingHistory, setBillingHistory] = useState<BillingHistory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    if (currentTenant && canManageBilling()) {
      loadBillingData()
    }
  }, [currentTenant])

  const loadBillingData = async () => {
    if (!currentTenant) return

    try {
      setIsLoading(true)
      const [subscriptionData, historyData] = await Promise.all([
        billingApi.getTenantSubscription(currentTenant.id),
        billingApi.getBillingHistory(currentTenant.id)
      ])
      setSubscription(subscriptionData)
      setBillingHistory(historyData)
    } catch (error) {
      console.error('Failed to load billing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlanChange = async (newPlan: string) => {
    if (!currentTenant || !subscription) return

    try {
      setIsUpdating(true)
      const updatedSubscription = await billingApi.updateSubscriptionPlan(currentTenant.id, newPlan)
      setSubscription(updatedSubscription)
    } catch (error) {
      console.error('Failed to update plan:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!currentTenant || !subscription) return

    try {
      setIsUpdating(true)
      const updatedSubscription = await billingApi.cancelSubscription(currentTenant.id, true)
      setSubscription(updatedSubscription)
      setShowCancelModal(false)
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReactivateSubscription = async () => {
    if (!currentTenant || !subscription) return

    try {
      setIsUpdating(true)
      const updatedSubscription = await billingApi.reactivateSubscription(currentTenant.id)
      setSubscription(updatedSubscription)
    } catch (error) {
      console.error('Failed to reactivate subscription:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const downloadInvoice = async (invoiceId: string) => {
    if (!currentTenant) return

    try {
      const blob = await billingApi.downloadInvoice(currentTenant.id, invoiceId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${invoiceId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download invoice:', error)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'trialing': return 'text-blue-600 bg-blue-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      case 'past_due': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'trialing': return <Clock className="h-5 w-5 text-blue-600" />
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-600" />
      case 'past_due': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        '1,000 requests/month',
        '10,000 tokens/month',
        'Basic models',
        'Community support'
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      description: 'For small teams and projects',
      features: [
        '50,000 requests/month',
        '500,000 tokens/month',
        'All models',
        'Email support',
        'Usage analytics'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 99,
      description: 'For growing businesses',
      features: [
        '200,000 requests/month',
        '2,000,000 tokens/month',
        'All models',
        'Priority support',
        'Advanced analytics',
        'Team management',
        'Custom integrations'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      description: 'For large organizations',
      features: [
        'Unlimited requests',
        'Unlimited tokens',
        'All models',
        'Dedicated support',
        'Custom models',
        'SOC 2 compliance',
        'SSO integration',
        'Custom contracts'
      ]
    }
  ]

  if (!canManageBilling()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to manage billing.</p>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
            <p className="text-gray-600">Manage your subscription and billing information.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={loadBillingData} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Current Subscription</h3>
              <p className="text-gray-600">Your current billing plan and status</p>
            </div>
            {getStatusIcon(subscription.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                  {subscription.status}
                </span>
                <span className="text-lg font-semibold text-gray-900 capitalize">
                  {subscription.plan} Plan
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {subscription.autoRenew ? 'Auto-renewal enabled' : 'Auto-renewal disabled'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Current Period</p>
              <p className="text-sm text-gray-600">
                {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
              {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
                <p className="text-sm text-blue-600 font-medium">
                  Trial ends on {new Date(subscription.trialEnd).toLocaleDateString()}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Billing Email</p>
              <p className="text-sm text-gray-600">{subscription.billingEmail}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            {subscription.status === 'cancelled' ? (
              <Button onClick={handleReactivateSubscription} disabled={isUpdating}>
                Reactivate Subscription
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(true)}
                disabled={isUpdating}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Available Plans */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-6 ${
                subscription?.plan === plan.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {subscription?.plan === plan.id ? (
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button
                  onClick={() => handlePlanChange(plan.id)}
                  disabled={isUpdating}
                  variant={plan.id === 'pro' ? 'default' : 'outline'}
                  className="w-full"
                >
                  {subscription && plan.price > plans.find(p => p.id === subscription.plan)?.price! 
                    ? 'Upgrade' 
                    : subscription && plan.price < plans.find(p => p.id === subscription.plan)?.price!
                    ? 'Downgrade'
                    : 'Select Plan'
                  }
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Billing History */}
      {billingHistory && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
            {billingHistory.upcomingInvoice && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Next Payment</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(billingHistory.upcomingInvoice.amount, billingHistory.upcomingInvoice.currency)} on {new Date(billingHistory.upcomingInvoice.date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {billingHistory.invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billingHistory.invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' ? 'text-green-800 bg-green-100' :
                          invoice.status === 'pending' ? 'text-yellow-800 bg-yellow-100' :
                          'text-red-800 bg-red-100'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Billing History</h3>
              <p className="text-gray-600">Your invoices will appear here once you start using a paid plan.</p>
            </div>
          )}
        </Card>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Subscription
              </Button>
              <Button
                onClick={handleCancelSubscription}
                disabled={isUpdating}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isUpdating ? 'Cancelling...' : 'Cancel Subscription'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}