import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiCreditCard, FiDollarSign, FiTrendingUp, FiShield,
  FiCheck, FiAlertCircle, FiRefreshCw, FiFilter
} from 'react-icons/fi'
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import toast from 'react-hot-toast'

// Mock data
const paymentMethods = [
  { name: 'mada', icon: '🇸🇦', transactions: 4521, amount: 892340 },
  { name: 'Visa', icon: '💳', transactions: 3210, amount: 645200 },
  { name: 'Mastercard', icon: '💳', transactions: 2890, amount: 578900 },
  { name: 'Apple Pay', icon: '🍎', transactions: 1567, amount: 298700 },
  { name: 'stc pay', icon: '📱', transactions: 987, amount: 187300 },
]

const recentTransactions = [
  { id: 'TXN-001', amount: 1250.00, method: 'mada', status: 'success', merchant: 'Hospital ABC', time: '2 min ago' },
  { id: 'TXN-002', amount: 3500.00, method: 'Visa', status: 'success', merchant: 'Grand Hotel', time: '5 min ago' },
  { id: 'TXN-003', amount: 750.00, method: 'Apple Pay', status: 'failed', merchant: 'Clinic XYZ', time: '8 min ago' },
  { id: 'TXN-004', amount: 2100.00, method: 'mada', status: 'processing', merchant: 'Hotel Plaza', time: '12 min ago' },
  { id: 'TXN-005', amount: 890.00, method: 'stc pay', status: 'success', merchant: 'Medical Center', time: '15 min ago' },
]

const hourlyData = [
  { time: '00:00', amount: 45000, transactions: 120 },
  { time: '04:00', amount: 32000, transactions: 85 },
  { time: '08:00', amount: 78000, transactions: 210 },
  { time: '12:00', amount: 125000, transactions: 340 },
  { time: '16:00', amount: 98000, transactions: 265 },
  { time: '20:00', amount: 87000, transactions: 235 },
  { time: '23:00', amount: 65000, transactions: 175 },
]

const PaymentGateway: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [processingDemo, setProcessingDemo] = useState(false)

  const simulatePayment = () => {
    setProcessingDemo(true)
    toast.loading('Processing payment...', { id: 'payment-demo' })
    
    setTimeout(() => {
      toast.success('Payment processed successfully!', { id: 'payment-demo' })
      setProcessingDemo(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Gateway</h1>
            <p className="text-gray-600 mt-1">
              Secure multi-channel payment processing platform
            </p>
          </div>
          <button
            onClick={simulatePayment}
            disabled={processingDemo}
            className="btn-primary px-6 py-2 flex items-center space-x-2"
            data-tooltip="Simulate a payment transaction"
          >
            <FiCreditCard />
            <span>Process Payment</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiDollarSign className="w-8 h-8 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+18.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">SAR 2.8M</h3>
          <p className="text-sm text-gray-600">Today's Volume</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiCreditCard className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">15,432</h3>
          <p className="text-sm text-gray-600">Transactions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiCheck className="w-8 h-8 text-emerald-600" />
            <span className="text-sm text-emerald-600 font-medium">99.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">99.2%</h3>
          <p className="text-sm text-gray-600">Success Rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiShield className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-purple-600 font-medium">0.02%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">0.02%</h3>
          <p className="text-sm text-gray-600">Fraud Rate</p>
        </motion.div>
      </div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.name}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setSelectedMethod(method.name)
                toast.success(`Viewing ${method.name} details`)
              }}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${selectedMethod === method.name 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              data-tooltip={`Click to view ${method.name} analytics`}
            >
              <div className="text-2xl mb-2">{method.icon}</div>
              <h4 className="font-semibold text-gray-900">{method.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{method.transactions.toLocaleString()} txns</p>
              <p className="text-xs text-gray-500">SAR {(method.amount / 1000).toFixed(0)}K</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `SAR ${value.toLocaleString()}`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#0284c7" fillOpacity={1} fill="url(#colorVolume)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1">
              <FiFilter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => toast.info(`Transaction ${txn.id} details`)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${txn.status === 'success' ? 'bg-green-100' : ''}
                    ${txn.status === 'failed' ? 'bg-red-100' : ''}
                    ${txn.status === 'processing' ? 'bg-yellow-100' : ''}
                  `}>
                    {txn.status === 'success' && <FiCheck className="w-5 h-5 text-green-600" />}
                    {txn.status === 'failed' && <FiAlertCircle className="w-5 h-5 text-red-600" />}
                    {txn.status === 'processing' && <FiRefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{txn.merchant}</p>
                    <p className="text-xs text-gray-500">{txn.id} • {txn.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">SAR {txn.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{txn.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Security Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-sm p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <FiShield className="w-5 h-5" />
              <span>Enterprise Security Features</span>
            </h3>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <FiCheck className="w-4 h-4" />
                <span className="text-sm">PCI-DSS Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCheck className="w-4 h-4" />
                <span className="text-sm">3D Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCheck className="w-4 h-4" />
                <span className="text-sm">Tokenization</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCheck className="w-4 h-4" />
                <span className="text-sm">Fraud Detection</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentGateway