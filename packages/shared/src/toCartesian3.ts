import type { CommonCoord } from './types';
import { Cartesian3, Cartographic, Ellipsoid } from 'cesium';

/**
 * Converts position to a coordinate point in the Cartesian coordinate system
 *
 * @param position Position information, which can be a Cartesian coordinate point (Cartesian3), a geographic coordinate point (Cartographic), an array, or an object containing WGS84 latitude, longitude, and height information
 * @returns The converted Cartesian coordinate point. If the input parameter is invalid, undefined is returned
 */
export function toCartesian3(position?: CommonCoord): Cartesian3 | undefined {
  if (!position) {
    return undefined;
  }
  if (position instanceof Cartesian3) {
    return position.clone();
  }
  else if (position instanceof Cartographic) {
    return Ellipsoid.WGS84.cartographicToCartesian(position);
  }
  else if (Array.isArray(position)) {
    return Cartesian3.fromDegrees(position[0], position[1], position[2]);
  }
  else {
    return Cartesian3.fromDegrees(position.longitude, position.latitude, (position as any).height);
  }
}
