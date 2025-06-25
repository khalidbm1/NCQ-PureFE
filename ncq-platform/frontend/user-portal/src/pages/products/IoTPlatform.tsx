import { motion } from 'framer-motion';
import { 
  Wifi, 
  Zap, 
  Thermometer, 
  Shield,
  Smartphone,
  Settings,
  Activity,
  Database
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function IoTPlatform() {
  const metrics = [
    {
      title: 'Connected Devices',
      value: '12,847',
      change: '+18%',
      icon: Wifi,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Data Points/Day',
      value: '2.1M',
      change: '+25%',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Sensors',
      value: '8,456',
      change: '+12%',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Uptime',
      value: '99.9%',
      change: '+0.1%',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IoT Platform</h1>
          <p className="text-muted-foreground">
            Internet of Things device management and analytics platform
          </p>
        </div>
        <Button>
          <Wifi className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-green-600 mt-1">{metric.change} vs last month</p>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Management</CardTitle>
            <CardDescription>Monitor and control connected IoT devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Thermometer className="h-5 w-5 text-muted-foreground" />
                <span>Temperature Sensors</span>
              </div>
              <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800">2,145 Online</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-muted-foreground" />
                <span>Smart Meters</span>
              </div>
              <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800">1,892 Online</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span>Security Cameras</span>
              </div>
              <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800">756 Online</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
            <CardDescription>Comprehensive IoT management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <span>Real-time Analytics</span>
              </div>
              <Button size="sm">View</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <span>Mobile App</span>
              </div>
              <Button size="sm">Download</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span>Device Configuration</span>
              </div>
              <Button size="sm">Configure</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}