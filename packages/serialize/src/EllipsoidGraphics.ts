import type { JulianDate } from 'cesium';
import type { Cartesian3JSON } from './Cartesian3';
import type { ColorJSON } from './Color';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { HeightReferenceJSON } from './HeightReference';
import type { MaterialPropertyJSON } from './MaterialProperty';
import type { ShadowModeJSON } from './ShadowMode';
import { toPropertyValue } from '@vesium/shared';
import { notNullish } from '@vueuse/core';
import { EllipsoidGraphics } from 'cesium';
import { Cartesian3Serialize } from './Cartesian3';
import { ColorSerialize } from './Color';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { HeightReferenceSerialize } from './HeightReference';
import { MaterialPropertySerialize } from './MaterialProperty';

import { ShadowModeSerialize } from './ShadowMode';

export interface EllipsoidGraphicsJSON {
  show?: boolean;
  radii?: Cartesian3JSON;
  innerRadii?: Cartesian3JSON;
  minimumClock?: number;
  maximumClock?: number;
  minimumCone?: number;
  maximumCone?: number;
  heightReference?: HeightReferenceJSON;
  fill?: boolean;
  material?: MaterialPropertyJSON;
  outline?: boolean;
  outlineColor?: ColorJSON;
  outlineWidth?: number;
  stackPartitions?: number;
  slicePartitions?: number;
  subdivisions?: number;
  shadows?: ShadowModeJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
}

/**
 * Serialize a `EllipsoidGraphics` instance to JSON and deserialize from JSON
 */
export class EllipsoidGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is EllipsoidGraphics {
    return value instanceof EllipsoidGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: EllipsoidGraphics, time?: JulianDate): EllipsoidGraphicsJSON | undefined {
    if (notNullish(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        radii: Cartesian3Serialize.toJSON(toPropertyValue(instance.radii, time)),
        innerRadii: Cartesian3Serialize.toJSON(toPropertyValue(instance.innerRadii, time)),
        minimumClock: toPropertyValue(instance.minimumClock, time),
        maximumClock: toPropertyValue(instance.maximumClock, time),
        minimumCone: toPropertyValue(instance.minimumCone, time),
        maximumCone: toPropertyValue(instance.maximumCone, time),
        heightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.heightReference, time)),
        fill: toPropertyValue(instance.fill, time),
        material: MaterialPropertySerialize.toJSON(toPropertyValue(instance.material, time)),
        outline: toPropertyValue(instance.outline, time),
        outlineColor: ColorSerialize.toJSON(toPropertyValue(instance.outlineColor, time)),
        outlineWidth: toPropertyValue(instance.outlineWidth, time),
        stackPartitions: toPropertyValue(instance.stackPartitions, time),
        slicePartitions: toPropertyValue(instance.slicePartitions, time),
        subdivisions: toPropertyValue(instance.subdivisions, time),
        shadows: ShadowModeSerialize.toJSON(toPropertyValue(instance.shadows, time)),
        distanceDisplayCondition: DistanceDisplayConditionSerialize.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: EllipsoidGraphicsJSON, result?: EllipsoidGraphics): EllipsoidGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new EllipsoidGraphics({
      show: json.show,
      radii: Cartesian3Serialize.fromJSON(json.radii),
      innerRadii: Cartesian3Serialize.fromJSON(json.innerRadii),
      minimumClock: json.minimumClock,
      maximumClock: json.maximumClock,
      minimumCone: json.minimumCone,
      maximumCone: json.maximumCone,
      heightReference: HeightReferenceSerialize.fromJSON(json.heightReference),
      fill: json.fill,
      material: MaterialPropertySerialize.fromJSON(json.material),
      outline: json.outline,
      outlineColor: ColorSerialize.fromJSON(json.outlineColor),
      outlineWidth: json.outlineWidth,
      stackPartitions: json.stackPartitions,
      slicePartitions: json.slicePartitions,
      subdivisions: json.subdivisions,
      shadows: ShadowModeSerialize.fromJSON(json.shadows),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
    });
    return result ? instance.clone(result) : instance;
  }
}
