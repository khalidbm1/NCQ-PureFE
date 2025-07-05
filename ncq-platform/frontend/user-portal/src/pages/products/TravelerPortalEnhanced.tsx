import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

import {
  Plane,
  Hotel,
  Car,
  Map,
  Calendar,
  Globe,
  Navigation,
  Luggage,
  CreditCard,
  Shield,
  Star,
  Heart,
  Camera,
  Coffee,
  Utensils,
  ShoppingBag,
  Ticket,
  Bus,
  Train,
  Ship,
  MapPin,
  Clock,
  Weather,
  Wallet,
  QrCode,
  Download,
  Share2,
  Bell,
  MessageSquare,
  User,
  Settings,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Percent,
  Activity
} from 'lucide-react';

// TypeScript interfaces
interface Trip {
  id: number;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  totalCost: number;
  progress: number;
  image: string;
  type: 'business' | 'leisure' | 'adventure';
}

interface Booking {
  id: number;
  type: 'flight' | 'hotel' | 'car' | 'activity';
  name: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
  confirmation: string;
  provider: string;
}

export default function TravelerPortalEnhanced() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const trips: Trip[] = [
    {
      id: 1,
      name: 'Dubai Business Trip',
      destination: 'Dubai, UAE',
      startDate: '2024-07-15',
      endDate: '2024-07-20',
      status: 'upcoming',
      totalCost: 3250,
      progress: 65,
      image: '🏙️',
      type: 'business'
    },
    {
      id: 2,
      name: 'European Adventure',
      destination: 'Paris, Rome, Barcelona',
      startDate: '2024-08-01',
      endDate: '2024-08-15',
      status: 'upcoming',
      totalCost: 5800,
      progress: 30,
      image: '🗼',
      type: 'leisure'
    },
    {
      id: 3,
      name: 'Maldives Vacation',
      destination: 'Maldives',
      startDate: '2024-06-01',
      endDate: '2024-06-07',
      status: 'completed',
      totalCost: 4200,
      progress: 100,
      image: '🏝️',
      type: 'leisure'
    }
  ];

  const bookings: Booking[] = [
    {
      id: 1,
      type: 'flight',
      name: 'EK 201 - Dubai to New York',
      date: '2024-07-15',
      status: 'confirmed',
      price: 1250,
      confirmation: 'EK2024071523A',
      provider: 'Emirates'
    },
    {
      id: 2,
      type: 'hotel',
      name: 'Burj Al Arab - Deluxe Suite',
      date: '2024-07-15',
      status: 'confirmed',
      price: 1500,
      confirmation: 'BAA20240715X',
      provider: 'Burj Al Arab'
    },
    {
      id: 3,
      type: 'car',
      name: 'Mercedes S-Class',
      date: '2024-07-15',
      status: 'pending',
      price: 500,
      confirmation: 'Pending',
      provider: 'Luxury Cars Dubai'
    }
  ];

  // Travel stats
  const travelStats = {
    totalTrips: 24,
    countriesVisited: 18,
    totalMiles: 125000,
    loyaltyPoints: 85420,
    savedAmount: 3420,
    carbonOffset: 2.5
  };

  // Spending data for chart
  const spendingData = {
    labels: ['Flights', 'Hotels', 'Transport', 'Food', 'Activities', 'Shopping'],
    datasets: [{
      data: [45, 25, 10, 8, 7, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  // Travel trend data
  const travelTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Travel Days',
      data: [5, 3, 7, 4, 8, 6],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  // Loyalty programs
  const loyaltyPrograms = [
    { name: 'Emirates Skywards', points: 45000, tier: 'Gold', expiry: '2025-12-31' },
    { name: 'Marriott Bonvoy', points: 32000, tier: 'Platinum', expiry: '2025-06-30' },
    { name: 'Hertz Gold Plus', points: 8420, tier: 'President\'s Circle', expiry: '2025-03-31' }
  ];

  // Travel documents
  const documents = [
    { name: 'Passport', number: '****4567', expiry: '2028-05-15', status: 'valid' },
    { name: 'US Visa', number: '****8901', expiry: '2026-03-20', status: 'valid' },
    { name: 'Schengen Visa', number: '****2345', expiry: '2024-09-30', status: 'expiring' },
    { name: 'Travel Insurance', number: 'TI-2024-****', expiry: '2024-12-31', status: 'valid' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'hotel': return <Hotel className="h-4 w-4" />;
      case 'car': return <Car className="h-4 w-4" />;
      case 'activity': return <Ticket className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
      case 'valid':
        return 'bg-green-100 text-green-700';
      case 'pending':
      case 'upcoming':
      case 'expiring':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'active':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Traveler Portal</h1>
          <p className="text-muted-foreground">Manage your trips, bookings, and travel preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plane className="h-4 w-4 mr-2" />
            New Trip
          </Button>
        </div>
      </div>

      {/* Travel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trips</p>
                <p className="text-2xl font-bold">{travelStats.totalTrips}</p>
              </div>
              <Luggage className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Countries</p>
                <p className="text-2xl font-bold">{travelStats.countriesVisited}</p>
              </div>
              <Globe className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Miles</p>
                <p className="text-2xl font-bold">{(travelStats.totalMiles / 1000).toFixed(0)}K</p>
              </div>
              <Plane className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-2xl font-bold">{(travelStats.loyaltyPoints / 1000).toFixed(0)}K</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saved</p>
                <p className="text-2xl font-bold">${travelStats.savedAmount}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CO₂ Offset</p>
                <p className="text-2xl font-bold">{travelStats.carbonOffset}t</p>
              </div>
              <Activity className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 max-w-4xl mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trips">My Trips</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Trips */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Upcoming Trips</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trips.filter(t => t.status === 'upcoming').map((trip) => (
                    <motion.div
                      key={trip.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all"
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="text-3xl">{trip.image}</div>
                          <div>
                            <h4 className="font-semibold">{trip.name}</h4>
                            <p className="text-sm text-muted-foreground">{trip.destination}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {trip.startDate} - {trip.endDate}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${trip.totalCost}</p>
                          <Badge className={getStatusColor(trip.status)}>
                            {trip.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Preparation Progress</span>
                          <span>{trip.progress}%</span>
                        </div>
                        <Progress value={trip.progress} className="h-2" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Bookings</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          booking.type === 'flight' ? 'bg-blue-100' :
                          booking.type === 'hotel' ? 'bg-green-100' :
                          booking.type === 'car' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          {getTypeIcon(booking.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{booking.name}</p>
                          <p className="text-xs text-muted-foreground">{booking.provider}</p>
                          <p className="text-xs text-muted-foreground">{booking.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${booking.price}</p>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Travel Spending Analysis</CardTitle>
                <CardDescription>Breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <Doughnut
                  data={spendingData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    }
                  }}
                  height={250}
                />
              </CardContent>
            </Card>

            {/* Travel Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Travel Frequency</CardTitle>
                <CardDescription>Days traveled per month</CardDescription>
              </CardHeader>
              <CardContent>
                <Line
                  data={travelTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    }
                  }}
                  height={250}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trips" className="space-y-6">
          {/* Trip Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search trips..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="leisure">Leisure</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trips Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <motion.div
                  key={trip.id}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedTrip(trip)}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="text-4xl mb-2">{trip.image}</div>
                        <Badge className={getStatusColor(trip.status)}>
                          {trip.status}
                        </Badge>
                      </div>
                      <CardTitle>{trip.name}</CardTitle>
                      <CardDescription>{trip.destination}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Duration</span>
                          <span>{trip.startDate} - {trip.endDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Cost</span>
                          <span className="font-bold">${trip.totalCost}</span>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span>{trip.progress}%</span>
                          </div>
                          <Progress value={trip.progress} className="h-2" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1">View Details</Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <Card key={trip.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{trip.image}</div>
                        <div>
                          <h3 className="font-semibold text-lg">{trip.name}</h3>
                          <p className="text-muted-foreground">{trip.destination}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {trip.startDate} - {trip.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold">${trip.totalCost}</p>
                          <p className="text-xs text-muted-foreground">Total Cost</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{trip.progress}%</p>
                          <p className="text-xs text-muted-foreground">Complete</p>
                        </div>
                        <Badge className={getStatusColor(trip.status)}>
                          {trip.status}
                        </Badge>
                        <Button variant="outline" onClick={() => setSelectedTrip(trip)}>
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Bookings</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <SortAsc className="h-4 w-4 mr-1" />
                    Sort
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Booking
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Details</th>
                      <th className="text-left py-2">Provider</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Confirmation</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">
                          <div className={`inline-flex p-2 rounded-lg ${
                            booking.type === 'flight' ? 'bg-blue-100' :
                            booking.type === 'hotel' ? 'bg-green-100' :
                            booking.type === 'car' ? 'bg-purple-100' :
                            'bg-orange-100'
                          }`}>
                            {getTypeIcon(booking.type)}
                          </div>
                        </td>
                        <td className="py-3">{booking.name}</td>
                        <td className="py-3">{booking.provider}</td>
                        <td className="py-3">{booking.date}</td>
                        <td className="py-3 text-right font-bold">${booking.price}</td>
                        <td className="py-3">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="py-3 font-mono text-sm">{booking.confirmation}</td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loyaltyPrograms.map((program, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{program.name}</CardTitle>
                  <CardDescription>Member since 2019</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{program.points.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Available Points</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Status Tier</span>
                        <Badge variant="default">{program.tier}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Points Expiry</span>
                        <span>{program.expiry}</span>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      View Rewards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Points Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Points Activity</CardTitle>
              <CardDescription>Your loyalty points transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: '2024-06-15', program: 'Emirates Skywards', points: '+2,500', description: 'Flight EK201' },
                  { date: '2024-06-10', program: 'Marriott Bonvoy', points: '+1,200', description: 'Stay at JW Marriott' },
                  { date: '2024-06-05', program: 'Emirates Skywards', points: '-10,000', description: 'Reward Redemption' },
                  { date: '2024-05-28', program: 'Hertz Gold Plus', points: '+500', description: 'Car Rental' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{activity.program}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                    <Badge variant={activity.points.startsWith('+') ? 'default' : 'destructive'}>
                      {activity.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Travel Documents</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{doc.name}</h4>
                        <p className="text-sm text-muted-foreground">Number: {doc.number}</p>
                      </div>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">Expires: {doc.expiry}</p>
                        {doc.status === 'expiring' && (
                          <p className="text-xs text-orange-600 mt-1">
                            <AlertCircle className="h-3 w-3 inline mr-1" />
                            Renew soon
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>Important contacts for travel emergencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Travel Insurance', number: '+1-800-555-0123', available: '24/7' },
                  { name: 'Embassy Hotline', number: '+971-4-555-0456', available: 'Business Hours' },
                  { name: 'Medical Emergency', number: '911 / 999', available: '24/7' }
                ].map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.number}</p>
                    </div>
                    <Badge variant="outline">{contact.available}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Travel Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Travel Preferences</CardTitle>
                <CardDescription>Customize your travel experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Airline</Label>
                  <Select defaultValue="emirates">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emirates">Emirates</SelectItem>
                      <SelectItem value="etihad">Etihad Airways</SelectItem>
                      <SelectItem value="qatar">Qatar Airways</SelectItem>
                      <SelectItem value="any">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Seat Preference</Label>
                  <Select defaultValue="aisle">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="window">Window</SelectItem>
                      <SelectItem value="aisle">Aisle</SelectItem>
                      <SelectItem value="middle">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Hotel Chain</Label>
                  <Select defaultValue="marriott">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marriott">Marriott</SelectItem>
                      <SelectItem value="hilton">Hilton</SelectItem>
                      <SelectItem value="hyatt">Hyatt</SelectItem>
                      <SelectItem value="any">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Room Type</Label>
                  <Select defaultValue="king">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="king">King Bed</SelectItem>
                      <SelectItem value="twin">Twin Beds</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage your travel alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Flight Updates</p>
                    <p className="text-sm text-muted-foreground">Gate changes, delays, cancellations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Price Alerts</p>
                    <p className="text-sm text-muted-foreground">Fare drops for saved routes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Check-in Reminders</p>
                    <p className="text-sm text-muted-foreground">24 hours before departure</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Document Expiry</p>
                    <p className="text-sm text-muted-foreground">Passport and visa alerts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Loyalty Updates</p>
                    <p className="text-sm text-muted-foreground">Points expiry and promotions</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Sharing</CardTitle>
              <CardDescription>Control your data and sharing preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Share trip itineraries</p>
                    <p className="text-sm text-muted-foreground">Allow family to view your travel plans</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Location tracking</p>
                    <p className="text-sm text-muted-foreground">Share location during trips for safety</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Travel statistics</p>
                    <p className="text-sm text-muted-foreground">Include in anonymized analytics</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Trip Detail Modal */}
      <AnimatePresence>
        {selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTrip(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedTrip.name}</h2>
                  <p className="text-muted-foreground">{selectedTrip.destination}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedTrip(null)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Trip Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className={getStatusColor(selectedTrip.status)}>
                        {selectedTrip.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{selectedTrip.startDate} - {selectedTrip.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Cost</span>
                      <span className="font-bold">${selectedTrip.totalCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="capitalize">{selectedTrip.type}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Trip Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { task: 'Book flights', completed: true },
                        { task: 'Reserve accommodation', completed: true },
                        { task: 'Arrange transportation', completed: true },
                        { task: 'Travel insurance', completed: false },
                        { task: 'Pack luggage', completed: false },
                        { task: 'Check-in online', completed: false }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {item.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                          )}
                          <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                            {item.task}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Progress value={selectedTrip.progress} className="mt-4" />
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="flex-1">View Full Itinerary</Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Trip
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}