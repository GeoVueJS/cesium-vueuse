import type { JulianDate } from 'cesium';
import type { Cartesian3JSON } from './Cartesian3';
import type { ColorJSON } from './Color';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { HeightReferenceJSON } from './HeightReference';
import type { MaterialPropertyJSON } from './MaterialProperty';
import type { ShadowModeJSON } from './ShadowMode';

import { toPropertyValue } from '@cesium-vueuse/shared';
import { notNullish } from '@vueuse/core';
import { BoxGraphics } from 'cesium';
import { Cartesian3Serialize } from './Cartesian3';
import { ColorSerialize } from './Color';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { HeightReferenceSerialize } from './HeightReference';
import { MaterialPropertySerialize } from './MaterialProperty';

import { ShadowModeSerialize } from './ShadowMode';

export interface BoxGraphicsJSON {
  show?: boolean;
  dimensions?: Cartesian3JSON;
  heightReference?: HeightReferenceJSON;
  fill?: boolean;
  material?: MaterialPropertyJSON;
  outline?: boolean;
  outlineColor?: ColorJSON;
  outlineWidth?: number;
  shadows?: ShadowModeJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
}

/**
 * Serialize a `BoxGraphics` instance to JSON and deserialize from JSON
 */
export class BoxGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is BoxGraphics {
    return value instanceof BoxGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: BoxGraphics, time?: JulianDate): BoxGraphicsJSON | undefined {
    if (notNullish(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        dimensions: Cartesian3Serialize.toJSON(toPropertyValue(instance.dimensions, time)),
        heightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.heightReference, time)),
        fill: toPropertyValue(instance.fill, time),
        material: MaterialPropertySerialize.toJSON(toPropertyValue(instance.material, time)),
        outline: toPropertyValue(instance.outline, time),
        outlineColor: ColorSerialize.toJSON(toPropertyValue(instance.outlineColor, time)),
        outlineWidth: toPropertyValue(instance.outlineWidth, time),
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
  static fromJSON(json?: BoxGraphicsJSON, result?: BoxGraphics): BoxGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new BoxGraphics({
      show: json.show,
      dimensions: Cartesian3Serialize.fromJSON(json.dimensions),
      heightReference: HeightReferenceSerialize.fromJSON(json.heightReference),
      fill: json.fill,
      material: MaterialPropertySerialize.fromJSON(json.material),
      outline: json.outline,
      outlineColor: ColorSerialize.fromJSON(json.outlineColor),
      outlineWidth: json.outlineWidth,
      shadows: ShadowModeSerialize.fromJSON(json.shadows),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
    });
    return result ? instance.clone(result) : instance;
  }
}
