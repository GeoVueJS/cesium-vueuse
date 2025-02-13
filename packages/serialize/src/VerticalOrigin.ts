import { notNullish } from '@vueuse/core';

import { VerticalOrigin } from 'cesium';

export type VerticalOriginJSON = 'CENTER' | 'BOTTOM' | 'BASELINE' | 'TOP';

/**
 * Serialize a `VerticalOrigin` instance to JSON and deserialize from JSON
 */
export class VerticalOriginSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is VerticalOrigin {
    return Object.values(VerticalOrigin).includes(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: VerticalOrigin): VerticalOriginJSON | undefined {
    if (notNullish(instance)) {
      const keys = Object.keys(VerticalOrigin) as VerticalOriginJSON[];
      return keys.find(key => VerticalOrigin[key] === instance);
    }
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: VerticalOriginJSON): VerticalOrigin | undefined {
    if (json) {
      return VerticalOrigin[json];
    }
  }
}
