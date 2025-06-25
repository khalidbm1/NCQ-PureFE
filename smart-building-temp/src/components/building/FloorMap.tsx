/**
 * Interactive Floor Map Component
 * Displays real-time building floor status with IoT devices
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  Thermometer, 
  Wifi, 
  AlertTriangle,
  Car,
  DoorOpen,
  Bath,
  Coffee
} from 'lucide-react';
import { IoTDevice, SmartSpace, Location, AreaType, DeviceStatus } from '@/types/iot';
import { getIoTService } from '@/services/iot-service';
import { Badge } from '@/components/ui/Badge';

interface FloorMapProps {
  floor: number;
  building: string;
  onLocationSelect?: (location: Location) => void;
}

export function FloorMap({ floor, building, onLocationSelect }: FloorMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [rooms, setRooms] = useState<SmartSpace[]>([]);
  const [selectedArea, setSelectedArea] = useState<Location | null>(null);
  const [hoverArea, setHoverArea] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  const iotService = getIoTService();

  useEffect(() => {
    loadFloorData();
    const interval = setInterval(loadFloorData, 30000); // Refresh every 30s
    
    // Subscribe to real-time updates
    iotService.subscribe('floor:update', handleFloorUpdate);
    
    return () => {
      clearInterval(interval);
      iotService.unsubscribe('floor:update');
    };
  }, [floor, building]);

  const loadFloorData = async () => {
    try {
      const [devicesData, roomsData] = await Promise.all([
        iotService.getDevices({ 
          location: { building, floor, area: AreaType.ROOM, zone: '' } 
        }),
        iotService.getRooms(floor)
      ]);
      
      setDevices(devicesData);
      setRooms(roomsData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load floor data:', error);
      setLoading(false);
    }
  };

  const handleFloorUpdate = (data: any) => {
    if (data.floor === floor && data.building === building) {
      loadFloorData();
    }
  };

  const getAreaIcon = (areaType: AreaType) => {
    switch (areaType) {
      case AreaType.ROOM:
        return DoorOpen;
      case AreaType.BATHROOM:
        return Bath;
      case AreaType.PARKING:
        return Car;
      case AreaType.CAFETERIA:
        return Coffee;
      default:
        return MapPin;
    }
  };

  const getAreaColor = (area: any) => {
    // Check device status
    const areaDevices = devices.filter(d => 
      d.location.zone === area.zone && 
      d.location.area === area.type
    );
    
    const hasError = areaDevices.some(d => d.status === DeviceStatus.ERROR);
    const hasOffline = areaDevices.some(d => d.status === DeviceStatus.OFFLINE);
    
    if (hasError) return 'bg-red-100 border-red-500';
    if (hasOffline) return 'bg-yellow-100 border-yellow-500';
    
    // Check occupancy for rooms
    if (area.type === AreaType.ROOM) {
      const room = rooms.find(r => r.spaceNumber === area.zone);
      if (room) {
        const occupancyRate = room.occupancy.current / room.occupancy.maximum;
        if (occupancyRate > 0.8) return 'bg-orange-100 border-orange-500';
        if (occupancyRate > 0.5) return 'bg-blue-100 border-blue-500';
        return 'bg-green-100 border-green-500';
      }
    }
    
    return 'bg-gray-100 border-gray-300';
  };

  const renderFloorPlan = () => {
    // This would be replaced with actual floor plan rendering
    // For demo, we'll create a grid layout
    const areas = [
      { type: AreaType.ROOM, zone: '101', x: 0, y: 0, width: 150, height: 100 },
      { type: AreaType.ROOM, zone: '102', x: 160, y: 0, width: 150, height: 100 },
      { type: AreaType.ROOM, zone: '103', x: 320, y: 0, width: 150, height: 100 },
      { type: AreaType.BATHROOM, zone: 'B1', x: 480, y: 0, width: 80, height: 100 },
      { type: AreaType.CORRIDOR, zone: 'C1', x: 0, y: 110, width: 560, height: 40 },
      { type: AreaType.ROOM, zone: '104', x: 0, y: 160, width: 150, height: 100 },
      { type: AreaType.ROOM, zone: '105', x: 160, y: 160, width: 150, height: 100 },
      { type: AreaType.CAFETERIA, zone: 'CAF1', x: 320, y: 160, width: 240, height: 100 },
    ];

    return (
      <svg
        width="600"
        height="300"
        className="w-full h-full"
        viewBox="0 0 600 300"
      >
        {areas.map((area, index) => {
          const Icon = getAreaIcon(area.type);
          const isSelected = selectedArea?.zone === area.zone;
          const isHovered = hoverArea?.zone === area.zone;
          const colorClass = getAreaColor(area);
          
          return (
            <g key={index}>
              <rect
                x={area.x}
                y={area.y}
                width={area.width}
                height={area.height}
                className={`
                  cursor-pointer transition-all duration-200
                  ${colorClass}
                  ${isSelected ? 'stroke-2' : 'stroke-1'}
                  ${isHovered ? 'opacity-80' : 'opacity-100'}
                `}
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={isSelected ? 3 : 1}
                rx={4}
                onMouseEnter={() => setHoverArea({
                  building,
                  floor,
                  area: area.type,
                  zone: area.zone
                })}
                onMouseLeave={() => setHoverArea(null)}
                onClick={() => {
                  const location = {
                    building,
                    floor,
                    area: area.type,
                    zone: area.zone
                  };
                  setSelectedArea(location);
                  onLocationSelect?.(location);
                }}
              />
              
              {/* Area label */}
              <text
                x={area.x + area.width / 2}
                y={area.y + area.height / 2 - 10}
                textAnchor="middle"
                className="text-sm font-medium fill-gray-700 pointer-events-none"
              >
                {area.zone}
              </text>
              
              {/* Area icon */}
              <Icon
                x={area.x + area.width / 2 - 10}
                y={area.y + area.height / 2 + 5}
                width={20}
                height={20}
                className="fill-gray-600 pointer-events-none"
              />
              
              {/* Device indicators */}
              {area.type === AreaType.ROOM && (
                <>
                  {/* Occupancy indicator */}
                  <circle
                    cx={area.x + 10}
                    cy={area.y + 10}
                    r={4}
                    className="fill-green-500"
                  />
                  
                  {/* Temperature indicator */}
                  <circle
                    cx={area.x + area.width - 10}
                    cy={area.y + 10}
                    r={4}
                    className="fill-blue-500"
                  />
                </>
              )}
            </g>
          );
        })}
        
        {/* Device status indicators */}
        {devices.map((device, index) => {
          if (!device.location.coordinates) return null;
          
          return (
            <circle
              key={device.id}
              cx={device.location.coordinates.x}
              cy={device.location.coordinates.y}
              r={3}
              className={`
                ${device.status === DeviceStatus.ONLINE ? 'fill-green-500' : ''}
                ${device.status === DeviceStatus.OFFLINE ? 'fill-red-500' : ''}
                ${device.status === DeviceStatus.ERROR ? 'fill-red-500 animate-pulse' : ''}
              `}
            />
          );
        })}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Floor header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Floor {floor}</h3>
        <div className="flex items-center space-x-4">
          <Badge variant="default">
            <Users className="h-3 w-3 mr-1" />
            {rooms.reduce((sum, room) => sum + room.occupancy.current, 0)} people
          </Badge>
          <Badge variant="default">
            <Wifi className="h-3 w-3 mr-1" />
            {devices.filter(d => d.status === DeviceStatus.ONLINE).length}/{devices.length} devices
          </Badge>
        </div>
      </div>

      {/* Floor map */}
      <div className="relative bg-gray-50 rounded-lg p-4 overflow-hidden">
        {renderFloorPlan()}
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <div className="text-xs font-medium mb-2">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div>
              <span className="text-xs">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-500 rounded"></div>
              <span className="text-xs">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-100 border border-orange-500 rounded"></div>
              <span className="text-xs">High Occupancy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-100 border border-red-500 rounded"></div>
              <span className="text-xs">Error/Offline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected area details */}
      <AnimatePresence>
        {selectedArea && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-lg p-4"
          >
            <h4 className="font-medium mb-2">
              {selectedArea.area} - {selectedArea.zone}
            </h4>
            
            {selectedArea.area === AreaType.ROOM && (
              <>
                {rooms
                  .filter(r => r.spaceNumber === selectedArea.zone)
                  .map(room => (
                    <div key={room.id} className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Occupancy:</span>
                          <span className="ml-2 font-medium">
                            {room.occupancy.current}/{room.occupancy.maximum}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Temperature:</span>
                          <span className="ml-2 font-medium">
                            {room.environment.temperature}°C
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Air Quality:</span>
                          <span className="ml-2 font-medium">
                            {room.environment.airQuality}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <Badge variant={room.status === 'available' ? 'secondary' : 'default'}>
                            {room.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Room devices */}
                      <div className="mt-3">
                        <div className="text-sm font-medium mb-1">Devices</div>
                        <div className="flex flex-wrap gap-2">
                          {devices
                            .filter(d => d.location.zone === selectedArea.zone)
                            .map(device => (
                              <Badge
                                key={device.id}
                                variant={device.status === DeviceStatus.ONLINE ? 'default' : 'destructive'}
                              >
                                {device.name}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}