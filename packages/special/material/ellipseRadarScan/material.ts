import { addMaterialCache } from '@cesium-vueuse/shared';
import { Color } from 'cesium';
import { EllipseRadarScanMaterialSource } from './source';

export const EllipseRadarScanMaterialType = 'EllipseRadarScan';

export interface EllipseRadarScanMaterialUniforms {
  color: Color;
  speed: number;
}

export const EllipseRadarScanMaterialDefaultUniforms: EllipseRadarScanMaterialUniforms = {
  color: Color.YELLOW,
  speed: 10,
};

/**
 * 雷达扫描
 */
addMaterialCache(EllipseRadarScanMaterialType, {
  fabric: {
    type: EllipseRadarScanMaterialType,
    source: EllipseRadarScanMaterialSource,
    uniforms: { ...EllipseRadarScanMaterialDefaultUniforms },
  },
  translucent(material) {
    const uniforms = material.uniforms;
    return uniforms.color.alpha < 1 || uniforms.color.alpha < 1;
  },
});
