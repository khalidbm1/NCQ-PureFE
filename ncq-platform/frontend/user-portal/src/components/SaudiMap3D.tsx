import { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Map, Sun, Moon } from 'lucide-react';

// Major cities and landmarks in Saudi Arabia
const SAUDI_CITIES = [
  { name: 'Riyadh', lat: 24.7136, lng: 46.6753, population: 7676654, type: 'capital', elevation: 600 },
  { name: 'Jeddah', lat: 21.5428, lng: 39.1728, population: 4610176, type: 'major', elevation: 12 },
  { name: 'Mecca', lat: 21.4225, lng: 39.8262, population: 2042106, type: 'holy', elevation: 277 },
  { name: 'Medina', lat: 24.5247, lng: 39.5692, population: 1488782, type: 'holy', elevation: 608 },
  { name: 'Dammam', lat: 26.4367, lng: 50.1033, population: 1252523, type: 'major', elevation: 10 },
  { name: 'Tabuk', lat: 28.3989, lng: 36.5659, population: 594350, type: 'regional', elevation: 760 },
  { name: 'Abha', lat: 18.2164, lng: 42.5053, population: 462024, type: 'regional', elevation: 2270 },
  { name: 'NEOM', lat: 28.0473, lng: 35.2697, population: 0, type: 'future', elevation: 50 },
  { name: 'Al-Ula', lat: 26.6087, lng: 37.9250, population: 32413, type: 'heritage', elevation: 650 },
];

const LANDMARKS = [
  { name: 'Kaaba', lat: 21.4225, lng: 39.8262, type: 'religious', icon: '🕋' },
  { name: 'Kingdom Centre', lat: 24.7136, lng: 46.6753, type: 'modern', icon: '🏙️' },
  { name: 'Red Sea Project', lat: 22.8833, lng: 38.3000, type: 'development', icon: '🏖️' },
  { name: 'Empty Quarter', lat: 19.5000, lng: 47.0000, type: 'natural', icon: '🏜️' },
  { name: 'Edge of the World', lat: 24.8801, lng: 46.4235, type: 'natural', icon: '⛰️' },
];

interface SaudiMap3DProps {
  selectedCity?: string;
  onCitySelect?: (city: string) => void;
  viewMode?: 'terrain' | 'political' | 'tourism' | 'development';
}

export default function SaudiMap3D({ selectedCity, onCitySelect }: SaudiMap3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const [isDay, setIsDay] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Babylon.js
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    engineRef.current = engine;

    // Create scene
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;
    
    // Sky color based on day/night
    scene.clearColor = isDay 
      ? new BABYLON.Color4(0.52, 0.81, 0.92, 1) // Day sky
      : new BABYLON.Color4(0.05, 0.05, 0.2, 1); // Night sky

    // Create camera
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 3,
      100,
      new BABYLON.Vector3(45, 0, 23), // Center of Saudi Arabia
      scene
    );
    camera.minZ = 0.1;
    camera.lowerRadiusLimit = 30;
    camera.upperRadiusLimit = 200;
    camera.attachControl(canvas, true);

    // Enhanced lighting
    if (isDay) {
      const sunLight = new BABYLON.DirectionalLight('sun', new BABYLON.Vector3(-1, -2, -1), scene);
      sunLight.intensity = 1.2;
      sunLight.position = new BABYLON.Vector3(20, 40, 20);
      
      const shadowGenerator = new BABYLON.ShadowGenerator(2048, sunLight);
      shadowGenerator.useBlurExponentialShadowMap = true;
      
      const ambient = new BABYLON.HemisphericLight('ambient', new BABYLON.Vector3(0, 1, 0), scene);
      ambient.intensity = 0.4;
    } else {
      const moonLight = new BABYLON.DirectionalLight('moon', new BABYLON.Vector3(-0.5, -1, -0.5), scene);
      moonLight.intensity = 0.3;
      moonLight.diffuse = new BABYLON.Color3(0.7, 0.7, 1);
      
      const starLight = new BABYLON.HemisphericLight('stars', new BABYLON.Vector3(0, 1, 0), scene);
      starLight.intensity = 0.2;
      starLight.diffuse = new BABYLON.Color3(0.5, 0.5, 0.8);
    }

    // Create Saudi Arabia map base with accurate shape
    const createSaudiMap = () => {
      // Simplified Saudi Arabia border coordinates
      const saudiBorder = [
        new BABYLON.Vector3(35, 0, 32), // Northwest
        new BABYLON.Vector3(40, 0, 31),
        new BABYLON.Vector3(44, 0, 29),
        new BABYLON.Vector3(48, 0, 30), // Northeast
        new BABYLON.Vector3(52, 0, 27),
        new BABYLON.Vector3(55, 0, 23),
        new BABYLON.Vector3(56, 0, 18), // East
        new BABYLON.Vector3(53, 0, 16),
        new BABYLON.Vector3(50, 0, 17),
        new BABYLON.Vector3(47, 0, 16), // Southeast
        new BABYLON.Vector3(44, 0, 17),
        new BABYLON.Vector3(42, 0, 19),
        new BABYLON.Vector3(40, 0, 16), // South
        new BABYLON.Vector3(38, 0, 18),
        new BABYLON.Vector3(36, 0, 21),
        new BABYLON.Vector3(35, 0, 25), // Southwest
        new BABYLON.Vector3(34, 0, 28),
        new BABYLON.Vector3(35, 0, 32), // Back to Northwest
      ];

      // Create the base terrain
      const ground = BABYLON.MeshBuilder.CreateGround('saudi-ground', { width: 40, height: 30 }, scene);
      ground.position.set(45, -0.5, 23);
      
      // Create terrain material
      const terrainMat = new BABYLON.PBRMaterial('terrainMat', scene);
      terrainMat.albedoColor = new BABYLON.Color3(0.9, 0.8, 0.6); // Desert sand color
      terrainMat.metallic = 0;
      terrainMat.roughness = 0.9;
      
      // Add terrain texture
      const terrainTexture = new BABYLON.DynamicTexture('terrainTexture', { width: 1024, height: 1024 }, scene);
      const ctx = terrainTexture.getContext();
      
      // Desert base
      const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
      gradient.addColorStop(0, '#F4E5C2');
      gradient.addColorStop(0.5, '#E8D4A0');
      gradient.addColorStop(1, '#D4B896');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Add sand dune patterns
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        ctx.arc(x, y, Math.random() * 100 + 50, 0, Math.PI * 2);
        ctx.fillStyle = '#E8D4A0';
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      
      terrainTexture.update();
      terrainMat.albedoTexture = terrainTexture;
      ground.material = terrainMat;
      ground.receiveShadows = true;

      // Create elevated border outline
      const borderLine = BABYLON.MeshBuilder.CreateLines('border', { points: saudiBorder }, scene);
      borderLine.color = new BABYLON.Color3(0.2, 0.5, 0.2);
      borderLine.position.y = 0.1;

      // Create 3D border wall
      const borderWall = BABYLON.MeshBuilder.CreateRibbon('borderWall', {
        pathArray: [
          saudiBorder,
          saudiBorder.map(p => new BABYLON.Vector3(p.x, 2, p.z))
        ],
        closeArray: true,
        closePath: true
      }, scene);
      
      const borderMat = new BABYLON.StandardMaterial('borderMat', scene);
      borderMat.diffuseColor = new BABYLON.Color3(0.3, 0.6, 0.3);
      borderMat.alpha = 0.3;
      borderWall.material = borderMat;
    };

    // Create cities with 3D markers
    const createCities = () => {
      SAUDI_CITIES.forEach((city) => {
        // Convert lat/lng to scene coordinates
        const x = city.lng - 10; // Adjust for scene positioning
        const z = city.lat;
        const y = city.elevation / 1000; // Convert to scene scale

        // City marker based on type
        let cityMesh: BABYLON.Mesh;
        let color: BABYLON.Color3;

        switch (city.type) {
          case 'capital':
            cityMesh = BABYLON.MeshBuilder.CreateCylinder(city.name, { 
              diameterTop: 0, 
              diameterBottom: 2, 
              height: 5 
            }, scene);
            color = new BABYLON.Color3(1, 0.8, 0); // Gold
            break;
          case 'holy':
            cityMesh = BABYLON.MeshBuilder.CreateBox(city.name, { size: 3 }, scene);
            color = new BABYLON.Color3(0, 0.8, 0); // Green
            break;
          case 'future':
            cityMesh = BABYLON.MeshBuilder.CreatePolyhedron(city.name, { 
              type: 1, 
              size: 2 
            }, scene);
            color = new BABYLON.Color3(0, 0.8, 1); // Cyan
            break;
          default:
            cityMesh = BABYLON.MeshBuilder.CreateSphere(city.name, { diameter: 2 }, scene);
            color = new BABYLON.Color3(0.8, 0.2, 0.2); // Red
        }

        cityMesh.position.set(x, y + 1, z);

        // City material
        const cityMat = new BABYLON.PBRMaterial(`${city.name}Mat`, scene);
        cityMat.albedoColor = color;
        cityMat.metallic = 0.3;
        cityMat.roughness = 0.4;
        cityMat.emissiveColor = color.scale(0.3);
        cityMesh.material = cityMat;

        // Add glow effect for selected city
        if (selectedCity === city.name) {
          cityMat.emissiveColor = color.scale(0.8);
          
          // Add selection ring
          const ring = BABYLON.MeshBuilder.CreateTorus('selectionRing', {
            diameter: 4,
            thickness: 0.3
          }, scene);
          ring.position = cityMesh.position.clone();
          ring.position.y += 0.5;
          
          const ringMat = new BABYLON.StandardMaterial('ringMat', scene);
          ringMat.emissiveColor = color;
          ring.material = ringMat;
          
          // Animate ring
          scene.registerBeforeRender(() => {
            ring.rotation.y += 0.02 * animationSpeed;
          });
        }

        // City label
        if (showLabels) {
          const label = BABYLON.MeshBuilder.CreatePlane(`${city.name}Label`, { width: 6, height: 2 }, scene);
          label.position = cityMesh.position.clone();
          label.position.y += 4;
          label.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
          
          const labelTexture = new BABYLON.DynamicTexture(`${city.name}LabelTex`, { width: 256, height: 64 }, scene);
          const labelCtx = labelTexture.getContext();
          labelCtx.font = 'bold 24px Arial';
          labelCtx.fillStyle = 'white';
          labelCtx.strokeStyle = 'black';
          labelCtx.lineWidth = 3;
          (labelCtx as any).textAlign = 'center';
          labelCtx.strokeText(city.name, 128, 32);
          labelCtx.fillText(city.name, 128, 32);
          
          if (city.population > 0) {
            labelCtx.font = '16px Arial';
            labelCtx.strokeText(`Pop: ${(city.population / 1000000).toFixed(1)}M`, 128, 50);
            labelCtx.fillText(`Pop: ${(city.population / 1000000).toFixed(1)}M`, 128, 50);
          }
          
          labelTexture.update();
          
          const labelMat = new BABYLON.StandardMaterial(`${city.name}LabelMat`, scene);
          labelMat.diffuseTexture = labelTexture;
          labelMat.emissiveTexture = labelTexture;
          labelMat.backFaceCulling = false;
          labelMat.disableLighting = true;
          label.material = labelMat;
        }

        // Add click interaction
        cityMesh.actionManager = new BABYLON.ActionManager(scene);
        cityMesh.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => onCitySelect?.(city.name)
          )
        );

        // Population indicator (vertical bars)
        if (city.population > 0) {
          const popHeight = Math.log10(city.population) * 0.5;
          const popBar = BABYLON.MeshBuilder.CreateCylinder(`${city.name}Pop`, {
            diameter: 0.5,
            height: popHeight
          }, scene);
          popBar.position = cityMesh.position.clone();
          popBar.position.y += popHeight / 2;
          
          const popMat = new BABYLON.StandardMaterial(`${city.name}PopMat`, scene);
          popMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 1);
          popMat.alpha = 0.7;
          popBar.material = popMat;
        }
      });
    };

    // Create landmarks
    const createLandmarks = () => {
      LANDMARKS.forEach((landmark) => {
        const x = landmark.lng - 10;
        const z = landmark.lat;

        // Create landmark marker
        const landmarkMesh = BABYLON.MeshBuilder.CreateBox(landmark.name, { size: 1 }, scene);
        landmarkMesh.position.set(x, 0.5, z);

        // Create icon plane
        const iconPlane = BABYLON.MeshBuilder.CreatePlane(`${landmark.name}Icon`, { size: 2 }, scene);
        iconPlane.position = landmarkMesh.position.clone();
        iconPlane.position.y += 2;
        iconPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

        const iconTexture = new BABYLON.DynamicTexture(`${landmark.name}IconTex`, { width: 64, height: 64 }, scene);
        const iconCtx = iconTexture.getContext();
        iconCtx.font = '48px Arial';
        (iconCtx as any).textAlign = 'center';
        iconCtx.fillText(landmark.icon, 32, 48);
        iconTexture.update();

        const iconMat = new BABYLON.StandardMaterial(`${landmark.name}IconMat`, scene);
        iconMat.diffuseTexture = iconTexture;
        iconMat.emissiveTexture = iconTexture;
        iconMat.backFaceCulling = false;
        iconMat.disableLighting = true;
        iconPlane.material = iconMat;
      });
    };

    // Create transportation routes
    const createTransportRoutes = () => {
      // Major highways
      const highways = [
        { from: 'Riyadh', to: 'Dammam', color: new BABYLON.Color3(0.8, 0.2, 0.2) },
        { from: 'Riyadh', to: 'Jeddah', color: new BABYLON.Color3(0.8, 0.2, 0.2) },
        { from: 'Jeddah', to: 'Mecca', color: new BABYLON.Color3(0.2, 0.8, 0.2) },
        { from: 'Mecca', to: 'Medina', color: new BABYLON.Color3(0.2, 0.8, 0.2) },
        { from: 'Riyadh', to: 'NEOM', color: new BABYLON.Color3(0.2, 0.2, 0.8) },
      ];

      highways.forEach((route) => {
        const fromCity = SAUDI_CITIES.find(c => c.name === route.from);
        const toCity = SAUDI_CITIES.find(c => c.name === route.to);
        
        if (fromCity && toCity) {
          const points = [
            new BABYLON.Vector3(fromCity.lng - 10, 0.1, fromCity.lat),
            new BABYLON.Vector3(toCity.lng - 10, 0.1, toCity.lat)
          ];
          
          const highway = BABYLON.MeshBuilder.CreateLines(`highway-${route.from}-${route.to}`, { points }, scene);
          highway.color = route.color;
        }
      });

      // Animated planes/vehicles
      const createVehicle = (routeIndex: number) => {
        const route = highways[routeIndex % highways.length];
        const fromCity = SAUDI_CITIES.find(c => c.name === route.from);
        const toCity = SAUDI_CITIES.find(c => c.name === route.to);
        
        if (fromCity && toCity) {
          const vehicle = BABYLON.MeshBuilder.CreateBox('vehicle', { width: 0.5, height: 0.3, depth: 1 }, scene);
          vehicle.position.set(fromCity.lng - 10, 1, fromCity.lat);
          
          const vehicleMat = new BABYLON.StandardMaterial('vehicleMat', scene);
          vehicleMat.emissiveColor = new BABYLON.Color3(1, 1, 0);
          vehicle.material = vehicleMat;
          
          // Animate along route
          let progress = 0;
          scene.registerBeforeRender(() => {
            progress += 0.005 * animationSpeed;
            if (progress > 1) progress = 0;
            
            vehicle.position.x = BABYLON.Scalar.Lerp(fromCity.lng - 10, toCity.lng - 10, progress);
            vehicle.position.z = BABYLON.Scalar.Lerp(fromCity.lat, toCity.lat, progress);
            
            // Face direction of travel
            const direction = new BABYLON.Vector3(
              toCity.lng - fromCity.lng,
              0,
              toCity.lat - fromCity.lat
            ).normalize();
            vehicle.rotation.y = Math.atan2(direction.x, direction.z);
          });
        }
      };

      // Create multiple vehicles
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createVehicle(i), i * 2000);
      }
    };

    // Create terrain features
    const createTerrainFeatures = () => {
      // Mountains (Asir Mountains)
      for (let i = 0; i < 5; i++) {
        const mountain = BABYLON.MeshBuilder.CreateCylinder('mountain', {
          diameterTop: 1,
          diameterBottom: 4,
          height: 3 + Math.random() * 2
        }, scene);
        mountain.position.set(
          32 + Math.random() * 5,
          1.5,
          18 + Math.random() * 4
        );
        
        const mountainMat = new BABYLON.StandardMaterial('mountainMat', scene);
        mountainMat.diffuseColor = new BABYLON.Color3(0.5, 0.4, 0.3);
        mountain.material = mountainMat;
      }

      // Empty Quarter sand dunes
      for (let i = 0; i < 10; i++) {
        const dune = BABYLON.MeshBuilder.CreateSphere('dune', {
          diameter: 3 + Math.random() * 2,
          segments: 8
        }, scene);
        dune.position.set(
          37 + Math.random() * 10,
          0,
          19 + Math.random() * 5
        );
        dune.scaling.y = 0.3;
        
        const duneMat = new BABYLON.StandardMaterial('duneMat', scene);
        duneMat.diffuseColor = new BABYLON.Color3(0.96, 0.87, 0.7);
        dune.material = duneMat;
      }

      // Red Sea coastline
      const sea = BABYLON.MeshBuilder.CreateGround('sea', { width: 10, height: 40 }, scene);
      sea.position.set(29, -0.2, 23);
      
      const seaMat = new BABYLON.PBRMaterial('seaMat', scene);
      seaMat.albedoColor = new BABYLON.Color3(0, 0.3, 0.5);
      seaMat.metallic = 0.0;
      seaMat.roughness = 0.1;
      seaMat.alpha = 0.8;
      sea.material = seaMat;

      // Arabian Gulf
      const gulf = BABYLON.MeshBuilder.CreateGround('gulf', { width: 15, height: 20 }, scene);
      gulf.position.set(60, -0.2, 26);
      gulf.material = seaMat;
    };

    // Weather effects
    const createWeatherEffects = () => {
      if (!isDay) {
        // Stars for night sky
        const starfield = new BABYLON.ParticleSystem('stars', 1000, scene);
        starfield.particleTexture = new BABYLON.Texture('', scene); // Use default particle
        starfield.emitter = new BABYLON.Vector3(45, 50, 23);
        starfield.minEmitBox = new BABYLON.Vector3(-50, 0, -50);
        starfield.maxEmitBox = new BABYLON.Vector3(50, 0, 50);
        starfield.color1 = new BABYLON.Color4(1, 1, 1, 1);
        starfield.color2 = new BABYLON.Color4(0.8, 0.8, 1, 1);
        starfield.minSize = 0.1;
        starfield.maxSize = 0.3;
        starfield.minLifeTime = 999999;
        starfield.maxLifeTime = 999999;
        starfield.emitRate = 100;
        starfield.start();
      }

      // Sandstorm effect (occasional)
      if (Math.random() > 0.7) {
        const sandstorm = new BABYLON.ParticleSystem('sandstorm', 2000, scene);
        const sandTexture = new BABYLON.DynamicTexture('sandTexture', { width: 16, height: 16 }, scene);
        const sandCtx = sandTexture.getContext();
        sandCtx.fillStyle = '#D4B896';
        sandCtx.fillRect(0, 0, 16, 16);
        sandTexture.update();
        sandstorm.particleTexture = sandTexture;
        
        sandstorm.emitter = new BABYLON.Vector3(30, 0, 20);
        sandstorm.minEmitBox = new BABYLON.Vector3(-20, 0, -20);
        sandstorm.maxEmitBox = new BABYLON.Vector3(20, 5, 20);
        sandstorm.direction1 = new BABYLON.Vector3(1, 0.1, 0);
        sandstorm.direction2 = new BABYLON.Vector3(1, 0.3, 0.2);
        sandstorm.minSize = 0.5;
        sandstorm.maxSize = 2;
        sandstorm.minLifeTime = 1;
        sandstorm.maxLifeTime = 3;
        sandstorm.emitRate = 100;
        sandstorm.color1 = new BABYLON.Color4(0.8, 0.7, 0.5, 0.3);
        sandstorm.color2 = new BABYLON.Color4(0.9, 0.8, 0.6, 0.1);
        sandstorm.start();
      }
    };

    // Initialize all components
    createSaudiMap();
    createCities();
    createLandmarks();
    createTransportRoutes();
    createTerrainFeatures();
    createWeatherEffects();

    // Animation loop
    let time = 0;
    scene.registerBeforeRender(() => {
      time += engine.getDeltaTime() * 0.001;
      
      // Animate water
      const water = scene.getMeshByName('sea');
      if (water) {
        water.position.y = -0.2 + Math.sin(time) * 0.05;
      }
      
      const gulf = scene.getMeshByName('gulf');
      if (gulf) {
        gulf.position.y = -0.2 + Math.sin(time + 1) * 0.05;
      }
    });

    // Handle resize
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
  }, [isDay, showLabels, selectedCity, onCitySelect, animationSpeed]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-6 w-6" />
              Kingdom of Saudi Arabia - 3D Interactive Map
            </CardTitle>
            <CardDescription>
              Explore cities, landmarks, and development projects across the Kingdom
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDay(!isDay)}
            >
              {isDay ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => setShowLabels(!showLabels)}
            >
              Labels {showLabels ? 'On' : 'Off'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnimationSpeed(animationSpeed === 1 ? 2 : 1)}
            >
              Speed {animationSpeed}x
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-[600px] rounded-lg"
            style={{ touchAction: 'none' }}
          />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg">
            <h4 className="font-semibold mb-2">Legend</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span>Capital City</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>Holy Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-500 rounded" />
                <span>Future Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span>Major Cities</span>
              </div>
            </div>
          </div>
          
          {/* Selected City Info */}
          {selectedCity && (
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg max-w-xs">
              <h4 className="font-semibold mb-2">{selectedCity}</h4>
              {SAUDI_CITIES.find(c => c.name === selectedCity) && (
                <div className="space-y-1 text-sm">
                  <p>Population: {SAUDI_CITIES.find(c => c.name === selectedCity)?.population.toLocaleString()}</p>
                  <p>Elevation: {SAUDI_CITIES.find(c => c.name === selectedCity)?.elevation}m</p>
                  <p>Type: {SAUDI_CITIES.find(c => c.name === selectedCity)?.type}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}