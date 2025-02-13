import type { JulianDate } from 'cesium';
import type { ClassificationTypeJSON } from './ClassificationType';
import type { ColorJSON } from './Color';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { HeightReferenceJSON } from './HeightReference';
import type { MaterialPropertyJSON } from './MaterialProperty';
import type { RectangleJSON } from './Rectangle';
import type { ShadowModeJSON } from './ShadowMode';
import { toPropertyValue } from '@cesium-vueuse/shared';
import { notNullish } from '@vueuse/core';

import { RectangleGraphics } from 'cesium';
import { ClassificationTypeSerialize } from './ClassificationType';
import { ColorSerialize } from './Color';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { HeightReferenceSerialize } from './HeightReference';
import { MaterialPropertySerialize } from './MaterialProperty';
import { RectangleSerialize } from './Rectangle';

import { ShadowModeSerialize } from './ShadowMode';

export interface RectangleGraphicsJSON {
  show?: boolean;
  coordinates?: RectangleJSON;
  height?: number;
  heightReference?: HeightReferenceJSON;
  extrudedHeight?: number;
  extrudedHeightReference?: HeightReferenceJSON;
  rotation?: number;
  stRotation?: number;
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
 * Serialize a `RectangleGraphics` instance to JSON and deserialize from JSON
 */
export class RectangleGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is RectangleGraphics {
    return value instanceof RectangleGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: RectangleGraphics, time?: JulianDate): RectangleGraphicsJSON | undefined {
    if (notNullish(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        coordinates: RectangleSerialize.toJSON(toPropertyValue(instance.coordinates, time)),
        height: toPropertyValue(instance.height, time),
        heightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.heightReference, time)),
        extrudedHeight: toPropertyValue(instance.extrudedHeight, time),
        extrudedHeightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.extrudedHeightReference, time)),
        rotation: toPropertyValue(instance.rotation, time),
        stRotation: toPropertyValue(instance.stRotation, time),
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
  static fromJSON(json?: RectangleGraphicsJSON, result?: RectangleGraphics): RectangleGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new RectangleGraphics({
      show: json.show,
      coordinates: RectangleSerialize.fromJSON(json.coordinates),
      height: json.height,
      heightReference: HeightReferenceSerialize.fromJSON(json.heightReference),
      extrudedHeight: json.extrudedHeight,
      extrudedHeightReference: HeightReferenceSerialize.fromJSON(json.extrudedHeightReference),
      rotation: json.rotation,
      stRotation: json.stRotation,
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
