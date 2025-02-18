import type { JulianDate } from 'cesium';
import type { BoundingRectangleJSON } from './BoundingRectangle';
import type { Cartesian2JSON } from './Cartesian2';
import type { Cartesian3JSON } from './Cartesian3';
import type { ColorJSON } from './Color';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { HeightReferenceJSON } from './HeightReference';
import type { HorizontalOriginJSON } from './HorizontalOrigin';
import type { NearFarScalarJSON } from './NearFarScalar';
import type { SplitDirectionJSON } from './SplitDirection';
import type { VerticalOriginJSON } from './VerticalOrigin';
import { toPropertyValue } from '@vesium/shared';
import { notNullish } from '@vueuse/core';
import { BillboardGraphics } from 'cesium';
import { BoundingRectangleSerialize } from './BoundingRectangle';
import { Cartesian2Serialize } from './Cartesian2';
import { Cartesian3Serialize } from './Cartesian3';
import { ColorSerialize } from './Color';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { HeightReferenceSerialize } from './HeightReference';
import { HorizontalOriginSerialize } from './HorizontalOrigin';
import { NearFarScalarSerialize } from './NearFarScalar';

import { SplitDirectionSerialize } from './SplitDirection';
import { VerticalOriginSerialize } from './VerticalOrigin';

export interface BillboardGraphicsJSON {
  show?: boolean;
  image?: string;
  scale?: number;
  pixelOffset?: Cartesian2JSON;
  eyeOffset?: Cartesian3JSON;
  horizontalOrigin?: HorizontalOriginJSON;
  verticalOrigin?: VerticalOriginJSON;
  heightReference?: HeightReferenceJSON;
  color?: ColorJSON;
  rotation?: number;
  alignedAxis?: Cartesian3JSON;
  sizeInMeters?: boolean;
  width?: number;
  height?: number;
  scaleByDistance?: NearFarScalarJSON;
  translucencyByDistance?: NearFarScalarJSON;
  pixelOffsetScaleByDistance?: NearFarScalarJSON;
  imageSubRegion?: BoundingRectangleJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
  disableDepthTestDistance?: number;
  splitDirection?: SplitDirectionJSON;
}

/**
 * Serialize a `BillboardGraphics` instance to JSON and deserialize from JSON
 */
export class BillboardGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is BillboardGraphics {
    return value instanceof BillboardGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: BillboardGraphics, time?: JulianDate): BillboardGraphicsJSON | undefined {
    if (notNullish(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        image: toPropertyValue(instance.image, time),
        scale: toPropertyValue(instance.scale, time),
        pixelOffset: Cartesian2Serialize.toJSON(toPropertyValue(instance.pixelOffset, time)),
        eyeOffset: Cartesian3Serialize.toJSON(toPropertyValue(instance.eyeOffset, time)),
        horizontalOrigin: HorizontalOriginSerialize.toJSON(toPropertyValue(instance.horizontalOrigin, time)),
        verticalOrigin: VerticalOriginSerialize.toJSON(toPropertyValue(instance.verticalOrigin, time)),
        heightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.heightReference, time)),
        color: ColorSerialize.toJSON(toPropertyValue(instance.color, time)),
        rotation: toPropertyValue(instance.rotation, time),
        alignedAxis: Cartesian3Serialize.toJSON(toPropertyValue(instance.alignedAxis, time)),
        sizeInMeters: toPropertyValue(instance.sizeInMeters, time),
        width: toPropertyValue(instance.width, time),
        height: toPropertyValue(instance.height, time),
        scaleByDistance: NearFarScalarSerialize.toJSON(toPropertyValue(instance.scaleByDistance, time)),
        translucencyByDistance: NearFarScalarSerialize.toJSON(toPropertyValue(instance.translucencyByDistance, time)),
        pixelOffsetScaleByDistance: NearFarScalarSerialize.toJSON(toPropertyValue(instance.pixelOffsetScaleByDistance, time)),
        imageSubRegion: BoundingRectangleSerialize.toJSON(toPropertyValue(instance.imageSubRegion, time)),
        distanceDisplayCondition: DistanceDisplayConditionSerialize.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
        disableDepthTestDistance: toPropertyValue(instance.disableDepthTestDistance, time),
        splitDirection: SplitDirectionSerialize.toJSON(toPropertyValue(instance.splitDirection, time)),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: BillboardGraphicsJSON, result?: BillboardGraphics): BillboardGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new BillboardGraphics({
      show: json.show,
      image: json.image,
      scale: json.scale,
      pixelOffset: Cartesian2Serialize.fromJSON(json.pixelOffset),
      eyeOffset: Cartesian3Serialize.fromJSON(json.eyeOffset),
      horizontalOrigin: HorizontalOriginSerialize.fromJSON(json.horizontalOrigin),
      verticalOrigin: VerticalOriginSerialize.fromJSON(json.verticalOrigin),
      heightReference: HeightReferenceSerialize.fromJSON(json.heightReference),
      color: ColorSerialize.fromJSON(json.color),
      rotation: json.rotation,
      alignedAxis: Cartesian3Serialize.fromJSON(json.alignedAxis),
      sizeInMeters: json.sizeInMeters,
      width: json.width,
      height: json.height,
      scaleByDistance: NearFarScalarSerialize.fromJSON(json.scaleByDistance),
      translucencyByDistance: NearFarScalarSerialize.fromJSON(json.translucencyByDistance),
      pixelOffsetScaleByDistance: NearFarScalarSerialize.fromJSON(json.pixelOffsetScaleByDistance),
      imageSubRegion: BoundingRectangleSerialize.fromJSON(json.imageSubRegion),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
      disableDepthTestDistance: json.disableDepthTestDistance,
      splitDirection: SplitDirectionSerialize.fromJSON(json.splitDirection),
    });
    return result ? instance.clone(result) : instance;
  }
}
