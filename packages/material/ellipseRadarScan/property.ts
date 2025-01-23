import type { MaybeProperty } from '@cesium-vueuse/shared';
import type { Color, JulianDate } from 'cesium';
import type { CesiumMaterialProperty } from '../types';
import type { EllipseRadarScanMaterialUniforms } from './material';

import { cesiumEquals, createPropertyField, isCesiumConstant, toPropertyValue } from '@cesium-vueuse/shared';
import { Event } from 'cesium';
import { EllipseRadarScanMaterialDefaultUniforms, EllipseRadarScanMaterialType } from './material';

/**
 * `EllipseRadarScanMaterialProperty`构建参数
 */
export interface EllipseRadarScanMaterialPropertyConstructorOptions {
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
export class EllipseRadarScanMaterialProperty implements CesiumMaterialProperty<EllipseRadarScanMaterialUniforms> {
  constructor(options: EllipseRadarScanMaterialPropertyConstructorOptions = {}) {
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
    return EllipseRadarScanMaterialType;
  }

  /**
   * @internal
   */
  private _definitionChanged = new Event();

  get definitionChanged(): Event<(scope: this, field: string, value: any, previous: any) => void> {
    return this._definitionChanged;
  }

  getValue(time: JulianDate, result?: EllipseRadarScanMaterialUniforms): EllipseRadarScanMaterialUniforms {
    const uniforms = EllipseRadarScanMaterialDefaultUniforms;
    const data = Object.assign(result ?? {}, {
      color: toPropertyValue(this.color, time) ?? uniforms.color,
      speed: toPropertyValue(this.speed, time) ?? uniforms.speed,
    });
    return data;
  }

  equals(other?: EllipseRadarScanMaterialProperty): boolean {
    return (
      cesiumEquals(this.color, other?.color)
      && cesiumEquals(this.speed, other?.speed)
    );
  }
}
