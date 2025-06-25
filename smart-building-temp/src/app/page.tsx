'use client';

import { useState, useEffect } from 'react';

// Add debugging to ensure client-side rendering
if (typeof window !== 'undefined') {
  console.log('Client-side rendering active');
  window.addEventListener('load', () => {
    console.log('Page fully loaded, JavaScript active');
  });
}
import { 
  Building2, 
  Home, 
  Car, 
  Bath, 
  DoorOpen, 
  Users,
  Shield,
  BarChart,
  Settings,
  Bell,
  Map,
  Activity
} from 'lucide-react';
import { FloorMap } from '@/components/building/FloorMap';
import { Building3DVisualization } from '@/components/building/Building3DVisualization';
import { AccessControl } from '@/components/access/AccessControl';
import { ParkingManagement } from '@/components/parking/ParkingManagement';
import { BathroomMonitor } from '@/components/bathroom/BathroomMonitor';
import { CheckInKiosk } from '@/components/checkin/CheckInKiosk';
import { Location, AreaType } from '@/types/iot';
import { getIoTService } from '@/services/iot-service';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type View = 'overview' | 'floor' | 'access' | 'parking' | 'bathroom' | 'checkin' | 'analytics';

export default function SmartBuildingDashboard() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [use3DView, setUse3DView] = useState(true);
  const [buildingStats, setBuildingStats] = useState({
    totalOccupancy: 0,
    availableParking: 0,
    activeAlerts: 0,
    energyUsage: 0
  });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  const iotService = getIoTService();

  // Ensure client-side hydration
  useEffect(() => {
    setIsClient(true);
    console.log('React component hydrated');
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Initialize IoT connection
    const token = localStorage.getItem('auth_token') || 'demo_token';
    iotService.connect(token);

    // Subscribe to building-wide events
    iotService.subscribe('building:alert', handleBuildingAlert);
    iotService.subscribe('building:stats', updateBuildingStats);

    loadBuildingStats();

    return () => {
      iotService.disconnect();
    };
  }, [isClient]);

  const loadBuildingStats = async () => {
    try {
      const analytics = await iotService.getBuildingAnalytics();
      setBuildingStats({
        totalOccupancy: analytics.occupancy.current,
        availableParking: analytics.space.utilization,
        activeAlerts: analytics.security.alerts.filter(a => !a.resolved).length,
        energyUsage: analytics.energy.consumption.total
      });
    } catch (error) {
      console.error('Failed to load building stats:', error);
    }
  };

  const handleBuildingAlert = (alert: any) => {
    setNotifications(prev => [alert, ...prev].slice(0, 10));
  };

  const updateBuildingStats = (stats: any) => {
    setBuildingStats(stats);
  };

  const handleLocationSelect = (location: Location) => {
    console.log('Selected location:', location);
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'floor', label: 'Floor Map', icon: Map },
    { id: 'access', label: 'Access Control', icon: Shield },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'bathroom', label: 'Bathrooms', icon: Bath },
    { id: 'checkin', label: 'Check-in', icon: DoorOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">NCQ Smart Building</h1>
                <p className="text-sm text-gray-500">Intelligent Building Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Activity className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                )}
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm">
          <div className="p-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                    ${currentView === item.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Building Stats */}
          <div className="p-4 border-t">
            <h3 className="font-medium mb-3">Building Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Occupancy</span>
                <span className="text-sm font-medium">{buildingStats.totalOccupancy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Parking</span>
                <span className="text-sm font-medium">{buildingStats.availableParking} free</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Alerts</span>
                <span className="text-sm font-medium text-red-600">{buildingStats.activeAlerts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Energy</span>
                <span className="text-sm font-medium">{buildingStats.energyUsage} kW</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {currentView === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Building Overview</h2>
                  <div className="flex gap-2">
                    {/* Simple HTML button test */}
                    <button 
                      onClick={() => alert('Basic HTML button works!')}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Test Button
                    </button>
                    {/* Direct JavaScript button for 3D mode */}
                    <button 
                      onClick={() => {
                        console.log('Direct 3D Mode button clicked!');
                        alert('Direct 3D Mode button was clicked! Switching views...');
                        if (isClient) {
                          setCurrentView('floor');
                          setUse3DView(true);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      🔧 Direct 3D Mode
                    </button>
                    <Button
                      onClick={() => {
                        console.log('React Button Enter 3D Mode clicked!');
                        alert('React Button 3D Mode was clicked! Switching to Floor Map with 3D view...');
                        if (isClient) {
                          setCurrentView('floor');
                          setUse3DView(true);
                        }
                      }}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Building2 className="h-4 w-4" />
                      React 3D Mode
                    </Button>
                  </div>
                </div>
                
                {/* Hydration Status */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Debug Information:</h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <div>Client Hydrated: {isClient ? '✅ YES' : '❌ NO'}</div>
                    <div>Current View: {currentView}</div>
                    <div>3D Mode: {use3DView ? 'ON' : 'OFF'}</div>
                    <div>Selected Floor: {selectedFloor}</div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Occupancy</p>
                        <p className="text-3xl font-bold">{buildingStats.totalOccupancy}</p>
                      </div>
                      <Users className="h-12 w-12 text-blue-500 opacity-20" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Available Parking</p>
                        <p className="text-3xl font-bold">{buildingStats.availableParking}</p>
                      </div>
                      <Car className="h-12 w-12 text-green-500 opacity-20" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Active Alerts</p>
                        <p className="text-3xl font-bold text-red-600">{buildingStats.activeAlerts}</p>
                      </div>
                      <Bell className="h-12 w-12 text-red-500 opacity-20" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Energy Usage</p>
                        <p className="text-3xl font-bold">{buildingStats.energyUsage}</p>
                        <p className="text-xs text-gray-500">kW</p>
                      </div>
                      <Activity className="h-12 w-12 text-yellow-500 opacity-20" />
                    </div>
                  </div>
                </div>

                {/* 3D Visualization Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">3D Building Visualization</h3>
                        <p className="text-sm text-gray-600">Advanced Babylon.js-powered 3D view with enhanced features</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        console.log('Featured card 3D Mode button clicked!');
                        alert('Featured card 3D Mode button was clicked! Switching to Floor Map with 3D view...');
                        setCurrentView('floor');
                        setUse3DView(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Enter 3D Mode
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-blue-600 font-semibold">Advanced Lighting</div>
                      <div className="text-gray-500">Realistic PBR materials</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-600 font-semibold">IoT Integration</div>
                      <div className="text-gray-500">Real-time device data</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-600 font-semibold">Cinematic Tours</div>
                      <div className="text-gray-500">Auto camera presets</div>
                    </div>
                  </div>
                </div>

                {/* Recent Notifications */}
                {notifications.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-medium mb-4">Recent Notifications</h3>
                    <div className="space-y-2">
                      {notifications.slice(0, 5).map((notif, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            <Bell className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{notif.title}</p>
                              <p className="text-xs text-gray-500">{notif.message}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentView === 'floor' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Floor Map</h2>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((floor) => (
                      <Button
                        key={floor}
                        variant={selectedFloor === floor ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedFloor(floor)}
                      >
                        Floor {floor}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600">
                      Current View: {currentView} | 3D Mode: {use3DView ? 'ON' : 'OFF'} | Floor: {selectedFloor}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('3D/2D toggle clicked! Current use3DView:', use3DView);
                        setUse3DView(!use3DView);
                      }}
                    >
                      {use3DView ? 'Switch to 2D' : 'Switch to 3D'}
                    </Button>
                  </div>
                  
                  {use3DView ? (
                    <div>
                      <div className="mb-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-blue-800">
                          <strong>3D Mode Active:</strong> Loading Building3DVisualization component...
                        </p>
                      </div>
                      <Building3DVisualization
                        floor={selectedFloor}
                        building="Main Building"
                        onLocationSelect={handleLocationSelect}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-800">
                          <strong>2D Mode Active:</strong> Loading FloorMap component...
                        </p>
                      </div>
                      <FloorMap
                        floor={selectedFloor}
                        building="Main Building"
                        onLocationSelect={handleLocationSelect}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentView === 'access' && (
              <AccessControl 
                location={{
                  building: 'Main Building',
                  floor: selectedFloor,
                  area: AreaType.LOBBY,
                  zone: 'main'
                }}
              />
            )}

            {currentView === 'parking' && (
              <ParkingManagement buildingId="main" />
            )}

            {currentView === 'bathroom' && (
              <BathroomMonitor floor={selectedFloor} />
            )}

            {currentView === 'checkin' && (
              <div className="max-w-4xl mx-auto">
                <CheckInKiosk
                  location={{
                    building: 'Main Building',
                    floor: 1,
                    area: AreaType.LOBBY,
                    zone: 'reception'
                  }}
                  kioskMode="both"
                />
              </div>
            )}

            {currentView === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Building Analytics</h2>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-500">Analytics dashboard coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}