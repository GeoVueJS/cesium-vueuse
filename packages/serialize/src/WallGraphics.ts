import type { JulianDate } from 'cesium';
import type { Cartesian3JSON } from './Cartesian3';
import type { ColorJSON } from './Color';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { MaterialPropertyJSON } from './MaterialProperty';
import type { ShadowModeJSON } from './ShadowMode';
import { toPropertyValue } from '@cesium-vueuse/shared';
import { notNullish } from '@vueuse/core';
import { WallGraphics } from 'cesium';
import { Cartesian3Serialize } from './Cartesian3';
import { ColorSerialize } from './Color';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { MaterialPropertySerialize } from './MaterialProperty';

import { ShadowModeSerialize } from './ShadowMode';

export interface WallGraphicsJSON {
  show?: boolean;
  positions?: Cartesian3JSON[];
  minimumHeights?: number[];
  maximumHeights?: number[];
  granularity?: number;
  fill?: boolean;
  material?: MaterialPropertyJSON;
  outline?: boolean;
  outlineColor?: ColorJSON;
  outlineWidth?: number;
  shadows?: ShadowModeJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
}

/**
 * Serialize a `WallGraphics` instance to JSON and deserialize from JSON
 */
export class WallGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is WallGraphics {
    return value instanceof WallGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: WallGraphics, time?: JulianDate): WallGraphicsJSON | undefined {
    if (notNullish(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        positions: toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3Serialize.toJSON(item)),
        minimumHeights: toPropertyValue(instance.minimumHeights, time),
        maximumHeights: toPropertyValue(instance.maximumHeights, time),
        granularity: toPropertyValue(instance.granularity, time),
        fill: toPropertyValue(instance.fill, time),
        material: MaterialPropertySerialize.toJSON(toPropertyValue(instance.material, time)),
        outline: toPropertyValue(instance.outline, time),
        outlineColor: ColorSerialize.toJSON(toPropertyValue(instance.outlineColor, time)),
        outlineWidth: toPropertyValue(instance.outlineWidth, time),
        shadows: ShadowModeSerialize.toJSON(toPropertyValue(instance.shadows, time)),
        distanceDisplayCondition: DistanceDisplayConditionSerialize.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: WallGraphicsJSON, result?: WallGraphics): WallGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new WallGraphics({
      show: json.show,
      positions: json.positions?.map(item => Cartesian3Serialize.fromJSON(item)!),
      minimumHeights: json.minimumHeights,
      maximumHeights: json.maximumHeights,
      granularity: json.granularity,
      fill: json.fill,
      material: MaterialPropertySerialize.fromJSON(json.material),
      outline: json.outline,
      outlineColor: ColorSerialize.fromJSON(json.outlineColor),
      outlineWidth: json.outlineWidth,
      shadows: ShadowModeSerialize.fromJSON(json.shadows),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
    });
    return result ? instance.clone(result) : instance;
  }
}
