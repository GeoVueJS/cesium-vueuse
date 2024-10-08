import { Color } from 'cesium';
import { addMaterialCache } from '../utils';
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
 * 水波纹材质
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
