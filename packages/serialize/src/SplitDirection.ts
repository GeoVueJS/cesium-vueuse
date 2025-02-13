import { notNullish } from '@vueuse/core';

import { SplitDirection } from 'cesium';

export type SplitDirectionJSON = 'LEFT' | 'NONE' | 'RIGHT';

/**
 * Serialize a `SplitDirection` instance to JSON and deserialize from JSON
 */
export class SplitDirectionSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is SplitDirection {
    return Object.values(SplitDirection).includes(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: SplitDirection): SplitDirectionJSON | undefined {
    if (notNullish(instance)) {
      const keys = Object.keys(SplitDirection) as SplitDirectionJSON[];
      return keys.find(key => SplitDirection[key] === instance);
    }
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: SplitDirectionJSON): SplitDirection | undefined {
    if (json) {
      return SplitDirection[json];
    }
  }
}
