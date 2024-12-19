import { notNullish } from '@vueuse/core';

import { JulianDate } from 'cesium';

export type JulianDateJSON = string;

/**
 * Serialize a `JulianDate` instance to JSON and deserialize from JSON
 */
export class JulianDateSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is JulianDate {
    return value instanceof JulianDate;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: JulianDate): JulianDateJSON | undefined {
    if (notNullish(instance)) {
      return instance.toString();
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: JulianDateJSON, result?: JulianDate): JulianDate | undefined {
    if (!json) {
      return undefined;
    }
    const instance = JulianDate.fromIso8601(json);
    return result ? instance.clone(result) : instance;
  }
}
