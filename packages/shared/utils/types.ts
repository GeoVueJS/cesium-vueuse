export type Nullable<T> = T | null | undefined;

export type BasicType = number | string | boolean | symbol | bigint | null | undefined;

export type ArgsFn<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

export type AnyFn = (...args: any[]) => any;

export type MaybePromise<T = any> = T | (() => T) | Promise<T> | (() => Promise<T>);
