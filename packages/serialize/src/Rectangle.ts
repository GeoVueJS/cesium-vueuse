import { notNullish } from '@vueuse/core';

import { Rectangle } from 'cesium';

export interface RectangleJSON {
  west: number;
  south: number;
  east: number;
  north: number;
}

/**
 * Serialize a `Rectangle` instance to JSON and deserialize from JSON
 */
export class RectangleSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is Rectangle {
    return value instanceof Rectangle;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Rectangle): RectangleJSON | undefined {
    if (notNullish(instance)) {
      return {
        west: instance.west,
        south: instance.south,
        east: instance.east,
        north: instance.north,
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: RectangleJSON, result?: Rectangle): Rectangle | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new Rectangle(
      json.west,
      json.south,
      json.east,
      json.north,
    );
    return result ? instance.clone(result) : instance;
  }
}
