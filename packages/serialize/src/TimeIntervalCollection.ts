import type { TimeIntervalJSON } from './TimeInterval';

import { isHasValue } from '@cesium-vueuse/shared';
import { TimeIntervalCollection } from 'cesium';
import { TimeIntervalSerialize } from './TimeInterval';

export interface TimeIntervalCollectionJSON {
  intervals: TimeIntervalJSON[];
}

/**
 * Serialize a `TimeIntervalCollection` instance to JSON and deserialize from JSON
 */
export class TimeIntervalCollectionSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is TimeIntervalCollection {
    return value instanceof TimeIntervalCollection;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: TimeIntervalCollection): TimeIntervalCollectionJSON | undefined {
    if (isHasValue(instance)) {
      const intervals = Array.of({ length: instance.length }).map((_, i) => instance.get(i));
      return {
        intervals: intervals.map(item => TimeIntervalSerialize.toJSON(item)!),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: TimeIntervalCollectionJSON, result?: TimeIntervalCollection): TimeIntervalCollection | undefined {
    if (!json) {
      return undefined;
    }
    const intervals = json.intervals.map(item => TimeIntervalSerialize.fromJSON(item)!);
    if (result) {
      result.removeAll();
      intervals.forEach(item => result.addInterval(item));
    }
    return new TimeIntervalCollection(intervals);
  }
}
