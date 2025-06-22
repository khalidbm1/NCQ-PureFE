import type { Meta, StoryObj } from '@storybook/react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardStats,
  CardMetric
} from '../src/components/Card/Card'
import { Button } from '../src/components/Button/Button'
import { Badge } from '../src/components/Badge/Badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  CreditCard,
  ShoppingCart,
  Heart,
  Star,
  Download,
  Share2
} from 'lucide-react'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component with multiple variants and specialized sub-components for different use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'filled', 'gradient', 'ncq', 'saudi', 'glass'],
      description: 'The visual style variant of the card',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'default', 'lg', 'xl'],
      description: 'The padding inside the card',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the card is interactive (clickable)',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl', '2xl', 'full'],
      description: 'The maximum width of the card',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic Examples
export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description explaining the content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
}

// Variants
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      <Card variant="default" className="w-full">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Standard card with border and shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Default card variant</p>
        </CardContent>
      </Card>

      <Card variant="outlined" className="w-full">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
          <CardDescription>Card with prominent border</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Outlined card variant</p>
        </CardContent>
      </Card>

      <Card variant="elevated" className="w-full">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardDescription>Card with elevated shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Elevated card variant</p>
        </CardContent>
      </Card>

      <Card variant="filled" className="w-full">
        <CardHeader>
          <CardTitle>Filled</CardTitle>
          <CardDescription>Card with filled background</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Filled card variant</p>
        </CardContent>
      </Card>

      <Card variant="gradient" className="w-full">
        <CardHeader>
          <CardTitle>Gradient</CardTitle>
          <CardDescription>Card with gradient background</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Gradient card variant</p>
        </CardContent>
      </Card>

      <Card variant="glass" className="w-full">
        <CardHeader>
          <CardTitle>Glass</CardTitle>
          <CardDescription>Card with glass morphism effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Glass card variant</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants of the card component.',
      },
    },
  },
}

export const BrandedVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      <Card variant="ncq" className="w-full">
        <CardHeader>
          <CardTitle>NCQ Card</CardTitle>
          <CardDescription>Card styled with NCQ brand colors</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card uses NCQ primary colors and styling.</p>
        </CardContent>
        <CardFooter>
          <Button variant="ncq">NCQ Action</Button>
        </CardFooter>
      </Card>

      <Card variant="saudi" className="w-full">
        <CardHeader>
          <CardTitle>Saudi Card</CardTitle>
          <CardDescription>Card styled with Saudi theme colors</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card uses Saudi green and gold styling.</p>
        </CardContent>
        <CardFooter>
          <Button variant="saudi">Saudi Action</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'NCQ and Saudi-themed card variants.',
      },
    },
  },
}

// Interactive Cards
export const InteractiveCard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      <Card interactive className="w-full cursor-pointer">
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>Click me to see the hover effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has hover effects and is clickable.</p>
        </CardContent>
      </Card>

      <Card variant="ncq" interactive className="w-full cursor-pointer">
        <CardHeader>
          <CardTitle>NCQ Interactive</CardTitle>
          <CardDescription>Interactive card with NCQ styling</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hover to see the interactive effects.</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive cards with hover effects and scaling.',
      },
    },
  },
}

// Stats Cards
export const StatsCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
      <Card>
        <CardHeader>
          <CardStats
            value="12,847"
            label="Total Users"
            change="+12.5% from last month"
            changeType="positive"
            icon={<Users className="h-4 w-4" />}
          />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardStats
            value="$284,759"
            label="Revenue"
            change="+8.2% from last month"
            changeType="positive"
            icon={<DollarSign className="h-4 w-4" />}
          />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardStats
            value="1,423"
            label="Active Sessions"
            change="-2.1% from last hour"
            changeType="negative"
            icon={<Activity className="h-4 w-4" />}
          />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardStats
            value="98.7%"
            label="Uptime"
            change="Same as last month"
            changeType="neutral"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </CardHeader>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Statistics cards with values, labels, and trend indicators.',
      },
    },
  },
}

// Metric Cards
export const MetricCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      <Card>
        <CardContent className="pt-6">
          <CardMetric
            title="Revenue"
            value="$12,847.50"
            description="Total revenue this month"
            trend="up"
            trendValue="+12.5%"
            icon={<DollarSign className="h-5 w-5" />}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <CardMetric
            title="Orders"
            value="1,423"
            description="Orders processed today"
            trend="down"
            trendValue="-2.1%"
            icon={<ShoppingCart className="h-5 w-5" />}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <CardMetric
            title="Conversion Rate"
            value="3.24%"
            description="Visitors to customers"
            trend="up"
            trendValue="+0.3%"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </CardContent>
      </Card>

      <Card variant="ncq">
        <CardContent className="pt-6">
          <CardMetric
            title="API Calls"
            value="9.8M"
            description="Requests processed this month"
            trend="up"
            trendValue="+18.2%"
            icon={<Activity className="h-5 w-5" />}
          />
        </CardContent>
      </Card>

      <Card variant="saudi">
        <CardContent className="pt-6">
          <CardMetric
            title="Users"
            value="45,621"
            description="Active users this week"
            trend="up"
            trendValue="+5.7%"
            icon={<Users className="h-5 w-5" />}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <CardMetric
            title="System Health"
            value="99.9%"
            description="Uptime this quarter"
            trend="neutral"
            trendValue="0%"
            icon={<Heart className="h-5 w-5" />}
          />
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Metric cards with detailed information and trend indicators.',
      },
    },
  },
}

// Compact Metrics
export const CompactMetrics: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardMetric
            variant="compact"
            title="CPU Usage"
            value="34%"
            trend="up"
            trendValue="+2%"
            icon={<Activity className="h-4 w-4" />}
          />
          <CardMetric
            variant="compact"
            title="Memory"
            value="68%"
            trend="down"
            trendValue="-5%"
            icon={<TrendingDown className="h-4 w-4" />}
          />
          <CardMetric
            variant="compact"
            title="Storage"
            value="42%"
            trend="up"
            trendValue="+1%"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <CardMetric
            variant="compact"
            title="Network"
            value="12 MB/s"
            trend="neutral"
            icon={<Activity className="h-4 w-4" />}
          />
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact metric cards for dense information display.',
      },
    },
  },
}

// Product Cards
export const ProductCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      <Card variant="elevated" interactive>
        <div className="aspect-video bg-gradient-to-br from-ncq-primary-100 to-ncq-primary-200 rounded-t-lg flex items-center justify-center">
          <CreditCard className="h-12 w-12 text-ncq-primary-600" />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Payment Gateway</CardTitle>
              <CardDescription>Secure payment processing</CardDescription>
            </div>
            <Badge variant="ncq">Popular</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Complete payment solution with support for mada, Visa, and digital wallets.
          </p>
          <div className="mt-4 flex items-center space-x-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.9</span>
            <span className="text-sm text-muted-foreground">(127 reviews)</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <span className="text-2xl font-bold">Free</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <Button variant="ncq">Get Started</Button>
        </CardFooter>
      </Card>

      <Card variant="elevated" interactive>
        <div className="aspect-video bg-gradient-to-br from-saudi-green-100 to-saudi-green-200 rounded-t-lg flex items-center justify-center">
          <Activity className="h-12 w-12 text-saudi-green-600" />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>IoT Platform</CardTitle>
              <CardDescription>Device management & analytics</CardDescription>
            </div>
            <Badge variant="saudi">Enterprise</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Comprehensive IoT device management with real-time monitoring and analytics.
          </p>
          <div className="mt-4 flex items-center space-x-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.7</span>
            <span className="text-sm text-muted-foreground">(89 reviews)</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <span className="text-2xl font-bold">$99</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <Button variant="saudi">Learn More</Button>
        </CardFooter>
      </Card>

      <Card variant="elevated" interactive>
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-200 rounded-t-lg flex items-center justify-center">
          <Users className="h-12 w-12 text-blue-600" />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Hospital Management</CardTitle>
              <CardDescription>Complete healthcare solution</CardDescription>
            </div>
            <Badge variant="info">Healthcare</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            End-to-end hospital management system with patient records and billing.
          </p>
          <div className="mt-4 flex items-center space-x-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-sm text-muted-foreground">(156 reviews)</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <span className="text-2xl font-bold">$299</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <Button>Contact Sales</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Product showcase cards with images, ratings, and pricing.',
      },
    },
  },
}

// Complex Dashboard Card
export const DashboardCard: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Revenue and transaction metrics for the last 30 days</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-ncq-primary-600">$47,281</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="text-sm text-green-600 flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5%
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-saudi-green-600">1,247</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
              <div className="text-sm text-green-600 flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2%
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">$37.92</div>
              <div className="text-sm text-muted-foreground">Avg. Order Value</div>
              <div className="text-sm text-red-600 flex items-center justify-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1%
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Top Products</h4>
              <Badge variant="outline">Live</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Payment Gateway API</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">$12,847</span>
                  <Badge variant="success-soft" size="sm">+18%</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">IoT Device Licenses</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">$8,924</span>
                  <Badge variant="success-soft" size="sm">+12%</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Hospital Management</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">$6,510</span>
                  <Badge variant="warning-soft" size="sm">-3%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ncq" className="w-full">
            View Detailed Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complex dashboard card with multiple metrics and data sections.',
      },
    },
  },
}

// RTL Example
export const RTLExample: Story = {
  render: () => (
    <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      <Card variant="ncq">
        <CardHeader>
          <CardTitle>بطاقة منصة إن سي كيو</CardTitle>
          <CardDescription>بطاقة مصممة باللغة العربية مع دعم الاتجاه من اليمين لليسار</CardDescription>
        </CardHeader>
        <CardContent>
          <p>هذه بطاقة تدعم اللغة العربية والاتجاه من اليمين لليسار.</p>
          <div className="mt-4">
            <CardStats
              value="١٢,٨٤٧"
              label="إجمالي المستخدمين"
              change="+١٢.٥٪ من الشهر الماضي"
              changeType="positive"
              icon={<Users className="h-4 w-4" />}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ncq">إجراء</Button>
        </CardFooter>
      </Card>

      <Card variant="saudi">
        <CardHeader>
          <CardTitle>البطاقة السعودية</CardTitle>
          <CardDescription>بطاقة بألوان المملكة العربية السعودية</CardDescription>
        </CardHeader>
        <CardContent>
          <p>بطاقة مصممة بالألوان الخضراء والذهبية للمملكة العربية السعودية.</p>
        </CardContent>
        <CardFooter>
          <Button variant="saudi">متابعة</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cards with Arabic text and RTL layout support.',
      },
    },
  },
}