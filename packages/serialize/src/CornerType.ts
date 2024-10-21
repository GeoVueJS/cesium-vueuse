import { isHasValue } from '@cesium-vueuse/shared';

import { CornerType } from 'cesium';

export type CornerTypeJSON = 'ROUNDED' | 'MITERED' | 'BEVELED';

/**
 * Serialize a `CornerType` instance to JSON and deserialize from JSON
 */
export class CornerTypeSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is CornerType {
    return Object.values(CornerType).includes(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: CornerType): CornerTypeJSON | undefined {
    if (isHasValue(instance)) {
      const keys = Object.keys(CornerType) as CornerTypeJSON[];
      return keys.find(key => CornerType[key] === instance);
    }
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: CornerTypeJSON): CornerType | undefined {
    if (json) {
      return CornerType[json];
    }
  }
}
