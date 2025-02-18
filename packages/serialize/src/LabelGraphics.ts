import type { JulianDate } from 'cesium';
import type { Cartesian2JSON } from './Cartesian2';
import type { Cartesian3JSON } from './Cartesian3';
import type { ColorJSON } from './Color';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { HeightReferenceJSON } from './HeightReference';
import type { HorizontalOriginJSON } from './HorizontalOrigin';
import type { LabelStyleJSON } from './LabelStyle';
import type { NearFarScalarJSON } from './NearFarScalar';
import type { VerticalOriginJSON } from './VerticalOrigin';
import { toPropertyValue } from '@vesium/shared';
import { notNullish } from '@vueuse/core';
import { LabelGraphics } from 'cesium';
import { Cartesian2Serialize } from './Cartesian2';
import { Cartesian3Serialize } from './Cartesian3';
import { ColorSerialize } from './Color';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { HeightReferenceSerialize } from './HeightReference';
import { HorizontalOriginSerialize } from './HorizontalOrigin';
import { LabelStyleSerialize } from './LabelStyle';
import { NearFarScalarSerialize } from './NearFarScalar';

import { VerticalOriginSerialize } from './VerticalOrigin';

export interface LabelGraphicsJSON {
  show?: boolean;
  text?: string;
  font?: string;
  style?: LabelStyleJSON;
  scale?: number;
  showBackground?: boolean;
  backgroundColor?: ColorJSON;
  backgroundPadding?: Cartesian2JSON;
  pixelOffset?: Cartesian2JSON;
  eyeOffset?: Cartesian3JSON;
  horizontalOrigin?: HorizontalOriginJSON;
  verticalOrigin?: VerticalOriginJSON;
  heightReference?: HeightReferenceJSON;
  fillColor?: ColorJSON;
  outlineColor?: ColorJSON;
  outlineWidth?: number;
  translucencyByDistance?: NearFarScalarJSON;
  pixelOffsetScaleByDistance?: NearFarScalarJSON;
  scaleByDistance?: NearFarScalarJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
  disableDepthTestDistance?: number;
}

/**
 * Serialize a `LabelGraphics` instance to JSON and deserialize from JSON
 */
export class LabelGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is LabelGraphics {
    return value instanceof LabelGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: LabelGraphics, time?: JulianDate): LabelGraphicsJSON | undefined {
    if (notNullish(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        text: toPropertyValue(instance.text, time),
        font: toPropertyValue(instance.font, time),
        style: LabelStyleSerialize.toJSON(toPropertyValue(instance.style, time)),
        scale: toPropertyValue(instance.scale, time),
        showBackground: toPropertyValue(instance.showBackground, time),
        backgroundColor: ColorSerialize.toJSON(toPropertyValue(instance.backgroundColor, time)),
        backgroundPadding: Cartesian2Serialize.toJSON(toPropertyValue(instance.backgroundPadding, time)),
        pixelOffset: Cartesian2Serialize.toJSON(toPropertyValue(instance.pixelOffset, time)),
        eyeOffset: Cartesian3Serialize.toJSON(toPropertyValue(instance.eyeOffset, time)),
        horizontalOrigin: HorizontalOriginSerialize.toJSON(toPropertyValue(instance.horizontalOrigin, time)),
        verticalOrigin: VerticalOriginSerialize.toJSON(toPropertyValue(instance.verticalOrigin, time)),
        heightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.heightReference, time)),
        fillColor: ColorSerialize.toJSON(toPropertyValue(instance.fillColor, time)),
        outlineColor: ColorSerialize.toJSON(toPropertyValue(instance.outlineColor, time)),
        outlineWidth: toPropertyValue(instance.outlineWidth, time),
        translucencyByDistance: NearFarScalarSerialize.toJSON(toPropertyValue(instance.translucencyByDistance, time)),
        pixelOffsetScaleByDistance: NearFarScalarSerialize.toJSON(toPropertyValue(instance.pixelOffsetScaleByDistance, time)),
        scaleByDistance: NearFarScalarSerialize.toJSON(toPropertyValue(instance.scaleByDistance, time)),
        distanceDisplayCondition: DistanceDisplayConditionSerialize.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
        disableDepthTestDistance: toPropertyValue(instance.disableDepthTestDistance, time),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: LabelGraphicsJSON, result?: LabelGraphics): LabelGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new LabelGraphics({
      show: json.show,
      text: json.text,
      font: json.font,
      style: LabelStyleSerialize.fromJSON(json.style),
      scale: json.scale,
      showBackground: json.showBackground,
      backgroundColor: ColorSerialize.fromJSON(json.backgroundColor),
      backgroundPadding: Cartesian2Serialize.fromJSON(json.backgroundPadding),
      pixelOffset: Cartesian2Serialize.fromJSON(json.pixelOffset),
      eyeOffset: Cartesian3Serialize.fromJSON(json.eyeOffset),
      horizontalOrigin: HorizontalOriginSerialize.fromJSON(json.horizontalOrigin),
      verticalOrigin: VerticalOriginSerialize.fromJSON(json.verticalOrigin),
      heightReference: HeightReferenceSerialize.fromJSON(json.heightReference),
      fillColor: ColorSerialize.fromJSON(json.fillColor),
      outlineColor: ColorSerialize.fromJSON(json.outlineColor),
      outlineWidth: json.outlineWidth,
      translucencyByDistance: NearFarScalarSerialize.fromJSON(json.translucencyByDistance),
      pixelOffsetScaleByDistance: NearFarScalarSerialize.fromJSON(json.pixelOffsetScaleByDistance),
      scaleByDistance: NearFarScalarSerialize.fromJSON(json.scaleByDistance),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
      disableDepthTestDistance: json.disableDepthTestDistance,
    });
    return result ? instance.clone(result) : instance;
  }
}
