import type { Cartesian3JSON } from './Cartesian3';
import { isHasValue } from '@cesium-vueuse/shared';
import { PolygonHierarchy } from 'cesium';

import { Cartesian3Serialize } from './Cartesian3';

export interface PolygonHierarchyJSON {
  positions: Cartesian3JSON[];
  holes: PolygonHierarchyJSON[];
}

/**
 * Serialize a `PolygonHierarchy` instance to JSON and deserialize from JSON
 */
export class PolygonHierarchySerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is PolygonHierarchy {
    return value instanceof PolygonHierarchy;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PolygonHierarchy): PolygonHierarchyJSON | undefined {
    if (isHasValue(instance)) {
      return {
        positions: instance.positions.map((item: any) => Cartesian3Serialize.toJSON(item)!),
        holes: instance.holes.map((item: any) => PolygonHierarchySerialize.toJSON(item)!),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PolygonHierarchyJSON, result?: PolygonHierarchy): PolygonHierarchy | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new PolygonHierarchy(
      json.positions?.map(item => Cartesian3Serialize.fromJSON(item)!),
      json.holes?.map(item => PolygonHierarchySerialize.fromJSON(item)!),
    );
    if (!result) {
      return instance;
    }
    result.positions = instance.positions;
    result.holes = instance.holes;
    return result;
  }
}
