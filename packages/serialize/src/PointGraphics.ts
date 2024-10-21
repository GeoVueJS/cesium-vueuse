import type { JulianDate } from 'cesium';
import type { ColorJSON } from './Color';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { HeightReferenceJSON } from './HeightReference';
import type { NearFarScalarJSON } from './NearFarScalar';
import type { SplitDirectionJSON } from './SplitDirection';
import { isHasValue, toPropertyValue } from '@cesium-vueuse/shared';
import { PointGraphics } from 'cesium';
import { ColorSerialize } from './Color';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { HeightReferenceSerialize } from './HeightReference';
import { NearFarScalarSerialize } from './NearFarScalar';

import { SplitDirectionSerialize } from './SplitDirection';

export interface PointGraphicsJSON {
  show?: boolean;
  pixelSize?: number;
  heightReference?: HeightReferenceJSON;
  color?: ColorJSON;
  outlineColor?: ColorJSON;
  outlineWidth?: number;
  scaleByDistance?: NearFarScalarJSON;
  translucencyByDistance?: NearFarScalarJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
  disableDepthTestDistance?: number;
  splitDirection?: SplitDirectionJSON;
}

/**
 * Serialize a `PointGraphics` instance to JSON and deserialize from JSON
 */
export class PointGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is PointGraphics {
    return value instanceof PointGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PointGraphics, time?: JulianDate): PointGraphicsJSON | undefined {
    if (isHasValue(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        pixelSize: toPropertyValue(instance.pixelSize, time),
        heightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.heightReference, time)),
        color: ColorSerialize.toJSON(toPropertyValue(instance.color, time)),
        outlineColor: ColorSerialize.toJSON(toPropertyValue(instance.outlineColor, time)),
        outlineWidth: toPropertyValue(instance.outlineWidth, time),
        scaleByDistance: NearFarScalarSerialize.toJSON(toPropertyValue(instance.scaleByDistance, time)),
        translucencyByDistance: NearFarScalarSerialize.toJSON(toPropertyValue(instance.translucencyByDistance, time)),
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
  static fromJSON(json?: PointGraphicsJSON, result?: PointGraphics): PointGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new PointGraphics({
      show: json.show,
      pixelSize: json.pixelSize,
      heightReference: HeightReferenceSerialize.fromJSON(json.heightReference),
      color: ColorSerialize.fromJSON(json.color),
      outlineColor: ColorSerialize.fromJSON(json.outlineColor),
      outlineWidth: json.outlineWidth,
      scaleByDistance: NearFarScalarSerialize.fromJSON(json.scaleByDistance),
      translucencyByDistance: NearFarScalarSerialize.fromJSON(json.translucencyByDistance),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
      disableDepthTestDistance: json.disableDepthTestDistance,
      splitDirection: SplitDirectionSerialize.fromJSON(json.splitDirection),
    });
    return result ? instance.clone(result) : instance;
  }
}
