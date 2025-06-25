'use client';

import { motion } from 'framer-motion';
import { 
  Hotel,
  MapPin,
  Calendar,
  Users,
  Thermometer,
  Lightbulb,
  Tv,
  Utensils,
  ConciergeBell,
  Shirt,
  Car,
  Star,
  Clock
} from 'lucide-react';
import { mockGuest, mockBooking, mockRoom } from '@/lib/mockData';

export function DashboardView() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-500 to-green-600 p-8 text-white shadow-2xl"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Good Morning, John! 🌅</h1>
              <p className="text-green-100 text-lg">Welcome back to your stay at Smart Hotel</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-green-200" />
                  <div>
                    <p className="text-green-200 text-sm">Room</p>
                    <p className="text-xl font-semibold">301</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-green-200" />
                  <div>
                    <p className="text-green-200 text-sm">Check-out</p>
                    <p className="text-xl font-semibold">Jan 18, 2025</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-green-200" />
                  <div>
                    <p className="text-green-200 text-sm">Guests</p>
                    <p className="text-xl font-semibold">2</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-bold">JD</span>
              </div>
            </div>
          </div>
          
          {/* Loyalty Status */}
          <div className="mt-6 inline-flex items-center space-x-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2">
            <Star className="h-5 w-5 text-yellow-300" />
            <span className="font-medium">Gold Member</span>
            <span className="text-green-200">•</span>
            <span className="text-green-200">2,500 points</span>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white transform translate-x-16 -translate-y-16"></div>
          <div className="absolute right-20 bottom-0 h-20 w-20 rounded-full bg-white transform translate-y-10"></div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Room 301 - Deluxe Suite</h2>
                <p className="text-gray-500">Floor 3 • Ocean View • 45 sqm</p>
              </div>
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 rounded-full px-3 py-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Occupied</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Controls</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex flex-col items-center space-y-2 p-4 rounded-xl border-2 border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <Thermometer className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">AC</span>
                <span className="text-xs text-gray-500">22°C</span>
              </button>
              
              <button className="flex flex-col items-center space-y-2 p-4 rounded-xl border-2 border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all">
                <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Lights</span>
                <span className="text-xs text-gray-500">75%</span>
              </button>
              
              <button className="flex flex-col items-center space-y-2 p-4 rounded-xl border-2 border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                  <Tv className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">TV</span>
                <span className="text-xs text-gray-500">Channel 5</span>
              </button>
              
              <button className="flex flex-col items-center space-y-2 p-4 rounded-xl border-2 border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all">
                <div className="h-12 w-12 rounded-full bg-gray-500 flex items-center justify-center">
                  <Hotel className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Do Not Disturb</span>
                <span className="text-xs text-gray-500">Off</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Weather & Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Weather Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-semibold mb-4">Today's Weather</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">25°C</div>
                <div className="text-blue-100">Sunny</div>
              </div>
              <div className="text-6xl">☀️</div>
            </div>
            <div className="mt-4 flex justify-between text-blue-100 text-sm">
              <span>Humidity: 65%</span>
              <span>Wind: 12 km/h</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Stay</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Nights remaining</span>
                <span className="font-semibold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Services used</span>
                <span className="font-semibold text-gray-900">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Loyalty points earned</span>
                <span className="font-semibold text-green-600">+150</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Services</h2>
          <button className="text-green-600 hover:text-green-700 font-medium">View All</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { icon: Utensils, label: 'Room Service', color: 'bg-green-500' },
            { icon: ConciergeBell, label: 'Housekeeping', color: 'bg-blue-500' },
            { icon: Shirt, label: 'Laundry', color: 'bg-purple-500' },
            { icon: Car, label: 'Transport', color: 'bg-gray-500' },
            { icon: Star, label: 'Spa', color: 'bg-pink-500' },
            { icon: ConciergeBell, label: 'Concierge', color: 'bg-indigo-500' },
            { icon: Utensils, label: 'Restaurant', color: 'bg-orange-500' },
            { icon: Clock, label: 'Wake Up Call', color: 'bg-red-500' },
          ].map((service, index) => (
            <button
              key={service.label}
              className="flex flex-col items-center space-y-3 p-4 rounded-xl border-2 border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all"
            >
              <div className={`h-12 w-12 rounded-full ${service.color} flex items-center justify-center`}>
                <service.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{service.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Recent Requests */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Requests</h3>
          <div className="space-y-4">
            {[
              { service: 'Room Service', status: 'Delivered', time: '30 min ago', color: 'green' },
              { service: 'Housekeeping', status: 'In Progress', time: '1 hour ago', color: 'blue' },
              { service: 'Laundry', status: 'Completed', time: '2 hours ago', color: 'green' },
            ].map((request, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{request.service}</div>
                  <div className="text-sm text-gray-500">{request.time}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  request.color === 'green' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              { title: 'Welcome to Smart Hotel!', time: '2 hours ago', type: 'info' },
              { title: 'Room service menu updated', time: '4 hours ago', type: 'update' },
              { title: 'Spa appointment reminder', time: '1 day ago', type: 'reminder' },
            ].map((notification, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  notification.type === 'info' ? 'bg-blue-500' :
                  notification.type === 'update' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{notification.title}</div>
                  <div className="text-sm text-gray-500">{notification.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}