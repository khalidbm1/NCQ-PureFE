/**
 * Smart Parking Management Component
 * Handles parking space monitoring and reservations
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign,
  Search,
  Filter,
  ChevronDown,
  Zap,
  User,
  Truck,
  Calendar,
  Navigation
} from 'lucide-react';
import { 
  ParkingSpace, 
  ParkingType, 
  ParkingStatus,
  ParkingReservation,
  Location
} from '@/types/iot';
import { getIoTService } from '@/services/iot-service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

interface ParkingManagementProps {
  buildingId?: string;
  userId?: string;
}

export function ParkingManagement({ buildingId, userId }: ParkingManagementProps) {
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [reservations, setReservations] = useState<ParkingReservation[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    level?: string;
    type?: ParkingType;
    status?: ParkingStatus;
  }>({});
  const [showReservationForm, setShowReservationForm] = useState(false);

  const iotService = getIoTService();

  useEffect(() => {
    loadParkingData();
    
    // Subscribe to real-time updates
    iotService.subscribe('parking:update', handleParkingUpdate);
    
    const interval = setInterval(loadParkingData, 60000); // Refresh every minute
    
    return () => {
      clearInterval(interval);
      iotService.unsubscribe('parking:update');
    };
  }, [filter]);

  const loadParkingData = async () => {
    try {
      const spaces = await iotService.getParkingSpaces(filter.level);
      
      // Apply client-side filters
      let filtered = spaces;
      if (filter.type) {
        filtered = filtered.filter(s => s.type === filter.type);
      }
      if (filter.status) {
        filtered = filtered.filter(s => s.status === filter.status);
      }
      
      setParkingSpaces(filtered);
      
      // Load user reservations
      if (userId) {
        const userReservations = filtered
          .flatMap(s => s.reservations || [])
          .filter(r => r.userId === userId);
        setReservations(userReservations);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load parking data:', error);
      setLoading(false);
    }
  };

  const handleParkingUpdate = (data: any) => {
    loadParkingData();
  };

  const handleReserveSpace = async (space: ParkingSpace) => {
    if (!userId) return;
    
    try {
      const reservation = {
        userId,
        vehicleInfo: {
          licensePlate: 'ABC-1234', // Would come from user input
          make: 'Toyota',
          model: 'Camry',
          color: 'Silver',
          type: 'sedan'
        },
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
      };
      
      await iotService.reserveParking(space.id, reservation);
      await loadParkingData();
      setShowReservationForm(false);
    } catch (error) {
      console.error('Failed to reserve parking:', error);
    }
  };

  const handleFindNearestParking = async () => {
    try {
      const currentLocation: Location = {
        building: buildingId || 'main',
        floor: 0,
        area: 'entrance' as any,
        zone: 'main'
      };
      
      const nearest = await iotService.findAvailableParking({
        nearestTo: currentLocation
      });
      
      if (nearest.length > 0) {
        setSelectedSpace(nearest[0]);
      }
    } catch (error) {
      console.error('Failed to find nearest parking:', error);
    }
  };

  const getParkingTypeIcon = (type: ParkingType) => {
    switch (type) {
      case ParkingType.EV_CHARGING:
        return <Zap className="h-4 w-4" />;
      case ParkingType.HANDICAP:
        return <User className="h-4 w-4" />;
      case ParkingType.LOADING:
        return <Truck className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  const getParkingStatusColor = (status: ParkingStatus) => {
    switch (status) {
      case ParkingStatus.AVAILABLE:
        return 'bg-green-100 text-green-800 border-green-200';
      case ParkingStatus.OCCUPIED:
        return 'bg-red-100 text-red-800 border-red-200';
      case ParkingStatus.RESERVED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ParkingStatus.MAINTENANCE:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate statistics
  const stats = {
    total: parkingSpaces.length,
    available: parkingSpaces.filter(s => s.status === ParkingStatus.AVAILABLE).length,
    occupied: parkingSpaces.filter(s => s.status === ParkingStatus.OCCUPIED).length,
    reserved: parkingSpaces.filter(s => s.status === ParkingStatus.RESERVED).length
  };

  const occupancyRate = stats.total > 0 ? ((stats.occupied + stats.reserved) / stats.total * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Car className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Parking Management</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFindNearestParking}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Find Nearest
          </Button>
          <Button
            size="sm"
            onClick={() => setShowReservationForm(true)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Reserve Space
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spaces</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Car className="h-8 w-8 text-gray-400 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Occupied</p>
              <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Occupancy Rate</p>
              <p className="text-2xl font-bold">{occupancyRate}%</p>
            </div>
            <div className="h-8 w-8">
              <svg className="transform -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - parseFloat(occupancyRate as string) / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={filter.level || ''}
            onChange={(e) => setFilter({ ...filter, level: e.target.value || undefined })}
          >
            <option value="">All Levels</option>
            <option value="B1">Basement 1</option>
            <option value="B2">Basement 2</option>
            <option value="G">Ground</option>
          </select>
          
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={filter.type || ''}
            onChange={(e) => setFilter({ ...filter, type: e.target.value as ParkingType || undefined })}
          >
            <option value="">All Types</option>
            <option value={ParkingType.STANDARD}>Standard</option>
            <option value={ParkingType.COMPACT}>Compact</option>
            <option value={ParkingType.HANDICAP}>Handicap</option>
            <option value={ParkingType.EV_CHARGING}>EV Charging</option>
          </select>
          
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={filter.status || ''}
            onChange={(e) => setFilter({ ...filter, status: e.target.value as ParkingStatus || undefined })}
          >
            <option value="">All Status</option>
            <option value={ParkingStatus.AVAILABLE}>Available</option>
            <option value={ParkingStatus.OCCUPIED}>Occupied</option>
            <option value={ParkingStatus.RESERVED}>Reserved</option>
          </select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter({})}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Parking Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {parkingSpaces.map((space) => (
          <motion.div
            key={space.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all
              ${getParkingStatusColor(space.status)}
              ${selectedSpace?.id === space.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
            `}
            onClick={() => setSelectedSpace(space)}
          >
            <div className="flex flex-col items-center space-y-2">
              {getParkingTypeIcon(space.type)}
              <span className="font-medium">{space.number}</span>
              <span className="text-xs">{space.level}</span>
            </div>
            
            {space.status === ParkingStatus.RESERVED && (
              <div className="absolute top-1 right-1">
                <Clock className="h-3 w-3" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Selected Space Details */}
      <AnimatePresence>
        {selectedSpace && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Parking Space {selectedSpace.number}
              </h3>
              <Badge variant={
                selectedSpace.status === ParkingStatus.AVAILABLE ? 'secondary' : 'default'
              }>
                {selectedSpace.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Level</p>
                <p className="font-medium">{selectedSpace.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium flex items-center space-x-1">
                  {getParkingTypeIcon(selectedSpace.type)}
                  <span>{selectedSpace.type}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dimensions</p>
                <p className="font-medium">
                  {selectedSpace.dimensions.width}m × {selectedSpace.dimensions.length}m
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sensor Status</p>
                <p className="font-medium">
                  {selectedSpace.sensor ? 'Active' : 'No Sensor'}
                </p>
              </div>
            </div>
            
            {selectedSpace.status === ParkingStatus.AVAILABLE && userId && (
              <Button
                className="w-full"
                onClick={() => handleReserveSpace(selectedSpace)}
              >
                Reserve This Space
              </Button>
            )}
            
            {selectedSpace.reservations && selectedSpace.reservations.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Current Reservation</h4>
                {selectedSpace.reservations[0] && (
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-gray-500">Vehicle:</span>{' '}
                      {selectedSpace.reservations[0].vehicleInfo.licensePlate}
                    </p>
                    <p>
                      <span className="text-gray-500">Until:</span>{' '}
                      {format(selectedSpace.reservations[0].endTime, 'HH:mm')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Reservations */}
      {reservations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Your Reservations</h3>
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Space {reservation.spaceId}</p>
                    <p className="text-sm text-gray-500">
                      {format(reservation.startTime, 'MMM dd, HH:mm')} - 
                      {format(reservation.endTime, 'HH:mm')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant={
                    reservation.status === 'active' ? 'secondary' : 'default'
                  }>
                    {reservation.status}
                  </Badge>
                  <span className="font-medium">
                    ${reservation.cost.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}