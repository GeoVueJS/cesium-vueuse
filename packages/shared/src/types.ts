import type { Cartesian3, Cartographic, Cesium3DTileset, CustomDataSource, CzmlDataSource, DataSource, GeoJsonDataSource, GpxDataSource, KmlDataSource, Primitive, PrimitiveCollection } from 'cesium';

export type Nullable<T> = T | null | undefined;

export type BasicType = number | string | boolean | symbol | bigint | null | undefined;

export type ArgsFn<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

export type AnyFn = (...args: any[]) => any;

export type MaybePromise<T = any> = T | (() => T) | Promise<T> | (() => Promise<T>);

/**
 * 2D Coordinate System
 */
export type CoordArray = [longitude: number, latitude: number];

/**
 * 3D Coordinate System
 */
export type CoordArray_ALT = [longitude: number, latitude: number, height?: number];

/**
 * 2D Coordinate System
 */
export interface CoordObject { longitude: number; latitude: number }

/**
 * 3D Coordinate System
 */
export interface CoordObject_ALT { longitude: number; latitude: number; height?: number }

/**
 * Common Coordinate
 * Can be a Cartesian3 point, a Cartographic point, an array, or an object containing longitude, latitude, and optional height information
 */
export type CommonCoord = Cartesian3 | Cartographic | CoordArray | CoordArray_ALT | CoordObject | CoordObject_ALT;

/**
 * Common DataSource
 */
export type CesiumDataSource = DataSource | CustomDataSource | CzmlDataSource | GeoJsonDataSource | GpxDataSource | KmlDataSource;

// TODO   all primitive type in cesium
export type CesiumPrimitive = Primitive | PrimitiveCollection | Cesium3DTileset | any;
