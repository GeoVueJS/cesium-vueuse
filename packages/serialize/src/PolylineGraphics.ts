import type { JulianDate } from 'cesium';
import type { ArcTypeJSON } from './ArcType';
import type { Cartesian3JSON } from './Cartesian3';
import type { ClassificationTypeJSON } from './ClassificationType';
import type { DistanceDisplayConditionJSON } from './DistanceDisplayCondition';
import type { MaterialPropertyJSON } from './MaterialProperty';
import type { ShadowModeJSON } from './ShadowMode';
import { isHasValue, toPropertyValue } from '@cesium-vueuse/shared';
import { PolylineGraphics } from 'cesium';
import { ArcTypeSerialize } from './ArcType';
import { Cartesian3Serialize } from './Cartesian3';
import { ClassificationTypeSerialize } from './ClassificationType';
import { DistanceDisplayConditionSerialize } from './DistanceDisplayCondition';
import { MaterialPropertySerialize } from './MaterialProperty';

import { ShadowModeSerialize } from './ShadowMode';

export interface PolylineGraphicsJSON {
  show?: boolean;
  positions?: Cartesian3JSON[];
  width?: number;
  granularity?: number;
  material?: MaterialPropertyJSON;
  depthFailMaterial?: MaterialPropertyJSON;
  arcType?: ArcTypeJSON;
  clampToGround?: boolean;
  shadows?: ShadowModeJSON;
  distanceDisplayCondition?: DistanceDisplayConditionJSON;
  classificationType?: ClassificationTypeJSON;
  zIndex?: number;
}

/**
 * Serialize a `PolylineGraphics` instance to JSON and deserialize from JSON
 */
export class PolylineGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is PolylineGraphics {
    return value instanceof PolylineGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PolylineGraphics, time?: JulianDate): PolylineGraphicsJSON | undefined {
    if (isHasValue(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        positions: toPropertyValue(instance.positions, time)?.map((item: any) => Cartesian3Serialize.toJSON(item)),
        width: toPropertyValue(instance.width, time),
        granularity: toPropertyValue(instance.granularity, time),
        material: MaterialPropertySerialize.toJSON(toPropertyValue(instance.material, time)),
        depthFailMaterial: MaterialPropertySerialize.toJSON(toPropertyValue(instance.depthFailMaterial, time)),
        arcType: ArcTypeSerialize.toJSON(toPropertyValue(instance.arcType, time)),
        clampToGround: toPropertyValue(instance.clampToGround, time),
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
  static fromJSON(json?: PolylineGraphicsJSON, result?: PolylineGraphics): PolylineGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new PolylineGraphics({
      show: json.show,
      positions: json.positions?.map(item => Cartesian3Serialize.fromJSON(item)!),
      width: json.width,
      granularity: json.granularity,
      material: MaterialPropertySerialize.fromJSON(json.material),
      depthFailMaterial: MaterialPropertySerialize.fromJSON(json.depthFailMaterial),
      arcType: ArcTypeSerialize.fromJSON(json.arcType),
      clampToGround: json.clampToGround,
      shadows: ShadowModeSerialize.fromJSON(json.shadows),
      distanceDisplayCondition: DistanceDisplayConditionSerialize.fromJSON(json.distanceDisplayCondition),
      classificationType: ClassificationTypeSerialize.fromJSON(json.classificationType),
      zIndex: json.zIndex,
    });
    return result ? instance.clone(result) : instance;
  }
}
