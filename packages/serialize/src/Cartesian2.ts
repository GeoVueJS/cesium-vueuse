import { isHasValue } from '@cesium-vueuse/shared';

import { Cartesian2 } from 'cesium';

export interface Cartesian2JSON {
  x: number;
  y: number;
}

/**
 * Serialize a `Cartesian2` instance to JSON and deserialize from JSON
 */
export class Cartesian2Serialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is Cartesian2 {
    return value instanceof Cartesian2;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Cartesian2): Cartesian2JSON | undefined {
    if (isHasValue(instance)) {
      return {
        x: instance.x,
        y: instance.y,
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: Cartesian2JSON, result?: Cartesian2): Cartesian2 | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new Cartesian2(
      json.x,
      json.y,
    );
    return result ? instance.clone(result) : instance;
  }
}
