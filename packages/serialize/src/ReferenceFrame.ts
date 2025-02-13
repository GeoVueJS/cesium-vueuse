import { notNullish } from '@vueuse/core';

import { ReferenceFrame } from 'cesium';

export type ReferenceFrameJSON = 'FIXED' | 'INERTIAL';

/**
 * Serialize a `ReferenceFrame` instance to JSON and deserialize from JSON
 */
export class ReferenceFrameSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is ReferenceFrame {
    return Object.values(ReferenceFrame).includes(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ReferenceFrame): ReferenceFrameJSON | undefined {
    if (notNullish(instance)) {
      const keys = Object.keys(ReferenceFrame) as ReferenceFrameJSON[];
      return keys.find(key => ReferenceFrame[key] === instance);
    }
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: ReferenceFrameJSON): ReferenceFrame | undefined {
    if (json) {
      return ReferenceFrame[json];
    }
  }
}
