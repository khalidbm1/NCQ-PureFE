import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp, 
  Search,
  DollarSign,
  Brain,
  Globe,
  Briefcase,
  Coffee,
  CalendarCheck,
  Activity,
  Play,
  Pause,
  Sparkles,
  CheckCircle,
  Clock,
  Bell,
  ArrowUpRight,
  Eye,
  Signal,
  Map,
  BarChart3,
  Glasses,
  Star,
  Heart,
  Shield,
  Zap,
  Thermometer,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import SaudiMap3D from '../../components/SaudiMap3D';
// import VisitorAnalytics from '../../components/VisitorAnalytics';
// import VRHospitalityExperience from '../../components/VRHospitalityExperience';

// Mock Data with enhanced simulation
const mockBusinesses = [
  { id: '1', name: 'Grand Plaza Hotel', type: 'hotel', rating: 4.8, occupancy: 85, revenue: 45000, bookings: 156 },
  { id: '2', name: 'Skyline Restaurant', type: 'restaurant', rating: 4.6, occupancy: 92, revenue: 12000, bookings: 89 },
  { id: '3', name: 'Conference Center Elite', type: 'event_venue', rating: 4.9, occupancy: 67, revenue: 28000, bookings: 34 },
  { id: '4', name: 'Desert Safari Adventures', type: 'activity', rating: 4.7, occupancy: 78, revenue: 8500, bookings: 67 },
  { id: '5', name: 'Marina Bay Hotel', type: 'hotel', rating: 4.5, occupancy: 91, revenue: 52000, bookings: 203 },
  { id: '6', name: 'Rooftop Dining', type: 'restaurant', rating: 4.4, occupancy: 88, revenue: 15000, bookings: 112 },
];

const liveSearchQueries = [
  'Hotels near downtown',
  'Best restaurants for family dinner',
  'Conference venues with AV equipment',
  'Weekend desert tours',
  'Luxury spa hotels',
  'Italian restaurants',
  'Wedding venues capacity 200+',
  'Adventure activities for groups'
];

// Enhanced Animation Components
function LiveBookingFeed() {
  const [bookings, setBookings] = useState([
    { id: 1, business: 'Grand Plaza Hotel', customer: 'Ahmed S.', amount: 450, time: '2 min ago' },
    { id: 2, business: 'Skyline Restaurant', customer: 'Sarah M.', amount: 120, time: '5 min ago' },
    { id: 3, business: 'Desert Safari', customer: 'Mohammed K.', amount: 200, time: '8 min ago' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBooking = {
        id: Date.now(),
        business: mockBusinesses[Math.floor(Math.random() * mockBusinesses.length)].name,
        customer: ['Ahmed S.', 'Sarah M.', 'Fatima A.', 'Omar H.', 'Layla K.'][Math.floor(Math.random() * 5)],
        amount: Math.floor(Math.random() * 500) + 50,
        time: 'Just now'
      };
      
      setBookings(prev => [newBooking, ...prev.slice(0, 4)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-green-500 animate-pulse" />
          Live Booking Stream
        </CardTitle>
        <CardDescription>Real-time bookings across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex items-center justify-between p-3 bg-green-50 border-l-4 border-green-500 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">{booking.business}</p>
                    <p className="text-xs text-muted-foreground">{booking.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${booking.amount}</p>
                  <p className="text-xs text-muted-foreground">{booking.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

function LiveSearchActivity() {
  const [searchActivity, setSearchActivity] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomQuery = liveSearchQueries[Math.floor(Math.random() * liveSearchQueries.length)];
      const newSearch = {
        id: Date.now(),
        query: randomQuery,
        results: Math.floor(Math.random() * 50) + 10,
        time: 'Just now'
      };
      
      setSearchActivity(prev => [newSearch, ...prev.slice(0, 4)]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-500 animate-pulse" />
          Live Search Activity
        </CardTitle>
        <CardDescription>Real-time traveler searches</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {searchActivity.map((search) => (
              <motion.div
                key={search.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">"{search.query}"</p>
                    <p className="text-xs text-muted-foreground">{search.results} results found</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

function AIInsightsLive() {
  const [insights, setInsights] = useState([
    { type: 'recommendation', message: 'Peak booking time detected: 18:00-20:00', confidence: 94 },
    { type: 'optimization', message: 'Revenue opportunity: Weekend packages +15%', confidence: 87 },
    { type: 'prediction', message: 'High demand forecast for next weekend', confidence: 92 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const aiMessages = [
        { type: 'recommendation', message: 'Suggest promoting afternoon tea service', confidence: Math.floor(Math.random() * 20) + 80 },
        { type: 'optimization', message: 'Optimize room pricing for holiday season', confidence: Math.floor(Math.random() * 15) + 85 },
        { type: 'prediction', message: 'Business traveler surge expected Monday', confidence: Math.floor(Math.random() * 25) + 75 },
        { type: 'alert', message: 'Competitor pricing change detected', confidence: Math.floor(Math.random() * 10) + 90 },
      ];
      
      const newInsight = aiMessages[Math.floor(Math.random() * aiMessages.length)];
      setInsights(prev => [newInsight, ...prev.slice(0, 2)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500 animate-pulse" />
          AI Intelligence Center
        </CardTitle>
        <CardDescription>Live AI-powered business insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {insights.map((insight, index) => (
              <motion.div
                key={`${insight.message}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-start gap-3 p-3 bg-purple-50 border-l-4 border-purple-500 rounded-lg"
              >
                <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{insight.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={insight.confidence} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

function LiveMetricsPanel() {
  const [metrics, setMetrics] = useState({
    activeUsers: 1247,
    revenue: 156780,
    bookingsToday: 89,
    conversionRate: 12.4
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        revenue: prev.revenue + Math.floor(Math.random() * 1000) - 500,
        bookingsToday: prev.bookingsToday + Math.floor(Math.random() * 3),
        conversionRate: Math.max(5, Math.min(20, prev.conversionRate + (Math.random() * 2) - 1))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200"
      >
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">Active Users</span>
        </div>
        <p className="text-2xl font-bold text-blue-700 mt-1">{metrics.activeUsers.toLocaleString()}</p>
        <div className="flex items-center gap-1 mt-1">
          <Signal className="h-3 w-3 text-green-500 animate-pulse" />
          <span className="text-xs text-green-600">Live</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium">Revenue Today</span>
        </div>
        <p className="text-2xl font-bold text-green-700 mt-1">${metrics.revenue.toLocaleString()}</p>
        <div className="flex items-center gap-1 mt-1">
          <ArrowUpRight className="h-3 w-3 text-green-500" />
          <span className="text-xs text-green-600">+5.2%</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium">Bookings</span>
        </div>
        <p className="text-2xl font-bold text-purple-700 mt-1">{metrics.bookingsToday}</p>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="h-3 w-3 text-purple-500 animate-spin" />
          <span className="text-xs text-purple-600">Today</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-600" />
          <span className="text-sm font-medium">Conversion</span>
        </div>
        <p className="text-2xl font-bold text-orange-700 mt-1">{metrics.conversionRate.toFixed(1)}%</p>
        <div className="flex items-center gap-1 mt-1">
          <Activity className="h-3 w-3 text-orange-500 animate-pulse" />
          <span className="text-xs text-orange-600">Live Rate</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function HospitalityHub() {
  const [activeView, setActiveView] = useState('overview');
  const [isSimulating, setIsSimulating] = useState(true);
  const [show3DMap/*, setShow3DMap*/] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  // const handle3DMapToggle = () => {
  //   setShow3DMap(!show3DMap);
  // };

  const handleAnalyticsToggle = () => {
    setShowAnalytics(!showAnalytics);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospitality Hub</h1>
          <p className="text-muted-foreground">
            B2B platform connecting businesses with travelers through AI-powered insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
          >
            <Globe className="mr-2 h-4 w-4" />
            Platform Overview
          </Button>
          <Button 
            variant={activeView === 'map' ? 'default' : 'outline'}
            onClick={() => setActiveView('map')}
          >
            <Map className="mr-2 h-4 w-4" />
            3D Saudi Map
          </Button>
          <Button 
            variant={activeView === 'analytics' ? 'default' : 'outline'}
            onClick={() => setActiveView('analytics')}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Visitor Analytics
          </Button>
          <Button 
            variant={activeView === 'business' ? 'default' : 'outline'}
            onClick={() => setActiveView('business')}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Business Portal
          </Button>
          <Button 
            variant={activeView === 'traveler' ? 'default' : 'outline'}
            onClick={() => setActiveView('traveler')}
          >
            <Users className="mr-2 h-4 w-4" />
            Traveler Portal
          </Button>
          <Button 
            variant={activeView === 'vr' ? 'default' : 'outline'}
            onClick={() => setActiveView('vr')}
          >
            <Glasses className="mr-2 h-4 w-4" />
            VR Experience
          </Button>
          <div className="ml-4 border-l pl-4">
            <Button
              variant={isSimulating ? 'destructive' : 'default'}
              onClick={toggleSimulation}
            >
              {isSimulating ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Stop Demo
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Demo
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Live Activity Banner */}
      {isSimulating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="font-medium">Live Simulation Active</p>
                <p className="text-sm text-muted-foreground">
                  Real-time data flowing • AI recommendations updating • Business analytics live
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="animate-pulse">
              Live Demo
            </Badge>
          </div>
        </motion.div>
      )}

      {/* Live Metrics Panel */}
      {isSimulating && <LiveMetricsPanel />}

      {/* Main Content Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsContent value="overview" className="space-y-6">
          {/* Live Activity Feed */}
          <div className="grid gap-6 lg:grid-cols-3">
            <LiveBookingFeed />
            <LiveSearchActivity />
            <AIInsightsLive />
          </div>

          {/* Business Categories Overview */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Connected Business Types</CardTitle>
                <CardDescription>Live businesses on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Building2, label: 'Hotels', count: 156, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { icon: Coffee, label: 'Restaurants', count: 89, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { icon: CalendarCheck, label: 'Event Venues', count: 45, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { icon: Activity, label: 'Activities', count: 78, color: 'text-green-600', bg: 'bg-green-50' }
                  ].map((category) => (
                    <motion.div
                      key={category.label}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 ${category.bg} rounded-lg border`}
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className={`h-6 w-6 ${category.color}`} />
                        <div>
                          <p className="font-medium">{category.label}</p>
                          <p className={`text-lg font-bold ${category.color}`}>{category.count}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>Real-time system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'System Uptime', value: 99.9, color: 'bg-green-500' },
                    { label: 'API Response Time', value: 95, color: 'bg-blue-500' },
                    { label: 'User Satisfaction', value: 87, color: 'bg-purple-500' },
                    { label: 'Booking Success Rate', value: 96, color: 'bg-orange-500' }
                  ].map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{metric.label}</span>
                        <span className="font-medium">{metric.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 2, delay: 0.2 }}
                          className={`h-full ${metric.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>3D Saudi Arabia Map</CardTitle>
              <CardDescription>
                Interactive 3D visualization of hotels, restaurants, events with IoT sensors and crowd monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              {show3DMap ? (
                <div className="w-full">
                  <SaudiMap3D 
                    selectedCity={selectedCity}
                    onCitySelect={setSelectedCity}
                    viewMode="tourism"
                  />
                </div>
              ) : (
                <div className="h-[600px] w-full rounded-lg overflow-hidden bg-gradient-to-b from-blue-900 via-blue-700 to-green-800 relative">
                  {/* 3D Map Simulation */}
                  <div className="absolute inset-0 bg-opacity-50">
                    <div className="relative h-full w-full p-4">
                      {/* Major Cities */}
                      {[
                        { name: 'Riyadh', x: '50%', y: '45%', type: 'capital', hotels: 45, restaurants: 78, events: 12, iot: 156 },
                        { name: 'Jeddah', x: '25%', y: '65%', type: 'major', hotels: 34, restaurants: 56, events: 8, iot: 123 },
                        { name: 'Dammam', x: '75%', y: '45%', type: 'major', hotels: 28, restaurants: 42, events: 6, iot: 98 },
                        { name: 'Mecca', x: '25%', y: '80%', type: 'holy', hotels: 52, restaurants: 34, events: 15, iot: 189 },
                        { name: 'Medina', x: '25%', y: '30%', type: 'holy', hotels: 38, restaurants: 28, events: 9, iot: 134 },
                        { name: 'Khobar', x: '78%', y: '65%', type: 'city', hotels: 18, restaurants: 35, events: 4, iot: 76 },
                        { name: 'Abha', x: '40%', y: '85%', type: 'city', hotels: 15, restaurants: 22, events: 3, iot: 45 },
                        { name: 'Tabuk', x: '25%', y: '15%', type: 'city', hotels: 12, restaurants: 18, events: 2, iot: 34 }
                      ].map((city, index) => (
                        <motion.div
                          key={city.name}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 }}
                          className="absolute cursor-pointer group"
                          style={{ left: city.x, top: city.y, transform: 'translate(-50%, -50%)' }}
                          whileHover={{ scale: 1.2, zIndex: 10 }}
                        >
                          <div className={`
                            relative w-8 h-8 rounded-full border-2 border-white shadow-lg
                            ${city.type === 'capital' ? 'bg-yellow-400' :
                              city.type === 'holy' ? 'bg-green-400' :
                              city.type === 'major' ? 'bg-blue-400' : 'bg-purple-400'}
                          `}>
                            <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-30" />
                            <Building2 className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          
                          {/* Hover Info Card */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-xl p-3 min-w-[200px] z-20">
                            <h4 className="font-bold text-sm mb-2">{city.name}</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-blue-600" />
                                <span>{city.hotels} Hotels</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Coffee className="w-3 h-3 text-orange-600" />
                                <span>{city.restaurants} Restaurants</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-purple-600" />
                                <span>{city.events} Events</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Activity className="w-3 h-3 text-green-600" />
                                <span>{city.iot} IoT Sensors</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Live IoT Indicators */}
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse" />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-2">Legend</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
                          <span>Capital City</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                          <span>Holy Cities</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full border border-white"></div>
                          <span>Major Cities</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Live IoT Data</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Live Stats */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-2">Live Network Stats</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Properties:</span>
                          <span className="font-bold">242</span>
                        </div>
                        <div className="flex justify-between">
                          <span>IoT Sensors:</span>
                          <span className="font-bold text-green-600">855</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Events:</span>
                          <span className="font-bold text-purple-600">59</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Occupancy Rate:</span>
                          <span className="font-bold text-blue-600">87%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Analytics Dashboard</CardTitle>
              <CardDescription>Real-time visitor behavior and platform insights</CardDescription>
            </CardHeader>
            <CardContent>
              {showAnalytics ? (
                <div className="space-y-6">
                  {/* Visitor Analytics */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Visitor Demographics</CardTitle>
                        <CardDescription>Country-wise visitor breakdown</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            { country: 'United States', visitors: 2847, flag: '🇺🇸', growth: '+12%' },
                            { country: 'United Kingdom', visitors: 1923, flag: '🇬🇧', growth: '+8%' },
                            { country: 'Germany', visitors: 1456, flag: '🇩🇪', growth: '+15%' },
                            { country: 'France', visitors: 1234, flag: '🇫🇷', growth: '+6%' },
                            { country: 'UAE', visitors: 1987, flag: '🇦🇪', growth: '+22%' },
                            { country: 'Other', visitors: 3245, flag: '🌍', growth: '+18%' }
                          ].map((data) => (
                            <div key={data.country} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{data.flag}</span>
                                <div>
                                  <p className="font-medium">{data.country}</p>
                                  <p className="text-sm text-muted-foreground">{data.visitors.toLocaleString()} visitors</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm text-green-600">{data.growth}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>AI Insights</CardTitle>
                        <CardDescription>Real-time pattern analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              insight: 'Peak Booking Hours',
                              description: '2-4 PM shows highest conversion rates',
                              confidence: 94,
                              type: 'timing'
                            },
                            {
                              insight: 'Popular Destinations',
                              description: 'Riyadh attractions trending +45% this week',
                              confidence: 87,
                              type: 'location'
                            },
                            {
                              insight: 'Pricing Opportunity',
                              description: 'Weekend rates can increase by 20%',
                              confidence: 91,
                              type: 'revenue'
                            },
                            {
                              insight: 'Weather Impact',
                              description: 'Clear weather increases outdoor bookings by 65%',
                              confidence: 88,
                              type: 'weather'
                            }
                          ].map((insight, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-sm">{insight.insight}</h4>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  {insight.confidence}% confidence
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{insight.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Travel Patterns */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Travel Patterns & Preferences</CardTitle>
                      <CardDescription>Booking behavior and preferences analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 lg:grid-cols-3">
                        <div>
                          <h4 className="font-semibold mb-3">Popular Travel Purposes</h4>
                          <div className="space-y-2">
                            {[
                              { purpose: 'Business Travel', percentage: 45 },
                              { purpose: 'Tourism', percentage: 32 },
                              { purpose: 'Religious Pilgrimage', percentage: 15 },
                              { purpose: 'Family Visit', percentage: 8 }
                            ].map((data) => (
                              <div key={data.purpose}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{data.purpose}</span>
                                  <span>{data.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${data.percentage}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Booking Timeline</h4>
                          <div className="space-y-2">
                            {[
                              { period: 'Same Day', bookings: 18 },
                              { period: '1-3 Days', bookings: 35 },
                              { period: '1 Week', bookings: 28 },
                              { period: '1+ Month', bookings: 19 }
                            ].map((data) => (
                              <div key={data.period} className="flex justify-between text-sm">
                                <span>{data.period}</span>
                                <span className="font-medium">{data.bookings}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Device Usage</h4>
                          <div className="space-y-2">
                            {[
                              { device: 'Mobile', usage: 62 },
                              { device: 'Desktop', usage: 28 },
                              { device: 'Tablet', usage: 10 }
                            ].map((data) => (
                              <div key={data.device} className="flex justify-between text-sm">
                                <span>{data.device}</span>
                                <span className="font-medium">{data.usage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Advanced visitor analytics and behavior tracking</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Demographics, preferences, booking patterns, engagement metrics, and AI-powered insights
                  </p>
                  <Button className="mt-4" variant="outline" onClick={handleAnalyticsToggle}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {showAnalytics ? 'Hide Analytics Dashboard' : 'View Analytics Dashboard'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          {/* Hub Owner 360° Overview */}
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                Hub Owner 360° Dashboard
              </CardTitle>
              <CardDescription>Comprehensive overview of your hospitality and smart buildings ecosystem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Total Revenue</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">$234.8K</div>
                  <div className="text-xs text-muted-foreground">Hospitality + Buildings</div>
                  <div className="text-xs text-green-600 mt-1">+18% this month</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Properties</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">28</div>
                  <div className="text-xs text-muted-foreground">Hotels + Smart Buildings</div>
                  <div className="text-xs text-blue-600 mt-1">97% occupied</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">IoT Ecosystem</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">2,847</div>
                  <div className="text-xs text-muted-foreground">Connected devices</div>
                  <div className="text-xs text-purple-600 mt-1">99.7% uptime</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Active Users</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">4,156</div>
                  <div className="text-xs text-muted-foreground">Guests + Tenants</div>
                  <div className="text-xs text-orange-600 mt-1">4.8★ satisfaction</div>
                </div>
              </div>
              
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-blue-600" />
                    Hospitality Network
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Hotels & Resorts</span>
                      <span className="font-medium">12 properties</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Restaurants & Cafes</span>
                      <span className="font-medium">8 locations</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Event Venues</span>
                      <span className="font-medium">4 facilities</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Activity Centers</span>
                      <span className="font-medium">4 centers</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-600" />
                    Smart Buildings Network
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Commercial Buildings</span>
                      <span className="font-medium">6 towers</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Residential Complexes</span>
                      <span className="font-medium">3 complexes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mixed-Use Properties</span>
                      <span className="font-medium">3 buildings</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Energy Efficiency</span>
                      <span className="font-medium text-green-600">94% optimized</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Performance Overview */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Unified Revenue Analytics
                </CardTitle>
                <CardDescription>Cross-platform financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">$234,780</div>
                    <div className="text-sm text-muted-foreground">Today's Revenue</div>
                    <div className="text-xs text-green-600 mt-1">+18.5% from yesterday</div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Revenue Breakdown by Platform</h4>
                    {[
                      { source: 'Hotel Bookings', amount: 89420, percentage: 38, type: 'hospitality' },
                      { source: 'Smart Buildings Rent', amount: 78000, percentage: 33, type: 'buildings' },
                      { source: 'Restaurant Sales', amount: 34560, percentage: 15, type: 'hospitality' },
                      { source: 'IoT Services', amount: 23800, percentage: 10, type: 'buildings' },
                      { source: 'Events & Activities', amount: 9000, percentage: 4, type: 'hospitality' }
                    ].map((item) => (
                      <div key={item.source} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span>{item.source}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              item.type === 'hospitality' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {item.type === 'hospitality' ? 'H' : 'SB'}
                            </span>
                          </div>
                          <span className="font-medium">${item.amount.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              item.type === 'hospitality' ? 'bg-blue-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Guest Experience
                </CardTitle>
                <CardDescription>Satisfaction and occupancy metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">4.8</div>
                      <div className="text-xs text-muted-foreground">Avg Rating</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">87%</div>
                      <div className="text-xs text-muted-foreground">Occupancy</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Recent Reviews</h4>
                    {[
                      { guest: 'Sarah M.', rating: 5, comment: 'Amazing smart room controls!', time: '2h ago' },
                      { guest: 'Ahmed K.', rating: 4, comment: 'Great automated check-in', time: '5h ago' },
                      { guest: 'Lisa R.', rating: 5, comment: 'Perfect temperature control', time: '1d ago' }
                    ].map((review, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium">{review.guest}</span>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">{review.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Smart Building IoT
                </CardTitle>
                <CardDescription>Real-time building sensors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      name: 'Climate Control', 
                      value: '22.5°C', 
                      status: 'optimal', 
                      icon: Thermometer,
                      trend: 'stable',
                      efficiency: '96%'
                    },
                    { 
                      name: 'Energy Usage', 
                      value: '847 kW', 
                      status: 'efficient', 
                      icon: Zap,
                      trend: 'decreasing',
                      efficiency: '94%'
                    },
                    { 
                      name: 'Guest Comfort', 
                      value: '4.7/5', 
                      status: 'excellent', 
                      icon: Heart,
                      trend: 'improving',
                      efficiency: '98%'
                    },
                    { 
                      name: 'Security Status', 
                      value: 'All Clear', 
                      status: 'secure', 
                      icon: Shield,
                      trend: 'stable',
                      efficiency: '100%'
                    }
                  ].map((sensor) => (
                    <div key={sensor.name} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <sensor.icon className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">{sensor.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          sensor.status === 'optimal' || sensor.status === 'excellent' || sensor.status === 'secure' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {sensor.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{sensor.value}</span>
                        <span className="text-xs text-muted-foreground">{sensor.efficiency} efficiency</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Smart Building Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Smart Building Controls</CardTitle>
              <CardDescription>Manage your property's IoT systems and automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Environmental Controls</h4>
                  <div className="space-y-3">
                    {[
                      { zone: 'Guest Rooms', temp: 22, humidity: 45, occupancy: 156 },
                      { zone: 'Restaurant Area', temp: 24, humidity: 50, occupancy: 89 },
                      { zone: 'Lobby & Reception', temp: 23, humidity: 48, occupancy: 34 },
                      { zone: 'Event Halls', temp: 21, humidity: 52, occupancy: 67 }
                    ].map((zone) => (
                      <div key={zone.zone} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-medium">{zone.zone}</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {zone.occupancy} guests
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Temperature: </span>
                            <span className="font-medium">{zone.temp}°C</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Humidity: </span>
                            <span className="font-medium">{zone.humidity}%</span>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">Adjust</Button>
                          <Button size="sm" variant="outline">Auto Mode</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Operational Insights</h4>
                  <div className="space-y-3">
                    {[
                      { 
                        metric: 'Energy Efficiency', 
                        value: '94%', 
                        change: '+2%',
                        description: 'HVAC optimization saved $890 this week'
                      },
                      { 
                        metric: 'Guest Satisfaction', 
                        value: '4.8/5', 
                        change: '+0.2',
                        description: 'Smart room controls improved ratings'
                      },
                      { 
                        metric: 'Predictive Maintenance', 
                        value: '3 alerts', 
                        change: 'new',
                        description: 'AC unit in Room 204 needs attention'
                      },
                      { 
                        metric: 'Space Utilization', 
                        value: '87%', 
                        change: '+5%',
                        description: 'Common areas optimally utilized'
                      }
                    ].map((insight) => (
                      <div key={insight.metric} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">{insight.metric}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {insight.change}
                          </span>
                        </div>
                        <div className="text-lg font-bold mb-1">{insight.value}</div>
                        <p className="text-xs text-muted-foreground">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Optimization */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Business Optimization</CardTitle>
              <CardDescription>Automated recommendations for maximum efficiency and guest satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Cross-Platform Recommendations</h4>
                  {[
                    {
                      type: 'revenue',
                      title: 'Smart Building-Hotel Integration',
                      description: 'Offer premium smart room experiences to building tenants for 25% rate premium',
                      impact: '+$4,800 potential revenue',
                      priority: 'high',
                      platform: 'unified'
                    },
                    {
                      type: 'efficiency',
                      title: 'Energy Optimization Across Portfolio',
                      description: 'Apply smart building HVAC algorithms to hotel properties',
                      impact: '-$1,240 monthly cost',
                      priority: 'high',
                      platform: 'buildings'
                    },
                    {
                      type: 'guest',
                      title: 'IoT-Enhanced Guest Experience',
                      description: 'Deploy smart building sensors for predictive guest comfort',
                      impact: '+0.5 rating boost',
                      priority: 'medium',
                      platform: 'hospitality'
                    },
                    {
                      type: 'analytics',
                      title: 'Cross-Platform Data Insights',
                      description: 'Leverage building occupancy data for restaurant demand forecasting',
                      impact: '+15% efficiency gain',
                      priority: 'medium',
                      platform: 'unified'
                    }
                  ].map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{rec.title}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            rec.platform === 'unified' ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700' :
                            rec.platform === 'hospitality' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {rec.platform === 'unified' ? '⚡' : rec.platform === 'hospitality' ? 'H' : 'SB'}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-green-600">{rec.impact}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Implement</Button>
                          <Button size="sm" variant="outline">Schedule</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Cross-Platform Performance</h4>
                  <div className="space-y-3">
                    {[
                      { period: 'This Week', metric: 'Total Revenue', value: '$234,780', trend: '+18%', platform: 'unified' },
                      { period: 'This Month', metric: 'Portfolio Occupancy', value: '92%', trend: '+7%', platform: 'unified' },
                      { period: 'This Quarter', metric: 'Guest Satisfaction', value: '4.8/5', trend: '+0.4', platform: 'hospitality' },
                      { period: 'This Year', metric: 'Energy Efficiency', value: '94%', trend: '+12%', platform: 'buildings' },
                      { period: 'YTD', metric: 'IoT Device Uptime', value: '99.7%', trend: '+2.1%', platform: 'buildings' },
                      { period: 'Overall', metric: 'Cross-Platform Synergy', value: '87%', trend: '+15%', platform: 'unified' }
                    ].map((trend) => (
                      <div key={trend.period} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-xs text-muted-foreground">{trend.period}</div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{trend.metric}</div>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                trend.platform === 'unified' ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700' :
                                trend.platform === 'hospitality' ? 'bg-blue-100 text-blue-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {trend.platform === 'unified' ? '⚡' : trend.platform === 'hospitality' ? 'H' : 'SB'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{trend.value}</div>
                            <div className="text-xs text-green-600">{trend.trend}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traveler" className="space-y-6">
          {/* Traveler Welcome Dashboard */}
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-green-600" />
                Welcome to Saudi Arabia Hospitality Network
              </CardTitle>
              <CardDescription>AI-powered travel discovery with real-time IoT insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Smart Discovery</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <div className="text-xs text-muted-foreground">Available experiences</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Live Insights</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">Real-time</div>
                  <div className="text-xs text-muted-foreground">IoT-powered data</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">AI Recommendations</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-xs text-muted-foreground">Personalized</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Real-time Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions based on real-time data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: 'hotel',
                      name: 'Grand Plaza Riyadh',
                      description: 'Smart rooms with IoT climate control',
                      price: '$180/night',
                      crowdLevel: 'low',
                      iotFeatures: ['Smart AC', 'Auto Lighting', 'Voice Control'],
                      rating: 4.8,
                      availability: 'Available'
                    },
                    {
                      type: 'restaurant',
                      name: 'Rooftop Garden Jeddah',
                      description: 'Real-time air quality monitoring',
                      price: '$45/person',
                      crowdLevel: 'medium',
                      iotFeatures: ['Air Quality', 'Noise Level', 'Wait Time'],
                      rating: 4.6,
                      availability: '15 min wait'
                    },
                    {
                      type: 'activity',
                      name: 'Desert Safari Experience',
                      description: 'Live weather and crowd monitoring',
                      price: '$95/person',
                      crowdLevel: 'optimal',
                      iotFeatures: ['Weather Sensors', 'Safety Tracking', 'Group Size'],
                      rating: 4.9,
                      availability: 'Perfect conditions'
                    }
                  ].map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{rec.name}</h4>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{rec.price}</div>
                          <div className="text-xs text-muted-foreground">{rec.availability}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(rec.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm">{rec.rating}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          rec.crowdLevel === 'low' ? 'bg-green-100 text-green-700' :
                          rec.crowdLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {rec.crowdLevel} crowd
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {rec.iotFeatures.map((feature) => (
                          <span key={feature} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <Button size="sm" className="w-full">
                        Book Now
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live City Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Live City Insights
                </CardTitle>
                <CardDescription>Real-time conditions across Saudi Arabia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { city: 'Riyadh', temp: '28°C', airQuality: 'Good', crowdLevel: 65, events: 12, safety: 'High' },
                    { city: 'Jeddah', temp: '31°C', airQuality: 'Excellent', crowdLevel: 78, events: 8, safety: 'High' },
                    { city: 'Dammam', temp: '29°C', airQuality: 'Good', crowdLevel: 45, events: 6, safety: 'High' },
                    { city: 'Mecca', temp: '33°C', airQuality: 'Fair', crowdLevel: 89, events: 15, safety: 'High' }
                  ].map((city) => (
                    <div key={city.city} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold">{city.city}</h4>
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium">{city.temp}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Air Quality</div>
                          <div className={`font-medium ${
                            city.airQuality === 'Excellent' ? 'text-green-600' :
                            city.airQuality === 'Good' ? 'text-blue-600' : 'text-yellow-600'
                          }`}>
                            {city.airQuality}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Safety Level</div>
                          <div className="font-medium text-green-600">{city.safety}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Crowd Density</div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className={`h-full rounded-full ${
                                  city.crowdLevel > 80 ? 'bg-red-500' :
                                  city.crowdLevel > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${city.crowdLevel}%` }}
                              />
                            </div>
                            <span className="text-xs">{city.crowdLevel}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Active Events</div>
                          <div className="font-medium text-purple-600">{city.events} events</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Smart Booking Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Smart Discovery & Booking
              </CardTitle>
              <CardDescription>AI-powered search with real-time IoT insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          placeholder="Search hotels, restaurants, activities..."
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                      <Button>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {['Near me', 'Low crowd', 'Best air quality', 'Smart rooms', 'Live events', 'Family friendly'].map((filter) => (
                        <Button key={filter} variant="outline" size="sm">
                          {filter}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Live Travel Tips</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Best time to visit Riyadh: Now (optimal weather)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span>Jeddah restaurants: 15 min avg wait time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span>Desert activities: Perfect conditions detected</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vr" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>VR Hospitality Experience</CardTitle>
              <CardDescription>
                Immersive virtual reality visualization of the Saudi Arabia hospitality network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Glasses className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  VR Hospitality Experience - Immersive virtual reality visualization
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  3D visualization of Saudi Arabia hospitality network with real-time data
                </p>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">VR Controls:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Move with WASD keys</li>
                  <li>• Look around with mouse</li>
                  <li>• Click "Enter VR" button for full immersive experience</li>
                  <li>• View live metrics and business data in 3D space</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}