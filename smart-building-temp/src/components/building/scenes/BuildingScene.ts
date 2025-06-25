/**
 * BuildingScene - Main Babylon.js scene for 3D building visualization
 */

import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { IoTDevice, SmartSpace, DeviceStatus } from '@/types/iot';
import { CameraController } from './CameraController';
import { IoTDeviceManager } from './IoTDeviceManager';

export class BuildingScene {
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.ArcRotateCamera;
  private cameraController: CameraController;
  private deviceManager: IoTDeviceManager;
  private canvas: HTMLCanvasElement;
  
  // Building structure
  private floors: Map<number, BABYLON.Mesh> = new Map();
  private rooms: Map<string, BABYLON.Mesh> = new Map();
  private currentFloor: number = 1;
  
  // Callbacks
  public onRoomSelect?: (roomId: string | null) => void;
  
  // Settings
  private showDevices: boolean = true;
  private showHeatmap: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true
    });
    
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0.95, 0.95, 0.95, 1);
    
    // Initialize camera
    this.camera = new BABYLON.ArcRotateCamera(
      'Camera',
      Math.PI / 4,
      Math.PI / 3,
      50,
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    );
    
    this.cameraController = new CameraController(this.camera, this.scene);
    this.deviceManager = new IoTDeviceManager(this.scene);
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  public initialize(): void {
    // Set up camera
    this.camera.attachControl(this.canvas, true);
    this.camera.lowerRadiusLimit = 20;
    this.camera.upperRadiusLimit = 100;
    this.camera.lowerBetaLimit = 0.1;
    this.camera.upperBetaLimit = Math.PI / 2 - 0.1;
    
    // Set up lights
    const light1 = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light1.intensity = 0.7;
    
    const light2 = new BABYLON.DirectionalLight(
      'light2',
      new BABYLON.Vector3(-1, -2, -1),
      this.scene
    );
    light2.position = new BABYLON.Vector3(20, 40, 20);
    light2.intensity = 0.5;
    
    // Enable shadows
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
    shadowGenerator.useBlurExponentialShadowMap = true;
    
    // Create building structure
    this.createBuilding();
    
    // Set up interactions
    this.setupInteractions();
    
    // Start render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  private createBuilding(): void {
    // Create ground
    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground',
      { width: 60, height: 40 },
      this.scene
    );
    const groundMaterial = new BABYLON.StandardMaterial('groundMat', this.scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    
    // Create building floors
    for (let floor = 1; floor <= 5; floor++) {
      this.createFloor(floor);
    }
    
    // Show only first floor initially
    this.setActiveFloor(1);
  }

  private createFloor(floorNumber: number): void {
    const floorHeight = 3.5;
    const floorY = (floorNumber - 1) * floorHeight;
    
    // Create floor mesh group
    const floorMesh = new BABYLON.Mesh(`floor_${floorNumber}`, this.scene);
    floorMesh.position.y = floorY;
    
    // Create floor base
    const floorBase = BABYLON.MeshBuilder.CreateBox(
      `floorBase_${floorNumber}`,
      { width: 50, height: 0.3, depth: 30 },
      this.scene
    );
    floorBase.position.y = 0;
    floorBase.parent = floorMesh;
    
    const floorMaterial = new BABYLON.StandardMaterial(`floorMat_${floorNumber}`, this.scene);
    floorMaterial.diffuseColor = new BABYLON.Color3(0.95, 0.95, 0.95);
    floorBase.material = floorMaterial;
    
    // Create rooms
    const roomLayout = [
      { id: '101', x: -20, z: -10, width: 8, depth: 8 },
      { id: '102', x: -10, z: -10, width: 8, depth: 8 },
      { id: '103', x: 0, z: -10, width: 8, depth: 8 },
      { id: '104', x: 10, z: -10, width: 8, depth: 8 },
      { id: '105', x: 20, z: -10, width: 8, depth: 8 },
      { id: '106', x: -20, z: 10, width: 8, depth: 8 },
      { id: '107', x: -10, z: 10, width: 8, depth: 8 },
      { id: '108', x: 0, z: 10, width: 12, depth: 8 }, // Larger room
      { id: '109', x: 15, z: 10, width: 10, depth: 8 }
    ];
    
    roomLayout.forEach(room => {
      const roomId = `${floorNumber}${room.id.substring(1)}`;
      this.createRoom(
        roomId,
        room.x,
        0.15,
        room.z,
        room.width,
        floorHeight - 0.3,
        room.depth,
        floorMesh
      );
    });
    
    // Create corridors
    const corridor = BABYLON.MeshBuilder.CreateBox(
      `corridor_${floorNumber}`,
      { width: 50, height: floorHeight - 0.3, depth: 4 },
      this.scene
    );
    corridor.position.set(0, (floorHeight - 0.3) / 2, 0);
    corridor.parent = floorMesh;
    
    const corridorMaterial = new BABYLON.StandardMaterial(`corridorMat_${floorNumber}`, this.scene);
    corridorMaterial.diffuseColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    corridorMaterial.alpha = 0.3;
    corridor.material = corridorMaterial;
    
    this.floors.set(floorNumber, floorMesh);
  }

  private createRoom(
    id: string,
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    depth: number,
    parent: BABYLON.Mesh
  ): void {
    // Create room walls with transparent material
    const room = BABYLON.MeshBuilder.CreateBox(
      `room_${id}`,
      { width, height, depth },
      this.scene
    );
    room.position.set(x, y + height / 2, z);
    room.parent = parent;
    
    // Create room material
    const roomMaterial = new BABYLON.StandardMaterial(`roomMat_${id}`, this.scene);
    roomMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.9);
    roomMaterial.alpha = 0.3;
    roomMaterial.backFaceCulling = false;
    room.material = roomMaterial;
    
    // Store room reference
    this.rooms.set(id, room);
    
    // Add room label
    const label = BABYLON.MeshBuilder.CreatePlane(`label_${id}`, { width: 4, height: 1 }, this.scene);
    label.position.set(x, y + height + 0.5, z);
    label.parent = parent;
    
    const labelTexture = new BABYLON.DynamicTexture(`labelTex_${id}`, { width: 256, height: 64 }, this.scene);
    labelTexture.drawText(`Room ${id}`, null, null, '32px Arial', 'black', 'white');
    
    const labelMaterial = new BABYLON.StandardMaterial(`labelMat_${id}`, this.scene);
    labelMaterial.diffuseTexture = labelTexture;
    labelMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    labelMaterial.backFaceCulling = false;
    label.material = labelMaterial;
    label.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
  }

  private setupInteractions(): void {
    // Room selection
    this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK && pointerInfo.pickInfo?.hit) {
        const mesh = pointerInfo.pickInfo.pickedMesh;
        if (mesh && mesh.name.startsWith('room_')) {
          const roomId = mesh.name.replace('room_', '');
          this.selectRoom(roomId);
        }
      }
    });
  }

  private selectRoom(roomId: string): void {
    // Reset all room colors
    this.rooms.forEach((room, id) => {
      const material = room.material as BABYLON.StandardMaterial;
      if (material) {
        material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.9);
        material.alpha = 0.3;
      }
    });
    
    // Highlight selected room
    const selectedRoom = this.rooms.get(roomId);
    if (selectedRoom && selectedRoom.material) {
      const material = selectedRoom.material as BABYLON.StandardMaterial;
      material.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8);
      material.alpha = 0.5;
      
      // Animate camera to focus on room
      this.cameraController.focusOnMesh(selectedRoom);
    }
    
    // Trigger callback
    this.onRoomSelect?.(roomId);
  }

  public updateRooms(roomsData: SmartSpace[]): void {
    roomsData.forEach(roomData => {
      const room = this.rooms.get(roomData.spaceNumber);
      if (room && room.material) {
        const material = room.material as BABYLON.StandardMaterial;
        
        // Update room color based on occupancy
        const occupancyRate = roomData.occupancy.current / roomData.occupancy.maximum;
        if (occupancyRate === 0) {
          material.diffuseColor = new BABYLON.Color3(0.4, 0.8, 0.4); // Green
        } else if (occupancyRate < 0.5) {
          material.diffuseColor = new BABYLON.Color3(0.4, 0.6, 0.8); // Blue
        } else if (occupancyRate < 0.8) {
          material.diffuseColor = new BABYLON.Color3(0.8, 0.6, 0.4); // Orange
        } else {
          material.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.4); // Red
        }
      }
    });
  }

  public updateDevices(devices: IoTDevice[]): void {
    this.deviceManager.updateDevices(devices);
  }

  public updateDevice(device: IoTDevice): void {
    this.deviceManager.updateDevice(device);
  }

  public setActiveFloor(floor: number): void {
    this.currentFloor = floor;
    
    // Hide all floors
    this.floors.forEach((floorMesh, floorNumber) => {
      floorMesh.setEnabled(false);
    });
    
    // Show selected floor
    const activeFloor = this.floors.get(floor);
    if (activeFloor) {
      activeFloor.setEnabled(true);
      
      // Animate camera to floor level
      this.cameraController.moveToFloor(floor);
    }
    
    // Update device visibility
    this.deviceManager.setActiveFloor(floor);
  }

  public setDeviceVisibility(visible: boolean): void {
    this.showDevices = visible;
    this.deviceManager.setVisibility(visible);
  }

  public setHeatmapMode(enabled: boolean): void {
    this.showHeatmap = enabled;
    // TODO: Implement heatmap visualization
  }

  public zoomIn(): void {
    this.cameraController.zoomIn();
  }

  public zoomOut(): void {
    this.cameraController.zoomOut();
  }

  public resetCamera(): void {
    this.cameraController.reset();
  }

  public dispose(): void {
    this.engine.dispose();
  }
}