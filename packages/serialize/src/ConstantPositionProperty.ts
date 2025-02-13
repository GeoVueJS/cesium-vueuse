import type { JulianDate } from 'cesium';
import { notNullish } from '@vueuse/core';
import { ConstantPositionProperty } from 'cesium';
import { Cartesian3Serialize } from './Cartesian3';

export interface ConstantPositionPropertyJSON {
  x: number;
  y: number;
  z: number;
}

/**
 * Serialize a `ConstantPositionProperty` instance to JSON and deserialize from JSON
 */
export class ConstantPositionPropertySerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is ConstantPositionProperty {
    return value instanceof ConstantPositionProperty;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ConstantPositionProperty, time?: JulianDate): ConstantPositionPropertyJSON | undefined {
    if (!notNullish(instance)) {
      return;
    }
    return Cartesian3Serialize.toJSON(instance.getValue(time));
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: ConstantPositionPropertyJSON, result?: ConstantPositionProperty): ConstantPositionProperty | undefined {
    const value = Cartesian3Serialize.fromJSON(json);
    if (!value) {
      return;
    }
    if (ConstantPositionPropertySerialize.predicate(result)) {
      result.setValue(value);
      return result;
    }
    else {
      return new ConstantPositionProperty(value);
    }
  }
}
