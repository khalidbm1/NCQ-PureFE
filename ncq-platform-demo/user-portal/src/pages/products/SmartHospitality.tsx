import { useState } from 'react'
import { 
  Hotel, Utensils, Calendar, Users, DollarSign, Star,
  Wifi, Key, Bell, Coffee, Car, Briefcase, MapPin,
  Phone, Clock, TrendingUp, Award, Shield
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import { toast } from 'sonner'

// Mock data
const hotelStats = {
  totalRooms: 250,
  occupiedRooms: 198,
  occupancyRate: 79.2,
  checkInsToday: 42,
  checkOutsToday: 38,
  revenue: {
    today: 125340,
    month: 3456780,
    trend: 12.5
  },
  guestSatisfaction: 4.8,
  staffOnDuty: 67
}

const currentBookings = [
  { id: 1, guest: 'Ahmed Al-Rashidi', room: '501', type: 'Executive Suite', checkIn: '2024-01-20', checkOut: '2024-01-25', status: 'checked-in', total: 2500 },
  { id: 2, guest: 'Sarah Johnson', room: '302', type: 'Deluxe Room', checkIn: '2024-01-21', checkOut: '2024-01-23', status: 'confirmed', total: 800 },
  { id: 3, guest: 'Mohammed Hassan', room: '205', type: 'Standard Room', checkIn: '2024-01-20', checkOut: '2024-01-22', status: 'checked-in', total: 400 },
  { id: 4, guest: 'Fatima Ali', room: '701', type: 'Presidential Suite', checkIn: '2024-01-22', checkOut: '2024-01-28', status: 'pending', total: 6000 },
  { id: 5, guest: 'David Smith', room: '403', type: 'Business Room', checkIn: '2024-01-21', checkOut: '2024-01-24', status: 'checked-in', total: 1200 }
]

const restaurantOrders = [
  { id: 1, table: 12, items: 4, total: 245, status: 'preparing', time: '10 min' },
  { id: 2, table: 5, items: 2, total: 120, status: 'served', time: '25 min' },
  { id: 3, table: 8, items: 6, total: 380, status: 'ready', time: '5 min' },
  { id: 4, table: 15, items: 3, total: 185, status: 'ordered', time: '2 min' },
  { id: 5, table: 'Room 302', items: 2, total: 95, status: 'delivering', time: '15 min' }
]

const amenities = [
  { name: 'WiFi Coverage', status: 'operational', usage: 95, icon: Wifi },
  { name: 'Swimming Pool', status: 'operational', usage: 67, icon: Users },
  { name: 'Gym & Spa', status: 'maintenance', usage: 0, icon: Award },
  { name: 'Parking', status: 'operational', usage: 82, icon: Car },
  { name: 'Conference Rooms', status: 'operational', usage: 45, icon: Briefcase },
  { name: 'Restaurant', status: 'operational', usage: 78, icon: Utensils }
]

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: any
  trend?: number
}

const StatCard = ({ title, value, description, icon: Icon, trend }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {trend && (
        <div className="flex items-center mt-1">
          <TrendingUp className={`h-3 w-3 mr-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        </div>
      )}
    </CardContent>
  </Card>
)

export default function SmartHospitality() {
  const [selectedView, setSelectedView] = useState('overview')

  const handleCheckIn = () => {
    toast.success('Check-in process initiated')
  }

  const handleNewReservation = () => {
    toast.success('Reservation form opened')
  }

  const handleRoomService = () => {
    toast.info('Room service request sent')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Smart Hospitality</h1>
          <p className="text-muted-foreground">
            Complete hotel and restaurant management system
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewReservation}>
            <Calendar className="w-4 h-4 mr-2" />
            New Reservation
          </Button>
          <Button variant="outline" onClick={handleCheckIn}>
            <Key className="w-4 h-4 mr-2" />
            Check-In
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Occupancy Rate"
          value={`${hotelStats.occupancyRate}%`}
          description={`${hotelStats.occupiedRooms}/${hotelStats.totalRooms} rooms`}
          icon={Hotel}
          trend={5.2}
        />
        <StatCard
          title="Today's Revenue"
          value={`SAR ${(hotelStats.revenue.today / 1000).toFixed(1)}K`}
          description="All departments"
          icon={DollarSign}
          trend={hotelStats.revenue.trend}
        />
        <StatCard
          title="Guest Satisfaction"
          value={
            <div className="flex items-center">
              {hotelStats.guestSatisfaction}
              <Star className="w-4 h-4 ml-1 fill-yellow-400 text-yellow-400" />
            </div>
          }
          description="Based on 1,234 reviews"
          icon={Award}
        />
        <StatCard
          title="Check-ins Today"
          value={hotelStats.checkInsToday}
          description={`${hotelStats.checkOutsToday} check-outs`}
          icon={Users}
        />
      </div>

      {/* Main Content */}
      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Current Bookings</CardTitle>
                <CardDescription>
                  Active and upcoming reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{booking.guest}</p>
                        <p className="text-sm text-muted-foreground">
                          Room {booking.room} • {booking.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          booking.status === 'checked-in' ? 'default' :
                          booking.status === 'confirmed' ? 'secondary' : 'outline'
                        }>
                          {booking.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">SAR {booking.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Room Service
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Coffee className="w-4 h-4 mr-2" />
                    Restaurant
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Concierge
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Guest Requests
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Housekeeping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue breakdown by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Room Revenue</span>
                    <span className="font-medium">SAR 2.4M</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Restaurant & Bar</span>
                    <span className="font-medium">SAR 680K</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Spa & Amenities</span>
                    <span className="font-medium">SAR 340K</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Revenue</span>
                  <span className="text-lg font-bold">SAR {(hotelStats.revenue.month / 1000000).toFixed(2)}M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Management</CardTitle>
              <CardDescription>
                Real-time room status and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Hotel className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">152</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">78</p>
                  <p className="text-sm text-muted-foreground">Occupied</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Cleaning</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Orders</CardTitle>
              <CardDescription>
                Active orders and room service requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {restaurantOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Table {order.table}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items} items • SAR {order.total}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        order.status === 'served' ? 'default' :
                        order.status === 'ready' ? 'secondary' :
                        order.status === 'preparing' ? 'outline' : 'destructive'
                      }>
                        {order.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amenities" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity) => {
              const Icon = amenity.icon
              return (
                <Card key={amenity.name}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{amenity.name}</span>
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status</span>
                        <Badge variant={amenity.status === 'operational' ? 'default' : 'destructive'}>
                          {amenity.status}
                        </Badge>
                      </div>
                      {amenity.status === 'operational' && (
                        <>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Current Usage</span>
                              <span>{amenity.usage}%</span>
                            </div>
                            <Progress value={amenity.usage} className="h-2" />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Key metrics and insights for your property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Detailed analytics dashboard with charts and insights would be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}