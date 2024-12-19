import type { ConstantPositionProperty, JulianDate, PositionProperty, SampledPositionProperty } from 'cesium';

import { notNullish } from '@vueuse/core';
import { ConstantPositionPropertySerialize } from './ConstantPositionProperty';
import { SampledPositionPropertySerialize } from './SampledPositionProperty';

export interface PositionPropertyJSON {
  type: 'ConstantPositionProperty' | 'SampledPositionProperty' ;
  content: any;
}

/**
 * Serialize a `PositionProperty` instance to JSON and deserialize from JSON
 */
export class PositionPropertySerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is PositionProperty {
    return SampledPositionPropertySerialize.predicate(value)
      || ConstantPositionPropertySerialize.predicate(value);
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PositionProperty, time?: JulianDate): PositionPropertyJSON | undefined {
    if (!notNullish(instance)) {
      return;
    }
    if (ConstantPositionPropertySerialize.predicate(instance)) {
      return {
        type: 'ConstantPositionProperty',
        content: ConstantPositionPropertySerialize.toJSON(instance, time),
      };
    }

    if (SampledPositionPropertySerialize.predicate(instance)) {
      return {
        type: 'SampledPositionProperty',
        content: SampledPositionPropertySerialize.toJSON(instance),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PositionPropertyJSON, result?: PositionProperty): PositionProperty | undefined {
    if (!json) {
      return;
    }
    if (json.type === 'ConstantPositionProperty') {
      return ConstantPositionPropertySerialize.fromJSON(json.content, result as ConstantPositionProperty);
    }
    if (json.type === 'SampledPositionProperty') {
      return SampledPositionPropertySerialize.fromJSON(json.content, result as SampledPositionProperty);
    }
  }
}
