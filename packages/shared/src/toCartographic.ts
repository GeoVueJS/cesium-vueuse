import type { CommonCoord } from './types';
import { Cartesian3, Cartographic, Ellipsoid } from 'cesium';

/**
 * Converts a position to a Cartographic coordinate point
 *
 * @param position Position information, which can be a Cartesian3 coordinate point, a Cartographic coordinate point, an array, or an object containing WGS84 longitude, latitude, and height information
 * @returns The converted Cartographic coordinate point, or undefined if the input parameter is invalid
 */
export function toCartographic(position?: CommonCoord): Cartographic | undefined {
  if (!position) {
    return undefined;
  }
  if (position instanceof Cartesian3) {
    return Ellipsoid.WGS84.cartesianToCartographic(position);
  }
  else if (position instanceof Cartographic) {
    return position.clone();
  }
  else if (Array.isArray(position)) {
    return Cartographic.fromDegrees(position[0], position[1], position[2]);
  }
  else {
    return Cartographic.fromDegrees(position.longitude, position.latitude, (position as any).height);
  }
}
