import type { JulianDate } from 'cesium';
import type { Cartesian2JSON } from './Cartesian2';
import type { ColorJSON } from './Color';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { MaterialPropertyJSON } from './MaterialProperty';
import type { PlaneJSON } from './Plane';
import type { ShadowModeJSON } from './ShadowMode';
import { isHasValue, toPropertyValue } from '@cesium-vueuse/shared';
import { PlaneGraphics } from 'cesium';

import { Cartesian2Serialize } from './Cartesian2';
import { ColorSerialize } from './Color';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { MaterialPropertySerialize } from './MaterialProperty';
import { PlaneSerialize } from './Plane';

import { ShadowModeSerialize } from './ShadowMode';

export interface PlaneGraphicsJSON {
  show?: boolean;
  plane?: PlaneJSON;
  dimensions?: Cartesian2JSON;
  fill?: boolean;
  material?: MaterialPropertyJSON;
  outline?: boolean;
  outlineColor?: ColorJSON;
  outlineWidth?: number;
  shadows?: ShadowModeJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
}

/**
 * Serialize a `PlaneGraphics` instance to JSON and deserialize from JSON
 */
export class PlaneGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is PlaneGraphics {
    return value instanceof PlaneGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PlaneGraphics, time?: JulianDate): PlaneGraphicsJSON | undefined {
    if (isHasValue(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        plane: PlaneSerialize.toJSON(toPropertyValue(instance.plane, time)),
        dimensions: Cartesian2Serialize.toJSON(toPropertyValue(instance.dimensions, time)),
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
  static fromJSON(json?: PlaneGraphicsJSON, result?: PlaneGraphics): PlaneGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new PlaneGraphics({
      show: json.show,
      plane: PlaneSerialize.fromJSON(json.plane),
      dimensions: Cartesian2Serialize.fromJSON(json.dimensions),
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
