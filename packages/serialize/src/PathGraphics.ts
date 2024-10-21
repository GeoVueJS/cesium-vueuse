import type { JulianDate } from 'cesium';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { MaterialPropertyJSON } from './MaterialProperty';
import { isHasValue, toPropertyValue } from '@cesium-vueuse/shared';
import { PathGraphics } from 'cesium';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';

import { MaterialPropertySerialize } from './MaterialProperty';

export interface PathGraphicsJSON {
  show?: boolean;
  leadTime?: number;
  trailTime?: number;
  width?: number;
  resolution?: number;
  material?: MaterialPropertyJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
}

/**
 * Serialize a `PathGraphics` instance to JSON and deserialize from JSON
 */
export class PathGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is PathGraphics {
    return value instanceof PathGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PathGraphics, time?: JulianDate): PathGraphicsJSON | undefined {
    if (isHasValue(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        leadTime: toPropertyValue(instance.leadTime, time),
        trailTime: toPropertyValue(instance.trailTime, time),
        width: toPropertyValue(instance.width, time),
        resolution: toPropertyValue(instance.resolution, time),
        material: MaterialPropertySerialize.toJSON(toPropertyValue(instance.material, time)),
        distanceDisplayCondition: DistanceDisplayConditionSerialize.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PathGraphicsJSON, result?: PathGraphics): PathGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new PathGraphics({
      show: json.show,
      leadTime: json.leadTime,
      trailTime: json.trailTime,
      width: json.width,
      resolution: json.resolution,
      material: MaterialPropertySerialize.fromJSON(json.material),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
    });
    return result ? instance.clone(result) : instance;
  }
}
