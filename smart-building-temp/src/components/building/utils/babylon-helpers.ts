/**
 * Babylon.js Helper Utilities
 */

import * as BABYLON from '@babylonjs/core';

/**
 * Convert floor coordinates to 3D world position
 */
export function floorToWorldPosition(
  x: number,
  y: number,
  floor: number,
  floorHeight: number = 3.5
): BABYLON.Vector3 {
  return new BABYLON.Vector3(
    x - 25, // Center the building
    (floor - 1) * floorHeight,
    y - 15  // Center the building
  );
}

/**
 * Create a gradient material for heatmap visualization
 */
export function createHeatmapMaterial(
  name: string,
  scene: BABYLON.Scene,
  value: number // 0 to 1
): BABYLON.StandardMaterial {
  const material = new BABYLON.StandardMaterial(name, scene);
  
  // Green -> Yellow -> Red gradient
  if (value < 0.5) {
    const t = value * 2;
    material.diffuseColor = new BABYLON.Color3(t, 1, 0);
  } else {
    const t = (value - 0.5) * 2;
    material.diffuseColor = new BABYLON.Color3(1, 1 - t, 0);
  }
  
  material.alpha = 0.7;
  material.emissiveColor = material.diffuseColor.scale(0.3);
  
  return material;
}

/**
 * Create animated particle system for alerts
 */
export function createAlertParticles(
  position: BABYLON.Vector3,
  scene: BABYLON.Scene
): BABYLON.ParticleSystem {
  const particleSystem = new BABYLON.ParticleSystem('alert', 200, scene);
  
  // Texture
  particleSystem.particleTexture = new BABYLON.Texture(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    scene
  );
  
  // Position
  particleSystem.emitter = position;
  particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0, -0.1);
  particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0, 0.1);
  
  // Colors
  particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1);
  particleSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1);
  particleSystem.colorDead = new BABYLON.Color4(1, 0, 0, 0);
  
  // Size
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.3;
  
  // Life time
  particleSystem.minLifeTime = 0.5;
  particleSystem.maxLifeTime = 1.0;
  
  // Emission
  particleSystem.emitRate = 30;
  
  // Speed
  particleSystem.minEmitPower = 1;
  particleSystem.maxEmitPower = 2;
  particleSystem.updateSpeed = 0.01;
  
  // Direction
  particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
  particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
  
  return particleSystem;
}

/**
 * Create a glowing effect for selected objects
 */
export function addGlowEffect(
  mesh: BABYLON.Mesh,
  scene: BABYLON.Scene,
  color: BABYLON.Color3 = new BABYLON.Color3(0, 0.5, 1)
): void {
  const gl = new BABYLON.GlowLayer('glow', scene);
  gl.intensity = 0.5;
  gl.addIncludedOnlyMesh(mesh);
  gl.customEmissiveColorSelector = (mesh, subMesh, material, result) => {
    result.set(color.r, color.g, color.b, 1);
  };
}

/**
 * Create smooth transition between floors
 */
export function createFloorTransition(
  fromFloor: number,
  toFloor: number,
  duration: number = 1000,
  onComplete?: () => void
): void {
  // This would implement a smooth transition effect
  // For now, just call the completion callback
  setTimeout(() => {
    onComplete?.();
  }, duration);
}

/**
 * Format device coordinates from IoT data to 3D space
 */
export function deviceCoordinatesTo3D(
  coords: { x: number; y: number },
  floor: number
): BABYLON.Vector3 {
  return floorToWorldPosition(coords.x, coords.y, floor);
}

/**
 * Create optimized instances for repeated meshes
 */
export function createInstances(
  sourceMesh: BABYLON.Mesh,
  positions: BABYLON.Vector3[],
  scene: BABYLON.Scene
): BABYLON.InstancedMesh[] {
  const instances: BABYLON.InstancedMesh[] = [];
  
  positions.forEach((position, index) => {
    const instance = sourceMesh.createInstance(`instance_${index}`);
    instance.position = position;
    instances.push(instance);
  });
  
  return instances;
}

/**
 * Dispose of Babylon.js resources properly
 */
export function disposeScene(scene: BABYLON.Scene): void {
  scene.meshes.forEach(mesh => {
    mesh.dispose();
  });
  
  scene.materials.forEach(material => {
    material.dispose();
  });
  
  scene.textures.forEach(texture => {
    texture.dispose();
  });
  
  scene.particleSystems.forEach(ps => {
    ps.dispose();
  });
  
  scene.dispose();
}