import type { Cartesian3JSON } from './Cartesian3';
import { notNullish } from '@vueuse/core';
import { Plane } from 'cesium';

import { Cartesian3Serialize } from './Cartesian3';

export interface PlaneJSON {
  normal: Cartesian3JSON;
  distance: number;
}

/**
 * Serialize a `Plane` instance to JSON and deserialize from JSON
 */
export class PlaneSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is Plane {
    return value instanceof Plane;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Plane): PlaneJSON | undefined {
    if (notNullish(instance)) {
      return {
        normal: Cartesian3Serialize.toJSON(instance.normal)!,
        distance: instance.distance,
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PlaneJSON, result?: Plane): Plane | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new Plane(
      Cartesian3Serialize.fromJSON(json.normal)!,
      json.distance,
    );

    return result ? Plane.clone(instance, result) : instance;
  }
}
