import type { CommonCoord } from './types';
import { Cartesian3, Cartographic, Ellipsoid } from 'cesium';

/**
 * 将位置转换为笛卡尔坐标系中的坐标点
 *
 * @param position 位置信息，可以是笛卡尔坐标系坐标点(Cartesian3)、地理坐标系坐标点(Cartographic)、数组或者包含wgs84经纬度和高度信息的对象
 * @returns 转换后的笛卡尔坐标系坐标点，若传入的参数无效则返回undefined
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
