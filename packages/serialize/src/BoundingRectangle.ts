import { notNullish } from '@vueuse/core';
import { BoundingRectangle } from 'cesium';

export interface BoundingRectangleJSON {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Serialize a `BoundingRectangle` instance to JSON and deserialize from JSON
 */
export class BoundingRectangleSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is BoundingRectangle {
    return value instanceof BoundingRectangle;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: BoundingRectangle): BoundingRectangleJSON | undefined {
    if (notNullish(instance)) {
      return {
        x: instance.x,
        y: instance.y,
        width: instance.width,
        height: instance.height,
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: BoundingRectangleJSON, result?: BoundingRectangle): BoundingRectangle | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new BoundingRectangle(
      json.x,
      json.y,
      json.width,
      json.height,
    );
    return result ? instance.clone(result) : instance;
  }
}
