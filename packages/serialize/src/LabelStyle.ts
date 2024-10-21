import { isHasValue } from '@cesium-vueuse/shared';

import { LabelStyle } from 'cesium';

export type LabelStyleJSON = 'FILL' | 'OUTLINE' | 'FILL_AND_OUTLINE';

/**
 * Serialize a `LabelStyle` instance to JSON and deserialize from JSON
 */
export class LabelStyleSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is LabelStyle {
    return Object.values(LabelStyle).includes(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: LabelStyle): LabelStyleJSON | undefined {
    if (isHasValue(instance)) {
      const keys = Object.keys(LabelStyle) as LabelStyleJSON[];
      return keys.find(key => LabelStyle[key] === instance);
    }
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: LabelStyleJSON): LabelStyle | undefined {
    if (json) {
      return LabelStyle[json];
    }
  }
}
