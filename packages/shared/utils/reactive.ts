import { toRaw, toValue } from 'vue';

import type { MaybeRef } from 'vue';

import { isFunction, isPromise } from './is';

export type OnAsyncGetterCancel = (onCancel: () => void) => void;

export type MaybeAsyncGetter<T> = () => Promise<T> | T;
export type MaybeRefOrAsyncGetter<T> = MaybeRef<T> | MaybeAsyncGetter<T>;

export interface ToAsyncValueOptions {
  /**
   * If true, the source will be unwrapped to its raw value.
   * @default true
   */
  raw?: boolean;
}

/**
 * 类似Vue自带的`toValue`,但能处理异步函数，所以返回的值为一个Promise
 *
 * 配合VueUse的computedAsync使用
 *
 * @param source 源值，可以是响应式引用或异步获取器
 * @param options 转换选项
 *
 *
 * @example
 * ```ts
 *
 * const data = computedAsync(async ()=> {
 *  return await toAwaitedValue(promiseRef)
 * })
 *
 * ```
 */
export async function toAwaitedValue<T>(source: MaybeRefOrAsyncGetter<T>, options: ToAsyncValueOptions = {}): Promise<T> {
  const { raw = true } = options;

  let value: T;
  if (isFunction(source)) {
    value = await source();
  }
  else {
    const result = toValue(source);
    value = isPromise(result) ? await result : result;
  }
  return raw ? toRaw(value) : value;
}
