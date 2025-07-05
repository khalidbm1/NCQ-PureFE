import { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { GridMaterial } from '@babylonjs/materials';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { 
  Glasses, 
  Play, 
  Pause, 
  Building2, 
  Activity, 
  Car, 
  Zap, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Move,
  Thermometer,
  Droplets,
  Wind,
  Lightbulb,
  Shield,
  Wifi,
  Users,
  AlertCircle,
  Settings,
  ChevronUp,
  ChevronDown,
  Home,
  Store,
  Coffee,
  Briefcase,
  GraduationCap,
  Heart,
  Dumbbell,
  ShoppingBag,
  Utensils,
  Sparkles,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  Volume2,
  Camera,
  Lock,
  Unlock,
  ParkingCircle,
  BatteryCharging,
  Gauge,
  Info,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced building data with detailed floor information
const ENHANCED_BUILDING_DATA = {
  buildings: [
    {
      id: 'smart-tower',
      name: 'Smart Tower A',
      type: 'mixed-use',
      floors: [
        {
          level: 0,
          name: 'Ground Floor',
          type: 'retail',
          spaces: [
            { id: 'lobby', name: 'Main Lobby', occupancy: 45, capacity: 100, temp: 22, status: 'optimal' },
            { id: 'shop1', name: 'Electronics Store', occupancy: 28, capacity: 50, temp: 21, status: 'optimal' },
            { id: 'shop2', name: 'Fashion Boutique', occupancy: 15, capacity: 30, temp: 23, status: 'optimal' },
            { id: 'cafe', name: 'Smart Café', occupancy: 34, capacity: 40, temp: 22, status: 'busy' }
          ]
        },
        {
          level: 1,
          name: 'Mezzanine',
          type: 'amenities',
          spaces: [
            { id: 'gym', name: 'Fitness Center', occupancy: 42, capacity: 60, temp: 20, status: 'optimal' },
            { id: 'lounge', name: 'Business Lounge', occupancy: 18, capacity: 30, temp: 22, status: 'optimal' },
            { id: 'meeting1', name: 'Meeting Room A', occupancy: 8, capacity: 12, temp: 21, status: 'occupied' },
            { id: 'meeting2', name: 'Meeting Room B', occupancy: 0, capacity: 12, temp: 22, status: 'available' }
          ]
        },
        {
          level: 2,
          name: 'Office Floor 1',
          type: 'office',
          spaces: [
            { id: 'open1', name: 'Open Office North', occupancy: 78, capacity: 100, temp: 22, status: 'optimal' },
            { id: 'open2', name: 'Open Office South', occupancy: 65, capacity: 80, temp: 22, status: 'optimal' },
            { id: 'exec1', name: 'Executive Suite', occupancy: 5, capacity: 10, temp: 21, status: 'optimal' },
            { id: 'server', name: 'Server Room', occupancy: 0, capacity: 2, temp: 18, status: 'monitoring' }
          ]
        }
      ],
      totalFloors: 12,
      x: 0,
      z: 0,
      width: 20,
      depth: 20,
      color: '#3B82F6',
      occupancy: 732,
      capacity: 1000,
      energyUsage: 342,
      status: 'optimal'
    }
  ],
  iotDevices: [
    { id: 'hvac1', type: 'hvac', name: 'HVAC Zone 1', status: 'active', value: 22, unit: '°C', floor: 0 },
    { id: 'hvac2', type: 'hvac', name: 'HVAC Zone 2', status: 'active', value: 21, unit: '°C', floor: 1 },
    { id: 'light1', type: 'lighting', name: 'Lobby Lighting', status: 'active', value: 80, unit: '%', floor: 0 },
    { id: 'light2', type: 'lighting', name: 'Office Lighting', status: 'active', value: 60, unit: '%', floor: 2 },
    { id: 'access1', type: 'access', name: 'Main Entrance', status: 'secured', value: 'locked', unit: '', floor: 0 },
    { id: 'access2', type: 'access', name: 'Parking Access', status: 'open', value: 'open', unit: '', floor: -1 },
    { id: 'sensor1', type: 'sensor', name: 'Air Quality', status: 'optimal', value: 85, unit: 'AQI', floor: 1 },
    { id: 'sensor2', type: 'sensor', name: 'Water Pressure', status: 'normal', value: 45, unit: 'psi', floor: 0 }
  ],
  parkingLevels: [
    { level: 'B1', occupied: 142, total: 150, evChargers: 12, evInUse: 8 },
    { level: 'B2', occupied: 156, total: 180, evChargers: 18, evInUse: 15 },
    { level: 'B3', occupied: 89, total: 170, evChargers: 15, evInUse: 6 }
  ]
};

interface Building3DViewEnhancedProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function Building3DViewEnhanced({ isActive, onToggle }: Building3DViewEnhancedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [selectedSpace, setSelectedSpace] = useState<any>(null);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [showSensors, setShowSensors] = useState(true);
  const [viewMode, setViewMode] = useState<'exterior' | 'interior' | 'systems'>('exterior');
  const [deviceControls, setDeviceControls] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true, { 
      preserveDrawingBuffer: true, 
      stencil: true,
      antialias: true 
    });
    engineRef.current = engine;

    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.1, 1);

    // Enhanced camera with smooth controls
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 3,
      50,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.minZ = 0.1;
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 100;
    camera.attachControl(canvas, true);
    camera.wheelDeltaPercentage = 0.01;
    camera.panningSensibility = 50;

    // Enhanced lighting
    const light1 = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -2, -1), scene);
    light1.intensity = 0.7;
    light1.position = new BABYLON.Vector3(20, 40, 20);

    const light2 = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, 0), scene);
    light2.intensity = 0.5;
    light2.diffuse = new BABYLON.Color3(0.9, 0.9, 1);

    // Create ground with grid
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene);
    const gridMaterial = new GridMaterial('gridMaterial', scene);
    gridMaterial.majorUnitFrequency = 5;
    gridMaterial.minorUnitVisibility = 0.45;
    gridMaterial.gridRatio = 1;
    gridMaterial.mainColor = new BABYLON.Color3(0.1, 0.1, 0.2);
    gridMaterial.lineColor = new BABYLON.Color3(0.2, 0.2, 0.3);
    ground.material = gridMaterial;
    ground.receiveShadows = true;

    // Shadow generator
    const shadowGenerator = new BABYLON.ShadowGenerator(2048, light1);
    shadowGenerator.useBlurExponentialShadowMap = true;

    // Create enhanced buildings
    ENHANCED_BUILDING_DATA.buildings.forEach((building) => {
      // Main building structure
      const buildingMesh = BABYLON.MeshBuilder.CreateBox(
        building.id,
        { 
          width: building.width, 
          height: building.totalFloors * 3, 
          depth: building.depth 
        },
        scene
      );

      buildingMesh.position.x = building.x;
      buildingMesh.position.y = (building.totalFloors * 3) / 2;
      buildingMesh.position.z = building.z;

      // Advanced building material
      const buildingMaterial = new BABYLON.PBRMaterial(`${building.id}Mat`, scene);
      buildingMaterial.albedoColor = BABYLON.Color3.FromHexString(building.color);
      buildingMaterial.metallic = 0.3;
      buildingMaterial.roughness = 0.4;

      // Create detailed texture
      const buildingTexture = new BABYLON.DynamicTexture(`${building.id}Texture`, { width: 1024, height: 1024 }, scene);
      const ctx = buildingTexture.getContext();

      // Building facade with windows
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, 1024, 1024);

      // Draw windows for each floor
      const windowRows = building.totalFloors * 2;
      const windowCols = 8;
      const windowWidth = 80;
      const windowHeight = 40;
      const windowSpacingX = (1024 - windowCols * windowWidth) / (windowCols + 1);
      const windowSpacingY = (1024 - windowRows * windowHeight) / (windowRows + 1);

      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const x = windowSpacingX + col * (windowWidth + windowSpacingX);
          const y = windowSpacingY + row * (windowHeight + windowSpacingY);

          // Window frame
          ctx.fillStyle = '#333';
          ctx.fillRect(x - 2, y - 2, windowWidth + 4, windowHeight + 4);

          // Window glass with occupancy-based lighting
          const isLit = Math.random() > 0.3;
          if (isLit) {
            const gradient = ctx.createLinearGradient(x, y, x + windowWidth, y + windowHeight);
            gradient.addColorStop(0, '#FFE4B5');
            gradient.addColorStop(0.5, '#FFA500');
            gradient.addColorStop(1, '#FF8C00');
            ctx.fillStyle = gradient;
          } else {
            ctx.fillStyle = '#1a3a52';
          }
          ctx.fillRect(x, y, windowWidth, windowHeight);

          // Window reflection
          ctx.globalAlpha = 0.3;
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + windowWidth * 0.3, y + windowHeight * 0.3);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      buildingTexture.update();
      buildingMaterial.albedoTexture = buildingTexture;
      buildingMaterial.emissiveTexture = buildingTexture;
      buildingMaterial.emissiveIntensity = 0.2;

      buildingMesh.material = buildingMaterial;
      shadowGenerator.addShadowCaster(buildingMesh);
      buildingMesh.receiveShadows = true;

      // Add interactive features
      buildingMesh.actionManager = new BABYLON.ActionManager(scene);
      buildingMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          () => setSelectedBuilding(building.id)
        )
      );

      // Create floor indicators when building is selected
      if (selectedBuilding === building.id) {
        building.floors.forEach((floor, index) => {
          const floorHeight = 3;
          const floorY = index * floorHeight + floorHeight / 2;

          // Floor highlight plane
          const floorPlane = BABYLON.MeshBuilder.CreateBox(
            `floor_${floor.level}`,
            { width: building.width * 0.95, height: 0.1, depth: building.depth * 0.95 },
            scene
          );
          floorPlane.position.x = building.x;
          floorPlane.position.y = floorY;
          floorPlane.position.z = building.z;

          const floorMaterial = new BABYLON.StandardMaterial(`floorMat_${floor.level}`, scene);
          floorMaterial.diffuseColor = selectedFloor === floor.level 
            ? new BABYLON.Color3(0, 1, 0) 
            : new BABYLON.Color3(0.2, 0.2, 0.2);
          floorMaterial.alpha = 0.3;
          floorPlane.material = floorMaterial;

          floorPlane.actionManager = new BABYLON.ActionManager(scene);
          floorPlane.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              BABYLON.ActionManager.OnPickTrigger,
              () => setSelectedFloor(floor.level)
            )
          );
        });
      }

      // Create heat map visualization if enabled
      if (showHeatMap && selectedBuilding === building.id && selectedFloor !== null) {
        const floor = building.floors.find(f => f.level === selectedFloor);
        if (floor) {
          floor.spaces.forEach((space) => {
            const spaceWidth = building.width / 2;
            const spaceDepth = building.depth / 2;
            const spaceX = building.x + (Math.random() - 0.5) * building.width * 0.8;
            const spaceZ = building.z + (Math.random() - 0.5) * building.depth * 0.8;
            const spaceY = selectedFloor * 3 + 1.5;

            const spaceMesh = BABYLON.MeshBuilder.CreateBox(
              `space_${space.id}`,
              { width: spaceWidth, height: 2.8, depth: spaceDepth },
              scene
            );
            spaceMesh.position.set(spaceX, spaceY, spaceZ);

            const spaceMaterial = new BABYLON.StandardMaterial(`spaceMat_${space.id}`, scene);
            const occupancyRatio = space.occupancy / space.capacity;
            
            // Color based on occupancy
            if (occupancyRatio > 0.8) {
              spaceMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red for high occupancy
            } else if (occupancyRatio > 0.6) {
              spaceMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow for medium
            } else {
              spaceMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); // Green for low
            }
            
            spaceMaterial.alpha = 0.6;
            spaceMesh.material = spaceMaterial;

            spaceMesh.actionManager = new BABYLON.ActionManager(scene);
            spaceMesh.actionManager.registerAction(
              new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => setSelectedSpace(space)
              )
            );
          });
        }
      }
    });

    // Create IoT sensors
    if (showSensors) {
      ENHANCED_BUILDING_DATA.iotDevices.forEach((device, index) => {
        const sensorSphere = BABYLON.MeshBuilder.CreateSphere(
          `sensor_${device.id}`,
          { diameter: 1 },
          scene
        );

        // Position based on floor
        sensorSphere.position.x = -20 + Math.random() * 40;
        sensorSphere.position.y = device.floor * 3 + 2;
        sensorSphere.position.z = -20 + Math.random() * 40;

        const sensorMaterial = new BABYLON.StandardMaterial(`sensorMat_${device.id}`, scene);
        
        // Color based on device type
        switch (device.type) {
          case 'hvac':
            sensorMaterial.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
            break;
          case 'lighting':
            sensorMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
            break;
          case 'access':
            sensorMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
            break;
          case 'sensor':
            sensorMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
            break;
          default:
            sensorMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        }

        sensorMaterial.emissiveColor = sensorMaterial.diffuseColor.scale(0.5);
        sensorSphere.material = sensorMaterial;

        // Pulsing animation
        scene.registerBeforeRender(() => {
          const time = Date.now() * 0.001;
          const scale = 1 + Math.sin(time * 2 + index) * 0.2;
          sensorSphere.scaling = new BABYLON.Vector3(scale, scale, scale);
        });

        // Device label
        const label = BABYLON.MeshBuilder.CreatePlane(`label_${device.id}`, { width: 4, height: 1 }, scene);
        label.position = sensorSphere.position.clone();
        label.position.y += 1.5;
        label.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

        const labelTexture = new BABYLON.DynamicTexture(`labelTex_${device.id}`, { width: 256, height: 64 }, scene);
        const labelCtx = labelTexture.getContext();
        labelCtx.font = '20px Arial';
        labelCtx.fillStyle = 'white';
        labelCtx.textAlign = 'center';
        labelCtx.fillText(device.name, 128, 32);
        labelCtx.font = '16px Arial';
        labelCtx.fillText(`${device.value}${device.unit}`, 128, 50);
        labelTexture.update();

        const labelMaterial = new BABYLON.StandardMaterial(`labelMat_${device.id}`, scene);
        labelMaterial.diffuseTexture = labelTexture;
        labelMaterial.emissiveTexture = labelTexture;
        labelMaterial.backFaceCulling = false;
        labelMaterial.disableLighting = true;
        label.material = labelMaterial;
      });
    }

    // Animation
    scene.registerBeforeRender(() => {
      if (isAnimating) {
        camera.alpha += 0.001;
      }
    });

    // Handle window resize
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [isActive, selectedBuilding, selectedFloor, showHeatMap, showSensors, isAnimating]);

  const resetCamera = () => {
    if (sceneRef.current) {
      const camera = sceneRef.current.activeCamera as BABYLON.ArcRotateCamera;
      camera.alpha = -Math.PI / 2;
      camera.beta = Math.PI / 3;
      camera.radius = 50;
      camera.target = new BABYLON.Vector3(0, 0, 0);
    }
  };

  const zoomIn = () => {
    if (sceneRef.current) {
      const camera = sceneRef.current.activeCamera as BABYLON.ArcRotateCamera;
      camera.radius = Math.max(camera.radius - 5, camera.lowerRadiusLimit || 10);
    }
  };

  const zoomOut = () => {
    if (sceneRef.current) {
      const camera = sceneRef.current.activeCamera as BABYLON.ArcRotateCamera;
      camera.radius = Math.min(camera.radius + 5, camera.upperRadiusLimit || 100);
    }
  };

  const handleDeviceControl = (deviceId: string, value: any) => {
    setDeviceControls(prev => ({ ...prev, [deviceId]: value }));
    // In a real app, this would send commands to the actual IoT devices
  };

  const selectedBuildingData = ENHANCED_BUILDING_DATA.buildings.find(b => b.id === selectedBuilding);
  const selectedFloorData = selectedBuildingData?.floors.find(f => f.level === selectedFloor);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Glasses className="w-5 h-5 text-purple-600" />
          Enhanced 3D Smart Building Visualization
        </CardTitle>
        <CardDescription>
          Interactive building management with real-time IoT controls and analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Enhanced Controls */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={onToggle} 
              className="flex items-center gap-2"
            >
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
                <Button variant="outline" onClick={() => setIsAnimating(!isAnimating)}>
                  {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isAnimating ? 'Pause' : 'Play'}
                </Button>
                <Button variant="outline" onClick={resetCamera}>
                  <RotateCw className="w-4 h-4" />
                  Reset View
                </Button>
                <Button variant="outline" onClick={zoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={zoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showHeatMap}
                    onCheckedChange={setShowHeatMap}
                    id="heatmap"
                  />
                  <label htmlFor="heatmap" className="text-sm">Heat Map</label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showSensors}
                    onCheckedChange={setShowSensors}
                    id="sensors"
                  />
                  <label htmlFor="sensors" className="text-sm">Sensors</label>
                </div>
              </>
            )}
          </div>

          {/* 3D Canvas and Controls */}
          {isActive && (
            <div className="grid gap-4 lg:grid-cols-3">
              {/* 3D View */}
              <div className="lg:col-span-2">
                <div className="relative w-full h-[600px] border rounded-lg overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900">
                  <canvas ref={canvasRef} className="w-full h-full" />
                  
                  {/* View Mode Selector */}
                  <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={viewMode === 'exterior' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('exterior')}
                        className="text-xs"
                      >
                        Exterior
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'interior' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('interior')}
                        className="text-xs"
                      >
                        Interior
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'systems' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('systems')}
                        className="text-xs"
                      >
                        Systems
                      </Button>
                    </div>
                  </div>

                  {/* Building Info Overlay */}
                  {selectedBuildingData && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-lg backdrop-blur-sm max-w-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold">{selectedBuildingData.name}</h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedBuilding(null)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Total Floors:</span>
                          <span>{selectedBuildingData.totalFloors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Occupancy:</span>
                          <span>{selectedBuildingData.occupancy}/{selectedBuildingData.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Energy Usage:</span>
                          <span>{selectedBuildingData.energyUsage} kW</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge variant="outline" className="text-xs">
                            {selectedBuildingData.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Floor Navigator */}
                  {selectedBuildingData && (
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm">
                      <div className="text-xs font-medium mb-2">Floor Selection</div>
                      <div className="flex flex-col gap-1">
                        {selectedBuildingData.floors.map((floor) => (
                          <Button
                            key={floor.level}
                            size="sm"
                            variant={selectedFloor === floor.level ? 'default' : 'ghost'}
                            onClick={() => setSelectedFloor(floor.level)}
                            className="text-xs justify-start"
                          >
                            <span className="w-12">{floor.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {floor.type}
                            </Badge>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Space Details */}
                  {selectedSpace && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white p-3 rounded-lg backdrop-blur-sm max-w-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold">{selectedSpace.name}</h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedSpace(null)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Occupancy:</span>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(selectedSpace.occupancy / selectedSpace.capacity) * 100} 
                              className="w-20 h-2"
                            />
                            <span>{selectedSpace.occupancy}/{selectedSpace.capacity}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Temperature:</span>
                          <span>{selectedSpace.temp}°C</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Status:</span>
                          <Badge variant="outline" className="text-xs">
                            {selectedSpace.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Control Panel */}
              <div className="space-y-4">
                {/* IoT Device Controls */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">IoT Device Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="hvac" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="hvac">HVAC</TabsTrigger>
                        <TabsTrigger value="lighting">Lights</TabsTrigger>
                        <TabsTrigger value="access">Access</TabsTrigger>
                        <TabsTrigger value="sensors">Sensors</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="hvac" className="space-y-3">
                        {ENHANCED_BUILDING_DATA.iotDevices
                          .filter(d => d.type === 'hvac')
                          .map(device => (
                            <div key={device.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">{device.name}</label>
                                <Badge variant="outline" className="text-xs">
                                  {device.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-muted-foreground" />
                                <Slider
                                  value={[deviceControls[device.id] || device.value]}
                                  onValueChange={(value) => handleDeviceControl(device.id, value[0])}
                                  min={16}
                                  max={28}
                                  step={0.5}
                                  className="flex-1"
                                />
                                <span className="text-sm w-12 text-right">
                                  {deviceControls[device.id] || device.value}°C
                                </span>
                              </div>
                            </div>
                          ))}
                      </TabsContent>

                      <TabsContent value="lighting" className="space-y-3">
                        {ENHANCED_BUILDING_DATA.iotDevices
                          .filter(d => d.type === 'lighting')
                          .map(device => (
                            <div key={device.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">{device.name}</label>
                                <Switch
                                  checked={(deviceControls[device.id] || device.value) > 0}
                                  onCheckedChange={(checked) => 
                                    handleDeviceControl(device.id, checked ? 100 : 0)
                                  }
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-muted-foreground" />
                                <Slider
                                  value={[deviceControls[device.id] || device.value]}
                                  onValueChange={(value) => handleDeviceControl(device.id, value[0])}
                                  min={0}
                                  max={100}
                                  step={5}
                                  className="flex-1"
                                />
                                <span className="text-sm w-12 text-right">
                                  {deviceControls[device.id] || device.value}%
                                </span>
                              </div>
                            </div>
                          ))}
                      </TabsContent>

                      <TabsContent value="access" className="space-y-3">
                        {ENHANCED_BUILDING_DATA.iotDevices
                          .filter(d => d.type === 'access')
                          .map(device => (
                            <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-2">
                                {device.value === 'locked' ? (
                                  <Lock className="w-4 h-4 text-red-500" />
                                ) : (
                                  <Unlock className="w-4 h-4 text-green-500" />
                                )}
                                <span className="text-sm font-medium">{device.name}</span>
                              </div>
                              <Switch
                                checked={device.value === 'open'}
                                onCheckedChange={(checked) => 
                                  handleDeviceControl(device.id, checked ? 'open' : 'locked')
                                }
                              />
                            </div>
                          ))}
                      </TabsContent>

                      <TabsContent value="sensors" className="space-y-3">
                        {ENHANCED_BUILDING_DATA.iotDevices
                          .filter(d => d.type === 'sensor')
                          .map(device => (
                            <div key={device.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{device.name}</span>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-xs",
                                    device.status === 'optimal' && "border-green-500 text-green-500",
                                    device.status === 'normal' && "border-blue-500 text-blue-500",
                                    device.status === 'warning' && "border-yellow-500 text-yellow-500"
                                  )}
                                >
                                  {device.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <Activity className="w-4 h-4 text-muted-foreground" />
                                <span className="text-lg font-mono">
                                  {device.value} {device.unit}
                                </span>
                              </div>
                            </div>
                          ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Parking Overview */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ParkingCircle className="w-4 h-4" />
                      Parking Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ENHANCED_BUILDING_DATA.parkingLevels.map((level) => (
                        <div key={level.level} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{level.level}</span>
                            <span className="text-muted-foreground">
                              {level.occupied}/{level.total} spaces
                            </span>
                          </div>
                          <Progress 
                            value={(level.occupied / level.total) * 100} 
                            className="h-2"
                          />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BatteryCharging className="w-3 h-3" />
                              <span>EV: {level.evInUse}/{level.evChargers}</span>
                            </div>
                            <span>{level.total - level.occupied} available</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      Building Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <Zap className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                        <div className="text-lg font-bold">342 kW</div>
                        <div className="text-xs text-muted-foreground">Energy Usage</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <TrendingDown className="w-6 h-6 mx-auto mb-1 text-green-600" />
                        <div className="text-lg font-bold">-12%</div>
                        <div className="text-xs text-muted-foreground">vs Last Week</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <Users className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                        <div className="text-lg font-bold">732</div>
                        <div className="text-xs text-muted-foreground">Occupancy</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                        <AlertCircle className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                        <div className="text-lg font-bold">3</div>
                        <div className="text-xs text-muted-foreground">Active Alerts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Welcome screen */}
          {!isActive && (
            <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-semibold mb-2">Enhanced 3D Building Experience</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Explore smart buildings with interactive floor plans, real-time IoT controls, 
                occupancy heat maps, and comprehensive building management features.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm max-w-2xl mx-auto">
                <div className="text-center">
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium">Floor Navigation</div>
                  <div className="text-xs text-muted-foreground">Explore each level</div>
                </div>
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="font-medium">Real-time IoT</div>
                  <div className="text-xs text-muted-foreground">Control devices</div>
                </div>
                <div className="text-center">
                  <Thermometer className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="font-medium">Heat Maps</div>
                  <div className="text-xs text-muted-foreground">Occupancy visualization</div>
                </div>
                <div className="text-center">
                  <Car className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-medium">Smart Parking</div>
                  <div className="text-xs text-muted-foreground">EV charging status</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}