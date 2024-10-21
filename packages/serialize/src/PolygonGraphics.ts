import type { JulianDate } from 'cesium';
import type { ArcTypeJSON } from './ArcType';
import type { ClassificationTypeJSON } from './ClassificationType';
import type { ColorJSON } from './Color';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { HeightReferenceJSON } from './HeightReference';
import type { MaterialPropertyJSON } from './MaterialProperty';
import type { PolygonHierarchyJSON } from './PolygonHierarchy';
import type { ShadowModeJSON } from './ShadowMode';
import { isHasValue, toPropertyValue } from '@cesium-vueuse/shared';
import { PolygonGraphics } from 'cesium';
import { ArcTypeSerialize } from './ArcType';
import { ClassificationTypeSerialize } from './ClassificationType';
import { ColorSerialize } from './Color';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { HeightReferenceSerialize } from './HeightReference';
import { MaterialPropertySerialize } from './MaterialProperty';
import { PolygonHierarchySerialize } from './PolygonHierarchy';

import { ShadowModeSerialize } from './ShadowMode';

export interface PolygonGraphicsJSON {
  show?: boolean;
  hierarchy?: PolygonHierarchyJSON;
  height?: number;
  heightReference?: HeightReferenceJSON;
  extrudedHeight?: number;
  extrudedHeightReference?: HeightReferenceJSON;
  stRotation?: number;
  granularity?: number;
  fill?: boolean;
  material?: MaterialPropertyJSON;
  outline?: boolean;
  outlineColor?: ColorJSON;
  outlineWidth?: number;
  perPositionHeight?: boolean;
  closeTop?: boolean | boolean;
  closeBottom?: boolean | boolean;
  arcType?: ArcTypeJSON;
  shadows?: ShadowModeJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
  classificationType?: ClassificationTypeJSON;
  zIndex?: number;
  textureCoordinates?: PolygonHierarchyJSON;
}

/**
 * Serialize a `PolygonGraphics` instance to JSON and deserialize from JSON
 */
export class PolygonGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is PolygonGraphics {
    return value instanceof PolygonGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PolygonGraphics, time?: JulianDate): PolygonGraphicsJSON | undefined {
    if (isHasValue(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        hierarchy: PolygonHierarchySerialize.toJSON(toPropertyValue(instance.hierarchy, time)),
        height: toPropertyValue(instance.height, time),
        heightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.heightReference, time)),
        extrudedHeight: toPropertyValue(instance.extrudedHeight, time),
        extrudedHeightReference: HeightReferenceSerialize.toJSON(toPropertyValue(instance.extrudedHeightReference, time)),
        stRotation: toPropertyValue(instance.stRotation, time),
        granularity: toPropertyValue(instance.granularity, time),
        fill: toPropertyValue(instance.fill, time),
        material: MaterialPropertySerialize.toJSON(toPropertyValue(instance.material, time)),
        outline: toPropertyValue(instance.outline, time),
        outlineColor: ColorSerialize.toJSON(toPropertyValue(instance.outlineColor, time)),
        outlineWidth: toPropertyValue(instance.outlineWidth, time),
        perPositionHeight: toPropertyValue(instance.perPositionHeight, time),
        closeTop: toPropertyValue(instance.closeTop, time),
        closeBottom: toPropertyValue(instance.closeBottom, time),
        arcType: ArcTypeSerialize.toJSON(toPropertyValue(instance.arcType, time)),
        shadows: ShadowModeSerialize.toJSON(toPropertyValue(instance.shadows, time)),
        distanceDisplayCondition: DistanceDisplayConditionSerialize.toJSON(toPropertyValue(instance.distanceDisplayCondition, time)),
        classificationType: ClassificationTypeSerialize.toJSON(toPropertyValue(instance.classificationType, time)),
        zIndex: toPropertyValue(instance.zIndex, time),
        textureCoordinates: PolygonHierarchySerialize.toJSON(toPropertyValue(instance.textureCoordinates, time)),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PolygonGraphicsJSON, result?: PolygonGraphics): PolygonGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new PolygonGraphics({
      show: json.show,
      hierarchy: PolygonHierarchySerialize.fromJSON(json.hierarchy),
      height: json.height,
      heightReference: HeightReferenceSerialize.fromJSON(json.heightReference),
      extrudedHeight: json.extrudedHeight,
      extrudedHeightReference: HeightReferenceSerialize.fromJSON(json.extrudedHeightReference),
      stRotation: json.stRotation,
      granularity: json.granularity,
      fill: json.fill,
      material: MaterialPropertySerialize.fromJSON(json.material),
      outline: json.outline,
      outlineColor: ColorSerialize.fromJSON(json.outlineColor),
      outlineWidth: json.outlineWidth,
      perPositionHeight: json.perPositionHeight,
      closeTop: json.closeTop,
      closeBottom: json.closeBottom,
      arcType: ArcTypeSerialize.fromJSON(json.arcType),
      shadows: ShadowModeSerialize.fromJSON(json.shadows),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
      classificationType: ClassificationTypeSerialize.fromJSON(json.classificationType),
      zIndex: json.zIndex,
      textureCoordinates: PolygonHierarchySerialize.fromJSON(json.textureCoordinates),
    });
    return result ? instance.clone(result) : instance;
  }
}
