import type { CommonCoord, CoordArray, CoordArray_ALT, CoordObject, CoordObject_ALT } from './types';
import { Cartesian3, Cartographic, Ellipsoid, Math } from 'cesium';

interface ToCoordOptions<T extends 'Array' | 'Object', Alt extends boolean> {
  /**
   * Return type
   * @default 'Array'
   */
  type?: T;

  /**
   * Whether to return altitude information
   */
  alt?: Alt;

}

export type ToCoordReturn<T extends 'Array' | 'Object', Alt extends boolean> =
 T extends 'Array' ?
   Alt extends true ?
     CoordArray_ALT :
     CoordArray
   : Alt extends true ?
     CoordObject_ALT
     : CoordObject;

/**
 * Converts coordinates to an array or object in the specified format.
 *
 * @param position The coordinate to be converted, which can be a Cartesian3, Cartographic, array, or object.
 * @param options Conversion options, including conversion type and whether to include altitude information.
 * @returns The converted coordinate, which may be an array or object. If the input position is empty, undefined is returned.
 *
 * @template T Conversion type, optional values are 'Array' or 'Object', @default 'Array'.
 * @template Alt Whether to include altitude information, default is false
 */
export function toCoord<T extends 'Array' | 'Object' = 'Array', Alt extends boolean = false>(
  position?: CommonCoord,
  options: ToCoordOptions<T, Alt> = {},
): ToCoordReturn<T, Alt> | undefined {
  if (!position) {
    return undefined;
  }

  const { type = 'Array', alt = false } = options;

  let longitude: number, latitude: number, height: number | undefined;

  if (position instanceof Cartesian3) {
    const cartographic = Ellipsoid.WGS84.cartesianToCartographic(position);
    longitude = Math.toDegrees(cartographic.longitude);
    latitude = Math.toDegrees(cartographic.latitude);
    height = cartographic.height;
  }
  else if (position instanceof Cartographic) {
    const cartographic = position;
    longitude = Math.toDegrees(cartographic.longitude);
    latitude = Math.toDegrees(cartographic.latitude);
    height = cartographic.height;
  }
  else if (Array.isArray(position)) {
    longitude = Math.toDegrees(position[0]);
    latitude = Math.toDegrees(position[1]);
    height = position[2];
  }
  else {
    longitude = (position.longitude);
    latitude = (position.latitude);
    height = (position as any).height;
  }

  if (type === 'Array') {
    return alt ? [longitude, latitude, height] : [longitude, latitude] as any;
  }
  else {
    return alt ? { longitude, latitude, height } : { longitude, latitude } as any;
  }
}
