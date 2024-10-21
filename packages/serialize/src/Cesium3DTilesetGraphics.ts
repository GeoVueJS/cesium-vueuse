import type { JulianDate, Resource } from 'cesium';
import { isHasValue, toPropertyValue } from '@cesium-vueuse/shared';

import { Cesium3DTilesetGraphics } from 'cesium';

export interface Cesium3DTilesetGraphicsJSON {
  show?: boolean;
  uri?: string | Resource;
  maximumScreenSpaceError?: number;
}

/**
 * Serialize a `Cesium3DTilesetGraphics` instance to JSON and deserialize from JSON
 */
export class Cesium3DTilesetGraphicsSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is Cesium3DTilesetGraphics {
    return value instanceof Cesium3DTilesetGraphics;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: Cesium3DTilesetGraphics, time?: JulianDate): Cesium3DTilesetGraphicsJSON | undefined {
    if (isHasValue(instance)) {
      return {
        show: toPropertyValue(instance.show, time),
        uri: toPropertyValue(instance.uri, time),
        maximumScreenSpaceError: toPropertyValue(instance.maximumScreenSpaceError, time),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: Cesium3DTilesetGraphicsJSON, result?: Cesium3DTilesetGraphics): Cesium3DTilesetGraphics | undefined {
    if (!json) {
      return undefined;
    }
    const instance = new Cesium3DTilesetGraphics({
      show: json.show,
      uri: json.uri,
      maximumScreenSpaceError: json.maximumScreenSpaceError,
    });
    return result ? instance.clone(result) : instance;
  }
}
