import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { CreditCard, Play, Pause, X, ArrowUpCircle, Download, Calendar, DollarSign, Package, Users, Activity } from 'lucide-react';

interface CustomerData {
  subscription: {
    id: string;
    planName: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
    nextBillingDate: string;
    currentUsage: {
      transactions: number;
      users: number;
      storage: number;
      apiCalls: number;
    };
    limits: {
      transactions: number;
      users: number;
      storage: number;
      apiCalls: number;
    };
    cost: number;
  };
  paymentMethod: {
    type: string;
    last4: string;
    expiryDate: string;
  };
  billingHistory: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    description: string;
  }>;
}

const plans = [
  {
    id: 'starter',
    name: 'Blockchain Starter',
    price: 99,
    features: ['10,000 transactions/month', '5 users', '10GB storage', 'Basic support'],
    modules: ['Basic Blockchain']
  },
  {
    id: 'professional',
    name: 'Blockchain Professional',
    price: 499,
    features: ['100,000 transactions/month', '25 users', '100GB storage', 'Premium support'],
    modules: ['Basic Blockchain', 'Manufacturing', 'Healthcare']
  },
  {
    id: 'enterprise',
    name: 'Blockchain Enterprise',
    price: 2999,
    features: ['1,000,000 transactions/month', '100 users', '1TB storage', 'White-glove support'],
    modules: ['All Modules', 'Custom Integration', 'Dedicated Support']
  }
];

export default function CustomerPortal() {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomerData({
        subscription: {
          id: 'SUB_123456',
          planName: 'Blockchain Professional',
          status: 'ACTIVE',
          nextBillingDate: '2024-07-15',
          currentUsage: {
            transactions: 45678,
            users: 18,
            storage: 67,
            apiCalls: 234567
          },
          limits: {
            transactions: 100000,
            users: 25,
            storage: 100,
            apiCalls: 1000000
          },
          cost: 499
        },
        paymentMethod: {
          type: 'Visa',
          last4: '4242',
          expiryDate: '12/25'
        },
        billingHistory: [
          { id: 'INV_001', date: '2024-06-15', amount: 499, status: 'Paid', description: 'Monthly subscription' },
          { id: 'INV_002', date: '2024-05-15', amount: 499, status: 'Paid', description: 'Monthly subscription' },
          { id: 'INV_003', date: '2024-04-15', amount: 499, status: 'Paid', description: 'Monthly subscription' },
          { id: 'INV_004', date: '2024-03-15', amount: 499, status: 'Paid', description: 'Monthly subscription' }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleCancelSubscription = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    // Simulate API call
    console.log('Cancelling subscription with reason:', cancellationReason);
    
    if (customerData) {
      setCustomerData({
        ...customerData,
        subscription: {
          ...customerData.subscription,
          status: 'CANCELLED'
        }
      });
    }
    
    setShowCancelModal(false);
    setCancellationReason('');
  };

  const handlePauseSubscription = async () => {
    // Simulate API call
    if (customerData) {
      setCustomerData({
        ...customerData,
        subscription: {
          ...customerData.subscription,
          status: 'SUSPENDED'
        }
      });
    }
  };

  const handleResumeSubscription = async () => {
    // Simulate API call
    if (customerData) {
      setCustomerData({
        ...customerData,
        subscription: {
          ...customerData.subscription,
          status: 'ACTIVE'
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  const usagePercentage = (current: number, limit: number) => (current / limit) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Customer Portal - NCQ Enterprise Blockchain</title>
        <meta name="description" content="Manage your NCQ Enterprise Blockchain subscription" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
              <p className="text-sm text-gray-500">Manage your NCQ Enterprise Blockchain subscription</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                customerData?.subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                customerData?.subscription.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {customerData?.subscription.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Current Plan Overview */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Current Subscription</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{customerData?.subscription.planName}</h3>
                <p className="text-gray-500">Next billing: {customerData?.subscription.nextBillingDate}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${customerData?.subscription.cost}/month</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {customerData?.subscription.status === 'ACTIVE' && (
                <>
                  <button
                    onClick={handlePauseSubscription}
                    className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Subscription
                  </button>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <ArrowUpCircle className="h-4 w-4 mr-2" />
                    Change Plan
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </button>
                </>
              )}
              
              {customerData?.subscription.status === 'SUSPENDED' && (
                <button
                  onClick={handleResumeSubscription}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume Subscription
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Usage Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-gray-500">Transactions</span>
            </div>
            <div className="mb-2">
              <p className="text-2xl font-bold text-gray-900">
                {customerData?.subscription.currentUsage.transactions.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                of {customerData?.subscription.limits.transactions.toLocaleString()}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ 
                  width: `${usagePercentage(
                    customerData?.subscription.currentUsage.transactions || 0,
                    customerData?.subscription.limits.transactions || 1
                  )}%` 
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 text-green-600" />
              <span className="text-sm text-gray-500">Users</span>
            </div>
            <div className="mb-2">
              <p className="text-2xl font-bold text-gray-900">
                {customerData?.subscription.currentUsage.users}
              </p>
              <p className="text-sm text-gray-500">
                of {customerData?.subscription.limits.users}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ 
                  width: `${usagePercentage(
                    customerData?.subscription.currentUsage.users || 0,
                    customerData?.subscription.limits.users || 1
                  )}%` 
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-6 w-6 text-purple-600" />
              <span className="text-sm text-gray-500">Storage (GB)</span>
            </div>
            <div className="mb-2">
              <p className="text-2xl font-bold text-gray-900">
                {customerData?.subscription.currentUsage.storage}
              </p>
              <p className="text-sm text-gray-500">
                of {customerData?.subscription.limits.storage}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ 
                  width: `${usagePercentage(
                    customerData?.subscription.currentUsage.storage || 0,
                    customerData?.subscription.limits.storage || 1
                  )}%` 
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-6 w-6 text-orange-600" />
              <span className="text-sm text-gray-500">API Calls</span>
            </div>
            <div className="mb-2">
              <p className="text-2xl font-bold text-gray-900">
                {customerData?.subscription.currentUsage.apiCalls.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                of {customerData?.subscription.limits.apiCalls.toLocaleString()}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full" 
                style={{ 
                  width: `${usagePercentage(
                    customerData?.subscription.currentUsage.apiCalls || 0,
                    customerData?.subscription.limits.apiCalls || 1
                  )}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Payment Method & Billing History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {customerData?.paymentMethod.type} ending in {customerData?.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-gray-500">Expires {customerData?.paymentMethod.expiryDate}</p>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                Update Payment Method
              </button>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {customerData?.billingHistory.map((invoice) => (
                <div key={invoice.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.description}</p>
                    <p className="text-sm text-gray-500">{invoice.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-900">${invoice.amount}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Subscription</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (required)
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Please tell us why you're cancelling..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{plan.name}</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-2">${plan.price}/month</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                  <button 
                    className={`w-full mt-4 px-4 py-2 rounded-md ${
                      plan.name === customerData?.subscription.planName 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={plan.name === customerData?.subscription.planName}
                  >
                    {plan.name === customerData?.subscription.planName ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}