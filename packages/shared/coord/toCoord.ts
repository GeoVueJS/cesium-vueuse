import type { CommonCoord, CoordArray, CoordArray_ALT, CoordObject, CoordObject_ALT } from './types';

import { Cartesian3, Cartographic, Ellipsoid, Math } from 'cesium';

interface ToCoordOptions<T extends 'Array' | 'Object', Alt extends boolean> {
  /**
   * 返回类型
   * @default 'Array'
   */
  type?: T;

  /**
   * 是否返回高程信息
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
 * 将坐标转换为指定格式的数组或对象。
 *
 * @param position 待转换的坐标，可以是 Cartesian3、Cartographic、数组或对象。
 * @param options 转换选项，包括转换类型和是否包含高程信息。
 * @returns 转换后的坐标，可能是数组或对象，如果传入的 position 为空，则返回 undefined。
 *
 * @template T 转换类型，可选值为 'Array' 或 'Object'，默认为 'Array'。
 * @template Alt 是否包含高程信息，默认为 false
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
