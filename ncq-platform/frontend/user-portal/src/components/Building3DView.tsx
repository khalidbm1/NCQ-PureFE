import { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { GridMaterial } from '@babylonjs/materials';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Glasses, Play, Pause, Building2, Activity, Car, Zap, RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';

// Building and sensor data
const BUILDING_DATA = {
  buildings: [
    // Downtown Core
    { id: 'electronics', name: 'Electronics Zone', type: 'retail', color: '#3B82F6', occupancy: 78, floors: 3, x: -20, z: -15 },
    { id: 'fashion', name: 'Fashion District', type: 'retail', color: '#EF4444', occupancy: 92, floors: 4, x: -10, z: -15 },
    { id: 'home', name: 'Home & Garden', type: 'retail', color: '#10B981', occupancy: 45, floors: 2, x: 0, z: -15 },
    { id: 'sports', name: 'Sports & Outdoor', type: 'retail', color: '#F59E0B', occupancy: 67, floors: 3, x: 10, z: -15 },
    { id: 'restaurant', name: 'Food Court', type: 'dining', color: '#8B5CF6', occupancy: 85, floors: 2, x: 20, z: -15 },
    
    // Business District
    { id: 'office', name: 'Business Center', type: 'office', color: '#06B6D4', occupancy: 73, floors: 8, x: -20, z: -5 },
    { id: 'retail', name: 'Shopping Mall', type: 'retail', color: '#F97316', occupancy: 88, floors: 5, x: -10, z: -5 },
    { id: 'hotel', name: 'Grand Hotel', type: 'hotel', color: '#EC4899', occupancy: 95, floors: 12, x: 0, z: -5 },
    { id: 'hospital', name: 'Medical Center', type: 'medical', color: '#DC2626', occupancy: 82, floors: 6, x: 10, z: -5 },
    { id: 'school', name: 'Smart School', type: 'education', color: '#059669', occupancy: 76, floors: 4, x: 20, z: -5 },
    
    // Financial District
    { id: 'bank', name: 'Financial Plaza', type: 'finance', color: '#7C3AED', occupancy: 65, floors: 10, x: -20, z: 5 },
    { id: 'library', name: 'Digital Library', type: 'education', color: '#0891B2', occupancy: 43, floors: 3, x: -10, z: 5 },
    { id: 'gym', name: 'Fitness Center', type: 'recreation', color: '#EA580C', occupancy: 89, floors: 2, x: 0, z: 5 },
    { id: 'cinema', name: 'Movie Theater', type: 'entertainment', color: '#BE185D', occupancy: 71, floors: 3, x: 10, z: 5 },
    { id: 'museum', name: 'Tech Museum', type: 'culture', color: '#7C2D12', occupancy: 38, floors: 4, x: 20, z: 5 },
    
    // Industrial Zone
    { id: 'airport', name: 'Transport Hub', type: 'transport', color: '#374151', occupancy: 94, floors: 3, x: -20, z: 15 },
    { id: 'factory', name: 'Smart Factory', type: 'industrial', color: '#4B5563', occupancy: 87, floors: 2, x: -10, z: 15 },
    { id: 'warehouse', name: 'Logistics Center', type: 'industrial', color: '#6B7280', occupancy: 92, floors: 2, x: 0, z: 15 },
    { id: 'stadium', name: 'Sports Arena', type: 'recreation', color: '#16A34A', occupancy: 68, floors: 1, x: 10, z: 15 },
    { id: 'marina', name: 'Yacht Club', type: 'recreation', color: '#0EA5E9', occupancy: 54, floors: 2, x: 20, z: 15 },
    
    // Tech Innovation District (New Area)
    { id: 'datacenter', name: 'Data Center', type: 'technology', color: '#1E40AF', occupancy: 96, floors: 5, x: -40, z: -15 },
    { id: 'research', name: 'Research Lab', type: 'technology', color: '#7C3AED', occupancy: 72, floors: 6, x: -40, z: -5 },
    { id: 'startup', name: 'Startup Hub', type: 'office', color: '#0891B2', occupancy: 84, floors: 8, x: -40, z: 5 },
    { id: 'conference', name: 'Conference Center', type: 'business', color: '#059669', occupancy: 45, floors: 3, x: -40, z: 15 },
    
    // Residential District (New Area)
    { id: 'apartment1', name: 'Sunset Towers', type: 'residential', color: '#F59E0B', occupancy: 89, floors: 20, x: 40, z: -15 },
    { id: 'apartment2', name: 'Garden Residences', type: 'residential', color: '#10B981', occupancy: 94, floors: 15, x: 40, z: -5 },
    { id: 'apartment3', name: 'Sky Lofts', type: 'residential', color: '#06B6D4', occupancy: 78, floors: 18, x: 40, z: 5 },
    { id: 'community', name: 'Community Center', type: 'public', color: '#8B5CF6', occupancy: 62, floors: 2, x: 40, z: 15 },
    
    // Entertainment District (New Area)
    { id: 'casino', name: 'Grand Casino', type: 'entertainment', color: '#DC2626', occupancy: 91, floors: 6, x: -30, z: -25 },
    { id: 'theater', name: 'Opera House', type: 'entertainment', color: '#BE185D', occupancy: 75, floors: 4, x: -20, z: -25 },
    { id: 'aquarium', name: 'Aquarium', type: 'entertainment', color: '#0EA5E9', occupancy: 83, floors: 3, x: -10, z: -25 },
    { id: 'arcade', name: 'Gaming Arena', type: 'entertainment', color: '#7C2D12', occupancy: 88, floors: 2, x: 0, z: -25 },
    { id: 'club', name: 'Night Club', type: 'entertainment', color: '#9333EA', occupancy: 95, floors: 3, x: 10, z: -25 },
    
    // Green District (New Area)
    { id: 'eco1', name: 'Eco Tower', type: 'sustainable', color: '#16A34A', occupancy: 81, floors: 12, x: -30, z: 25 },
    { id: 'solar', name: 'Solar Center', type: 'sustainable', color: '#F59E0B', occupancy: 77, floors: 4, x: -20, z: 25 },
    { id: 'botanical', name: 'Botanical Building', type: 'public', color: '#10B981', occupancy: 69, floors: 3, x: -10, z: 25 },
    { id: 'recycling', name: 'Recycling Plant', type: 'industrial', color: '#059669', occupancy: 92, floors: 2, x: 0, z: 25 },
    { id: 'organic', name: 'Organic Market', type: 'retail', color: '#84CC16', occupancy: 86, floors: 2, x: 10, z: 25 },
    
    // Education Campus (New Area)
    { id: 'university', name: 'Tech University', type: 'education', color: '#0891B2', occupancy: 88, floors: 7, x: 20, z: -25 },
    { id: 'dormitory', name: 'Student Housing', type: 'residential', color: '#06B6D4', occupancy: 96, floors: 10, x: 30, z: -25 },
    { id: 'sportscomplex', name: 'Sports Complex', type: 'recreation', color: '#EA580C', occupancy: 74, floors: 3, x: 40, z: -25 },
    
    // Healthcare District (New Area)
    { id: 'clinic', name: 'Health Clinic', type: 'medical', color: '#EF4444', occupancy: 79, floors: 4, x: 20, z: 25 },
    { id: 'pharmacy', name: 'Smart Pharmacy', type: 'medical', color: '#DC2626', occupancy: 85, floors: 2, x: 30, z: 25 },
    { id: 'wellness', name: 'Wellness Center', type: 'medical', color: '#F87171', occupancy: 71, floors: 3, x: 40, z: 25 }
  ],
  sensors: [
    { id: 's1', type: 'Temperature', value: '22.5°C', status: 'optimal', x: -15, y: 8, z: -10 },
    { id: 's2', type: 'Occupancy', value: '156 people', status: 'normal', x: 15, y: 8, z: -10 },
    { id: 's3', type: 'Air Quality', value: '85 AQI', status: 'good', x: -15, y: 8, z: 10 },
    { id: 's4', type: 'Energy', value: '1247 kW', status: 'normal', x: 15, y: 8, z: 10 },
    { id: 's5', type: 'Security', value: 'All Clear', status: 'optimal', x: 0, y: 8, z: 0 },
    { id: 's6', type: 'Traffic', value: 'Light Flow', status: 'good', x: -25, y: 6, z: 0 },
    { id: 's7', type: 'Noise', value: '45 dB', status: 'optimal', x: 25, y: 6, z: 0 },
    { id: 's8', type: 'Humidity', value: '52%', status: 'normal', x: 0, y: 10, z: -20 },
    { id: 's9', type: 'CO2', value: '420 ppm', status: 'good', x: 0, y: 10, z: 20 },
    { id: 's10', type: 'Water', value: 'Normal', status: 'optimal', x: -20, y: 5, z: -20 },
    { id: 's11', type: 'Wifi', value: '98%', status: 'optimal', x: 20, y: 5, z: -20 },
    { id: 's12', type: 'Emergency', value: 'Ready', status: 'optimal', x: 0, y: 12, z: 0 }
  ],
  parkingLevels: [
    { level: 'Ground', occupied: 142, total: 150, y: -0.5 },
    { level: 'B1', occupied: 156, total: 180, y: -3 },
    { level: 'B2', occupied: 134, total: 180, y: -5.5 },
    { level: 'B3', occupied: 89, total: 170, y: -8 }
  ]
};

interface Building3DViewProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function Building3DView({ isActive, onToggle }: Building3DViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    // Initialize Babylon.js
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    engineRef.current = engine;

    // Create scene
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.1, 1);

    // Create camera
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 3,
      80,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.minZ = 0.1;
    camera.lowerRadiusLimit = 20;
    camera.upperRadiusLimit = 150;
    camera.attachControl(canvas, true);

    // Enhanced lighting setup
    const light1 = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -2, -1), scene);
    light1.intensity = 0.7;
    light1.position = new BABYLON.Vector3(20, 40, 20);
    
    // Enable shadows
    const shadowGenerator = new BABYLON.ShadowGenerator(2048, light1);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 2;
    shadowGenerator.setDarkness(0.2);

    const light2 = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, 0), scene);
    light2.intensity = 0.5;
    light2.diffuse = new BABYLON.Color3(0.9, 0.9, 1);
    light2.specular = new BABYLON.Color3(0, 0, 0);
    light2.groundColor = new BABYLON.Color3(0.1, 0.1, 0.2);
    
    // Add fog for atmosphere
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.01;
    scene.fogColor = new BABYLON.Color3(0.02, 0.02, 0.1);
    
    // Create skybox for better atmosphere
    const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 500 }, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    
    // Create gradient sky
    const skyTexture = new BABYLON.DynamicTexture('skyTexture', { width: 512, height: 512 }, scene);
    const skyCtx = skyTexture.getContext();
    const gradient = skyCtx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#001a33');
    gradient.addColorStop(0.5, '#003366');
    gradient.addColorStop(1, '#000511');
    skyCtx.fillStyle = gradient;
    skyCtx.fillRect(0, 0, 512, 512);
    skyTexture.update();
    skyboxMaterial.emissiveTexture = skyTexture;
    skybox.infiniteDistance = true;

    // Create ground with grid material - expanded size
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 150, height: 150 }, scene);
    const gridMaterial = new GridMaterial('gridMaterial', scene);
    gridMaterial.majorUnitFrequency = 5;
    gridMaterial.minorUnitVisibility = 0.45;
    gridMaterial.gridRatio = 1;
    gridMaterial.mainColor = new BABYLON.Color3(0.1, 0.1, 0.2);
    gridMaterial.lineColor = new BABYLON.Color3(0.2, 0.2, 0.3);
    ground.material = gridMaterial;
    ground.position.y = -0.1;
    ground.receiveShadows = true;

    // Create roads with realistic asphalt texture
    const createRoad = (width: number, length: number, x: number, z: number, rotation: number = 0) => {
      const road = BABYLON.MeshBuilder.CreateBox('road', { width, height: 0.1, depth: length }, scene);
      
      // Create PBR material for realistic road
      const roadMaterial = new BABYLON.PBRMaterial('roadMat', scene);
      roadMaterial.albedoColor = new BABYLON.Color3(0.15, 0.15, 0.15);
      roadMaterial.metallic = 0;
      roadMaterial.roughness = 0.9;
      
      // Create asphalt texture
      const roadTexture = new BABYLON.DynamicTexture('roadTexture', { width: 512, height: 512 }, scene);
      const roadCtx = roadTexture.getContext();
      
      // Base asphalt color with noise
      roadCtx.fillStyle = '#2a2a2a';
      roadCtx.fillRect(0, 0, 512, 512);
      
      // Add asphalt texture
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 2;
        const brightness = Math.floor(Math.random() * 30 + 20);
        roadCtx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
        roadCtx.fillRect(x, y, size, size);
      }
      
      // Add road markings
      if (rotation === 0 || rotation === Math.PI) {
        // Horizontal road - add center line
        roadCtx.strokeStyle = '#FFD700';
        roadCtx.lineWidth = 4;
        roadCtx.setLineDash([20, 10]);
        roadCtx.beginPath();
        roadCtx.moveTo(0, 256);
        roadCtx.lineTo(512, 256);
        roadCtx.stroke();
      } else {
        // Vertical road - add center line
        roadCtx.strokeStyle = '#FFD700';
        roadCtx.lineWidth = 4;
        roadCtx.setLineDash([20, 10]);
        roadCtx.beginPath();
        roadCtx.moveTo(256, 0);
        roadCtx.lineTo(256, 512);
        roadCtx.stroke();
      }
      
      roadTexture.update();
      roadMaterial.albedoTexture = roadTexture;
      
      road.material = roadMaterial;
      road.position.x = x;
      road.position.z = z;
      road.position.y = 0;
      road.rotation.y = rotation;
      road.receiveShadows = true;
      return road;
    };

    // Main roads - expanded road network
    createRoad(8, 150, 0, 0, 0); // Main horizontal road
    createRoad(150, 8, 0, 0, Math.PI / 2); // Main vertical road
    createRoad(6, 120, -30, 0, 0); // Left horizontal road
    createRoad(6, 120, 30, 0, 0); // Right horizontal road
    createRoad(6, 120, -50, 0, 0); // Far left horizontal road
    createRoad(6, 120, 50, 0, 0); // Far right horizontal road
    createRoad(120, 6, 0, -30, Math.PI / 2); // Top vertical road
    createRoad(120, 6, 0, 30, Math.PI / 2); // Bottom vertical road
    createRoad(120, 6, 0, -50, Math.PI / 2); // Far top vertical road
    createRoad(120, 6, 0, 50, Math.PI / 2); // Far bottom vertical road
    
    // Connecting roads
    createRoad(6, 100, -40, 0, 0); // Tech district horizontal
    createRoad(6, 100, 40, 0, 0); // Residential district horizontal
    createRoad(100, 6, 0, -40, Math.PI / 2); // Entertainment district vertical
    createRoad(100, 6, 0, 40, Math.PI / 2); // Green district vertical
    
    // Create moving cars
    const cars: BABYLON.Mesh[] = [];
    const carPaths: { mesh: BABYLON.Mesh; path: BABYLON.Vector3[]; currentIndex: number; speed: number }[] = [];
    
    const createCar = (id: string, color: BABYLON.Color3) => {
      // Car body
      const carBody = BABYLON.MeshBuilder.CreateBox(`car${id}`, { width: 2, height: 0.8, depth: 4 }, scene);
      
      // Car roof
      const carRoof = BABYLON.MeshBuilder.CreateBox(`carRoof${id}`, { width: 1.6, height: 0.6, depth: 2 }, scene);
      carRoof.position.y = 0.7;
      carRoof.position.z = -0.3;
      carRoof.parent = carBody;
      
      // Wheels
      for (let i = 0; i < 4; i++) {
        const wheel = BABYLON.MeshBuilder.CreateCylinder(`wheel${id}_${i}`, { diameter: 0.6, height: 0.3 }, scene);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.y = -0.4;
        wheel.position.x = (i % 2 === 0) ? -0.8 : 0.8;
        wheel.position.z = (i < 2) ? -1.2 : 1.2;
        wheel.parent = carBody;
        
        const wheelMat = new BABYLON.StandardMaterial(`wheelMat${id}_${i}`, scene);
        wheelMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        wheel.material = wheelMat;
      }
      
      // Car material
      const carMaterial = new BABYLON.PBRMaterial(`carMat${id}`, scene);
      carMaterial.albedoColor = color;
      carMaterial.metallic = 0.7;
      carMaterial.roughness = 0.3;
      carBody.material = carMaterial;
      
      const roofMat = new BABYLON.StandardMaterial(`roofMat${id}`, scene);
      roofMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      roofMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      carRoof.material = roofMat;
      
      // Headlights
      const headlight1 = BABYLON.MeshBuilder.CreateBox(`headlight1${id}`, { width: 0.3, height: 0.3, depth: 0.1 }, scene);
      headlight1.position.set(-0.6, 0, -2);
      headlight1.parent = carBody;
      
      const headlight2 = BABYLON.MeshBuilder.CreateBox(`headlight2${id}`, { width: 0.3, height: 0.3, depth: 0.1 }, scene);
      headlight2.position.set(0.6, 0, -2);
      headlight2.parent = carBody;
      
      const headlightMat = new BABYLON.StandardMaterial(`headlightMat${id}`, scene);
      headlightMat.emissiveColor = new BABYLON.Color3(1, 1, 0.8);
      headlight1.material = headlightMat;
      headlight2.material = headlightMat;
      
      carBody.position.y = 0.5;
      return carBody;
    };
    
    // Define car routes
    const routes = [
      // East-West routes
      { path: [new BABYLON.Vector3(-70, 0.5, 0), new BABYLON.Vector3(70, 0.5, 0)], speed: 0.3 },
      { path: [new BABYLON.Vector3(70, 0.5, -30), new BABYLON.Vector3(-70, 0.5, -30)], speed: 0.25 },
      { path: [new BABYLON.Vector3(-70, 0.5, 30), new BABYLON.Vector3(70, 0.5, 30)], speed: 0.35 },
      { path: [new BABYLON.Vector3(70, 0.5, -50), new BABYLON.Vector3(-70, 0.5, -50)], speed: 0.2 },
      { path: [new BABYLON.Vector3(-70, 0.5, 50), new BABYLON.Vector3(70, 0.5, 50)], speed: 0.3 },
      
      // North-South routes
      { path: [new BABYLON.Vector3(0, 0.5, -70), new BABYLON.Vector3(0, 0.5, 70)], speed: 0.28 },
      { path: [new BABYLON.Vector3(-30, 0.5, 70), new BABYLON.Vector3(-30, 0.5, -70)], speed: 0.32 },
      { path: [new BABYLON.Vector3(30, 0.5, -70), new BABYLON.Vector3(30, 0.5, 70)], speed: 0.26 },
      { path: [new BABYLON.Vector3(-50, 0.5, 70), new BABYLON.Vector3(-50, 0.5, -70)], speed: 0.22 },
      { path: [new BABYLON.Vector3(50, 0.5, -70), new BABYLON.Vector3(50, 0.5, 70)], speed: 0.29 },
      
      // Circular routes around districts
      { 
        path: [
          new BABYLON.Vector3(-40, 0.5, -20), 
          new BABYLON.Vector3(-40, 0.5, 20), 
          new BABYLON.Vector3(-20, 0.5, 20),
          new BABYLON.Vector3(-20, 0.5, -20),
          new BABYLON.Vector3(-40, 0.5, -20)
        ], 
        speed: 0.2 
      },
      { 
        path: [
          new BABYLON.Vector3(40, 0.5, -20), 
          new BABYLON.Vector3(40, 0.5, 20), 
          new BABYLON.Vector3(20, 0.5, 20),
          new BABYLON.Vector3(20, 0.5, -20),
          new BABYLON.Vector3(40, 0.5, -20)
        ], 
        speed: 0.25 
      }
    ];
    
    // Car colors
    const carColors = [
      new BABYLON.Color3(0.9, 0.1, 0.1), // Red
      new BABYLON.Color3(0.1, 0.1, 0.9), // Blue
      new BABYLON.Color3(0.1, 0.9, 0.1), // Green
      new BABYLON.Color3(0.9, 0.9, 0.1), // Yellow
      new BABYLON.Color3(0.9, 0.5, 0.1), // Orange
      new BABYLON.Color3(0.5, 0.1, 0.9), // Purple
      new BABYLON.Color3(0.1, 0.9, 0.9), // Cyan
      new BABYLON.Color3(0.9, 0.9, 0.9), // White
      new BABYLON.Color3(0.3, 0.3, 0.3), // Gray
      new BABYLON.Color3(0.9, 0.1, 0.5), // Pink
      new BABYLON.Color3(0.1, 0.5, 0.3), // Dark Green
      new BABYLON.Color3(0.7, 0.3, 0.1)  // Brown
    ];
    
    // Create cars for each route
    routes.forEach((route, index) => {
      const car = createCar(`${index}`, carColors[index % carColors.length]);
      car.position = route.path[0].clone();
      
      // Face the car in the right direction
      if (route.path.length >= 2) {
        const direction = route.path[1].subtract(route.path[0]).normalize();
        car.rotation.y = Math.atan2(direction.x, direction.z);
      }
      
      cars.push(car);
      carPaths.push({
        mesh: car,
        path: route.path,
        currentIndex: 0,
        speed: route.speed + (Math.random() * 0.1 - 0.05) // Add some variation
      });
      
      // Enable shadows for cars
      shadowGenerator.addShadowCaster(car);
      car.receiveShadows = true;
    });
    
    // Animate cars
    scene.registerBeforeRender(() => {
      carPaths.forEach((carPath) => {
        const car = carPath.mesh;
        const path = carPath.path;
        const currentPos = car.position;
        const targetPos = path[carPath.currentIndex];
        
        // Move towards target
        const direction = targetPos.subtract(currentPos);
        const distance = direction.length();
        
        if (distance > 0.5) {
          // Continue moving towards current target
          direction.normalize();
          car.position.addInPlace(direction.scale(carPath.speed));
          
          // Rotate car to face direction
          car.rotation.y = Math.atan2(direction.x, direction.z);
        } else {
          // Reached current target, move to next
          carPath.currentIndex = (carPath.currentIndex + 1) % path.length;
        }
      });
    });

    // Create traffic lights at major intersections
    const createTrafficLight = (x: number, z: number) => {
      // Traffic light pole
      const pole = BABYLON.MeshBuilder.CreateCylinder('pole', { diameter: 0.3, height: 6 }, scene);
      pole.position.set(x, 3, z);
      
      const poleMat = new BABYLON.StandardMaterial('poleMat', scene);
      poleMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      pole.material = poleMat;
      
      // Traffic light box
      const lightBox = BABYLON.MeshBuilder.CreateBox('lightBox', { width: 0.8, height: 2.5, depth: 0.8 }, scene);
      lightBox.position.set(x, 5.5, z);
      lightBox.parent = pole;
      
      const boxMat = new BABYLON.StandardMaterial('boxMat', scene);
      boxMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      lightBox.material = boxMat;
      
      // Create three lights (red, yellow, green)
      const lights: { mesh: BABYLON.Mesh; material: BABYLON.StandardMaterial; color: BABYLON.Color3 }[] = [];
      const lightPositions = [0.7, 0, -0.7];
      const lightColors = [
        new BABYLON.Color3(1, 0, 0),    // Red
        new BABYLON.Color3(1, 1, 0),    // Yellow
        new BABYLON.Color3(0, 1, 0)     // Green
      ];
      
      lightPositions.forEach((yPos, index) => {
        const light = BABYLON.MeshBuilder.CreateSphere(`light${index}`, { diameter: 0.5 }, scene);
        light.position.set(0, yPos, -0.41);
        light.parent = lightBox;
        
        const lightMat = new BABYLON.StandardMaterial(`lightMat${index}`, scene);
        lightMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        lightMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
        light.material = lightMat;
        lights.push({ mesh: light, material: lightMat, color: lightColors[index] });
      });
      
      // Animate traffic lights
      let currentLight = 2; // Start with green
      let timer = 0;
      const cycleTimes = [5000, 1500, 5000]; // Red, Yellow, Green durations
      
      scene.registerBeforeRender(() => {
        const deltaTime = engine.getDeltaTime();
        timer += deltaTime;
        
        if (timer > cycleTimes[currentLight]) {
          // Turn off current light
          lights[currentLight].material.emissiveColor = new BABYLON.Color3(0, 0, 0);
          
          // Move to next light
          currentLight = (currentLight + 1) % 3;
          if (currentLight === 1 && lights[2].material.emissiveColor.r > 0) {
            // Skip yellow when going from green to red
            currentLight = 0;
          }
          
          // Turn on new light
          lights[currentLight].material.emissiveColor = lights[currentLight].color;
          timer = 0;
        }
      });
      
      // Start with green light on
      lights[2].material.emissiveColor = lights[2].color;
      
      shadowGenerator.addShadowCaster(pole);
      pole.receiveShadows = true;
    };
    
    // Add traffic lights at major intersections
    const intersections = [
      { x: 0, z: 0 },      // Main intersection
      { x: -30, z: 0 },    // West intersection
      { x: 30, z: 0 },     // East intersection
      { x: 0, z: -30 },    // North intersection
      { x: 0, z: 30 },     // South intersection
      { x: -30, z: -30 },  // NW intersection
      { x: 30, z: -30 },   // NE intersection
      { x: -30, z: 30 },   // SW intersection
      { x: 30, z: 30 },    // SE intersection
      { x: -50, z: 0 },    // Far west
      { x: 50, z: 0 },     // Far east
      { x: 0, z: -50 },    // Far north
      { x: 0, z: 50 },     // Far south
    ];
    
    intersections.forEach(pos => {
      createTrafficLight(pos.x + 4, pos.z + 4);
      createTrafficLight(pos.x - 4, pos.z - 4);
    });
    
    // Add street furniture (benches, lamps, trees)
    const createStreetLamp = (x: number, z: number) => {
      const lampPost = BABYLON.MeshBuilder.CreateCylinder('lampPost', { diameter: 0.2, height: 8 }, scene);
      lampPost.position.set(x, 4, z);
      
      const lampArm = BABYLON.MeshBuilder.CreateBox('lampArm', { width: 2, height: 0.2, depth: 0.2 }, scene);
      lampArm.position.set(1, 3.8, 0);
      lampArm.parent = lampPost;
      
      const lampHead = BABYLON.MeshBuilder.CreateSphere('lampHead', { diameter: 0.8 }, scene);
      lampHead.position.set(2, 3.6, 0);
      lampHead.parent = lampPost;
      
      const lampMat = new BABYLON.StandardMaterial('lampMat', scene);
      lampMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
      lampMat.emissiveColor = new BABYLON.Color3(1, 0.9, 0.7);
      lampHead.material = lampMat;
      
      const postMat = new BABYLON.StandardMaterial('postMat', scene);
      postMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      lampPost.material = postMat;
      lampArm.material = postMat;
      
      // Add light source
      const light = new BABYLON.PointLight(`streetLight${x}_${z}`, new BABYLON.Vector3(x + 2, 7, z), scene);
      light.intensity = 0.5;
      light.diffuse = new BABYLON.Color3(1, 0.9, 0.7);
      
      shadowGenerator.addShadowCaster(lampPost);
      lampPost.receiveShadows = true;
    };
    
    // Add street lamps along major roads
    for (let i = -60; i <= 60; i += 20) {
      createStreetLamp(i, 5);
      createStreetLamp(i, -5);
      createStreetLamp(5, i);
      createStreetLamp(-5, i);
    }

    // Create parks with trees and benches
    const createPark = (x: number, z: number, width: number = 15, depth: number = 15) => {
      // Park ground
      const parkGround = BABYLON.MeshBuilder.CreateGround(`park${x}_${z}`, { width, height: depth }, scene);
      parkGround.position.set(x, 0.05, z);
      
      // Grass texture
      const grassMat = new BABYLON.PBRMaterial(`grassMat${x}_${z}`, scene);
      grassMat.albedoColor = new BABYLON.Color3(0.2, 0.6, 0.2);
      grassMat.roughness = 0.8;
      grassMat.metallic = 0;
      parkGround.material = grassMat;
      parkGround.receiveShadows = true;
      
      // Create trees
      const createTree = (treeX: number, treeZ: number) => {
        // Tree trunk
        const trunk = BABYLON.MeshBuilder.CreateCylinder('trunk', { 
          height: 4, 
          diameterBottom: 0.8, 
          diameterTop: 0.6 
        }, scene);
        trunk.position.set(x + treeX, 2, z + treeZ);
        
        const trunkMat = new BABYLON.StandardMaterial('trunkMat', scene);
        trunkMat.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.2);
        trunk.material = trunkMat;
        
        // Tree leaves (3 spheres for fuller look)
        for (let i = 0; i < 3; i++) {
          const leaves = BABYLON.MeshBuilder.CreateSphere('leaves', { diameter: 3 + Math.random() }, scene);
          leaves.position.set(
            x + treeX + (Math.random() - 0.5) * 1.5, 
            4.5 + i * 0.8, 
            z + treeZ + (Math.random() - 0.5) * 1.5
          );
          
          const leavesMat = new BABYLON.StandardMaterial('leavesMat', scene);
          leavesMat.diffuseColor = new BABYLON.Color3(0.1 + Math.random() * 0.1, 0.4 + Math.random() * 0.2, 0.1);
          leavesMat.specularColor = new BABYLON.Color3(0, 0, 0);
          leaves.material = leavesMat;
          
          shadowGenerator.addShadowCaster(leaves);
        }
        
        shadowGenerator.addShadowCaster(trunk);
        trunk.receiveShadows = true;
      };
      
      // Place trees randomly in park
      const treeCount = Math.floor(width * depth / 30);
      for (let i = 0; i < treeCount; i++) {
        createTree(
          (Math.random() - 0.5) * (width - 4),
          (Math.random() - 0.5) * (depth - 4)
        );
      }
      
      // Create benches
      const createBench = (benchX: number, benchZ: number, rotation: number = 0) => {
        const bench = BABYLON.MeshBuilder.CreateBox('bench', { width: 3, height: 0.5, depth: 1 }, scene);
        bench.position.set(x + benchX, 0.25, z + benchZ);
        bench.rotation.y = rotation;
        
        const backrest = BABYLON.MeshBuilder.CreateBox('backrest', { width: 3, height: 1, depth: 0.2 }, scene);
        backrest.position.set(0, 0.75, 0.4);
        backrest.parent = bench;
        
        const benchMat = new BABYLON.StandardMaterial('benchMat', scene);
        benchMat.diffuseColor = new BABYLON.Color3(0.5, 0.3, 0.2);
        bench.material = benchMat;
        backrest.material = benchMat;
        
        shadowGenerator.addShadowCaster(bench);
        bench.receiveShadows = true;
      };
      
      // Place benches
      createBench(-width/3, 0, 0);
      createBench(width/3, 0, Math.PI);
      
      // Walking paths
      const pathMat = new BABYLON.StandardMaterial(`pathMat${x}_${z}`, scene);
      pathMat.diffuseColor = new BABYLON.Color3(0.6, 0.5, 0.4);
      
      const path1 = BABYLON.MeshBuilder.CreateGround(`path1${x}_${z}`, { width: 2, height: depth }, scene);
      path1.position.set(x, 0.06, z);
      path1.material = pathMat;
      
      const path2 = BABYLON.MeshBuilder.CreateGround(`path2${x}_${z}`, { width, height: 2 }, scene);
      path2.position.set(x, 0.06, z);
      path2.material = pathMat;
    };
    
    // Create coffee shops
    const createCoffeeShop = (x: number, z: number) => {
      // Coffee shop building
      const shop = BABYLON.MeshBuilder.CreateBox('coffeeShop', { width: 6, height: 3, depth: 6 }, scene);
      shop.position.set(x, 1.5, z);
      
      const shopMat = new BABYLON.PBRMaterial('shopMat', scene);
      shopMat.albedoColor = new BABYLON.Color3(0.6, 0.4, 0.3);
      shopMat.metallic = 0.1;
      shopMat.roughness = 0.7;
      shop.material = shopMat;
      
      // Coffee shop sign
      const sign = BABYLON.MeshBuilder.CreatePlane('coffeeSign', { width: 4, height: 1 }, scene);
      sign.position.set(x, 3.5, z - 3.1);
      
      const signTexture = new BABYLON.DynamicTexture('signTexture', { width: 256, height: 64 }, scene);
      const signCtx = signTexture.getContext();
      signCtx.fillStyle = '#8B4513';
      signCtx.fillRect(0, 0, 256, 64);
      signCtx.font = 'bold 32px Arial';
      signCtx.fillStyle = 'white';
      (signCtx as any).textAlign = 'center';
      signCtx.fillText('☕ CAFÉ', 128, 42);
      signTexture.update();
      
      const signMat = new BABYLON.StandardMaterial('signMat', scene);
      signMat.diffuseTexture = signTexture;
      signMat.emissiveTexture = signTexture;
      signMat.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
      sign.material = signMat;
      
      // Outdoor seating
      const createTable = (tableX: number, tableZ: number) => {
        // Table
        const table = BABYLON.MeshBuilder.CreateCylinder('table', { diameter: 1.5, height: 0.8 }, scene);
        table.position.set(tableX, 0.4, tableZ);
        
        const tableMat = new BABYLON.StandardMaterial('tableMat', scene);
        tableMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        table.material = tableMat;
        
        // Umbrella
        const umbrellaPole = BABYLON.MeshBuilder.CreateCylinder('umbrellaPole', { diameter: 0.1, height: 2 }, scene);
        umbrellaPole.position.set(tableX, 1.4, tableZ);
        
        const umbrellaTop = BABYLON.MeshBuilder.CreateCylinder('umbrellaTop', { 
          diameterTop: 0.1, 
          diameterBottom: 2.5, 
          height: 0.5 
        }, scene);
        umbrellaTop.position.set(tableX, 2.2, tableZ);
        
        const umbrellaMat = new BABYLON.StandardMaterial('umbrellaMat', scene);
        umbrellaMat.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);
        umbrellaTop.material = umbrellaMat;
        umbrellaPole.material = tableMat;
        
        // Chairs
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const chair = BABYLON.MeshBuilder.CreateBox('chair', { width: 0.5, height: 0.5, depth: 0.5 }, scene);
          chair.position.set(
            tableX + Math.cos(angle) * 1.2,
            0.25,
            tableZ + Math.sin(angle) * 1.2
          );
          chair.material = tableMat;
        }
        
        shadowGenerator.addShadowCaster(table);
        shadowGenerator.addShadowCaster(umbrellaTop);
      };
      
      // Place outdoor tables
      createTable(x - 4, z - 4);
      createTable(x + 4, z - 4);
      createTable(x - 4, z + 4);
      createTable(x + 4, z + 4);
      
      shadowGenerator.addShadowCaster(shop);
      shop.receiveShadows = true;
    };
    
    // Create playgrounds
    const createPlayground = (x: number, z: number) => {
      // Playground ground with safety surface
      const playGround = BABYLON.MeshBuilder.CreateGround('playGround', { width: 12, height: 12 }, scene);
      playGround.position.set(x, 0.05, z);
      
      const playMat = new BABYLON.StandardMaterial('playMat', scene);
      playMat.diffuseColor = new BABYLON.Color3(0.9, 0.6, 0.3); // Rubber surface color
      playGround.material = playMat;
      
      // Swings
      const swingFrame = BABYLON.MeshBuilder.CreateBox('swingFrame', { width: 6, height: 0.2, depth: 0.2 }, scene);
      swingFrame.position.set(x - 3, 3, z);
      
      const swingPole1 = BABYLON.MeshBuilder.CreateCylinder('swingPole1', { diameter: 0.2, height: 3 }, scene);
      swingPole1.position.set(x - 6, 1.5, z);
      
      const swingPole2 = BABYLON.MeshBuilder.CreateCylinder('swingPole2', { diameter: 0.2, height: 3 }, scene);
      swingPole2.position.set(x, 1.5, z);
      
      const frameMat = new BABYLON.StandardMaterial('frameMat', scene);
      frameMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.8);
      swingFrame.material = frameMat;
      swingPole1.material = frameMat;
      swingPole2.material = frameMat;
      
      // Swing seats
      for (let i = 0; i < 2; i++) {
        const seat = BABYLON.MeshBuilder.CreateBox('swingSeat', { width: 0.5, height: 0.1, depth: 0.4 }, scene);
        seat.position.set(x - 4 + i * 2, 1, z);
        
        const seatMat = new BABYLON.StandardMaterial('seatMat', scene);
        seatMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        seat.material = seatMat;
        
        // Chains
        const chain1 = BABYLON.MeshBuilder.CreateCylinder('chain1', { diameter: 0.05, height: 2 }, scene);
        chain1.position.set(x - 4 + i * 2 - 0.2, 2, z);
        
        const chain2 = BABYLON.MeshBuilder.CreateCylinder('chain2', { diameter: 0.05, height: 2 }, scene);
        chain2.position.set(x - 4 + i * 2 + 0.2, 2, z);
        
        chain1.material = frameMat;
        chain2.material = frameMat;
      }
      
      // Slide
      const slideBase = BABYLON.MeshBuilder.CreateBox('slideBase', { width: 1, height: 2.5, depth: 4 }, scene);
      slideBase.position.set(x + 3, 1.25, z);
      slideBase.rotation.x = -Math.PI / 6;
      
      const slideMat = new BABYLON.StandardMaterial('slideMat', scene);
      slideMat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.1);
      slideBase.material = slideMat;
      
      // Slide ladder
      const ladder = BABYLON.MeshBuilder.CreateBox('ladder', { width: 0.8, height: 3, depth: 0.2 }, scene);
      ladder.position.set(x + 3, 1.5, z + 2);
      ladder.material = frameMat;
      
      // Sandbox
      const sandbox = BABYLON.MeshBuilder.CreateBox('sandbox', { width: 4, height: 0.3, depth: 4 }, scene);
      sandbox.position.set(x, 0.15, z - 4);
      
      const sandboxMat = new BABYLON.StandardMaterial('sandboxMat', scene);
      sandboxMat.diffuseColor = new BABYLON.Color3(0.9, 0.8, 0.6);
      sandbox.material = sandboxMat;
      
      shadowGenerator.addShadowCaster(swingFrame);
      shadowGenerator.addShadowCaster(slideBase);
    };
    
    // Create swimming pools
    const createSwimmingPool = (x: number, z: number) => {
      // Pool container
      const poolContainer = BABYLON.MeshBuilder.CreateBox('poolContainer', { width: 15, height: 0.1, depth: 8 }, scene);
      poolContainer.position.set(x, 0.05, z);
      
      const poolEdgeMat = new BABYLON.StandardMaterial('poolEdgeMat', scene);
      poolEdgeMat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
      poolContainer.material = poolEdgeMat;
      
      // Pool water
      const water = BABYLON.MeshBuilder.CreateGround('water', { width: 14, height: 7 }, scene);
      water.position.set(x, -0.5, z);
      
      const waterMat = new BABYLON.PBRMaterial('waterMat', scene);
      waterMat.albedoColor = new BABYLON.Color3(0.1, 0.5, 0.8);
      waterMat.metallic = 0.0;
      waterMat.roughness = 0.1;
      waterMat.alpha = 0.8;
      waterMat.transparencyMode = 2;
      water.material = waterMat;
      
      // Pool depth markers
      const depthTexture = new BABYLON.DynamicTexture('depthTexture', { width: 512, height: 512 }, scene);
      const depthCtx = depthTexture.getContext();
      depthCtx.fillStyle = '#ffffff';
      depthCtx.fillRect(0, 0, 512, 512);
      
      // Add wave pattern
      depthCtx.strokeStyle = '#4682B4';
      depthCtx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        depthCtx.beginPath();
        depthCtx.moveTo(0, i * 50);
        for (let x = 0; x < 512; x += 10) {
          depthCtx.lineTo(x, i * 50 + Math.sin(x * 0.05) * 10);
        }
        depthCtx.stroke();
      }
      depthTexture.update();
      waterMat.albedoTexture = depthTexture;
      
      // Lounge chairs
      const createLoungeChair = (chairX: number, chairZ: number) => {
        const chair = BABYLON.MeshBuilder.CreateBox('loungeChair', { width: 0.8, height: 0.3, depth: 2 }, scene);
        chair.position.set(chairX, 0.15, chairZ);
        
        const backrest = BABYLON.MeshBuilder.CreateBox('backrest', { width: 0.8, height: 1, depth: 0.1 }, scene);
        backrest.position.set(0, 0.35, -0.9);
        backrest.rotation.x = -Math.PI / 8;
        backrest.parent = chair;
        
        const chairMat = new BABYLON.StandardMaterial('chairMat', scene);
        chairMat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        chair.material = chairMat;
        backrest.material = chairMat;
        
        shadowGenerator.addShadowCaster(chair);
      };
      
      // Place lounge chairs around pool
      for (let i = 0; i < 4; i++) {
        createLoungeChair(x - 10, z - 3 + i * 2);
        createLoungeChair(x + 10, z - 3 + i * 2);
      }
      
      // Diving board
      const divingBoard = BABYLON.MeshBuilder.CreateBox('divingBoard', { width: 0.5, height: 0.1, depth: 3 }, scene);
      divingBoard.position.set(x, 1, z - 5);
      
      const boardMat = new BABYLON.StandardMaterial('boardMat', scene);
      boardMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.7);
      divingBoard.material = boardMat;
      
      // Pool ladder
      const ladder1 = BABYLON.MeshBuilder.CreateBox('poolLadder1', { width: 0.05, height: 1.5, depth: 0.05 }, scene);
      ladder1.position.set(x - 6, 0.25, z - 3.5);
      
      const ladder2 = BABYLON.MeshBuilder.CreateBox('poolLadder2', { width: 0.05, height: 1.5, depth: 0.05 }, scene);
      ladder2.position.set(x - 6.5, 0.25, z - 3.5);
      
      const ladderMat = new BABYLON.StandardMaterial('ladderMat', scene);
      ladderMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
      ladder1.material = ladderMat;
      ladder2.material = ladderMat;
    };
    
    // Place parks strategically
    createPark(-35, -35, 20, 20); // Tech district park
    createPark(35, -35, 15, 15);   // Residential area park
    createPark(-35, 35, 18, 18);   // Green district park
    createPark(35, 35, 12, 12);    // Healthcare district park
    createPark(0, -60, 25, 15);    // Entertainment district park
    createPark(0, 60, 20, 20);     // Central park
    
    // Place coffee shops
    createCoffeeShop(-15, -40);  // Near entertainment
    createCoffeeShop(15, -40);   // Near university
    createCoffeeShop(-45, 0);    // Tech district
    createCoffeeShop(45, 0);     // Residential area
    createCoffeeShop(0, 45);     // Green district
    createCoffeeShop(-25, 20);   // Financial district
    
    // Place playgrounds
    createPlayground(-30, -40);  // Near residential
    createPlayground(30, -40);   // Near school
    createPlayground(45, 20);    // Community center
    createPlayground(-45, 20);   // Tech campus
    createPlayground(0, 55);     // Central area
    
    // Place swimming pools
    createSwimmingPool(45, -10);  // Residential towers
    createSwimmingPool(-45, -10); // Hotel area
    createSwimmingPool(0, -45);   // Sports complex
    createSwimmingPool(25, 40);   // Wellness center

    // Create buildings
    BUILDING_DATA.buildings.forEach((building) => {
      const height = building.floors * 3;
      const width = 6 + Math.random() * 2; // Vary building widths
      const depth = 6 + Math.random() * 2; // Vary building depths
      
      // Create more complex building geometry
      const buildingMesh = BABYLON.MeshBuilder.CreateBox(
        building.id,
        { width, height, depth },
        scene
      );
      
      // Create PBR material for realistic appearance
      const buildingMaterial = new BABYLON.PBRMaterial(`${building.id}Mat`, scene);
      
      // Base color with variation
      const color = BABYLON.Color3.FromHexString(building.color);
      buildingMaterial.albedoColor = color;
      buildingMaterial.metallic = 0.1; // Slight metallic for glass/steel buildings
      buildingMaterial.roughness = 0.4; // Some roughness for realism
      buildingMaterial.environmentIntensity = 0.3;
      
      // Create realistic building texture
      const buildingTexture = new BABYLON.DynamicTexture(`${building.id}Texture`, { width: 1024, height: 1024 }, scene);
      const ctx = buildingTexture.getContext();
      
      // Create gradient background for building face
      const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
      gradient.addColorStop(0, '#2a2a2a');
      gradient.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Add concrete/metal texture pattern
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
        ctx.lineTo(Math.random() * 1024, Math.random() * 1024);
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      
      // Draw realistic windows with reflections
      const windowRows = Math.floor(building.floors * 3);
      const windowCols = 8;
      const windowWidth = 80;
      const windowHeight = 50;
      const windowSpacingX = (1024 - windowCols * windowWidth) / (windowCols + 1);
      const windowSpacingY = (1024 - windowRows * windowHeight) / (windowRows + 1);
      
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const x = windowSpacingX + col * (windowWidth + windowSpacingX);
          const y = windowSpacingY + row * (windowHeight + windowSpacingY);
          
          // Window frame
          ctx.fillStyle = '#333';
          ctx.fillRect(x - 2, y - 2, windowWidth + 4, windowHeight + 4);
          
          // Window glass with reflection gradient
          const windowGradient = ctx.createLinearGradient(x, y, x + windowWidth, y + windowHeight);
          const isLit = Math.random() > 0.3;
          
          if (isLit) {
            // Lit window with warm glow
            windowGradient.addColorStop(0, '#FFE4B5');
            windowGradient.addColorStop(0.5, '#FFA500');
            windowGradient.addColorStop(1, '#FF8C00');
          } else {
            // Dark window with reflection
            windowGradient.addColorStop(0, '#1a3a52');
            windowGradient.addColorStop(0.5, '#0f2940');
            windowGradient.addColorStop(1, '#051a2e');
          }
          
          ctx.fillStyle = windowGradient;
          ctx.fillRect(x, y, windowWidth, windowHeight);
          
          // Add subtle reflection line
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
      
      // Add normal map for surface detail
      const normalTexture = new BABYLON.DynamicTexture(`${building.id}Normal`, { width: 512, height: 512 }, scene);
      const normalCtx = normalTexture.getContext();
      normalCtx.fillStyle = '#8080ff'; // Neutral normal map color
      normalCtx.fillRect(0, 0, 512, 512);
      
      // Add some noise for surface imperfections
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 3;
        normalCtx.fillStyle = `rgb(${128 + Math.random() * 20}, ${128 + Math.random() * 20}, 255)`;
        normalCtx.fillRect(x, y, size, size);
      }
      normalTexture.update();
      buildingMaterial.bumpTexture = normalTexture;
      buildingMaterial.invertNormalMapX = true;
      buildingMaterial.invertNormalMapY = true;
      
      buildingMesh.material = buildingMaterial;

      // Add building label
      const label = BABYLON.MeshBuilder.CreatePlane(`${building.id}Label`, { width: 8, height: 2 }, scene);
      label.position = buildingMesh.position.clone();
      label.position.y = height + 2;
      label.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
      
      const labelTexture = new BABYLON.DynamicTexture(`${building.id}LabelTex`, { width: 256, height: 64 }, scene);
      const labelCtx = labelTexture.getContext();
      labelCtx.font = '24px Arial';
      labelCtx.fillStyle = 'white';
      (labelCtx as any).textAlign = 'center';
      labelCtx.fillText(building.name, 128, 32);
      labelCtx.font = '18px Arial';
      labelCtx.fillText(`${building.occupancy}% occupied`, 128, 54);
      labelTexture.update();
      
      const labelMaterial = new BABYLON.StandardMaterial(`${building.id}LabelMat`, scene);
      labelMaterial.diffuseTexture = labelTexture;
      labelMaterial.emissiveTexture = labelTexture;
      labelMaterial.backFaceCulling = false;
      labelMaterial.disableLighting = true;
      label.material = labelMaterial;

      // Add click interaction
      buildingMesh.actionManager = new BABYLON.ActionManager(scene);
      buildingMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          () => setSelectedBuilding(building.id)
        )
      );

      // Add glow effect on hover
      buildingMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOverTrigger,
          () => {
            buildingMaterial.emissiveColor = color.scale(0.3);
          }
        )
      );
      buildingMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOutTrigger,
          () => {
            buildingMaterial.emissiveColor = color.scale(0.1);
          }
        )
      );
    });

    // Create IoT sensors
    BUILDING_DATA.sensors.forEach((sensor, index) => {
      // Sensor sphere
      const sensorSphere = BABYLON.MeshBuilder.CreateSphere(
        `sensor${sensor.id}`,
        { diameter: 2 },
        scene
      );
      
      const sensorMaterial = new BABYLON.StandardMaterial(`sensor${sensor.id}Mat`, scene);
      const statusColors = {
        optimal: new BABYLON.Color3(0, 1, 0),
        good: new BABYLON.Color3(0.5, 1, 0),
        normal: new BABYLON.Color3(1, 1, 0),
        warning: new BABYLON.Color3(1, 0.5, 0),
        critical: new BABYLON.Color3(1, 0, 0)
      };
      
      sensorMaterial.diffuseColor = statusColors[sensor.status as keyof typeof statusColors];
      sensorMaterial.emissiveColor = statusColors[sensor.status as keyof typeof statusColors].scale(0.5);
      sensorMaterial.specularPower = 32;
      sensorSphere.material = sensorMaterial;
      
      sensorSphere.position.x = sensor.x;
      sensorSphere.position.y = sensor.y;
      sensorSphere.position.z = sensor.z;

      // Pulsing animation
      scene.registerBeforeRender(() => {
        const time = Date.now() * 0.001;
        const scale = 1 + Math.sin(time * 2 + index) * 0.2;
        sensorSphere.scaling = new BABYLON.Vector3(scale, scale, scale);
        sensorMaterial.emissiveColor = statusColors[sensor.status as keyof typeof statusColors]
          .scale(0.3 + Math.sin(time * 3 + index) * 0.2);
      });

      // Sensor label
      const sensorLabel = BABYLON.MeshBuilder.CreatePlane(`sensor${sensor.id}Label`, { width: 6, height: 2 }, scene);
      sensorLabel.position = sensorSphere.position.clone();
      sensorLabel.position.y += 2;
      sensorLabel.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
      
      const sensorLabelTexture = new BABYLON.DynamicTexture(`sensor${sensor.id}LabelTex`, { width: 256, height: 64 }, scene);
      const sensorLabelCtx = sensorLabelTexture.getContext();
      sensorLabelCtx.font = '20px Arial';
      sensorLabelCtx.fillStyle = 'white';
      (sensorLabelCtx as any).textAlign = 'center';
      sensorLabelCtx.fillText(sensor.type, 128, 28);
      sensorLabelCtx.font = '16px Arial';
      sensorLabelCtx.fillText(sensor.value, 128, 50);
      sensorLabelTexture.update();
      
      const sensorLabelMaterial = new BABYLON.StandardMaterial(`sensor${sensor.id}LabelMat`, scene);
      sensorLabelMaterial.diffuseTexture = sensorLabelTexture;
      sensorLabelMaterial.emissiveTexture = sensorLabelTexture;
      sensorLabelMaterial.backFaceCulling = false;
      sensorLabelMaterial.disableLighting = true;
      sensorLabel.material = sensorLabelMaterial;

      // Connect sensors with data streams (particle effects)
      if (index > 0) {
        const prevSensor = BUILDING_DATA.sensors[index - 1];
        const particleSystem = new BABYLON.ParticleSystem(`particles${sensor.id}`, 50, scene);
        // Create a simple white texture for particles
        const particleTexture = new BABYLON.DynamicTexture('particleTexture', { width: 16, height: 16 }, scene);
        const ctx = particleTexture.getContext();
        ctx.beginPath();
        ctx.arc(8, 8, 7, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        particleTexture.update();
        particleSystem.particleTexture = particleTexture;
        
        particleSystem.emitter = new BABYLON.Vector3(prevSensor.x, prevSensor.y, prevSensor.z);
        particleSystem.direction1 = new BABYLON.Vector3(
          sensor.x - prevSensor.x,
          sensor.y - prevSensor.y,
          sensor.z - prevSensor.z
        ).normalize();
        particleSystem.direction2 = particleSystem.direction1;
        
        particleSystem.minLifeTime = 2;
        particleSystem.maxLifeTime = 3;
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.3;
        particleSystem.emitRate = 10;
        
        particleSystem.color1 = new BABYLON.Color4(0, 1, 1, 1);
        particleSystem.color2 = new BABYLON.Color4(0, 0.5, 1, 0.5);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0);
        
        particleSystem.start();
      }
    });

    // Create underground parking structure
    const parkingStructure = BABYLON.MeshBuilder.CreateBox(
      'parkingStructure',
      { width: 30, height: 12, depth: 20 },
      scene
    );
    parkingStructure.position.x = -35;
    parkingStructure.position.y = -6;
    parkingStructure.position.z = 0;
    
    const parkingMaterial = new BABYLON.StandardMaterial('parkingMat', scene);
    parkingMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    parkingMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    parkingMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    parkingStructure.material = parkingMaterial;

    // Parking levels visualization
    BUILDING_DATA.parkingLevels.forEach((level, index) => {
      const levelPlane = BABYLON.MeshBuilder.CreatePlane(
        `parkingLevel${index}`,
        { width: 28, height: 18 },
        scene
      );
      levelPlane.position.x = -35;
      levelPlane.position.y = level.y;
      levelPlane.position.z = 0;
      levelPlane.rotation.x = Math.PI / 2;
      
      const levelTexture = new BABYLON.DynamicTexture(`parkingLevel${index}Tex`, { width: 512, height: 256 }, scene);
      const levelCtx = levelTexture.getContext();
      
      // Draw parking spots
      levelCtx.fillStyle = '#222222';
      levelCtx.fillRect(0, 0, 512, 256);
      
      const spotsPerRow = 10;
      // const rows = Math.ceil(level.total / spotsPerRow);
      const spotWidth = 40;
      const spotHeight = 20;
      
      for (let i = 0; i < level.total; i++) {
        const row = Math.floor(i / spotsPerRow);
        const col = i % spotsPerRow;
        const x = 20 + col * (spotWidth + 10);
        const y = 20 + row * (spotHeight + 10);
        
        levelCtx.fillStyle = i < level.occupied ? '#ff4444' : '#44ff44';
        levelCtx.fillRect(x, y, spotWidth, spotHeight);
        
        if (i < level.occupied) {
          levelCtx.fillStyle = '#ffffff';
          levelCtx.font = '12px Arial';
          (levelCtx as any).textAlign = 'center';
          levelCtx.fillText('🚗', x + spotWidth / 2, y + spotHeight / 2 + 4);
        }
      }
      
      // Level info
      levelCtx.fillStyle = '#ffffff';
      levelCtx.font = '20px Arial';
      (levelCtx as any).textAlign = 'left';
      levelCtx.fillText(`${level.level}: ${level.occupied}/${level.total}`, 10, 240);
      
      levelTexture.update();
      
      const levelMaterial = new BABYLON.StandardMaterial(`parkingLevel${index}Mat`, scene);
      levelMaterial.diffuseTexture = levelTexture;
      levelMaterial.emissiveTexture = levelTexture;
      levelMaterial.backFaceCulling = false;
      levelMaterial.disableLighting = true;
      levelMaterial.alpha = 0.8;
      levelPlane.material = levelMaterial;
    });

    // Animation
    let animationFrame = 0;
    scene.registerBeforeRender(() => {
      if (isAnimating) {
        camera.alpha += 0.002;
        animationFrame++;
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
  }, [isActive, isAnimating]);

  const resetCamera = () => {
    if (sceneRef.current) {
      const camera = sceneRef.current.activeCamera as BABYLON.ArcRotateCamera;
      camera.alpha = -Math.PI / 2;
      camera.beta = Math.PI / 3;
      camera.radius = 80;
      camera.target = new BABYLON.Vector3(0, 0, 0);
    }
  };

  const zoomIn = () => {
    if (sceneRef.current) {
      const camera = sceneRef.current.activeCamera as BABYLON.ArcRotateCamera;
      camera.radius = Math.max(camera.radius - 10, camera.lowerRadiusLimit || 20);
    }
  };

  const zoomOut = () => {
    if (sceneRef.current) {
      const camera = sceneRef.current.activeCamera as BABYLON.ArcRotateCamera;
      camera.radius = Math.min(camera.radius + 10, camera.upperRadiusLimit || 150);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Glasses className="w-5 h-5 text-purple-600" />
          3D Smart Building Visualization (Babylon.js)
        </CardTitle>
        <CardDescription>
          Advanced 3D visualization with realistic lighting, textures, and interactive features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={(e) => {
                e.preventDefault();
                console.log('Building3DView: Enter 3D Mode button clicked!', { isActive, onToggle });
                alert('Building3DView: Button clicked! Current isActive: ' + isActive);
                if (onToggle) {
                  onToggle();
                  console.log('Building3DView: onToggle called successfully');
                } else {
                  console.error('Building3DView: onToggle is not defined!');
                }
              }} 
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
                <Button variant="outline" onClick={() => setIsAnimating(!isAnimating)} className="flex items-center gap-2">
                  {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isAnimating ? 'Pause' : 'Play'}
                </Button>
                <Button variant="outline" onClick={resetCamera} className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  Reset View
                </Button>
                <Button variant="outline" onClick={zoomIn} className="flex items-center gap-2">
                  <ZoomIn className="w-4 h-4" />
                  Zoom In
                </Button>
                <Button variant="outline" onClick={zoomOut} className="flex items-center gap-2">
                  <ZoomOut className="w-4 h-4" />
                  Zoom Out
                </Button>
              </>
            )}
          </div>

          {/* 3D Canvas */}
          {isActive && (
            <div className="space-y-4">
              <div className="relative w-full h-[700px] border rounded-lg overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900">
                <canvas ref={canvasRef} className="w-full h-full" />
                
                {/* Overlay info */}
                <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-lg backdrop-blur-sm">
                  <div className="text-sm font-medium mb-2">3D Building Controls</div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <Move className="w-3 h-3" />
                      Drag to rotate
                    </div>
                    <div>• Scroll to zoom</div>
                    <div>• Click buildings for details</div>
                    <div>• Real-time sensor data</div>
                  </div>
                </div>

                {/* Selected building info */}
                {selectedBuilding && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-lg backdrop-blur-sm max-w-xs">
                    {(() => {
                      const building = BUILDING_DATA.buildings.find(b => b.id === selectedBuilding);
                      if (!building) return null;
                      
                      return (
                        <>
                          <div className="text-sm font-medium mb-2">{building.name}</div>
                          <div className="text-xs space-y-1">
                            <div>Type: {building.type}</div>
                            <div>Floors: {building.floors}</div>
                            <div>Occupancy: {building.occupancy}%</div>
                            <div className="pt-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setSelectedBuilding(null)}
                                className="text-xs"
                              >
                                Close
                              </Button>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Data panels */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Buildings
                  </div>
                  <div className="text-blue-600 text-xs mt-1">20 smart buildings</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    IoT Sensors
                  </div>
                  <div className="text-green-600 text-xs mt-1">12 active sensors</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-800 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Parking
                  </div>
                  <div className="text-purple-600 text-xs mt-1">4 levels, 680 spots</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-medium text-orange-800 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Energy
                  </div>
                  <div className="text-orange-600 text-xs mt-1">1247 kW usage</div>
                </div>
              </div>
            </div>
          )}

          {/* Welcome screen */}
          {!isActive && (
            <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
              <Glasses className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-semibold mb-2">Advanced 3D Smart Building Experience</h3>
              <p className="text-gray-600 mb-4">
                Explore the smart city with realistic 3D graphics powered by Babylon.js
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-2xl mb-1">🏢</div>
                  <div>Interactive Buildings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">📡</div>
                  <div>Real-time Sensors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🚗</div>
                  <div>Smart Parking</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}