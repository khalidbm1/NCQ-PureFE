/**
 * 3D Building Visualization Component
 * Displays an interactive 3D model of the building with real-time IoT data
 */

import { useEffect, useRef, useState } from 'react';
import { IoTDevice, SmartSpace, Location, AreaType } from '@/types/iot';
import { getIoTService } from '@/services/iot-service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  ZoomIn, 
  ZoomOut,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { EnhancedBuildingScene } from './scenes/EnhancedBuildingScene';
import * as BABYLON from '@babylonjs/core';

interface Building3DVisualizationProps {
  floor: number;
  building: string;
  onLocationSelect?: (location: Location) => void;
}

export function Building3DVisualization({ floor, building, onLocationSelect }: Building3DVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<EnhancedBuildingScene | null>(null);
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [rooms, setRooms] = useState<SmartSpace[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDevices, setShowDevices] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | 'floorplan'>('3d');

  const iotService = getIoTService();

  // Basic 3D scene fallback
  const initializeBasicScene = () => {
    if (!canvasRef.current) return;

    console.log('Creating basic Babylon.js scene...');
    
    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);
    
    // Create camera
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 4,
      Math.PI / 3,
      50,
      new BABYLON.Vector3(0, 8, 0),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    
    // Create lights
    const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light1.intensity = 0.7;
    
    const light2 = new BABYLON.DirectionalLight('light2', new BABYLON.Vector3(-1, -1, -1), scene);
    light2.intensity = 0.5;
    
    // Create ground
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 60, height: 40 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial('groundMat', scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.3, 0.2);
    ground.material = groundMaterial;
    
    // Create simple building structure for each floor
    for (let f = 1; f <= 5; f++) {
      const floorY = (f - 1) * 4;
      
      // Floor base
      const floorBase = BABYLON.MeshBuilder.CreateBox(
        `floor_${f}`,
        { width: 50, height: 0.4, depth: 30 },
        scene
      );
      floorBase.position.y = floorY;
      
      const floorMaterial = new BABYLON.StandardMaterial(`floorMat_${f}`, scene);
      floorMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
      floorBase.material = floorMaterial;
      
      // Add some rooms
      for (let r = 0; r < 6; r++) {
        const room = BABYLON.MeshBuilder.CreateBox(
          `room_${f}_${r}`,
          { width: 8, height: 3, depth: 6 },
          scene
        );
        room.position.x = -20 + (r * 8);
        room.position.y = floorY + 2;
        room.position.z = 0;
        
        const roomMaterial = new BABYLON.StandardMaterial(`roomMat_${f}_${r}`, scene);
        roomMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.9, 1.0);
        roomMaterial.alpha = 0.8;
        room.material = roomMaterial;
      }
      
      // Hide floors other than the current one
      if (f !== floor) {
        floorBase.visibility = 0.3;
      }
    }
    
    // Create mock IoT devices
    for (let i = 0; i < 10; i++) {
      const device = BABYLON.MeshBuilder.CreateSphere(`device_${i}`, { diameter: 0.5 }, scene);
      device.position.x = (Math.random() - 0.5) * 40;
      device.position.y = (floor - 1) * 4 + 2;
      device.position.z = (Math.random() - 0.5) * 20;
      
      const deviceMaterial = new BABYLON.StandardMaterial(`deviceMat_${i}`, scene);
      deviceMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
      deviceMaterial.emissiveColor = new BABYLON.Color3(0, 0.2, 0);
      device.material = deviceMaterial;
    }
    
    // Start render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
      engine.resize();
    });
    
    // Create mock scene object to match interface
    sceneRef.current = {
      setActiveFloor: (floorNum: number) => {
        console.log(`Switching to floor ${floorNum}`);
        // Update floor visibility
        scene.meshes.forEach(mesh => {
          if (mesh.name.startsWith('floor_')) {
            const meshFloor = parseInt(mesh.name.split('_')[1]);
            mesh.visibility = meshFloor === floorNum ? 1.0 : 0.3;
          }
        });
      },
      setDeviceVisibility: (visible: boolean) => {
        scene.meshes.forEach(mesh => {
          if (mesh.name.startsWith('device_')) {
            mesh.setEnabled(visible);
          }
        });
      },
      setHeatmapMode: () => {},
      updateRooms: () => {},
      updateDevices: () => {},
      updateDevice: () => {},
      zoomIn: () => { camera.radius *= 0.8; },
      zoomOut: () => { camera.radius *= 1.2; },
      resetView: () => { 
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.radius = 50;
      },
      moveToPreset: () => {},
      createCinematicTour: () => {},
      toggleAutoRotation: () => {},
      setQualityLevel: () => {},
      setParticlesEnabled: () => {},
      dispose: () => {
        scene.dispose();
        engine.dispose();
      }
    } as any;
    
    setLoading(false);
    console.log('Basic 3D scene initialized successfully');
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Try enhanced scene first, fallback to basic scene
    try {
      console.log('Initializing Enhanced 3D scene...');
      sceneRef.current = new EnhancedBuildingScene(canvasRef.current);
      sceneRef.current.onRoomSelect = handleRoomSelect;
      
      // Initialize with async method
      sceneRef.current.initialize().then(() => {
        setLoading(false);
        console.log('Enhanced 3D scene initialized successfully');
      }).catch((error) => {
        console.error('Failed to initialize enhanced 3D scene:', error);
        console.log('Falling back to basic 3D scene...');
        initializeBasicScene();
      });
    } catch (error) {
      console.error('Error creating EnhancedBuildingScene:', error);
      console.log('Falling back to basic 3D scene...');
      initializeBasicScene();
    }

    // Load initial data
    loadBuildingData();

    // Subscribe to real-time updates
    iotService.subscribe('floor:update', handleFloorUpdate);
    iotService.subscribe('device:status', handleDeviceUpdate);

    return () => {
      iotService.unsubscribe('floor:update');
      iotService.unsubscribe('device:status');
      sceneRef.current?.dispose();
    };
  }, [floor, building]);

  useEffect(() => {
    // Update scene when floor changes
    if (sceneRef.current) {
      sceneRef.current.setActiveFloor(floor);
    }
  }, [floor]);

  useEffect(() => {
    // Toggle device visibility
    if (sceneRef.current) {
      sceneRef.current.setDeviceVisibility(showDevices);
    }
  }, [showDevices]);

  useEffect(() => {
    // Toggle heatmap
    if (sceneRef.current) {
      sceneRef.current.setHeatmapMode(showHeatmap);
    }
  }, [showHeatmap]);

  const loadBuildingData = async () => {
    try {
      setLoading(true);
      const [devicesData, roomsData] = await Promise.all([
        iotService.getDevices({ 
          location: { building, floor, area: AreaType.ROOM, zone: '' } 
        }),
        iotService.getRooms(floor)
      ]);
      
      setDevices(devicesData);
      setRooms(roomsData);
      
      // Update 3D scene with data
      if (sceneRef.current) {
        sceneRef.current.updateRooms(roomsData);
        sceneRef.current.updateDevices(devicesData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load building data:', error);
      setLoading(false);
    }
  };

  const handleFloorUpdate = (data: any) => {
    if (data.floor === floor && data.building === building) {
      loadBuildingData();
    }
  };

  const handleDeviceUpdate = (device: IoTDevice) => {
    if (device.location.floor === floor && device.location.building === building) {
      // Update specific device in the scene
      if (sceneRef.current) {
        sceneRef.current.updateDevice(device);
      }
    }
  };

  const handleRoomSelect = (roomId: string | null) => {
    setSelectedRoom(roomId);
    if (roomId && onLocationSelect) {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        onLocationSelect({
          building,
          floor,
          area: AreaType.ROOM,
          zone: room.spaceNumber
        });
      }
    }
  };

  const handleZoomIn = () => {
    sceneRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    sceneRef.current?.zoomOut();
  };

  const handleResetView = () => {
    sceneRef.current?.resetView();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const selectedRoomData = selectedRoom ? rooms.find(r => r.id === selectedRoom) : null;

  return (
    <div className="relative h-full">
      {/* 3D Canvas */}
      <div className={`relative ${isFullscreen ? 'h-screen' : 'h-[600px]'} bg-gray-100 rounded-lg overflow-hidden`}>
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
          style={{ touchAction: 'none' }}
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading 3D Building...</p>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {/* View Mode Toggle */}
          <div className="bg-white rounded-lg shadow-lg p-1 flex">
            <Button
              size="sm"
              variant={viewMode === '3d' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('3d')}
              className="text-xs"
            >
              3D
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'floorplan' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('floorplan')}
              className="text-xs"
            >
              2D
            </Button>
          </div>

          {/* Layer Controls */}
          <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
            <button
              onClick={() => setShowDevices(!showDevices)}
              className={`flex items-center space-x-2 text-sm ${showDevices ? 'text-blue-600' : 'text-gray-400'}`}
            >
              {showDevices ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>Devices</span>
            </button>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center space-x-2 text-sm ${showHeatmap ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Layers className="h-4 w-4" />
              <span>Heat Map</span>
            </button>
          </div>

          {/* Advanced Camera Presets */}
          <div className="bg-white rounded-lg shadow-lg p-2">
            <h4 className="text-xs font-medium text-gray-600 mb-2">Camera Views</h4>
            <div className="grid grid-cols-2 gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-8"
                onClick={() => sceneRef.current?.moveToPreset('overview')}
              >
                Overview
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-8"
                onClick={() => sceneRef.current?.moveToPreset('interior')}
              >
                Interior
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-8"
                onClick={() => sceneRef.current?.moveToPreset('exterior')}
              >
                Exterior
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-8"
                onClick={() => sceneRef.current?.moveToPreset('birdseye')}
              >
                Bird's Eye
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-8 w-full mt-1"
              onClick={() => sceneRef.current?.createCinematicTour()}
            >
              Cinematic Tour
            </Button>
          </div>

          {/* Quality Settings */}
          <div className="bg-white rounded-lg shadow-lg p-2">
            <h4 className="text-xs font-medium text-gray-600 mb-2">Quality</h4>
            <select
              className="w-full text-xs p-1 border rounded"
              onChange={(e) => {
                const quality = e.target.value as 'low' | 'medium' | 'high' | 'ultra';
                sceneRef.current?.setQualityLevel(quality);
              }}
              defaultValue="high"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
            </select>
          </div>

          {/* Effects Controls */}
          <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
            <h4 className="text-xs font-medium text-gray-600 mb-2">Effects</h4>
            <button
              onClick={() => {
                setShowParticles(!showParticles);
                sceneRef.current?.setParticlesEnabled(!showParticles);
              }}
              className={`flex items-center space-x-2 text-sm ${showParticles ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <span className="text-xs">Particles</span>
            </button>
            <button
              onClick={() => sceneRef.current?.toggleAutoRotation()}
              className="flex items-center space-x-2 text-sm text-gray-600"
            >
              <span className="text-xs">Auto Rotate</span>
            </button>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <div className="bg-white rounded-lg shadow-lg p-1 flex flex-col space-y-1">
            <Button size="sm" variant="ghost" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleResetView}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Floor Indicator */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2">
          <p className="text-sm font-medium">Floor {floor}</p>
        </div>

        {/* Room Info Panel */}
        {selectedRoomData && (
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <h4 className="font-medium mb-2">Room {selectedRoomData.spaceNumber}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge variant={selectedRoomData.status === 'available' ? 'secondary' : 'default'}>
                  {selectedRoomData.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Occupancy:</span>
                <span>{selectedRoomData.occupancy.current}/{selectedRoomData.occupancy.maximum}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Temperature:</span>
                <span>{selectedRoomData.environment.temperature}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Air Quality:</span>
                <span>{selectedRoomData.environment.airQuality}</span>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-4 py-2">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>High Usage</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Alert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}