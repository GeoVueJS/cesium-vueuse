import { addMaterialCache } from '@vesium/shared';
import { Color } from 'cesium';
import { RadarScanMaterialSource } from './source';

export const RadarScanMaterialType = 'RadarScan';

export interface RadarScanMaterialUniforms {
  color: Color;
  speed: number;
}

export const RadarScanMaterialDefaultUniforms: RadarScanMaterialUniforms = {
  color: Color.YELLOW,
  speed: 10,
};

/**
 * 雷达扫描
 */
addMaterialCache(RadarScanMaterialType, {
  fabric: {
    type: RadarScanMaterialType,
    source: RadarScanMaterialSource,
    uniforms: { ...RadarScanMaterialDefaultUniforms },
  },
  translucent(material) {
    const uniforms = material.uniforms;
    return uniforms.color.alpha < 1 || uniforms.color.alpha < 1;
  },
});
