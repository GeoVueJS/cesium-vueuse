import type { Event, JulianDate, Property } from 'cesium';
import { CallbackProperty, ConstantProperty, defined } from 'cesium';
import { isFunction } from './is';

export type MaybeProperty<T = any> = T | { getValue: (time?: JulianDate) => T };

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
export function toPropertyValue<T = unknown>(value: MaybeProperty<T>, time?: JulianDate): T {
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
export function toProperty<T>(value?: MaybePropertyOrGetter<T>, isConstant = false): Property {
  return isProperty(value)
    ? value
    : isFunction(value)
      ? (new CallbackProperty(value, isConstant) as any)
      : new ConstantProperty(value);
}

/**
 * Create a Cesium property key
 *
 * @param scope The host object
 * @param field The property name
 * @param maybeProperty Optional property or getter
 * @param readonly Whether the property is read-only
 */
export function createPropertyField<T>(
  scope: any,
  field: string,
  maybeProperty?: MaybePropertyOrGetter<T>,
  readonly?: boolean,
) {
  let removeOwnerListener: VoidFunction | undefined;
  // 自身内部变化时也触发载体的`definitionChanged`
  // Trigger the carrier's `definitionChanged` when its own internal state changes
  const ownerBinding = (value: any) => {
    removeOwnerListener?.();
    if (defined(value?.definitionChanged)) {
      removeOwnerListener = value?.definitionChanged?.addEventListener(() => {
        scope.definitionChanged.raiseEvent(scope, field, value, value);
      });
    }
  };

  const privateField = `_${field}`;
  const property = toProperty(maybeProperty);
  scope[privateField] = property;
  ownerBinding(property);

  if (readonly) {
    Object.defineProperty(scope, field, {
      get() {
        return scope[privateField];
      },
    });
  }
  else {
    Object.defineProperty(scope, field, {
      get() {
        return scope[privateField];
      },
      set(value) {
        const previous = scope[privateField];
        if (scope[privateField] !== value) {
          scope[privateField] = value;
          ownerBinding(value);
          if (defined(scope.definitionChanged)) {
            scope.definitionChanged.raiseEvent(scope, field, value, previous);
          }
        }
      },
    });
  }
}

export interface CreateCesiumAttributeOptions {
  readonly?: boolean;
  toProperty?: boolean;
  /**
   * The event name that triggers the change
   * @default 'definitionChanged'
   */
  changedEventKey?: string;

  shallowClone?: boolean;
}

export function createCesiumAttribute<Scope extends object>(
  scope: Scope,
  key: keyof Scope,
  value: any,
  options: CreateCesiumAttributeOptions = {},
) {
  const allowToProperty = !!options.toProperty;
  const shallowClone = !!options.shallowClone;
  const changedEventKey = options.changedEventKey || 'definitionChanged';
  const changedEvent = Reflect.get(scope, changedEventKey) as Event;
  const privateKey = `_${String(key)}`;
  const attribute = allowToProperty ? toProperty(value) : value;
  Reflect.set(scope, privateKey, attribute);

  const obj: any = {
    get() {
      const value = Reflect.get(scope, privateKey);
      if (shallowClone) {
        return Array.isArray(value) ? [...value] : { ...value };
      }
      else {
        return value;
      }
    },
  };

  let previousListener: VoidFunction | undefined;

  const serial = (property: Property, previous?: any) => {
    previousListener?.();
    previousListener = property?.definitionChanged?.addEventListener(() => {
      changedEvent?.raiseEvent.bind(changedEvent)(scope, key, property, previous);
    });
  };

  if (!options.readonly) {
    // 初始化是父子级绑定监听
    if (allowToProperty && isProperty(value)) {
      serial(value);
    }

    obj.set = (value: any) => {
      if (allowToProperty && !isProperty(value)) {
        throw new Error(`The value of ${String(key)} must be a Cesium.Property object`);
      }
      const previous = Reflect.get(scope, privateKey);

      if (previous !== value) {
        Reflect.set(scope, privateKey, value);
        changedEvent?.raiseEvent.bind(changedEvent)(scope, key, value, previous);
        if (allowToProperty) {
          // 重新绑定监听
          serial(value);
        }
      }
    };
  }

  Object.defineProperty(scope, key, obj);
}

export interface CreateCesiumPropertyOptions {
  readonly?: boolean;
  /**
   * The event name that triggers the change
   * @default 'definitionChanged'
   */
  changedEventKey?: string;
}
export function createCesiumProperty<Scope extends object>(
  scope: Scope,
  key: keyof Scope,
  value: any,
  options: CreateCesiumPropertyOptions = {},
) {
  return createCesiumAttribute(scope, key, value, { ...options, toProperty: true });
}
