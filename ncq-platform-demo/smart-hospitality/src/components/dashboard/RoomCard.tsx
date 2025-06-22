'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { apiClient } from '@/lib/api';
import { Room, Booking, Device } from '@/types';
import { 
  Thermometer, 
  Lightbulb, 
  Tv, 
  Lock, 
  Unlock,
  ChevronRight,
  Settings,
  Wifi,
  WifiOff 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

interface RoomCardProps {
  room?: Room;
  booking: Booking;
}

export function RoomCard({ room, booking }: RoomCardProps) {
  const { t } = useLanguage();
  const [controlsExpanded, setControlsExpanded] = useState(false);

  // Fetch room devices
  const { data: devicesData } = useQuery({
    queryKey: ['room-devices', room?.id],
    queryFn: () => room ? apiClient.getRoomDevices(room.id) : null,
    enabled: !!room?.id,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  const devices = devicesData?.data || [];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'thermostat':
        return Thermometer;
      case 'light':
        return Lightbulb;
      case 'tv':
        return Tv;
      default:
        return Settings;
    }
  };

  const getDeviceStatus = (device: Device) => {
    if (device.status === 'offline') return 'Offline';
    if (device.status === 'error') return 'Error';
    
    switch (device.type) {
      case 'thermostat':
        return `${device.value}°C`;
      case 'light':
        return device.value ? `${device.value}%` : 'Off';
      case 'tv':
        return device.value ? 'On' : 'Off';
      default:
        return device.value ? 'On' : 'Off';
    }
  };

  const handleDeviceControl = async (deviceId: string, action: string, value?: any) => {
    if (!room) return;
    
    try {
      await apiClient.controlDevice({
        deviceId,
        action,
        value,
        roomId: room.id,
      });
    } catch (error) {
      console.error('Device control failed:', error);
    }
  };

  if (!room) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        {/* Room Header */}
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {t('dashboard.room_number', { number: room.number })}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                {room.type.charAt(0).toUpperCase() + room.type.slice(1)} • Floor {room.floor}
              </CardDescription>
            </div>
          
          <div className="flex items-center space-x-2">
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              room.status === 'occupied' 
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {room.status === 'occupied' ? (
                <>
                  <Unlock className="h-4 w-4 mr-1" />
                  Occupied
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-1" />
                  Available
                </>
              )}
            </div>
          </div>
        </div>

        {/* Room Amenities */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 4).map((amenity, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>
        </CardHeader>

        {/* Quick Controls */}
        <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Controls</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setControlsExpanded(!controlsExpanded)}
            rightIcon={
              <ChevronRight 
                className={`h-4 w-4 transition-transform ${
                  controlsExpanded ? 'rotate-90' : ''
                }`} 
              />
            }
          >
            {controlsExpanded ? 'Less' : 'More'}
          </Button>
        </div>

        {/* Device Grid */}
        <div className={`grid grid-cols-2 gap-4 ${controlsExpanded ? 'md:grid-cols-4' : ''}`}>
          {devices.slice(0, controlsExpanded ? devices.length : 4).map((device) => {
            const Icon = getDeviceIcon(device.type);
            const isOnline = device.status === 'online';
            
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isOnline
                    ? 'border-gray-200 hover:border-primary bg-white hover:bg-primary/5 dark:bg-gray-800 dark:hover:bg-primary/10'
                    : 'border-gray-100 bg-gray-50 dark:bg-gray-800/50'
                }`}
                onClick={() => {
                  if (isOnline && device.controllable) {
                    // Toggle device state for simple on/off devices
                    const newValue = device.type === 'light' || device.type === 'tv'
                      ? !device.value
                      : device.value;
                    handleDeviceControl(device.id, 'toggle', newValue);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${
                    isOnline ? 'text-primary' : 'text-gray-400'
                  }`} />
                  <div className="flex items-center">
                    {isOnline ? (
                      <Wifi className="h-3 w-3 text-green-500" />
                    ) : (
                      <WifiOff className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {device.name}
                  </p>
                  <p className={`text-xs ${
                    isOnline ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {getDeviceStatus(device)}
                  </p>
                </div>

                {/* Simple controls for compatible devices */}
                {isOnline && device.controllable && device.type === 'thermostat' && (
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeviceControl(device.id, 'decrease', (device.value || 20) - 1);
                      }}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold hover:bg-gray-300 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium">{device.value || 20}°</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeviceControl(device.id, 'increase', (device.value || 20) + 1);
                      }}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold hover:bg-gray-300 transition-colors"
                    >
                      +
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {devices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No devices available</p>
          </div>
        )}

        {/* Advanced Controls Link */}
        <div className="mt-6 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Advanced Room Controls
          </Button>
        </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}