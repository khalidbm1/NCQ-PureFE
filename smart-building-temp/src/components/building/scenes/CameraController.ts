/**
 * CameraController - Handles camera animations and controls
 */

import * as BABYLON from '@babylonjs/core';

export class CameraController {
  private camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;
  private animationSpeed: number = 30; // frames
  
  // Default camera positions
  private defaultAlpha: number = Math.PI / 4;
  private defaultBeta: number = Math.PI / 3;
  private defaultRadius: number = 50;
  private defaultTarget: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);

  constructor(camera: BABYLON.ArcRotateCamera, scene: BABYLON.Scene) {
    this.camera = camera;
    this.scene = scene;
    
    // Store initial position as default
    this.defaultAlpha = camera.alpha;
    this.defaultBeta = camera.beta;
    this.defaultRadius = camera.radius;
    this.defaultTarget = camera.target.clone();
  }

  /**
   * Smoothly animate camera to focus on a mesh
   */
  public focusOnMesh(mesh: BABYLON.Mesh): void {
    const boundingBox = mesh.getBoundingInfo().boundingBox;
    const center = boundingBox.centerWorld;
    const extendSize = boundingBox.extendSizeWorld;
    
    // Calculate optimal camera distance
    const maxExtent = Math.max(extendSize.x, extendSize.y, extendSize.z);
    const targetRadius = maxExtent * 3;
    
    // Animate to new position
    this.animateCamera(
      this.camera.alpha,
      Math.PI / 4,
      targetRadius,
      center
    );
  }

  /**
   * Move camera to view a specific floor
   */
  public moveToFloor(floorNumber: number): void {
    const floorHeight = 3.5;
    const targetY = (floorNumber - 1) * floorHeight + 2;
    const target = new BABYLON.Vector3(0, targetY, 0);
    
    this.animateCamera(
      this.camera.alpha,
      Math.PI / 3,
      40,
      target
    );
  }

  /**
   * Zoom in
   */
  public zoomIn(): void {
    const newRadius = Math.max(
      this.camera.lowerRadiusLimit || 1,
      this.camera.radius * 0.8
    );
    this.animateCamera(
      this.camera.alpha,
      this.camera.beta,
      newRadius,
      this.camera.target
    );
  }

  /**
   * Zoom out
   */
  public zoomOut(): void {
    const newRadius = Math.min(
      this.camera.upperRadiusLimit || 100,
      this.camera.radius * 1.2
    );
    this.animateCamera(
      this.camera.alpha,
      this.camera.beta,
      newRadius,
      this.camera.target
    );
  }

  /**
   * Reset camera to default position
   */
  public reset(): void {
    this.animateCamera(
      this.defaultAlpha,
      this.defaultBeta,
      this.defaultRadius,
      this.defaultTarget
    );
  }

  /**
   * Animate camera to a new position
   */
  private animateCamera(
    targetAlpha: number,
    targetBeta: number,
    targetRadius: number,
    targetPosition: BABYLON.Vector3
  ): void {
    // Create animations
    const alphaAnim = BABYLON.Animation.CreateAndStartAnimation(
      'cameraAlpha',
      this.camera,
      'alpha',
      60,
      this.animationSpeed,
      this.camera.alpha,
      targetAlpha,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      new BABYLON.QuadraticEase()
    );

    const betaAnim = BABYLON.Animation.CreateAndStartAnimation(
      'cameraBeta',
      this.camera,
      'beta',
      60,
      this.animationSpeed,
      this.camera.beta,
      targetBeta,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      new BABYLON.QuadraticEase()
    );

    const radiusAnim = BABYLON.Animation.CreateAndStartAnimation(
      'cameraRadius',
      this.camera,
      'radius',
      60,
      this.animationSpeed,
      this.camera.radius,
      targetRadius,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      new BABYLON.QuadraticEase()
    );

    // Animate target position
    BABYLON.Animation.CreateAndStartAnimation(
      'cameraTargetX',
      this.camera.target,
      'x',
      60,
      this.animationSpeed,
      this.camera.target.x,
      targetPosition.x,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      new BABYLON.QuadraticEase()
    );

    BABYLON.Animation.CreateAndStartAnimation(
      'cameraTargetY',
      this.camera.target,
      'y',
      60,
      this.animationSpeed,
      this.camera.target.y,
      targetPosition.y,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      new BABYLON.QuadraticEase()
    );

    BABYLON.Animation.CreateAndStartAnimation(
      'cameraTargetZ',
      this.camera.target,
      'z',
      60,
      this.animationSpeed,
      this.camera.target.z,
      targetPosition.z,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      new BABYLON.QuadraticEase()
    );
  }

  /**
   * Enable smooth camera panning
   */
  public enableSmoothPanning(): void {
    this.camera.panningSensibility = 50;
    this.camera.panningInertia = 0.9;
  }

  /**
   * Set camera limits
   */
  public setCameraLimits(
    minRadius: number,
    maxRadius: number,
    minBeta: number,
    maxBeta: number
  ): void {
    this.camera.lowerRadiusLimit = minRadius;
    this.camera.upperRadiusLimit = maxRadius;
    this.camera.lowerBetaLimit = minBeta;
    this.camera.upperBetaLimit = maxBeta;
  }
}