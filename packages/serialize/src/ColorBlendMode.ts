import { notNullish } from '@vueuse/core';

import { ColorBlendMode } from 'cesium';

export type ColorBlendModeJSON = 'HIGHLIGHT' | 'REPLACE' | 'MIX';

/**
 * Serialize a `ColorBlendMode` instance to JSON and deserialize from JSON
 */
export class ColorBlendModeSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is ColorBlendMode {
    return Object.values(ColorBlendMode).includes(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ColorBlendMode): ColorBlendModeJSON | undefined {
    if (notNullish(instance)) {
      const keys = Object.keys(ColorBlendMode) as ColorBlendModeJSON[];
      return keys.find(key => ColorBlendMode[key] === instance);
    }
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: ColorBlendModeJSON): ColorBlendMode | undefined {
    if (json) {
      return ColorBlendMode[json];
    }
  }
}
