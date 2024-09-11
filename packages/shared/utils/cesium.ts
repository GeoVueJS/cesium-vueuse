import { CallbackProperty, ConstantProperty, CustomDataSource, CzmlDataSource, GeoJsonDataSource, GpxDataSource, KmlDataSource } from 'cesium';

import type { DataSource, JulianDate, Property } from 'cesium';

import { isDef, isFunction } from './is';

export type CesiumDataSource = CustomDataSource | GeoJsonDataSource | CzmlDataSource | KmlDataSource | GpxDataSource | DataSource;

export function isDatasource(value: any): value is CesiumDataSource {
  return value instanceof CustomDataSource
    || value instanceof GeoJsonDataSource
    || value instanceof CzmlDataSource
    || value instanceof KmlDataSource
    || value instanceof GpxDataSource;
}

export type MaybeProperty<T = any> = T | { getValue: (time: JulianDate) => T };

export type MaybePropertyOrGetter<T = any> = MaybeProperty<T> | (() => T);

/**
 * 是否是Cesium.Property
 * @param value - 目标对象
 */
export function isProperty(value: any): value is Property {
  return value && isFunction(value.getValue);
}

/**
 * 将可能是Property的值转换成目标值，@see {toProperty} 可进行反转
 * ```typescript
 * toPropertyValue('val') //=> 'val'
 * toPropertyValue(new ConstantProperty('val')) //=> 'val'
 * toPropertyValue(new CallbackProperty(()=>'val')) //=> 'val'
 * ```
 *
 * @param value - 要转换的值
 */
export function toPropertyValue<T = any>(value: MaybeProperty<T>, time?: JulianDate): T {
  return isProperty(value) ? value.getValue(time as any) : value;
}

export type PropertyCallback<T = any> = (time: JulianDate, result?: T) => T;

/**
 * 将可能是Property的值转换成目标值，@see {toPropertyValue} 可进行反转
 *
 * @param value 待转换的属性值或获取器，可以为 undefined 或 null
 * @param isConstant - 此项为转换成CallbackProperty的第二个参数
 * @returns 返回转换后的 Property 对象，如果 value 为 undefined 或 null，则返回 undefined
 */
export function toProperty<T>(value?: MaybePropertyOrGetter<T>, isConstant = false): Property | undefined {
  return !isDef(value)
    ? undefined
    : isProperty(value)
      ? value
      : isFunction(value)
        ? (new CallbackProperty(value, isConstant) as any)
        : new ConstantProperty(value);
}
