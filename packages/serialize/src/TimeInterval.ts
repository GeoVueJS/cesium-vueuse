import type { JulianDateJSON } from './JulianDate';

import { isHasValue } from '@cesium-vueuse/shared';
import { TimeInterval } from 'cesium';
import { JulianDateSerialize } from './JulianDate';

export interface TimeIntervalJSON {
  start?: JulianDateJSON;
  stop?: JulianDateJSON;
  isStartIncluded?: boolean;
  isStopIncluded?: boolean;
  data?: any;
}

/**
 * Serialize a `TimeInterval` instance to JSON and deserialize from JSON
 */
export class TimeIntervalSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is TimeInterval {
    return value instanceof TimeInterval;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: TimeInterval): TimeIntervalJSON | undefined {
    if (isHasValue(instance)) {
      return {
        start: JulianDateSerialize.toJSON(instance.start),
        stop: JulianDateSerialize.toJSON(instance.stop),
        isStartIncluded: instance.isStartIncluded,
        isStopIncluded: instance.isStopIncluded,
        data: instance.data,
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: TimeIntervalJSON, result?: TimeInterval): TimeInterval | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new TimeInterval({
      start: JulianDateSerialize.fromJSON(json.start),
      stop: JulianDateSerialize.fromJSON(json.stop),
      isStartIncluded: json.isStartIncluded,
      isStopIncluded: json.isStopIncluded,
      data: json.data,
    });
    return result ? instance.clone(result) : instance;
  }
}
