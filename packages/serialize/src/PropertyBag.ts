import type { JulianDate } from 'cesium';
import { isHasValue } from '@cesium-vueuse/shared';

import { PropertyBag } from 'cesium';

export interface PropertyBagJSON {
  propertyNames: string[];
  content: Record<string, any>;
}

/**
 * Serialize a `PropertyBag` instance to JSON and deserialize from JSON
 */
export class PropertyBagSerialize {
  private constructor() {}

  /**
   * Predicate whether the given value is the target instance
   */
  static predicate(value: any): value is PropertyBag {
    return value instanceof PropertyBag;
  };

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: PropertyBag, time?: JulianDate): PropertyBagJSON | undefined {
    if (isHasValue(instance)) {
      return {
        propertyNames: instance.propertyNames,
        content: instance.propertyNames.reduce((key, content) => {
          content[key] = instance[key]?.getValue(time);
          return content;
        }, {} as Record<string, any>),
      };
    }
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   * @param result - Used to store the resulting instance. If not provided, a new instance will be created
   */
  static fromJSON(json?: PropertyBagJSON, result?: PropertyBag): PropertyBag | undefined {
    if (!json) {
      return undefined;
    }
    if (result) {
      result.propertyNames.forEach(key => result.removeProperty(key));
    }
    const instance = result ?? new PropertyBag();
    json.propertyNames.forEach(key => instance.addProperty(key, json.content[key]));
    return instance ? instance.clone(result) : instance;
  }
}
