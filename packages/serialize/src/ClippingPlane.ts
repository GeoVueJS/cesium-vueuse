import type { Cartesian3JSON } from './Cartesian3';
import { notNullish } from '@vueuse/core';
import { ClippingPlane } from 'cesium';

import { Cartesian3Serialize } from './Cartesian3';

export interface ClippingPlaneJSON {
  normal: Cartesian3JSON;
  distance: number;
}

/**
 * Serialize a `ClippingPlane` instance to JSON and deserialize from JSON
 */
export class ClippingPlaneSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is ClippingPlane {
    return value instanceof ClippingPlane;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ClippingPlane): ClippingPlaneJSON | undefined {
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
  static fromJSON(json?: ClippingPlaneJSON, result?: ClippingPlane): ClippingPlane | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new ClippingPlane(
      Cartesian3Serialize.fromJSON(json.normal)!,
      json.distance,
    );
    return result ? ClippingPlane.clone(instance, result) : instance;
  }
}
