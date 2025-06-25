/**
 * EnhancedIoTDeviceManager - Advanced IoT device visualization with realistic 3D models
 */

import * as BABYLON from '@babylonjs/core';
import { IoTDevice, DeviceStatus, DeviceType } from '@/types/iot';
import { AdvancedMaterialLibrary } from './AdvancedMaterialLibrary';

export class EnhancedIoTDeviceManager {
  private scene: BABYLON.Scene;
  private materialLibrary: AdvancedMaterialLibrary;
  private devices: Map<string, DeviceVisualization> = new Map();
  private deviceModels: Map<DeviceType, BABYLON.Mesh> = new Map();
  private glowLayer: BABYLON.GlowLayer;
  private animationGroups: Map<string, BABYLON.AnimationGroup> = new Map();

  constructor(scene: BABYLON.Scene, materialLibrary: AdvancedMaterialLibrary) {
    this.scene = scene;
    this.materialLibrary = materialLibrary;
    this.glowLayer = new BABYLON.GlowLayer('deviceGlow', scene, {
      mainTextureFixedSize: 512,
      blurKernelSize: 64
    });
    this.glowLayer.intensity = 0.5;
    
    this.createDeviceModels();
  }

  private createDeviceModels(): void {
    this.createSensorModel();
    this.createCameraModel();
    this.createThermostatModel();
    this.createLightModel();
    this.createSmokeDetectorModel();
    this.createACModel();
    this.createDoorSensorModel();
  }

  private createSensorModel(): void {
    // Create a detailed sensor model
    const sensor = BABYLON.MeshBuilder.CreateBox('sensorModel', {
      width: 0.3,
      height: 0.15,
      depth: 0.3
    }, this.scene);
    
    // Add sensor details
    const sensorTop = BABYLON.MeshBuilder.CreateCylinder('sensorTop', {
      height: 0.05,
      diameter: 0.15
    }, this.scene);
    sensorTop.position.y = 0.1;
    sensorTop.parent = sensor;
    
    // Create blinking LED
    const led = BABYLON.MeshBuilder.CreateSphere('sensorLED', {
      diameter: 0.03
    }, this.scene);
    led.position.set(0.1, 0.08, 0.1);
    led.parent = sensor;
    
    // Apply materials
    sensor.material = this.materialLibrary.createMetalFrameMaterial();
    sensorTop.material = this.materialLibrary.createMetalFrameMaterial();
    led.material = this.createLEDMaterial('green');
    
    // Create blinking animation
    this.createBlinkingAnimation(led, 'green');
    
    sensor.setEnabled(false);
    this.deviceModels.set(DeviceType.TEMPERATURE_SENSOR, sensor);
  }

  private createCameraModel(): void {
    // Create security camera model
    const cameraBase = BABYLON.MeshBuilder.CreateCylinder('cameraBase', {
      height: 0.2,
      diameter: 0.25
    }, this.scene);
    
    const cameraLens = BABYLON.MeshBuilder.CreateCylinder('cameraLens', {
      height: 0.15,
      diameter: 0.15
    }, this.scene);
    cameraLens.position.z = 0.1;
    cameraLens.parent = cameraBase;
    
    // Camera lens with reflection
    const lens = BABYLON.MeshBuilder.CreateCylinder('lens', {
      height: 0.02,
      diameter: 0.1
    }, this.scene);
    lens.position.set(0, 0, 0.15);
    lens.parent = cameraBase;
    lens.material = this.materialLibrary.createGlassMaterial();
    
    // LED indicator
    const led = BABYLON.MeshBuilder.CreateSphere('cameraLED', {
      diameter: 0.02
    }, this.scene);
    led.position.set(0.08, 0.05, 0.1);
    led.parent = cameraBase;
    led.material = this.createLEDMaterial('red');
    
    cameraBase.material = this.materialLibrary.createMetalFrameMaterial();
    cameraLens.material = this.materialLibrary.createMetalFrameMaterial();
    
    // Add subtle rotation animation
    this.createRotationAnimation(cameraBase, 'camera');
    this.createBlinkingAnimation(led, 'red');
    
    cameraBase.setEnabled(false);
    this.deviceModels.set(DeviceType.CAMERA, cameraBase);
  }

  private createThermostatModel(): void {
    // Create modern thermostat
    const thermostat = BABYLON.MeshBuilder.CreateBox('thermostat', {
      width: 0.4,
      height: 0.3,
      depth: 0.08
    }, this.scene);
    
    // Screen
    const screen = BABYLON.MeshBuilder.CreateBox('thermostatScreen', {
      width: 0.3,
      height: 0.2,
      depth: 0.01
    }, this.scene);
    screen.position.z = 0.05;
    screen.parent = thermostat;
    screen.material = this.materialLibrary.createScreenMaterial();
    
    // Control buttons
    for (let i = 0; i < 3; i++) {
      const button = BABYLON.MeshBuilder.CreateCylinder(`button${i}`, {
        height: 0.02,
        diameter: 0.04
      }, this.scene);
      button.position.set(-0.12 + (i * 0.12), -0.1, 0.05);
      button.parent = thermostat;
      button.material = this.materialLibrary.createMetalFrameMaterial();
    }
    
    thermostat.material = this.materialLibrary.createMetalFrameMaterial();
    this.glowLayer.addIncludedOnlyMesh(screen);
    
    thermostat.setEnabled(false);
    this.deviceModels.set(DeviceType.HVAC_CONTROLLER, thermostat);
  }

  private createLightModel(): void {
    // Create modern LED light fixture
    const lightBase = BABYLON.MeshBuilder.CreateCylinder('lightBase', {
      height: 0.1,
      diameter: 0.4
    }, this.scene);
    
    const lightPanel = BABYLON.MeshBuilder.CreateCylinder('lightPanel', {
      height: 0.03,
      diameter: 0.35
    }, this.scene);
    lightPanel.position.y = -0.06;
    lightPanel.parent = lightBase;
    
    // Create glowing effect
    lightPanel.material = this.createGlowMaterial('white');
    lightBase.material = this.materialLibrary.createMetalFrameMaterial();
    
    this.glowLayer.addIncludedOnlyMesh(lightPanel);
    
    lightBase.setEnabled(false);
    this.deviceModels.set(DeviceType.LIGHT_CONTROLLER, lightBase);
  }

  private createSmokeDetectorModel(): void {
    // Create smoke detector
    const detector = BABYLON.MeshBuilder.CreateCylinder('smokeDetector', {
      height: 0.08,
      diameter: 0.3
    }, this.scene);
    
    // Detector grille
    const grille = BABYLON.MeshBuilder.CreateTorus('detectorGrille', {
      diameter: 0.2,
      thickness: 0.02
    }, this.scene);
    grille.position.y = -0.03;
    grille.parent = detector;
    
    // Status LED
    const led = BABYLON.MeshBuilder.CreateSphere('detectorLED', {
      diameter: 0.02
    }, this.scene);
    led.position.set(0.1, -0.02, 0);
    led.parent = detector;
    led.material = this.createLEDMaterial('green');
    
    detector.material = this.materialLibrary.createMetalFrameMaterial();
    grille.material = this.materialLibrary.createMetalFrameMaterial();
    
    this.createBlinkingAnimation(led, 'green', 3000); // Slower blink
    
    detector.setEnabled(false);
    this.deviceModels.set(DeviceType.SMOKE_DETECTOR, detector);
  }

  private createACModel(): void {
    // Create air conditioning unit
    const acUnit = BABYLON.MeshBuilder.CreateBox('acUnit', {
      width: 1.2,
      height: 0.3,
      depth: 0.8
    }, this.scene);
    
    // AC grilles
    for (let i = 0; i < 4; i++) {
      const grille = BABYLON.MeshBuilder.CreateBox('acGrille', {
        width: 0.25,
        height: 0.02,
        depth: 0.6
      }, this.scene);
      grille.position.set(-0.375 + (i * 0.25), -0.14, 0);
      grille.parent = acUnit;
      grille.material = this.materialLibrary.createMetalFrameMaterial();
    }
    
    // Status LED
    const led = BABYLON.MeshBuilder.CreateSphere('acLED', {
      diameter: 0.03
    }, this.scene);
    led.position.set(0.5, 0.1, 0.3);
    led.parent = acUnit;
    led.material = this.createLEDMaterial('blue');
    
    acUnit.material = this.materialLibrary.createMetalFrameMaterial();
    this.createBlinkingAnimation(led, 'blue');
    
    acUnit.setEnabled(false);
    this.deviceModels.set(DeviceType.HVAC_CONTROLLER, acUnit);
  }

  private createDoorSensorModel(): void {
    // Create door sensor (magnetic contact)
    const sensor = BABYLON.MeshBuilder.CreateBox('doorSensor', {
      width: 0.15,
      height: 0.08,
      depth: 0.1
    }, this.scene);
    
    // Magnetic contact point
    const contact = BABYLON.MeshBuilder.CreateBox('doorContact', {
      width: 0.12,
      height: 0.06,
      depth: 0.08
    }, this.scene);
    contact.position.x = 0.2;
    contact.parent = sensor;
    
    // Status LED
    const led = BABYLON.MeshBuilder.CreateSphere('doorLED', {
      diameter: 0.015
    }, this.scene);
    led.position.set(0.05, 0.03, 0.05);
    led.parent = sensor;
    led.material = this.createLEDMaterial('green');
    
    sensor.material = this.materialLibrary.createMetalFrameMaterial();
    contact.material = this.materialLibrary.createMetalFrameMaterial();
    
    this.createBlinkingAnimation(led, 'green', 5000); // Very slow blink
    
    sensor.setEnabled(false);
    this.deviceModels.set(DeviceType.DOOR_SENSOR, sensor);
  }

  private createLEDMaterial(color: string): BABYLON.StandardMaterial {
    const material = new BABYLON.StandardMaterial(`ledMaterial_${color}`, this.scene);
    
    switch (color) {
      case 'red':
        material.emissiveColor = new BABYLON.Color3(1, 0, 0);
        material.diffuseColor = new BABYLON.Color3(0.8, 0, 0);
        break;
      case 'green':
        material.emissiveColor = new BABYLON.Color3(0, 1, 0);
        material.diffuseColor = new BABYLON.Color3(0, 0.8, 0);
        break;
      case 'blue':
        material.emissiveColor = new BABYLON.Color3(0, 0, 1);
        material.diffuseColor = new BABYLON.Color3(0, 0, 0.8);
        break;
      case 'yellow':
        material.emissiveColor = new BABYLON.Color3(1, 1, 0);
        material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0);
        break;
      default:
        material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    }
    
    return material;
  }

  private createGlowMaterial(color: string): BABYLON.StandardMaterial {
    const material = new BABYLON.StandardMaterial(`glowMaterial_${color}`, this.scene);
    
    switch (color) {
      case 'white':
        material.emissiveColor = new BABYLON.Color3(0.9, 0.9, 0.8);
        material.diffuseColor = new BABYLON.Color3(0.95, 0.95, 0.9);
        break;
      case 'warm':
        material.emissiveColor = new BABYLON.Color3(1, 0.8, 0.6);
        material.diffuseColor = new BABYLON.Color3(1, 0.9, 0.8);
        break;
      case 'cool':
        material.emissiveColor = new BABYLON.Color3(0.8, 0.9, 1);
        material.diffuseColor = new BABYLON.Color3(0.9, 0.95, 1);
        break;
    }
    
    return material;
  }

  private createBlinkingAnimation(mesh: BABYLON.Mesh, color: string, interval: number = 1000): void {
    const animationGroup = new BABYLON.AnimationGroup(`blink_${mesh.name}`, this.scene);
    
    const blinkAnimation = new BABYLON.Animation(
      'ledBlink',
      'emissiveColor',
      30,
      BABYLON.Animation.ANIMATIONTYPE_COLOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    
    const keys = [
      { frame: 0, value: BABYLON.Color3.FromHexString(color) },
      { frame: 15, value: BABYLON.Color3.Black() },
      { frame: 30, value: BABYLON.Color3.FromHexString(color) }
    ];
    
    blinkAnimation.setKeys(keys);
    
    if (mesh.material) {
      animationGroup.addTargetedAnimation(blinkAnimation, mesh.material);
      animationGroup.play(true);
      
      this.animationGroups.set(`blink_${mesh.name}`, animationGroup);
    }
  }

  private createRotationAnimation(mesh: BABYLON.Mesh, name: string): void {
    const animationGroup = new BABYLON.AnimationGroup(`rotation_${name}`, this.scene);
    
    const rotationAnimation = new BABYLON.Animation(
      'cameraRotation',
      'rotation.y',
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    
    const keys = [
      { frame: 0, value: 0 },
      { frame: 600, value: Math.PI * 2 }
    ];
    
    rotationAnimation.setKeys(keys);
    
    animationGroup.addTargetedAnimation(rotationAnimation, mesh);
    animationGroup.play(true);
    
    this.animationGroups.set(`rotation_${name}`, animationGroup);
  }

  public addDevice(device: IoTDevice, position: BABYLON.Vector3): void {
    const modelTemplate = this.deviceModels.get(device.type);
    if (!modelTemplate) return;
    
    // Clone the model
    const deviceMesh = modelTemplate.clone(`device_${device.id}`, null);
    if (!deviceMesh) return;
    
    deviceMesh.setEnabled(true);
    deviceMesh.position = position.clone();
    
    // Set initial scale based on device type
    const scale = this.getDeviceScale(device.type);
    deviceMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
    
    // Create device visualization
    const visualization: DeviceVisualization = {
      mesh: deviceMesh,
      device: device,
      statusIndicator: this.createStatusIndicator(device, deviceMesh),
      dataLabel: this.createDataLabel(device, deviceMesh),
      lastUpdate: Date.now()
    };
    
    // Set up interactions
    this.setupDeviceInteractions(visualization);
    
    // Update device status
    this.updateDeviceStatus(visualization);
    
    this.devices.set(device.id, visualization);
  }

  private getDeviceScale(deviceType: DeviceType): number {
    switch (deviceType) {
      case DeviceType.CAMERA:
        return 1.5;
      case DeviceType.HVAC_CONTROLLER:
        return 0.8;
      case DeviceType.LIGHT_CONTROLLER:
        return 1.2;
      case DeviceType.HVAC_CONTROLLER:
        return 1.0;
      case DeviceType.SMOKE_DETECTOR:
        return 1.3;
      case DeviceType.DOOR_SENSOR:
        return 2.0;
      default:
        return 1.0;
    }
  }

  private createStatusIndicator(device: IoTDevice, parent: BABYLON.Mesh): BABYLON.Mesh {
    const indicator = BABYLON.MeshBuilder.CreateSphere('statusIndicator', {
      diameter: 0.1
    }, this.scene);
    
    indicator.position.y = 0.3;
    indicator.parent = parent;
    
    return indicator;
  }

  private createDataLabel(device: IoTDevice, parent: BABYLON.Mesh): BABYLON.Mesh {
    // Create a plane for data display
    const labelPlane = BABYLON.MeshBuilder.CreatePlane('dataLabel', {
      width: 1,
      height: 0.5
    }, this.scene);
    
    labelPlane.position.y = 0.6;
    labelPlane.parent = parent;
    labelPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    
    // Create dynamic texture for data display
    const texture = new BABYLON.DynamicTexture('labelTexture', {
      width: 256,
      height: 128
    }, this.scene);
    
    const material = new BABYLON.StandardMaterial('labelMaterial', this.scene);
    material.diffuseTexture = texture;
    material.emissiveTexture = texture;
    material.opacityTexture = texture;
    material.useAlphaFromDiffuseTexture = true;
    
    labelPlane.material = material;
    labelPlane.setEnabled(false); // Hidden by default
    
    return labelPlane;
  }

  private setupDeviceInteractions(visualization: DeviceVisualization): void {
    visualization.mesh.actionManager = new BABYLON.ActionManager(this.scene);
    
    // Hover effects
    visualization.mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        () => this.onDeviceHover(visualization, true)
      )
    );
    
    visualization.mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        () => this.onDeviceHover(visualization, false)
      )
    );
    
    // Click interactions
    visualization.mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        () => this.onDeviceClick(visualization)
      )
    );
  }

  private onDeviceHover(visualization: DeviceVisualization, isHovering: boolean): void {
    if (isHovering) {
      // Show data label
      visualization.dataLabel.setEnabled(true);
      this.updateDataLabel(visualization);
      
      // Add glow effect
      this.glowLayer.addIncludedOnlyMesh(visualization.mesh);
      
      // Scale up slightly
      BABYLON.Animation.CreateAndStartAnimation(
        'hoverScale',
        visualization.mesh,
        'scaling',
        30,
        10,
        visualization.mesh.scaling,
        visualization.mesh.scaling.scale(1.1),
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
    } else {
      // Hide data label
      visualization.dataLabel.setEnabled(false);
      
      // Remove glow effect
      this.glowLayer.removeIncludedOnlyMesh(visualization.mesh);
      
      // Scale back to normal
      const originalScale = this.getDeviceScale(visualization.device.type);
      BABYLON.Animation.CreateAndStartAnimation(
        'hoverScaleBack',
        visualization.mesh,
        'scaling',
        30,
        10,
        visualization.mesh.scaling,
        new BABYLON.Vector3(originalScale, originalScale, originalScale),
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
    }
  }

  private onDeviceClick(visualization: DeviceVisualization): void {
    // Trigger device interaction callback
    if (this.onDeviceInteract) {
      this.onDeviceInteract(visualization.device.id);
    }
    
    // Visual feedback
    this.createClickEffect(visualization.mesh.position);
  }

  private createClickEffect(position: BABYLON.Vector3): void {
    // Create expanding ring effect
    const ring = BABYLON.MeshBuilder.CreateTorus('clickRing', {
      diameter: 0.1,
      thickness: 0.02
    }, this.scene);
    
    ring.position = position.clone();
    ring.position.y += 0.1;
    
    const material = new BABYLON.StandardMaterial('ringMaterial', this.scene);
    material.emissiveColor = new BABYLON.Color3(0, 1, 1);
    material.alpha = 0.8;
    ring.material = material;
    
    // Animate ring expansion and fade
    BABYLON.Animation.CreateAndStartAnimation(
      'ringExpand',
      ring,
      'scaling',
      30,
      30,
      new BABYLON.Vector3(1, 1, 1),
      new BABYLON.Vector3(3, 3, 3),
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    
    BABYLON.Animation.CreateAndStartAnimation(
      'ringFade',
      material,
      'alpha',
      30,
      30,
      0.8,
      0,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      undefined,
      () => ring.dispose()
    );
  }

  private updateDataLabel(visualization: DeviceVisualization): void {
    const texture = (visualization.dataLabel.material as BABYLON.StandardMaterial)!.diffuseTexture as BABYLON.DynamicTexture;
    const context = texture.getContext();
    
    // Clear canvas
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(0, 0, 256, 128);
    
    // Draw device info
    context.fillStyle = 'white';
    context.font = '16px Arial';
    context.fillText(visualization.device.name, 10, 25);
    
    context.font = '12px Arial';
    context.fillStyle = this.getStatusColor(visualization.device.status);
    context.fillText(`Status: ${visualization.device.status}`, 10, 45);
    
    // Draw sensor data if available
    if (visualization.device.metadata) {
      context.fillStyle = 'white';
      const dataEntries = Object.entries(visualization.device.metadata);
      dataEntries.slice(0, 3).forEach(([key, value], index) => {
        context.fillText(`${key}: ${value}`, 10, 65 + (index * 15));
      });
    }
    
    texture.update();
  }

  private getStatusColor(status: DeviceStatus): string {
    switch (status) {
      case DeviceStatus.ONLINE:
        return '#00ff00';
      case DeviceStatus.OFFLINE:
        return '#ff0000';
      case DeviceStatus.MAINTENANCE:
        return '#ffff00';
      case DeviceStatus.ERROR:
        return '#ff8800';
      default:
        return '#ffffff';
    }
  }

  private updateDeviceStatus(visualization: DeviceVisualization): void {
    const indicator = visualization.statusIndicator;
    const material = new BABYLON.StandardMaterial('statusMaterial', this.scene);
    
    switch (visualization.device.status) {
      case DeviceStatus.ONLINE:
        material.emissiveColor = new BABYLON.Color3(0, 1, 0);
        break;
      case DeviceStatus.OFFLINE:
        material.emissiveColor = new BABYLON.Color3(1, 0, 0);
        break;
      case DeviceStatus.MAINTENANCE:
        material.emissiveColor = new BABYLON.Color3(1, 1, 0);
        break;
      case DeviceStatus.ERROR:
        material.emissiveColor = new BABYLON.Color3(1, 0.5, 0);
        break;
    }
    
    indicator.material = material;
    
    // Add status indicator to glow layer
    this.glowLayer.addIncludedOnlyMesh(indicator);
  }

  public updateDevice(deviceId: string, data: Partial<IoTDevice>): void {
    const visualization = this.devices.get(deviceId);
    if (!visualization) return;
    
    // Update device data
    Object.assign(visualization.device, data);
    visualization.lastUpdate = Date.now();
    
    // Update visual representation
    this.updateDeviceStatus(visualization);
    
    // If data label is visible, update it
    if (visualization.dataLabel.isEnabled()) {
      this.updateDataLabel(visualization);
    }
  }

  public removeDevice(deviceId: string): void {
    const visualization = this.devices.get(deviceId);
    if (!visualization) return;
    
    // Remove from glow layer
    this.glowLayer.removeIncludedOnlyMesh(visualization.mesh);
    this.glowLayer.removeIncludedOnlyMesh(visualization.statusIndicator);
    
    // Dispose meshes
    visualization.mesh.dispose();
    visualization.statusIndicator.dispose();
    visualization.dataLabel.dispose();
    
    this.devices.delete(deviceId);
  }

  public setDevicesVisible(visible: boolean): void {
    this.devices.forEach(visualization => {
      visualization.mesh.setEnabled(visible);
    });
  }

  public highlightDevicesByType(deviceType: DeviceType, highlight: boolean): void {
    this.devices.forEach(visualization => {
      if (visualization.device.type === deviceType) {
        if (highlight) {
          this.glowLayer.addIncludedOnlyMesh(visualization.mesh);
        } else {
          this.glowLayer.removeIncludedOnlyMesh(visualization.mesh);
        }
      }
    });
  }

  public onDeviceInteract?: (deviceId: string) => void;

  public dispose(): void {
    // Dispose all device visualizations
    this.devices.forEach(visualization => {
      visualization.mesh.dispose();
      visualization.statusIndicator.dispose();
      visualization.dataLabel.dispose();
    });
    this.devices.clear();
    
    // Dispose device models
    this.deviceModels.forEach(model => model.dispose());
    this.deviceModels.clear();
    
    // Dispose animation groups
    this.animationGroups.forEach(group => group.dispose());
    this.animationGroups.clear();
    
    // Dispose glow layer
    this.glowLayer.dispose();
  }
}

interface DeviceVisualization {
  mesh: BABYLON.Mesh;
  device: IoTDevice;
  statusIndicator: BABYLON.Mesh;
  dataLabel: BABYLON.Mesh;
  lastUpdate: number;
}