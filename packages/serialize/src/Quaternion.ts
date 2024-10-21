import { isHasValue } from '@cesium-vueuse/shared';

import { Quaternion } from 'cesium';

export interface QuaternionJSON {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 * Serialize a `Quaternion` instance to JSON and deserialize from JSON
 */
export class QuaternionSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is Quaternion {
    return value instanceof Quaternion;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Quaternion): QuaternionJSON | undefined {
    if (isHasValue(instance)) {
      return {
        x: instance.x,
        y: instance.y,
        z: instance.z,
        w: instance.w,
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: QuaternionJSON, result?: Quaternion): Quaternion | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new Quaternion(
      json.x,
      json.y,
      json.z,
      json.w,
    );
    return result ? instance.clone(result) : instance;
  }
}
