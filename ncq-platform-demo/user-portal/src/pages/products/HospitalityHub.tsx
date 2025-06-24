import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp, 
  Search,
  MapPin,
  Star,
  DollarSign,
  BarChart3,
  Brain,
  Globe,
  Briefcase,
  Coffee,
  CalendarCheck,
  Activity,
  Play,
  Pause,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { mockBusinesses, generateBusinessMetrics, type Business } from '@/data/hospitalityData';
import { useHospitalitySimulation } from '@/stores/hospitalitySimulation';

export default function HospitalityHub() {
  const [activeView, setActiveView] = useState<'overview' | 'business' | 'traveler' | 'insights'>('overview');
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  
  const { 
    businesses, 
    bookings, 
    isSimulating, 
    liveMetrics, 
    startSimulation, 
    stopSimulation 
  } = useHospitalitySimulation();
  
  useEffect(() => {
    return () => {
      stopSimulation();
    };
  }, [stopSimulation]);

  const totalBusinesses = businesses.length;
  const totalBookings = bookings.length;
  const aiRecommendations = liveMetrics.aiRecommendations;

  const metrics = [
    {
      title: 'Connected Businesses',
      value: totalBusinesses.toString(),
      change: '+12%',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Travelers',
      value: isSimulating ? liveMetrics.activeUsers.toString() : '2.4K',
      change: '+18%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Bookings',
      value: totalBookings.toString(),
      change: '+25%',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'AI Insights Generated',
      value: aiRecommendations.toString(),
      change: '+40%',
      icon: Brain,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const businessCategories = [
    { type: 'hotel', label: 'Hotels', icon: Building2, count: businesses.filter(b => b.type === 'hotel').length },
    { type: 'restaurant', label: 'Restaurants', icon: Coffee, count: businesses.filter(b => b.type === 'restaurant').length },
    { type: 'event_venue', label: 'Event Venues', icon: CalendarCheck, count: businesses.filter(b => b.type === 'event_venue').length },
    { type: 'activity', label: 'Activities', icon: Activity, count: businesses.filter(b => b.type === 'activity').length }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
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
            Overview
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
            variant={activeView === 'insights' ? 'default' : 'outline'}
            onClick={() => setActiveView('insights')}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            AI Insights
          </Button>
          <div className="ml-4 border-l pl-4">
            <Button
              variant={isSimulating ? 'destructive' : 'default'}
              onClick={isSimulating ? stopSimulation : startSimulation}
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
                  {liveMetrics.activeUsers} active users • Latest search: "{liveMetrics.recentSearches[0]}"
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="animate-pulse">
              {(liveMetrics.conversionRate * 100).toFixed(1)}% conversion rate
            </Badge>
          </div>
        </motion.div>
      )}

      {/* Overview View */}
      {activeView === 'overview' && (
        <>
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

          {/* Platform Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Ecosystem</CardTitle>
                <CardDescription>Connected business categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {businessCategories.map((category) => (
                  <div key={category.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <category.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{category.label}</span>
                    </div>
                    <Badge variant="secondary">{category.count} active</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Performance</CardTitle>
                <CardDescription>Recommendation engine metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Recommendation Accuracy</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>User Engagement Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Booking Conversion</span>
                    <span className="font-medium">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Business Satisfaction</span>
                    <span className="font-medium">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>Live feed of bookings and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(-5).reverse().map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        booking.status === 'confirmed' ? 'bg-green-50' : 
                        booking.status === 'completed' ? 'bg-blue-50' : 'bg-yellow-50'
                      }`}>
                        <Calendar className={`h-4 w-4 ${
                          booking.status === 'confirmed' ? 'text-green-600' : 
                          booking.status === 'completed' ? 'text-blue-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{booking.businessName}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.date} • {booking.guests} guests • ${booking.totalAmount}
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      booking.status === 'confirmed' ? 'default' : 
                      booking.status === 'completed' ? 'secondary' : 'outline'
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Business Portal View */}
      {activeView === 'business' && (
        <BusinessPortal 
          businesses={businesses}
          selectedBusiness={selectedBusiness}
          setSelectedBusiness={setSelectedBusiness}
        />
      )}

      {/* Traveler Portal View */}
      {activeView === 'traveler' && (
        <TravelerPortal businesses={businesses} />
      )}

      {/* AI Insights View */}
      {activeView === 'insights' && (
        <AIInsights />
      )}
    </motion.div>
  );
}

// Business Portal Component
function BusinessPortal({ businesses, selectedBusiness, setSelectedBusiness }: { businesses: Business[], selectedBusiness: string | null, setSelectedBusiness: (id: string | null) => void }) {
  const businessList = businesses.filter((b: Business) => b.type === 'hotel' || b.type === 'restaurant');
  const metrics = selectedBusiness ? generateBusinessMetrics(selectedBusiness) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Business List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Your Businesses</CardTitle>
          <CardDescription>Manage your connected properties</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {businessList.map((business: Business) => (
            <Button
              key={business.id}
              variant={selectedBusiness === business.id ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setSelectedBusiness(business.id)}
            >
              {business.type === 'hotel' ? <Building2 className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
              <span className="ml-2">{business.name}</span>
            </Button>
          ))}
          <Button variant="outline" className="w-full">
            + Add New Business
          </Button>
        </CardContent>
      </Card>

      {/* Business Details */}
      {selectedBusiness && metrics && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{businessList.find((b: Business) => b.id === selectedBusiness)?.name}</CardTitle>
            <CardDescription>Performance metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="metrics">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold">{metrics.bookings}</p>
                      <p className="text-sm text-green-600">+15% vs last period</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</p>
                      <p className="text-sm text-green-600">+22% vs last period</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                      <p className="text-2xl font-bold">{(metrics.occupancyRate * 100).toFixed(0)}%</p>
                      <Progress value={metrics.occupancyRate * 100} className="mt-2 h-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{metrics.averageRating.toFixed(1)}</p>
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="bookings" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Popular Time Slots</h4>
                  {metrics.popularTimeSlots.map((slot) => (
                    <div key={slot.time} className="flex items-center justify-between">
                      <span className="text-sm">{slot.time}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(slot.bookings / 30) * 100} className="w-24 h-2" />
                        <span className="text-sm font-medium">{slot.bookings}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="ai-insights" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Predictions
                    </h4>
                    <p className="text-sm mt-2">Next month bookings forecast: <strong>{metrics.aiPredictions.nextMonthBookings}</strong></p>
                    <p className="text-sm">Demand forecast: <Badge>{metrics.aiPredictions.demandForecast}</Badge></p>
                    <p className="text-sm">Recommended pricing: <strong>${metrics.aiPredictions.recommendedPricing}/night</strong></p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Suggested Promotions</h4>
                    <div className="space-y-2">
                      {metrics.aiPredictions.suggestedPromotions.map((promo, i) => (
                        <div key={i} className="p-3 border rounded-lg text-sm">
                          {promo}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Traveler Portal Component
function TravelerPortal({ businesses }: { businesses: typeof mockBusinesses }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || business.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search hotels, restaurants, activities..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <MapPin className="mr-2 h-4 w-4" />
              Near Me
            </Button>
          </div>
          <div className="flex gap-2 mt-4">
            {['hotel', 'restaurant', 'event_venue', 'activity'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Recommendations for You
          </CardTitle>
          <CardDescription>Based on your preferences and behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredBusinesses.filter(b => b.aiScore > 0.9).slice(0, 3).map((business) => (
              <div key={business.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{business.name}</h4>
                  <Badge variant="secondary">{(business.aiScore * 100).toFixed(0)}% match</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{business.location.city}</p>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">{business.rating}</span>
                  <span className="text-sm text-muted-foreground">({business.reviewCount} reviews)</span>
                </div>
                <Button size="sm" className="w-full">View Details</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBusinesses.map((business) => (
          <Card key={business.id} className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200" />
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{business.name}</h3>
                  <p className="text-sm text-muted-foreground">{business.location.city}</p>
                </div>
                {business.trending && <Badge variant="secondary">Trending</Badge>}
              </div>
              <p className="text-sm mt-2 line-clamp-2">{business.description}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{business.rating}</span>
                  <span className="text-sm text-muted-foreground">({business.reviewCount})</span>
                </div>
                <span className="text-sm font-medium">{business.priceRange}</span>
              </div>
              <Button className="w-full mt-4">Book Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// AI Insights Component
function AIInsights() {
  return (
    <div className="space-y-6">
      {/* AI Overview */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Business Intelligence</CardTitle>
          <CardDescription>Real-time insights and predictions for the hospitality industry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <h4 className="font-medium">Demand Forecasting</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Predict booking patterns up to 3 months in advance with 94% accuracy
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <DollarSign className="h-8 w-8 text-blue-600 mb-2" />
                <h4 className="font-medium">Dynamic Pricing</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Optimize pricing based on demand, competition, and market trends
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <h4 className="font-medium">Customer Insights</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Understand traveler preferences and predict booking behavior
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Market Trends & Analysis</CardTitle>
          <CardDescription>Industry-wide insights powered by aggregated data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends">
            <TabsList>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="segments">Customer Segments</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Sustainable Tourism</p>
                    <p className="text-sm text-muted-foreground">Growing demand for eco-friendly options</p>
                  </div>
                  <Badge variant="default">+45% YoY</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Experiential Travel</p>
                    <p className="text-sm text-muted-foreground">Activities and local experiences</p>
                  </div>
                  <Badge variant="default">+38% YoY</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Business Travel Recovery</p>
                    <p className="text-sm text-muted-foreground">Corporate bookings increasing</p>
                  </div>
                  <Badge variant="default">+22% YoY</Badge>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="segments" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">By Travel Purpose</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Leisure</span>
                      <span>58%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Business</span>
                      <span>28%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Events</span>
                      <span>14%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">By Spending Pattern</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Luxury</span>
                      <span>32%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Moderate</span>
                      <span>45%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Budget</span>
                      <span>23%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="predictions" className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium">Q2 2024 Forecast</h4>
                <div className="mt-3 space-y-2">
                  <p className="text-sm">• Overall bookings expected to increase by 18-22%</p>
                  <p className="text-sm">• Weekend occupancy rates projected at 85-90%</p>
                  <p className="text-sm">• International travelers to grow by 30%</p>
                  <p className="text-sm">• Peak demand expected during spring festivals</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}