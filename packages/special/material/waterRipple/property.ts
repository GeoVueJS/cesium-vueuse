import type { CesiumMaterialProperty, MaybeProperty } from '@cesium-vueuse/shared';
import type { Color, JulianDate } from 'cesium';
import type { WaterRippleMaterialUniforms } from './material';

import { cesiumEquals, createPropertyField, isCesiumConstant, toPropertyValue } from '@cesium-vueuse/shared';
import { Event } from 'cesium';
import { WaterRippleMaterialDefaultUniforms, WaterRippleMaterialType } from './material';

/**
 * `WaterRippleMaterialProperty`构建参数
 */
export interface WaterRippleMaterialPropertyConstructorOptions {
  /**
   * 基础水色
   * @default new Color(0.2, 0.3, 0.6, 1)
   */
  baseWaterColor?: MaybeProperty<Color | undefined>;

  /**
   * 混合色
   * @default new Color(0, 1, 0.699, 1)
   */
  blendColor?: MaybeProperty<Color | undefined>;

  /**
   * 镜面反射贴图
   * @default Material.DefaultImageId
   */
  specularMap?: MaybeProperty<string | undefined>;

  /**
   * 法线贴图
   * @default buildModuleUrl('Assets/Textures/waterNormals.jpg')
   */
  normalMap?: MaybeProperty<string | undefined>;

  /**
   * 频率
   * @default 10000
   */
  frequency?: MaybeProperty<number | undefined>;

  /**
   * 动画速度
   * @default 0.01
   */
  animationSpeed?: MaybeProperty<number | undefined>;

  /**
   * 波幅
   * @default 1
   */
  amplitude?: MaybeProperty<number | undefined>;

  /**
   * 镜面反射强度
   * @default 0.5
   */
  specularIntensity?: MaybeProperty<number | undefined>;

  /**
   * 衰落因子
   * @default 1
   */
  fadeFactor?: MaybeProperty<number | undefined>;
}

/**
 * 水波纹
 */
export class WaterRippleMaterialProperty implements CesiumMaterialProperty<WaterRippleMaterialUniforms> {
  constructor(options: WaterRippleMaterialPropertyConstructorOptions = {}) {
    createPropertyField(this, 'baseWaterColor', options.baseWaterColor);
    createPropertyField(this, 'blendColor', options.blendColor);
    createPropertyField(this, 'specularMap', options.specularMap);
    createPropertyField(this, 'normalMap', options.normalMap);
    createPropertyField(this, 'frequency', options.frequency);
    createPropertyField(this, 'animationSpeed', options.animationSpeed);
    createPropertyField(this, 'amplitude', options.amplitude);
    createPropertyField(this, 'specularIntensity', options.specularIntensity);
    createPropertyField(this, 'fadeFactor', options.fadeFactor);
  }

  baseWaterColor?: MaybeProperty<Color | undefined>;

  blendColor?: MaybeProperty<Color | undefined>;

  specularMap?: MaybeProperty<string | undefined>;

  normalMap?: MaybeProperty<string | undefined>;

  frequency?: MaybeProperty<number | undefined>;

  animationSpeed?: MaybeProperty<number | undefined>;

  amplitude?: MaybeProperty<number | undefined>;

  specularIntensity?: MaybeProperty<number | undefined>;

  fadeFactor?: MaybeProperty<number | undefined>;

  get isConstant(): boolean {
    return (
      isCesiumConstant(this.baseWaterColor)
      && isCesiumConstant(this.blendColor)
      && isCesiumConstant(this.specularMap)
      && isCesiumConstant(this.normalMap)
      && isCesiumConstant(this.frequency)
      && isCesiumConstant(this.animationSpeed)
      && isCesiumConstant(this.amplitude)
      && isCesiumConstant(this.specularIntensity)
      && isCesiumConstant(this.fadeFactor)
    );
  }

  getType(_time?: JulianDate): string {
    return WaterRippleMaterialType;
  }

  /**
   * @internal
   */
  private _definitionChanged = new Event();

  get definitionChanged(): Event<(scope: this, field: string, value: any, previous: any) => void> {
    return this._definitionChanged;
  }

  getValue(time: JulianDate, result?: WaterRippleMaterialUniforms): WaterRippleMaterialUniforms {
    const uniforms = WaterRippleMaterialDefaultUniforms;
    const data = Object.assign(result ?? {}, {
      baseWaterColor: toPropertyValue(this.baseWaterColor, time) ?? uniforms.baseWaterColor,
      blendColor: toPropertyValue(this.blendColor, time) ?? uniforms.blendColor,
      specularMap: toPropertyValue(this.specularMap, time) ?? uniforms.specularMap,
      normalMap: toPropertyValue(this.normalMap, time) ?? uniforms.normalMap,
      frequency: toPropertyValue(this.frequency, time) ?? uniforms.frequency,
      animationSpeed: toPropertyValue(this.animationSpeed, time) ?? uniforms.animationSpeed,
      amplitude: toPropertyValue(this.amplitude, time) ?? uniforms.amplitude,
      specularIntensity: toPropertyValue(this.specularIntensity, time) ?? uniforms.specularIntensity,
      fadeFactor: toPropertyValue(this.fadeFactor, time) ?? uniforms.fadeFactor,
    });
    return data;
  }

  equals(other?: WaterRippleMaterialProperty): boolean {
    return (
      cesiumEquals(this.baseWaterColor, other?.baseWaterColor)
      && cesiumEquals(this.blendColor, other?.blendColor)
      && cesiumEquals(this.specularMap, other?.specularMap)
      && cesiumEquals(this.normalMap, other?.normalMap)
      && cesiumEquals(this.frequency, other?.frequency)
      && cesiumEquals(this.animationSpeed, other?.animationSpeed)
      && cesiumEquals(this.amplitude, other?.amplitude)
      && cesiumEquals(this.specularIntensity, other?.specularIntensity)
      && cesiumEquals(this.fadeFactor, other?.fadeFactor)
    );
  }
}
