/**
 * AdvancedCameraController - Sophisticated camera controls with smooth animations
 */

import * as BABYLON from '@babylonjs/core';

export class AdvancedCameraController {
  private camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;
  private isAnimating: boolean = false;
  private presetPositions: Map<string, CameraPreset> = new Map();
  private currentPreset: string | null = null;

  // Camera behaviors
  private autoRotationBehavior!: BABYLON.AutoRotationBehavior;
  private bouncingBehavior!: BABYLON.BouncingBehavior;
  private framingBehavior!: BABYLON.FramingBehavior;

  constructor(camera: BABYLON.ArcRotateCamera, scene: BABYLON.Scene) {
    this.camera = camera;
    this.scene = scene;
    
    this.setupCameraBehaviors();
    this.setupPresetPositions();
    this.setupKeyboardControls();
  }

  private setupCameraBehaviors(): void {
    // Auto rotation when idle
    this.autoRotationBehavior = new BABYLON.AutoRotationBehavior();
    this.autoRotationBehavior.idleRotationSpeed = 0.2;
    this.autoRotationBehavior.idleRotationWaitTime = 3000;
    this.autoRotationBehavior.idleRotationSpinupTime = 2000;
    this.camera.addBehavior(this.autoRotationBehavior);

    // Smooth bouncing
    this.bouncingBehavior = new BABYLON.BouncingBehavior();
    this.bouncingBehavior.transitionDuration = 500;
    this.bouncingBehavior.lowerRadiusTransitionRange = 2;
    this.bouncingBehavior.upperRadiusTransitionRange = -2;
    this.camera.addBehavior(this.bouncingBehavior);

    // Smart framing
    this.framingBehavior = new BABYLON.FramingBehavior();
    this.framingBehavior.mode = BABYLON.FramingBehavior.FitFrustumSidesMode;
    this.framingBehavior.radiusScale = 1.5;
    this.framingBehavior.positionScale = 0.5;
    this.framingBehavior.defaultElevation = 0.3;
    this.camera.addBehavior(this.framingBehavior);
  }

  private setupPresetPositions(): void {
    // Overview position
    this.presetPositions.set('overview', {
      alpha: Math.PI / 4,
      beta: Math.PI / 3,
      radius: 80,
      target: new BABYLON.Vector3(0, 8, 0),
      name: 'Building Overview'
    });

    // Floor plan view
    this.presetPositions.set('floorplan', {
      alpha: 0,
      beta: 0.1,
      radius: 60,
      target: new BABYLON.Vector3(0, 8, 0),
      name: 'Floor Plan View'
    });

    // Close-up interior
    this.presetPositions.set('interior', {
      alpha: Math.PI / 6,
      beta: Math.PI / 2.5,
      radius: 25,
      target: new BABYLON.Vector3(0, 4, 0),
      name: 'Interior View'
    });

    // Exterior view
    this.presetPositions.set('exterior', {
      alpha: -Math.PI / 3,
      beta: Math.PI / 4,
      radius: 100,
      target: new BABYLON.Vector3(0, 10, 0),
      name: 'Exterior View'
    });

    // Bird's eye view
    this.presetPositions.set('birdseye', {
      alpha: 0,
      beta: 0.05,
      radius: 120,
      target: new BABYLON.Vector3(0, 0, 0),
      name: "Bird's Eye View"
    });
  }

  private setupKeyboardControls(): void {
    // Add keyboard shortcuts for camera presets
    this.scene.actionManager = this.scene.actionManager || new BABYLON.ActionManager(this.scene);
    
    // Number keys for presets
    const presetKeys = ['1', '2', '3', '4', '5'];
    const presetNames = ['overview', 'floorplan', 'interior', 'exterior', 'birdseye'];
    
    presetKeys.forEach((key, index) => {
      this.scene.actionManager!.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnKeyDownTrigger,
          () => {
            if (presetNames[index]) {
              this.moveToPreset(presetNames[index]);
            }
          },
        )
      );
    });

    // R key for reset
    this.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyDownTrigger,
        () => this.resetCamera(),
      )
    );

    // Space bar to toggle auto rotation
    this.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyDownTrigger,
        () => this.toggleAutoRotation(),
      )
    );
  }

  public moveToPreset(presetName: string, duration: number = 1000): Promise<void> {
    const preset = this.presetPositions.get(presetName);
    if (!preset || this.isAnimating) {
      return Promise.resolve();
    }

    this.isAnimating = true;
    this.currentPreset = presetName;

    return new Promise((resolve) => {
      // Create smooth animations
      const alphaAnimation = BABYLON.Animation.CreateAndStartAnimation(
        'cameraAlpha',
        this.camera,
        'alpha',
        60,
        duration / 16.67,
        this.camera.alpha,
        preset.alpha,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase(),
        () => {
          this.isAnimating = false;
          resolve();
        }
      );

      BABYLON.Animation.CreateAndStartAnimation(
        'cameraBeta',
        this.camera,
        'beta',
        60,
        duration / 16.67,
        this.camera.beta,
        preset.beta,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase()
      );

      BABYLON.Animation.CreateAndStartAnimation(
        'cameraRadius',
        this.camera,
        'radius',
        60,
        duration / 16.67,
        this.camera.radius,
        preset.radius,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase()
      );

      BABYLON.Animation.CreateAndStartAnimation(
        'cameraTarget',
        this.camera,
        'target',
        60,
        duration / 16.67,
        this.camera.target,
        preset.target,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase()
      );

      // Add camera shake effect for dramatic transitions
      if (presetName === 'interior' || presetName === 'exterior') {
        this.addCameraShakeEffect(0.1, 200);
      }
    });
  }

  public focusOnFloor(floorNumber: number): Promise<void> {
    const floorY = (floorNumber - 1) * 4.0;
    const targetPosition = new BABYLON.Vector3(0, floorY + 2, 0);
    
    return new Promise((resolve) => {
      BABYLON.Animation.CreateAndStartAnimation(
        'focusOnFloor',
        this.camera,
        'target',
        60,
        30,
        this.camera.target,
        targetPosition,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase(),
        () => resolve()
      );
    });
  }

  public focusOnRoom(roomPosition: BABYLON.Vector3): Promise<void> {
    const targetPosition = roomPosition.clone();
    targetPosition.y += 2;
    
    return new Promise((resolve) => {
      // Move camera to optimal viewing position for the room
      const optimalAlpha = Math.atan2(roomPosition.x, roomPosition.z);
      const optimalRadius = 20;
      const optimalBeta = Math.PI / 3;
      
      BABYLON.Animation.CreateAndStartAnimation(
        'focusRoomTarget',
        this.camera,
        'target',
        60,
        30,
        this.camera.target,
        targetPosition,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase()
      );

      BABYLON.Animation.CreateAndStartAnimation(
        'focusRoomAlpha',
        this.camera,
        'alpha',
        60,
        30,
        this.camera.alpha,
        optimalAlpha,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase()
      );

      BABYLON.Animation.CreateAndStartAnimation(
        'focusRoomBeta',
        this.camera,
        'beta',
        60,
        30,
        this.camera.beta,
        optimalBeta,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase()
      );

      BABYLON.Animation.CreateAndStartAnimation(
        'focusRoomRadius',
        this.camera,
        'radius',
        60,
        30,
        this.camera.radius,
        optimalRadius,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        new BABYLON.CubicEase(),
        () => resolve()
      );
    });
  }

  public createCinematicTour(): Promise<void> {
    return new Promise(async (resolve) => {
      const tourPoints = [
        'overview',
        'exterior',
        'birdseye',
        'floorplan',
        'interior'
      ];

      for (const point of tourPoints) {
        await this.moveToPreset(point, 2000);
        await this.wait(1500);
      }

      resolve();
    });
  }

  public addCameraShakeEffect(intensity: number = 0.1, duration: number = 500): void {
    const originalTarget = this.camera.target.clone();
    let startTime = Date.now();
    
    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        this.camera.target = originalTarget;
        return;
      }
      
      const progress = elapsed / duration;
      const dampening = 1 - progress;
      const shakeIntensity = intensity * dampening;
      
      this.camera.target.x = originalTarget.x + (Math.random() - 0.5) * shakeIntensity;
      this.camera.target.y = originalTarget.y + (Math.random() - 0.5) * shakeIntensity;
      this.camera.target.z = originalTarget.z + (Math.random() - 0.5) * shakeIntensity;
      
      requestAnimationFrame(shake);
    };
    
    shake();
  }

  public createFollowPath(waypoints: BABYLON.Vector3[], duration: number = 5000): Promise<void> {
    return new Promise((resolve) => {
      if (waypoints.length < 2) {
        resolve();
        return;
      }

      // Create a catmull-rom spline for smooth camera movement
      const path = BABYLON.Curve3.CreateCatmullRomSpline(waypoints, waypoints.length * 4);
      const pathPoints = path.getPoints();
      
      let currentIndex = 0;
      const totalPoints = pathPoints.length;
      const frameTime = duration / totalPoints;
      
      const moveAlongPath = () => {
        if (currentIndex >= totalPoints) {
          resolve();
          return;
        }
        
        this.camera.target = pathPoints[currentIndex];
        currentIndex++;
        
        setTimeout(moveAlongPath, frameTime);
      };
      
      moveAlongPath();
    });
  }

  public toggleAutoRotation(): void {
    this.autoRotationBehavior.idleRotationSpeed = 
      this.autoRotationBehavior.idleRotationSpeed === 0 ? 0.2 : 0;
  }

  public zoomIn(): void {
    const currentRadius = this.camera.radius;
    const targetRadius = Math.max(currentRadius * 0.8, this.camera.lowerRadiusLimit || 1);
    
    BABYLON.Animation.CreateAndStartAnimation(
      'zoomIn',
      this.camera,
      'radius',
      30,
      15,
      currentRadius,
      targetRadius,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  }

  public zoomOut(): void {
    const currentRadius = this.camera.radius;
    const targetRadius = Math.min(currentRadius * 1.25, this.camera.upperRadiusLimit || 100);
    
    BABYLON.Animation.CreateAndStartAnimation(
      'zoomOut',
      this.camera,
      'radius',
      30,
      15,
      currentRadius,
      targetRadius,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  }

  public resetView(): void {
    this.resetCamera();
  }

  public resetCamera(): void {
    this.moveToPreset('overview');
  }

  public setQualityLevel(level: 'low' | 'medium' | 'high' | 'ultra'): void {
    // Adjust camera behaviors based on quality level
    switch (level) {
      case 'low':
        this.autoRotationBehavior.idleRotationSpeed = 0;
        this.bouncingBehavior.transitionDuration = 200;
        break;
      case 'medium':
        this.autoRotationBehavior.idleRotationSpeed = 0.1;
        this.bouncingBehavior.transitionDuration = 300;
        break;
      case 'high':
        this.autoRotationBehavior.idleRotationSpeed = 0.2;
        this.bouncingBehavior.transitionDuration = 500;
        break;
      case 'ultra':
        this.autoRotationBehavior.idleRotationSpeed = 0.3;
        this.bouncingBehavior.transitionDuration = 800;
        break;
    }
  }

  public getCurrentPreset(): string | null {
    return this.currentPreset;
  }

  public getAvailablePresets(): string[] {
    return Array.from(this.presetPositions.keys());
  }

  public getPresetInfo(presetName: string): CameraPreset | undefined {
    return this.presetPositions.get(presetName);
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public dispose(): void {
    // Remove behaviors
    this.camera.removeBehavior(this.autoRotationBehavior);
    this.camera.removeBehavior(this.bouncingBehavior);
    this.camera.removeBehavior(this.framingBehavior);
    
    // Clear presets
    this.presetPositions.clear();
  }
}

interface CameraPreset {
  alpha: number;
  beta: number;
  radius: number;
  target: BABYLON.Vector3;
  name: string;
}