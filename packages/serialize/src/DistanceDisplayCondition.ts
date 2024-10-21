import { isHasValue } from '@cesium-vueuse/shared';

import { DistanceDisplayCondition } from 'cesium';

export interface DistanceDisplayConditionJSON {
  near: number;
  far: number;
}

/**
 * Serialize a `DistanceDisplayCondition` instance to JSON and deserialize from JSON
 */
export class DistanceDisplayConditionSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is DistanceDisplayCondition {
    return value instanceof DistanceDisplayCondition;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: DistanceDisplayCondition): DistanceDisplayConditionJSON | undefined {
    if (isHasValue(instance)) {
      return {
        near: instance.near,
        far: instance.far,
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: DistanceDisplayConditionJSON, result?: DistanceDisplayCondition): DistanceDisplayCondition | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new DistanceDisplayCondition(
      json.near,
      json.far,
    );
    return result ? instance.clone(result) : instance;
  }
}
