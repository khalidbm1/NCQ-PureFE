/**
 * IoTDeviceManager - Manages 3D representation of IoT devices
 */

import * as BABYLON from '@babylonjs/core';
import { IoTDevice, DeviceType, DeviceStatus } from '@/types/iot';

export class IoTDeviceManager {
  private scene: BABYLON.Scene;
  private devices: Map<string, BABYLON.Mesh> = new Map();
  private deviceGroup: BABYLON.Mesh;
  private currentFloor: number = 1;
  private isVisible: boolean = true;

  // Device type icons/meshes
  private deviceTemplates: Map<DeviceType, BABYLON.Mesh> = new Map();

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.deviceGroup = new BABYLON.Mesh('deviceGroup', scene);
    this.createDeviceTemplates();
  }

  /**
   * Create template meshes for different device types
   */
  private createDeviceTemplates(): void {
    // Temperature Sensor
    const tempSensor = BABYLON.MeshBuilder.CreateSphere(
      'tempSensorTemplate',
      { diameter: 0.5 },
      this.scene
    );
    const tempMat = new BABYLON.StandardMaterial('tempMat', this.scene);
    tempMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 1);
    tempMat.emissiveColor = new BABYLON.Color3(0.1, 0.3, 0.5);
    tempSensor.material = tempMat;
    tempSensor.setEnabled(false);
    this.deviceTemplates.set(DeviceType.TEMPERATURE_SENSOR, tempSensor);

    // Motion Sensor
    const motionSensor = BABYLON.MeshBuilder.CreateCylinder(
      'motionSensorTemplate',
      { diameter: 0.4, height: 0.3 },
      this.scene
    );
    const motionMat = new BABYLON.StandardMaterial('motionMat', this.scene);
    motionMat.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.2);
    motionMat.emissiveColor = new BABYLON.Color3(0.4, 0.2, 0.1);
    motionSensor.material = motionMat;
    motionSensor.setEnabled(false);
    this.deviceTemplates.set(DeviceType.MOTION_SENSOR, motionSensor);

    // Light
    const light = BABYLON.MeshBuilder.CreateCylinder(
      'lightTemplate',
      { diameter: 0.8, height: 0.2 },
      this.scene
    );
    const lightMat = new BABYLON.StandardMaterial('lightMat', this.scene);
    lightMat.diffuseColor = new BABYLON.Color3(1, 0.9, 0.3);
    lightMat.emissiveColor = new BABYLON.Color3(0.5, 0.45, 0.15);
    light.material = lightMat;
    light.setEnabled(false);
    this.deviceTemplates.set(DeviceType.LIGHT_CONTROLLER, light);

    // Security Camera
    const camera = BABYLON.MeshBuilder.CreateBox(
      'cameraTemplate',
      { width: 0.3, height: 0.3, depth: 0.4 },
      this.scene
    );
    const cameraMat = new BABYLON.StandardMaterial('cameraMat', this.scene);
    cameraMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    camera.material = cameraMat;
    camera.setEnabled(false);
    this.deviceTemplates.set(DeviceType.CAMERA, camera);

    // Access Point
    const accessPoint = BABYLON.MeshBuilder.CreateBox(
      'accessPointTemplate',
      { width: 0.6, height: 0.1, depth: 0.6 },
      this.scene
    );
    const apMat = new BABYLON.StandardMaterial('apMat', this.scene);
    apMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    accessPoint.material = apMat;
    accessPoint.setEnabled(false);
    this.deviceTemplates.set(DeviceType.DISPLAY_PANEL, accessPoint);

    // HVAC
    const hvac = BABYLON.MeshBuilder.CreateBox(
      'hvacTemplate',
      { width: 1, height: 0.3, depth: 1 },
      this.scene
    );
    const hvacMat = new BABYLON.StandardMaterial('hvacMat', this.scene);
    hvacMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    hvac.material = hvacMat;
    hvac.setEnabled(false);
    this.deviceTemplates.set(DeviceType.HVAC_CONTROLLER, hvac);
  }

  /**
   * Update all devices
   */
  public updateDevices(devices: IoTDevice[]): void {
    // Clear existing devices
    this.clearDevices();

    // Create new device meshes
    devices.forEach(device => {
      this.createDeviceMesh(device);
    });
  }

  /**
   * Update a single device
   */
  public updateDevice(device: IoTDevice): void {
    const existingMesh = this.devices.get(device.id);
    if (existingMesh) {
      // Update status indicator
      this.updateDeviceStatus(existingMesh, device.status);
    } else {
      // Create new device
      this.createDeviceMesh(device);
    }
  }

  /**
   * Create a 3D mesh for a device
   */
  private createDeviceMesh(device: IoTDevice): void {
    const template = this.deviceTemplates.get(device.type);
    if (!template) return;

    // Clone template
    const deviceMesh = template.clone(`device_${device.id}`);
    deviceMesh.parent = this.deviceGroup;
    
    // Position device
    if (device.location.coordinates) {
      const floorHeight = 3.5;
      const y = (device.location.floor - 1) * floorHeight + 2.5; // Near ceiling
      deviceMesh.position = new BABYLON.Vector3(
        device.location.coordinates.x,
        y,
        device.location.coordinates.y // Z in 3D space
      );
    }

    // Create status indicator
    const statusIndicator = BABYLON.MeshBuilder.CreateSphere(
      `status_${device.id}`,
      { diameter: 0.2 },
      this.scene
    );
    statusIndicator.parent = deviceMesh;
    statusIndicator.position.y = 0.4;
    
    this.updateDeviceStatus(deviceMesh, device.status);

    // Add hover effect
    deviceMesh.actionManager = new BABYLON.ActionManager(this.scene);
    deviceMesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        () => {
          this.showDeviceTooltip(device);
        }
      )
    );

    // Store reference
    this.devices.set(device.id, deviceMesh);
    
    // Set visibility based on floor
    deviceMesh.setEnabled(
      device.location.floor === this.currentFloor && this.isVisible
    );
  }

  /**
   * Update device status visual
   */
  private updateDeviceStatus(mesh: BABYLON.Mesh, status: DeviceStatus): void {
    const statusIndicator = mesh.getChildMeshes().find(m => m.name.startsWith('status_'));
    if (!statusIndicator || !statusIndicator.material) return;

    const material = statusIndicator.material as BABYLON.StandardMaterial;
    
    switch (status) {
      case DeviceStatus.ONLINE:
        material.diffuseColor = new BABYLON.Color3(0, 1, 0);
        material.emissiveColor = new BABYLON.Color3(0, 0.5, 0);
        break;
      case DeviceStatus.OFFLINE:
        material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        material.emissiveColor = new BABYLON.Color3(0.5, 0, 0);
        break;
      case DeviceStatus.ERROR:
        material.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
        material.emissiveColor = new BABYLON.Color3(0.5, 0.25, 0);
        // Add pulsing animation for errors
        BABYLON.Animation.CreateAndStartAnimation(
          'pulse',
          material,
          'emissiveColor',
          30,
          30,
          material.emissiveColor,
          new BABYLON.Color3(1, 0.5, 0),
          BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        break;
      case DeviceStatus.MAINTENANCE:
        material.diffuseColor = new BABYLON.Color3(1, 1, 0);
        material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0);
        break;
    }
  }

  /**
   * Show device information tooltip
   */
  private showDeviceTooltip(device: IoTDevice): void {
    // This would integrate with a UI overlay
    console.log('Device:', device.name, 'Status:', device.status);
  }

  /**
   * Set active floor for device visibility
   */
  public setActiveFloor(floor: number): void {
    this.currentFloor = floor;
    this.updateVisibility();
  }

  /**
   * Toggle device visibility
   */
  public setVisibility(visible: boolean): void {
    this.isVisible = visible;
    this.updateVisibility();
  }

  /**
   * Update visibility of all devices
   */
  private updateVisibility(): void {
    this.devices.forEach((mesh, id) => {
      // Find the device data (in real app, this would be stored)
      const deviceFloor = parseInt(id.split('_')[0]) || 1;
      mesh.setEnabled(
        deviceFloor === this.currentFloor && this.isVisible
      );
    });
  }

  /**
   * Clear all devices
   */
  private clearDevices(): void {
    this.devices.forEach(mesh => {
      mesh.dispose();
    });
    this.devices.clear();
  }

  /**
   * Create device animation effects
   */
  public animateDeviceActivity(deviceId: string): void {
    const mesh = this.devices.get(deviceId);
    if (!mesh) return;

    // Create a pulse effect
    const animationBox = BABYLON.MeshBuilder.CreateSphere(
      'pulse',
      { diameter: 1 },
      this.scene
    );
    animationBox.parent = mesh;
    animationBox.position = BABYLON.Vector3.Zero();
    
    const pulseMat = new BABYLON.StandardMaterial('pulseMat', this.scene);
    pulseMat.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
    pulseMat.alpha = 0.5;
    animationBox.material = pulseMat;

    // Animate scale and alpha
    BABYLON.Animation.CreateAndStartAnimation(
      'pulseScale',
      animationBox,
      'scaling',
      30,
      30,
      new BABYLON.Vector3(1, 1, 1),
      new BABYLON.Vector3(2, 2, 2),
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    BABYLON.Animation.CreateAndStartAnimation(
      'pulseAlpha',
      pulseMat,
      'alpha',
      30,
      30,
      0.5,
      0,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      undefined,
      () => {
        animationBox.dispose();
      }
    );
  }
}