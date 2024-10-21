import { isHasValue } from '@cesium-vueuse/shared';

import { NearFarScalar } from 'cesium';

export interface NearFarScalarJSON {
  near: number;
  nearValue: number;
  far: number;
  farValue: number;
}

/**
 * Serialize a `NearFarScalar` instance to JSON and deserialize from JSON
 */
export class NearFarScalarSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is NearFarScalar {
    return value instanceof NearFarScalar;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: NearFarScalar): NearFarScalarJSON | undefined {
    if (isHasValue(instance)) {
      return {
        near: instance.near,
        nearValue: instance.nearValue,
        far: instance.far,
        farValue: instance.farValue,
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: NearFarScalarJSON, result?: NearFarScalar): NearFarScalar | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new NearFarScalar(
      json.near,
      json.nearValue,
      json.far,
      json.farValue,
    );
    return result ? instance.clone(result) : instance;
  }
}
