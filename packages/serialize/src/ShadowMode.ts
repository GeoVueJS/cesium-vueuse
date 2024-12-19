import { notNullish } from '@vueuse/core';

import { ShadowMode } from 'cesium';

export type ShadowModeJSON = 'DISABLED' | 'ENABLED' | 'CAST_ONLY' | 'RECEIVE_ONLY';

/**
 * Serialize a `ShadowMode` instance to JSON and deserialize from JSON
 */
export class ShadowModeSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is ShadowMode {
    return Object.values(ShadowMode).includes(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ShadowMode): ShadowModeJSON | undefined {
    if (notNullish(instance)) {
      const keys = Object.keys(ShadowMode) as ShadowModeJSON[];
      return keys.find(key => ShadowMode[key] === instance);
    }
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: ShadowModeJSON): ShadowMode | undefined {
    if (json) {
      return ShadowMode[json];
    }
  }
}
