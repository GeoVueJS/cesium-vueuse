import { isPromise } from '@cesium-vueuse/shared';
import { tryOnScopeDispose } from '@vueuse/core';
import { shallowReadonly } from 'vue';

import type { ShallowReactive } from 'vue';

export type EffcetRemovePredicate<T> = (instance: T) => boolean;

/**
 * useCollectionScope 返回参数
 */
export interface UseCollectionScopeReturn<
  T,
  AddArgs extends any[],
  AddReturn extends T | Promise<T>,
  RemoveArgs extends any[],
  RemoveReturn = any,
> {
  /**
   * 储存此次副作用的添加值 该值使用`ShallowReactive`进行封装，具有Vue响应式功能
   */
  scope: Readonly<ShallowReactive<Set<T>>>;
  add: <R extends T>(i: R, ...args: AddArgs) => AddReturn extends Promise<T> ? Promise<R> : R;
  remove: (i: T, ...args: RemoveArgs) => RemoveReturn;
  removeWhere: (predicate: EffcetRemovePredicate<T>, ...args: RemoveArgs) => void;
  removeScope: (...args: RemoveArgs) => void;
}

/**
 * CesiumCollection相关副作用范围化
 * @param addFn - 副作用函数 如: entites.add
 * @param removeFn - 清除副作用函数  如: entities.remove
 */
export function useCollectionScope<
  T,
  AddArgs extends any[],
  AddReturn extends T | Promise<T>,
  RemoveArgs extends unknown[],
  RemoveReturn = any,
>(
  addFn: (i: T, ...args: AddArgs) => AddReturn,
  removeFn: (i: T, ...args: RemoveArgs) => RemoveReturn,
  clearArgs: RemoveArgs,
): UseCollectionScopeReturn<T, AddArgs, AddReturn, RemoveArgs, RemoveReturn> {
  const scope = new Set<T>();

  const add: any = (instance: T, ...args: AddArgs) => {
    const result = addFn(instance, ...args);
    // 可能为promise 如dataSource
    if (isPromise(result)) {
      return new Promise<T>((resolve, reject) => {
        result.then((i) => {
          scope.add(i);
          resolve(i);
        }).catch(error => reject(error));
      });
    }
    else {
      scope.add(result as T);
      return result;
    }
  };

  const remove = (instance: T, ...args: RemoveArgs) => {
    scope.delete(instance);
    return removeFn(instance, ...args);
  };

  const removeWhere = (predicate: EffcetRemovePredicate<T>, ...args: RemoveArgs) => {
    scope.forEach((instance) => {
      if (predicate(instance)) {
        remove(instance, ...args);
      }
    });
  };

  const removeScope = (...args: RemoveArgs) => {
    scope.forEach((instance) => {
      remove(instance, ...args);
    });
  };

  tryOnScopeDispose(() => removeScope(...clearArgs));

  return {
    scope: shallowReadonly(scope),
    add,
    remove,
    removeWhere,
    removeScope,
  };
}
