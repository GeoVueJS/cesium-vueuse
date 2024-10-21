import type { JulianDate } from 'cesium';
import type { ColorJSON } from './Color';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { HeightReferenceJSON } from './HeightReference';
import type { MaterialPropertyJSON } from './MaterialProperty';
import type { ShadowModeJSON } from './ShadowMode';
import { isHasValue, toPropertyValue } from '@cesium-vueuse/shared';

import { CylinderGraphics } from 'cesium';
import { ColorSerialize } from './Color';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { HeightReferenceSerialize } from './HeightReference';
import { MaterialPropertySerialize } from './MaterialProperty';

import { ShadowModeSerialize } from './ShadowMode';

export interface CylinderGraphicsJSON {
  show?: boolean;
  length?: number;
  topRadius?: number;
  bottomRadius?: number;
  heightReference?: HeightReferenceJSON;
  fill?: boolean;
  material?: MaterialPropertyJSON;
  outline?: boolean;
  outlineColor?: ColorJSON;
  outlineWidth?: number;
  numberOfVerticalLines?: number;
  slices?: number;
  shadows?: ShadowModeJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
}

/**
 * Serialize a `CylinderGraphics` instance to JSON and deserialize from JSON
 */
export class CylinderGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is CylinderGraphics {
    return value instanceof CylinderGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: CylinderGraphics, time?: JulianDate): CylinderGraphicsJSON | undefined {
    if (isHasValue(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        length: toPropertyValue(instance.length, time),
        topRadius: toPropertyValue(instance.topRadius, time),
        bottomRadius: toPropertyValue(instance.bottomRadius, time),
        heightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.heightReference, time)),
        fill: toPropertyValue(instance.fill, time),
        material: MaterialPropertySerialize.toJSON(toPropertyValue(instance.material, time)),
        outline: toPropertyValue(instance.outline, time),
        outlineColor: ColorSerialize.toJSON(toPropertyValue(instance.outlineColor, time)),
        outlineWidth: toPropertyValue(instance.outlineWidth, time),
        numberOfVerticalLines: toPropertyValue(instance.numberOfVerticalLines, time),
        slices: toPropertyValue(instance.slices, time),
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
  static fromJSON(json?: CylinderGraphicsJSON, result?: CylinderGraphics): CylinderGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new CylinderGraphics({
      show: json.show,
      length: json.length,
      topRadius: json.topRadius,
      bottomRadius: json.bottomRadius,
      heightReference: HeightReferenceSerialize.fromJSON(json.heightReference),
      fill: json.fill,
      material: MaterialPropertySerialize.fromJSON(json.material),
      outline: json.outline,
      outlineColor: ColorSerialize.fromJSON(json.outlineColor),
      outlineWidth: json.outlineWidth,
      numberOfVerticalLines: json.numberOfVerticalLines,
      slices: json.slices,
      shadows: ShadowModeSerialize.fromJSON(json.shadows),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
    });
    return result ? instance.clone(result) : instance;
  }
}
