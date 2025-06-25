import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Star, 
  Activity,
  Brain,
  Shield,
  Camera,
  Filter,
  Bookmark,
  Share2,
  MessageCircle,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

// Mock data for experiences
const mockExperiences = [
  {
    id: 1,
    name: 'Luxury Desert Resort Experience',
    type: 'hotel',
    location: 'Al Khobar',
    price: 450,
    rating: 4.9,
    reviews: 156,
    image: '/api/placeholder/300/200',
    description: 'Experience luxury in the heart of the desert with smart room controls and personalized AI concierge.',
    amenities: ['Smart AC', 'IoT Lighting', 'Voice Control', 'Air Quality Monitor'],
    crowdLevel: 'low',
    availability: 'Available',
    distance: '2.3 km',
    category: 'Luxury',
    instantBook: true,
    iotFeatures: ['Smart Climate', 'Automated Lighting', 'Voice Assistant', 'Health Monitoring']
  },
  {
    id: 2,
    name: 'Rooftop Fusion Restaurant',
    type: 'restaurant',
    location: 'Riyadh Downtown',
    price: 85,
    rating: 4.7,
    reviews: 289,
    image: '/api/placeholder/300/200',
    description: 'Modern Saudi cuisine with real-time air quality monitoring and crowd-free dining.',
    amenities: ['Live Kitchen', 'City View', 'Air Quality Control', 'Sound Level Management'],
    crowdLevel: 'medium',
    availability: '20 min wait',
    distance: '1.8 km',
    category: 'Fine Dining',
    instantBook: false,
    iotFeatures: ['Air Quality', 'Noise Control', 'Table Sensors', 'Smart Ordering']
  },
  {
    id: 3,
    name: 'Heritage Cultural Walking Tour',
    type: 'activity',
    location: 'Jeddah Old Town',
    price: 65,
    rating: 4.8,
    reviews: 124,
    image: '/api/placeholder/300/200',
    description: 'Explore Jeddah\'s rich history with AI-guided tours and real-time safety monitoring.',
    amenities: ['Audio Guide', 'Safety Tracking', 'Weather Updates', 'Group Communication'],
    crowdLevel: 'optimal',
    availability: 'Perfect conditions',
    distance: '0.5 km',
    category: 'Cultural',
    instantBook: true,
    iotFeatures: ['GPS Tracking', 'Weather Sensors', 'Safety Alerts', 'Group Coordination']
  },
  {
    id: 4,
    name: 'Sky Tower Observatory',
    type: 'attraction',
    location: 'Riyadh',
    price: 120,
    rating: 4.6,
    reviews: 445,
    image: '/api/placeholder/300/200',
    description: 'Panoramic city views with smart weather monitoring and optimal viewing conditions.',
    amenities: ['360° Views', 'Weather Station', 'Smart Telescopes', 'Interactive Displays'],
    crowdLevel: 'low',
    availability: 'Clear skies',
    distance: '3.2 km',
    category: 'Sightseeing',
    instantBook: true,
    iotFeatures: ['Weather Monitor', 'Crowd Sensors', 'Smart Displays', 'Air Quality']
  }
];

const mockCities = [
  { name: 'Riyadh', temp: '28°C', airQuality: 'Good', crowdLevel: 65, events: 12, safety: 'High' },
  { name: 'Jeddah', temp: '31°C', airQuality: 'Excellent', crowdLevel: 78, events: 8, safety: 'High' },
  { name: 'Dammam', temp: '29°C', airQuality: 'Good', crowdLevel: 45, events: 6, safety: 'High' },
  { name: 'Mecca', temp: '33°C', airQuality: 'Fair', crowdLevel: 89, events: 15, safety: 'High' }
];

const mockRecommendations = [
  {
    title: 'Best Time for Desert Safari',
    description: 'Perfect weather conditions detected for the next 3 hours',
    type: 'weather',
    icon: '🌤️',
    action: 'Book Now'
  },
  {
    title: 'Avoid Downtown Riyadh',
    description: 'High crowd density detected. Alternative routes suggested',
    type: 'crowd',
    icon: '🚶‍♂️',
    action: 'View Alternatives'
  },
  {
    title: 'Air Quality Alert',
    description: 'Excellent air quality in Jeddah coastal areas',
    type: 'air',
    icon: '🌊',
    action: 'Explore Area'
  }
];

export default function TravelerPortal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([]);
  const [liveUpdates] = useState(true);

  // Live data simulation
  useEffect(() => {
    if (!liveUpdates) return;
    
    const interval = setInterval(() => {
      // Simulate live updates to crowd levels, prices, etc.
    }, 5000);

    return () => clearInterval(interval);
  }, [liveUpdates]);

  const filteredExperiences = mockExperiences.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exp.type === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || exp.location.includes(selectedLocation);
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const toggleBookmark = (id: number) => {
    setBookmarkedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Traveler Experience Portal</h1>
          <p className="text-muted-foreground">
            Discover and book amazing experiences with AI-powered recommendations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </Button>
          <Button variant="outline">
            <Bookmark className="w-4 h-4 mr-2" />
            Saved ({bookmarkedItems.length})
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-xs text-muted-foreground">Experiences Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">Real-time</div>
                <div className="text-xs text-muted-foreground">IoT Data Updates</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs text-muted-foreground">AI Recommendations</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">4.8★</div>
                <div className="text-xs text-muted-foreground">Safety Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Live AI Recommendations
          </CardTitle>
          <CardDescription>Real-time suggestions based on current conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {mockRecommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-white rounded-lg border"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{rec.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                    <Button size="sm" variant="outline" className="mt-2 text-xs">
                      {rec.action}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Search and Filters */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Discover Experiences</CardTitle>
            <CardDescription>Smart search with real-time availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search hotels, restaurants, activities..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button>
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <select 
                  className="px-3 py-1 border rounded-lg text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="hotel">Hotels</option>
                  <option value="restaurant">Restaurants</option>
                  <option value="activity">Activities</option>
                  <option value="attraction">Attractions</option>
                </select>

                <select 
                  className="px-3 py-1 border rounded-lg text-sm"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  <option value="Riyadh">Riyadh</option>
                  <option value="Jeddah">Jeddah</option>
                  <option value="Dammam">Dammam</option>
                  <option value="Khobar">Al Khobar</option>
                </select>

                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-1" />
                  More Filters
                </Button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                {['Near me', 'Low crowd', 'Best air quality', 'Instant book', 'Smart features', 'Family friendly'].map((filter) => (
                  <Button key={filter} variant="outline" size="sm" className="text-xs">
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live City Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Live Conditions
            </CardTitle>
            <CardDescription>Real-time city insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCities.map((city) => (
                <div key={city.name} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{city.name}</h4>
                    <span className="text-sm font-medium">{city.temp}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Air Quality: </span>
                      <span className={city.airQuality === 'Excellent' ? 'text-green-600' : 'text-blue-600'}>
                        {city.airQuality}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Events: </span>
                      <span className="text-purple-600">{city.events}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Crowd:</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experiences Grid */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Available Experiences</CardTitle>
              <CardDescription>
                Showing {filteredExperiences.length} of {mockExperiences.length} experiences
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-1 border rounded-lg text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="price">Sort by Price</option>
                <option value="distance">Sort by Distance</option>
                <option value="availability">Sort by Availability</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatePresence>
              {filteredExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 bg-white/80"
                        onClick={() => toggleBookmark(experience.id)}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarkedItems.includes(experience.id) ? 'fill-current text-yellow-500' : ''}`} />
                      </Button>
                      <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white/80">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className={getCrowdColor(experience.crowdLevel)}>
                        {experience.crowdLevel} crowd
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{experience.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {experience.location} • {experience.distance}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">${experience.price}</div>
                        <div className="text-xs text-muted-foreground">{experience.availability}</div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{experience.description}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(experience.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{experience.rating}</span>
                      <span className="text-sm text-muted-foreground">({experience.reviews} reviews)</span>
                    </div>

                    {/* IoT Features */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {experience.iotFeatures.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {experience.iotFeatures.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{experience.iotFeatures.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" disabled={!experience.instantBook}>
                        {experience.instantBook ? 'Book Instantly' : 'Check Availability'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}