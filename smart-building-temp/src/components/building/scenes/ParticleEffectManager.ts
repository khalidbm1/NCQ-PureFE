/**
 * ParticleEffectManager - Advanced particle systems for environmental effects
 */

import * as BABYLON from '@babylonjs/core';

export class ParticleEffectManager {
  private scene: BABYLON.Scene;
  private particleSystems: Map<string, BABYLON.ParticleSystem> = new Map();
  private isEnabled: boolean = true;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  public initialize(): void {
    this.createDustParticles();
    this.createAirParticles();
    this.createWindowLightRays();
  }

  private createDustParticles(): void {
    // Create subtle dust particles floating in the air
    const dustSystem = new BABYLON.ParticleSystem('dust', 200, this.scene);
    
    // Texture for dust particles
    dustSystem.particleTexture = new BABYLON.Texture('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', this.scene);
    
    // Where the particles come from
    dustSystem.emitter = new BABYLON.Vector3(0, 15, 0);
    dustSystem.minEmitBox = new BABYLON.Vector3(-30, 0, -20);
    dustSystem.maxEmitBox = new BABYLON.Vector3(30, 0, 20);
    
    // Colors of all particles
    dustSystem.color1 = new BABYLON.Color4(0.8, 0.8, 0.7, 0.1);
    dustSystem.color2 = new BABYLON.Color4(0.9, 0.9, 0.8, 0.2);
    dustSystem.colorDead = new BABYLON.Color4(0.8, 0.8, 0.7, 0.0);
    
    // Size of each particle (random between...
    dustSystem.minSize = 0.05;
    dustSystem.maxSize = 0.2;
    
    // Life time of each particle (random between...
    dustSystem.minLifeTime = 20;
    dustSystem.maxLifeTime = 40;
    
    // Emission rate
    dustSystem.emitRate = 5;
    
    // Blend mode
    dustSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    
    // Set the gravity of all particles
    dustSystem.gravity = new BABYLON.Vector3(0, -0.1, 0);
    
    // Direction of each particle after it has been emitted
    dustSystem.direction1 = new BABYLON.Vector3(-0.2, 0.5, -0.2);
    dustSystem.direction2 = new BABYLON.Vector3(0.2, 1, 0.2);
    
    // Angular speed, in radians
    dustSystem.minAngularSpeed = 0;
    dustSystem.maxAngularSpeed = Math.PI;
    
    // Speed
    dustSystem.minEmitPower = 0.1;
    dustSystem.maxEmitPower = 0.3;
    dustSystem.updateSpeed = 0.005;
    
    // Start the particle system
    dustSystem.start();
    
    this.particleSystems.set('dust', dustSystem);
  }

  private createAirParticles(): void {
    // Create very subtle air movement particles
    const airSystem = new BABYLON.ParticleSystem('air', 100, this.scene);
    
    // Create a subtle texture for air particles
    const airTexture = new BABYLON.DynamicTexture('airTexture', 64, this.scene);
    const context = airTexture.getContext();
    context.fillStyle = 'rgba(255, 255, 255, 0.05)';
    context.fillRect(0, 0, 64, 64);
    airTexture.update();
    airSystem.particleTexture = airTexture;
    
    // Emitter
    airSystem.emitter = new BABYLON.Vector3(0, 8, 0);
    airSystem.minEmitBox = new BABYLON.Vector3(-25, -5, -15);
    airSystem.maxEmitBox = new BABYLON.Vector3(25, 5, 15);
    
    // Colors
    airSystem.color1 = new BABYLON.Color4(0.9, 0.95, 1.0, 0.05);
    airSystem.color2 = new BABYLON.Color4(0.8, 0.9, 1.0, 0.1);
    airSystem.colorDead = new BABYLON.Color4(0.8, 0.9, 1.0, 0.0);
    
    // Size
    airSystem.minSize = 0.5;
    airSystem.maxSize = 2.0;
    
    // Life time
    airSystem.minLifeTime = 15;
    airSystem.maxLifeTime = 30;
    
    // Emission rate
    airSystem.emitRate = 3;
    
    // Blend mode
    airSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    
    // Gravity
    airSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    
    // Direction
    airSystem.direction1 = new BABYLON.Vector3(-0.1, 0, -0.1);
    airSystem.direction2 = new BABYLON.Vector3(0.1, 0, 0.1);
    
    // Speed
    airSystem.minEmitPower = 0.05;
    airSystem.maxEmitPower = 0.15;
    airSystem.updateSpeed = 0.002;
    
    // Add noise for realistic movement
    airSystem.noiseTexture = new BABYLON.NoiseProceduralTexture('perlin', 256, this.scene);
    airSystem.noiseStrength = new BABYLON.Vector3(2, 1, 2);
    
    airSystem.start();
    
    this.particleSystems.set('air', airSystem);
  }

  private createWindowLightRays(): void {
    // Create light ray effects for windows
    const lightRaySystem = new BABYLON.ParticleSystem('lightRays', 50, this.scene);
    
    // Create light ray texture
    const rayTexture = new BABYLON.DynamicTexture('rayTexture', 256, this.scene);
    const context = rayTexture.getContext();
    
    // Create a light ray gradient
    const gradient = context.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    rayTexture.update();
    
    lightRaySystem.particleTexture = rayTexture;
    
    // Position near windows
    lightRaySystem.emitter = new BABYLON.Vector3(20, 8, 0);
    lightRaySystem.minEmitBox = new BABYLON.Vector3(-1, -2, -10);
    lightRaySystem.maxEmitBox = new BABYLON.Vector3(1, 2, 10);
    
    // Colors
    lightRaySystem.color1 = new BABYLON.Color4(1.0, 1.0, 0.8, 0.1);
    lightRaySystem.color2 = new BABYLON.Color4(1.0, 1.0, 0.9, 0.2);
    lightRaySystem.colorDead = new BABYLON.Color4(1.0, 1.0, 0.8, 0.0);
    
    // Size
    lightRaySystem.minSize = 0.5;
    lightRaySystem.maxSize = 1.5;
    
    // Life time
    lightRaySystem.minLifeTime = 10;
    lightRaySystem.maxLifeTime = 20;
    
    // Emission rate
    lightRaySystem.emitRate = 2;
    
    // Blend mode
    lightRaySystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    
    // Direction - moving towards interior
    lightRaySystem.direction1 = new BABYLON.Vector3(-1, -0.1, -0.1);
    lightRaySystem.direction2 = new BABYLON.Vector3(-0.5, 0.1, 0.1);
    
    // Speed
    lightRaySystem.minEmitPower = 0.5;
    lightRaySystem.maxEmitPower = 1.0;
    lightRaySystem.updateSpeed = 0.01;
    
    lightRaySystem.start();
    
    this.particleSystems.set('lightRays', lightRaySystem);
  }

  public createAirConditioningEffect(position: BABYLON.Vector3): void {
    const acSystem = new BABYLON.ParticleSystem('airConditioning', 30, this.scene);
    
    // Create cool air texture
    const coolTexture = new BABYLON.DynamicTexture('coolTexture', 32, this.scene);
    const context = coolTexture.getContext();
    context.fillStyle = 'rgba(200, 220, 255, 0.3)';
    context.fillRect(0, 0, 32, 32);
    coolTexture.update();
    
    acSystem.particleTexture = coolTexture;
    
    // Position at AC unit
    acSystem.emitter = position;
    acSystem.minEmitBox = new BABYLON.Vector3(-0.2, 0, -0.2);
    acSystem.maxEmitBox = new BABYLON.Vector3(0.2, 0, 0.2);
    
    // Cool air colors
    acSystem.color1 = new BABYLON.Color4(0.8, 0.9, 1.0, 0.3);
    acSystem.color2 = new BABYLON.Color4(0.7, 0.8, 1.0, 0.5);
    acSystem.colorDead = new BABYLON.Color4(0.8, 0.9, 1.0, 0.0);
    
    // Small particles
    acSystem.minSize = 0.1;
    acSystem.maxSize = 0.3;
    
    // Short life time for quick air movement
    acSystem.minLifeTime = 3;
    acSystem.maxLifeTime = 6;
    
    // High emission rate for continuous air flow
    acSystem.emitRate = 20;
    
    // Downward air flow
    acSystem.direction1 = new BABYLON.Vector3(-0.5, -2, -0.5);
    acSystem.direction2 = new BABYLON.Vector3(0.5, -1, 0.5);
    
    // Fast air movement
    acSystem.minEmitPower = 1;
    acSystem.maxEmitPower = 3;
    acSystem.updateSpeed = 0.02;
    
    acSystem.start();
    
    const systemId = `ac_${position.x}_${position.y}_${position.z}`;
    this.particleSystems.set(systemId, acSystem);
  }

  public createSmokeEffect(position: BABYLON.Vector3, intensity: number = 1.0): void {
    const smokeSystem = new BABYLON.ParticleSystem('smoke', Math.floor(100 * intensity), this.scene);
    
    // Smoke texture
    const smokeTexture = new BABYLON.DynamicTexture('smokeTexture', 128, this.scene);
    const context = smokeTexture.getContext();
    
    // Create smoke-like texture
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(100, 100, 100, 0.8)');
    gradient.addColorStop(0.5, 'rgba(80, 80, 80, 0.4)');
    gradient.addColorStop(1, 'rgba(60, 60, 60, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    smokeTexture.update();
    
    smokeSystem.particleTexture = smokeTexture;
    
    // Emitter
    smokeSystem.emitter = position;
    smokeSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0, -0.1);
    smokeSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0, 0.1);
    
    // Smoke colors
    smokeSystem.color1 = new BABYLON.Color4(0.4, 0.4, 0.4, 0.8);
    smokeSystem.color2 = new BABYLON.Color4(0.3, 0.3, 0.3, 0.6);
    smokeSystem.colorDead = new BABYLON.Color4(0.2, 0.2, 0.2, 0.0);
    
    // Growing particles
    smokeSystem.minSize = 0.2;
    smokeSystem.maxSize = 2.0;
    smokeSystem.minScaleX = 0.5;
    smokeSystem.maxScaleX = 2.0;
    smokeSystem.minScaleY = 0.5;
    smokeSystem.maxScaleY = 2.0;
    
    // Life time
    smokeSystem.minLifeTime = 5;
    smokeSystem.maxLifeTime = 10;
    
    // Emission rate
    smokeSystem.emitRate = 20 * intensity;
    
    // Rising smoke
    smokeSystem.direction1 = new BABYLON.Vector3(-0.2, 1, -0.2);
    smokeSystem.direction2 = new BABYLON.Vector3(0.2, 2, 0.2);
    
    // Speed
    smokeSystem.minEmitPower = 0.5;
    smokeSystem.maxEmitPower = 1.5;
    smokeSystem.updateSpeed = 0.02;
    
    // Add turbulence
    smokeSystem.noiseTexture = new BABYLON.NoiseProceduralTexture('smokeNoise', 256, this.scene);
    smokeSystem.noiseStrength = new BABYLON.Vector3(5, 2, 5);
    
    smokeSystem.start();
    
    const systemId = `smoke_${Date.now()}`;
    this.particleSystems.set(systemId, smokeSystem);
    
    // Auto-dispose after some time
    setTimeout(() => {
      this.removeParticleSystem(systemId);
    }, 15000);
  }

  public createSparkEffect(position: BABYLON.Vector3): void {
    const sparkSystem = new BABYLON.ParticleSystem('sparks', 50, this.scene);
    
    // Spark texture
    sparkSystem.particleTexture = new BABYLON.Texture('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', this.scene);
    
    // Emitter
    sparkSystem.emitter = position;
    sparkSystem.minEmitBox = new BABYLON.Vector3(-0.05, 0, -0.05);
    sparkSystem.maxEmitBox = new BABYLON.Vector3(0.05, 0, 0.05);
    
    // Bright colors
    sparkSystem.color1 = new BABYLON.Color4(1.0, 0.8, 0.2, 1.0);
    sparkSystem.color2 = new BABYLON.Color4(1.0, 0.6, 0.0, 1.0);
    sparkSystem.colorDead = new BABYLON.Color4(0.5, 0.2, 0.0, 0.0);
    
    // Small particles
    sparkSystem.minSize = 0.02;
    sparkSystem.maxSize = 0.1;
    
    // Short life
    sparkSystem.minLifeTime = 1;
    sparkSystem.maxLifeTime = 3;
    
    // Burst emission
    sparkSystem.emitRate = 100;
    
    // Random directions
    sparkSystem.direction1 = new BABYLON.Vector3(-2, 1, -2);
    sparkSystem.direction2 = new BABYLON.Vector3(2, 3, 2);
    
    // Fast movement
    sparkSystem.minEmitPower = 2;
    sparkSystem.maxEmitPower = 5;
    sparkSystem.updateSpeed = 0.05;
    
    // Gravity affects sparks
    sparkSystem.gravity = new BABYLON.Vector3(0, -5, 0);
    
    sparkSystem.start();
    
    // Stop after burst
    setTimeout(() => {
      sparkSystem.stop();
      setTimeout(() => sparkSystem.dispose(), 3000);
    }, 500);
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    
    this.particleSystems.forEach(system => {
      if (enabled) {
        system.start();
      } else {
        system.stop();
      }
    });
  }

  public setQualityLevel(level: 'low' | 'medium' | 'high' | 'ultra'): void {
    const qualityMultipliers = {
      low: 0.3,
      medium: 0.6,
      high: 1.0,
      ultra: 1.5
    };
    
    const multiplier = qualityMultipliers[level];
    
    this.particleSystems.forEach(system => {
      // Adjust particle count and emission rate based on quality
      const originalEmitRate = system.emitRate;
      system.emitRate = Math.floor(originalEmitRate * multiplier);
      
      // Adjust update speed for performance
      system.updateSpeed = level === 'low' ? 0.001 : 
                          level === 'medium' ? 0.005 : 
                          level === 'high' ? 0.01 : 0.02;
    });
  }

  public removeParticleSystem(systemId: string): void {
    const system = this.particleSystems.get(systemId);
    if (system) {
      system.stop();
      setTimeout(() => {
        system.dispose();
        this.particleSystems.delete(systemId);
      }, 2000);
    }
  }

  public dispose(): void {
    this.particleSystems.forEach(system => {
      system.stop();
      system.dispose();
    });
    this.particleSystems.clear();
  }
}