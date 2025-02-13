import { notNullish } from '@vueuse/core';

import { Color } from 'cesium';

export interface ColorJSON {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

/**
 * Serialize a `Color` instance to JSON and deserialize from JSON
 */
export class ColorSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is Color {
    return value instanceof Color;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Color): ColorJSON | undefined {
    if (notNullish(instance)) {
      return {
        red: instance.red,
        green: instance.green,
        blue: instance.blue,
        alpha: instance.alpha,
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: ColorJSON, result?: Color): Color | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new Color(
      json.red,
      json.green,
      json.blue,
      json.alpha,
    );
    return result ? instance.clone(result) : instance;
  }
}
