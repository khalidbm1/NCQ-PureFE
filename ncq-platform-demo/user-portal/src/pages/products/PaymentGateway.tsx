import { useState } from 'react'
import { 
  CreditCard, DollarSign, TrendingUp, Shield, Globe, 
  CheckCircle, XCircle, Clock,
  ShoppingCart, Store, RefreshCw, FileText
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import { toast } from 'sonner'

// Mock data
const paymentStats = {
  totalVolume: 8456320,
  todayVolume: 234560,
  successRate: 98.7,
  avgTransactionValue: 187,
  totalTransactions: 45234,
  todayTransactions: 1254,
  pendingSettlement: 45680,
  disputes: 3
}

const recentTransactions = [
  { id: 'TXN-001', merchant: 'NCQ Store', amount: 1250, currency: 'SAR', status: 'completed', method: 'MADA', time: '2 min ago' },
  { id: 'TXN-002', merchant: 'Digital Services', amount: 450, currency: 'SAR', status: 'completed', method: 'VISA', time: '5 min ago' },
  { id: 'TXN-003', merchant: 'Tech Solutions', amount: 3200, currency: 'SAR', status: 'pending', method: 'MASTERCARD', time: '12 min ago' },
  { id: 'TXN-004', merchant: 'Online Market', amount: 890, currency: 'SAR', status: 'failed', method: 'APPLE_PAY', time: '15 min ago' },
  { id: 'TXN-005', merchant: 'Cloud Services', amount: 2100, currency: 'SAR', status: 'completed', method: 'STC_PAY', time: '20 min ago' }
]

const merchantAccounts = [
  { id: 1, name: 'NCQ Store', type: 'E-commerce', volume: 2340000, transactions: 12450, status: 'active', risk: 'low' },
  { id: 2, name: 'Tech Solutions', type: 'SaaS', volume: 1890000, transactions: 8920, status: 'active', risk: 'low' },
  { id: 3, name: 'Digital Services', type: 'Digital Goods', volume: 980000, transactions: 15680, status: 'active', risk: 'medium' },
  { id: 4, name: 'Online Market', type: 'Marketplace', volume: 3456000, transactions: 23450, status: 'review', risk: 'high' }
]

const paymentMethods = [
  { name: 'MADA', logo: '🇸🇦', volume: 3456000, percentage: 40.8, transactions: 18234 },
  { name: 'VISA', logo: '💳', volume: 2134000, percentage: 25.2, transactions: 12456 },
  { name: 'Mastercard', logo: '💳', volume: 1567000, percentage: 18.5, transactions: 8934 },
  { name: 'Apple Pay', logo: '🍎', volume: 890000, percentage: 10.5, transactions: 4567 },
  { name: 'STC Pay', logo: '📱', volume: 423000, percentage: 5.0, transactions: 1043 }
]

const settlementSchedule = [
  { id: 1, date: '2024-01-22', amount: 234560, merchants: 23, status: 'processing' },
  { id: 2, date: '2024-01-21', amount: 189340, merchants: 19, status: 'completed' },
  { id: 3, date: '2024-01-20', amount: 256780, merchants: 25, status: 'completed' },
  { id: 4, date: '2024-01-19', amount: 198450, merchants: 21, status: 'completed' }
]

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    completed: { variant: 'default' as const, icon: CheckCircle },
    pending: { variant: 'secondary' as const, icon: Clock },
    failed: { variant: 'destructive' as const, icon: XCircle },
    processing: { variant: 'outline' as const, icon: RefreshCw }
  }
  
  const config = variants[status as keyof typeof variants] || variants.pending
  const Icon = config.icon
  
  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="w-3 h-3" />
      {status}
    </Badge>
  )
}

export default function PaymentGateway() {
  const [selectedTab, setSelectedTab] = useState('overview')

  const handleNewMerchant = () => {
    toast.success('Merchant onboarding process started')
  }

  const handleGenerateReport = () => {
    toast.success('Generating payment report...')
  }

  const handleTestPayment = () => {
    toast.info('Opening payment testing environment')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payment Gateway</h1>
          <p className="text-muted-foreground">
            Secure payment processing for Saudi Arabia
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleTestPayment}>
            <CreditCard className="w-4 h-4 mr-2" />
            Test Payment
          </Button>
          <Button onClick={handleNewMerchant}>
            <Store className="w-4 h-4 mr-2" />
            Add Merchant
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              SAR {(paymentStats.totalVolume / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-muted-foreground">
              +{((paymentStats.todayVolume / paymentStats.totalVolume) * 100).toFixed(1)}% today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentStats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Industry leading performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentStats.todayTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {paymentStats.totalTransactions.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SAR {paymentStats.avgTransactionValue}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Transaction volume by payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{method.logo}</span>
                          <span className="font-medium">{method.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          SAR {(method.volume / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <Progress value={method.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {method.transactions.toLocaleString()} transactions ({method.percentage}%)
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Latest payment activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{transaction.merchant}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.id} • {transaction.method}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {transaction.currency} {transaction.amount}
                        </p>
                        <StatusBadge status={transaction.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security & Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>Security & Compliance</CardTitle>
              <CardDescription>
                Payment security measures and compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="font-medium">PCI DSS</p>
                  <p className="text-sm text-muted-foreground">Compliant</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium">SAMA</p>
                  <p className="text-sm text-muted-foreground">Licensed</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p className="font-medium">3D Secure</p>
                  <p className="text-sm text-muted-foreground">Enabled</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="font-medium">Fraud Score</p>
                  <p className="text-sm text-muted-foreground">0.02%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Detailed view of all payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{transaction.id}</p>
                        <p className="text-sm text-muted-foreground">{transaction.time}</p>
                      </div>
                      <StatusBadge status={transaction.status} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Merchant</p>
                        <p className="font-medium">{transaction.merchant}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">{transaction.currency} {transaction.amount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Method</p>
                        <p className="font-medium">{transaction.method}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merchants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Accounts</CardTitle>
              <CardDescription>
                Manage merchant accounts and configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {merchantAccounts.map((merchant) => (
                  <div key={merchant.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{merchant.name}</p>
                        <p className="text-sm text-muted-foreground">{merchant.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={merchant.status === 'active' ? 'default' : 'secondary'}>
                          {merchant.status}
                        </Badge>
                        <Badge variant={
                          merchant.risk === 'low' ? 'default' :
                          merchant.risk === 'medium' ? 'secondary' : 'destructive'
                        }>
                          {merchant.risk} risk
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Volume</p>
                        <p className="font-medium">SAR {(merchant.volume / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Transactions</p>
                        <p className="font-medium">{merchant.transactions.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settlement Schedule</CardTitle>
              <CardDescription>
                Upcoming and completed settlements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settlementSchedule.map((settlement) => (
                  <div key={settlement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{settlement.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {settlement.merchants} merchants
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">SAR {settlement.amount.toLocaleString()}</p>
                      <StatusBadge status={settlement.status} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Settlement</span>
                  <span className="text-lg font-bold">
                    SAR {paymentStats.pendingSettlement.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Analytics</CardTitle>
              <CardDescription>
                Detailed insights and payment trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Advanced analytics dashboard with charts and insights would be displayed here
                </p>
                <Button className="mt-4" onClick={handleGenerateReport}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}