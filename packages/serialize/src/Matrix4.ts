import { isHasValue } from '@cesium-vueuse/shared';

import { Matrix4 } from 'cesium';

export type Matrix4JSON = number[];

/**
 * Serialize a `Matrix4` instance to JSON and deserialize from JSON
 */
export class Matrix4Serialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is Matrix4 {
    return value instanceof Matrix4;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Matrix4): Matrix4JSON | undefined {
    if (isHasValue(instance)) {
      return Array.from(instance);
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: Matrix4JSON, result?: Matrix4): Matrix4 | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new Matrix4(...json);
    return result ? instance.clone(result) : instance;
  }
}
