import type { ClippingPlaneJSON } from './ClippingPlane';
import type { ColorJSON } from './Color';

import type { Matrix4JSON } from './Matrix4';
import { notNullish } from '@vueuse/core';
import { ClippingPlaneCollection } from 'cesium';
import { ClippingPlaneSerialize } from './ClippingPlane';
import { ColorSerialize } from './Color';
import { Matrix4Serialize } from './Matrix4';

export interface ClippingPlaneCollectionJSON {
  planes: ClippingPlaneJSON[];
  enabled: boolean;
  modelMatrix: Matrix4JSON;
  unionClippingRegions: boolean;
  edgeColor: ColorJSON;
  edgeWidth: number;
}

/**
 * Serialize a `ClippingPlaneCollection` instance to JSON and deserialize from JSON
 */
export class ClippingPlaneCollectionSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is ClippingPlaneCollection {
    return value instanceof ClippingPlaneCollection;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: ClippingPlaneCollection): ClippingPlaneCollectionJSON | undefined {
    if (notNullish(instance)) {
      const planes = Array.of({ length: instance.length }).map((_, i) => instance.get(i));
      return {
        planes: planes.map(item => ClippingPlaneSerialize.toJSON(item)!),
        enabled: instance.enabled,
        modelMatrix: Matrix4Serialize.toJSON(instance.modelMatrix)!,
        unionClippingRegions: instance.unionClippingRegions,
        edgeColor: ColorSerialize.toJSON(instance.edgeColor)!,
        edgeWidth: instance.edgeWidth,
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   */
  static fromJSON(json?: ClippingPlaneCollectionJSON, result?: ClippingPlaneCollection): ClippingPlaneCollection | undefined {
    if (!json) {
      return undefined;
    }
    const planes = json.planes.map(item => ClippingPlaneSerialize.fromJSON(item)!);
    const instance = new ClippingPlaneCollection({
      planes: json.planes.map(item => ClippingPlaneSerialize.fromJSON(item)!),
      enabled: json.enabled,
      modelMatrix: Matrix4Serialize.fromJSON(json.modelMatrix)!,
      unionClippingRegions: json.unionClippingRegions,
      edgeColor: ColorSerialize.fromJSON(json.edgeColor)!,
      edgeWidth: json.edgeWidth,
    });
    if (!result) {
      return instance;
    }
    result.enabled = instance.enabled;
    result.modelMatrix = instance.modelMatrix;
    result.unionClippingRegions = instance.unionClippingRegions;
    result.edgeColor = instance.edgeColor;
    result.edgeWidth = instance.edgeWidth;
    result.removeAll();
    planes.forEach(item => result.add(item));
    return result;
  }
}
