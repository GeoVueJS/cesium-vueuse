import { notNullish } from '@vueuse/core';

import { ClassificationType } from 'cesium';

export type ClassificationTypeJSON = 'TERRAIN' | 'CESIUM_3D_TILE' | 'BOTH';

/**
 * Serialize a `ClassificationType` instance to JSON and deserialize from JSON
 */
export class ClassificationTypeSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is ClassificationType {
    return Object.values(ClassificationType).includes(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ClassificationType): ClassificationTypeJSON | undefined {
    if (notNullish(instance)) {
      const keys = Object.keys(ClassificationType) as ClassificationTypeJSON[];
      return keys.find(key => ClassificationType[key] === instance);
    }
  }

  /**
   * Convert a JSON to an instance
   */
  static fromJSON(json?: ClassificationTypeJSON): ClassificationType | undefined {
    if (json) {
      return ClassificationType[json];
    }
  }
}
