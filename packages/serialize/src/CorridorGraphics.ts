import type { JulianDate } from 'cesium';
import type { Cartesian3JSON } from './Cartesian3';
import type { ClassificationTypeJSON } from './ClassificationType';
import type { ColorJSON } from './Color';
import type { CornerTypeJSON } from './CornerType';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { HeightReferenceJSON } from './HeightReference';
import type { MaterialPropertyJSON } from './MaterialProperty';
import type { ShadowModeJSON } from './ShadowMode';
import { toPropertyValue } from '@cesium-vueuse/shared';
import { notNullish } from '@vueuse/core';
import { CorridorGraphics } from 'cesium';
import { Cartesian3Serialize } from './Cartesian3';
import { ClassificationTypeSerialize } from './ClassificationType';
import { ColorSerialize } from './Color';
import { CornerTypeSerialize } from './CornerType';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { HeightReferenceSerialize } from './HeightReference';
import { MaterialPropertySerialize } from './MaterialProperty';

import { ShadowModeSerialize } from './ShadowMode';

export interface CorridorGraphicsJSON {
  show?: boolean;
  positions?: Cartesian3JSON[];
  width?: number;
  height?: number;
  heightReference?: HeightReferenceJSON;
  extrudedHeight?: number;
  extrudedHeightReference?: HeightReferenceJSON;
  cornerType?: CornerTypeJSON;
  granularity?: number;
  fill?: boolean;
  material?: MaterialPropertyJSON;
  outline?: boolean;
  outlineColor?: ColorJSON;
  outlineWidth?: number;
  shadows?: ShadowModeJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
  classificationType?: ClassificationTypeJSON;
  zIndex?: number;
}

/**
 * Serialize a `CorridorGraphics` instance to JSON and deserialize from JSON
 */
export class CorridorGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is CorridorGraphics {
    return value instanceof CorridorGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: CorridorGraphics, time?: JulianDate): CorridorGraphicsJSON | undefined {
    if (notNullish(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        positions: toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3Serialize.toJSON(item)),
        width: toPropertyValue(instance.width, time),
        height: toPropertyValue(instance.height, time),
        heightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.heightReference, time)),
        extrudedHeight: toPropertyValue(instance.extrudedHeight, time),
        extrudedHeightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.extrudedHeightReference, time)),
        cornerType: CornerTypeSerialize.toJSON(toPropertyValue(instance.cornerType, time)),
        granularity: toPropertyValue(instance.granularity, time),
        fill: toPropertyValue(instance.fill, time),
        material: MaterialPropertySerialize.toJSON(toPropertyValue(instance.material, time)),
        outline: toPropertyValue(instance.outline, time),
        outlineColor: ColorSerialize.toJSON(toPropertyValue(instance.outlineColor, time)),
        outlineWidth: toPropertyValue(instance.outlineWidth, time),
        shadows: ShadowModeSerialize.toJSON(toPropertyValue(instance.shadows, time)),
        distanceDisplayCondition: DistanceDisplayConditionSerialize.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
        classificationType: ClassificationTypeSerialize.toJSON(toPropertyValue(instance.classificationType, time)),
        zIndex: toPropertyValue(instance.zIndex, time),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: CorridorGraphicsJSON, result?: CorridorGraphics): CorridorGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new CorridorGraphics({
      show: json.show,
      positions: json.positions?.map(item => Cartesian3Serialize.fromJSON(item)!),
      width: json.width,
      height: json.height,
      heightReference: HeightReferenceSerialize.fromJSON(json.heightReference),
      extrudedHeight: json.extrudedHeight,
      extrudedHeightReference: HeightReferenceSerialize.fromJSON(json.extrudedHeightReference),
      cornerType: CornerTypeSerialize.fromJSON(json.cornerType),
      granularity: json.granularity,
      fill: json.fill,
      material: MaterialPropertySerialize.fromJSON(json.material),
      outline: json.outline,
      outlineColor: ColorSerialize.fromJSON(json.outlineColor),
      outlineWidth: json.outlineWidth,
      shadows: ShadowModeSerialize.fromJSON(json.shadows),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
      classificationType: ClassificationTypeSerialize.fromJSON(json.classificationType),
      zIndex: json.zIndex,
    });
    return result ? instance.clone(result) : instance;
  }
}
