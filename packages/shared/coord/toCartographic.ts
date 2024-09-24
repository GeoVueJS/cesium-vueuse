import type { CommonCoord } from './types';

import { Cartesian3, Cartographic, Ellipsoid } from 'cesium';
/**
 * 将位置转换为地理坐标系坐标点(Cartographic)
 *
 * @param position 位置信息，可以是笛卡尔坐标系坐标点(Cartesian3)、地理坐标系坐标点(Cartographic)、数组或者包含wgs84经纬度和高度信息的对象
 * @returns 转换后的笛卡尔坐标系坐标点，若传入的参数无效则返回undefined
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
