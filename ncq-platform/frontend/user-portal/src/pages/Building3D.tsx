import { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { GridMaterial } from '@babylonjs/materials';
import { 
  Play, 
  Pause, 
  Settings, 
  Activity,
  Thermometer,
  Zap,
  Shield,
  Users,
  Wind,
  Lightbulb,
  Wifi,
  CheckCircle,
  Camera,
  Sun,
  Moon,
  Home,
  Building2
} from 'lucide-react';

// Natural environment simulation data with eco-structures and wildlife sensors
const NATURAL_ENVIRONMENT_DATA = {
  structures: [
    { 
      id: 'visitor_center', name: 'Nature Visitor Center', type: 'wooden_lodge', 
      color: '#8B4513', visitors: 45, capacity: 80, floors: 2, 
      x: -40, z: -30, width: 15, depth: 12, 
      systems: { climate: 'optimal', lighting: 'natural', security: 'active', maintenance: 'normal' }
    },
    { 
      id: 'observatory', name: 'Forest Observatory', type: 'stone_tower', 
      color: '#696969', visitors: 12, capacity: 20, floors: 8, 
      x: 40, z: -30, width: 8, depth: 8, 
      systems: { climate: 'optimal', lighting: 'minimal', security: 'active', maintenance: 'normal' }
    },
    { 
      id: 'greenhouse', name: 'Botanical Greenhouse', type: 'glass_structure', 
      color: '#228B22', visitors: 28, capacity: 50, floors: 1, 
      x: -40, z: 30, width: 20, depth: 15, 
      systems: { climate: 'controlled', lighting: 'optimal', security: 'active', maintenance: 'high' }
    },
    { 
      id: 'research_cabin', name: 'Wildlife Research Station', type: 'wooden_cabin', 
      color: '#CD853F', visitors: 8, capacity: 15, floors: 1, 
      x: 40, z: 30, width: 12, depth: 10, 
      systems: { climate: 'normal', lighting: 'minimal', security: 'high', maintenance: 'normal' }
    },
    { 
      id: 'amphitheater', name: 'Natural Amphitheater', type: 'stone_structure', 
      color: '#A0522D', visitors: 120, capacity: 200, floors: 1, 
      x: 0, z: 0, width: 25, depth: 20, 
      systems: { climate: 'natural', lighting: 'ambient', security: 'active', maintenance: 'low' }
    }
  ],
  sensors: [
    { id: 'temp_01', type: 'temperature', value: 18.5, unit: '°C', status: 'optimal', x: -35, y: 8, z: -25, area: 'visitor_center' },
    { id: 'humidity_01', type: 'humidity', value: 65, unit: '%', status: 'normal', x: 35, y: 15, z: -25, area: 'observatory' },
    { id: 'air_01', type: 'air_quality', value: 95, unit: 'AQI', status: 'excellent', x: -35, y: 12, z: 25, area: 'greenhouse' },
    { id: 'wildlife_01', type: 'wildlife_activity', value: 'High', unit: '', status: 'active', x: 35, y: 8, z: 25, area: 'research_cabin' },
    { id: 'soil_01', type: 'soil_moisture', value: 72, unit: '%', status: 'optimal', x: 0, y: 5, z: 0, area: 'amphitheater' },
    { id: 'wind_01', type: 'wind_speed', value: 12, unit: 'km/h', status: 'gentle', x: 0, y: 20, z: -60, area: 'weather_station' },
    { id: 'light_01', type: 'sunlight', value: 85, unit: '%', status: 'bright', x: 20, y: 25, z: 20, area: 'canopy' },
    { id: 'water_01', type: 'water_quality', value: 'Pure', unit: '', status: 'excellent', x: -20, y: 3, z: -40, area: 'stream' }
  ]
};

export default function Building3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);
  const [currentView, setCurrentView] = useState('overview');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isDayMode, setIsDayMode] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [systemsData] = useState(NATURAL_ENVIRONMENT_DATA);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('Building3D: Initializing enhanced 3D scene...');

    const canvas = canvasRef.current;
    
    // WebGL check
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('Building3D: WebGL not supported!');
      return;
    }

    const engine = new BABYLON.Engine(canvas, true, { 
      preserveDrawingBuffer: true, 
      stencil: true,
      antialias: true,
      adaptToDeviceRatio: true 
    });
    engineRef.current = engine;

    // Enhanced scene setup
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = isDayMode ? 
      new BABYLON.Color4(0.87, 0.92, 0.98, 1) : 
      new BABYLON.Color4(0.02, 0.02, 0.08, 1);

    // Advanced camera with smooth controls - more distant aerial view
    const camera = new BABYLON.ArcRotateCamera(
      'mainCamera',
      -Math.PI / 6,
      Math.PI / 4,
      150,
      new BABYLON.Vector3(0, 10, 0),
      scene
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 30;
    camera.pinchPrecision = 150;
    camera.panningSensibility = 1200;
    camera.setTarget(new BABYLON.Vector3(0, 10, 0));
    camera.lowerRadiusLimit = 50;
    camera.upperRadiusLimit = 300;

    // Enhanced lighting system
    const hemisphericLight = new BABYLON.HemisphericLight(
      'hemisphericLight', 
      new BABYLON.Vector3(0, 1, 0), 
      scene
    );
    hemisphericLight.intensity = isDayMode ? 0.8 : 0.3;

    const directionalLight = new BABYLON.DirectionalLight(
      'directionalLight',
      new BABYLON.Vector3(-1, -1, -1),
      scene
    );
    directionalLight.intensity = isDayMode ? 1.2 : 0.4;
    directionalLight.position = new BABYLON.Vector3(20, 40, 20);

    // Natural ground with rich ecosystem texture
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 300, height: 300 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
    
    // Create natural ground texture with grass, soil, and stone
    const groundTexture = new BABYLON.DynamicTexture('groundTexture', 2048, scene);
    const groundCtx = groundTexture.getContext();
    
    // Ultra-realistic natural terrain base - layered soil and organic matter
    const terrainGradient = groundCtx.createRadialGradient(1024, 1024, 0, 1024, 1024, 1024);
    terrainGradient.addColorStop(0, isDayMode ? '#5a6b3a' : '#3a4528');
    terrainGradient.addColorStop(0.7, isDayMode ? '#4a5c2a' : '#2a3518');
    terrainGradient.addColorStop(1, isDayMode ? '#3a4820' : '#1a2510');
    groundCtx.fillStyle = terrainGradient;
    groundCtx.fillRect(0, 0, 2048, 2048);
    
    // Create realistic soil texture with organic particles
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const size = 1 + Math.random() * 3;
      const soilVariation = 0.4 + Math.random() * 0.6;
      
      groundCtx.fillStyle = isDayMode ? 
        `rgba(${soilVariation * 101}, ${soilVariation * 67}, ${soilVariation * 33}, ${0.3 + Math.random() * 0.4})` :
        `rgba(${soilVariation * 80}, ${soilVariation * 50}, ${soilVariation * 25}, ${0.4 + Math.random() * 0.3})`;
      
      groundCtx.beginPath();
      groundCtx.arc(x, y, size, 0, Math.PI * 2);
      groundCtx.fill();
    }
    
    // Realistic grass patches with varied density and seasonal color
    for (let i = 0; i < 1200; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const size = 8 + Math.random() * 25;
      const density = Math.random();
      
      // Seasonal grass color variation
      const seasonalFactor = isDayMode ? (0.8 + Math.random() * 0.4) : (0.5 + Math.random() * 0.3);
      const grassR = Math.floor(30 + density * 50) * seasonalFactor;
      const grassG = Math.floor(80 + density * 80) * seasonalFactor;
      const grassB = Math.floor(20 + density * 40) * seasonalFactor;
      
      // Create gradient for grass patch depth
      const grassGradient = groundCtx.createRadialGradient(x, y, 0, x, y, size);
      grassGradient.addColorStop(0, `rgba(${grassR}, ${grassG}, ${grassB}, 0.9)`);
      grassGradient.addColorStop(0.7, `rgba(${grassR * 0.8}, ${grassG * 0.8}, ${grassB * 0.8}, 0.6)`);
      grassGradient.addColorStop(1, `rgba(${grassR * 0.6}, ${grassG * 0.6}, ${grassB * 0.6}, 0.2)`);
      
      groundCtx.fillStyle = grassGradient;
      groundCtx.beginPath();
      groundCtx.arc(x, y, size, 0, Math.PI * 2);
      groundCtx.fill();
      
      // Add individual grass blade details for close patches
      if (size > 15 && Math.random() > 0.7) {
        for (let j = 0; j < 8; j++) {
          const bladeX = x + (Math.random() - 0.5) * size;
          const bladeY = y + (Math.random() - 0.5) * size;
          const bladeLength = 3 + Math.random() * 6;
          
          groundCtx.strokeStyle = `rgba(${grassR * 1.2}, ${grassG * 1.2}, ${grassB * 1.2}, 0.7)`;
          groundCtx.lineWidth = 1;
          groundCtx.beginPath();
          groundCtx.moveTo(bladeX, bladeY);
          groundCtx.lineTo(bladeX + (Math.random() - 0.5) * 2, bladeY - bladeLength);
          groundCtx.stroke();
        }
      }
    }
    
    // Natural walking paths with realistic stone and dirt mixture
    for (let i = 0; i < 12; i++) {
      const startX = Math.random() * 2048;
      const startY = Math.random() * 2048;
      const endX = Math.random() * 2048;
      const endY = Math.random() * 2048;
      
      // Create curved natural path
      const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 200;
      const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 200;
      
      // Path base - compacted earth
      groundCtx.strokeStyle = isDayMode ? '#8B7355' : '#5D4E42';
      groundCtx.lineWidth = 20 + Math.random() * 15;
      (groundCtx as any).lineCap = 'round';
      
      groundCtx.beginPath();
      groundCtx.moveTo(startX, startY);
      groundCtx.quadraticCurveTo(midX, midY, endX, endY
      );
      groundCtx.stroke();
    }
    
    // Add rocky outcrops and stone patches
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const size = 30 + Math.random() * 50;
      
      groundCtx.fillStyle = isDayMode ? '#708090' : '#556B7A';
      groundCtx.beginPath();
      
      // Create irregular stone shapes
      const sides = 6 + Math.floor(Math.random() * 4);
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2;
        const radius = size * (0.7 + Math.random() * 0.6);
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        
        if (j === 0) groundCtx.moveTo(px, py);
        else groundCtx.lineTo(px, py);
      }
      groundCtx.closePath();
      groundCtx.fill();
    }
    
    // Add soil texture details
    for (let x = 0; x < 2048; x += 4) {
      for (let y = 0; y < 2048; y += 4) {
        if (Math.random() > 0.7) {
          const brown = 0.4 + Math.random() * 0.3;
          groundCtx.fillStyle = `rgb(${brown * 120}, ${brown * 80}, ${brown * 40})`;
          groundCtx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
        }
      }
    }
    
    groundTexture.update();
    groundMaterial.diffuseTexture = groundTexture;
    groundMaterial.specularColor = new BABYLON.Color3(0.2, 0.25, 0.2);
    ground.material = groundMaterial;

    // Grid overlay
    const gridMaterial = new GridMaterial('gridMaterial', scene);
    gridMaterial.majorUnitFrequency = 10;
    gridMaterial.minorUnitVisibility = 0.3;
    gridMaterial.gridRatio = 1;
    gridMaterial.mainColor = isDayMode ? 
      new BABYLON.Color3(0.6, 0.6, 0.6) : 
      new BABYLON.Color3(0.3, 0.3, 0.3);
    gridMaterial.lineColor = isDayMode ? 
      new BABYLON.Color3(0.8, 0.8, 0.8) : 
      new BABYLON.Color3(0.5, 0.5, 0.5);
    gridMaterial.opacity = 0.8;

    const gridGround = BABYLON.MeshBuilder.CreateGround('gridGround', { width: 200, height: 200 }, scene);
    gridGround.material = gridMaterial;
    gridGround.position.y = 0.01;

    // Create sophisticated buildings with realistic textures
    const buildingMeshes: { [key: string]: BABYLON.Mesh } = {};
    
    // Create ultra-realistic natural materials with advanced procedural textures
    const createNaturalMaterial = (type: string, color: string, scene: BABYLON.Scene) => {
      const material = new BABYLON.StandardMaterial(`material_${type}_${Date.now()}`, scene);
      material.diffuseColor = BABYLON.Color3.FromHexString(color);
      
      // Create high-resolution texture for realism
      const textureSize = 1024;
      const dynamicTexture = new BABYLON.DynamicTexture(`texture_${type}`, textureSize, scene);
      const ctx = dynamicTexture.getContext();
      
      switch (type) {
        case 'wooden_lodge':
        case 'wooden_cabin':
          // Ultra-realistic wood texture with detailed grain
          const woodBase = BABYLON.Color3.FromHexString(color);
          
          // Base wood color with natural variations
          ctx.fillStyle = `rgb(${woodBase.r * 255}, ${woodBase.g * 255}, ${woodBase.b * 255})`;
          ctx.fillRect(0, 0, textureSize, textureSize);
          
          // Advanced wood grain simulation
          for (let x = 0; x < textureSize; x += 4) {
            for (let y = 0; y < textureSize; y += 1) {
              const grainIntensity = Math.sin(y * 0.02) * 0.3 + Math.sin(y * 0.008) * 0.2;
              const noiseVariation = (Math.random() - 0.5) * 0.4;
              const totalVariation = grainIntensity + noiseVariation;
              
              const woodR = Math.max(0, Math.min(255, (woodBase.r * 255) + totalVariation * 80));
              const woodG = Math.max(0, Math.min(255, (woodBase.g * 255) + totalVariation * 50));
              const woodB = Math.max(0, Math.min(255, (woodBase.b * 255) + totalVariation * 30));
              
              ctx.fillStyle = `rgb(${woodR}, ${woodG}, ${woodB})`;
              ctx.fillRect(x, y, 3, 1);
            }
          }
          
          // Realistic wood knots and imperfections
          for (let i = 0; i < 15; i++) {
            const knotX = Math.random() * textureSize;
            const knotY = Math.random() * textureSize;
            const knotSize = 8 + Math.random() * 20;
            
            const gradient = ctx.createRadialGradient(knotX, knotY, 0, knotX, knotY, knotSize);
            gradient.addColorStop(0, `rgba(${woodBase.r * 120}, ${woodBase.g * 80}, ${woodBase.b * 40}, 0.8)`);
            gradient.addColorStop(0.7, `rgba(${woodBase.r * 160}, ${woodBase.g * 100}, ${woodBase.b * 60}, 0.4)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(knotX, knotY, knotSize, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Log cabin horizontal lines with realistic shadows
          for (let y = 0; y < textureSize; y += 60) {
            // Shadow line
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(0, y, textureSize, 3);
            
            // Highlight line
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(0, y + 3, textureSize, 1);
          }
          
          material.diffuseTexture = dynamicTexture;
          material.specularColor = new BABYLON.Color3(0.3, 0.2, 0.1);
          material.specularPower = 32;
          material.bumpTexture = dynamicTexture;
          break;
          
        case 'stone_tower':
        case 'stone_structure':
          // Ultra-realistic weathered stone texture
          const stoneBase = BABYLON.Color3.FromHexString(color);
          
          // Base stone color with natural variation
          ctx.fillStyle = `rgb(${stoneBase.r * 255}, ${stoneBase.g * 255}, ${stoneBase.b * 255})`;
          ctx.fillRect(0, 0, textureSize, textureSize);
          
          // Individual stone blocks with realistic weathering
          for (let x = 0; x < textureSize; x += 80) {
            for (let y = 0; y < textureSize; y += 50) {
              const blockWidth = 70 + Math.random() * 20;
              const blockHeight = 40 + Math.random() * 15;
              
              // Base block color with weathering
              const weathering = 0.7 + Math.random() * 0.6;
              const blockR = Math.max(0, Math.min(255, (stoneBase.r * 255) * weathering));
              const blockG = Math.max(0, Math.min(255, (stoneBase.g * 255) * weathering));
              const blockB = Math.max(0, Math.min(255, (stoneBase.b * 255) * weathering));
              
              ctx.fillStyle = `rgb(${blockR}, ${blockG}, ${blockB})`;
              ctx.fillRect(x + 3, y + 3, blockWidth, blockHeight);
              
              // Realistic mortar joints
              ctx.fillStyle = isDayMode ? 'rgba(180, 170, 160, 0.8)' : 'rgba(120, 110, 100, 0.9)';
              ctx.fillRect(x, y, blockWidth + 6, 3);
              ctx.fillRect(x, y, 3, blockHeight + 6);
              
              // Stone surface details and imperfections
              for (let i = 0; i < 25; i++) {
                const detailX = x + 3 + Math.random() * blockWidth;
                const detailY = y + 3 + Math.random() * blockHeight;
                const detailSize = 1 + Math.random() * 4;
                const detailIntensity = 0.5 + Math.random() * 0.5;
                
                ctx.fillStyle = `rgba(${blockR * detailIntensity}, ${blockG * detailIntensity}, ${blockB * detailIntensity}, 0.7)`;
                ctx.beginPath();
                ctx.arc(detailX, detailY, detailSize, 0, Math.PI * 2);
                ctx.fill();
              }
              
              // Weathering stains and moss patches
              if (Math.random() > 0.6) {
                const stainGradient = ctx.createRadialGradient(
                  x + blockWidth/2, y + blockHeight/2, 0,
                  x + blockWidth/2, y + blockHeight/2, blockWidth/3
                );
                stainGradient.addColorStop(0, 'rgba(80, 120, 60, 0.3)');
                stainGradient.addColorStop(1, 'rgba(80, 120, 60, 0)');
                
                ctx.fillStyle = stainGradient;
                ctx.fillRect(x + 3, y + 3, blockWidth, blockHeight);
              }
            }
          }
          
          material.diffuseTexture = dynamicTexture;
          material.specularColor = new BABYLON.Color3(0.3, 0.3, 0.4);
          material.specularPower = 64;
          material.bumpTexture = dynamicTexture;
          break;
          
        case 'glass_structure':
          // Greenhouse glass with metal frame
          ctx.fillStyle = 'rgba(220, 255, 220, 0.1)';
          ctx.fillRect(0, 0, textureSize, textureSize);
          
          // Metal frame
          for (let x = 0; x < textureSize; x += 40) {
            ctx.fillStyle = '#4a4a4a';
            ctx.fillRect(x, 0, 4, textureSize);
          }
          for (let y = 0; y < textureSize; y += 40) {
            ctx.fillStyle = '#4a4a4a';
            ctx.fillRect(0, y, textureSize, 4);
          }
          
          // Glass panels with reflection
          for (let x = 4; x < textureSize; x += 40) {
            for (let y = 4; y < textureSize; y += 40) {
              const glassAlpha = 0.2 + Math.random() * 0.3;
              ctx.fillStyle = isDayMode ? 
                `rgba(200, 255, 200, ${glassAlpha})` : 
                `rgba(150, 200, 150, ${glassAlpha * 0.7})`;
              ctx.fillRect(x, y, 32, 32);
              
              // Glass highlights
              ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
              ctx.fillRect(x, y, 32, 3);
              ctx.fillRect(x, y, 3, 32);
            }
          }
          
          material.diffuseTexture = dynamicTexture;
          material.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
          material.specularPower = 128;
          material.alpha = 0.7;
          break;
          
        default:
          // Natural earth/clay texture
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, textureSize, textureSize);
          
          // Organic patterns
          for (let x = 0; x < textureSize; x += 4) {
            for (let y = 0; y < textureSize; y += 4) {
              const earthVariation = 0.6 + Math.random() * 0.8;
              ctx.fillStyle = `rgb(${earthVariation * 130}, ${earthVariation * 90}, ${earthVariation * 60})`;
              ctx.fillRect(x, y, 4, 4);
            }
          }
          
          material.diffuseTexture = dynamicTexture;
          material.specularColor = new BABYLON.Color3(0.3, 0.2, 0.1);
          break;
      }
      
      dynamicTexture.update();
      return material;
    };
    
    systemsData.structures.forEach((structure) => {
      // Create natural structure with appropriate geometry
      let structureMesh: BABYLON.Mesh;
      
      if (structure.type === 'stone_tower') {
        // Create cylindrical tower
        structureMesh = BABYLON.MeshBuilder.CreateCylinder(
          `structure_${structure.id}`,
          { 
            height: structure.floors * 4, 
            diameterTop: structure.width * 0.8,
            diameterBottom: structure.width,
            tessellation: 12
          },
          scene
        );
      } else if (structure.type === 'amphitheater') {
        // Create amphitheater with terraced design
        structureMesh = BABYLON.MeshBuilder.CreateCylinder(
          `structure_${structure.id}`,
          { 
            height: structure.floors * 2, 
            diameterTop: structure.width * 1.2,
            diameterBottom: structure.width * 0.8,
            tessellation: 16
          },
          scene
        );
      } else {
        // Standard rectangular structure
        structureMesh = BABYLON.MeshBuilder.CreateBox(
          `structure_${structure.id}`,
          { 
            width: structure.width, 
            height: structure.floors * 3.5, 
            depth: structure.depth 
          },
          scene
        );
      }

      structureMesh.position.x = structure.x;
      structureMesh.position.y = (structure.floors * 3.5) / 2;
      structureMesh.position.z = structure.z;

      // Apply natural material based on structure type
      const structureMaterial = createNaturalMaterial(structure.type, structure.color, scene);
      structureMesh.material = structureMaterial;
      buildingMeshes[structure.id] = structureMesh;

      // Add natural architectural details
      if (structure.type === 'wooden_lodge' || structure.type === 'wooden_cabin') {
        // Add wooden roof
        const roof = BABYLON.MeshBuilder.CreateBox(
          `roof_${structure.id}`,
          { width: structure.width * 1.2, height: 1.5, depth: structure.depth * 1.2 },
          scene
        );
        roof.position.x = structure.x;
        roof.position.y = structure.floors * 3.5 + 0.75;
        roof.position.z = structure.z;
        roof.rotation.y = Math.PI / 4; // Angled roof
        
        const roofMaterial = new BABYLON.StandardMaterial(`roofMat_${structure.id}`, scene);
        roofMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.2, 0.1);
        roofMaterial.specularColor = new BABYLON.Color3(0.2, 0.1, 0.05);
        roof.material = roofMaterial;
        
        // Add chimney
        const chimney = BABYLON.MeshBuilder.CreateCylinder(
          `chimney_${structure.id}`,
          { height: 4, diameterTop: 0.8, diameterBottom: 1.2 },
          scene
        );
        chimney.position.x = structure.x + structure.width * 0.3;
        chimney.position.y = structure.floors * 3.5 + 3;
        chimney.position.z = structure.z + structure.depth * 0.3;
        
        const chimneyMaterial = new BABYLON.StandardMaterial(`chimneyMat_${structure.id}`, scene);
        chimneyMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.3, 0.2);
        chimney.material = chimneyMaterial;
      } else if (structure.type === 'stone_tower') {
        // Add flagpole
        const flagpole = BABYLON.MeshBuilder.CreateCylinder(
          `flagpole_${structure.id}`,
          { height: 6, diameterTop: 0.1, diameterBottom: 0.2 },
          scene
        );
        flagpole.position.x = structure.x;
        flagpole.position.y = structure.floors * 4 + 3;
        flagpole.position.z = structure.z;
        
        const poleMaterial = new BABYLON.StandardMaterial(`poleMat_${structure.id}`, scene);
        poleMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.7, 0.3);
        poleMaterial.specularColor = new BABYLON.Color3(0.9, 0.8, 0.4);
        flagpole.material = poleMaterial;
      }
      
      // Remove cars as they don't fit natural environment
      // Will be replaced with wildlife later

      // Structure label with natural styling
      const labelPlane = BABYLON.MeshBuilder.CreatePlane(
        `label_${structure.id}`, 
        { width: structure.width * 1.5, height: 3 }, 
        scene
      );
      labelPlane.position.x = structure.x;
      labelPlane.position.y = structure.floors * 3.5 + 4;
      labelPlane.position.z = structure.z;
      labelPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

      const labelTexture = new BABYLON.DynamicTexture(
        `labelTexture_${structure.id}`, 
        { width: 512, height: 128 }, 
        scene
      );
      const ctx = labelTexture.getContext();
      
      // Natural label design with wood-like background
      ctx.fillStyle = 'rgba(101, 67, 33, 0.9)';
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = structure.color;
      ctx.fillRect(0, 0, 512, 8);
      
      ctx.font = 'bold 32px serif';
      ctx.fillStyle = '#F5DEB3';
      (ctx as any).textAlign = 'center';
      ctx.fillText(structure.name, 256, 50);
      
      ctx.font = '18px serif';
      ctx.fillStyle = '#DEB887';
      ctx.fillText(`${structure.visitors}/${structure.capacity} visitors`, 256, 80);
      
      labelTexture.update();

      const labelMaterial = new BABYLON.StandardMaterial(`labelMaterial_${structure.id}`, scene);
      labelMaterial.diffuseTexture = labelTexture;
      labelMaterial.emissiveTexture = labelTexture;
      labelMaterial.backFaceCulling = false;
      labelPlane.material = labelMaterial;

      // Click interaction
      structureMesh.actionManager = new BABYLON.ActionManager(scene);
      structureMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        () => {
          setSelectedBuilding(structure.id);
          console.log(`Selected structure: ${structure.name}`);
        }
      ));
    });

    // IoT Sensors visualization
    const sensorMeshes: BABYLON.Mesh[] = [];
    
    if (showSensors) {
      systemsData.sensors.forEach((sensor) => {
        const sensorMesh = BABYLON.MeshBuilder.CreateSphere(
          `sensor_${sensor.id}`,
          { diameter: 1.5 },
          scene
        );

        sensorMesh.position.set(sensor.x, sensor.y, sensor.z);

        // Sensor material based on status
        const sensorMaterial = new BABYLON.StandardMaterial(`sensorMaterial_${sensor.id}`, scene);
        switch (sensor.status) {
          case 'optimal':
            sensorMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);
            break;
          case 'normal':
            sensorMaterial.emissiveColor = new BABYLON.Color3(0, 0.8, 1);
            break;
          case 'warning':
            sensorMaterial.emissiveColor = new BABYLON.Color3(1, 0.8, 0);
            break;
          case 'critical':
            sensorMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
            break;
          default:
            sensorMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        }
        
        sensorMaterial.diffuseColor = sensorMaterial.emissiveColor.clone();
        sensorMesh.material = sensorMaterial;
        sensorMeshes.push(sensorMesh);
      });
    }

    // Animated elements and effects
    let time = 0;
    const animationSpeed = 0.02;

    // Flying drone simulation
    const drone = BABYLON.MeshBuilder.CreateBox('drone', { width: 1, height: 0.3, depth: 1 }, scene);
    const droneMaterial = new BABYLON.StandardMaterial('droneMaterial', scene);
    droneMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
    droneMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0);
    drone.material = droneMaterial;

    // ================ ADVANCED ENVIRONMENTAL ELEMENTS ================
    
    // Create realistic 3D trees with detailed foliage
    const createRealisticTree = (position: BABYLON.Vector3, scale: number = 1) => {
      // Tree trunk with realistic bark texture
      const trunk = BABYLON.MeshBuilder.CreateCylinder('treeTrunk', {
        height: 8 * scale,
        diameterTop: 0.8 * scale,
        diameterBottom: 1.2 * scale,
        tessellation: 8
      }, scene);
      
      trunk.position = position.clone();
      trunk.position.y = (4 * scale);
      
      // Realistic bark material
      const barkMaterial = new BABYLON.StandardMaterial('barkMaterial', scene);
      const barkTexture = new BABYLON.DynamicTexture('barkTexture', 512, scene);
      const barkCtx = barkTexture.getContext();
      
      // Create bark pattern
      barkCtx.fillStyle = '#654321';
      barkCtx.fillRect(0, 0, 512, 512);
      
      // Bark grooves and texture
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const width = 2 + Math.random() * 8;
        const height = 20 + Math.random() * 60;
        
        barkCtx.fillStyle = `rgba(${80 + Math.random() * 40}, ${60 + Math.random() * 30}, ${40 + Math.random() * 20}, 0.8)`;
        barkCtx.fillRect(x, y, width, height);
      }
      
      barkMaterial.diffuseTexture = barkTexture;
      barkMaterial.bumpTexture = barkTexture;
      barkMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.08);
      trunk.material = barkMaterial;
      
      // Multi-layered foliage for realistic tree crown
      const foliageLayers = 3;
      for (let layer = 0; layer < foliageLayers; layer++) {
        const foliage = BABYLON.MeshBuilder.CreateSphere('foliage', {
          diameter: (4 + layer * 1.5) * scale,
          segments: 12
        }, scene);
        
        foliage.position.x = position.x + (Math.random() - 0.5) * 2 * scale;
        foliage.position.y = position.y + (6 + layer * 2) * scale;
        foliage.position.z = position.z + (Math.random() - 0.5) * 2 * scale;
        
        // Realistic foliage material with seasonal variation
        const foliageMaterial = new BABYLON.StandardMaterial(`foliageMaterial_${layer}`, scene);
        const seasonalGreen = isDayMode ? 0.8 : 0.6;
        foliageMaterial.diffuseColor = new BABYLON.Color3(
          0.2 * seasonalGreen,
          (0.6 + Math.random() * 0.3) * seasonalGreen,
          0.1 * seasonalGreen
        );
        foliageMaterial.specularColor = new BABYLON.Color3(0.1, 0.2, 0.1);
        foliageMaterial.specularPower = 16;
        
        // Add transparency for realistic leaf layering
        foliageMaterial.alpha = 0.85 + Math.random() * 0.15;
        foliage.material = foliageMaterial;
      }
      
      return trunk;
    };
    
    // Create forest of realistic trees
    const trees: BABYLON.Mesh[] = [];
    for (let i = 0; i < 25; i++) {
      let treeX, treeZ;
      let validPosition = false;
      let attempts = 0;
      
      // Ensure trees don't intersect with structures
      while (!validPosition && attempts < 20) {
        treeX = (Math.random() - 0.5) * 180;
        treeZ = (Math.random() - 0.5) * 180;
        
        validPosition = true;
        for (const structure of systemsData.structures) {
          const distance = Math.sqrt(
            Math.pow(treeX - structure.x, 2) + Math.pow(treeZ - structure.z, 2)
          );
          if (distance < 20) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      }
      
      if (validPosition) {
        const treeScale = 0.7 + Math.random() * 0.8;
        const tree = createRealisticTree(new BABYLON.Vector3(treeX, 0, treeZ), treeScale);
        trees.push(tree);
      }
    }
    
    // Create realistic rocks and boulders
    const createRock = (position: BABYLON.Vector3, scale: number = 1) => {
      const rock = BABYLON.MeshBuilder.CreateSphere('rock', {
        diameter: (2 + Math.random() * 3) * scale,
        segments: 8
      }, scene);
      
      // Deform sphere to make it more rock-like
      const positions = rock.getVerticesData(BABYLON.VertexBuffer.PositionKind);
      if (positions) {
        for (let i = 0; i < positions.length; i += 3) {
          const deformation = (Math.random() - 0.5) * 0.3;
          positions[i] += deformation;
          positions[i + 1] += deformation;
          positions[i + 2] += deformation;
        }
        rock.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
      }
      
      rock.position = position.clone();
      rock.position.y = 0.5 * scale;
      
      // Realistic rock material
      const rockMaterial = new BABYLON.StandardMaterial('rockMaterial', scene);
      const rockTexture = new BABYLON.DynamicTexture('rockTexture', 256, scene);
      const rockCtx = rockTexture.getContext();
      
      // Create granite-like texture
      rockCtx.fillStyle = '#8B8680';
      rockCtx.fillRect(0, 0, 256, 256);
      
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const size = 1 + Math.random() * 4;
        const intensity = 0.5 + Math.random() * 0.5;
        
        rockCtx.fillStyle = `rgba(${120 * intensity}, ${115 * intensity}, ${110 * intensity}, 0.8)`;
        rockCtx.beginPath();
        rockCtx.arc(x, y, size, 0, Math.PI * 2);
        rockCtx.fill();
      }
      
      rockMaterial.diffuseTexture = rockTexture;
      rockMaterial.bumpTexture = rockTexture;
      rockMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      rockMaterial.specularPower = 128;
      rock.material = rockMaterial;
      
      return rock;
    };
    
    // Scatter realistic rocks throughout the scene
    for (let i = 0; i < 25; i++) {
      const rockX = (Math.random() - 0.5) * 160;
      const rockZ = (Math.random() - 0.5) * 160;
      const rockScale = 0.8 + Math.random() * 1.2;
      createRock(new BABYLON.Vector3(rockX, 0, rockZ), rockScale);
    }
    
    // ================ ADVANCED LIGHTING SYSTEM ================
    
    // Enhanced natural lighting with HDR-like effects
    const enhanceSceneLighting = () => {
      // Remove default light and create advanced lighting setup
      scene.lights.forEach(light => light.dispose());
      
      // Primary sun light with realistic parameters
      const sunLight = new BABYLON.DirectionalLight('sunLight', new BABYLON.Vector3(-0.5, -1, -0.3), scene);
      sunLight.intensity = isDayMode ? 3.2 : 0.8;
      sunLight.diffuse = isDayMode ? 
        new BABYLON.Color3(1.0, 0.95, 0.8) :   // Warm daylight
        new BABYLON.Color3(0.4, 0.5, 0.8);     // Cool moonlight
      sunLight.specular = isDayMode ?
        new BABYLON.Color3(1.0, 1.0, 0.9) :
        new BABYLON.Color3(0.3, 0.3, 0.5);
      
      // Enable shadows with high quality
      const shadowGenerator = new BABYLON.ShadowGenerator(2048, sunLight);
      shadowGenerator.useExponentialShadowMap = true;
      shadowGenerator.useKernelBlur = true;
      shadowGenerator.blurKernel = 32;
      shadowGenerator.bias = 0.001;
      
      // Add all structures to shadow casters
      Object.values(buildingMeshes).forEach(mesh => {
        shadowGenerator.getShadowMap()?.renderList?.push(mesh);
      });
      
      // Add trees to shadow casters
      trees.forEach(tree => {
        shadowGenerator.getShadowMap()?.renderList?.push(tree);
      });
      
      // Enable shadows on ground
      ground.receiveShadows = true;
      
      // Ambient hemisphere light for realistic fill lighting
      const hemisphereLight = new BABYLON.HemisphericLight('hemisphereLight', new BABYLON.Vector3(0, 1, 0), scene);
      hemisphereLight.intensity = isDayMode ? 0.6 : 0.3;
      hemisphereLight.diffuse = isDayMode ?
        new BABYLON.Color3(0.6, 0.8, 1.0) :    // Blue sky fill
        new BABYLON.Color3(0.2, 0.3, 0.5);     // Night sky fill
      hemisphereLight.groundColor = new BABYLON.Color3(0.3, 0.5, 0.3); // Earth reflection
      
      // Atmospheric fog for depth and realism
      scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
      scene.fogDensity = isDayMode ? 0.001 : 0.003;
      scene.fogColor = isDayMode ?
        new BABYLON.Color3(0.9, 0.95, 1.0) :   // Light day haze
        new BABYLON.Color3(0.1, 0.15, 0.3);    // Night mist
    };
    
    enhanceSceneLighting();
    
    // ================ GARDEN AND LANDSCAPING ELEMENTS ================
    
    // Create flower beds and garden areas
    const createFlowerBed = (centerX: number, centerZ: number, radius: number) => {
      // Create circular flower bed base
      const bedBase = BABYLON.MeshBuilder.CreateCylinder('flowerBed', {
        height: 0.2,
        diameter: radius * 2,
        tessellation: 16
      }, scene);
      
      bedBase.position.set(centerX, 0.1, centerZ);
      
      // Rich soil material for flower bed
      const soilMaterial = new BABYLON.StandardMaterial('soilMaterial', scene);
      soilMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.25, 0.15);
      soilMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.08);
      bedBase.material = soilMaterial;
      
      // Add colorful flowers
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const flowerRadius = Math.random() * (radius - 1);
        const flowerX = centerX + Math.cos(angle) * flowerRadius;
        const flowerZ = centerZ + Math.sin(angle) * flowerRadius;
        
        // Flower stem
        const stem = BABYLON.MeshBuilder.CreateCylinder('stem', {
          height: 0.8 + Math.random() * 0.4,
          diameter: 0.1,
          tessellation: 6
        }, scene);
        stem.position.set(flowerX, stem.scaling.y / 2, flowerZ);
        
        const stemMaterial = new BABYLON.StandardMaterial('stemMaterial', scene);
        stemMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.2);
        stem.material = stemMaterial;
        
        // Flower head
        const flower = BABYLON.MeshBuilder.CreateSphere('flower', {
          diameter: 0.3 + Math.random() * 0.2,
          segments: 8
        }, scene);
        flower.position.set(flowerX, stem.scaling.y + 0.2, flowerZ);
        
        const flowerMaterial = new BABYLON.StandardMaterial('flowerMaterial', scene);
        const flowerColors = [
          new BABYLON.Color3(1, 0.2, 0.3),    // Red
          new BABYLON.Color3(1, 0.8, 0.2),    // Yellow
          new BABYLON.Color3(0.8, 0.2, 1),    // Purple
          new BABYLON.Color3(1, 0.5, 0.8),    // Pink
          new BABYLON.Color3(0.3, 0.6, 1)     // Blue
        ];
        flowerMaterial.diffuseColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        flowerMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        flower.material = flowerMaterial;
      }
    };
    
    // Create multiple garden areas
    createFlowerBed(-25, -45, 6);
    createFlowerBed(30, 45, 8);
    createFlowerBed(-50, 20, 5);
    createFlowerBed(45, -25, 7);
    
    // ================ ROAD SYSTEM AND TRAFFIC ================
    
    // Create realistic road network
    const createRoad = (startPos: BABYLON.Vector3, endPos: BABYLON.Vector3, width: number = 8) => {
      const roadLength = BABYLON.Vector3.Distance(startPos, endPos);
      const road = BABYLON.MeshBuilder.CreateBox('road', {
        width: width,
        height: 0.1,
        depth: roadLength
      }, scene);
      
      // Position road between start and end points
      const midPoint = BABYLON.Vector3.Center(startPos, endPos);
      road.position = midPoint;
      road.position.y = 0.05;
      
      // Rotate road to align with direction
      const direction = endPos.subtract(startPos).normalize();
      const angle = Math.atan2(direction.x, direction.z);
      road.rotation.y = angle;
      
      // Realistic asphalt material
      const roadMaterial = new BABYLON.StandardMaterial('roadMaterial', scene);
      const roadTexture = new BABYLON.DynamicTexture('roadTexture', 512, scene);
      const roadCtx = roadTexture.getContext();
      
      // Create asphalt texture
      roadCtx.fillStyle = '#2C2C2C';
      roadCtx.fillRect(0, 0, 512, 512);
      
      // Road surface texture with small stones and wear
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = 1 + Math.random() * 2;
        const intensity = 0.7 + Math.random() * 0.6;
        
        roadCtx.fillStyle = `rgba(${intensity * 60}, ${intensity * 60}, ${intensity * 60}, 0.5)`;
        roadCtx.beginPath();
        roadCtx.arc(x, y, size, 0, Math.PI * 2);
        roadCtx.fill();
      }
      
      // Yellow center line
      roadCtx.strokeStyle = '#FFFF00';
      roadCtx.lineWidth = 8;
      roadCtx.setLineDash([40, 30]);
      roadCtx.beginPath();
      roadCtx.moveTo(256, 0);
      roadCtx.lineTo(256, 512);
      roadCtx.stroke();
      
      // White edge lines
      roadCtx.strokeStyle = '#FFFFFF';
      roadCtx.lineWidth = 4;
      roadCtx.setLineDash([]);
      roadCtx.beginPath();
      roadCtx.moveTo(50, 0);
      roadCtx.lineTo(50, 512);
      roadCtx.moveTo(462, 0);
      roadCtx.lineTo(462, 512);
      roadCtx.stroke();
      
      roadMaterial.diffuseTexture = roadTexture;
      roadMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      roadMaterial.specularPower = 32;
      road.material = roadMaterial;
      
      return road;
    };
    
    // Create main road network connecting structures
    const roads: BABYLON.Mesh[] = [];
    
    // Main central road (horizontal)
    roads.push(createRoad(new BABYLON.Vector3(-70, 0, 0), new BABYLON.Vector3(70, 0, 0), 10));
    
    // Vertical connecting road
    roads.push(createRoad(new BABYLON.Vector3(0, 0, -60), new BABYLON.Vector3(0, 0, 60), 8));
    
    // Branch roads to structures
    roads.push(createRoad(new BABYLON.Vector3(-40, 0, 0), new BABYLON.Vector3(-40, 0, -30), 6));
    roads.push(createRoad(new BABYLON.Vector3(40, 0, 0), new BABYLON.Vector3(40, 0, -30), 6));
    roads.push(createRoad(new BABYLON.Vector3(-40, 0, 0), new BABYLON.Vector3(-40, 0, 30), 6));
    roads.push(createRoad(new BABYLON.Vector3(40, 0, 0), new BABYLON.Vector3(40, 0, 30), 6));
    
    // ================ VEHICLE TRAFFIC SYSTEM ================
    
    // Create realistic car models
    const createCar = () => {
      const carGroup = new BABYLON.TransformNode('carGroup', scene);
      
      // Car body
      const carBody = BABYLON.MeshBuilder.CreateBox('carBody', {
        width: 2,
        height: 1.2,
        depth: 4.5
      }, scene);
      carBody.position.y = 0.8;
      carBody.parent = carGroup;
      
      // Car roof
      const carRoof = BABYLON.MeshBuilder.CreateBox('carRoof', {
        width: 1.8,
        height: 0.8,
        depth: 2.5
      }, scene);
      carRoof.position.y = 1.6;
      carRoof.position.z = -0.5;
      carRoof.parent = carGroup;
      
      // Wheels
      const wheelPositions = [
        { x: -0.8, z: 1.5 }, { x: 0.8, z: 1.5 },
        { x: -0.8, z: -1.5 }, { x: 0.8, z: -1.5 }
      ];
      
      wheelPositions.forEach((pos, index) => {
        const wheel = BABYLON.MeshBuilder.CreateCylinder(`wheel_${index}`, {
          diameter: 1.2,
          height: 0.3,
          tessellation: 8
        }, scene);
        wheel.position.set(pos.x, 0.4, pos.z);
        wheel.rotation.z = Math.PI / 2;
        wheel.parent = carGroup;
        
        // Wheel material
        const wheelMaterial = new BABYLON.StandardMaterial(`wheelMaterial_${index}`, scene);
        wheelMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        wheel.material = wheelMaterial;
      });
      
      // Car material with random colors
      const carMaterial = new BABYLON.StandardMaterial('carMaterial', scene);
      const carColors = [
        new BABYLON.Color3(0.8, 0.1, 0.1),    // Red
        new BABYLON.Color3(0.1, 0.1, 0.8),    // Blue
        new BABYLON.Color3(0.1, 0.6, 0.1),    // Green
        new BABYLON.Color3(0.8, 0.8, 0.1),    // Yellow
        new BABYLON.Color3(0.5, 0.5, 0.5),    // Gray
        new BABYLON.Color3(0.9, 0.9, 0.9),    // White
        new BABYLON.Color3(0.1, 0.1, 0.1)     // Black
      ];
      carMaterial.diffuseColor = carColors[Math.floor(Math.random() * carColors.length)];
      carMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
      carMaterial.specularPower = 64;
      
      carBody.material = carMaterial;
      carRoof.material = carMaterial;
      
      return carGroup;
    };
    
    // Create traffic with cars following road paths
    const traffic: { 
      car: BABYLON.TransformNode; 
      path: BABYLON.Vector3[]; 
      pathIndex: number; 
      speed: number;
      direction: number;
    }[] = [];
    
    // Define road paths for traffic
    const roadPaths = [
      // Main horizontal road (both directions)
      {
        path: [
          new BABYLON.Vector3(-70, 0.6, -2),
          new BABYLON.Vector3(-20, 0.6, -2),
          new BABYLON.Vector3(20, 0.6, -2),
          new BABYLON.Vector3(70, 0.6, -2)
        ],
        direction: 1
      },
      {
        path: [
          new BABYLON.Vector3(70, 0.6, 2),
          new BABYLON.Vector3(20, 0.6, 2),
          new BABYLON.Vector3(-20, 0.6, 2),
          new BABYLON.Vector3(-70, 0.6, 2)
        ],
        direction: -1
      },
      // Vertical road (both directions)
      {
        path: [
          new BABYLON.Vector3(-2, 0.6, -60),
          new BABYLON.Vector3(-2, 0.6, -20),
          new BABYLON.Vector3(-2, 0.6, 20),
          new BABYLON.Vector3(-2, 0.6, 60)
        ],
        direction: 1
      },
      {
        path: [
          new BABYLON.Vector3(2, 0.6, 60),
          new BABYLON.Vector3(2, 0.6, 20),
          new BABYLON.Vector3(2, 0.6, -20),
          new BABYLON.Vector3(2, 0.6, -60)
        ],
        direction: -1
      }
    ];
    
    // Create cars on different paths
    for (let i = 0; i < 12; i++) {
      const car = createCar();
      const pathData = roadPaths[i % roadPaths.length];
      const startIndex = Math.floor(Math.random() * pathData.path.length);
      
      car.position = pathData.path[startIndex].clone();
      
      traffic.push({
        car: car,
        path: pathData.path,
        pathIndex: startIndex,
        speed: 0.3 + Math.random() * 0.4,
        direction: pathData.direction
      });
    }
    
    // ================ PEDESTRIAN SYSTEM ================
    
    // Create simple people models
    const createPerson = () => {
      const personGroup = new BABYLON.TransformNode('personGroup', scene);
      
      // Body
      const body = BABYLON.MeshBuilder.CreateCylinder('body', {
        height: 1.6,
        diameterTop: 0.6,
        diameterBottom: 0.8,
        tessellation: 8
      }, scene);
      body.position.y = 0.8;
      body.parent = personGroup;
      
      // Head
      const head = BABYLON.MeshBuilder.CreateSphere('head', {
        diameter: 0.4,
        segments: 8
      }, scene);
      head.position.y = 1.8;
      head.parent = personGroup;
      
      // Person material with varied clothing colors
      const personMaterial = new BABYLON.StandardMaterial('personMaterial', scene);
      const clothingColors = [
        new BABYLON.Color3(0.2, 0.4, 0.8),    // Blue
        new BABYLON.Color3(0.8, 0.2, 0.2),    // Red
        new BABYLON.Color3(0.2, 0.6, 0.2),    // Green
        new BABYLON.Color3(0.6, 0.3, 0.8),    // Purple
        new BABYLON.Color3(0.8, 0.6, 0.2),    // Orange
        new BABYLON.Color3(0.4, 0.4, 0.4),    // Gray
        new BABYLON.Color3(0.1, 0.1, 0.1)     // Black
      ];
      personMaterial.diffuseColor = clothingColors[Math.floor(Math.random() * clothingColors.length)];
      body.material = personMaterial;
      
      // Skin color for head
      const headMaterial = new BABYLON.StandardMaterial('headMaterial', scene);
      headMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.7, 0.6);
      head.material = headMaterial;
      
      return personGroup;
    };
    
    // Create pedestrians walking around
    const pedestrians: {
      person: BABYLON.TransformNode;
      path: BABYLON.Vector3[];
      pathIndex: number;
      speed: number;
      waitTime: number;
    }[] = [];
    
    // Define walking paths around structures and gardens
    const walkingPaths = [
      // Around visitor center
      [
        new BABYLON.Vector3(-35, 0, -35),
        new BABYLON.Vector3(-35, 0, -25),
        new BABYLON.Vector3(-45, 0, -25),
        new BABYLON.Vector3(-45, 0, -35)
      ],
      // Around observatory
      [
        new BABYLON.Vector3(35, 0, -35),
        new BABYLON.Vector3(45, 0, -35),
        new BABYLON.Vector3(45, 0, -25),
        new BABYLON.Vector3(35, 0, -25)
      ],
      // Garden path near greenhouse
      [
        new BABYLON.Vector3(-35, 0, 35),
        new BABYLON.Vector3(-30, 0, 40),
        new BABYLON.Vector3(-45, 0, 40),
        new BABYLON.Vector3(-50, 0, 35)
      ],
      // Research station area
      [
        new BABYLON.Vector3(35, 0, 25),
        new BABYLON.Vector3(40, 0, 30),
        new BABYLON.Vector3(45, 0, 25),
        new BABYLON.Vector3(40, 0, 20)
      ],
      // Central amphitheater area
      [
        new BABYLON.Vector3(-10, 0, -10),
        new BABYLON.Vector3(10, 0, -10),
        new BABYLON.Vector3(10, 0, 10),
        new BABYLON.Vector3(-10, 0, 10)
      ]
    ];
    
    // Create people walking on different paths
    for (let i = 0; i < 15; i++) {
      const person = createPerson();
      const path = walkingPaths[i % walkingPaths.length];
      const startIndex = Math.floor(Math.random() * path.length);
      
      person.position = path[startIndex].clone();
      
      pedestrians.push({
        person: person,
        path: path,
        pathIndex: startIndex,
        speed: 0.08 + Math.random() * 0.05, // Slower walking speed
        waitTime: 0
      });
    }
    
    // Wildlife simulation - animals moving naturally through the forest
    const wildlife: { mesh: BABYLON.Mesh; type: string; path: BABYLON.Vector3[]; pathIndex: number; speed: number }[] = [];
    
    // Create simple animal shapes
    for (let i = 0; i < 8; i++) {
      let animal: BABYLON.Mesh;
      let animalType: string;
      
      if (i < 3) {
        // Deer-like animals
        animal = BABYLON.MeshBuilder.CreateBox(`deer_${i}`, { width: 1, height: 1.5, depth: 2 }, scene);
        animalType = 'deer';
        
        const deerMaterial = new BABYLON.StandardMaterial(`deerMaterial_${i}`, scene);
        deerMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.4, 0.2);
        deerMaterial.specularColor = new BABYLON.Color3(0.3, 0.2, 0.1);
        animal.material = deerMaterial;
      } else if (i < 6) {
        // Small creatures (rabbits/squirrels)
        animal = BABYLON.MeshBuilder.CreateSphere(`small_animal_${i}`, { diameter: 0.6 }, scene);
        animalType = 'small';
        
        const smallMaterial = new BABYLON.StandardMaterial(`smallMaterial_${i}`, scene);
        smallMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.2);
        animal.material = smallMaterial;
      } else {
        // Birds
        animal = BABYLON.MeshBuilder.CreateSphere(`bird_${i}`, { diameter: 0.4 }, scene);
        animalType = 'bird';
        
        const birdMaterial = new BABYLON.StandardMaterial(`birdMaterial_${i}`, scene);
        birdMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.8);
        animal.material = birdMaterial;
      }
      
      animal.position.y = animalType === 'bird' ? 8 + Math.random() * 10 : 0.5;
      
      // Create random path through the forest
      const pathPoints: BABYLON.Vector3[] = [];
      for (let p = 0; p < 5; p++) {
        pathPoints.push(new BABYLON.Vector3(
          (Math.random() - 0.5) * 200,
          animalType === 'bird' ? 8 + Math.random() * 10 : 0.5,
          (Math.random() - 0.5) * 200
        ));
      }
      
      wildlife.push({
        mesh: animal,
        type: animalType,
        path: pathPoints,
        pathIndex: 0,
        speed: animalType === 'bird' ? 0.02 : 0.01 + Math.random() * 0.01
      });
    }

    // Add enhanced environmental elements with natural materials
    const environmentalElements: BABYLON.Mesh[] = [];
    
    // Create Central Garden Park
    const createCentralPark = () => {
      const parkX = -60;
      const parkZ = 0;
      const parkSize = 40;
      
      // Park base
      const parkBase = BABYLON.MeshBuilder.CreateGround(
        'centralPark',
        { width: parkSize, height: parkSize },
        scene
      );
      parkBase.position.set(parkX, 0.1, parkZ);
      
      // Create grass texture
      const grassTexture = new BABYLON.DynamicTexture('grassTexture', 256, scene);
      const grassCtx = grassTexture.getContext();
      
      // Natural grass pattern
      for (let x = 0; x < 256; x += 2) {
        for (let y = 0; y < 256; y += 2) {
          const greenIntensity = 0.3 + Math.random() * 0.4;
          grassCtx.fillStyle = `rgb(${greenIntensity * 50}, ${greenIntensity * 120}, ${greenIntensity * 40})`;
          grassCtx.fillRect(x, y, 2, 2);
        }
      }
      grassTexture.update();
      
      const parkMaterial = new BABYLON.StandardMaterial('parkMaterial', scene);
      parkMaterial.diffuseTexture = grassTexture;
      parkMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      parkBase.material = parkMaterial;
      
      // Add walking paths
      for (let i = 0; i < 3; i++) {
        const path = BABYLON.MeshBuilder.CreateBox(
          `path_${i}`,
          { width: 2, height: 0.1, depth: parkSize * 0.8 },
          scene
        );
        path.position.set(parkX + (i - 1) * 12, 0.15, parkZ);
        
        const pathMaterial = new BABYLON.StandardMaterial(`pathMat_${i}`, scene);
        pathMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.6, 0.5);
        path.material = pathMaterial;
        environmentalElements.push(path);
      }
      
      // Add fountain centerpiece
      const fountain = BABYLON.MeshBuilder.CreateCylinder(
        'fountain',
        { height: 3, diameterTop: 8, diameterBottom: 10 },
        scene
      );
      fountain.position.set(parkX, 1.5, parkZ);
      
      const fountainMaterial = new BABYLON.StandardMaterial('fountainMaterial', scene);
      fountainMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.9);
      fountainMaterial.specularColor = new BABYLON.Color3(0.9, 0.9, 1.0);
      fountainMaterial.specularPower = 32;
      fountain.material = fountainMaterial;
      
      // Water effect
      const water = BABYLON.MeshBuilder.CreateCylinder(
        'water',
        { height: 0.2, diameterTop: 7, diameterBottom: 7 },
        scene
      );
      water.position.set(parkX, 2.1, parkZ);
      
      const waterMaterial = new BABYLON.StandardMaterial('waterMaterial', scene);
      waterMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.5, 0.8);
      waterMaterial.alpha = 0.7;
      waterMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
      waterMaterial.specularPower = 64;
      water.material = waterMaterial;
      
      environmentalElements.push(parkBase, fountain, water);
    };
    
    // Create Children's Playground
    const createPlayground = () => {
      const playX = 60;
      const playZ = 0;
      const playSize = 30;
      
      // Playground base with rubber surface
      const playBase = BABYLON.MeshBuilder.CreateGround(
        'playground',
        { width: playSize, height: playSize },
        scene
      );
      playBase.position.set(playX, 0.1, playZ);
      
      const playMaterial = new BABYLON.StandardMaterial('playgroundMaterial', scene);
      playMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.3);
      playMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      playBase.material = playMaterial;
      
      // Swing set
      const swingFrame = BABYLON.MeshBuilder.CreateBox(
        'swingFrame',
        { width: 8, height: 4, depth: 0.3 },
        scene
      );
      swingFrame.position.set(playX - 8, 2, playZ - 8);
      
      const metalMaterial = new BABYLON.StandardMaterial('metalMaterial', scene);
      metalMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.6);
      metalMaterial.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
      swingFrame.material = metalMaterial;
      
      // Slide
      const slide = BABYLON.MeshBuilder.CreateBox(
        'slide',
        { width: 2, height: 5, depth: 8 },
        scene
      );
      slide.position.set(playX + 6, 2.5, playZ - 6);
      slide.rotation.x = -Math.PI / 8;
      
      const slideMaterial = new BABYLON.StandardMaterial('slideMaterial', scene);
      slideMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);
      slideMaterial.specularColor = new BABYLON.Color3(0.9, 0.4, 0.4);
      slide.material = slideMaterial;
      
      // Sandbox
      const sandbox = BABYLON.MeshBuilder.CreateBox(
        'sandbox',
        { width: 6, height: 0.5, depth: 6 },
        scene
      );
      sandbox.position.set(playX, 0.35, playZ + 8);
      
      const sandMaterial = new BABYLON.StandardMaterial('sandMaterial', scene);
      sandMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.8, 0.6);
      sandMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      sandbox.material = sandMaterial;
      
      // Monkey bars
      for (let i = 0; i < 5; i++) {
        const bar = BABYLON.MeshBuilder.CreateCylinder(
          `bar_${i}`,
          { height: 0.1, diameter: 0.3 },
          scene
        );
        bar.position.set(playX - 4 + i * 2, 3, playZ + 2);
        bar.rotation.z = Math.PI / 2;
        bar.material = metalMaterial;
        environmentalElements.push(bar);
      }
      
      environmentalElements.push(playBase, swingFrame, slide, sandbox);
    };
    
    // Create enhanced natural trees with more variety
    const createNaturalTrees = () => {
      for (let i = 0; i < 35; i++) {
        const x = (Math.random() - 0.5) * 220;
        const z = (Math.random() - 0.5) * 220;
        
        // Skip if too close to structures or parks
        let tooClose = false;
        for (const structure of systemsData.structures) {
          const dist = Math.sqrt((x - structure.x) ** 2 + (z - structure.z) ** 2);
          if (dist < 18) {
            tooClose = true;
            break;
          }
        }
        // Skip park areas
        if (Math.abs(x + 60) < 25 && Math.abs(z) < 25) tooClose = true;
        if (Math.abs(x - 60) < 20 && Math.abs(z) < 20) tooClose = true;
        
        if (tooClose) continue;
        
        const treeType = Math.floor(Math.random() * 3);
        
        // Tree trunk with natural texture
        const trunkHeight = 3 + Math.random() * 2;
        const trunk = BABYLON.MeshBuilder.CreateCylinder(
          `trunk_${i}`,
          { height: trunkHeight, diameterTop: 0.3, diameterBottom: 0.5 },
          scene
        );
        trunk.position.set(x, trunkHeight / 2, z);
        
        // Natural bark texture
        const barkTexture = new BABYLON.DynamicTexture(`bark_${i}`, 64, scene);
        const barkCtx = barkTexture.getContext();
        
        for (let bx = 0; bx < 64; bx++) {
          for (let by = 0; by < 64; by++) {
            const noise = Math.random() * 0.3;
            const brown = 0.3 + noise;
            barkCtx.fillStyle = `rgb(${brown * 100}, ${brown * 60}, ${brown * 30})`;
            barkCtx.fillRect(bx, by, 1, 1);
          }
        }
        barkTexture.update();
        
        const trunkMaterial = new BABYLON.StandardMaterial(`trunkMat_${i}`, scene);
        trunkMaterial.diffuseTexture = barkTexture;
        trunkMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        trunk.material = trunkMaterial;
        
        // Tree foliage with different shapes
        let foliage: BABYLON.Mesh;
        const foliageSize = 4 + Math.random() * 3;
        
        switch (treeType) {
          case 0: // Round tree
            foliage = BABYLON.MeshBuilder.CreateSphere(
              `foliage_${i}`,
              { diameter: foliageSize },
              scene
            );
            break;
          case 1: // Tall tree
            foliage = BABYLON.MeshBuilder.CreateSphere(
              `foliage_${i}`,
              { diameter: foliageSize * 0.8, diameterY: foliageSize * 1.3 },
              scene
            );
            break;
          case 2: // Wide tree
            foliage = BABYLON.MeshBuilder.CreateSphere(
              `foliage_${i}`,
              { diameter: foliageSize * 1.2, diameterY: foliageSize * 0.7 },
              scene
            );
            break;
          default:
            foliage = BABYLON.MeshBuilder.CreateSphere(
              `foliage_${i}`,
              { diameter: foliageSize },
              scene
            );
            break;
        }
        
        foliage.position.set(x, trunkHeight + foliageSize / 2, z);
        
        // Natural leaf texture
        const leafTexture = new BABYLON.DynamicTexture(`leaf_${i}`, 128, scene);
        const leafCtx = leafTexture.getContext();
        
        for (let lx = 0; lx < 128; lx += 4) {
          for (let ly = 0; ly < 128; ly += 4) {
            const greenVariation = 0.4 + Math.random() * 0.4;
            const seasonal = isDayMode ? 1 : 0.6;
            leafCtx.fillStyle = `rgb(${greenVariation * 40 * seasonal}, ${greenVariation * 140 * seasonal}, ${greenVariation * 50 * seasonal})`;
            leafCtx.fillRect(lx, ly, 4, 4);
          }
        }
        leafTexture.update();
        
        const foliageMaterial = new BABYLON.StandardMaterial(`foliageMat_${i}`, scene);
        foliageMaterial.diffuseTexture = leafTexture;
        foliageMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        foliage.material = foliageMaterial;
        
        environmentalElements.push(trunk, foliage);
      }
    };
    
    // Create decorative street furniture
    const createStreetFurniture = () => {
      // Benches
      for (let i = 0; i < 8; i++) {
        const benchX = (Math.random() - 0.5) * 180;
        const benchZ = (Math.random() - 0.5) * 180;
        
        const bench = BABYLON.MeshBuilder.CreateBox(
          `bench_${i}`,
          { width: 3, height: 0.8, depth: 1 },
          scene
        );
        bench.position.set(benchX, 0.4, benchZ);
        
        const benchMaterial = new BABYLON.StandardMaterial(`benchMat_${i}`, scene);
        benchMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.25, 0.15);
        benchMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        bench.material = benchMaterial;
        
        environmentalElements.push(bench);
      }
      
      // Enhanced street lights with modern design
      for (let i = 0; i < 15; i++) {
        const lightX = (Math.random() - 0.5) * 200;
        const lightZ = (Math.random() - 0.5) * 200;
        
        // Modern light pole
        const pole = BABYLON.MeshBuilder.CreateCylinder(
          `pole_${i}`,
          { height: 10, diameterTop: 0.15, diameterBottom: 0.4 },
          scene
        );
        pole.position.set(lightX, 5, lightZ);
        
        const poleMaterial = new BABYLON.StandardMaterial(`poleMat_${i}`, scene);
        poleMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        poleMaterial.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
        poleMaterial.specularPower = 32;
        pole.material = poleMaterial;
        
        // LED light fixture
        const lightHead = BABYLON.MeshBuilder.CreateBox(
          `lightHead_${i}`,
          { width: 1, height: 0.3, depth: 1 },
          scene
        );
        lightHead.position.set(lightX, 9.5, lightZ);
        
        const lightMaterial = new BABYLON.StandardMaterial(`lightMat_${i}`, scene);
        lightMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        lightMaterial.emissiveColor = isDayMode ? 
          new BABYLON.Color3(0.1, 0.1, 0.05) : 
          new BABYLON.Color3(0.8, 0.8, 0.4);
        lightMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
        lightHead.material = lightMaterial;
        
        environmentalElements.push(pole, lightHead);
      }
    };
    
    // Execute all landscape creation
    createCentralPark();
    createPlayground();
    createNaturalTrees();
    createStreetFurniture();

    // Animation loop
    scene.registerBeforeRender(() => {
      if (!isAnimationPlaying) return;

      time += animationSpeed;

      // Animate drone patrol
      drone.position.x = Math.sin(time * 0.5) * 40;
      drone.position.z = Math.cos(time * 0.5) * 40;
      drone.position.y = 25 + Math.sin(time * 2) * 3;
      drone.rotation.y = time * 0.5 + Math.PI / 2;

      // Animate sensor pulsing
      sensorMeshes.forEach((sensor, index) => {
        const pulse = 1 + Math.sin(time * 3 + index) * 0.3;
        sensor.scaling = new BABYLON.Vector3(pulse, pulse, pulse);
      });

      // Animate wildlife along natural paths
      wildlife.forEach((animal) => {
        if (animal.path.length === 0) return;
        
        const currentTarget = animal.path[animal.pathIndex];
        const currentPos = animal.mesh.position;
        
        // Move towards current target
        const direction = currentTarget.subtract(currentPos);
        const distance = direction.length();
        
        if (distance < 2) {
          // Reached target, move to next point
          animal.pathIndex = (animal.pathIndex + 1) % animal.path.length;
        } else {
          // Move towards target
          const moveDirection = direction.normalize().scale(animal.speed);
          animal.mesh.position.addInPlace(moveDirection);
          
          // Face movement direction (except birds which can face any direction)
          if (animal.type !== 'bird') {
            animal.mesh.rotation.y = Math.atan2(moveDirection.x, moveDirection.z);
          }
        }
        
        // Add slight bobbing motion for birds
        if (animal.type === 'bird') {
          animal.mesh.position.y += Math.sin(time * 3 + animal.pathIndex) * 0.5;
        }
      });

      // ================ ANIMATE TRAFFIC ================
      traffic.forEach((vehicle) => {
        if (vehicle.path.length === 0) return;
        
        const currentTarget = vehicle.path[vehicle.pathIndex];
        const currentPos = vehicle.car.position;
        
        // Move towards current target
        const direction = currentTarget.subtract(currentPos);
        const distance = direction.length();
        
        if (distance < 3) {
          // Reached target, move to next point
          vehicle.pathIndex = (vehicle.pathIndex + 1) % vehicle.path.length;
        } else {
          // Move towards target
          const moveDirection = direction.normalize().scale(vehicle.speed);
          vehicle.car.position.addInPlace(moveDirection);
          
          // Face movement direction
          vehicle.car.rotation.y = Math.atan2(moveDirection.x, moveDirection.z);
        }
      });

      // ================ ANIMATE PEDESTRIANS ================
      pedestrians.forEach((pedestrian) => {
        if (pedestrian.waitTime > 0) {
          // Person is waiting/paused
          pedestrian.waitTime -= 1;
          return;
        }
        
        if (pedestrian.path.length === 0) return;
        
        const currentTarget = pedestrian.path[pedestrian.pathIndex];
        const currentPos = pedestrian.person.position;
        
        // Move towards current target
        const direction = currentTarget.subtract(currentPos);
        const distance = direction.length();
        
        if (distance < 1) {
          // Reached target, move to next point
          pedestrian.pathIndex = (pedestrian.pathIndex + 1) % pedestrian.path.length;
          
          // Sometimes pause at waypoints (realistic behavior)
          if (Math.random() > 0.85) {
            pedestrian.waitTime = 30 + Math.random() * 60; // Wait 0.5-1.5 seconds
          }
        } else {
          // Move towards target
          const moveDirection = direction.normalize().scale(pedestrian.speed);
          pedestrian.person.position.addInPlace(moveDirection);
          
          // Face movement direction
          pedestrian.person.rotation.y = Math.atan2(moveDirection.x, moveDirection.z);
          
          // Add subtle walking animation (slight bobbing)
          pedestrian.person.position.y = Math.sin(time * 8 + pedestrian.pathIndex) * 0.05;
        }
        
      });

      // Dynamic lighting changes for day/night
      if (isDayMode) {
        hemisphericLight.intensity = 0.8 + Math.sin(time * 0.1) * 0.1;
        directionalLight.intensity = 1.2 + Math.sin(time * 0.1) * 0.2;
      }
      
      // Animate water fountain
      const water = scene.getMeshByName('water');
      if (water) {
        water.position.y = 2.1 + Math.sin(time * 4) * 0.1;
        const waterMaterial = water.material as BABYLON.StandardMaterial;
        if (waterMaterial) {
          waterMaterial.emissiveColor = new BABYLON.Color3(
            0.1 + Math.sin(time * 2) * 0.1,
            0.3 + Math.sin(time * 3) * 0.1,
            0.5 + Math.sin(time * 2.5) * 0.1
          );
        }
      }
      
      // Animate tree foliage swaying
      environmentalElements.forEach((element, index) => {
        if (element.name.includes('foliage')) {
          const swayAmount = 0.02;
          element.rotation.z = Math.sin(time * 0.5 + index * 0.5) * swayAmount;
          element.rotation.x = Math.cos(time * 0.7 + index * 0.3) * swayAmount * 0.5;
        }
      });
    });

    // Handle window resize
    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    // Start render loop
    engine.runRenderLoop(() => scene.render());

    console.log('Building3D: Enhanced scene setup complete');

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [isAnimationPlaying, isDayMode, showSensors]);

  // Camera control functions
  const handleCameraPreset = (preset: string) => {
    if (!sceneRef.current) return;
    
    const camera = sceneRef.current.activeCamera as BABYLON.ArcRotateCamera;
    if (!camera) return;

    switch (preset) {
      case 'overview':
        BABYLON.Animation.CreateAndStartAnimation(
          'cameraToOverview',
          camera,
          'alpha',
          60,
          60,
          camera.alpha,
          -Math.PI / 6,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        BABYLON.Animation.CreateAndStartAnimation(
          'cameraBetaOverview',
          camera,
          'beta',
          60,
          60,
          camera.beta,
          Math.PI / 4,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        BABYLON.Animation.CreateAndStartAnimation(
          'cameraRadiusOverview',
          camera,
          'radius',
          60,
          60,
          camera.radius,
          150,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        break;
      case 'aerial':
        BABYLON.Animation.CreateAndStartAnimation(
          'cameraBetaAerial',
          camera,
          'beta',
          60,
          60,
          camera.beta,
          0.1,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        BABYLON.Animation.CreateAndStartAnimation(
          'cameraRadiusAerial',
          camera,
          'radius',
          60,
          60,
          camera.radius,
          200,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        break;
      case 'street':
        BABYLON.Animation.CreateAndStartAnimation(
          'cameraBetaStreet',
          camera,
          'beta',
          60,
          60,
          camera.beta,
          Math.PI / 2.5,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        BABYLON.Animation.CreateAndStartAnimation(
          'cameraRadiusStreet',
          camera,
          'radius',
          60,
          60,
          camera.radius,
          60,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        break;
    }
    setCurrentView(preset);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="w-8 h-8 text-green-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">NCQ Natural Environment Simulation</h1>
              <p className="text-green-200 text-sm">Real-time 3D Ecosystem & Wildlife Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDayMode(!isDayMode)}
              className={`p-2 rounded-lg transition-all ${
                isDayMode ? 'bg-yellow-500 text-yellow-900' : 'bg-indigo-600 text-white'
              }`}
            >
              {isDayMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsAnimationPlaying(!isAnimationPlaying)}
              className={`p-2 rounded-lg transition-all ${
                isAnimationPlaying ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              {isAnimationPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Control Panel */}
        <div className="w-80 bg-black/30 backdrop-blur-sm border-r border-white/10 p-4 overflow-y-auto">
          {/* Camera Controls */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Camera Views
            </h3>
            <div className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'aerial', label: 'Aerial View', icon: Activity },
                { id: 'street', label: 'Street Level', icon: Users }
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => handleCameraPreset(view.id)}
                  className={`w-full p-2 rounded text-left flex items-center transition-all ${
                    currentView === view.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <view.icon className="w-4 h-4 mr-2" />
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          {/* Natural Structures Status */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Eco-Structures Status
            </h3>
            <div className="space-y-2">
              {systemsData.structures.map((structure) => (
                <div
                  key={structure.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedBuilding === structure.id
                      ? 'bg-green-600/50 border border-green-400'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  onClick={() => setSelectedBuilding(structure.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{structure.name}</span>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: structure.color }}
                    />
                  </div>
                  <div className="text-xs text-gray-300">
                    {structure.visitors}/{structure.capacity} visitors
                  </div>
                  <div className="flex space-x-1 mt-2">
                    {Object.entries(structure.systems).map(([system, status]) => (
                      <div
                        key={system}
                        className={`w-2 h-2 rounded-full ${
                          status === 'optimal' || status === 'controlled' ? 'bg-green-400' :
                          status === 'normal' || status === 'natural' ? 'bg-blue-400' :
                          status === 'minimal' || status === 'ambient' ? 'bg-yellow-400' :
                          status === 'high' ? 'bg-orange-400' :
                          'bg-red-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sensor Data */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Environmental Sensors
              <button
                onClick={() => setShowSensors(!showSensors)}
                className={`ml-auto p-1 rounded text-xs ${
                  showSensors ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                {showSensors ? 'ON' : 'OFF'}
              </button>
            </h3>
            <div className="space-y-2">
              {systemsData.sensors.slice(0, 6).map((sensor) => (
                <div key={sensor.id} className="bg-white/10 p-2 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {sensor.type === 'temperature' && <Thermometer className="w-4 h-4 mr-2 text-orange-400" />}
                      {sensor.type === 'energy' && <Zap className="w-4 h-4 mr-2 text-yellow-400" />}
                      {sensor.type === 'security' && <Shield className="w-4 h-4 mr-2 text-blue-400" />}
                      {sensor.type === 'occupancy' && <Users className="w-4 h-4 mr-2 text-green-400" />}
                      {sensor.type === 'air_quality' && <Wind className="w-4 h-4 mr-2 text-cyan-400" />}
                      {sensor.type === 'connectivity' && <Wifi className="w-4 h-4 mr-2 text-purple-400" />}
                      <span className="text-white text-xs capitalize">
                        {sensor.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      sensor.status === 'optimal' ? 'bg-green-400' :
                      sensor.status === 'good' ? 'bg-blue-400' :
                      sensor.status === 'normal' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`} />
                  </div>
                  <div className="text-white text-sm font-medium mt-1">
                    {sensor.value} {sensor.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Controls */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full p-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                All Systems Normal
              </button>
              <button className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Run Diagnostics
              </button>
              <button className="w-full p-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Optimize Energy
              </button>
            </div>
          </div>
        </div>

        {/* Main 3D View */}
        <div className="flex-1 relative">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
            style={{ touchAction: 'none' }}
          />
          
          {/* Floating Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
              <div className="text-sm font-medium mb-2">Scene Info</div>
              <div className="text-xs space-y-1">
                <div>Structures: {systemsData.structures.length}</div>
                <div>Sensors: {systemsData.sensors.length}</div>
                <div>View: {currentView}</div>
                <div>Mode: {isDayMode ? 'Day' : 'Night'}</div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm">All Systems Operational</span>
                  </div>
                  <div className="text-xs text-gray-300">
                    Total Visitors: {systemsData.structures.reduce((sum, s) => sum + s.visitors, 0)} people
                  </div>
                </div>
                <div className="text-xs text-gray-300">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}