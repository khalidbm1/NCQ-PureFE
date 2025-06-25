/**
 * AdvancedMaterialLibrary - Realistic PBR materials for enhanced 3D building visualization
 */

import * as BABYLON from '@babylonjs/core';

export class AdvancedMaterialLibrary {
  private scene: BABYLON.Scene;
  private materials: Map<string, BABYLON.Material> = new Map();
  private textures: Map<string, BABYLON.Texture> = new Map();

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.initializeTextures();
  }

  private initializeTextures(): void {
    // Create procedural textures for materials
    this.createProceduralTextures();
  }

  private createProceduralTextures(): void {
    // Concrete texture
    const concreteTexture = new BABYLON.NoiseProceduralTexture('concreteTexture', 512, this.scene);
    concreteTexture.octaves = 4;
    concreteTexture.persistence = 0.8;
    concreteTexture.animationSpeedFactor = 0;
    this.textures.set('concrete_diffuse', concreteTexture);

    // Wood texture (using noise texture as wood texture is not available in core)
    const woodTexture = new BABYLON.NoiseProceduralTexture('woodTexture', 512, this.scene);
    woodTexture.octaves = 3;
    woodTexture.persistence = 0.7;
    woodTexture.animationSpeedFactor = 0;
    this.textures.set('wood_diffuse', woodTexture);

    // Metal texture
    const metalTexture = new BABYLON.NoiseProceduralTexture('metalTexture', 256, this.scene);
    metalTexture.octaves = 2;
    metalTexture.persistence = 0.9;
    this.textures.set('metal_diffuse', metalTexture);

    // Fabric texture
    const fabricTexture = new BABYLON.NoiseProceduralTexture('fabricTexture', 256, this.scene);
    fabricTexture.octaves = 6;
    fabricTexture.persistence = 0.6;
    this.textures.set('fabric_diffuse', fabricTexture);
  }

  public createGroundMaterial(): BABYLON.PBRMaterial {
    if (this.materials.has('ground')) {
      return this.materials.get('ground') as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial('groundMaterial', this.scene);
    
    // PBR properties for realistic ground
    material.albedoColor = new BABYLON.Color3(0.8, 0.8, 0.75);
    material.metallic = 0.0;
    material.roughness = 0.9;
    
    // Add normal map for surface detail
    const normalTexture = new BABYLON.NoiseProceduralTexture('groundNormal', 1024, this.scene);
    normalTexture.octaves = 4;
    normalTexture.persistence = 0.5;
    material.bumpTexture = normalTexture;
    material.bumpTexture.level = 0.5;
    
    // Add subtle reflections
    material.environmentIntensity = 0.2;
    
    this.materials.set('ground', material);
    return material;
  }

  public createPathwayMaterial(): BABYLON.PBRMaterial {
    if (this.materials.has('pathway')) {
      return this.materials.get('pathway') as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial('pathwayMaterial', this.scene);
    
    material.albedoColor = new BABYLON.Color3(0.4, 0.4, 0.45);
    material.metallic = 0.1;
    material.roughness = 0.7;
    material.environmentIntensity = 0.3;
    
    this.materials.set('pathway', material);
    return material;
  }

  public createConcreteMaterial(): BABYLON.PBRMaterial {
    if (this.materials.has('concrete')) {
      return this.materials.get('concrete') as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial('concreteMaterial', this.scene);
    
    material.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.82);
    material.metallic = 0.0;
    material.roughness = 0.8;
    
    // Use procedural concrete texture
    const concreteTexture = this.textures.get('concrete_diffuse');
    if (concreteTexture) {
      material.albedoTexture = concreteTexture;
      material.bumpTexture = concreteTexture;
      material.bumpTexture.level = 0.3;
    }
    
    material.environmentIntensity = 0.1;
    
    this.materials.set('concrete', material);
    return material;
  }

  public createCeilingMaterial(): BABYLON.PBRMaterial {
    if (this.materials.has('ceiling')) {
      return this.materials.get('ceiling') as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial('ceilingMaterial', this.scene);
    
    material.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.95);
    material.metallic = 0.0;
    material.roughness = 0.6;
    material.environmentIntensity = 0.2;
    
    this.materials.set('ceiling', material);
    return material;
  }

  public createSteelMaterial(): BABYLON.PBRMaterial {
    if (this.materials.has('steel')) {
      return this.materials.get('steel') as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial('steelMaterial', this.scene);
    
    material.albedoColor = new BABYLON.Color3(0.7, 0.7, 0.75);
    material.metallic = 0.9;
    material.roughness = 0.2;
    material.environmentIntensity = 1.0;
    
    // Add brushed metal effect
    const metalTexture = this.textures.get('metal_diffuse');
    if (metalTexture) {
      material.metallicTexture = metalTexture;
    }
    
    this.materials.set('steel', material);
    return material;
  }

  public createWallMaterial(roomType: string): BABYLON.PBRMaterial {
    const materialName = `wall_${roomType}`;
    if (this.materials.has(materialName)) {
      return this.materials.get(materialName) as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial(materialName, this.scene);
    
    // Customize wall material based on room type
    switch (roomType) {
      case 'office':
        material.albedoColor = new BABYLON.Color3(0.9, 0.9, 0.85);
        material.roughness = 0.7;
        break;
      case 'conference':
        material.albedoColor = new BABYLON.Color3(0.8, 0.85, 0.9);
        material.roughness = 0.5;
        break;
      case 'openspace':
        material.albedoColor = new BABYLON.Color3(0.85, 0.9, 0.85);
        material.roughness = 0.6;
        break;
      default:
        material.albedoColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        material.roughness = 0.7;
    }
    
    material.metallic = 0.0;
    material.environmentIntensity = 0.2;
    
    this.materials.set(materialName, material);
    return material;
  }

  public createFloorMaterial(roomType: string): BABYLON.PBRMaterial {
    const materialName = `floor_${roomType}`;
    if (this.materials.has(materialName)) {
      return this.materials.get(materialName) as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial(materialName, this.scene);
    
    // Customize floor material based on room type
    switch (roomType) {
      case 'office':
        material.albedoColor = new BABYLON.Color3(0.6, 0.4, 0.2); // Wood
        material.metallic = 0.0;
        material.roughness = 0.4;
        const woodTexture = this.textures.get('wood_diffuse');
        if (woodTexture) {
          material.albedoTexture = woodTexture;
        }
        break;
      case 'conference':
        material.albedoColor = new BABYLON.Color3(0.3, 0.3, 0.35); // Dark carpet
        material.metallic = 0.0;
        material.roughness = 0.9;
        break;
      case 'openspace':
        material.albedoColor = new BABYLON.Color3(0.7, 0.7, 0.65); // Light carpet
        material.metallic = 0.0;
        material.roughness = 0.8;
        break;
      default:
        material.albedoColor = new BABYLON.Color3(0.8, 0.8, 0.8); // Tile
        material.metallic = 0.1;
        material.roughness = 0.3;
    }
    
    material.environmentIntensity = 0.3;
    
    this.materials.set(materialName, material);
    return material;
  }

  public createWoodMaterial(): BABYLON.PBRMaterial {
    if (this.materials.has('wood')) {
      return this.materials.get('wood') as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial('woodMaterial', this.scene);
    
    material.albedoColor = new BABYLON.Color3(0.6, 0.4, 0.2);
    material.metallic = 0.0;
    material.roughness = 0.7;
    
    const woodTexture = this.textures.get('wood_diffuse');
    if (woodTexture) {
      material.albedoTexture = woodTexture;
      material.bumpTexture = woodTexture;
      material.bumpTexture.level = 0.2;
    }
    
    material.environmentIntensity = 0.4;
    
    this.materials.set('wood', material);
    return material;
  }

  public createFabricMaterial(): BABYLON.PBRMaterial {
    if (this.materials.has('fabric')) {
      return this.materials.get('fabric') as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial('fabricMaterial', this.scene);
    
    material.albedoColor = new BABYLON.Color3(0.2, 0.3, 0.5);
    material.metallic = 0.0;
    material.roughness = 0.9;
    
    const fabricTexture = this.textures.get('fabric_diffuse');
    if (fabricTexture) {
      material.albedoTexture = fabricTexture;
    }
    
    material.environmentIntensity = 0.1;
    
    this.materials.set('fabric', material);
    return material;
  }

  public createScreenMaterial(): BABYLON.PBRMaterial {
    if (this.materials.has('screen')) {
      return this.materials.get('screen') as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial('screenMaterial', this.scene);
    
    material.albedoColor = new BABYLON.Color3(0.1, 0.2, 0.3);
    material.metallic = 0.0;
    material.roughness = 0.1;
    material.emissiveColor = new BABYLON.Color3(0.0, 0.1, 0.2);
    material.environmentIntensity = 0.5;
    
    // Create animated screen content
    const screenTexture = new BABYLON.DynamicTexture('screenTexture', { width: 512, height: 256 }, this.scene);
    this.animateScreenContent(screenTexture);
    material.albedoTexture = screenTexture;
    material.emissiveTexture = screenTexture;
    
    this.materials.set('screen', material);
    return material;
  }

  private animateScreenContent(texture: BABYLON.DynamicTexture): void {
    const context = texture.getContext();
    let frame = 0;
    
    const animate = () => {
      // Clear canvas
      context.fillStyle = '#001122';
      context.fillRect(0, 0, 512, 256);
      
      // Draw animated content
      context.fillStyle = '#00ff88';
      context.font = '20px Arial';
      context.fillText('Smart Building System', 50, 50);
      
      // Draw animated bars
      for (let i = 0; i < 8; i++) {
        const height = Math.sin(frame * 0.1 + i * 0.5) * 50 + 100;
        context.fillStyle = `hsl(${120 + i * 20}, 70%, 50%)`;
        context.fillRect(50 + i * 50, 200 - height, 30, height);
      }
      
      // Draw time
      context.fillStyle = '#ffffff';
      context.font = '16px Arial';
      context.fillText(new Date().toLocaleTimeString(), 300, 200);
      
      texture.update();
      frame++;
      
      setTimeout(animate, 100);
    };
    
    animate();
  }

  public createGlassMaterial(): BABYLON.PBRMaterial {
    if (this.materials.has('glass')) {
      return this.materials.get('glass') as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial('glassMaterial', this.scene);
    
    material.albedoColor = new BABYLON.Color3(0.9, 0.95, 1.0);
    material.metallic = 0.0;
    material.roughness = 0.0;
    material.alpha = 0.3;
    material.indexOfRefraction = 1.52;
    material.environmentIntensity = 1.0;
    material.cameraExposure = 0.66;
    material.cameraContrast = 1.66;
    
    this.materials.set('glass', material);
    return material;
  }

  public createMetalFrameMaterial(): BABYLON.PBRMaterial {
    if (this.materials.has('metalFrame')) {
      return this.materials.get('metalFrame') as BABYLON.PBRMaterial;
    }

    const material = new BABYLON.PBRMaterial('metalFrameMaterial', this.scene);
    
    material.albedoColor = new BABYLON.Color3(0.8, 0.8, 0.85);
    material.metallic = 0.9;
    material.roughness = 0.1;
    material.environmentIntensity = 1.0;
    
    this.materials.set('metalFrame', material);
    return material;
  }

  public dispose(): void {
    // Dispose all materials
    this.materials.forEach(material => material.dispose());
    this.materials.clear();
    
    // Dispose all textures
    this.textures.forEach(texture => texture.dispose());
    this.textures.clear();
  }
}