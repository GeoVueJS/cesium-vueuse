import { isHasValue } from '@cesium-vueuse/shared';

import { HorizontalOrigin } from 'cesium';

export type HorizontalOriginJSON = 'CENTER' | 'LEFT' | 'RIGHT';

/**
 * Serialize a `HorizontalOrigin` instance to JSON and deserialize from JSON
 */
export class HorizontalOriginSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is HorizontalOrigin {
    return Object.values(HorizontalOrigin).includes(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: HorizontalOrigin): HorizontalOriginJSON | undefined {
    if (isHasValue(instance)) {
      const keys = Object.keys(HorizontalOrigin) as HorizontalOriginJSON[];
      return keys.find(key => HorizontalOrigin[key] === instance);
    }
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: HorizontalOriginJSON): HorizontalOrigin | undefined {
    if (json) {
      return HorizontalOrigin[json];
    }
  }
}
