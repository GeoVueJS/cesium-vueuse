import { notNullish } from '@vueuse/core';

import { HeightReference } from 'cesium';

export type HeightReferenceJSON = 'NONE' | 'CLAMP_TO_GROUND' | 'RELATIVE_TO_GROUND' | 'CLAMP_TO_TERRAIN' | 'RELATIVE_TO_TERRAIN' | 'CLAMP_TO_3D_TILE' | 'RELATIVE_TO_3D_TILE';

/**
 * Serialize a `HeightReference` instance to JSON and deserialize from JSON
 */
export class HeightReferenceSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is HeightReference {
    return Object.values(HeightReference).includes(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: HeightReference): HeightReferenceJSON | undefined {
    if (notNullish(instance)) {
      const keys = Object.keys(HeightReference) as HeightReferenceJSON[];
      return keys.find(key => HeightReference[key] === instance);
    }
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: HeightReferenceJSON): HeightReference | undefined {
    if (json) {
      return HeightReference[json];
    }
  }
}
