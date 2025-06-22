import React, { useState } from 'react'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')

  // Navigation items
  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: '📊' },
    { name: 'Payment Gateway', id: 'payment', icon: '💳' },
    { name: 'Hospital Management', id: 'hospital', icon: '🏥' },
    { name: 'Smart Hospitality', id: 'hospitality', icon: '🏨' },
    { name: 'IoT Platform', id: 'iot', icon: '📡' },
    { name: 'AI Platform', id: 'ai', icon: '🤖' },
  ]

  // Tab Navigation Component
  const TabNavigation = ({ tabs, activeTab, setActiveTab }) => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </nav>
    </div>
  )

  // Sticky Note Component
  const StickyNote = () => (
    <div className="fixed top-4 right-4 z-50 bg-yellow-200 border-2 border-yellow-300 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-yellow-800">🔐 Demo Credentials</h4>
        <button className="text-yellow-600 hover:text-yellow-800">×</button>
      </div>
      <div className="text-sm text-yellow-800 space-y-1">
        <p><strong>Username:</strong> admin@ncq.sa</p>
        <p><strong>Password:</strong> NCQDemo2024!</p>
        <p><strong>API Key:</strong> ncq_demo_key_123</p>
        <button className="mt-2 text-xs bg-yellow-300 hover:bg-yellow-400 px-2 py-1 rounded">
          📋 Copy All
        </button>
      </div>
    </div>
  )

  // Layout with Sidebar
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50">
      <StickyNote />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <button onClick={() => setCurrentPage('landing')} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NCQ Platform</span>
          </button>
        </div>
        
        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id)
                setActiveTab('overview')
              }}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                currentPage === item.id 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">DU</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Demo User</p>
              <p className="text-xs text-gray-500">admin@ncq.sa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {navigation.find(nav => nav.id === currentPage)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              🎪 Interactive Tour
            </button>
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <span className="text-lg">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )

  // Landing Page
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NCQ Platform</span>
          </div>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enter Demo →
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto text-center px-8 py-16">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          🚀 NCQ Platform
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          Interactive Stakeholder Demonstration
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: '💳', title: 'Payment Gateway', desc: 'Secure multi-channel payment processing with mada, Visa, and digital wallets' },
            { icon: '🏥', title: 'Hospital Management', desc: 'Complete HMS with patient records, appointments, and billing' },
            { icon: '🏨', title: 'Smart Hospitality', desc: 'Modern hotel management with IoT integration' },
            { icon: '📡', title: 'IoT Platform', desc: 'Real-time device monitoring and management' },
            { icon: '🤖', title: 'AI Platform', desc: 'Advanced LLM capabilities and analytics' },
            { icon: '📊', title: 'Analytics', desc: 'Business intelligence and insights' }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-xl p-8">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            🎪 Explore Platform
          </button>
          <button
            onClick={() => alert('🎉 Interactive tour starting!\n\n✅ All modules working\n✅ Ready for stakeholder demo\n✅ Professional presentation')}
            className="bg-white text-gray-800 px-8 py-4 rounded-lg font-bold text-lg border-2 border-gray-300 hover:bg-gray-50 transition-all"
          >
            🎯 Start Interactive Tour
          </button>
        </div>
      </div>
    </div>
  )

  // Payment Gateway Module
  const PaymentGateway = () => {
    const tabs = [
      { id: 'overview', name: 'Overview', icon: '📊' },
      { id: 'process', name: 'Process Payment', icon: '💳' },
      { id: 'transactions', name: 'Transactions', icon: '📋' },
      { id: 'merchants', name: 'Merchants', icon: '🏪' },
      { id: 'analytics', name: 'Analytics', icon: '📈' }
    ]

    return (
      <div>
        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Today's Volume", value: 'SAR 2.8M', change: '+18.2%', icon: '💰' },
                { title: 'Transactions', value: '15,432', change: '+12.5%', icon: '💳' },
                { title: 'Success Rate', value: '99.2%', change: '+0.3%', icon: '✅' },
                { title: 'Fraud Rate', value: '0.02%', change: '-0.01%', icon: '🛡️' }
              ].map((metric, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{metric.icon}</span>
                    <span className="text-sm font-medium text-green-600">{metric.change}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mt-4">{metric.value}</h3>
                  <p className="text-gray-600">{metric.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🔄 Process New Payment</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input type="number" placeholder="0.00" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>SAR - Saudi Riyal</option>
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'mada', icon: '🇸🇦' },
                      { name: 'Visa', icon: '💳' },
                      { name: 'Mastercard', icon: '💳' },
                      { name: 'Apple Pay', icon: '🍎' }
                    ].map((method, index) => (
                      <button key={index} type="button" className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <div className="text-2xl mb-2">{method.icon}</div>
                        <div className="text-sm font-medium">{method.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                  <input type="email" placeholder="customer@example.com" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea placeholder="Payment description..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  🚀 Process Payment
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Export</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Merchant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { id: 'TXN-001', amount: 1250.00, method: 'mada', merchant: 'Hospital ABC', status: 'success', time: '2 min ago' },
                    { id: 'TXN-002', amount: 3500.00, method: 'Visa', merchant: 'Grand Hotel', status: 'success', time: '5 min ago' },
                    { id: 'TXN-003', amount: 750.00, method: 'Apple Pay', merchant: 'Clinic XYZ', status: 'failed', time: '8 min ago' },
                    { id: 'TXN-004', amount: 2100.00, method: 'mada', merchant: 'Hotel Plaza', status: 'processing', time: '12 min ago' },
                    { id: 'TXN-005', amount: 890.00, method: 'Mastercard', merchant: 'Restaurant Alpha', status: 'success', time: '15 min ago' }
                  ].map((txn, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">SAR {txn.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.merchant}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          txn.status === 'success' ? 'bg-green-100 text-green-800' :
                          txn.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'merchants' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Hospital ABC', industry: 'Healthcare', volume: 'SAR 450K', txns: 1234, status: 'Active' },
              { name: 'Grand Hotel', industry: 'Hospitality', volume: 'SAR 780K', txns: 2145, status: 'Active' },
              { name: 'Tech Store', industry: 'Retail', volume: 'SAR 320K', txns: 856, status: 'Active' },
              { name: 'Restaurant Chain', industry: 'Food & Beverage', volume: 'SAR 190K', txns: 654, status: 'Pending' },
              { name: 'Clinic Network', industry: 'Healthcare', volume: 'SAR 290K', txns: 432, status: 'Active' },
              { name: 'E-commerce Store', industry: 'Online Retail', volume: 'SAR 120K', txns: 876, status: 'Active' }
            ].map((merchant, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{merchant.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    merchant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {merchant.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{merchant.industry}</p>
                <div className="space-y-1">
                  <p className="text-sm"><strong>Monthly Volume:</strong> {merchant.volume}</p>
                  <p className="text-sm"><strong>Transactions:</strong> {merchant.txns.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Performance Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">99.2%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">2.3s</div>
                  <div className="text-sm text-gray-600">Avg Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">0.02%</div>
                  <div className="text-sm text-gray-600">Fraud Rate</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Payment Method Distribution</h4>
              <div className="space-y-3">
                {[
                  { method: 'mada', percentage: 45, color: 'bg-blue-500' },
                  { method: 'Visa', percentage: 30, color: 'bg-green-500' },
                  { method: 'Mastercard', percentage: 15, color: 'bg-purple-500' },
                  { method: 'Apple Pay', percentage: 10, color: 'bg-gray-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium">{item.method}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.color}`} style={{width: `${item.percentage}%`}}></div>
                    </div>
                    <div className="w-12 text-sm text-gray-600">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Hospital Management Module
  const HospitalManagement = () => {
    const tabs = [
      { id: 'overview', name: 'Overview', icon: '📊' },
      { id: 'patients', name: 'Patients', icon: '👥' },
      { id: 'appointments', name: 'Appointments', icon: '📅' },
      { id: 'billing', name: 'Billing', icon: '💰' },
      { id: 'inventory', name: 'Inventory', icon: '📦' }
    ]

    return (
      <div>
        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Total Patients', value: '1,234', icon: '👥', color: 'blue' },
                { title: 'Admitted', value: '156', icon: '🏥', color: 'green' },
                { title: 'Outpatients', value: '89', icon: '🚶', color: 'purple' },
                { title: 'Emergency', value: '12', icon: '🚨', color: 'red' }
              ].map((metric, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{metric.icon}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mt-4">{metric.value}</h3>
                  <p className="text-gray-600">{metric.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Patient Records</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Add Patient</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { id: 'P-001', name: 'Ahmad Hassan', age: 45, dept: 'Cardiology', status: 'Admitted' },
                    { id: 'P-002', name: 'Fatima Ali', age: 32, dept: 'Pediatrics', status: 'Outpatient' },
                    { id: 'P-003', name: 'Omar Khalid', age: 58, dept: 'Surgery', status: 'Pre-op' },
                    { id: 'P-004', name: 'Noura Salem', age: 28, dept: 'General', status: 'Discharged' }
                  ].map((patient, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.dept}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          patient.status === 'Admitted' ? 'bg-blue-100 text-blue-800' :
                          patient.status === 'Discharged' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                        <button className="text-green-600 hover:text-green-900">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">📅 Schedule New Appointment</h3>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Patient Name" className="p-3 border border-gray-300 rounded-lg" />
                <input type="date" className="p-3 border border-gray-300 rounded-lg" />
                <select className="p-3 border border-gray-300 rounded-lg">
                  <option>Select Doctor</option>
                  <option>Dr. Sarah Ahmed</option>
                  <option>Dr. Mohammed Khan</option>
                  <option>Dr. Layla Ibrahim</option>
                </select>
                <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700">
                  Schedule Appointment
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { patient: 'Ahmad Hassan', doctor: 'Dr. Sarah Ahmed', time: '09:00 AM', type: 'Consultation', status: 'confirmed' },
                { patient: 'Fatima Ali', doctor: 'Dr. Mohammed Khan', time: '10:30 AM', type: 'Follow-up', status: 'waiting' },
                { patient: 'Omar Khalid', doctor: 'Dr. Layla Ibrahim', time: '11:00 AM', type: 'Surgery', status: 'in-progress' },
                { patient: 'Noura Salem', doctor: 'Dr. Ahmed Yousef', time: '02:00 PM', type: 'Check-up', status: 'confirmed' }
              ].map((appointment, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{appointment.time}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{appointment.patient}</h4>
                  <p className="text-sm text-gray-600 mb-1">{appointment.doctor}</p>
                  <p className="text-sm text-gray-500">{appointment.type}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Outstanding', amount: 'SAR 45,200', count: 23, color: 'red' },
                { title: 'Paid Today', amount: 'SAR 128,900', count: 67, color: 'green' },
                { title: 'Pending', amount: 'SAR 22,300', count: 12, color: 'yellow' }
              ].map((billing, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{billing.title}</h4>
                  <p className="text-2xl font-bold text-gray-900">{billing.amount}</p>
                  <p className="text-sm text-gray-600">{billing.count} invoices</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h3>
              <div className="space-y-3">
                {[
                  { invoice: 'INV-001', patient: 'Ahmad Hassan', amount: 2500, status: 'Paid', date: '2024-01-15' },
                  { invoice: 'INV-002', patient: 'Fatima Ali', amount: 1800, status: 'Pending', date: '2024-01-14' },
                  { invoice: 'INV-003', patient: 'Omar Khalid', amount: 5200, status: 'Outstanding', date: '2024-01-13' }
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoice}</p>
                      <p className="text-sm text-gray-600">{invoice.patient}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">SAR {invoice.amount.toLocaleString()}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Total Items', value: '2,456', icon: '📦' },
                { title: 'Low Stock', value: '23', icon: '⚠️' },
                { title: 'Out of Stock', value: '5', icon: '❌' },
                { title: 'Value', value: 'SAR 890K', icon: '💰' }
              ].map((metric, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{metric.icon}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mt-4">{metric.value}</h3>
                  <p className="text-gray-600">{metric.title}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Inventory Items</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Add Item</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { item: 'Paracetamol 500mg', category: 'Medication', stock: 250, min: 100, status: 'Good' },
                      { item: 'Surgical Gloves', category: 'Supplies', stock: 45, min: 50, status: 'Low' },
                      { item: 'Blood Pressure Monitor', category: 'Equipment', stock: 12, min: 5, status: 'Good' },
                      { item: 'Antibiotics', category: 'Medication', stock: 2, min: 20, status: 'Critical' }
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.item}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.min}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === 'Good' ? 'bg-green-100 text-green-800' :
                            item.status === 'Low' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Smart Hospitality Module  
  const SmartHospitality = () => {
    const tabs = [
      { id: 'overview', name: 'Overview', icon: '📊' },
      { id: 'rooms', name: 'Room Management', icon: '🏨' },
      { id: 'guests', name: 'Guest Services', icon: '👥' },
      { id: 'iot', name: 'IoT Controls', icon: '📱' },
      { id: 'housekeeping', name: 'Housekeeping', icon: '🧹' }
    ]

    return (
      <div>
        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Occupancy Rate', value: '87%', icon: '🏨', change: '+5%' },
                { title: 'Available Rooms', value: '23', icon: '🛏️', change: '-3' },
                { title: 'Guest Satisfaction', value: '4.8', icon: '⭐', change: '+0.2' },
                { title: 'Revenue Today', value: 'SAR 45K', icon: '💰', change: '+12%' }
              ].map((metric, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{metric.icon}</span>
                    <span className="text-sm font-medium text-green-600">{metric.change}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mt-4">{metric.value}</h3>
                  <p className="text-gray-600">{metric.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Status Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { status: 'Occupied', count: 87, color: 'bg-blue-500' },
                  { status: 'Available', count: 23, color: 'bg-green-500' },
                  { status: 'Cleaning', count: 8, color: 'bg-yellow-500' },
                  { status: 'Maintenance', count: 3, color: 'bg-red-500' },
                  { status: 'Reserved', count: 12, color: 'bg-purple-500' }
                ].map((room, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`w-12 h-12 ${room.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                      {room.count}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{room.status}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { room: '101', type: 'Deluxe', guest: 'Ahmad Hassan', status: 'Occupied', checkout: '2024-01-18' },
                { room: '102', type: 'Standard', guest: 'Available', status: 'Available', checkout: null },
                { room: '103', type: 'Suite', guest: 'Fatima Ali', status: 'Occupied', checkout: '2024-01-20' },
                { room: '104', type: 'Deluxe', guest: 'Cleaning', status: 'Cleaning', checkout: null },
                { room: '105', type: 'Standard', guest: 'Omar Khalid', status: 'Occupied', checkout: '2024-01-19' },
                { room: '106', type: 'Suite', guest: 'Available', status: 'Available', checkout: null }
              ].map((room, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Room {room.room}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      room.status === 'Occupied' ? 'bg-blue-100 text-blue-800' :
                      room.status === 'Available' ? 'bg-green-100 text-green-800' :
                      room.status === 'Cleaning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{room.type}</p>
                  <p className="text-sm font-medium text-gray-900">{room.guest}</p>
                  {room.checkout && (
                    <p className="text-xs text-gray-500 mt-2">Checkout: {room.checkout}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guests' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Guest Check-in</h3>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Guest Name" className="p-3 border border-gray-300 rounded-lg" />
                <input type="email" placeholder="Email" className="p-3 border border-gray-300 rounded-lg" />
                <input type="tel" placeholder="Phone" className="p-3 border border-gray-300 rounded-lg" />
                <select className="p-3 border border-gray-300 rounded-lg">
                  <option>Select Room</option>
                  <option>Room 102 - Standard</option>
                  <option>Room 106 - Suite</option>
                </select>
                <input type="date" placeholder="Check-in Date" className="p-3 border border-gray-300 rounded-lg" />
                <input type="date" placeholder="Check-out Date" className="p-3 border border-gray-300 rounded-lg" />
                <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700">
                  Check-in Guest
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Current Guests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { guest: 'Ahmad Hassan', room: '101', checkin: '2024-01-15', checkout: '2024-01-18', requests: 2 },
                      { guest: 'Fatima Ali', room: '103', checkin: '2024-01-16', checkout: '2024-01-20', requests: 0 },
                      { guest: 'Omar Khalid', room: '105', checkin: '2024-01-17', checkout: '2024-01-19', requests: 1 }
                    ].map((guest, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guest.guest}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.room}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.checkin}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.checkout}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {guest.requests > 0 && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full">
                              {guest.requests} pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'iot' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { device: 'Smart Thermostats', count: 120, online: 118, icon: '🌡️' },
                { device: 'Smart Locks', count: 95, online: 94, icon: '🔐' },
                { device: 'Lighting Systems', count: 380, online: 375, icon: '💡' },
                { device: 'Security Cameras', count: 45, online: 43, icon: '📹' }
              ].map((device, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{device.icon}</span>
                    <span className="text-sm font-medium text-green-600">{device.online}/{device.count}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{device.device}</h4>
                  <p className="text-sm text-gray-600">{device.online} devices online</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { room: '101', temp: 22, lighting: 'Auto', lock: 'Locked', guest: 'Ahmad Hassan' },
                  { room: '103', temp: 24, lighting: 'Dim', lock: 'Locked', guest: 'Fatima Ali' },
                  { room: '105', temp: 20, lighting: 'Bright', lock: 'Locked', guest: 'Omar Khalid' }
                ].map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Room {room.room}</h4>
                    <p className="text-sm text-gray-600 mb-3">{room.guest}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Temperature</span>
                        <span className="font-medium">{room.temp}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Lighting</span>
                        <span className="font-medium">{room.lighting}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Door Lock</span>
                        <span className="font-medium text-green-600">{room.lock}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'housekeeping' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Rooms to Clean', count: 8, icon: '🧹', color: 'yellow' },
                { title: 'In Progress', count: 3, icon: '⏳', color: 'blue' },
                { title: 'Completed Today', count: 15, icon: '✅', color: 'green' }
              ].map((metric, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="text-3xl mb-3">{metric.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{metric.count}</div>
                  <p className="text-gray-600">{metric.title}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Housekeeping Tasks</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { room: '102', task: 'Deep Clean', assignee: 'Aisha Mohammed', priority: 'High', eta: '30 min' },
                  { room: '104', task: 'Standard Clean', assignee: 'Sara Ahmed', priority: 'Medium', eta: '20 min' },
                  { room: '107', task: 'Maintenance Check', assignee: 'Layla Hassan', priority: 'Low', eta: '15 min' },
                  { room: '109', task: 'Guest Checkout Clean', assignee: 'Mona Khalil', priority: 'High', eta: '25 min' }
                ].map((task, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Room {task.room}</h4>
                        <p className="text-sm text-gray-600">{task.task}</p>
                        <p className="text-sm text-gray-500">Assigned to: {task.assignee}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">ETA: {task.eta}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // IoT Platform Module
  const IoTPlatform = () => {
    const tabs = [
      { id: 'overview', name: 'Overview', icon: '📊' },
      { id: 'devices', name: 'Device Management', icon: '📱' },
      { id: 'monitoring', name: 'Real-time Monitoring', icon: '📈' },
      { id: 'alerts', name: 'Alerts & Alarms', icon: '🚨' },
      { id: 'analytics', name: 'Analytics', icon: '📊' }
    ]

    return (
      <div>
        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Total Devices', value: '2,847', icon: '📱', change: '+12' },
                { title: 'Online Devices', value: '2,831', icon: '🟢', change: '+5' },
                { title: 'Active Alerts', value: '7', icon: '🚨', change: '-3' },
                { title: 'Data Points/Hour', value: '1.2M', icon: '📊', change: '+8%' }
              ].map((metric, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{metric.icon}</span>
                    <span className="text-sm font-medium text-green-600">{metric.change}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mt-4">{metric.value}</h3>
                  <p className="text-gray-600">{metric.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add New Device</h3>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Device Name" className="p-3 border border-gray-300 rounded-lg" />
                <select className="p-3 border border-gray-300 rounded-lg">
                  <option>Device Type</option>
                  <option>Temperature Sensor</option>
                  <option>Smart Lock</option>
                  <option>Security Camera</option>
                  <option>Light Control</option>
                </select>
                <input type="text" placeholder="Location" className="p-3 border border-gray-300 rounded-lg" />
                <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700">
                  Add Device
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Thermostat-101', type: 'Temperature Sensor', location: 'Room 101', status: 'Online', value: '22°C' },
                { name: 'Lock-102', type: 'Smart Lock', location: 'Room 102', status: 'Online', value: 'Locked' },
                { name: 'Camera-Lobby', type: 'Security Camera', location: 'Main Lobby', status: 'Online', value: 'Recording' },
                { name: 'Light-103', type: 'Light Control', location: 'Room 103', status: 'Offline', value: 'N/A' },
                { name: 'Sensor-Kitchen', type: 'Motion Sensor', location: 'Restaurant', status: 'Online', value: 'Active' },
                { name: 'HVAC-Main', type: 'Climate Control', location: 'Central System', status: 'Online', value: '24°C' }
              ].map((device, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{device.name}</h4>
                    <span className={`w-3 h-3 rounded-full ${
                      device.status === 'Online' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{device.type}</p>
                  <p className="text-sm text-gray-500 mb-3">{device.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{device.value}</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Configure</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">24.5°C</div>
                  <div className="text-sm text-gray-600">Average Temperature</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">2,831</div>
                  <div className="text-sm text-gray-600">Devices Online</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">99.4%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Temperature Readings</h4>
                <div className="space-y-3">
                  {[
                    { location: 'Room 101', temp: 22, trend: 'stable' },
                    { location: 'Room 102', temp: 24, trend: 'rising' },
                    { location: 'Room 103', temp: 20, trend: 'falling' },
                    { location: 'Lobby', temp: 26, trend: 'stable' }
                  ].map((reading, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{reading.location}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{reading.temp}°C</span>
                        <span className={`text-xs ${
                          reading.trend === 'rising' ? 'text-red-600' :
                          reading.trend === 'falling' ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {reading.trend === 'rising' ? '↗' : reading.trend === 'falling' ? '↘' : '→'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Device Status</h4>
                <div className="space-y-3">
                  {[
                    { category: 'Temperature Sensors', total: 120, online: 118 },
                    { category: 'Smart Locks', total: 95, online: 94 },
                    { category: 'Security Cameras', total: 45, online: 43 },
                    { category: 'Light Controls', total: 380, online: 375 }
                  ].map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{category.category}</span>
                      <div className="text-right">
                        <div className="font-bold">{category.online}/{category.total}</div>
                        <div className="text-xs text-gray-600">
                          {((category.online / category.total) * 100).toFixed(1)}% online
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Critical Alerts', count: 2, color: 'red', icon: '🚨' },
                { title: 'Warning Alerts', count: 5, color: 'yellow', icon: '⚠️' },
                { title: 'Info Alerts', count: 12, color: 'blue', icon: 'ℹ️' }
              ].map((alert, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="text-3xl mb-3">{alert.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{alert.count}</div>
                  <p className="text-gray-600">{alert.title}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { device: 'Camera-Parking', message: 'Motion detected in restricted area', severity: 'Critical', time: '2 min ago' },
                  { device: 'Sensor-Fire-B2', message: 'Smoke detected in basement', severity: 'Critical', time: '5 min ago' },
                  { device: 'HVAC-Zone-3', message: 'Temperature exceeds threshold', severity: 'Warning', time: '8 min ago' },
                  { device: 'Lock-Emergency', message: 'Unauthorized access attempt', severity: 'Warning', time: '12 min ago' },
                  { device: 'Power-Main', message: 'Power consumption spike detected', severity: 'Info', time: '15 min ago' }
                ].map((alert, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{alert.device}</h4>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          alert.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                        <div className="mt-2 space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-xs">Acknowledge</button>
                          <button className="text-green-600 hover:text-green-800 text-xs">Resolve</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Performance Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Uptime by Device Type</h4>
                  <div className="space-y-3">
                    {[
                      { type: 'Temperature Sensors', uptime: 99.8, color: 'bg-green-500' },
                      { type: 'Smart Locks', uptime: 99.2, color: 'bg-blue-500' },
                      { type: 'Security Cameras', uptime: 97.5, color: 'bg-yellow-500' },
                      { type: 'Light Controls', uptime: 98.9, color: 'bg-purple-500' }
                    ].map((device, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-24 text-sm font-medium">{device.type}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${device.color}`} style={{width: `${device.uptime}%`}}></div>
                        </div>
                        <div className="w-12 text-sm text-gray-600">{device.uptime}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Data Transmission</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">1.2M</div>
                      <div className="text-xs text-gray-600">Messages/Hour</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">99.9%</div>
                      <div className="text-xs text-gray-600">Delivery Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // AI Platform Module
  const AIPlatform = () => {
    const tabs = [
      { id: 'overview', name: 'Overview', icon: '📊' },
      { id: 'models', name: 'Model Management', icon: '🤖' },
      { id: 'playground', name: 'AI Playground', icon: '🎮' },
      { id: 'analytics', name: 'Usage Analytics', icon: '📈' },
      { id: 'training', name: 'Model Training', icon: '🎯' }
    ]

    return (
      <div>
        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Active Models', value: '12', icon: '🤖', change: '+2' },
                { title: 'API Calls Today', value: '24.5K', icon: '📡', change: '+18%' },
                { title: 'Success Rate', value: '99.7%', icon: '✅', change: '+0.2%' },
                { title: 'Avg Response Time', value: '120ms', icon: '⚡', change: '-15ms' }
              ].map((metric, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{metric.icon}</span>
                    <span className="text-sm font-medium text-green-600">{metric.change}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mt-4">{metric.value}</h3>
                  <p className="text-gray-600">{metric.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'GPT-4 Turbo', type: 'Language Model', status: 'Active', usage: '12.4K calls', accuracy: '95.2%' },
                { name: 'BERT-Arabic', type: 'NLP Model', status: 'Active', usage: '8.7K calls', accuracy: '92.8%' },
                { name: 'ResNet-50', type: 'Image Recognition', status: 'Active', usage: '3.2K calls', accuracy: '97.1%' },
                { name: 'Custom-Healthcare', type: 'Domain Specific', status: 'Training', usage: '0 calls', accuracy: 'N/A' },
                { name: 'Sentiment-Analysis', type: 'Text Analysis', status: 'Active', usage: '5.6K calls', accuracy: '89.4%' },
                { name: 'Fraud-Detection', type: 'Classification', status: 'Active', usage: '15.3K calls', accuracy: '94.7%' }
              ].map((model, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{model.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      model.status === 'Active' ? 'bg-green-100 text-green-800' :
                      model.status === 'Training' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {model.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{model.type}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage:</span>
                      <span className="font-medium">{model.usage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Accuracy:</span>
                      <span className="font-medium">{model.accuracy}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700">
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">🎮 AI Model Playground</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Model</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg">
                    <option>GPT-4 Turbo</option>
                    <option>BERT-Arabic</option>
                    <option>Sentiment Analysis</option>
                    <option>Custom Healthcare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg">
                    <option>Text Generation</option>
                    <option>Text Classification</option>
                    <option>Sentiment Analysis</option>
                    <option>Question Answering</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Input Prompt</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg" 
                  rows={6}
                  placeholder="Enter your prompt here..."
                ></textarea>
              </div>

              <div className="mt-6 flex items-center space-x-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  🚀 Generate Response
                </button>
                <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300">
                  Clear
                </button>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Response</label>
                <div className="p-4 bg-gray-50 rounded-lg min-h-[200px] border border-gray-200">
                  <p className="text-gray-500 italic">AI response will appear here...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">24.5K</div>
                  <div className="text-sm text-gray-600">API Calls Today</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">680K</div>
                  <div className="text-sm text-gray-600">Total This Month</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">120ms</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Model Usage Distribution</h4>
              <div className="space-y-4">
                {[
                  { model: 'GPT-4 Turbo', calls: 12400, percentage: 45 },
                  { model: 'Fraud Detection', calls: 8700, percentage: 32 },
                  { model: 'Sentiment Analysis', calls: 3200, percentage: 12 },
                  { model: 'BERT Arabic', calls: 2900, percentage: 11 }
                ].map((usage, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-32 text-sm font-medium">{usage.model}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="h-3 bg-blue-500 rounded-full" style={{width: `${usage.percentage}%`}}></div>
                    </div>
                    <div className="w-16 text-sm text-gray-600">{usage.calls.toLocaleString()}</div>
                    <div className="w-12 text-sm text-gray-600">{usage.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">🎯 Train New Model</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model Name</label>
                    <input type="text" placeholder="My Custom Model" className="w-full p-3 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Model</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg">
                      <option>GPT-3.5 Turbo</option>
                      <option>BERT Base</option>
                      <option>RoBERTa</option>
                      <option>Custom Architecture</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Training Dataset</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="text-gray-500">
                      <p>📁 Upload your training dataset</p>
                      <p className="text-sm mt-2">Supported formats: CSV, JSON, TXT</p>
                    </div>
                    <button type="button" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
                      Choose Files
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Rate</label>
                    <input type="number" step="0.001" placeholder="0.001" className="w-full p-3 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch Size</label>
                    <input type="number" placeholder="32" className="w-full p-3 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Epochs</label>
                    <input type="number" placeholder="10" className="w-full p-3 border border-gray-300 rounded-lg" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700">
                  🚀 Start Training
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Training Jobs</h4>
              <div className="space-y-4">
                {[
                  { name: 'Healthcare-NLP-v2', status: 'Training', progress: 65, eta: '2h 15m' },
                  { name: 'Custom-Chatbot', status: 'Completed', progress: 100, eta: 'Done' },
                  { name: 'Fraud-Detection-v3', status: 'Failed', progress: 23, eta: 'Error' },
                  { name: 'Sentiment-Arabic', status: 'Queued', progress: 0, eta: 'Waiting' }
                ].map((job, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{job.name}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.status === 'Training' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="h-2 bg-blue-500 rounded-full" style={{width: `${job.progress}%`}}></div>
                      </div>
                      <span className="text-sm text-gray-600">{job.progress}%</span>
                      <span className="text-sm text-gray-500">ETA: {job.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Dashboard Overview
  const Dashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: 'SAR 2.4M', change: '+12.5%', icon: '💰' },
          { title: 'Active Users', value: '52,841', change: '+8.2%', icon: '👥' },
          { title: 'Transactions', value: '124,523', change: '+15.3%', icon: '💳' },
          { title: 'System Health', value: '99.9%', change: '99.9%', icon: '⚡' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{metric.icon}</span>
              <span className="text-sm font-medium text-green-600">{metric.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mt-4">{metric.value}</h3>
            <p className="text-gray-600">{metric.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Payment Gateway', icon: '💳', color: 'blue', status: 'Active', transactions: '1,234' },
          { name: 'Hospital Management', icon: '🏥', color: 'green', status: 'Active', transactions: '856' },
          { name: 'Smart Hospitality', icon: '🏨', color: 'purple', status: 'Active', transactions: '542' },
          { name: 'IoT Platform', icon: '📡', color: 'orange', status: 'Active', transactions: '2,341' },
          { name: 'AI Platform', icon: '🤖', color: 'indigo', status: 'Active', transactions: '678' },
          { name: 'Analytics Hub', icon: '📊', color: 'pink', status: 'Active', transactions: '423' }
        ].map((module, index) => (
          <button
            key={index}
            onClick={() => {
              const moduleMap = {
                'Payment Gateway': 'payment',
                'Hospital Management': 'hospital',
                'Smart Hospitality': 'hospitality',
                'IoT Platform': 'iot',
                'AI Platform': 'ai'
              }
              const targetPage = moduleMap[module.name] || 'dashboard'
              setCurrentPage(targetPage)
              setActiveTab('overview')
            }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{module.icon}</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{module.status}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{module.name}</h3>
            <p className="text-sm text-gray-600">Today: {module.transactions} operations</p>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">🎯 System Status: Fully Operational</h3>
            <p className="text-blue-100 mt-1">All NCQ Platform services running smoothly</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {currentPage === 'landing' && <LandingPage />}
      {currentPage !== 'landing' && (
        <Layout>
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'payment' && <PaymentGateway />}
          {currentPage === 'hospital' && <HospitalManagement />}
          {currentPage === 'hospitality' && <SmartHospitality />}
          {currentPage === 'iot' && <IoTPlatform />}
          {currentPage === 'ai' && <AIPlatform />}
        </Layout>
      )}
    </div>
  )
}

export default App