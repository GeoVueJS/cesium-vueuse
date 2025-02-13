import type { AnyFn } from './types';

const toString = Object.prototype.toString;

export function isDef<T = any>(val?: T): val is T {
  return typeof val !== 'undefined';
}

export function isBoolean(val: any): val is boolean {
  return typeof val === 'boolean';
}

export function isFunction<T extends AnyFn>(val: any): val is T {
  return typeof val === 'function';
}

export function isNumber(val: any): val is number {
  return typeof val === 'number';
}

export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

export function isObject(val: any): val is object {
  return toString.call(val) === '[object Object]';
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && toString.call(val) === '[object Window]';
}

export function isPromise<T extends Promise<any>>(val: any): val is T {
  return !!val && (typeof val === 'object' || typeof val === 'function') && typeof (val as any).then === 'function';
}

export function isElement<T extends Element>(val: any): val is T {
  return !!(val && val.nodeName && val.nodeType === 1);
}

export const isArray = Array.isArray;

export function isBase64(val: string): boolean {
  // eslint-disable-next-line regexp/no-unused-capturing-group, regexp/no-super-linear-backtracking
  const reg = /^\s*data:([a-z]+\/[\d+.a-z-]+(;[a-z-]+=[\da-z-]+)?)?(;base64)?,([\s\w!$%&'()*+,./:;=?@~-]*?)\s*$/i;
  return reg.test(val);
}

export function assertError(condition: boolean, error: any) {
  if (condition) {
    throw new Error(error);
  }
}
