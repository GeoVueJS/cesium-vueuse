import type { Cartesian3, Cartographic } from 'cesium';

/**
 * 二维坐标系
 */
export type CoordArray = [longitude: number, latitude: number];

/**
 * 三维坐标系
 */
export type CoordArray_ALT = [longitude: number, latitude: number, height?: number];

/**
 * 二维坐标系
 */
export interface CoordObject { longitude: number; latitude: number }

/**
 * 三维坐标系
 */
export interface CoordObject_ALT { longitude: number; latitude: number; height?: number }

/**
 * 任意坐标
 * 可以是笛卡尔坐标系坐标点(Cartesian3)、地理坐标系坐标点(Cartographic)、数组或者包含经纬度和高度信息的对象
 */
export type CommonCoord = Cartesian3 | Cartographic | CoordArray | CoordArray_ALT | CoordObject | CoordObject_ALT;
