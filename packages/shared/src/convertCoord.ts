import type { Cartesian2, Cartesian3, Scene } from 'cesium';
import { Ellipsoid } from 'cesium';

/**
 * Convert canvas coordinates to Cartesian coordinates
 *
 * @param canvasCoord Canvas coordinates
 * @param scene Cesium.Scene instance
 * @param mode optional values are 'pickPosition' | 'globePick' | 'auto' | 'noHeight'  @default 'auto'
 *
 * `pickPosition`: Use scene.pickPosition for conversion, which can be used for picking models, oblique photography, etc.
 * However, if depth detection is not enabled (globe.depthTestAgainstTerrain=false), picking terrain or inaccurate issues may occur
 *
 * `globePick`: Use camera.getPickRay for conversion, which cannot be used for picking models or oblique photography,
 * but can be used for picking terrain. If terrain does not exist, the picked elevation is 0
 *
 * `auto`: Automatically determine which picking content to return
 *
 * Calculation speed comparison: globePick > auto >= pickPosition
 */
export function canvasCoordToCartesian(
  canvasCoord: Cartesian2,
  scene: Scene,
  mode: 'pickPosition' | 'globePick' | 'auto' = 'auto',
): Cartesian3 | undefined {
  if (mode === 'pickPosition') {
    return scene.pickPosition(canvasCoord);
  }
  else if (mode === 'globePick') {
    const ray = scene.camera.getPickRay(canvasCoord);
    return ray && scene.globe.pick(ray, scene);
  }
  else {
    // depth test
    if (scene.globe.depthTestAgainstTerrain) {
      return scene.pickPosition(canvasCoord);
    }
    const position1 = scene.pickPosition(canvasCoord);
    const ray = scene.camera.getPickRay(canvasCoord);
    const position2 = ray && scene.globe.pick(ray, scene);
    if (!position1) {
      return position2;
    }
    const height1 = (position1 && Ellipsoid.WGS84.cartesianToCartographic(position1).height) ?? 0;
    const height2 = (position2 && Ellipsoid.WGS84.cartesianToCartographic(position2).height) ?? 0;
    return height1 < height2 ? position1 : position2;
  }
}

/**
 * Convert Cartesian coordinates to canvas coordinates
 *
 * @param position Cartesian coordinates
 * @param scene Cesium.Scene instance
 */
export function cartesianToCanvasCoord(position: Cartesian3, scene: Scene): Cartesian2 {
  return scene.cartesianToCanvasCoordinates(position);
}
