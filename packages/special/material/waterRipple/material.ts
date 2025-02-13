import { addMaterialCache, getMaterialCache } from '@cesium-vueuse/shared';
import { buildModuleUrl, Color, Material } from 'cesium';

export interface WaterRippleMaterialUniforms {
  baseWaterColor: Color;
  blendColor: Color;
  specularMap: string;
  normalMap: string;
  frequency: number;
  animationSpeed: number;
  amplitude: number;
  specularIntensity: number;
  fadeFactor: number;
}

export const WaterRippleMaterialType = 'WaterRipple';

export const WaterRippleMaterialDefaultUniforms: WaterRippleMaterialUniforms = {
  baseWaterColor: new Color(0.2, 0.3, 0.6, 1),
  blendColor: new Color(0, 1, 0.699, 1),
  specularMap: Material.DefaultImageId,
  normalMap: buildModuleUrl('Assets/Textures/waterNormals.jpg'),
  frequency: 10000,
  animationSpeed: 0.01,
  amplitude: 1,
  specularIntensity: 0.5,
  fadeFactor: 1,
};

const WaterRippleMaterial = getMaterialCache('Water')!;

/**
 * 水波纹材质
 */
addMaterialCache(WaterRippleMaterialType, {
  fabric: {
    type: WaterRippleMaterialType,
    source: WaterRippleMaterial.fabric.source,
    uniforms: { ...WaterRippleMaterialDefaultUniforms },
  },
  translucent(material) {
    const uniforms = material.uniforms;
    return uniforms.baseWaterColor.alpha < 1 || uniforms.blendColor.alpha < 1;
  },
});
