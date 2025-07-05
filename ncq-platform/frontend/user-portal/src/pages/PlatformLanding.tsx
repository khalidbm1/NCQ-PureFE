import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Building2, 
  Activity, 
  CreditCard, 
  Brain, 
  Hotel, 
  Smartphone,
  Shield,
  GitBranch,
  Blocks,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Gauge,
  Code2,
  Users,
  Globe,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  status: 'live' | 'development' | 'coming-soon';
  route: string;
  features: string[];
}

const products: Product[] = [
  {
    id: 'smart-buildings',
    name: 'Smart Buildings',
    description: 'Advanced 3D IoT visualization and management for modern smart buildings',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    status: 'live',
    route: '/smart-buildings',
    features: ['3D Visualization', 'IoT Sensors', 'Energy Management', 'Real-time Analytics']
  },
  {
    id: 'hospital-management',
    name: 'Hospital Management',
    description: 'Comprehensive healthcare management system with patient care focus',
    icon: Activity,
    color: 'from-red-500 to-red-600',
    status: 'live',
    route: '/hospital-management',
    features: ['Patient Records', 'Appointment Scheduling', 'Billing', 'Lab Integration']
  },
  {
    id: 'payment-gateway',
    name: 'Payment Gateway',
    description: 'Secure payment processing with multi-currency and fraud detection',
    icon: CreditCard,
    color: 'from-green-500 to-green-600',
    status: 'live',
    route: '/payment-gateway',
    features: ['3D Secure', 'Multi-currency', 'Fraud Detection', 'Settlement']
  },
  {
    id: 'ncq-llm',
    name: 'NCQ LLM Platform',
    description: 'AI-powered language models for business automation',
    icon: Brain,
    color: 'from-purple-500 to-purple-600',
    status: 'development',
    route: '/ncq-llm',
    features: ['Model Management', 'API Gateway', 'Cost Optimization', 'Analytics']
  },
  {
    id: 'smart-hospitality',
    name: 'Smart Hospitality',
    description: 'Digital transformation for hotels and hospitality services',
    icon: Hotel,
    color: 'from-orange-500 to-orange-600',
    status: 'live',
    route: '/smart-hospitality',
    features: ['Room Management', 'Guest Experience', 'IoT Controls', 'Analytics']
  },
  {
    id: 'mobile-apps',
    name: 'Mobile Apps',
    description: 'Native mobile applications for all NCQ platform services',
    icon: Smartphone,
    color: 'from-indigo-500 to-indigo-600',
    status: 'development',
    route: '/mobile-apps',
    features: ['iOS & Android', 'Push Notifications', 'Offline Mode', 'Biometric Auth']
  },
  {
    id: 'security-hub',
    name: 'Security Hub',
    description: 'Centralized security monitoring and threat detection',
    icon: Shield,
    color: 'from-gray-500 to-gray-600',
    status: 'coming-soon',
    route: '/security-hub',
    features: ['Threat Detection', 'SIEM', 'Compliance', 'Incident Response']
  },
  {
    id: 'iot-platform',
    name: 'IoT Platform',
    description: 'Enterprise IoT device management and data processing',
    icon: GitBranch,
    color: 'from-cyan-500 to-cyan-600',
    status: 'live',
    route: '/iot-platform',
    features: ['Device Management', 'Data Streaming', 'Edge Computing', 'Analytics']
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    description: 'Distributed ledger technology for secure transactions',
    icon: Blocks,
    color: 'from-yellow-500 to-yellow-600',
    status: 'coming-soon',
    route: '/blockchain',
    features: ['Smart Contracts', 'DLT', 'Consensus', 'Tokenization']
  }
];

const statusConfig = {
  'live': {
    label: 'Live Demo',
    variant: 'default' as const,
    className: 'bg-green-500 hover:bg-green-600',
    pulse: true
  },
  'development': {
    label: 'In Development',
    variant: 'secondary' as const,
    className: 'bg-yellow-500 hover:bg-yellow-600',
    pulse: false
  },
  'coming-soon': {
    label: 'Coming Soon',
    variant: 'outline' as const,
    className: 'border-gray-400 text-gray-600',
    pulse: false
  }
};

export default function PlatformLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                NCQ Platform
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
                Products
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
                Solutions
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
                Documentation
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge className="mb-4 px-4 py-1.5" variant="secondary">
            <Sparkles className="w-4 h-4 mr-1" />
            Enterprise SaaS Platform
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 text-transparent bg-clip-text">
            Transform Your Business with NCQ
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Comprehensive suite of enterprise solutions for healthcare, hospitality, payments, and more.
            Experience the future of digital transformation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CheckCircle className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              <Globe className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Products', value: '9+', icon: Gauge },
            { label: 'Enterprise Clients', value: '500+', icon: Users },
            { label: 'API Calls/Day', value: '10M+', icon: Code2 },
            { label: 'Countries', value: '25+', icon: Globe }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 container mx-auto px-6 pb-20">
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Our Products
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const status = statusConfig[product.status];
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    "group relative overflow-hidden h-full transition-all duration-300 hover:shadow-xl cursor-pointer",
                    "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                    "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                  onClick={() => product.status === 'live' && navigate(product.route)}
                >
                  {/* Background gradient */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                    product.color
                  )} />
                  
                  {/* Content */}
                  <div className="relative p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                        product.color
                      )}>
                        <product.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge 
                        variant={status.variant}
                        className={cn(
                          "relative",
                          status.className
                        )}
                      >
                        {status.pulse && (
                          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                        )}
                        <span className="relative">{status.label}</span>
                      </Badge>
                    </div>

                    {/* Title & Description */}
                    <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      {product.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {product.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action */}
                    {product.status === 'live' && (
                      <Button 
                        className="w-full group-hover:bg-gray-900 dark:group-hover:bg-gray-100 transition-colors"
                        variant="outline"
                      >
                        Explore
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of enterprises already using NCQ Platform
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}