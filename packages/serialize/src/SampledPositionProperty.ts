import type { Cartesian3, JulianDate } from 'cesium';
import type { Cartesian3JSON } from './Cartesian3';
import type { JulianDateJSON } from './JulianDate';
import type { ReferenceFrameJSON } from './ReferenceFrame';

import { notNullish } from '@vueuse/core';
import { SampledPositionProperty } from 'cesium';
import { Cartesian3Serialize } from './Cartesian3';
import { JulianDateSerialize } from './JulianDate';
import { ReferenceFrameSerialize } from './ReferenceFrame';

export interface SampledPositionPropertyJSON {
  referenceFrame?: ReferenceFrameJSON;
  numberOfDerivatives?: number;
  times?: JulianDateJSON[];
  values?: Cartesian3JSON[];
}

/**
 * Serialize a `SampledPositionProperty` instance to JSON and deserialize from JSON
 */
export class SampledPositionPropertySerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is SampledPositionProperty {
    return value instanceof SampledPositionProperty;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: SampledPositionProperty): SampledPositionPropertyJSON | undefined {
    if (notNullish(instance)) {
      // SampledProperty
      const property = (instance as any)._property;
      const times: JulianDate[] = property._times;
      const values: Cartesian3[] = property._values;

      return {
        referenceFrame: ReferenceFrameSerialize.toJSON(instance.referenceFrame),
        numberOfDerivatives: instance.numberOfDerivatives,
        times: times.map(item => JulianDateSerialize.toJSON(item)!),
        values: values.map(item => Cartesian3Serialize.toJSON(item)!),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: SampledPositionPropertyJSON, result?: SampledPositionProperty): SampledPositionProperty | undefined {
    if (!json) {
      return undefined;
    }

    const instance = new SampledPositionProperty(
      ReferenceFrameSerialize.fromJSON(json.referenceFrame),
      json.numberOfDerivatives,
    );
    if (!(result instanceof SampledPositionProperty)) {
      result = instance;
    }

    result.referenceFrame = instance.referenceFrame;
    result.numberOfDerivatives = instance.numberOfDerivatives;

    const times = json.times?.map(item => JulianDateSerialize.fromJSON(item)!);
    const values = json.values?.map(item => Cartesian3Serialize.fromJSON(item)!);
    times?.forEach(item => result.removeSample(item));

    if (times?.length && values?.length) {
      result.addSamples(times, values);
    }

    return result;
  }
}
