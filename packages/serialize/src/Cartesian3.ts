import { notNullish } from '@vueuse/core';

import { Cartesian3 } from 'cesium';

export interface Cartesian3JSON {
  x: number;
  y: number;
  z: number;
}

/**
 * Serialize a `Cartesian3` instance to JSON and deserialize from JSON
 */
export class Cartesian3Serialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is Cartesian3 {
    return value instanceof Cartesian3;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Cartesian3): Cartesian3JSON | undefined {
    if (notNullish(instance)) {
      return {
        x: instance.x,
        y: instance.y,
        z: instance.z,
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: Cartesian3JSON, result?: Cartesian3): Cartesian3 | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new Cartesian3(
      json.x,
      json.y,
      json.z,
    );
    return result ? instance.clone(result) : instance;
  }
}
