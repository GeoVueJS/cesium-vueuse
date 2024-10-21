import { isHasValue } from '@cesium-vueuse/shared';

import { ArcType } from 'cesium';

export type ArcTypeJSON = 'NONE' | 'GEODESIC' | 'RHUMB';

/**
 * Serialize a `ArcType` instance to JSON and deserialize from JSON
 */
export class ArcTypeSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is ArcType {
    return Object.values(ArcType).includes(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ArcType): ArcTypeJSON | undefined {
    if (isHasValue(instance)) {
      const keys = Object.keys(ArcType) as ArcTypeJSON[];
      return keys.find(key => ArcType[key] === instance);
    }
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: ArcTypeJSON): ArcType | undefined {
    if (json) {
      return ArcType[json];
    }
  }
}
