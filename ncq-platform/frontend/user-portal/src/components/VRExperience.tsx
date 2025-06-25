import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Glasses, Play, Pause, Building2, Activity, Car, Zap } from 'lucide-react';

// VR scene data for smart building visualization
const VR_SCENE_DATA = {
  stores: [
    { id: 'electronics', name: 'Electronics Zone', color: '#3B82F6', occupancy: 78 },
    { id: 'fashion', name: 'Fashion District', color: '#EF4444', occupancy: 92 },
    { id: 'home', name: 'Home & Garden', color: '#10B981', occupancy: 45 },
    { id: 'sports', name: 'Sports & Outdoor', color: '#F59E0B', occupancy: 67 },
    { id: 'restaurant', name: 'Food Court', color: '#8B5CF6', occupancy: 85 },
    { id: 'office', name: 'Business Center', color: '#06B6D4', occupancy: 73 },
    { id: 'retail', name: 'Shopping Mall', color: '#F97316', occupancy: 88 },
    { id: 'hotel', name: 'Grand Hotel', color: '#EC4899', occupancy: 95 },
    { id: 'hospital', name: 'Medical Center', color: '#DC2626', occupancy: 82 },
    { id: 'school', name: 'Smart School', color: '#059669', occupancy: 76 },
    { id: 'bank', name: 'Financial Plaza', color: '#7C3AED', occupancy: 65 },
    { id: 'library', name: 'Digital Library', color: '#0891B2', occupancy: 43 },
    { id: 'gym', name: 'Fitness Center', color: '#EA580C', occupancy: 89 },
    { id: 'cinema', name: 'Movie Theater', color: '#BE185D', occupancy: 71 },
    { id: 'museum', name: 'Tech Museum', color: '#7C2D12', occupancy: 38 },
    { id: 'airport', name: 'Transport Hub', color: '#374151', occupancy: 94 },
    { id: 'factory', name: 'Smart Factory', color: '#4B5563', occupancy: 87 },
    { id: 'warehouse', name: 'Logistics Center', color: '#6B7280', occupancy: 92 },
    { id: 'stadium', name: 'Sports Arena', color: '#16A34A', occupancy: 68 },
    { id: 'marina', name: 'Yacht Club', color: '#0EA5E9', occupancy: 54 }
  ],
  sensors: [
    { type: 'Temperature', value: '22.5°C', status: 'optimal' },
    { type: 'Occupancy', value: '156 people', status: 'normal' },
    { type: 'Air Quality', value: '85 AQI', status: 'good' },
    { type: 'Energy', value: '1247 kW', status: 'normal' },
    { type: 'Security', value: 'All Clear', status: 'optimal' },
    { type: 'Traffic', value: 'Light Flow', status: 'good' },
    { type: 'Noise', value: '45 dB', status: 'optimal' },
    { type: 'Humidity', value: '52%', status: 'normal' },
    { type: 'CO2', value: '420 ppm', status: 'good' },
    { type: 'Water', value: 'Normal Pressure', status: 'optimal' },
    { type: 'Wifi', value: '98% Coverage', status: 'optimal' },
    { type: 'Emergency', value: 'Ready', status: 'optimal' }
  ],
  parking: [
    { level: 'Ground Floor', occupied: 142, total: 150 },
    { level: 'Level 1', occupied: 156, total: 180 },
    { level: 'Level 2', occupied: 134, total: 180 },
    { level: 'Level 3', occupied: 89, total: 170 }
  ]
};

interface VRExperienceProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function VRExperience({ isActive, onToggle }: VRExperienceProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  // Add custom CSS animation for Y-axis rotation
  const rotateY360Style = `
    @keyframes rotateY360 {
      from { transform: translateZ(-150px) rotateX(-45deg) rotateY(0deg) scale(1.5) translateY(30px); }
      to { transform: translateZ(-150px) rotateX(-45deg) rotateY(360deg) scale(1.5) translateY(30px); }
    }
  `;

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <Card className="w-full">
      {/* Add custom CSS animation */}
      <style>{rotateY360Style}</style>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Glasses className="w-5 h-5 text-purple-600" />
          3D Smart Building Visualization
        </CardTitle>
        <CardDescription>
          Interactive 3D visualization of the smart building with retail spaces, parking, and IoT sensors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex gap-2">
            <Button onClick={onToggle} className="flex items-center gap-2">
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  Exit 3D Mode
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Enter 3D Mode
                </>
              )}
            </Button>
            {isActive && (
              <>
                <Button variant="outline" onClick={toggleAnimation} className="flex items-center gap-2">
                  {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isAnimating ? 'Pause Animation' : 'Start Animation'}
                </Button>
              </>
            )}
          </div>

          {/* 3D Visualization */}
          {isActive && (
            <div className="space-y-4">
              <div className="w-full h-[700px] border rounded-lg overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '800px' }}>
                  {/* 3D Scene using CSS 3D transforms */}
                  <div className={`${isAnimating ? 'animate-spin' : ''}`} style={{ 
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(-150px) rotateX(-45deg) rotateY(0deg) scale(1.5) translateY(30px)',
                    animation: isAnimating ? 'rotateY360 20s linear infinite' : 'none',
                    width: '800px',
                    height: '700px',
                    position: 'relative'
                  }}>
                    
                    {/* Expanded map base - transparent city layout */}
                    <div className="absolute w-[800px] h-[600px]" style={{
                      transform: 'rotateX(90deg) translateZ(-10px)',
                      left: '50%',
                      top: '50%',
                      marginLeft: '-400px',
                      marginTop: '-300px',
                      background: 'linear-gradient(45deg, rgba(16,185,129,0.3) 30%, rgba(59,130,246,0.3) 30%, rgba(59,130,246,0.3) 70%, rgba(16,185,129,0.3) 70%)',
                      backgroundSize: '40px 40px',
                      opacity: 0.6
                    }} />
                    
                    {/* Expanded street network */}
                    {/* Main horizontal roads */}
                    <div className="absolute w-[800px] h-6 bg-gray-600" style={{
                      transform: 'rotateX(90deg) translateZ(-8px)',
                      left: '50%',
                      top: '50%',
                      marginLeft: '-400px',
                      marginTop: '-3px'
                    }} />
                    <div className="absolute w-[800px] h-4 bg-gray-700" style={{
                      transform: 'rotateX(90deg) translateZ(-7px)',
                      left: '50%',
                      top: '50%',
                      marginLeft: '-400px',
                      marginTop: '-150px'
                    }} />
                    <div className="absolute w-[800px] h-4 bg-gray-700" style={{
                      transform: 'rotateX(90deg) translateZ(-7px)',
                      left: '50%',
                      top: '50%',
                      marginLeft: '-400px',
                      marginTop: '150px'
                    }} />
                    
                    {/* Main vertical roads */}
                    <div className="absolute w-6 h-[600px] bg-gray-600" style={{
                      transform: 'rotateX(90deg) translateZ(-8px)',
                      left: '50%',
                      top: '50%',
                      marginLeft: '-3px',
                      marginTop: '-300px'
                    }} />
                    <div className="absolute w-4 h-[600px] bg-gray-700" style={{
                      transform: 'rotateX(90deg) translateZ(-7px)',
                      left: '50%',
                      top: '50%',
                      marginLeft: '-200px',
                      marginTop: '-300px'
                    }} />
                    <div className="absolute w-4 h-[600px] bg-gray-700" style={{
                      transform: 'rotateX(90deg) translateZ(-7px)',
                      left: '50%',
                      top: '50%',
                      marginLeft: '200px',
                      marginTop: '-300px'
                    }} />
                    
                    {/* Map objects for stores */}
                    {VR_SCENE_DATA.stores.map((store, index) => {
                      const isGarden = store.name.includes('Garden');
                      const isOutdoor = store.name.includes('Outdoor');
                      const isHotel = store.name.includes('Hotel');
                      const isMall = store.name.includes('Mall');
                      const isHospital = store.name.includes('Medical');
                      const isAirport = store.name.includes('Transport');
                      const isStadium = store.name.includes('Arena');
                      const isFactory = store.name.includes('Factory') || store.name.includes('Logistics');
                      
                      // Create a 5x4 grid layout for more buildings
                      const row = Math.floor(index / 5);
                      const col = index % 5;
                      const xPos = -240 + col * 120;
                      const yPos = -180 + row * 120;
                      
                      if (isGarden) {
                        return (
                          <div key={store.id} className="absolute" style={{
                            left: '50%',
                            top: '50%',
                            marginLeft: `${xPos}px`,
                            marginTop: `${yPos}px`,
                            transform: `rotateX(90deg) translateZ(2px)`,
                            transformStyle: 'preserve-3d'
                          }}>
                            {/* Park/Garden area with trees */}
                            <div className="w-28 h-20 rounded-lg border-4 border-green-400 flex items-center justify-center text-white text-xs font-bold relative" style={{
                              backgroundColor: '#22c55e',
                              backgroundImage: 'radial-gradient(circle at 25% 25%, #16a34a 20%, transparent 20%), radial-gradient(circle at 75% 75%, #16a34a 20%, transparent 20%)',
                              backgroundSize: '15px 15px'
                            }}>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg">🌳🌲🌳</span>
                              </div>
                              <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-xs">
                                {store.occupancy}%
                              </div>
                            </div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs text-center font-semibold">
                              {store.name}
                            </div>
                          </div>
                        );
                      }
                      
                      if (isOutdoor) {
                        return (
                          <div key={store.id} className="absolute" style={{
                            left: '50%',
                            top: '50%',
                            marginLeft: `${xPos}px`,
                            marginTop: `${yPos}px`,
                            transform: `rotateX(90deg) translateZ(2px)`,
                            transformStyle: 'preserve-3d'
                          }}>
                            {/* Sports/Outdoor area */}
                            <div className="w-28 h-20 border-4 border-orange-400 flex items-center justify-center text-white text-xs font-bold relative" style={{
                              backgroundColor: '#f97316',
                              backgroundImage: 'linear-gradient(45deg, #ea580c 25%, transparent 25%), linear-gradient(-45deg, #ea580c 25%, transparent 25%)',
                              backgroundSize: '12px 12px'
                            }}>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg">⚽🏀🎾</span>
                              </div>
                              <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-xs">
                                {store.occupancy}%
                              </div>
                            </div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs text-center font-semibold">
                              {store.name}
                            </div>
                          </div>
                        );
                      }
                      
                      // Different building heights and styles based on type
                      const buildingHeight = isAirport ? 45 : isStadium ? 40 : isHotel ? 35 : isHospital ? 32 : isFactory ? 28 : isMall ? 25 : 20;
                      const buildingIcon = isHospital ? '🏥' : isAirport ? '✈️' : isStadium ? '🏟️' : isFactory ? '🏭' : 
                                          isHotel ? '🏨' : isMall ? '🏬' : store.name.includes('Office') ? '🏢' : 
                                          store.name.includes('Food') ? '🍕' : store.name.includes('School') ? '🏫' :
                                          store.name.includes('Bank') ? '🏦' : store.name.includes('Library') ? '📚' :
                                          store.name.includes('Fitness') ? '💪' : store.name.includes('Cinema') ? '🎬' :
                                          store.name.includes('Museum') ? '🏛️' : store.name.includes('Yacht') ? '⛵' : '🏢';
                      
                      return (
                        <div key={store.id} className="absolute" style={{
                          left: '50%',
                          top: '50%',
                          marginLeft: `${xPos}px`,
                          marginTop: `${yPos}px`,
                          transform: `translateZ(${buildingHeight}px)`,
                          transformStyle: 'preserve-3d'
                        }}>
                          {/* Buildings from aerial view with varying heights */}
                          <div className="w-18 h-18 border-2 border-gray-300 flex items-center justify-center text-white text-xs font-bold relative shadow-lg" style={{
                            backgroundColor: store.color,
                            transform: 'translateZ(0px)',
                            width: '18px',
                            height: '18px'
                          }}>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg">{buildingIcon}</span>
                            </div>
                            <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-xs">
                              {store.occupancy}%
                            </div>
                            {/* Building shadow */}
                            <div className="absolute top-1 left-1 w-18 h-18 bg-black/30 -z-10" style={{
                              transform: 'translateZ(-1px)',
                              width: '18px',
                              height: '18px'
                            }} />
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs text-center font-semibold">
                            {store.name}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* IoT Sensors distributed across the city */}
                    {VR_SCENE_DATA.sensors.map((sensor, index) => {
                      const sensorRow = Math.floor(index / 4);
                      const sensorCol = index % 4;
                      const sensorX = -300 + sensorCol * 200;
                      const sensorY = -200 + sensorRow * 133;
                      
                      return (
                        <div key={sensor.type} className="absolute" style={{
                          left: '50%',
                          top: '50%',
                          marginLeft: `${sensorX}px`,
                          marginTop: `${sensorY}px`,
                          transform: `translateZ(25px)`
                        }}>
                          <div className={`w-8 h-8 rounded-full border-2 border-white bg-green-500 flex items-center justify-center shadow-lg ${isAnimating ? 'animate-pulse' : ''}`} style={{
                            boxShadow: '0 0 15px rgba(34, 197, 94, 0.8)'
                          }}>
                            <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                          </div>
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-green-300 text-xs text-center whitespace-nowrap bg-black/70 px-2 py-1 rounded">
                            {sensor.type}
                          </div>
                          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-green-400 text-xs text-center whitespace-nowrap bg-black/80 px-1 rounded">
                            {sensor.value}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Multiple underground parking areas throughout the city */}
                    {[
                      {x: -200, y: -150, size: 'large'},
                      {x: 150, y: -100, size: 'medium'},
                      {x: -150, y: 100, size: 'small'},
                      {x: 200, y: 120, size: 'medium'}
                    ].map((parking, parkingIndex) => (
                      <div key={parkingIndex} className="absolute" style={{
                        left: '50%',
                        top: '50%',
                        marginLeft: `${parking.x}px`,
                        marginTop: `${parking.y}px`,
                        transform: 'translateZ(-25px)',
                        transformStyle: 'preserve-3d'
                      }}>
                        {/* Underground parking levels */}
                        {VR_SCENE_DATA.parking.map((level, index) => {
                          const width = parking.size === 'large' ? 80 : parking.size === 'medium' ? 60 : 40;
                          const height = parking.size === 'large' ? 60 : parking.size === 'medium' ? 45 : 30;
                          
                          return (
                            <div key={`${parkingIndex}-${level.level}`} className={`absolute bg-gray-900 border border-gray-700 rounded-lg opacity-70`} style={{
                              width: `${width * 4}px`,
                              height: `${height * 4}px`,
                              transform: `translateZ(${-index * 8}px)`,
                              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 6px, #4b5563 6px, #4b5563 7px), repeating-linear-gradient(90deg, transparent, transparent 8px, #4b5563 8px, #4b5563 9px)',
                              backgroundSize: '100% 100%'
                            }}>
                              {/* Parking spots grid */}
                              <div className="absolute inset-1 grid gap-1" style={{
                                gridTemplateColumns: `repeat(${Math.floor(width/8)}, 1fr)`
                              }}>
                                {Array.from({length: Math.floor(width * height / 64)}).map((_, i) => (
                                  <div key={i} className="bg-gray-800 rounded-sm flex items-center justify-center text-xs" style={{
                                    backgroundColor: i < level.occupied * Math.floor(width * height / 64) / level.total ? '#dc2626' : '#374151'
                                  }}>
                                    {i < level.occupied * Math.floor(width * height / 64) / level.total ? '🚗' : ''}
                                  </div>
                                ))}
                              </div>
                              {/* Level indicator */}
                              <div className="absolute top-1 left-1 bg-black/80 text-white text-xs px-1 py-1 rounded">
                                {level.level}: {level.occupied}/{level.total}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Multiple surface parking areas */}
                    {[
                      {x: 280, y: 60, spots: 16},
                      {x: -280, y: 80, spots: 12},
                      {x: 100, y: -200, spots: 20},
                      {x: -180, y: -180, spots: 14}
                    ].map((parking, index) => (
                      <div key={`surface-${index}`} className="absolute" style={{
                        left: '50%',
                        top: '50%',
                        marginLeft: `${parking.x}px`,
                        marginTop: `${parking.y}px`,
                        transform: 'translateZ(5px)',
                        transformStyle: 'preserve-3d'
                      }}>
                        <div className="bg-gray-700 border-2 border-gray-500 relative rounded-lg overflow-hidden" style={{
                          width: `${Math.ceil(Math.sqrt(parking.spots)) * 16}px`,
                          height: `${Math.ceil(parking.spots / Math.ceil(Math.sqrt(parking.spots))) * 12}px`,
                          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, #6b7280 3px, #6b7280 4px), repeating-linear-gradient(90deg, transparent, transparent 4px, #6b7280 4px, #6b7280 5px)',
                          backgroundSize: '100% 100%'
                        }}>
                          {/* Surface parking grid */}
                          <div className="absolute inset-1 grid gap-1" style={{
                            gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(parking.spots))}, 1fr)`
                          }}>
                            {Array.from({length: parking.spots}).map((_, i) => (
                              <div key={i} className="bg-gray-600 rounded-sm flex items-center justify-center text-xs" style={{
                                backgroundColor: i < parking.spots * 0.7 ? '#dc2626' : '#16a34a'
                              }}>
                                {i < parking.spots * 0.7 ? '🚗' : ''}
                              </div>
                            ))}
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                            {Math.floor(parking.spots * 0.7)}/{parking.spots}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Overlay controls */}
                <div className="absolute top-4 left-4 bg-black/50 text-white p-3 rounded-lg">
                  <div className="text-sm font-medium mb-2">3D Building View</div>
                  <div className="text-xs space-y-1">
                    <div>• Retail zones with occupancy data</div>
                    <div>• IoT sensors (green spheres)</div>
                    <div>• Multi-level parking structure</div>
                    <div>• Real-time data visualization</div>
                  </div>
                </div>
              </div>
              
              {/* Data panels */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Retail Zones
                  </div>
                  <div className="text-blue-600 text-xs mt-1">4 zones monitored</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    IoT Sensors
                  </div>
                  <div className="text-green-600 text-xs mt-1">Real-time data</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-800 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Parking
                  </div>
                  <div className="text-purple-600 text-xs mt-1">4 levels tracked</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-medium text-orange-800 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Energy
                  </div>
                  <div className="text-orange-600 text-xs mt-1">1247 kW usage</div>
                </div>
              </div>
              
              {/* Live data display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Store Occupancy</h4>
                  {VR_SCENE_DATA.stores.map((store) => (
                    <div key={store.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: store.color }} />
                        <span className="text-sm">{store.name}</span>
                      </div>
                      <span className="text-sm font-medium">{store.occupancy}%</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Sensor Status</h4>
                  {VR_SCENE_DATA.sensors.map((sensor) => (
                    <div key={sensor.type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{sensor.type}</span>
                      <span className="text-sm font-medium">{sensor.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Welcome screen */}
          {!isActive && (
            <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
              <Glasses className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-semibold mb-2">3D Smart Building Experience</h3>
              <p className="text-gray-600 mb-4">
                Explore retail spaces, parking systems, and IoT sensors in an interactive 3D environment
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs max-w-2xl mx-auto">
                {VR_SCENE_DATA.stores.map((store) => (
                  <div key={store.id} className="text-center">
                    <div className="w-8 h-8 rounded mx-auto mb-1" style={{ backgroundColor: store.color }} />
                    <div>{store.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
    </Card>
  );
}