import type { CesiumMaterialProperty, MaybeProperty } from '@cesium-vueuse/shared';
import type { Color, JulianDate } from 'cesium';
import type { RadarScanMaterialUniforms } from './material';

import { cesiumEquals, createPropertyField, isCesiumConstant, toPropertyValue } from '@cesium-vueuse/shared';
import { Event } from 'cesium';
import { RadarScanMaterialDefaultUniforms, RadarScanMaterialType } from './material';

/**
 * `RadarScanMaterialProperty`构建参数
 */
export interface RadarScanMaterialPropertyConstructorOptions {
  /**
   * 基础水色
   * @default Color.YELLOW
   */
  color?: MaybeProperty<Color | undefined>;

  /**
   * 混合色
   * @default new Color(0, 1, 0.699, 1)
   */
  speed?: MaybeProperty<number | undefined>;
}

/**
 * 水波纹
 */
export class RadarScanMaterialProperty implements CesiumMaterialProperty<RadarScanMaterialUniforms> {
  constructor(options: RadarScanMaterialPropertyConstructorOptions = {}) {
    createPropertyField(this, 'color', options.color);
    createPropertyField(this, 'speed', options.speed);
  }

  color?: MaybeProperty<Color | undefined>;

  speed?: MaybeProperty<number | undefined>;

  get isConstant(): boolean {
    return (
      isCesiumConstant(this.color)
      && isCesiumConstant(this.speed)
    );
  }

  getType(_time?: JulianDate): string {
    return RadarScanMaterialType;
  }

  /**
   * @internal
   */
  private _definitionChanged = new Event();

  get definitionChanged(): Event<(scope: this, field: string, value: any, previous: any) => void> {
    return this._definitionChanged;
  }

  getValue(time: JulianDate, result?: RadarScanMaterialUniforms): RadarScanMaterialUniforms {
    const uniforms = RadarScanMaterialDefaultUniforms;
    const data = Object.assign(result ?? {}, {
      color: toPropertyValue(this.color, time) ?? uniforms.color,
      speed: toPropertyValue(this.speed, time) ?? uniforms.speed,
    });
    return data;
  }

  equals(other?: RadarScanMaterialProperty): boolean {
    return (
      cesiumEquals(this.color, other?.color)
      && cesiumEquals(this.speed, other?.speed)
    );
  }
}
