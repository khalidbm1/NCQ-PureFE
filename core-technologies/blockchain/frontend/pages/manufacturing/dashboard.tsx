import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Package, CheckCircle, AlertTriangle, Truck, Factory, BarChart3, TrendingUp, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Product {
  id: string;
  name: string;
  batchNumber: string;
  status: 'DESIGN' | 'PRODUCTION' | 'QUALITY_CHECK' | 'PACKAGED' | 'SHIPPED' | 'DELIVERED' | 'RECALLED';
  manufacturer: string;
  currentLocation: string;
  productionDate: string;
  qualityScore: number;
}

interface QualityCheck {
  id: string;
  productId: string;
  inspector: string;
  timestamp: string;
  checkType: string;
  passed: boolean;
  parameters: Array<{
    name: string;
    expectedValue: number;
    actualValue: number;
    passed: boolean;
  }>;
}

export default function ManufacturingDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts([
        {
          id: 'PROD_001',
          name: 'Smart Widget Pro',
          batchNumber: 'BATCH_2024_001',
          status: 'PRODUCTION',
          manufacturer: 'TechCorp Manufacturing',
          currentLocation: 'Factory Floor A',
          productionDate: '2024-06-01',
          qualityScore: 98.5
        },
        {
          id: 'PROD_002',
          name: 'IoT Sensor Module',
          batchNumber: 'BATCH_2024_002',
          status: 'QUALITY_CHECK',
          manufacturer: 'IoT Solutions Inc',
          currentLocation: 'Quality Lab B',
          productionDate: '2024-06-02',
          qualityScore: 96.8
        },
        {
          id: 'PROD_003',
          name: 'Medical Device Alpha',
          batchNumber: 'BATCH_2024_003',
          status: 'SHIPPED',
          manufacturer: 'MedTech Industries',
          currentLocation: 'Distribution Center',
          productionDate: '2024-05-28',
          qualityScore: 99.2
        },
        {
          id: 'PROD_004',
          name: 'Industrial Controller',
          batchNumber: 'BATCH_2024_004',
          status: 'DELIVERED',
          manufacturer: 'Industrial Solutions',
          currentLocation: 'Customer Site',
          productionDate: '2024-05-25',
          qualityScore: 97.1
        }
      ]);

      setQualityChecks([
        {
          id: 'QC_001',
          productId: 'PROD_001',
          inspector: 'John Quality',
          timestamp: '2024-06-03T10:30:00Z',
          checkType: 'FUNCTIONAL',
          passed: true,
          parameters: [
            { name: 'Weight', expectedValue: 2.5, actualValue: 2.48, passed: true },
            { name: 'Voltage', expectedValue: 5.0, actualValue: 5.02, passed: true },
            { name: 'Temperature', expectedValue: 25, actualValue: 24.8, passed: true }
          ]
        },
        {
          id: 'QC_002',
          productId: 'PROD_002',
          inspector: 'Sarah Inspector',
          timestamp: '2024-06-03T14:15:00Z',
          checkType: 'DIMENSIONAL',
          passed: true,
          parameters: [
            { name: 'Length', expectedValue: 10.0, actualValue: 9.98, passed: true },
            { name: 'Width', expectedValue: 5.0, actualValue: 5.01, passed: true }
          ]
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productionData = [
    { month: 'Jan', produced: 1200, defective: 24 },
    { month: 'Feb', produced: 1350, defective: 18 },
    { month: 'Mar', produced: 1180, defective: 32 },
    { month: 'Apr', produced: 1420, defective: 15 },
    { month: 'May', produced: 1380, defective: 21 },
    { month: 'Jun', produced: 1450, defective: 12 }
  ];

  const qualityTrendData = [
    { week: 'Week 1', passRate: 96.8 },
    { week: 'Week 2', passRate: 97.2 },
    { week: 'Week 3', passRate: 98.1 },
    { week: 'Week 4', passRate: 97.8 },
    { week: 'This Week', passRate: 98.5 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRODUCTION': return 'bg-blue-100 text-blue-800';
      case 'QUALITY_CHECK': return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'RECALLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRODUCTION': return <Factory className="h-4 w-4" />;
      case 'QUALITY_CHECK': return <CheckCircle className="h-4 w-4" />;
      case 'SHIPPED': return <Truck className="h-4 w-4" />;
      case 'DELIVERED': return <CheckCircle className="h-4 w-4" />;
      case 'RECALLED': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Manufacturing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Manufacturing Dashboard - NCQ Enterprise Blockchain</title>
        <meta name="description" content="Manufacturing and Supply Chain Management Dashboard" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manufacturing Dashboard</h1>
              <p className="text-sm text-gray-500">Supply Chain & Quality Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Add Product
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Quality Check
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Quality Pass Rate</p>
                <p className="text-2xl font-semibold text-gray-900">98.5%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Factory className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Production</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => p.status === 'PRODUCTION').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Shipped</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => p.status === 'SHIPPED' || p.status === 'DELIVERED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Production Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Production Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="produced" fill="#3B82F6" name="Produced" />
                <Bar dataKey="defective" fill="#EF4444" name="Defective" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quality Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Pass Rate Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={qualityTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[95, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Pass Rate']} />
                <Line type="monotone" dataKey="passRate" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Tracking */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Product Tracking</h3>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quality Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Production Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.manufacturer}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.batchNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        <span className="ml-1">{product.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.currentLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`text-sm font-medium ${
                          product.qualityScore >= 98 ? 'text-green-600' :
                          product.qualityScore >= 95 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {product.qualityScore}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.productionDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-green-600 hover:text-green-900 mr-3">Track</button>
                      {product.status !== 'RECALLED' && (
                        <button className="text-red-600 hover:text-red-900">Recall</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Quality Checks */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Quality Checks</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {qualityChecks.map((check) => (
              <div key={check.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {check.checkType} Check - Product {check.productId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Inspector: {check.inspector} • {new Date(check.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    check.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {check.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {check.parameters.map((param, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="text-gray-500">{param.name}:</span>
                      <span className={`ml-1 ${param.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {param.actualValue} (exp: {param.expectedValue})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}