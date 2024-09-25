import type { JulianDate, Property } from 'cesium';
import { CallbackProperty, ConstantProperty } from 'cesium';
import { isDef, isFunction } from './is';

export type MaybeProperty<T = any> = T | { getValue: (time: JulianDate) => T };

export type MaybePropertyOrGetter<T = any> = MaybeProperty<T> | (() => T);

/**
 * Is Cesium.Property
 * @param value - The target object
 */
export function isProperty(value: any): value is Property {
  return value && isFunction(value.getValue);
}

/**
 * Converts a value that may be a Property into its target value, @see {toProperty} for the reverse operation
 * ```typescript
 * toPropertyValue('val') //=> 'val'
 * toPropertyValue(new ConstantProperty('val')) //=> 'val'
 * toPropertyValue(new CallbackProperty(()=>'val')) //=> 'val'
 * ```
 *
 * @param value - The value to convert
 */
export function toPropertyValue<T = any>(value: MaybeProperty<T>, time?: JulianDate): T {
  return isProperty(value) ? value.getValue(time as any) : value;
}

export type PropertyCallback<T = any> = (time: JulianDate, result?: T) => T;

/**
 * Converts a value that may be a Property into a Property object, @see {toPropertyValue} for the reverse operation
 *
 * @param value - The property value or getter to convert, can be undefined or null
 * @param isConstant - The second parameter for converting to CallbackProperty
 * @returns Returns the converted Property object, if value is undefined or null, returns undefined
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
